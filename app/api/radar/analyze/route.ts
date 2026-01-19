import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { analyzeTechSpecs } from '@/utils/tech-analysis'; // NEW IMPORT

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SERPER_API_KEY = process.env.SERPER_API_KEY;

// Helper: Basic SEO Scraping (Mocking a real crawler)
async function performSeoAudit(url: string) {
    if (!url) return null;

    // Normalize URL - remove protocol and www
    let baseUrl = url.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

    // Try all combinations (https first, then http; without www first, then with www)
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
            const textContent = html.replace(/<[^>]+>/g, ' ').slice(0, 3000);

            // Extract contact information with improved regex
            // Phone: Chilean format (+569 XXXX XXXX, 9 XXXX XXXX, +56 2 XXXX XXXX, etc.)
            const phoneRegex = /\+?56\s*9\s*\d{4}\s*\d{4}|\+?56\s*2\s*\d{4}\s*\d{4}|(?<!\d)9\s*\d{4}\s*\d{4}(?!\d)/g;
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            // Address: Look for "Dirección:" pattern or common street prefixes
            const addressRegex = /(?:Dirección[:\s]*|Av\.?|Avenida|Calle|Pasaje|Los|Las|El|La)\s*[A-ZÁÉÍÓÚÑa-záéíóúñ0-9\s,]+\d+[^<\n]*/gi;

            const phones = [...new Set((html.match(phoneRegex) || []).map(p => p.replace(/\s+/g, ' ').trim()))];
            const emails = [...new Set(html.match(emailRegex) || [])].filter(e => !e.includes('example') && !e.includes('wixpress') && !e.includes('wordpress'));
            const rawAddresses = html.match(addressRegex) || [];
            const addresses = [...new Set(rawAddresses.map(a => a.replace(/<[^>]+>/g, '').trim().slice(0, 100)))]
                .filter(a => a.length > 10 && /\d/.test(a));

            // Extract social media links
            const facebookMatch = html.match(/(?:href=["'])(https?:\/\/(?:www\.)?facebook\.com\/[^"'\s]+)/i);
            const instagramMatch = html.match(/(?:href=["'])(https?:\/\/(?:www\.)?instagram\.com\/[^"'\s]+)/i);
            const linkedinMatch = html.match(/(?:href=["'])(https?:\/\/(?:www\.)?linkedin\.com\/[^"'\s]+)/i);
            const whatsappMatch = html.match(/(?:href=["'])(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"'\s]+)/i);

            // Detect CMS
            const isWordpress = /wp-content|wordpress/i.test(html);
            const isWix = /wix\.com|wixsite/i.test(html);
            const isShopify = /cdn\.shopify\.com/i.test(html);
            const cms = isWordpress ? 'WordPress' : isWix ? 'Wix' : isShopify ? 'Shopify' : null;

            // Check mobile-friendly
            const hasViewport = /\<meta[^>]*name=["']viewport["']/i.test(html);

            return {
                hasTitle: /<title>/.test(html),
                hasMetaDesc: /<meta[^>]*name=["']description["'][^>]*content=["']/.test(html),
                hasH1: /<h1/.test(html),
                hasOGTags: /<meta[^>]*property=["']og:/.test(html),
                isWordpress,
                cms,
                hasViewport,
                loadTimeMs: 0,
                contentLength: html.length,
                htmlPreview: textContent,
                hasSSL: urlToTry.startsWith('https://'),
                // NEW: Contact info
                phones,
                emails,
                addresses,
                // NEW: Social media
                facebook: facebookMatch?.[1] || null,
                instagram: instagramMatch?.[1] || null,
                linkedin: linkedinMatch?.[1] || null,
                whatsapp: whatsappMatch?.[1] || null
            };
        } catch (e) {
            continue;
        }
    }

    return { error: 'Could not reach site via any protocol/www combination' };
}

// Helper: Google Search Context (The "Deep Research" Layer)
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
        // Return snippets from top results
        return data.organic?.slice(0, 3).map((r: any) => `${r.title}: ${r.snippet}`).join('\n') || "";
    } catch (e) {
        console.error("Deep Research Failed", e);
        return "";
    }
}

export async function POST(req: Request) {
    try {
        const { leadId, url, businessName, businessType } = await req.json();
        const supabase = await createClient();

        // Validate leadId is a proper UUID (not "preview")
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!leadId || !uuidRegex.test(leadId)) {
            return NextResponse.json({
                error: 'Se requiere guardar el lead primero antes de ejecutar la auditoría profunda',
                code: 'LEAD_NOT_SAVED'
            }, { status: 400 });
        }

        console.log(`🕵️ DEEP ANALYZE: Processing ${businessName} (${url})...`);

        // 1. Technical Audit (Scrape + DNS/Headers)
        const [audit, techSpecs] = await Promise.all([
            performSeoAudit(url),
            analyzeTechSpecs(url)
        ]);

        // 2. Google Search Context (For redundancy if site is sparse)
        const searchContext = await performDeepResearch(`${businessName} Chile`);

        console.log(`🕵️ CONTEXT: ScrapeLen=${audit?.contentLength || 0}, TechSpecs=${!!techSpecs}, SearchCtx=${searchContext.length} chars`);

        // 2. AI Intelligence (The "Ubersuggest" Simulation)
        // 2. AI Intelligence (The "Ubersuggest" Simulation)
        let deepAnalysis = {
            seoScore: 0,
            missingKeywords: [] as string[],
            competitorGap: "",
            technicalIssues: [] as string[],
            contentStrategy: "",
            backlinkOpportunities: [] as string[],
            topCompetitors: [] as string[],
            actionable_tasks: [] as any[],
            sales_angles: [] as string[],
            analysisReport: "Análisis pendiente",
            salesStrategy: {
                hook: "Pendiente",
                painPoints: [] as string[],
                proposedSolution: "Pendiente",
                estimatedValue: "Por Definir"
            }
        };

        if (!GROQ_API_KEY) {
            console.error("❌ GROQ_API_KEY missing in Deep Analysis");
            deepAnalysis = {
                ...deepAnalysis,
                seoScore: 10,
                technicalIssues: ["Falta configuración de API Key de IA"],
                analysisReport: "No se ha configurado la API Key de Groq. Contacta al administrador.",
                salesStrategy: {
                    hook: "Configurar sistema",
                    painPoints: ["Falta API Key"],
                    proposedSolution: "Configurar .env",
                    estimatedValue: "N/A"
                },
                actionable_tasks: [
                    { title: "Configurar GROQ_API_KEY", difficulty: "High", impact: "High", category: "Technical" }
                ]
            } as any;
        } else {
            const prompt = `
            Act as an ELITE SEO Strategist & Competitor Analyst (Ubersuggest/Semrush/Ahrefs level).

            CONTEXT (WHO YOU ARE):
            You are "HojaCero", a Premium Web Design & Strategic Marketing Agency.
            You are analyzing a prospect (TARGET BUSINESS) to find opportunities to SELL THEM your services (Web Design, SEO, Ads).

            TARGET BUSINESS:
            - Name: "${businessName}"
            - Reported Type: ${businessType || 'General'}
            - Website URL: ${url || 'No Website'}
            
            EVIDENCE 1 (WEBSITE CONTENT):
            ${JSON.stringify({ ...audit, htmlPreview: audit?.htmlPreview?.slice(0, 1000) })}

            EVIDENCE 2 (TECHNICAL HEALTH):
            ${JSON.stringify(techSpecs)}

            EVIDENCE 3 (EXTERNAL GOOGLE CONTEXT):
            ${searchContext}

            TASK:
            1. First, understand what the business DOES.
            2. Find gaps in their digital presence (Slow site? Ugly design? No SEO?).
            3. Generate a Report for HojaCero's sales team to use.

            output strictly JSON matching this structure:
            {
                "seoScore": [0-100 score],
                "buyerPersona": "Brief description of the Target's Ideal Customer (e.g. 'Novios buscando centro de eventos')",
                "painPoints": ["Pain 1 (e.g. Sitio lento)", "Pain 2 (No aparece en Google)", "Pain 3 (Diseño antiguo)"],
                "missingKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
                "competitorGap": "Analysis of what competitors are doing better.",
                "technicalIssues": ["Issue 1", "Issue 2", "Issue 3"],
                "contentStrategy": "Strategy for the CLIENT to grow (e.g. 'Blog about wedding tips').",
                "backlinkOpportunities": ["Site A", "Site B"],
                "topCompetitors": ["Comp 1", "Comp 2"],
                "actionable_tasks": [
                    { "title": "Direct Action 1", "difficulty": "Easy", "impact": "High", "category": "Technical" }
                ],
                "sales_angles": [
                    "Angle 1 (e.g. 'Focus on Lost Revenue due to slow site')",
                    "Angle 2 (e.g. 'Focus on Competitor Advantage')",
                    "Angle 3 (e.g. 'Focus on Premium Brand perception')"
                ]
            }

            Rules:
            - "sales_angles": 3 Distinct psychological angles HOJACERO can use to close the deal. NOT email subject lines, but ANGLES.
            - "buyerPersona": The CLIENT's customer.
            - Be critical on Technical Issues.
            - Provide STRICTLY JSON.
            `;

            const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY} `
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5,
                    response_format: { type: "json_object" }
                })
            });

            const aiData = await aiResponse.json();
            const content = aiData.choices?.[0]?.message?.content;
            if (content) {
                try {
                    deepAnalysis = JSON.parse(content);
                } catch (e) {
                    console.error("Failed to parse AI JSON", e);
                }
            }
        }

        // 3. Save to DB
        // Fetch current lead to merge source_data
        const { data: currentLead } = await supabase.from('leads').select('source_data').eq('id', leadId).single();

        // Build scraped data from audit (includes phones, emails, addresses, social)
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
            addresses: audit?.addresses || [],
            facebook: audit?.facebook || null,
            instagram: audit?.instagram || null,
            linkedin: audit?.linkedin || null,
            whatsapp: audit?.whatsapp || null,
            techStack: [audit?.cms].filter(Boolean)
        };

        // Also fix techSpecs.security.https to match scraped SSL status
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
