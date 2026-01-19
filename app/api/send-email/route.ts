import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy fallback for build/types

export async function POST(request: Request) {
    try {
        const { to, subject, html, text } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Hojacero <contacto@hojacero.cl>',
            to: [to],
            subject: subject,
            html: html,
            text: text,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
