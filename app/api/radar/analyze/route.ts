import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeTechSpecs } from '@/utils/tech-analysis';
import { analizarForense, KimiForensicResult } from '@/utils/kimi-forensics';

// ===========================================
// AUDITORÍA PROFUNDA - HOJACERO RADAR
// Modelo: gpt-4o-mini (OpenAI)
// ===========================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

// Helper: Basic SEO Scraping
async function performSeoAudit(url: string) {
    if (!url) return null;

    let baseUrl = url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

    const urlsToTry = [
        `https://${baseUrl}`,
        `https://www.${baseUrl}`,
        `http://${baseUrl}`,
        `http://www.${baseUrl}`
    ];

    for (const urlToTry of urlsToTry) {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 4000);
            const res = await fetch(urlToTry, {
                signal: controller.signal,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HojaCeroBot/1.0)' }
            });

            if (!res.ok) continue;

            const html = await res.text();
            const textContent = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 5000); // Aumentado de 500 a 5000

            // Extract contact information
            const phoneRegex = /\+?56\s*9\s*\d{4}\s*\d{4}|\+?56\s*2\s*\d{4}\s*\d{4}|(?<!\d)9\s*\d{4}\s*\d{4}(?!\d)/g;
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

            const phones = [...new Set((html.match(phoneRegex) || []).map(p => p.replace(/\s+/g, ' ').trim()))];
            const emails = [...new Set(html.match(emailRegex) || [])].filter(e => !e.includes('example') && !e.includes('wixpress'));

            // Social media
            const facebookMatch = html.match(/(?:href=["'])(https?:\/\/(?:www\.)?facebook\.com\/[^"'\s]+)/i);
            const instagramMatch = html.match(/(?:href=["'])(https?:\/\/(?:www\.)?instagram\.com\/[^"'\s]+)/i);
            const whatsappMatch = html.match(/(?:href=["'])(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"'\s]+)/i);

            // CMS Detection
            const isWordpress = /wp-content|wordpress/i.test(html);
            const isWix = /wix\.com|wixsite/i.test(html);
            const isShopify = /cdn\.shopify\.com/i.test(html);
            const isNextJs = /_next|__NEXT/i.test(html);
            const cms = isNextJs ? 'Next.js' : isWordpress ? 'WordPress' : isWix ? 'Wix' : isShopify ? 'Shopify' : null;

            return {
                // hasTitle: verifica que el tag tenga contenido real (no solo <title></title> vacío)
                hasTitle: /<title>[^<]+<\/title>/i.test(html),
                hasMetaDesc: /<meta[^>]*name=["']description["'][^>]*content=["'][^"']+/i.test(html),
                hasH1: /<h1/.test(html),
                hasOGTags: /<meta[^>]*property=["']og:/.test(html),
                hasViewport: /<meta[^>]*name=["']viewport["']/i.test(html),
                cms,
                contentLength: html.length,
                htmlPreview: textContent,
                hasSSL: urlToTry.startsWith('https://'),
                phones,
                emails,
                facebook: facebookMatch?.[1] || null,
                instagram: instagramMatch?.[1] || null,
                whatsapp: whatsappMatch?.[1] || null
            };
        } catch (e) {
            continue;
        }
    }

    return { error: 'Could not reach site' };
}

// Helper: Google Search Context
async function performDeepResearch(query: string) {
    if (!SERPER_API_KEY || !query) return "";
    try {
        const res = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: query, gl: 'cl', hl: 'es' })
        });
        const data = await res.json();
        return data.organic?.slice(0, 2).map((r: any) => `${r.title}: ${r.snippet}`).join('\n') || "";
    } catch (e) {
        return "";
    }
}

export async function POST(req: Request) {
    try {
        const { leadId, url, businessName, businessType } = await req.json();
        const supabase = await createClient();

        // Validate leadId
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!leadId || !uuidRegex.test(leadId)) {
            return NextResponse.json({
                error: 'Se requiere guardar el lead primero antes de ejecutar la auditoría profunda',
                code: 'LEAD_NOT_SAVED'
            }, { status: 400 });
        }

        let targetUrl = url;
        let discoveryData: any = null;

        // --- FASE DE DESCUBRIMIENTO KIMI ---
        // Siempre intentamos descubrir redes sociales si tenemos el nombre del negocio, 
        // incluso si ya tenemos una URL, para evitar puntos ciegos (como LinkedIn).
        if (businessName) {
            console.log(`🔍 KIMI STARTING DISCOVERY for: ${businessName}`);
            const discoveryQuery = `${businessName} Chile sitio web oficial linkedin facebook instagram`;
            try {
                const searchRes = await fetch('https://google.serper.dev/search', {
                    method: 'POST',
                    headers: { 'X-API-KEY': SERPER_API_KEY || '', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ q: discoveryQuery, gl: 'cl', hl: 'es' })
                });
                const searchData = await searchRes.json();

                const possibleWeb = searchData.organic?.find((r: any) =>
                    !r.link.includes('facebook.com') &&
                    !r.link.includes('instagram.com') &&
                    !r.link.includes('linkedin.com') &&
                    !r.link.includes('cl.linkedin.com') &&
                    !r.link.includes('youtube.com') &&
                    !r.link.includes('twitter.com') &&
                    !r.link.includes('x.com') &&
                    !r.link.includes('tiktok.com')
                );

                if (possibleWeb) {
                    targetUrl = possibleWeb.link;
                    console.log(`✅ KIMI DISCOVERED URL: ${targetUrl}`);
                }

                // --- BÚSQUEDA DEDICADA DE LINKEDIN ---
                let liLink = searchData.organic?.find((r: any) => r.link.includes('linkedin.com'))?.link ||
                    searchData.knowledgeGraph?.attributes?.LinkedIn || null;

                if (!liLink) {
                    console.log(`🔍 KIMI TARGETED LINKEDIN SEARCH for: ${businessName}`);
                    const liSearchRes = await fetch('https://google.serper.dev/search', {
                        method: 'POST',
                        headers: { 'X-API-KEY': SERPER_API_KEY || '', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ q: `${businessName} Chile LinkedIn company`, gl: 'cl', hl: 'es', num: 3 })
                    });
                    const liSearchData = await liSearchRes.json();
                    liLink = liSearchData.organic?.find((r: any) => r.link.includes('linkedin.com'))?.link || null;
                    console.log(`🔍 LINKEDIN SEARCH RESULTS:`, liSearchData.organic?.slice(0, 3).map((r: any) => r.link));
                }

                console.log(`✅ KIMI DISCOVERY COMPLETE - LinkedIn: ${liLink || 'NOT FOUND'}`);

                discoveryData = {
                    facebook: searchData.organic?.find((r: any) => r.link.includes('facebook.com'))?.link ||
                        searchData.knowledgeGraph?.attributes?.Facebook || null,
                    instagram: searchData.organic?.find((r: any) => r.link.includes('instagram.com'))?.link ||
                        searchData.knowledgeGraph?.attributes?.Instagram || null,
                    linkedin: liLink,
                    snippets: searchData.organic?.slice(0, 5).map((r: any) => r.snippet).join(' | ')
                };

                console.log(`📊 DISCOVERY DATA:`, JSON.stringify(discoveryData, null, 2));
            } catch (discoveryErr) {
                console.error('Error in discovery phase:', discoveryErr);
            }
        }

        console.log(`🕵️ DEEP ANALYZE: Processing ${businessName} (Target: ${targetUrl})...`);

        // 1. Technical Audit (Solo si hay URL meta o descubierta)
        let audit: any = null;
        let techSpecs: any = null;

        if (targetUrl) {
            [audit, techSpecs] = await Promise.all([
                performSeoAudit(targetUrl),
                analyzeTechSpecs(targetUrl)
            ]);
        }

        // 2. Google Search Context (Usar el nombre para buscar contexto global)
        const searchContext = discoveryData?.snippets || await performDeepResearch(`${businessName} Chile`);

        // 3. AI Analysis con OpenAI
        let deepAnalysis: any = {
            seoScore: 0,
            verdict: 'REVISAR',
            executiveSummary: 'Análisis pendiente',
            technicalIssues: [],
            designAnalysis: { isOutdated: false, worstProblems: [] },
            buyerPersona: 'Por definir',
            salesStrategy: {
                hook: 'Pendiente',
                painPoints: [],
                proposedSolution: 'Pendiente',
                estimatedValue: 'Por Definir',
                closingAngle: ''
            },
            actionPlan: {
                priority: 'Por definir',
                recommendedChannel: 'Email',
                nextStep: 'Analizar'
            },
            competitors: [],
            missingKeywords: []
        };

        if (!OPENAI_API_KEY && !GROQ_API_KEY) {
            deepAnalysis.executiveSummary = 'Error: No hay API de IA configurada (OPENAI_API_KEY o GROQ_API_KEY)';
        } else {
            const prompt = `Analiza este negocio para HojaCero (agencia de diseño web premium). Tu objetivo es encontrar ANGULOS DE VENTA para ofrecer una Landing Page de Alta Conversión ($150.000 CLP).
Sé CRÍTICO y directo. Busca lo que está MAL, viejo o feo.

NEGOCIO: "${businessName}"
TIPO: ${businessType || 'General'}
WEB: ${url || 'NO TIENE'}

DATOS TÉCNICOS:
${JSON.stringify({
                ssl: audit?.hasSSL,
                cms: audit?.cms,
                hasTitle: audit?.hasTitle,
                hasMetaDesc: audit?.hasMetaDesc,
                hasViewport: audit?.hasViewport,
                contentPreview: audit?.htmlPreview?.slice(0, 4000)
            }, null, 2)}

TECH SPECS:
${JSON.stringify(techSpecs, null, 2)}

FORENSIC DNA (Kimi):
${JSON.stringify(audit && 'forensic' in audit ? (audit as any).forensic : {}, null, 2)}

CONTEXTO GOOGLE:
${searchContext}

RESPONDE SOLO JSON:
{
  "seoScore": 0-100 (Bajo es mejor para nosotros),
  "verdict": "CONTACTAR URGENTE" | "CONTACTAR" | "DESCARTAR",
  "executiveSummary": "Resumen brutalmente honesto. DEBES citar el Arquetipo de Dolor y la Fuga de Capital estimada.",
  
  "technicalIssues": [
    {"issue": "Problema Técnico", "severity": "Alta", "impact": "Pierdes clientes por esto"}
  ],
  
  "designAnalysis": {
    "isOutdated": true,
    "estimatedAge": "Año estimado (ej: 2018)",
    "worstProblems": ["Texto ilegible", "Fotos borrosas", "No adaptado a celular", "Lento"]
  },
  
  "salesStrategy": {
    "hook": "Frase que le duela al dueño (ej: 'Tu competencia X se ve mejor')",
    "painPoints": ["Estás perdiendo ventas hoy", "Tu web asusta a los clientes", "No apareces en Google"],
    "proposedSolution": "Landing Page Factory ($150.000)",
    "estimatedValue": "Bajo|Medio|Alto",
    "closingAngle": "Miedo a quedar obsoleto | Ambición de crecer"
  }
}

REGLAS DE ORO:
1. Si no tiene web o es muy vieja: VERDICT = CONTACTAR URGENTE.
2. Si usa Wix/Wordpress lento: VERDICT = CONTACTAR.
3. El tono debe ser profesional pero ALARMANTE (necesitan cambiar YA).
4. Asume que el objetivo es vender la Landing Page Factory.`;

            try {
                // PRIORIDAD: USAR GROQ (Llama 3) PARA AHORRAR COSTOS
                // Fallback a OpenAI si Groq falla o no hay key
                const useGroq = !!GROQ_API_KEY; // Forzar Groq si existe la key

                const apiUrl = useGroq
                    ? 'https://api.groq.com/openai/v1/chat/completions'
                    : 'https://api.openai.com/v1/chat/completions';

                const apiKey = useGroq ? GROQ_API_KEY : OPENAI_API_KEY;
                const model = useGroq ? 'llama-3.1-8b-instant' : 'gpt-4o-mini';

                console.log(`🤖 RADAR AI: Usando modelo ${model} (Ahorro activado)`);

                const aiResponse = await fetch(apiUrl, {
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
                                content: 'Eres un auditor de ventas despiadado pero preciso. Tu trabajo es encontrar defectos para vender rediseños web. Respondes SOLO JSON.'
                            },
                            { role: 'user', content: prompt }
                        ],
                        temperature: 0.5,
                        max_tokens: 800,
                        response_format: { type: "json_object" }
                    })
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    const content = aiData.choices?.[0]?.message?.content;
                    if (content) {
                        deepAnalysis = JSON.parse(content);
                    }
                }
            } catch (e) {
                console.error("AI Analysis failed", e);
            }
        }

        // 4. KIMI FORENSICS - Análisis forense real
        let kimiForensics: KimiForensicResult | null = null;
        if (audit?.htmlPreview || audit?.hasSSL !== undefined) {
            try {
                // Obtener HTML completo para análisis de copyright
                let htmlCompleto = '';
                if (targetUrl) {
                    try {
                        const controller = new AbortController();
                        setTimeout(() => controller.abort(), 3000);
                        const res = await fetch(targetUrl, {
                            signal: controller.signal,
                            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HojaCeroBot/1.0)' }
                        });
                        htmlCompleto = await res.text();
                    } catch (e) {
                        htmlCompleto = audit?.htmlPreview || '';
                    }
                }

                kimiForensics = await analizarForense(
                    htmlCompleto,
                    leadId,
                    {
                        facebook: audit?.facebook || discoveryData?.facebook,
                        instagram: audit?.instagram || discoveryData?.instagram,
                        linkedin: discoveryData?.linkedin
                    },
                    audit?.hasSSL || false,
                    audit?.hasViewport || false,
                    businessType
                );
                console.log(`🔬 KIMI FORENSICS:`, JSON.stringify(kimiForensics, null, 2));
            } catch (kimiErr) {
                console.error('Error en Kimi Forensics:', kimiErr);
            }
        }

        // 5. Save to DB
        const { data: currentLead } = await supabase.from('leads').select('source_data').eq('id', leadId).single();

        // DEBUG: Log para verificar valores de scraping
        console.log(`🔍 SCRAPING DEBUG:`, {
            hasTitle: audit?.hasTitle,
            hasMetaDesc: audit?.hasMetaDesc,
            hasViewport: audit?.hasViewport,
            cms: audit?.cms,
            targetUrl
        });

        const scrapedData = {
            hasSSL: audit?.hasSSL || false,
            hasTitle: audit?.hasTitle || false,
            hasMetaDesc: audit?.hasMetaDesc || false,
            hasH1: audit?.hasH1 || false,
            hasOGTags: audit?.hasOGTags || false,
            hasViewport: audit?.hasViewport || false,
            cms: audit?.cms || null,
            emails: audit?.emails || [],
            phones: audit?.phones || [],
            facebook: audit?.facebook || discoveryData?.facebook || null,
            instagram: audit?.instagram || discoveryData?.instagram || null,
            whatsapp: audit?.whatsapp || discoveryData?.whatsapp || null,
            linkedin: discoveryData?.linkedin || null,
            techStack: [audit?.cms].filter(Boolean)
        };

        if (techSpecs?.security) {
            techSpecs.security.https = audit?.hasSSL || false;
        }

        const updatedSourceData = {
            ...(currentLead?.source_data || {}),
            scraped: scrapedData,
            deep_analysis: { ...deepAnalysis, techSpecs },
            kimi_forensics: kimiForensics, // <-- NUEVO: Resultados de Kimi
            last_audit_date: new Date().toISOString()
        };

        const updateFields: any = { source_data: updatedSourceData };
        if (!url && targetUrl) {
            updateFields.website = targetUrl;
            updateFields.sitio_web = targetUrl;
        }

        const { error: updateError } = await supabase
            .from('leads')
            .update(updateFields)
            .eq('id', leadId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, analysis: deepAnalysis, scraped: scrapedData, discoveryData, kimiForensics });

    } catch (error: any) {
        console.error('Deep Analyze Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
