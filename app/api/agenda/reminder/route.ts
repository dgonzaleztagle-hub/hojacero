import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Cliente admin para operaciones del cron
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapeo de emails por responsable
const TEAM_EMAILS: Record<string, string[]> = {
    daniel: ['dgonzaleztagle@gmail.com'],
    gaston: ['Gaston.jofre1995@gmail.com'],
    both: ['dgonzaleztagle@gmail.com', 'Gaston.jofre1995@gmail.com']
};

async function sendReminderEmail(event: any, recipients: string[]) {
    const startTime = new Date(event.start_time);
    const dateStr = startTime.toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
    const timeStr = startTime.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const minutesUntil = Math.round((startTime.getTime() - Date.now()) / 60000);

    try {
        await resend.emails.send({
            from: 'Agenda Hojacero <contacto@hojacero.cl>',
            to: recipients,
            subject: `⏰ RECORDATORIO: ${event.title} en ${minutesUntil} minutos`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h1 style="color: white; font-size: 24px; margin: 0;">⏰ Reunión en ${minutesUntil} minutos</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 15px 0; border: 1px solid #e5e7eb;">
                        <h2 style="color: #111; font-size: 20px; margin: 0 0 15px 0;">${event.title}</h2>
                        
                        <p style="margin: 8px 0; color: #444;">
                            <strong>📅 Fecha:</strong> ${dateStr}
                        </p>
                        <p style="margin: 8px 0; color: #444;">
                            <strong>⏰ Hora:</strong> ${timeStr}
                        </p>
                        ${event.company_name ? `<p style="margin: 8px 0; color: #444;"><strong>🏢 Empresa:</strong> ${event.company_name}</p>` : ''}
                        ${event.attendee_name ? `<p style="margin: 8px 0; color: #444;"><strong>👤 Cliente:</strong> ${event.attendee_name}</p>` : ''}
                        ${event.whatsapp ? `<p style="margin: 8px 0; color: #444;"><strong>📱 WhatsApp:</strong> <a href="https://wa.me/${event.whatsapp.replace(/\\D/g, '')}" style="color: #0891b2;">${event.whatsapp}</a></p>` : ''}
                        ${event.website ? `<p style="margin: 8px 0; color: #444;"><strong>🌐 Sitio:</strong> <a href="${event.website.startsWith('http') ? event.website : 'https://' + event.website}" style="color: #0891b2;">${event.website}</a></p>` : ''}
                        
                        ${event.notes ? `
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;" />
                        <p style="margin: 0; color: #666; font-style: italic;">"${event.notes}"</p>
                        ` : ''}
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="https://hojacero.cl/dashboard/agenda" style="display: inline-block; background: #0891b2; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Ver en Dashboard
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="font-weight: bold; color: #111; margin-bottom: 5px;">Hojacero</p>
                        <p style="font-size: 12px; color: #666; margin: 0;">Sistema de Agenda Automatizada</p>
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error('Error sending reminder email:', e);
        return false;
    }
}

// GET: Endpoint para cron - Busca reuniones próximas y envía reminders
export async function GET(req: NextRequest) {
    // Verificar token de seguridad (opcional pero recomendado)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        // Si hay secret configurado, verificar
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const in30min = new Date(now.getTime() + 30 * 60 * 1000);
    const in35min = new Date(now.getTime() + 35 * 60 * 1000);

    // Buscar reuniones que empiezan entre 30-35 min desde ahora y no han recibido reminder
    const { data: events, error } = await supabase
        .from('agenda_events')
        .select('*')
        .eq('status', 'pending')
        .eq('reminder_sent', false)
        .gte('start_time', in30min.toISOString())
        .lte('start_time', in35min.toISOString());

    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!events || events.length === 0) {
        return NextResponse.json({
            success: true,
            message: 'No hay reuniones próximas que necesiten reminder',
            checked_range: { from: in30min.toISOString(), to: in35min.toISOString() }
        });
    }

    const results = [];

    for (const event of events) {
        const assignedTo = event.assigned_to || 'both';
        const recipients = TEAM_EMAILS[assignedTo] || TEAM_EMAILS.both;

        const sent = await sendReminderEmail(event, recipients);

        if (sent) {
            // Marcar como enviado
            await supabase
                .from('agenda_events')
                .update({ reminder_sent: true })
                .eq('id', event.id);
        }

        results.push({
            event_id: event.id,
            title: event.title,
            start_time: event.start_time,
            assigned_to: assignedTo,
            reminder_sent: sent
        });
    }

    return NextResponse.json({
        success: true,
        message: `Procesados ${results.length} reminders`,
        results
    });
}
