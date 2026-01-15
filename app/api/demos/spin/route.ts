import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { industry_slug } = await request.json();

        if (!industry_slug) {
            return NextResponse.json({ error: 'Industry slug is required' }, { status: 400 });
        }

        // 1. Get Industry ID
        const { data: industry, error: indError } = await supabase
            .from('demo_industries')
            .select('id, name')
            .eq('slug', industry_slug)
            .single();

        if (indError || !industry) {
            return NextResponse.json({ error: `Industry not found: ${industry_slug}` }, { status: 404 });
        }

        // 2. Fetch Prompts (Art Direction, Copy, Image)
        const { data: prompts, error: promptError } = await supabase
            .from('demo_prompts')
            .select('category, content, description')
            .eq('industry_id', industry.id)
            .eq('is_active', true);

        if (promptError) {
            return NextResponse.json({ error: promptError.message }, { status: 500 });
        }

        // 3. The Roulette Logic: Pick Random Art Direction
        const artDirections = prompts.filter(p => p.category === 'art_direction');
        const copywritings = prompts.filter(p => p.category === 'copywriting');
        const imageGens = prompts.filter(p => p.category === 'image_generation');

        if (artDirections.length === 0) {
            return NextResponse.json({ error: 'No art direction prompts found for this industry' }, { status: 500 });
        }

        // Spin the wheel!
        const selectedArt = artDirections[Math.floor(Math.random() * artDirections.length)];
        const selectedCopy = copywritings.length > 0 ? copywritings[0] : null;
        const selectedImage = imageGens.length > 0 ? imageGens[0] : null;

        return NextResponse.json({
            industry: industry.name,
            selected_style: {
                name: selectedArt.description,
                art_direction: selectedArt.content,
                copywriting: selectedCopy?.content,
                image_prompt: selectedImage?.content
            },
            debug_info: {
                total_styles_available: artDirections.length
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
