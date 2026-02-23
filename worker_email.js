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

        // 2. Avisar a HojaCero (Next.js) para que nos mande el correo de notificación usando su propia config de Resend
        if (response.ok) {
            try {
                await fetch('https://hojacero.cl/api/inbox/notify', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sender: sender })
                });
            } catch (error) {
                console.error("Error avisando a Next.js:", error);
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
