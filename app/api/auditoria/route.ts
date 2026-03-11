import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sendLeadToMetaCAPI } from '@/utils/meta-capi';

// Verifica si existe la API Key de Resend (para no romper en local si no está)
const resendToken = process.env.RESEND_API_KEY;
const resend = resendToken ? new Resend(resendToken) : null;

// Cliente Admin de Supabase para poder insertar sin estar autenticado/anon.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nombre, email, whatsapp, presupuesto, rama, respuestas } = data;

    // 1. Guardamos el Lead en Supabase para que aparezca en el Pipeline de Radar
    const { data: insertedLead, error: insertError } = await supabaseAdmin
      .from('leads')
      .insert({
        nombre: nombre || 'Prospecto Web',
        email: email,
        whatsapp: whatsapp,
        estado: 'ready_to_contact',
        pipeline_stage: 'radar',
        puntaje_oportunidad: 85,
        source_data: {
          source: 'auditoria_funnel',
          presupuesto,
          rama,
          respuestas
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      throw new Error("No se pudo guardar el lead en la base de datos.");
    }

    // 2. INYECCIÓN A META (CAPI)
    // Extraemos headers para telemetría de Meta
    const headersList = await headers();
    
    // No usamos await aquí para no bloquear la respuesta al usuario (como pediste)
    sendLeadToMetaCAPI({
      email: email,
      phone: whatsapp,
      firstName: nombre,
      presupuesto: 0, 
      userAgent: headersList.get('user-agent') || '',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1'
    }).catch(err => console.error("Meta CAPI Error (Background):", err));

    // 3. Registrar notificación en base de datos para auditoría
    const notificationMessage = `Nuevo lead desde auditoría: ${nombre}`;
    await supabaseAdmin.from('sales_notifications').insert({
      type: 'hot_lead',
      lead_id: insertedLead.id,
      message: notificationMessage,
      context: {
        source: 'auditoria_tecnica',
        email,
        whatsapp,
        rama,
        presupuesto
      },
      status: 'pending'
    });

    // 4. Enviamos alerta por Correo a los administradores si Resend está configurado
    if (resend) {
      const recipients = ['dgonzalez.tagle@gmail.com', 'gaston.jofre1995@gmail.com'];

      try {
        const { error: resendError } = await resend.emails.send({
          from: 'Hojacero <contacto@hojacero.cl>',
          to: recipients,
          subject: `🚨 NUEVO LEAD HIGH-TICKET: ${nombre} - Auditoría`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 12px; color: #111;">
              <h2 style="color: #0891b2;">Nuevo prospecto capturado</h2>
              <p>Se ha recibido una nueva solicitud de auditoría técnica con alto potencial.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${nombre}</p>
                <p style="margin: 5px 0;"><strong>Rama:</strong> ${rama === 'app' ? 'Software/App' : rama === 'noweb' ? 'No tiene Web' : 'Ya tiene Web'}</p>
                <p style="margin: 5px 0;"><strong>Correo:</strong> <a href="mailto:${email}">${email}</a></p>
                <p style="margin: 5px 0;"><strong>WhatsApp:</strong> <a href="https://wa.me/${whatsapp?.replace(/[^0-9]/g, '')}">${whatsapp}</a></p>
                <p style="margin: 5px 0;"><strong>Presupuesto:</strong> ${presupuesto}</p>
              </div>
              
              <h3 style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Respuestas del Quiz:</h3>
              <ul style="font-size: 14px; color: #444; background: #fff; padding: 15px 15px 15px 35px; border-radius: 8px; border: 1px solid #f3f4f6;">
                ${Object.entries(respuestas || {}).map(([key, value]) => `<li style="margin-bottom: 8px;"><strong>${key}:</strong> ${value}</li>`).join('')}
              </ul>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://www.hojacero.cl/dashboard/pipeline" style="display: inline-block; background: #0891b2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(8, 145, 178, 0.2);">
                  Ver en el Pipeline Radar
                </a>
              </div>
            </div>
          `
        });

        if (resendError) {
          console.error("Resend delivery error:", resendError);
        } else {
          // Actualizamos estado de notificación si el envío fue exitoso
          await supabaseAdmin.from('sales_notifications')
            .update({ status: 'sent', sent_at: new Date().toISOString() })
            .eq('lead_id', insertedLead.id);
        }

      } catch (err) {
        console.error("Critical Resend Error:", err);
      }
    } else {
      console.log("⚠️ No se envió el correo porque falta la variable de entorno RESEND_API_KEY");
    }

    return NextResponse.json({ success: true, leadId: insertedLead.id });
  } catch (error: any) {
    console.error('Error procesando lead auditoria:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
