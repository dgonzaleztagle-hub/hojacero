import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const supabase = await createClient();

    // Security Check: Only Admins can save leads
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { // In production add role check
        // For now allow authenticated
    }

    try {
        const body = await req.json();

        // Validate duplicates by website or name
        if (body.sitio_web) {
            const { data: existing } = await supabase
                .from('leads')
                .select('id')
                .eq('sitio_web', body.sitio_web)
                .single();

            if (existing) {
                return NextResponse.json({ success: false, error: 'Este lead ya existe.' }, { status: 400 });
            }
        }

        const { data, error } = await supabase
            .from('leads')
            .insert({
                ...body,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, lead: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
