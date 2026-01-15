import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { leadData, type } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'Falta la API Key de Groq' }, { status: 500 });
        }

        // Datos comunes
        const businessName = leadData.title || 'el negocio';
        const painPoints = leadData.analysis?.salesStrategy?.painPoints?.join(', ') || '';
        const hook = leadData.analysis?.salesStrategy?.hook || '';
        const hasWebsite = !!leadData.website;

        // PROMPTS SEPARADOS según tipo
        let prompt = '';

        if (type === 'whatsapp') {
            // WhatsApp: CORTO PERO PROFESIONAL - 60-80 palabras
            prompt = `
Escribe un mensaje de WhatsApp CORTO pero PROFESIONAL (60-80 palabras, máximo 5 líneas) para contactar a "${businessName}".

CONTEXTO:
- ${hasWebsite ? 'Tiene página web pero puede mejorar su presencia digital' : 'No tiene página web actualmente'}
- Pain point detectado: ${painPoints || 'Oportunidad de mejorar presencia digital'}

ESTRUCTURA:
1. Saludo cordial con el nombre del negocio
2. Presentación breve (quién eres y qué haces en 1 línea)
3. Una observación específica sobre su negocio (sin jerga técnica)
4. Propuesta de valor clara (cómo puedes ayudarle)
5. Pregunta que invite a responder

REGLAS:
- Entre 60 y 80 palabras. Ni más corto ni más largo.
- Tono profesional pero cercano (no suenes como robot ni como niño)
- Usa máximo 2 emojis y solo si aportan
- NO menciones términos técnicos (nada de SSL, SEO, hosting)
- Enfócate en: más clientes, verse profesional, destacar de competidores
- Firma como "Daniel de HojaCero - Diseño Web"

Responde SOLO el mensaje, nada más.
`;
        } else {
            // Email: Completo pero enfocado en NEGOCIO, no técnico
            prompt = `
Escribe un email profesional pero cercano para contactar a "${businessName}".

CONTEXTO:
- ${hasWebsite ? 'Tiene página web' : 'No tiene página web'}
- Pain points: ${painPoints || 'Oportunidad de mejorar presencia digital'}
- Gancho sugerido: ${hook || ''}

ESTRUCTURA DEL EMAIL:
1. Saludo personalizado (usa el nombre del negocio)
2. Cómo los encontraste (Google Maps, buscando negocios del rubro)
3. UNA observación específica sobre oportunidad de mejora (NO técnica)
4. Qué podrían ganar: más clientes, verse más profesional, superar competencia
5. Propuesta suave de conversar (sin presión)
6. Despedida amigable

REGLAS:
- NO uses jerga técnica (nada de SSL, SEO, responsive, hosting, etc)
- Habla de RESULTADOS: más clientes, más ventas, verse profesional
- Largo ideal: 4-6 oraciones
- Tono: Profesional pero humano, como si hablaras con un conocido
- Firma como "Daniel - HojaCero" con "Agencia de Diseño Web"

Responde SOLO el cuerpo del email (sin "Asunto:" ni explicaciones).
`;
        }

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
                        content: type === 'whatsapp'
                            ? 'Eres un experto en mensajes de WhatsApp para ventas B2B. Escribes mensajes profesionales pero cercanos, de largo moderado (60-80 palabras). Nunca usas jerga técnica.'
                            : 'Eres un copywriter de emails de ventas. Escribes emails persuasivos enfocados en beneficios de negocio, nunca en jerga técnica.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: type === 'whatsapp' ? 200 : 400
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

