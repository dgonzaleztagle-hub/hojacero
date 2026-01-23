import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeTechSpecs } from '@/utils/tech-analysis';

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
            const textContent = html.replace(/<[^>]+>/g, ' ').slice(0, 500); // Reducido de 3000 a 500

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
                hasTitle: /<title>/.test(html),
                hasMetaDesc: /<meta[^>]*name=["']description["'][^>]*content=["']/.test(html),
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

        console.log(`🕵️ DEEP ANALYZE: Processing ${businessName} (${url})...`);

        // 1. Technical Audit
        const [audit, techSpecs] = await Promise.all([
            performSeoAudit(url),
            analyzeTechSpecs(url)
        ]);

        // 2. Google Search Context
        const searchContext = await performDeepResearch(`${businessName} Chile`);

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
            const prompt = `Analiza este negocio para HojaCero (agencia de diseño web Chile). Tu análisis debe ser ACCIONABLE: que yo pueda leerlo y saber exactamente qué hacer.

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
                contentPreview: audit?.htmlPreview?.slice(0, 300)
            }, null, 2)}

TECH SPECS:
${JSON.stringify(techSpecs, null, 2)}

CONTEXTO GOOGLE:
${searchContext}

RESPONDE SOLO JSON:
{
  "seoScore": 0-100,
  "verdict": "CONTACTAR URGENTE" | "CONTACTAR" | "REVISAR" | "DESCARTAR",
  "executiveSummary": "2 oraciones: qué pasa con este negocio y qué oportunidad hay",
  
  "technicalIssues": [
    {"issue": "Problema", "severity": "Alta|Media|Baja", "impact": "Por qué importa"}
  ],
  
  "designAnalysis": {
    "isOutdated": true/false,
    "estimatedAge": "Parece de 2015" o similar,
    "worstProblems": ["Problema visual 1", "Problema 2"]
  },
  
  "buyerPersona": "Cliente ideal del negocio en 1 oración simple",
  
  "salesStrategy": {
    "hook": "Frase de apertura ESPECÍFICA para este negocio (no genérica)",
    "painPoints": ["Dolor real 1", "Dolor real 2", "Dolor real 3"],
    "proposedSolution": "Servicio concreto: Landing $150 USD / Rediseño / SEO / etc",
    "estimatedValue": "Bajo|Medio|Alto|Premium",
    "closingAngle": "Ángulo de cierre: urgencia, competencia, pérdida de clientes, etc"
  },
  
  "actionPlan": {
    "priority": "Urgente|Esta semana|Puede esperar",
    "recommendedChannel": "WhatsApp|Email|Llamada",
    "bestTimeToContact": "Horario sugerido basado en tipo de negocio",
    "nextStep": "Acción específica: enviar Demo, agendar llamada, etc"
  },
  
  "competitors": ["Competidor 1", "Competidor 2"],
  "missingKeywords": ["keyword SEO 1", "keyword 2"]
}

REGLAS:
- Si tiene Next.js/React = Moderno, score bajo
- Sin web = Score 90+, verdict CONTACTAR URGENTE
- WordPress viejo/Wix = Score 60-80
- Sé ESPECÍFICO, no genérico`;

            try {
                // Usar OpenAI primero, Groq como fallback
                const apiUrl = OPENAI_API_KEY
                    ? 'https://api.openai.com/v1/chat/completions'
                    : 'https://api.groq.com/openai/v1/chat/completions';

                const apiKey = OPENAI_API_KEY || GROQ_API_KEY;
                const model = OPENAI_API_KEY ? 'gpt-4o-mini' : 'llama-3.3-70b-versatile';

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
                                content: 'Eres un consultor de ventas B2B experto en análisis de presencia digital. Respondes SOLO en JSON válido.'
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

        // 4. Save to DB
        const { data: currentLead } = await supabase.from('leads').select('source_data').eq('id', leadId).single();

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
            facebook: audit?.facebook || null,
            instagram: audit?.instagram || null,
            whatsapp: audit?.whatsapp || null,
            techStack: [audit?.cms].filter(Boolean)
        };

        if (techSpecs?.security) {
            techSpecs.security.https = audit?.hasSSL || false;
        }

        const updatedSourceData = {
            ...(currentLead?.source_data || {}),
            scraped: scrapedData,
            deep_analysis: { ...deepAnalysis, techSpecs },
            last_audit_date: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update({ source_data: updatedSourceData })
            .eq('id', leadId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, analysis: deepAnalysis, scraped: scrapedData });

    } catch (error: any) {
        console.error('Deep Analyze Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
