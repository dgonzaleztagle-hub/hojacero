import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SERPER_API_KEY = process.env.SERPER_API_KEY;

// Helper: Basic SEO Scraping (Mocking a real crawler)
async function performSeoAudit(url: string) {
    if (!url) return null;

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 8000);
        const res = await fetch(normalizedUrl, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HojaCeroBot/1.0)' }
        });

        if (!res.ok) return { status: res.status, error: 'Site unreachable' };

        const html = await res.text();
        const textContent = html.replace(/<[^>]+>/g, ' ').slice(0, 3000); // Extract plain text

        return {
            hasTitle: /<title>/.test(html),
            hasMetaDesc: /<meta[^>]*name=["']description["'][^>]*content=["']/.test(html),
            hasH1: /<h1/.test(html),
            hasOGTags: /<meta[^>]*property=["']og:/.test(html),
            isWordpress: /wp-content/.test(html),
            loadTimeMs: 0,
            contentLength: html.length,
            htmlPreview: textContent // Send CLEAN TEXT, not raw HTML
        };
    } catch (e) {
        return { error: 'Scrape failed' };
    }
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

        // 1. Technical Audit -> Scrape Website
        const audit = await performSeoAudit(url);

        // 2. Google Search Context (For redundancy if site is sparse)
        const searchContext = await performDeepResearch(`${businessName} Chile`);

        console.log(`🕵️ CONTEXT: ScrapeLen=${audit?.contentLength || 0}, SearchCtx=${searchContext.length} chars`);

        // 2. AI Intelligence (The "Ubersuggest" Simulation)
        let deepAnalysis = {
            seoScore: 0,
            missingKeywords: [] as string[],
            competitorGap: "",
            technicalIssues: [] as string[],
            contentStrategy: "",
            backlinkOpportunities: [] as string[],
            topCompetitors: [] as string[]
        };

        if (GROQ_API_KEY) {
            const prompt = `
            Act as an ELITE SEO Strategist & Competitor Analyst (Ubersuggest/Semrush/Ahrefs level).
            
            TARGET BUSINESS:
            - Name: "${businessName}"
            - Reported Type: ${businessType || 'General'}
            - Website URL: ${url || 'No Website'}
            
            EVIDENCE 1 (WEBSITE CONTENT):
            ${JSON.stringify({ ...audit, htmlPreview: audit?.htmlPreview?.slice(0, 1000) })}

            EVIDENCE 2 (EXTERNAL GOOGLE CONTEXT):
            ${searchContext}

            TASK:
            1. FIRST, determine the TRUE nature of the business using EVIDENCE 2 (Search results are usually more accurate than raw HTML).
            2. IF EVIDENCE 2 says "Scientific Equipment" but name sounds like "Spa", TRUST EVIDENCE 2.
            3. Generate a DEEP DIVE REPORT for this specific niche.

            Generate a DEEP DIVE REPORT in JSON format that simulates a full SEO suite audit:
            {
                "seoScore": [0-100 score based on audit + opportunity],
                "buyerPersona": "Brief description of the decision maker (e.g. 'Gerente de Operaciones estresado por...').",
                "painPoints": ["Pain 1", "Pain 2", "Pain 3"],
                "missingKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
                "competitorGap": "Analysis of what competitors like (Generic Competitor A, B) are doing that this business is not.",
                "technicalIssues": ["Critical issue 1 (e.g. Slow LCP)", "Issue 2 (Mobile Usability)", "Issue 3 (SSL/Security)"],
                "contentStrategy": "Specific blog/landing page title and structure to capture easy traffic.",
                "backlinkOpportunities": ["Site Type A (e.g. Local Directories)", "Site Type B (e.g. Industry Blogs)"],
                "topCompetitors": ["Competitor Name 1", "Competitor Name 2"]
            }

            Rules:
            - If no website, SEO score < 20.
            - Keywords must be transactional and high-intent for this specific niche in Chile (Spanish).
            - BE RUTHLESS on Technical Issues (mention Core Web Vitals, Mobile Responsiveness, Semantic HTML).
            - "buyerPersona" must be psychological and specific (Job Title + Anxiety).
            - Provide STRICTLY JSON.
            `;

            const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
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
        const updatedSourceData = {
            ...(currentLead?.source_data || {}),
            deep_analysis: deepAnalysis,
            last_audit_date: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update({ source_data: updatedSourceData })
            .eq('id', leadId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, analysis: deepAnalysis });

    } catch (error: any) {
        console.error('Deep Analyze Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
