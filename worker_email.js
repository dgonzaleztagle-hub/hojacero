export default {
    async email(message, env, ctx) {
        const subject = message.headers.get("subject") || "(Sin asunto)"
        const sender = message.from
        const recipient = message.to

        let rawContent = ""
        try { rawContent = await new Response(message.raw).text() } catch (e) { }

        // Usamos fetch directo a Supabase para no depender de librerías externas
        const url = `${env.SUPABASE_URL}/rest/v1/email_inbox`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                sender: sender,
                recipient: recipient,
                subject: subject,
                body_text: rawContent
            })
        })

        // Notificación vía Resend
        if (response.ok && env.RESEND_API_KEY) {
            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Inbox Bot <bot@hojacero.cl>',
                        to: ['dgonzalez.tagle@gmail.com', 'Gaston.jofre1995@gmail.com', 'contacto@hojacero.cl'],
                        subject: `[INBOX] Nuevo Mensaje de: ${sender}`,
                        html: `
                            <h2>Nuevo correo en el Inbox de HojaCero</h2>
                            <p><strong>De:</strong> ${sender}</p>
                            <p><strong>Para:</strong> ${recipient}</p>
                            <p><strong>Asunto:</strong> ${subject}</p>
                            <br/>
                            <a href="https://hojacero.cl/dashboard/inbox" style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Leer en el Dashboard</a>
                        `
                    })
                });
            } catch (error) {
                console.error("Error enviando notificación por Resend:", error);
            }
        }

        if (!response.ok) {
            console.log("Error Supabase:", await response.text())
            message.setReject("Error interno")
        }
    },

    async fetch(req) {
        return new Response("¡Hojacero Inbox (Sin Dependencias) Activo! 🚀")
    }
}
