import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin client to bypass RLS and ensure accurate counts
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getAdminClient();

        // Count visits grouping by prospecto
        // Since Supabase (PostgREST) doesn't support easy Group By + Count in one call effectively via JS client without RPC,
        // we will fetch all non-team visits and aggregate in memory (assuming scale is manageable < 100k rows)
        // For larger scale, an RPC function 'get_visit_counts' is better.

        // Query: Select prospecto where is_team_member = false
        const { data, error } = await supabase
            .from('demo_visits')
            .select('prospecto')
            .eq('is_team_member', false);

        if (error) {
            throw error;
        }

        if (!data) {
            return NextResponse.json({ success: true, counts: {} });
        }

        // Aggregate in memory
        const counts: Record<string, number> = {};
        data.forEach((row: { prospecto?: string | null }) => {
            const p = row.prospecto;
            if (p) {
                counts[p] = (counts[p] || 0) + 1;
            }
        });

        return NextResponse.json({
            success: true,
            counts
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Internal Error';
        console.error('Error fetching tracking stats:', e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
