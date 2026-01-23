import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente admin para operaciones del bot (sin cookies de usuario)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * API para notificar a Daniel cuando se detecta un lead de alto valor
 * (Enterprise, alta facturación, o urgencia detectada)
 */

interface NotificationPayload {
    type: 'enterprise_lead' | 'hot_lead' | 'meeting_booked';
    leadId?: string;
    sessionId?: string;
    message: string;
    context?: any;
}

export async function POST(req: NextRequest) {
    const payload: NotificationPayload = await req.json();

    try {
        // 1. Log the notification to database
        const { error: logError } = await supabase.from('sales_notifications').insert({
            type: payload.type,
            lead_id: payload.leadId,
            session_id: payload.sessionId,
            message: payload.message,
            context: payload.context,
            status: 'pending',
            created_at: new Date().toISOString()
        });

        if (logError) {
            console.error('Failed to log notification:', logError);
        }

        // 2. Determine who should receive the notification (Marketing vs Dev)
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const DANIEL_EMAIL = 'dgonzalez.tagle@gmail.com'; // Dev/Technical
        const GASTON_EMAIL = 'gaston.jofre@gmail.com'; // Marketing/Sales

        // Detect if it's a marketing or dev question based on context
        const contextText = `${payload.message} ${JSON.stringify(payload.context || {})}`.toLowerCase();

        const marketingKeywords = ['seo', 'marketing', 'publicidad', 'ads', 'google ads', 'facebook', 'instagram',
            'redes sociales', 'contenido', 'branding', 'marca', 'posicionamiento', 'leads', 'ventas', 'clientes',
            'campaña', 'landing', 'conversión', 'embudo', 'funnel', 'estrategia'];

        const devKeywords = ['código', 'programación', 'desarrollo', 'backend', 'frontend', 'api', 'base de datos',
            'servidor', 'hosting', 'ssl', 'wordpress', 'react', 'next', 'javascript', 'php', 'python',
            'bug', 'error', 'crash', 'lento', 'velocidad', 'ttfb', 'performance', 'técnico', 'integración'];

        const marketingScore = marketingKeywords.filter(k => contextText.includes(k)).length;
        const devScore = devKeywords.filter(k => contextText.includes(k)).length;

        // Default to Daniel for technical, Gastón for marketing/sales
        // If unclear, send to Daniel
        const recipientEmail = marketingScore > devScore ? GASTON_EMAIL : DANIEL_EMAIL;
        const recipientName = marketingScore > devScore ? 'Gastón' : 'Daniel';

        console.log(`📧 Routing to ${recipientName} (mkt:${marketingScore} vs dev:${devScore})`);

        // 3. Send email notification via Resend
        if (RESEND_API_KEY) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'H0 Bot <bot@hojacero.cl>',
                    to: [recipientEmail],
                    subject: getSubject(payload.type),
                    html: buildEmailHtml(payload, recipientName)
                })
            });
        }

        return NextResponse.json({ success: true, routedTo: recipientName });

    } catch (error: any) {
        console.error('Notification error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

function getSubject(type: string): string {
    switch (type) {
        case 'enterprise_lead': return '🏢 Lead Enterprise Detectado - Acción Inmediata';
        case 'hot_lead': return '🔥 Lead Caliente en el Chat';
        case 'meeting_booked': return '📅 Nueva Reunión Agendada';
        default: return '🔔 Notificación del Bot H0';
    }
}

function buildEmailHtml(payload: NotificationPayload, recipientName: string = 'Daniel'): string {
    return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <h2 style="color: #0891b2; margin-bottom: 20px;">
            ${payload.type === 'enterprise_lead' ? '🏢 Lead Enterprise Detectado' :
            payload.type === 'hot_lead' ? '🔥 Lead Caliente' :
                '📅 Reunión Agendada'}
        </h2>
        
        <p style="color: #71717a; margin-bottom: 16px;">Hola ${recipientName}, te llega esto porque el bot necesita tu ayuda:</p>
        
        <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0; color: #18181b; font-size: 16px;">
                ${payload.message}
            </p>
        </div>
        
        ${payload.context ? `
        <div style="border-left: 3px solid #0891b2; padding-left: 16px; margin-bottom: 20px;">
            <p style="color: #71717a; font-size: 14px; margin: 0;">
                <strong>Contexto:</strong><br/>
                ${JSON.stringify(payload.context, null, 2).replace(/\n/g, '<br/>')}
            </p>
        </div>
        ` : ''}
        
        <a href="https://hojacero.cl/dashboard/pipeline" 
           style="display: inline-block; background: #0891b2; color: white; 
                  padding: 12px 24px; border-radius: 8px; text-decoration: none; 
                  font-weight: bold;">
            Ver en Dashboard
        </a>
        
        <p style="color: #a1a1aa; font-size: 12px; margin-top: 20px;">
            — Bot H0 (Sistema Automático)
        </p>
    </div>
    `;
}
