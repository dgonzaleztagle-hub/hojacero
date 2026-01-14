import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { leadData, type } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'Falta la API Key de Groq' }, { status: 500 });
        }

        const prompt = `
Eres un experto en ventas de la agencia "HojaCero". Tu objetivo es redactar un mensaje de contacto altamente personalizado y persuasivo.

DATOS DEL NEGOCIO:
- Nombre: ${leadData.title}
- Sitio Web: ${leadData.website || 'No tiene'}
- Pain Points: ${leadData.analysis?.salesStrategy?.painPoints?.join(', ') || 'Necesita una mejor presencia digital'}
- Oportunidad: ${leadData.analysis?.opportunity || 'Diseño Web / Marketing'}
- Gancho (Hook) IA: ${leadData.analysis?.salesStrategy?.hook || ''}

TIPO DE MENSAJE: ${type === 'whatsapp' ? 'WhatsApp (Directo, breve, amigable)' : 'Email (Profesional, estructurado, enfocado en valor)'}

INSTRUCCIONES:
1. Usa un tono cercano pero profesional.
2. Menciona específicamente un "pain point" o el gancho detectado.
3. Propón una solución rápida (ej: "vi que tu web no tiene SSL y eso asusta a los clientes" o "noté que no tienes web y tus competidores sí").
4. Incluye un llamado a la acción (CTA) claro y suave.
5. NO uses placeholders como [Nombre], usa "Daniel de HojaCero" como remitente.
6. Si es WhatsApp, usa Emojis de forma estratégica.

Responde SOLO con el cuerpo del mensaje, sin asuntos ni explicaciones adicionales.
`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un copywriter experto en ventas B2B para una agencia de diseño web.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error('Error en la API de Groq');
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();

        return NextResponse.json({ success: true, message: content });

    } catch (error: any) {
        console.error('Template API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
