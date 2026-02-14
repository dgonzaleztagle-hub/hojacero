import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeTechSpecs, type TechAnalysisResult } from '@/utils/tech-analysis';
import { analizarForense, KimiForensicResult } from '@/utils/kimi-forensics';

// ===========================================
// AUDITORÍA PROFUNDA - HOJACERO RADAR
// Modelo: Groq (llama-3.1-8b-instant)
// ===========================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

type LooseRecord = Record<string, unknown>;

interface SearchResultItem {
    title?: string;
    snippet?: string;
    link: string;
}

interface DiscoveryData {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    whatsapp: string | null;
    snippets?: string;
}

interface SocialCandidate {
    link: string;
    title: string;
    snippet: string;
}

const isValidApiKey = (key?: string) => {
    if (!key) return false;
    const trimmed = key.trim();
    if (!trimmed) return false;
    if (trimmed === 're_123' || trimmed === 'sk_test') return false;
    if (trimmed.toLowerCase().startsWith('placeholder')) return false;
    return true;
};

const DISCOVERY_STOPWORDS = new Set([
    'de', 'del', 'la', 'las', 'el', 'los', 'y', 'en', 'con',
    'chile', 'oficial', 'club', 'restaurante', 'bar', 'spa',
    'ltda', 'limitada', 'sa', 'empresa', 'group'
]);

const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const compactText = (value: string): string => normalizeText(value).replace(/\s+/g, '');

const tokenizeBusinessName = (businessName: string): string[] =>
    normalizeText(businessName)
        .split(' ')
        .filter(token => token.length >= 3 && !DISCOVERY_STOPWORDS.has(token));

const getHost = (input: string): string => {
    try {
        return new URL(input).hostname.toLowerCase().replace(/^www\./, '');
    } catch {
        return '';
    }
};

const getBrandKeyFromUrl = (input?: string): string => {
    if (!input) return '';
    const host = getHost(input);
    if (!host) return '';
    const parts = host.split('.');
    if (parts.length < 2) return compactText(host);
    return compactText(parts[parts.length - 2]);
};

const scoreSearchCandidate = (
    candidate: SocialCandidate,
    businessName: string,
    businessTokens: string[],
    brandKey: string,
    nameKey: string
): number => {
    const targetName = normalizeText(businessName);
    const normalizedLink = normalizeText(candidate.link);
    const normalizedTitle = normalizeText(candidate.title || '');
    const normalizedSnippet = normalizeText(candidate.snippet || '');
    const joined = `${normalizedTitle} ${normalizedSnippet} ${normalizedLink}`;
    let score = 0;

    if (brandKey && normalizedLink.includes(brandKey)) score += 4;
    if (nameKey && normalizedLink.includes(nameKey)) score += 4;
    if (targetName && (normalizedTitle.includes(targetName) || normalizedSnippet.includes(targetName))) score += 3;

    let tokenMatches = 0;
    for (const token of businessTokens) {
        if (joined.includes(token)) tokenMatches += 1;
    }
    score += Math.min(tokenMatches, 3);

    if (/jobs|empleo|trabajo|indeed|glassdoor/.test(joined)) score -= 3;
    if (/montan|trek|sender|hiking|climbing/.test(joined)) score -= 2;

    return score;
};

const pickBestSocialLink = (
    platform: 'facebook' | 'instagram' | 'linkedin',
    organic: SearchResultItem[],
    knowledgeGraphLink: string | null | undefined,
    businessName: string,
    targetUrl?: string
): string | null => {
    const businessTokens = tokenizeBusinessName(businessName);
    const brandKey = getBrandKeyFromUrl(targetUrl);
    const nameKey = compactText(businessName);
    const domain = `${platform}.com`;

    const candidates: SocialCandidate[] = [];
    for (const row of organic) {
        if (!row?.link || !row.link.includes(domain)) continue;
        candidates.push({
            link: row.link,
            title: row.title || '',
            snippet: row.snippet || ''
        });
    }
    if (knowledgeGraphLink && knowledgeGraphLink.includes(domain)) {
        candidates.push({ link: knowledgeGraphLink, title: '', snippet: '' });
    }

    const deduped = Array.from(new Map(candidates.map(c => [c.link, c])).values());
    if (deduped.length === 0) return null;

    const ranked = deduped
        .map(candidate => ({
            candidate,
            score: scoreSearchCandidate(candidate, businessName, businessTokens, brandKey, nameKey)
        }))
        .sort((a, b) => b.score - a.score);

    const best = ranked[0];
    return best && best.score >= 4 ? best.candidate.link : null;
};

const pickBestWebsite = (
    organic: SearchResultItem[],
    businessName: string,
    currentUrl?: string
): string | null => {
    const businessTokens = tokenizeBusinessName(businessName);
    const brandKey = getBrandKeyFromUrl(currentUrl);
    const nameKey = compactText(businessName);

    const candidates = organic.filter((row) => {
        const link = row?.link || '';
        return !!link &&
            !link.includes('facebook.com') &&
            !link.includes('instagram.com') &&
            !link.includes('linkedin.com') &&
            !link.includes('youtube.com') &&
            !link.includes('twitter.com') &&
            !link.includes('x.com') &&
            !link.includes('tiktok.com');
    });

    const ranked = candidates
        .map((row) => {
            const candidate: SocialCandidate = {
                link: row.link,
                title: row.title || '',
                snippet: row.snippet || ''
            };
            return {
                link: row.link,
                score: scoreSearchCandidate(candidate, businessName, businessTokens, brandKey, nameKey)
            };
        })
        .sort((a, b) => b.score - a.score);

    const best = ranked[0];
    return best && best.score >= 3 ? best.link : null;
};

const toBool = (value: unknown, fallback = false): boolean =>
    typeof value === 'boolean' ? value : fallback;

const toStringOrNull = (value: unknown): string | null =>
    typeof value === 'string' && value.trim() ? value : null;

const toStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];

// Helper: Basic SEO Scraping
async function performSeoAudit(url: string) {
    if (!url) return null;

    const baseUrl = url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

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
        } catch {
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
        const organic = Array.isArray(data.organic) ? data.organic as SearchResultItem[] : [];
        return organic.slice(0, 2).map((r) => `${r.title}: ${r.snippet}`).join('\n') || "";
    } catch {
        return "";
    }
}

export async function POST(req: Request) {
    try {
        const { leadId, url, businessName, businessType } = await req.json();
        const supabase = await createClient();
        const hasGroq = isValidApiKey(GROQ_API_KEY);
        const hasSerper = isValidApiKey(SERPER_API_KEY);
        const configWarnings: string[] = [];

        if (!hasGroq) configWarnings.push('GROQ_API_KEY missing or invalid');
        if (!hasSerper) configWarnings.push('SERPER_API_KEY missing or invalid');

        // Validate leadId
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!leadId || !uuidRegex.test(leadId)) {
            return NextResponse.json({
                error: 'Se requiere guardar el lead primero antes de ejecutar la auditoría profunda',
                code: 'LEAD_NOT_SAVED'
            }, { status: 400 });
        }

        let targetUrl = url;
        let discoveryData: DiscoveryData | null = null;

        // --- FASE DE DESCUBRIMIENTO KIMI ---
        // Siempre intentamos descubrir redes sociales si tenemos el nombre del negocio, 
        // incluso si ya tenemos una URL, para evitar puntos ciegos (como LinkedIn).
        if (businessName) {
            console.log(`🔍 KIMI STARTING DISCOVERY for: ${businessName}`);
            const discoveryQuery = `"${businessName}" Chile sitio web oficial linkedin facebook instagram`;
            try {
                const searchRes = await fetch('https://google.serper.dev/search', {
                    method: 'POST',
                    headers: { 'X-API-KEY': (SERPER_API_KEY as string) || '', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ q: discoveryQuery, gl: 'cl', hl: 'es' })
                });
                const searchData = await searchRes.json();

                const organic = Array.isArray(searchData.organic) ? searchData.organic as SearchResultItem[] : [];
                const possibleWeb = pickBestWebsite(organic, businessName, targetUrl);

                if (possibleWeb) {
                    targetUrl = possibleWeb;
                    console.log(`✅ KIMI DISCOVERED URL: ${targetUrl}`);
                }

                // --- BÚSQUEDA DEDICADA DE LINKEDIN ---
                let liLink = pickBestSocialLink(
                    'linkedin',
                    organic,
                    searchData.knowledgeGraph?.attributes?.LinkedIn || null,
                    businessName,
                    targetUrl
                );

                if (!liLink) {
                    console.log(`🔍 KIMI TARGETED LINKEDIN SEARCH for: ${businessName}`);
                    const liSearchRes = await fetch('https://google.serper.dev/search', {
                        method: 'POST',
                        headers: { 'X-API-KEY': (SERPER_API_KEY as string) || '', 'Content-Type': 'application/json' },
                        body: JSON.stringify({ q: `${businessName} Chile LinkedIn company`, gl: 'cl', hl: 'es', num: 3 })
                    });
                    const liSearchData = await liSearchRes.json();
                    const liOrganic = Array.isArray(liSearchData.organic) ? liSearchData.organic as SearchResultItem[] : [];
                    liLink = pickBestSocialLink(
                        'linkedin',
                        liOrganic,
                        liSearchData.knowledgeGraph?.attributes?.LinkedIn || null,
                        businessName,
                        targetUrl
                    );
                    console.log(`🔍 LINKEDIN SEARCH RESULTS:`, liOrganic.slice(0, 3).map((r) => r.link));
                }

                console.log(`✅ KIMI DISCOVERY COMPLETE - LinkedIn: ${liLink || 'NOT FOUND'}`);

                discoveryData = {
                    facebook: pickBestSocialLink(
                        'facebook',
                        organic,
                        searchData.knowledgeGraph?.attributes?.Facebook || null,
                        businessName,
                        targetUrl
                    ),
                    instagram: pickBestSocialLink(
                        'instagram',
                        organic,
                        searchData.knowledgeGraph?.attributes?.Instagram || null,
                        businessName,
                        targetUrl
                    ),
                    linkedin: liLink,
                    whatsapp: null,
                    snippets: organic.slice(0, 5).map((r) => r.snippet).join(' | ')
                };

                console.log(`📊 DISCOVERY DATA:`, JSON.stringify(discoveryData, null, 2));
            } catch (discoveryErr) {
                console.error('Error in discovery phase:', discoveryErr);
            }
        }

        console.log(`🕵️ DEEP ANALYZE: Processing ${businessName} (Target: ${targetUrl})...`);

        // 1. Technical Audit (Solo si hay URL meta o descubierta)
        let audit: LooseRecord | null = null;
        let techSpecs: TechAnalysisResult | null = null;

        if (targetUrl) {
            [audit, techSpecs] = await Promise.all([
                performSeoAudit(targetUrl),
                analyzeTechSpecs(targetUrl)
            ]);
        }

        // 2. Google Search Context (Usar el nombre para buscar contexto global)
        const searchContext = discoveryData?.snippets || await performDeepResearch(`${businessName} Chile`);

        // 3. AI Analysis con Groq (costo cero)
        let deepAnalysis: LooseRecord = {
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

        if (!hasGroq) {
            deepAnalysis.executiveSummary = 'Error: No hay API de IA configurada (GROQ_API_KEY)';
        } else {
            const forensicData = audit && 'forensic' in audit ? audit.forensic : {};
            const contentPreview = typeof audit?.htmlPreview === 'string'
                ? audit.htmlPreview.slice(0, 4000)
                : '';
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
                contentPreview
            }, null, 2)}

TECH SPECS:
${JSON.stringify(techSpecs, null, 2)}

FORENSIC DNA (Kimi):
${JSON.stringify(forensicData, null, 2)}

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
                const model = 'llama-3.1-8b-instant';
                console.log(`🤖 RADAR AI: Usando modelo ${model} (Ahorro activado)`);

                const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY as string}`
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
                        const parsed = JSON.parse(content);
                        if (parsed && typeof parsed === 'object') {
                            deepAnalysis = { ...deepAnalysis, ...(parsed as LooseRecord) };
                        }
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
                    } catch {
                        htmlCompleto = typeof audit?.htmlPreview === 'string' ? audit.htmlPreview : '';
                    }
                }

                kimiForensics = await analizarForense(
                    htmlCompleto,
                    leadId,
                    {
                        facebook: typeof audit?.facebook === 'string' ? audit.facebook : (discoveryData?.facebook || null),
                        instagram: typeof audit?.instagram === 'string' ? audit.instagram : (discoveryData?.instagram || null),
                        linkedin: discoveryData?.linkedin
                    },
                    typeof audit?.hasSSL === 'boolean' ? audit.hasSSL : false,
                    typeof audit?.hasViewport === 'boolean' ? audit.hasViewport : false,
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
            hasSSL: toBool(audit?.hasSSL, false),
            hasTitle: toBool(audit?.hasTitle, false),
            hasMetaDesc: toBool(audit?.hasMetaDesc, false),
            hasH1: toBool(audit?.hasH1, false),
            hasOGTags: toBool(audit?.hasOGTags, false),
            hasViewport: toBool(audit?.hasViewport, false),
            cms: toStringOrNull(audit?.cms),
            emails: toStringArray(audit?.emails),
            phones: toStringArray(audit?.phones),
            facebook: toStringOrNull(audit?.facebook) || discoveryData?.facebook || null,
            instagram: toStringOrNull(audit?.instagram) || discoveryData?.instagram || null,
            whatsapp: toStringOrNull(audit?.whatsapp) || discoveryData?.whatsapp || null,
            linkedin: discoveryData?.linkedin || null,
            techStack: [toStringOrNull(audit?.cms)].filter((value): value is string => Boolean(value))
        };

        if (techSpecs?.security) {
            techSpecs.security.https = toBool(audit?.hasSSL, false);
        }

        const updatedSourceData = {
            ...(currentLead?.source_data || {}),
            scraped: scrapedData,
            deep_analysis: { ...deepAnalysis, techSpecs },
            kimi_forensics: kimiForensics, // <-- NUEVO: Resultados de Kimi
            last_audit_date: new Date().toISOString()
        };

        const updateFields: LooseRecord = { source_data: updatedSourceData };
        if (!url && targetUrl) {
            updateFields.website = targetUrl;
            updateFields.sitio_web = targetUrl;
        }

        const { error: updateError } = await supabase
            .from('leads')
            .update(updateFields)
            .eq('id', leadId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            analysis: deepAnalysis,
            scraped: scrapedData,
            discoveryData,
            kimiForensics,
            configWarnings
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('Deep Analyze Error:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
