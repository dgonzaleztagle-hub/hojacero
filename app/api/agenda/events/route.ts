import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

async function sendMeetingEmail(event: any) {
    // if (!event.attendee_email) return; // Permitir notificar sin email del cliente (usa el del admin)

    const dateStr = new Date(event.start_time).toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });

    try {
        await resend.emails.send({
            from: 'Agenda Hojacero <contacto@hojacero.cl>',
            to: ['dgonzaleztagle@gmail.com', 'Gaston.jofre1995@gmail.com'],
            subject: `🔔 NUEVA REUNIÓN: ${event.title}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #0891b2; font-size: 24px;">¡Hay una nueva reunión agendada!</h1>
                    <p style="color: #444; font-size: 16px;">Se ha registrado un nuevo evento en la agenda desde ${event.source === 'chat_bot' ? 'el Bot H0' : 'el Dashboard'}.</p>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0;"><strong>👤 Cliente:</strong> ${event.attendee_name || 'No especificado'}</p>
                        <p style="margin: 0 0 10px 0;"><strong>🏢 Empresa:</strong> ${event.company_name || 'No especificada'}</p>
                        <p style="margin: 0 0 10px 0;"><strong>📱 WhatsApp:</strong> ${event.whatsapp || event.attendee_phone || 'No especificado'}</p>
                        <p style="margin: 0 0 10px 0;"><strong>🌐 Sitio:</strong> ${event.website || 'No especificado'}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
                        <p style="margin: 0 0 10px 0;"><strong>📅 Evento:</strong> ${event.title}</p>
                        <p style="margin: 0 0 10px 0;"><strong>⏰ Fecha:</strong> ${dateStr}</p>
                        ${event.location ? `<p style="margin: 0 0 10px 0;"><strong>📍 Lugar:</strong> ${event.location}</p>` : ''}
                        ${event.description ? `<p style="margin: 15px 0 0 0; color: #666; font-style: italic;">"${event.description}"</p>` : ''}
                    </div>

                    <p style="color: #444; line-height: 1.6;">Revisa los detalles completos en tu Dashboard de HojaCero.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-weight: bold; color: #111; margin-bottom: 5px;">Hojacero</p>
                        <p style="font-size: 12px; color: #666; margin: 0;">Agencia de Diseño y Desarrollo Web</p>
                        <a href="https://hojacero.cl" style="font-size: 12px; color: #0891b2; text-decoration: none;">www.hojacero.cl</a>
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error('Error sending meeting email:', e);
        return false;
    }
}


// Helper to get admin client (lazy init to avoid build errors)
function getAdminClient() {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// GET: Lista eventos (con filtros opcionales)
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);

    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const eventType = searchParams.get('type');

    let query = supabase.from('agenda_events').select('*, leads(nombre, sitio_web)').order('start_time', { ascending: true });

    if (startDate) {
        query = query.gte('start_time', startDate);
    }
    if (endDate) {
        query = query.lte('end_time', endDate);
    }
    if (eventType) {
        query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, events: data });
}

// POST: Crear evento
export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        title, description, event_type, start_time, end_time,
        attendee_name, attendee_email, attendee_phone,
        whatsapp, website, company_name, status,
        lead_id, location, notes, meeting_notes, assigned_to,
        source, send_reminder_email
    } = body;

    // Usar cliente admin si viene del bot (no tiene cookies de usuario)
    const supabase = source === 'chat_bot' ? getAdminClient() : await createClient();

    if (!title || !start_time || !end_time) {
        return NextResponse.json({ success: false, error: 'Faltan campos requeridos (title, start_time, end_time)' }, { status: 400 });
    }

    const { data, error } = await supabase.from('agenda_events').insert({
        title,
        description,
        event_type: event_type || 'meeting',
        start_time,
        end_time,
        attendee_name,
        attendee_email,
        attendee_phone,
        whatsapp: whatsapp || attendee_phone,
        website,
        company_name,
        lead_id,
        location,
        notes,
        meeting_notes,
        assigned_to: assigned_to || 'daniel',
        source: source || 'manual',
        status: status || 'pending',
        send_reminder_email: send_reminder_email || false
    }).select().single();

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (send_reminder_email) {
        await sendMeetingEmail(data);
    }

    return NextResponse.json({ success: true, event: data });
}

// PATCH: Actualizar evento
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ success: false, error: 'Se requiere ID del evento' }, { status: 400 });
    }

    const { data, error } = await supabase.from('agenda_events').update({
        ...updates,
        updated_at: new Date().toISOString()
    }).eq('id', id).select().single();

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (updates.send_reminder_email) {
        await sendMeetingEmail(data);
    }

    return NextResponse.json({ success: true, event: data });
}

// DELETE: Eliminar evento
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ success: false, error: 'Se requiere ID del evento' }, { status: 400 });
    }

    const { error } = await supabase.from('agenda_events').delete().eq('id', id);

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Evento eliminado' });
}
