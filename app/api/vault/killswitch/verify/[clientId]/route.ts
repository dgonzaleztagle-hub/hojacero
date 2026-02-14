import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function normalizeSiteUrl(siteUrl: string): string {
    const trimmed = siteUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

async function probeSite(url: string): Promise<{ active: boolean; status: number | null; method: 'HEAD' | 'GET' | 'none' }> {
    try {
        const headRes = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000),
            cache: 'no-store'
        });
        if (headRes.ok) {
            return { active: true, status: headRes.status, method: 'HEAD' };
        }
    } catch {
        // HEAD failed, continue with GET fallback
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { clientId } = await params;
        if (!clientId) {
            return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });
        }

        const { data: siteStatus, error: statusError } = await supabase
            .from('site_status')
            .select('is_active, reason, updated_at')
            .eq('id', clientId)
            .single();

        if (statusError || !siteStatus) {
            return NextResponse.json({ error: 'Site status not found' }, { status: 404 });
        }

        const { data: siteData, error: siteError } = await supabase
            .from('monitored_sites')
            .select('id, client_name, site_url')
            .eq('id', clientId)
            .single();

        if (siteError || !siteData?.site_url) {
            return NextResponse.json({ error: 'Client site not found' }, { status: 404 });
        }

        const targetUrl = normalizeSiteUrl(siteData.site_url);
        const probe = await probeSite(targetUrl);

        const databaseStateActive = siteStatus.is_active !== false;
        const productionStateActive = probe.active;
        const synced = databaseStateActive === productionStateActive;

        if (!synced) {
            console.error(`[killswitch] MISMATCH for ${siteData.client_name} (${clientId})`, {
                database_state: databaseStateActive,
                production_state: productionStateActive,
                target_url: targetUrl,
                http_status: probe.status
            });
        }

        return NextResponse.json({
            success: true,
            client_id: clientId,
            client_name: siteData.client_name,
            target_url: targetUrl,
            database_state: databaseStateActive,
            production_state: productionStateActive,
            synced,
            probe_status: probe.status,
            probe_method: probe.method,
            reason: siteStatus.reason || null,
            checked_at: new Date().toISOString()
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('[killswitch] verify error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
