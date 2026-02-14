import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy fallback for build/types
const isValidResendKey = (key?: string) => !!key && key !== 're_123' && key !== 're_123456789' && !key.toLowerCase().startsWith('placeholder');

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized: You must be logged in to send emails.' },
                { status: 401 }
            );
        }

        if (!isValidResendKey(process.env.RESEND_API_KEY)) {
            return NextResponse.json({
                error: 'Missing or invalid RESEND_API_KEY',
                requires: 'RESEND_API_KEY'
            }, { status: 503 });
        }

        const { to, subject, html, text, attachments } = await request.json();
        if (!to || !subject || (!html && !text)) {
            return NextResponse.json({
                error: 'Missing required fields',
                required: ['to', 'subject', 'html|text']
            }, { status: 400 });
        }

        const toValue = Array.isArray(to) ? String(to[0] || '').trim() : String(to).trim();
        const subjectValue = String(subject).trim();
        if (!toValue || !subjectValue) {
            return NextResponse.json({ error: 'Invalid to/subject values' }, { status: 400 });
        }

        // Non-blocking audit trail (if table does not exist, email flow continues).
        let auditId: string | null = null;
        const { data: auditInsert, error: auditInsertError } = await supabase
            .from('email_outbox')
            .insert([{
                user_id: user.id,
                recipient: toValue,
                subject: subjectValue,
                status: 'pending',
                payload: {
                    has_html: !!html,
                    has_text: !!text,
                    has_attachments: Array.isArray(attachments) ? attachments.length > 0 : !!attachments
                }
            }])
            .select('id')
            .single();

        if (!auditInsertError) {
            auditId = auditInsert?.id ?? null;
        } else {
            console.warn('[send-email] email_outbox audit insert skipped:', auditInsertError.message);
        }

        const { data, error } = await resend.emails.send({
            from: 'Hojacero <contacto@hojacero.cl>',
            to: [toValue],
            // 🚨 ALERTA TÁCTICA: Copia oculta a los fundadores
            bcc: ['dgonzaleztagle@gmail.com', 'Gaston.jofre1995@gmail.com'],
            subject: subjectValue,
            html: html,
            text: text,
            attachments: attachments
        });

        if (error) {
            if (auditId) {
                await supabase
                    .from('email_outbox')
                    .update({
                        status: 'failed',
                        error_message: error.message,
                        sent_at: new Date().toISOString()
                    })
                    .eq('id', auditId);
            }
            return NextResponse.json({ error }, { status: 500 });
        }

        if (auditId) {
            await supabase
                .from('email_outbox')
                .update({
                    status: 'sent',
                    provider_message_id: data?.id || null,
                    sent_at: new Date().toISOString()
                })
                .eq('id', auditId);
        }

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
