import { NextResponse } from 'next/server';

// ===========================================
// GENERADOR DE TEMPLATES - HOJACERO
// Modelo: Groq (llama-3.1-8b-instant)
// ===========================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const isValidApiKey = (key?: string) => {
    if (!key) return false;
    const trimmed = key.trim();
    if (!trimmed) return false;
    if (trimmed === 're_123' || trimmed === 'sk_test') return false;
    if (trimmed.toLowerCase().startsWith('placeholder')) return false;
    return true;
};

export async function POST(req: Request) {
    try {
        const { leadData, type, author } = await req.json();

        const hasGroq = isValidApiKey(GROQ_API_KEY);
        if (!hasGroq) {
            return NextResponse.json({
                success: false,
                error: 'Missing API keys',
                missing: ['GROQ_API_KEY']
            }, { status: 503 });
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

        let content = '';
        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
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
                const raw = await response.text();
                throw new Error(`groq ${response.status}: ${raw.slice(0, 200)}`);
            }

            const data = await response.json();
            content = data.choices?.[0]?.message?.content?.trim() || '';
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'unknown error';
            throw new Error(`Groq failed: ${message}`);
        }

        if (!content) {
            throw new Error('Groq returned empty content');
        }

        return NextResponse.json({ success: true, message: content });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('Template API Error:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
