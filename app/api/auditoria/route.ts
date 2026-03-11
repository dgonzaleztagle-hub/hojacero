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
      presupuesto: 0, // Podríamos parsear el presupuesto si fuera numérico
      userAgent: headersList.get('user-agent') || '',
      ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1'
    });

    // 3. Enviamos alerta por Correo a los administradores si Resend está configurado
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Acme <onboarding@resend.dev>', // Usando el dominio de pruebas por defecto
          to: ['info@hojacero.cl'], // <<-- Cambiar al correo de Gastón / tuyo en real
          subject: `🚨 NUEVO LEAD HIGH-TICKET: ${nombre} - Auditoría`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Nuevo prospecto capturado desde la Auditoría Técnica</h2>
              <p><strong>Nombre:</strong> ${nombre}</p>
              <p><strong>Rama Interesada:</strong> ${rama === 'app' ? 'Software/App' : rama === 'noweb' ? 'No tiene Web' : 'Ya tiene Web'}</p>
              <p><strong>Correo:</strong> ${email}</p>
              <p><strong>WhatsApp:</strong> ${whatsapp}</p>
              <p><strong>Rango de Presupuesto:</strong> ${presupuesto}</p>
              
              <hr style="margin: 20px 0;" />
              <h3>Respuestas del Quiz:</h3>
              <ul>
                ${Object.entries(respuestas).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
              </ul>
              
              <p style="margin-top:20px;"><a href="https://www.hojacero.cl/dashboard">Ver pipeline en Dashboard</a></p>
            </div>
          `
        });
      } catch (err) {
        console.error("Resend Error:", err);
      }
    } else {
      console.log("⚠️ No se envió el correo porque falta la variable de entorno RESEND_API_KEY");
    }

    return NextResponse.json({ success: true, lead: insertedLead });
  } catch (error: any) {
    console.error('Error procesando lead auditoria:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
