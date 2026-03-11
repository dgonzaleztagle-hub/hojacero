import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
    try {
        // Verificamos de forma segura que la petición viene de nuestro propio Worker usando la llave de Supabase como token
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { sender } = await request.json();

        if (!sender) {
            return NextResponse.json({ error: 'Falta el remitente' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Inbox Bot <contacto@hojacero.cl>',
            to: ['dgonzalez.tagle@gmail.com', 'gaston.jofre1995@gmail.com'],
            subject: `[INBOX] Nuevo Mensaje de: ${sender}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #4f46e5; margin-top: 0;">Tienes un nuevo correo en HojaCero</h2>
                    <p style="color: #374151; font-size: 16px;">Acabas de recibir un nuevo mensaje en el buzón proveniente de:</p>
                    <p style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-weight: bold; color: #111827;">${sender}</p>
                    <br/>
                    <a href="https://hojacero.cl/dashboard/inbox" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Ir al Buzón
                    </a>
                </div>
            `
        });

        if (error) {
            console.error('[INBOX NOTIFY] Error de Resend:', error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e) {
        console.error('[INBOX NOTIFY] Error interno:', e);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
