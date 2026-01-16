import { createClient } from '@/utils/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ========================
// SCRAPER: Extract contacts from website
// ========================
export async function scrapeContactInfo(websiteUrl: string): Promise<{
    emails: string[];
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    hasSSL: boolean;
    techStack: string[];
}> {
    const result = {
        emails: [] as string[],
        whatsapp: null as string | null,
        instagram: null as string | null,
        facebook: null as string | null,
        hasSSL: false,
        techStack: [] as string[],
    };

    if (!websiteUrl) return result;

    // Normalize URL - ensure it has a protocol
    let normalizedUrl = websiteUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
    }
    result.hasSSL = normalizedUrl.startsWith('https');


    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout (generous for Manual)

        const response = await fetch(normalizedUrl, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        clearTimeout(timeout);

        if (!response.ok) return result;

        const html = await response.text();

        // Extract emails (filter common false positives)
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = html.match(emailRegex) || [];
        result.emails = [...new Set(emails)]
            .filter(e => !e.includes('example') && !e.includes('wixpress') && !e.includes('sentry'))
            .slice(0, 3);

        // Extract WhatsApp
        const waRegex = /(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d+)/gi;
        const waMatch = waRegex.exec(html);
        if (waMatch) {
            result.whatsapp = waMatch[1];
        } else {
            // Try to find Chilean phone patterns near WhatsApp text
            const waTextRegex = /whatsapp[^0-9]*?(\+?56\s?\d[\d\s-]{7,})/gi;
            const waTextMatch = waTextRegex.exec(html);
            if (waTextMatch) {
                result.whatsapp = waTextMatch[1].replace(/[\s-]/g, '');
            }
        }

        // Extract Instagram
        const igRegex = /(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9_.]+)/gi;
        const igMatch = igRegex.exec(html);
        if (igMatch) result.instagram = igMatch[1];

        // Extract Facebook
        const fbRegex = /facebook\.com\/([a-zA-Z0-9.]+)/gi;
        const fbMatch = fbRegex.exec(html);
        if (fbMatch && !fbMatch[1].includes('sharer')) result.facebook = fbMatch[1];

        // Detect Tech Stack
        if (html.includes('wp-content') || html.includes('wordpress')) result.techStack.push('WordPress');
        if (html.includes('shopify')) result.techStack.push('Shopify');
        if (html.includes('wix.com')) result.techStack.push('Wix');
        if (html.includes('squarespace')) result.techStack.push('Squarespace');
        if (html.includes('webflow')) result.techStack.push('Webflow');
        if (html.includes('_next') || html.includes('__NEXT')) result.techStack.push('Next.js');
        if (html.includes('react')) result.techStack.push('React');
        if (html.includes('bootstrap')) result.techStack.push('Bootstrap');
        if (html.includes('elementor')) result.techStack.push('Elementor');

        return result;

    } catch (e: any) {
        console.warn(`⚠️ Scraper failed for ${websiteUrl}: ${e.message}`);
        return result;
    }
}

// ========================
// AI ANALYZER: Basic Radar Analysis (Vibe, Pain Points, Score)
// ========================
export async function analyzeLeadWithGroq(place: any, scraped: any) {
    if (!GROQ_API_KEY) {
        return {
            score: 10,
            scoreBreakdown: { sinWeb: 0, ratingBajo: 0, sinContactoDigital: 0, techObsoleta: 0, sinRedesSociales: 0 },
            vibe: 'Sin Configuración',
            opportunity: 'Configurar API Key',
            analysisReport: 'No se ha configurado la API Key de Groq.',
            salesStrategy: {
                hook: "Configurar sistema",
                painPoints: ["Falta API Key"],
                proposedSolution: "Contactar Admin",
                estimatedValue: "Bajo"
            },
            competitiveAnalysis: "N/A",
            recommendedChannel: "N/A"
        };
    }

    const techStackStr = scraped.techStack.length > 0 ? scraped.techStack.join(', ') : '';
    const contactsStr = [
        scraped.emails.length ? `Emails: ${scraped.emails.join(', ')}` : null,
        scraped.whatsapp ? `WhatsApp: +${scraped.whatsapp}` : null,
        scraped.instagram ? `Instagram: @${scraped.instagram}` : null
    ].filter(Boolean).join(', ');

    const prompt = `
    Eres un EXPERTO en Lead Qualification para la agencia "HojaCero" (Diseño Web, Apps y Marketing).
    Analiza este negocio y genera un reporte ACCIONABLE para el equipo comercial.
    
    DATOS DEL LEAD:
    - Negocio: ${place.title}
    - Categoría: ${place.category || 'No especificada'}
    - Rating Google: ${place.rating || 'Sin rating'} (${place.userRatingCount || 0} reseñas)
    - Sitio Web: ${place.website || 'NO TIENE - OPORTUNIDAD ALTA'}
    - Teléfono: ${place.phoneNumber || place.phone || 'No disponible'}
    - Dirección: ${place.address || 'No disponible'}
    - Contactos encontrados: ${contactsStr || 'Ninguno visible en web'}
    ${techStackStr ? `- Tecnología actual: ${techStackStr}` : ''}
    ${scraped.hasSSL ? '- Tiene SSL ✓' : '- SIN SSL - Problema de seguridad'}
    
    GENERA UN JSON con esta estructura EXACTA:
    {
      "score": [0-100, mayor = mejor oportunidad para HojaCero],
      "scoreBreakdown": {
        "sinWeb_o_WebDeficiente": [0-40, ALTO si no tiene web o es terrible/vieja],
        "ratingBajo_o_Nulo": [0-20],
        "sinContactoDigital": [0-15],
        "techObsoleta_o_Lenta": [0-40, MUY ALTO si es HTML viejo, carga lento, no responsive],
        "sinRedesSociales": [0-10]
      },
      "vibe": "[Profesional|Moderno|Desactualizado|Local|Premium]",
      "opportunity": "[Diseño Web|Rediseño|App Móvil|SEO|Reputación|Marketing Digital|Branding]",
      "analysisReport": "Análisis en español de 2-3 oraciones explicando POR QUÉ este lead es valioso",
      "salesStrategy": {
        "hook": "Gancho inicial para el primer contacto (1 oración persuasiva)",
        "painPoints": ["problema 1", "problema 2"],
        "proposedSolution": "Qué servicio específico ofrecer",
        "estimatedValue": "[Bajo|Medio|Alto|Premium]"
      },
      "competitiveAnalysis": "Breve análisis de qué está haciendo bien/mal vs su competencia",
      "recommendedChannel": "[Email|WhatsApp|Llamada|Visita]"
    }
    
    IMPORTANTE: 
    - CRITERIO DE SCORE: Un sitio web antiguo (HTML simple, diseño 2000s), NO responsive, lento o sin HTTPS es una OPORTUNIDAD CRÍTICA. El score DEBE ser > 90.
    - Si el negocio no tiene web, score > 85.
    - Si el negocio tiene una web moderna y rápida, el score bajará (ej: 20-40).
    - Sé CRÍTICO. Queremos vender Rediseño y Modernización. Si la web es fea, DILO. 
    - Score ALTO si NO tiene web, tiene rating bajo, o tech obsoleta
    - Sé específico en painPoints y hook - esto lo usará un vendedor real
    - El hook debe ser personalizado para ESE negocio específico
    `;

    try {
        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
                        content: 'Eres un experto en Lead Qualification. Responde SOLO con JSON válido, sin markdown ni explicaciones adicionales.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        return JSON.parse(content || '{}');
    } catch (e) {
        console.error("AI Analysis failed", e);
        // Fallback robust structure
        return {
            score: 0,
            scoreBreakdown: {},
            vibe: 'Error',
            salesStrategy: { hook: "Error en IA", painPoints: ["Error"], proposedSolution: "Revisar", estimatedValue: "Bajo" },
            analysisReport: "Error al conectar con Groq",
            competitiveAnalysis: "N/A",
            recommendedChannel: "N/A"
        };
    }
}
