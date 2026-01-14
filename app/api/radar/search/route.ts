import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;

export async function POST(req: Request) {
    try {
        const { query, location } = await req.json();
        const supabase = createClient();

        if (!query || !location) {
            return NextResponse.json({ error: 'Missing query or location' }, { status: 400 });
        }

        console.log(`📡 RADAR: Scanning for "${query}" in "${location}"...`);

        // 1. SEARCH WITH SERPER (Max 25)
        const searchTerm = `${query} en ${location}`;
        const serperResponse = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: searchTerm, gl: 'cl', hl: 'es', num: 25 }),
        });

        if (!serperResponse.ok) {
            throw new Error('Serper API failed');
        }

        const serperData = await serperResponse.json();
        const places = serperData.places || [];
        console.log(`📡 RADAR: Found ${places.length} raw results.`);

        // 2. FILTER DUPLICATES (Check DB)
        // Fetch all existing leads (active, discarded, detected) to avoid repetition
        const { data: existingLeads } = await supabase
            .from('leads')
            .select('nombre, sitio_web, direccion');

        const newPlaces = places.filter((place: any) => {
            // Check by Website (exact match)
            if (place.website && existingLeads?.some(l => l.sitio_web === place.website)) return false;
            // Check by Name + Address overlap (fuzzy match approximation)
            if (existingLeads?.some(l => l.nombre === place.title)) return false;
            return true;
        });

        console.log(`📡 RADAR: ${newPlaces.length} new candidates after deduplication.`);

        if (newPlaces.length === 0) {
            return NextResponse.json({ success: true, leads: [], message: 'No se encontraron nuevos leads en esta zona.' });
        }

        // 3. ANALYZE & PERSIST (Parallel)
        const processedLeads: any[] = [];

        await Promise.all(
            newPlaces.map(async (place: any) => {
                try {
                    // AI Analysis
                    const prompt = `
            Act as a Lead Qualification Expert ("HojaCero").
            Analyze: ${place.title} (Rating: ${place.rating}, Type: ${place.category})
            Website: ${place.website || 'NONE'}
            
            Task:
            1. Score (0-100). High if NO website or LOW rating (<4.0).
            2. Vibe (Professional, Modern, Outdated, Local).
            3. Opportunity (Web Design, SEO, Reputation).
            
            Output JSON: {"score": number, "reason": "string (Spanish)", "opportunity": "string", "vibe": "string"}
          `;

                    let analysis = { score: 50, reason: "Análisis pendiente", opportunity: "General", vibe: "N/A" };
                    try {
                        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                        });
                        const aiData = await aiResponse.json();
                        const aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                        analysis = JSON.parse(aiText.replace(/```json/g, '').replace(/```/g, '').trim());
                    } catch (e) {
                        console.warn(`AI Analysis failed for ${place.title}`, e);
                    }

                    // Prepare DB Object
                    const newLead = {
                        nombre: place.title,
                        direccion: place.address,
                        telefono: place.phoneNumber,
                        sitio_web: place.website,
                        categoria: place.category,
                        puntaje_oportunidad: analysis.score,
                        razon_ia: analysis.reason,
                        estado: 'detected', // RADAR STATE (Not yet in Agenda)
                        source_data: { analysis, vibe: analysis.vibe, opportunity: analysis.opportunity }, // Helper for UI
                        zona_busqueda: location,
                        fuente: 'radar'
                    };

                    // Insert into DB
                    const { data: savedLead, error } = await supabase
                        .from('leads')
                        .insert(newLead)
                        .select()
                        .single();

                    if (!error && savedLead) {
                        // Normalize for UI
                        processedLeads.push({
                            ...savedLead,
                            title: savedLead.nombre,
                            address: savedLead.direccion,
                            website: savedLead.sitio_web,
                            rating: place.rating,
                            userRatingCount: place.userRatingCount,
                            analysis: {
                                score: savedLead.puntaje_oportunidad,
                                reason: savedLead.razon_ia,
                                opportunity: analysis.opportunity,
                                vibe: analysis.vibe
                            }
                        });
                    }

                } catch (err) {
                    console.error(`Error processing ${place.title}`, err);
                }
            })
        );

        // Sort by Score
        processedLeads.sort((a, b) => (b.analysis.score || 0) - (a.analysis.score || 0));

        return NextResponse.json({ success: true, leads: processedLeads });

    } catch (error: any) {
        console.error('Radar Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
