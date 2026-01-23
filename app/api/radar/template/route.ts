import { NextResponse } from 'next/server';

// ===========================================
// GENERADOR DE TEMPLATES - HOJACERO
// Modelo: gpt-4o-mini (OpenAI)
// ===========================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { leadData, type, author } = await req.json();

        if (!OPENAI_API_KEY && !GROQ_API_KEY) {
            return NextResponse.json({ error: 'Falta configurar API de IA' }, { status: 500 });
        }

        // Configurar Firma Dinámica
        const isGaston = author === 'Gaston';
        const signatureEmail = isGaston
            ? "Gaston Jofre\nCo-Founder & Business Lead\nHojaCero.cl"
            : "Daniel Gonzalez\nFounder & Lead Architect\nHojaCero.cl";

        const signatureWhatsapp = isGaston
            ? "Gaston - HojaCero.cl"
            : "Daniel - HojaCero.cl";

        // Datos del Lead
        const businessName = leadData.title || 'el negocio';
        const painPoints = leadData.analysis?.salesStrategy?.painPoints?.join(', ') || '';
        const hook = leadData.analysis?.salesStrategy?.hook || '';
        const hasWebsite = !!leadData.website;

        // Activos Generados
        const pdfUrl = leadData.pdf_url;
        const demoUrl = leadData.demo_url;

        let assetContext = '';
        if (pdfUrl) assetContext += `- Tienes una auditoría PDF lista: ${pdfUrl}\n`;
        if (demoUrl) assetContext += `- Tienes una Demo diseñada: ${demoUrl}\n`;

        // PROMPTS según tipo
        let prompt = '';

        if (type === 'whatsapp') {
            prompt = `Escribe un mensaje de WhatsApp corto y efectivo para "${businessName}".

OBJETIVO: Conseguir una respuesta. No vender, generar curiosidad.

ACTIVOS DISPONIBLES:
${assetContext || '- No hay activos generados aún'}

CONTEXTO:
- Tiene web: ${hasWebsite ? 'Sí (posiblemente mejorable)' : 'NO (oportunidad grande)'}
- Dolores detectados: ${painPoints || 'Oportunidad de crecimiento digital'}
- Hook sugerido: ${hook || 'Mejora de imagen profesional'}

ESTRUCTURA:
1. Saludo breve + "Estuve viendo ${businessName}..."
2. El gancho (lo que observaste)
3. La prueba (link de demo/PDF si existe)
4. Cierre suave: "¿Te lo mando?" o "¿Te parece si te cuento más?"

REGLAS:
- MÁXIMO 50 palabras
- Tono semiformal, seguro, "nosotros lo resolvemos"
- Sin jerga técnica (nada de SEO, responsive, backend)
- Máximo 1 emoji
- Firma: "${signatureWhatsapp}"

Responde SOLO el mensaje.`;
        } else {
            prompt = `Escribe un cold email profesional para "${businessName}".

OBJETIVO: Que abran el link o respondan.

ACTIVOS:
${assetContext || '- No hay activos generados aún'}

CONTEXTO:
- Hook sugerido: ${hook || 'Mejora de imagen profesional'}
- Dolores: ${painPoints || 'Oportunidad digital'}
- Tiene web: ${hasWebsite ? 'Sí' : 'No'}

ESTRUCTURA:
1. Asunto corto e intrigante (ej: "¿Idea para ${businessName}?")
2. Salutation personal
3. "Estaba buscando [rubro] en Chile y vi su negocio..."
4. El problema (sutilmente)
5. La solución (tu demo/PDF o propuesta)
6. CTA suave: "¿Vale la pena conversarlo 5 min?"

REGLAS:
- Tono semiformal, seguro, profesional pero cercano
- Párrafos cortos, fácil de leer en móvil
- NADA de "espero que estés bien" o frases de relleno
- Vende el SIGUIENTE PASO, no el servicio completo
- Firma: "${signatureEmail}"

Responde SOLO el cuerpo del email (incluye el asunto en la primera línea como "Asunto: ...").`;
        }

        // API Call
        const apiUrl = OPENAI_API_KEY
            ? 'https://api.openai.com/v1/chat/completions'
            : 'https://api.groq.com/openai/v1/chat/completions';

        const apiKey = OPENAI_API_KEY || GROQ_API_KEY;
        const model = OPENAI_API_KEY ? 'gpt-4o-mini' : 'llama-3.3-70b-versatile';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: 'system',
                        content: type === 'whatsapp'
                            ? 'Eres un estratega de ventas B2B experto en WhatsApp. Escribes mensajes cortos e imposibles de ignorar. Tono semiformal y seguro.'
                            : 'Eres el mejor copywriter de cold emails. Escribes correos que parecen personales, no marketing corporativo. Tono semiformal y profesional.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: type === 'whatsapp' ? 150 : 300
            })
        });

        if (!response.ok) {
            throw new Error('Error en la API de IA');
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();

        return NextResponse.json({ success: true, message: content });

    } catch (error: any) {
        console.error('Template API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
