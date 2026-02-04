import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { GithubCMS } from '@/lib/cms/github';

/**
 * FLEET EDITOR - MULTI-REPO SAVE
 * Procesa los cambios de un sitio específico de la flota y los persiste en su repo.
 */

export async function POST(req: Request) {
    try {
        const { siteId, data, path = 'data/cms-content.json', message = 'Update from Fleet Editor' } = await req.json();

        if (!siteId || !data) {
            return NextResponse.json({ error: 'Missing siteId or data' }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Obtener configuración del sitio desde Supabase
        const { data: site, error: siteError } = await supabase
            .from('monitored_sites')
            .select('*')
            .eq('id', siteId)
            .single();

        if (siteError || !site) {
            return NextResponse.json({ error: 'Site not found or not authorized' }, { status: 404 });
        }

        if (!site.cms_active) {
            return NextResponse.json({ error: 'CMS not active for this site' }, { status: 403 });
        }

        // 2. Resolver Token de GitHub (Prioridad: Site Specific -> Default)
        // Por ahora usamos el del cliente standalone o uno global de H0 si no está definido
        const token = site.credentials?.github_token || process.env.GITHUB_TOKEN;
        const owner = site.github_owner;
        const repo = site.github_repo;

        if (!token || !owner || !repo) {
            return NextResponse.json({ error: 'Missing GitHub configuration for site' }, { status: 500 });
        }

        // 3. Inicializar Motor Octokit Multi-Repo
        const cms = new GithubCMS({
            auth: token,
            owner,
            repo,
            branch: site.github_branch || 'main'
        });

        // 4. Leer SHA para evitar conflictos (Draft Safe)
        const { sha } = await cms.getFile(path);

        // 5. Ejecutar Commit
        const result = await cms.updateFile(path, data, message, sha);

        return NextResponse.json({
            success: true,
            commit: result.commit.sha,
            message: 'Sincronización con GitHub exitosa'
        });

    } catch (error: any) {
        console.error('[Fleet Save API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
