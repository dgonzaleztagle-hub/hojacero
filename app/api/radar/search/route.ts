import { NextResponse } from 'next/server';

const SERPER_API_KEY = process.env.SERPER_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;

export async function POST(req: Request) {
    try {
        const { query, location } = await req.json();

        if (!query || !location) {
            return NextResponse.json({ error: 'Missing query or location' }, { status: 400 });
        }

        console.log(`📡 RADAR: Scanning for "${query}" in "${location}"...`);

        // 1. SEARCH WITH SERPER (Google Maps Data)
        const searchTerm = `${query} en ${location}`;
        const serperResponse = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: searchTerm, gl: 'cl', hl: 'es', num: 10 }), // CL = Chile
        });

        if (!serperResponse.ok) {
            throw new Error('Serper API failed');
        }

        const serperData = await serperResponse.json();
        const places = serperData.places || [];

        console.log(`📡 RADAR: Found ${places.length} raw results.`);

        // 2. ANALYZE EACH LEAD WITH GEMINI FLASH (Parallel)
        const analyzedLeads = await Promise.all(
            places.map(async (place: any) => {
                try {
                    // Construct prompt for Gemini
                    const prompt = `
            Act as a Lead Qualification Expert for a Web Design Agency ("HojaCero").
            Analyze this business based on the available data:
            - Name: ${place.title}
            - Rating: ${place.rating} (${place.userRatingCount} reviews)
            - Address: ${place.address}
            - Website: ${place.website || 'NO WEBSITE DETECTED'}
            - Category: ${place.category}

            Task:
            1. If WEBSITE is missing, High Opportunity (Score 90+).
            2. If Rating is low (< 3.5), Medium Opportunity (Reputation Management).
            3. Decide "Vibe": "Old School", "Modern", "Corporate", "Local Gem".

            Output JSON ONLY:
            {
                "score": number (0-100),
                "reason": "short explanation in Spanish",
                "opportunity": "Web Design" | "SEO" | "Reputation" | "None",
                "vibe": "string"
            }
          `;

                    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    });

                    const aiData = await aiResponse.json();
                    const aiText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

                    // Cleanup JSON string (remove markdown blocks if any)
                    const jsonString = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
                    const analysis = JSON.parse(jsonString);

                    return {
                        ...place,
                        analysis
                    };

                } catch (err) {
                    console.error(`Error analyzing ${place.title}`, err);
                    return { ...place, analysis: { score: 50, reason: "Error en análisis AI", opportunity: "Review Manual" } };
                }
            })
        );

        // Sort by Opportunity Score (Highest first)
        analyzedLeads.sort((a, b) => (b.analysis.score || 0) - (a.analysis.score || 0));

        return NextResponse.json({ success: true, leads: analyzedLeads });

    } catch (error: any) {
        console.error('Radar Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
