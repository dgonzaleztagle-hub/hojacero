import { NextResponse } from 'next/server';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

export async function POST(req: Request) {
    try {
        const { url, name } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL es requerida para previsualizar' }, { status: 400 });
        }

        console.log(`🔍 PREVIEW: Analyzing ${url} for "${name}"...`);

        // 1. Scrape
        const scraped = await scrapeContactInfo(url);

        // 2. AI Analyze
        const placeMock = { title: name || 'Desconocido', website: url, category: 'Manual Entry' };
        const analysis = await analyzeLeadWithGroq(placeMock, scraped);

        return NextResponse.json({
            success: true,
            preview: {
                scraped,
                analysis
            }
        });

    } catch (error: any) {
        console.error('Preview Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
