import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nombre, sitio_web, nombre_contacto, telefono, analisis_inmediato } = body;
        const supabase = await createClient();

        if (!nombre) {
            return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
        }

        console.log(`📝 MANUAL LEAD: Adding "${nombre}"...`);

        // Create base lead object
        const newLead = {
            nombre,
            sitio_web: sitio_web || null,
            nombre_contacto: nombre_contacto || null,
            telefono: telefono || null,
            email: null, // Can be added via editing later or deep scan scraping
            estado: 'ready_to_contact',
            fuente: 'manual',
            zona_busqueda: 'Ingreso Manual',
            source_data: {
                manual_entry: true,
                created_at: new Date().toISOString()
            }
        };

        // Insert
        const { data: savedLead, error } = await supabase
            .from('leads')
            .insert(newLead)
            .select()
            .single();

        if (error) {
            throw new Error(`Database Error: ${error.message}`);
        }

        // --- TRIGGER STANDARD ENRICHMENT (BACKGROUND PROCESS MOCKED) ---
        // Ideally this would be a background job, but for now we await it slightly or fire-and-forget
        // To ensure user sees data immediately, we'll await it (adds 2-4s to request)

        let enrichedData = {};
        if (sitio_web) {
            try {
                // 1. Scrape
                const { scrapeContactInfo, analyzeLeadWithGroq } = require('@/utils/radar'); // Dynamic import or top level
                const scraped = await scrapeContactInfo(sitio_web);

                // 2. AI Analyze
                // Mock a "place" object for the AI function
                const placeMock = { title: nombre, website: sitio_web, category: 'Manual Entry' };
                const analysis = await analyzeLeadWithGroq(placeMock, scraped);

                // 3. Update Lead
                const updatePayload = {
                    email: scraped.emails[0] || null, // Pick first found email
                    telefono: telefono || scraped.whatsapp || null, // Keep manual phone if exists, else scrape
                    puntaje_oportunidad: analysis.score,
                    source_data: {
                        ...savedLead.source_data,
                        scraped,
                        analysis,
                        enriched_at: new Date().toISOString()
                    }
                };

                await supabase.from('leads').update(updatePayload).eq('id', savedLead.id);
                enrichedData = updatePayload;

            } catch (enrichError) {
                console.error("Manual enrichment failed:", enrichError);
            }
        }

        return NextResponse.json({
            success: true,
            lead: { ...savedLead, ...enrichedData },
            message: 'Lead creado y analizado exitosamente'
        });

    } catch (error: any) {
        console.error('Manual Lead Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
