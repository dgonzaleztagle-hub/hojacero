import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy fallback for build/types

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

        const { to, subject, html, text, attachments } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Hojacero <contacto@hojacero.cl>',
            to: [to],
            // 🚨 ALERTA TÁCTICA: Copia oculta a los fundadores
            bcc: ['dgonzaleztagle@gmail.com', 'Gaston.jofre1995@gmail.com'],
            subject: subject,
            html: html,
            text: text,
            attachments: attachments
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
