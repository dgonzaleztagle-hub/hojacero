import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { leadData, type } = await req.json();

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'Falta la API Key de Groq' }, { status: 500 });
        }

        // Datos del Lead
        const businessName = leadData.title || 'el negocio';
        const painPoints = leadData.analysis?.salesStrategy?.painPoints?.join(', ') || '';
        const hook = leadData.analysis?.salesStrategy?.hook || '';
        const hasWebsite = !!leadData.website;

        // Activos Generados (Hunter Assets)
        const pdfUrl = leadData.pdf_url;
        const demoUrl = leadData.demo_url;

        // Contexto de Activos
        let assetContext = '';
        if (pdfUrl) assetContext += `- TIENES una auditoría digital completa en PDF lista para enviar: ${pdfUrl}. Úsala como prueba de autoridad.\n`;
        if (demoUrl) assetContext += `- TIENES una Demo Premium ya diseñada para ellos: ${demoUrl}. Úsala como prueba visual irresistible.\n`;

        // PROMPTS SEPARADOS según tipo
        let prompt = '';

        if (type === 'whatsapp') {
            // WhatsApp: "The Nudge" Strategy (Short, value-packed, easy yes)
            prompt = `
Escribe un mensaje de WhatsApp DE ALTO IMPACTO (Hunter Mode) para "${businessName}".

OBJETIVO: Conseguir una respuesta rápida. No vender, sino generar curiosidad.

TUS ACTIVOS DISPONIBLES (ÚSALOS SI EXISTEN):
${assetContext}

CONTEXTO DEL CLIENTE:
- Estado Web: ${hasWebsite ? 'Tiene web (posiblemente mejorable)' : 'No tiene web (oportunidad crítica)'}
- Dolor Principal: ${painPoints || 'Oportunidad de crecimiento digital'}

ESTRUCTURA (HUNTER FRAMEWORK):
1. 👋 **Opener Personal:** Saludo breve + "Estuve revisando ${businessName}..."
2. 🎣 **The Hook (El Gancho):**
   - SI TIENES DEMO: "Creé un prototipo de cómo podría verse su nueva web..."
   - SI TIENES PDF: "Preparé un reporte con 3 errores que les están costando clientes..."
   - SI NO TIENES NADA: "Vi una oportunidad específica para que vendan más..."
3. 💎 **The Value (La Prueba):** Pega el LINK del PDF o Demo si existen. Si no, da un tip rápido.
4. ❓ **The Ask (Cierre de Baja Fricción):** "¿Te lo mando?" o "¿Te parece si te cuento más?" o "¿Le echarías un ojo?".

REGLAS DE ORO:
- MÁXIMO 60 palabras. Sé conciso. La gente no lee biblias en WhatsApp.
- NO suenes como vendedor desesperado. Suena como un consultor ocupado que regala valor.
- Cero jerga técnica (nada de "SEO", "Responsive", "Backend").
- Usa 1 emoji máximo si es necesario para suavizar el tono.
- Firma: "Daniel - HojaCero"

Responde SOLO el mensaje final.
`;
        } else {
            // Email: "Cold Email 2.0" Strategy (Personalized, Problem-Agitate-Solve)
            prompt = `
Escribe un COLD EMAIL de CLASE MUNDIAL (Hunter Mode) para "${businessName}".

OBJETIVO: Que abran el link o respondan "sí".

ACERCA DE TI (HUNTER):
Eres Daniel, de HojaCero. No eres una agencia de marketing genérica. Eres un "Arquitecto de Experiencias Digitales". Ayudas a negocios a dejar de perder dinero por tener webs feas o inexistentes.

TUS ARMAS (ACTIVOS):
${assetContext}

INFORMACIÓN DEL PROSPECTO:
- Gancho Sugerido: ${hook || 'Mejora de imagen profesional'}
- Dolores: ${painPoints}

ESTRUCTURA (COLD EMAIL 2.0):
1. **Asunto:** Corto, intrigante, personal. (Ej: "¿Idea para ${businessName}?", "Tu web", "Pregunta rápida").
2. **Salutation:** Personal.
3. **The 'Why You':** "Estaba buscando [Rubro] en [Ciudad] y vi su negocio..."
4. **The Problem (Agitate):** Menciona sutilmente lo que viste (web lenta, fea, o inexistente). "Vi que su web actual no refleja la calidad de su servicio..."
5. **The Solution (TUS ACTIVOS):**
   - SI TIENES DEMO: "Me tomé la libertad de diseñar una DEMO preliminar para mostrarles el potencial: [LINK_DEMO]"
   - SI TIENES PDF: "Preparé una auditoría técnica detallada sobre cómo arreglar esto: [LINK_PDF]"
   - SI NO TIENES NADA: "Tengo una idea específica para mejorar esto en 2 semanas."
6. **Call to Action (CTA):** Cierre suave. "¿Vale la pena conversarlo 5 minutos?" o "¿Te gustaría ver el resto?"

REGLAS DE ESTILO:
- Tono: Conversacional, directo, respetuoso pero con autoridad.
- Formato: Párrafos cortos. Mucho espacio en blanco. FÁCIL de leer en móvil.
- NO vendas el servicio. Vende el SIGUIENTE PASO (ver el demo / leer el reporte).
- NADA de palabras de relleno ("espero que estés bien", "somos una empresa líder").
- Firma: "Daniel - HojaCero"

Responde SOLO el cuerpo del email.
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
                            ? 'Eres un estratega de ventas B2B experto en WhatsApp. Tu superpoder es la brevedad y la persuasión. Escribe mensajes que ES IMPOSIBLE ignorar.'
                            : 'Eres el mejor copywriter de Cold Email del mundo. Escribes correos que se sienten escritos a mano, uno por uno. Odias el marketing corporativo aburrido.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: type === 'whatsapp' ? 250 : 500
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

