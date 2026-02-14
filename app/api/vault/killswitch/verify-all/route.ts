import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

function normalizeSiteUrl(siteUrl: string): string {
    const trimmed = siteUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
}

async function probeSite(url: string): Promise<{ active: boolean; status: number | null; method: 'HEAD' | 'GET' | 'none' }> {
    try {
        const headRes = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000),
            cache: 'no-store'
        });
        if (headRes.ok) return { active: true, status: headRes.status, method: 'HEAD' };
    } catch {
        // continue to GET fallback
    }

    try {
        const getRes = await fetch(url, {
            method: 'GET',
            signal: AbortSignal.timeout(5000),
            cache: 'no-store',
            redirect: 'follow'
        });
        return { active: getRes.ok, status: getRes.status, method: 'GET' };
    } catch {
        return { active: false, status: null, method: 'none' };
    }
}

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getAdminClient();
        const { data: sites, error } = await supabase
            .from('monitored_sites')
            .select('id, client_name, site_url, site_status(is_active, reason)')
            .eq('status', 'active');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const results: Array<{
            client_id: string;
            client_name: string;
            target_url: string;
            database_state: boolean;
            production_state: boolean;
            synced: boolean;
            probe_status: number | null;
            probe_method: 'HEAD' | 'GET' | 'none';
            reason: string | null;
        }> = [];

        let mismatchCount = 0;
        for (const site of sites || []) {
            if (!site.site_url) continue;

            const targetUrl = normalizeSiteUrl(site.site_url);
            const probe = await probeSite(targetUrl);
            const statusObj = Array.isArray(site.site_status) ? site.site_status[0] : site.site_status;
            const databaseStateActive = statusObj?.is_active !== false;
            const productionStateActive = probe.active;
            const synced = databaseStateActive === productionStateActive;

            if (!synced) {
                mismatchCount += 1;
                console.error('[killswitch] MISMATCH detected', {
                    client_id: site.id,
                    client_name: site.client_name,
                    database_state: databaseStateActive,
                    production_state: productionStateActive,
                    target_url: targetUrl,
                    http_status: probe.status
                });
            }

            results.push({
                client_id: site.id,
                client_name: site.client_name,
                target_url: targetUrl,
                database_state: databaseStateActive,
                production_state: productionStateActive,
                synced,
                probe_status: probe.status,
                probe_method: probe.method,
                reason: statusObj?.reason || null
            });
        }

        return NextResponse.json({
            success: true,
            checked: results.length,
            mismatches: mismatchCount,
            checked_at: new Date().toISOString(),
            results
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('[killswitch] verify-all error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
