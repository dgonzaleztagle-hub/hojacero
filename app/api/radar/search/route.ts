import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // For fallback
import { createClient as createAdminClient } from '@supabase/supabase-js'; // For admin

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

interface PlaceResult {
    title: string;
    website?: string;
    category?: string;
    rating?: number;
    userRatingCount?: number;
    phoneNumber?: string;
    address?: string;
}

interface LeadForUI {
    analysis: {
        score?: number;
    };
    [key: string]: unknown;
}

const isValidApiKey = (key?: string) => {
    if (!key) return false;
    const trimmed = key.trim();
    if (!trimmed) return false;
    if (trimmed === 're_123' || trimmed === 'sk_test') return false;
    if (trimmed.toLowerCase().startsWith('placeholder')) return false;
    return true;
};

const parseConcurrency = (rawValue: string | undefined, fallback: number): number => {
    if (!rawValue) return fallback;
    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return fallback;
    return Math.min(parsed, 6);
};

const RADAR_PROCESS_CONCURRENCY = parseConcurrency(process.env.RADAR_PROCESS_CONCURRENCY, 1);

async function processWithConcurrency<T, R>(
    items: T[],
    concurrency: number,
    worker: (item: T, index: number) => Promise<R>
): Promise<Array<PromiseSettledResult<R>>> {
    const results: Array<PromiseSettledResult<R>> = new Array(items.length);

    for (let i = 0; i < items.length; i += concurrency) {
        const chunk = items.slice(i, i + concurrency);
        const chunkResults = await Promise.allSettled(
            chunk.map((item, offset) => worker(item, i + offset))
        );

        chunkResults.forEach((result, offset) => {
            results[i + offset] = result;
        });
    }

    return results;
}

// ========================
// SCRAPER: Extract contacts from website
// ========================
async function scrapeContactInfo(websiteUrl: string | undefined): Promise<{
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
        hasSSL: Boolean(websiteUrl && websiteUrl.startsWith('https')),
        techStack: [] as string[],
    };

    if (!websiteUrl) return result;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(websiteUrl, {
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

        console.log(`📧 SCRAPER [${websiteUrl}]: emails=${result.emails.length}, wa=${!!result.whatsapp}, ig=${!!result.instagram}`);

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'unknown error';
        console.warn(`⚠️ Scraper failed for ${websiteUrl}: ${message}`);
    }

    return result;
}

export async function POST(req: Request) {
    try {
        const { query, location, scannedBy } = await req.json();

        const hasSerper = isValidApiKey(SERPER_API_KEY);
        const hasGroq = isValidApiKey(GROQ_API_KEY);

        if (!hasSerper) {
            return NextResponse.json({
                success: false,
                error: 'Missing or invalid API keys',
                missing: ['SERPER_API_KEY'],
                requires: 'SERPER_API_KEY'
            }, { status: 503 });
        }

        // Use Admin Client to ensure persistence (bypassing RLS)
        // Ensure the environment variable matches exactly what was added to Vercel
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY missing. Falling back to request client (Persistence may fail if RLS blocks).");
        }

        let supabase;
        if (serviceRoleKey) {
            supabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey);
        } else {
            supabase = await createClient();
        }

        if (!query || !location) {
            return NextResponse.json({ error: 'Missing query or location' }, { status: 400 });
        }

        console.log(`📡 RADAR: Scanning for "${query}" in "${location}"...`);

        // 1. SEARCH WITH SERPER (Max 25)
        const searchTerm = `${query} en ${location}`;
        const serperResponse = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY as string,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: searchTerm, gl: 'cl', hl: 'es', num: 25 }),
        });

        if (!serperResponse.ok) {
            throw new Error('Serper API failed');
        }

        const serperData = await serperResponse.json();
        const places: PlaceResult[] = serperData.places || [];
        console.log(`📡 RADAR: Found ${places.length} raw results.`);

        // 2. FILTER DUPLICATES (Check DB)
        const { data: existingLeads } = await supabase
            .from('leads')
            .select('nombre, sitio_web, direccion');

        // Helper to normalize content for comparison
        const normalizeUrl = (url: string | null | undefined) => {
            if (!url) return '';
            return url.toLowerCase()
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .replace(/\/$/, '')
                .split('/')[0] // Keep only domain
                .trim();
        };

        const normalizeName = (name: string) => {
            return name.toLowerCase().trim();
        };

        const newPlaces = places.filter((place: PlaceResult) => {
            const placeParams = {
                url: normalizeUrl(place.website),
                name: normalizeName(place.title)
            };

            // Check against existing leads
            const isDuplicate = existingLeads?.some(existing => {
                const existingUrl = normalizeUrl(existing.sitio_web);
                const existingName = normalizeName(existing.nombre);

                // Match by Domain (strongest signal)
                if (placeParams.url && existingUrl && placeParams.url === existingUrl) return true;

                // Match by Exact Name
                if (placeParams.name === existingName) return true;

                // Match by Fuzzy Name (if simple contains) - Optional but safer
                if (placeParams.name.length > 5 && existingName.includes(placeParams.name)) return true;

                return false;
            });

            return !isDuplicate;
        });

        console.log(`📡 RADAR DEBUG: Serper=${places.length}, ExistingDB=${existingLeads?.length || 0}, NewCandidates=${newPlaces.length}`);

        if (newPlaces.length === 0) {
            return NextResponse.json({ success: true, leads: [], message: 'No se encontraron nuevos leads en esta zona.' });
        }

        // 3. ANALYZE & PERSIST (Resilient + controlled concurrency to avoid Groq burst limits)
        let groqRateLimited = false;

        const leadResults = await processWithConcurrency(
            newPlaces,
            RADAR_PROCESS_CONCURRENCY,
            async (place: PlaceResult) => {
                    // STEP A: Scrape website for contacts
                    const scraped = await scrapeContactInfo(place.website);

                    // STEP B: Enhanced AI Analysis with context for agency sales
                    const prompt = `
Eres un EXPERTO en Lead Qualification para la agencia "HojaCero" (Diseño Web, Apps y Marketing).
Analiza este negocio y genera un reporte ACCIONABLE para el equipo comercial.

DATOS DEL LEAD:
- Negocio: ${place.title}
- Categoría: ${place.category || 'No especificada'}
- Rating Google: ${place.rating || 'Sin rating'} (${place.userRatingCount || 0} reseñas)
- Sitio Web: ${place.website || 'NO TIENE - OPORTUNIDAD ALTA'}
- Teléfono: ${place.phoneNumber || 'No disponible'}
- Dirección: ${place.address}
${scraped.emails.length > 0 ? `- Emails encontrados: ${scraped.emails.join(', ')}` : '- Sin email visible en web'}
${scraped.whatsapp ? `- WhatsApp: +${scraped.whatsapp}` : '- Sin WhatsApp visible'}
${scraped.techStack.length > 0 ? `- Tecnología actual: ${scraped.techStack.join(', ')}` : ''}
${scraped.instagram ? `- Instagram: @${scraped.instagram}` : '- Sin Instagram'}
${scraped.hasSSL ? '- Tiene SSL ✓' : '- SIN SSL - Problema de seguridad'}

GENERA UN JSON con esta estructura EXACTA:
{
  "score": [0-100, mayor = mejor oportunidad para HojaCero],
  "scoreBreakdown": {
    "sinWeb": [0-30],
    "ratingBajo": [0-25],
    "sinContactoDigital": [0-20],
    "techObsoleta": [0-15],
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
- Score ALTO si NO tiene web, tiene rating bajo, o tech obsoleta
- Sé específico en painPoints y hook - esto lo usará un vendedor real
- El hook debe ser personalizado para ESE negocio específico
`;

                    let analysis = {
                        score: 75,
                        scoreBreakdown: { sinWeb: 0, ratingBajo: 0, sinContactoDigital: 0, techObsoleta: 0, sinRedesSociales: 0 },
                        vibe: "N/A",
                        opportunity: "Revisión Manual",
                        analysisReport: "Análisis preliminar (IA no disponible)",
                        salesStrategy: {
                            hook: "Revisar manualmente",
                            painPoints: [],
                            proposedSolution: "Pendiente análisis",
                            estimatedValue: "Medio"
                        },
                        competitiveAnalysis: "",
                        recommendedChannel: "Email"
                    };

                    try {
                        if (!hasGroq) throw new Error("Missing GROQ_API_KEY");
                        if (groqRateLimited) {
                            throw new Error("Groq rate-limited in this batch; fallback enabled");
                        }

                        // Using Groq API with a single retry on 429 to absorb TPM bursts.
                        let aiResponse: Response | null = null;
                        for (let attempt = 0; attempt < 2; attempt++) {
                            aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${GROQ_API_KEY as string}`
                                },
                                body: JSON.stringify({
                                    model: 'llama-3.1-8b-instant',
                                    messages: [
                                        {
                                            role: 'system',
                                            content: 'Eres un experto en Lead Qualification. Responde SOLO con JSON válido, sin markdown ni explicaciones adicionales.'
                                        },
                                        {
                                            role: 'user',
                                            content: prompt
                                        }
                                    ],
                                    temperature: 0.7,
                                    max_tokens: 1024
                                })
                            });

                            if (aiResponse.ok) break;
                            if (aiResponse.status === 429 && attempt === 0) {
                                await new Promise(resolve => setTimeout(resolve, 2200));
                                continue;
                            }

                            const errorText = await aiResponse.text();
                            throw new Error(`Groq API Error: ${aiResponse.status} - ${errorText}`);
                        }

                        if (!aiResponse || !aiResponse.ok) throw new Error('Groq API unavailable');

                        const aiData = await aiResponse.json();
                        const aiText = aiData.choices?.[0]?.message?.content;

                        if (aiText) {
                            const jsonString = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                            const parsed = JSON.parse(jsonString);
                            analysis = { ...analysis, ...parsed };
                        }
                    } catch (e: unknown) {
                        const message = e instanceof Error ? e.message : 'unknown error';
                        if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
                            groqRateLimited = true;
                        }
                        console.warn(`⚠️ AI Analysis Warning for ${place.title}:`, message);
                        analysis.analysisReport = message.includes("GROQ_API_KEY")
                            ? "Error de Configuración: La API de Inteligencia no está configurada. Contacta al soporte."
                            : `Error AI: ${message}`;
                    }

                    // Prepare DB Object with all enriched data
                    const newLead = {
                        nombre: place.title,
                        // direccion: place.address, // REMOVED: Column does not exist in DB
                        telefono: place.phoneNumber,
                        email: scraped.emails[0] || null,
                        sitio_web: place.website,
                        categoria: place.category,
                        puntaje_oportunidad: analysis.score,
                        razon_ia: analysis.analysisReport,
                        estado: 'detected',
                        source_data: {
                            address: place.address, // ADDED: Store address in JSON
                            // Scraped data
                            emails: scraped.emails,
                            whatsapp: scraped.whatsapp,
                            instagram: scraped.instagram,
                            facebook: scraped.facebook,
                            hasSSL: scraped.hasSSL,
                            techStack: scraped.techStack,
                            // Google data
                            rating: place.rating,
                            reviewCount: place.userRatingCount,
                            // AI Analysis
                            analysis,
                            vibe: analysis.vibe,
                            opportunity: analysis.opportunity
                        },
                        zona_busqueda: location,
                        revisado_por: scannedBy || 'Sistema',
                        fuente: 'radar'
                    };

                    // Insert into DB
                    const { data: savedLead, error } = await supabase
                        .from('leads')
                        .insert(newLead)
                        .select()
                        .single();

                    const leadForUI = {
                        ...(savedLead || newLead),
                        id: savedLead?.id || `temp_${Date.now()}_${Math.random()}`,
                        title: newLead.nombre,
                        address: place.address, // Ensure address is passed to UI
                        website: newLead.sitio_web,
                        rating: place.rating,
                        userRatingCount: place.userRatingCount,
                        // Enriched contact data
                        emails: scraped.emails,
                        whatsapp: scraped.whatsapp,
                        instagram: scraped.instagram,
                        facebook: scraped.facebook,
                        techStack: scraped.techStack,
                        hasSSL: scraped.hasSSL,
                        // Full analysis
                        analysis
                    };

                    if (error) {
                        console.error(`❌ DB INSERT ERROR for ${place.title}:`, error.message);
                    }

                    return leadForUI;
            }
        );

        const processedLeads: LeadForUI[] = [];
        let failedCount = 0;
        leadResults.forEach((result, idx) => {
            if (result.status === 'fulfilled') {
                processedLeads.push(result.value);
                return;
            }

            failedCount += 1;
            const failedPlace = newPlaces[idx];
            console.error(`Error processing ${failedPlace?.title || `lead_${idx}`}:`, result.reason);
        });

        // Sort by Score (highest opportunity first)
        processedLeads.sort((a, b) => (b.analysis.score || 0) - (a.analysis.score || 0));

        return NextResponse.json({
            success: true,
            leads: processedLeads,
            failed_count: failedCount,
            debug: {
                serperFound: places.length,
                dbExcluded: existingLeads?.length || 0,
                newCandidates: newPlaces.length
            }
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('Radar Error:', error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
