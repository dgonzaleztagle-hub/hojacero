import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const ALERT_HOURS_BEFORE = 2; // Send alert when task is due in 2 hours
const RECIPIENT_EMAIL = 'Gaston.jofre1995@gmail.com';

interface TaskAlert {
    id: string;
    title: string;
    category: string;
    due_datetime: string;
    client_name: string;
}

interface GrowthTaskRow {
    id: string;
    title: string;
    category: string;
    due_datetime: string;
    growth_clients?: { client_name?: string } | null;
}

export async function GET(request: Request) {
    // Initialize clients inside the handler to avoid build-time errors with env vars
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const now = new Date();
        const alertThreshold = new Date(now.getTime() + ALERT_HOURS_BEFORE * 60 * 60 * 1000);

        // Find tasks that:
        // 1. Are due within the next ALERT_HOURS_BEFORE hours
        // 2. Are not completed
        // 3. Haven't been alerted yet
        const { data: upcomingTasks, error: tasksError } = await supabase
            .from('growth_tasks')
            .select(`
                id,
                title,
                category,
                due_datetime,
                growth_clients!inner(client_name)
            `)
            .eq('status', 'pending')
            .eq('is_enabled', true)
            .eq('alert_sent', false)
            .lte('due_datetime', alertThreshold.toISOString())
            .gte('due_datetime', now.toISOString())
            .order('due_datetime', { ascending: true });

        if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            return NextResponse.json({ error: tasksError.message }, { status: 500 });
        }

        if (!upcomingTasks || upcomingTasks.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No alerts to send',
                checked_at: now.toISOString()
            });
        }

        // Format tasks for email
        const tasksForEmail: TaskAlert[] = (upcomingTasks as GrowthTaskRow[]).map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            due_datetime: t.due_datetime,
            client_name: t.growth_clients?.client_name || 'Cliente desconocido'
        }));

        // Build email HTML
        const taskListHtml = tasksForEmail.map(t => {
            const dueTime = new Date(t.due_datetime).toLocaleString('es-CL', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #333;">${t.client_name}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #333;">${t.title}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #333; text-transform: uppercase; font-size: 11px; color: #a855f7;">${t.category}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #333; color: #f59e0b;">${dueTime}</td>
                </tr>
            `;
        }).join('');

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Tareas Próximas - Growth Engine</title>
            </head>
            <body style="background-color: #09090b; color: #fafafa; font-family: system-ui, -apple-system, sans-serif; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border-radius: 16px; overflow: hidden; border: 1px solid #27272a;">
                    <div style="padding: 24px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                        <h1 style="margin: 0; font-size: 20px; color: white;">⏰ Tareas Próximas</h1>
                        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; color: white;">Tienes ${tasksForEmail.length} tarea(s) por vencer en las próximas ${ALERT_HOURS_BEFORE} horas</p>
                    </div>
                    <div style="padding: 24px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <thead>
                                <tr style="text-align: left; color: #71717a; font-size: 11px; text-transform: uppercase;">
                                    <th style="padding: 8px 12px;">Cliente</th>
                                    <th style="padding: 8px 12px;">Tarea</th>
                                    <th style="padding: 8px 12px;">Módulo</th>
                                    <th style="padding: 8px 12px;">Vence</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${taskListHtml}
                            </tbody>
                        </table>
                        <div style="margin-top: 24px; text-align: center;">
                            <a href="https://app.hojacero.cl/dashboard/growth" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver en Growth Engine</a>
                        </div>
                    </div>
                    <div style="padding: 16px 24px; background-color: #0a0a0a; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #52525b;">
                        Hojacero Growth Engine • Alerta automática
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send email
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Growth Engine <growth@hojacero.cl>',
            to: [RECIPIENT_EMAIL],
            bcc: ['dgonzaleztagle@gmail.com'],
            subject: `⏰ ${tasksForEmail.length} tarea(s) por vencer - Growth Engine`,
            html: emailHtml
        });

        if (emailError) {
            console.error('Error sending email:', emailError);
            return NextResponse.json({ error: emailError.message }, { status: 500 });
        }

        // Mark tasks as alerted
        const taskIds = tasksForEmail.map(t => t.id);
        await supabase
            .from('growth_tasks')
            .update({ alert_sent: true })
            .in('id', taskIds);

        return NextResponse.json({
            success: true,
            tasks_alerted: tasksForEmail.length,
            email_id: emailData?.id,
            checked_at: now.toISOString()
        });

    } catch (error) {
        console.error('Check alerts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
