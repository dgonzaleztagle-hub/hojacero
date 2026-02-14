import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GithubCMS } from '@/lib/cms/github';

/**
 * FLEET EDITOR - MULTI-REPO CONTENT LOADER
 * Lee la configuración y contenido de un sitio específico en GitHub.
 */

export async function POST(req: Request) {
    try {
        const { siteId, paths = ['data/cms-config.json', 'data/cms-content.json'] } = await req.json();

        if (!siteId) {
            return NextResponse.json({ error: 'Missing siteId' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Obtener configuración del sitio
        const { data: site, error: siteError } = await supabase
            .from('monitored_sites')
            .select('*')
            .eq('id', siteId)
            .single();

        if (siteError || !site) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 });
        }

        // 2. Credenciales
        const token = site.credentials?.github_token || process.env.GITHUB_TOKEN;
        const owner = site.github_owner;
        const repo = site.github_repo;

        if (!token || !owner || !repo) {
            return NextResponse.json({ error: 'GitHub config missing' }, { status: 500 });
        }

        const cms = new GithubCMS({
            auth: token,
            owner,
            repo,
            branch: site.github_branch || 'main'
        });

        // 3. Cargar archivos solicitados en paralelo
        const results: Record<string, unknown> = {};
        await Promise.all(paths.map(async (path: string) => {
            try {
                const fileData = await cms.getFile(path);
                results[path] = fileData;
            } catch {
                console.warn(`[Fleet API] File not found: ${path}`);
                results[path] = null;
            }
        }));

        return NextResponse.json({ results });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal error';
        console.error('[Fleet Content API] Error:', error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
