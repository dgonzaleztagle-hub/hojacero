import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

export async function POST(req: Request) {
    try {
        const { leadId } = await req.json();
        const supabase = await createClient();

        if (!leadId) {
            return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
        }

        // 1. Fetch current lead data
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('id, nombre, sitio_web, categoria, source_data')
            .eq('id', leadId)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        if (!lead.sitio_web) {
            return NextResponse.json({ error: 'Lead has no website to scan' }, { status: 400 });
        }

        console.log(`🔄 RESCAN: Starting re-scan for ${lead.nombre} (${lead.sitio_web})...`);

        // 2. Scrape Website
        const scraped = await scrapeContactInfo(lead.sitio_web);

        // 3. AI Analyze
        const placeMock = {
            title: lead.nombre,
            website: lead.sitio_web,
            category: lead.categoria || 'Business',
            // Preserve existing rating info if available in source_data, else defaults
            rating: lead.source_data?.google_place?.rating || 0,
            userRatingCount: lead.source_data?.google_place?.userRatingCount || 0
        };
        const analysis = await analyzeLeadWithGroq(placeMock, scraped);

        // 4. Update Database
        // Merge with existing source_data to preserve other fields like google_place or deep_analysis
        const updatedSourceData = {
            ...lead.source_data,
            scraped: scraped,
            analysis: analysis,
            last_rescan_date: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update({ source_data: updatedSourceData })
            .eq('id', leadId);

        if (updateError) {
            throw updateError;
        }

        console.log(`✅ RESCAN: Success for ${lead.nombre}`);

        return NextResponse.json({
            success: true,
            data: {
                scraped,
                analysis,
                source_data: updatedSourceData
            }
        });

    } catch (error: any) {
        console.error('Rescan Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
