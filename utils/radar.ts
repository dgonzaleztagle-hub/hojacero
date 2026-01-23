import { createClient } from '@/utils/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ========================
// SCRAPER: Extract contacts from website + subpages
// ========================

// Helper: Extract data from HTML
function extractDataFromHtml(html: string, result: {
    emails: string[];
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    techStack: string[];
}) {
    // Extract emails (filter common false positives)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = html.match(emailRegex) || [];
    const newEmails = [...new Set(emails)]
        .filter(e => !e.includes('example') && !e.includes('wixpress') && !e.includes('sentry') && !e.includes('wordpress'));
    result.emails = [...new Set([...result.emails, ...newEmails])].slice(0, 5);

    // Extract WhatsApp (if not already found)
    if (!result.whatsapp) {
        const waRegex = /(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d+)/gi;
        const waMatch = waRegex.exec(html);
        if (waMatch) {
            result.whatsapp = waMatch[1];
        } else {
            // Try Chilean/LATAM phone patterns near WhatsApp text
            const waTextRegex = /whatsapp[^0-9]*?(\+?56\s?\d[\d\s-]{7,})/gi;
            const waTextMatch = waTextRegex.exec(html);
            if (waTextMatch) {
                result.whatsapp = waTextMatch[1].replace(/[\s-]/g, '');
            }
        }
    }

    // Extract Instagram (if not already found)
    if (!result.instagram) {
        const igRegex = /(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9_.]+)/gi;
        const igMatch = igRegex.exec(html);
        if (igMatch && !igMatch[1].includes('p/') && !igMatch[1].includes('reel')) {
            result.instagram = igMatch[1];
        }
    }

    // Extract Facebook (if not already found)
    if (!result.facebook) {
        const fbRegex = /facebook\.com\/([a-zA-Z0-9.]+)/gi;
        const fbMatch = fbRegex.exec(html);
        if (fbMatch && !fbMatch[1].includes('sharer') && !fbMatch[1].includes('share')) {
            result.facebook = fbMatch[1];
        }
    }

    // Detect Tech Stack
    if (html.includes('wp-content') || html.includes('wordpress')) {
        if (!result.techStack.includes('WordPress')) result.techStack.push('WordPress');
    }
    if (html.includes('shopify') && !result.techStack.includes('Shopify')) result.techStack.push('Shopify');
    if (html.includes('wix.com') && !result.techStack.includes('Wix')) result.techStack.push('Wix');
    if (html.includes('squarespace') && !result.techStack.includes('Squarespace')) result.techStack.push('Squarespace');
    if (html.includes('webflow') && !result.techStack.includes('Webflow')) result.techStack.push('Webflow');
    if ((html.includes('_next') || html.includes('__NEXT')) && !result.techStack.includes('Next.js')) result.techStack.push('Next.js');
    if (html.includes('react') && !result.techStack.includes('React')) result.techStack.push('React');
    if (html.includes('bootstrap') && !result.techStack.includes('Bootstrap')) result.techStack.push('Bootstrap');
    if (html.includes('elementor') && !result.techStack.includes('Elementor')) result.techStack.push('Elementor');
}

// Helper: Find contact subpages in HTML
function findContactPages(html: string, baseUrl: string): string[] {
    const contactPatterns = [
        /href=["']([^"']*(?:contacto|contact|about|nosotros|quienes-somos|acerca)[^"']*)["']/gi
    ];
    const found = new Set<string>();

    for (const pattern of contactPatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            let href = match[1];
            // Skip external links, anchors, and common non-page patterns
            if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') ||
                href.includes('facebook') || href.includes('instagram') || href.includes('twitter')) {
                continue;
            }
            // Convert relative to absolute
            if (href.startsWith('/')) {
                href = baseUrl + href;
            } else if (!href.startsWith('http')) {
                href = baseUrl + '/' + href;
            }
            // Only add if same domain
            try {
                const url = new URL(href);
                const base = new URL(baseUrl);
                if (url.hostname === base.hostname || url.hostname === 'www.' + base.hostname || base.hostname === 'www.' + url.hostname) {
                    found.add(href);
                }
            } catch { }
        }
    }

    return Array.from(found).slice(0, 3); // Max 3 subpages to avoid too many requests
}

export async function scrapeContactInfo(websiteUrl: string, fastMode: boolean = false): Promise<{
    emails: string[];
    whatsapp: string | null;
    instagram: string | null;
    facebook: string | null;
    hasSSL: boolean;
    techStack: string[];
    scrapedPages: string[];
}> {
    const result = {
        emails: [] as string[],
        whatsapp: null as string | null,
        instagram: null as string | null,
        facebook: null as string | null,
        hasSSL: false,
        techStack: [] as string[],
        scrapedPages: [] as string[],
    };

    if (!websiteUrl) return result;

    // Normalize URL
    let baseUrl = websiteUrl.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

    const urlsToTry = [
        `https://${baseUrl}`,
        `https://www.${baseUrl}`,
        `http://${baseUrl}`,
        `http://www.${baseUrl}`
    ];

    let successfulBaseUrl = '';
    let mainHtml = '';

    // Step 1: Intentar todas las variaciones de protocolo en PARALELO para ganar velocidad
    try {
        const fetchWithTimeout = async (url: string) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout (agresivo para evitar Vercel timeout)
            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                });
                clearTimeout(timeout);
                if (!response.ok) throw new Error('Not ok');
                const html = await response.text();
                return { url, html };
            } catch (e) {
                clearTimeout(timeout);
                throw e;
            }
        };

        // Ejecutamos todos en paralelo y nos quedamos con el primero que funcione
        const firstSuccess = await Promise.any(urlsToTry.map(url => fetchWithTimeout(url)));

        successfulBaseUrl = firstSuccess.url;
        mainHtml = firstSuccess.html;
        result.hasSSL = successfulBaseUrl.startsWith('https');
        result.scrapedPages.push(successfulBaseUrl);
        extractDataFromHtml(mainHtml, result);

    } catch (e) {
        console.warn(`⚠️ Scraper failed for ${websiteUrl}: No protocol variation worked.`);
        return result;
    }

    if (!successfulBaseUrl || fastMode) {
        if (!successfulBaseUrl) console.warn(`⚠️ Scraper failed for ${websiteUrl}: Could not reach site`);
        return result;
    }

    // Step 2: Find and scrape contact subpages
    const contactPages = findContactPages(mainHtml, successfulBaseUrl);

    // Also try common paths even if not found in links
    const commonPaths = ['/contacto', '/contact', '/nosotros', '/about'];
    for (const path of commonPaths) {
        const fullPath = successfulBaseUrl + path;
        if (!contactPages.includes(fullPath)) {
            contactPages.push(fullPath);
        }
    }

    // Scrape subpages (limit to 4 total to avoid delays)
    const subpagesToScrape = contactPages.slice(0, 4);

    await Promise.allSettled(subpagesToScrape.map(async (pageUrl) => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(pageUrl, {
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });
            clearTimeout(timeout);

            if (response.ok) {
                const html = await response.text();
                extractDataFromHtml(html, result);
                result.scrapedPages.push(pageUrl);
            }
        } catch { }
    }));

    return result;
}


// ========================
// AI ANALYZER: Basic Radar Analysis (Vibe, Pain Points, Score)
// ========================
export async function analyzeLeadWithGroq(place: any, scraped: any) {
    if (!GROQ_API_KEY) {
        return {
            score: 10,
            scoreBreakdown: { sinWeb: 0, ratingBajo: 0, sinContactoDigital: 0, techObsoleta: 0, sinRedesSociales: 0 },
            vibe: 'Debe Configurar IA',
            opportunity: 'Configurar API Key',
            analysisReport: 'Error de Configuración: La API de Inteligencia (Groq) no está configurada en el servidor. Contacta al administrador.',
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
    Eres un CONSULTOR ESTRATÉGICO de la agencia "HojaCero". Tu misión es analizar la presencia digital de un negocio con CRITERIO TÉCNICO REAL y HONESTIDAD.
    
    DATOS DEL LEAD:
    - Negocio: ${place.title}
    - Sitio Web: ${place.website || 'NO TIENE'}
    - Contactos: ${contactsStr || 'No visibles'}
    - Tecnología detectada: ${techStackStr || 'No identificada de forma clara'}
    - Seguridad: ${scraped.hasSSL ? 'HTTPS Activo ✓' : 'SIN SSL - Inseguro ⚠'}
    
    REGLAS DE EVALUACIÓN (CRÍTICO):
    1. SI la tecnología es "Next.js" o "React", el sitio es MODERNO. El score debe ser BAJO (10-30) a menos que falte el SSL o tenga un rating muy malo.
    2. SI ves "Designed by HOJACERO" o similar, el sitio es PERFECTO. Score: 0. Vibe: "Premium / HojaCero Masterpiece".
    3. NO inventes que el sitio es de la década de 2000 si tiene stack moderno.
    4. SÉ HONESTO: Si el sitio es muy bueno, diles "Tu sitio es increíble, felicitaciones". Busca oportunidades en otros lados (ej: ¿Necesitan una App? ¿Mejorar su SEO local?).
    5. Solo califica como "Desactualizado" si realmente ves tecnología vieja o falta de SSL/Responsive.

    ESTRUCTURA JSON EXACTA:
    {
      "score": [0-100, 0=Perfecto, 100=Urge Rediseño],
      "scoreBreakdown": {
        "sinWeb_o_WebDeficiente": [0-40],
        "ratingBajo_o_Nulo": [0-20],
        "sinContactoDigital": [0-15],
        "techObsoleta_o_Lenta": [0-40],
        "sinRedesSociales": [0-10]
      },
      "vibe": "[Premium|Moderno|Profesional|Local|Desactualizado|Inexistente]",
      "opportunity": "[Mantenimiento|SEO|App Móvil|Campaña Ads|Rediseño Crítico]",
      "analysisReport": "Análisis honesto de 2 oraciones. Si es bueno, elógialo. Si es malo, explica por qué objetivamente.",
      "salesStrategy": {
        "hook": "Un comentario inteligente (NO genérico) sobre su situación actual.",
        "painPoints": ["problema real 1", "problema real 2"],
        "proposedSolution": "Servicio que realmente aporte valor",
        "estimatedValue": "[Bajo|Medio|Alto|Premium]"
      },
      "competitiveAnalysis": "Comparativa realista",
      "recommendedChannel": "Canal sugerido"
    }
    `;

    try {
        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // Speed up discovery (previous 70B was too slow)
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
            analysisReport: "Error de Configuración: La API de Inteligencia no respondió o no está configurada.",
            competitiveAnalysis: "N/A",
            recommendedChannel: "N/A"
        };
    }
}

// ========================
// AI ANALYZER: OpenAI Version (gpt-4o-mini)
// Nuevo analizador optimizado para HojaCero
// ========================
export async function analyzeLeadWithOpenAI(place: any, scraped: any) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        // Fallback a Groq si no hay OpenAI
        console.warn('⚠️ OPENAI_API_KEY no configurada, usando Groq como fallback');
        return analyzeLeadWithGroq(place, scraped);
    }

    const techStackStr = scraped.techStack?.length > 0 ? scraped.techStack.join(', ') : 'No detectada';
    const contactsStr = [
        scraped.emails?.length ? `Emails: ${scraped.emails.join(', ')}` : null,
        scraped.whatsapp ? `WhatsApp: +${scraped.whatsapp}` : null,
        scraped.instagram ? `Instagram: @${scraped.instagram}` : null
    ].filter(Boolean).join(', ') || 'No encontrados';

    const prompt = `Analiza este lead para la agencia HojaCero (diseño web Chile).

DATOS:
- Negocio: ${place.title}
- Web: ${place.website || 'NO TIENE'}
- Contactos: ${contactsStr}
- Tech: ${techStackStr}
- SSL: ${scraped.hasSSL ? 'Sí ✓' : 'NO ⚠'}

REGLAS:
- Next.js/React = Moderno (score bajo 10-30)
- "HOJACERO" en web = Score 0
- Sin web = Score 90-100
- WordPress viejo/Wix feo = Score 60-80
- Sé HONESTO y ESPECÍFICO

RESPONDE SOLO JSON:
{
  "score": 0-100,
  "verdict": "CONTACTAR" | "REVISAR" | "DESCARTAR",
  "vibe": "Premium|Moderno|Profesional|Local|Desactualizado|Inexistente",
  "buyerPersona": "Cliente ideal del negocio en 1 oración",
  "analysisReport": "Análisis honesto en 2 oraciones",
  "salesStrategy": {
    "hook": "Frase de apertura específica para este negocio",
    "painPoints": ["dolor1", "dolor2"],
    "proposedSolution": "Servicio concreto que necesitan",
    "estimatedValue": "Bajo|Medio|Alto|Premium"
  },
  "recommendedChannel": "WhatsApp|Email|Llamada",
  "opportunity": "Tipo de proyecto potencial"
}`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un consultor de ventas B2B experto. Respondes SOLO en JSON válido, sin markdown.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 500,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            console.error('OpenAI API error:', response.status);
            return analyzeLeadWithGroq(place, scraped);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        const parsed = JSON.parse(content || '{}');

        // Agregar campos de compatibilidad
        return {
            ...parsed,
            scoreBreakdown: parsed.scoreBreakdown || {},
            competitiveAnalysis: parsed.competitiveAnalysis || 'N/A'
        };
    } catch (e) {
        console.error("OpenAI Analysis failed, falling back to Groq", e);
        return analyzeLeadWithGroq(place, scraped);
    }
}
