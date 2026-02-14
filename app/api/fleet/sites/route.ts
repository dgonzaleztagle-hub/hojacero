import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * FLEET EDITOR - SITES LISTER
 * Retorna todos los sitios que tienen el sello "Edit Ready" (cms_active: true).
 */

export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('monitored_sites')
            .select('*')
            .eq('cms_active', true)
            .order('client_name', { ascending: true });

        if (error) {
            console.error('[Fleet API] Error fetching sites:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ sites: data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('[Fleet API] Critical Error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
