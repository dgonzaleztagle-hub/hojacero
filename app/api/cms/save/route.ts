import { NextResponse } from 'next/server';
import { GithubCMS } from '@/lib/cms/github';

/**
 * HOJACERO CMS - SAVE API
 * Este endpoint recibe los cambios del panel y los persiste en GitHub.
 * Todo ocurre en el espacio del cliente.
 */

export async function POST(req: Request) {
    try {
        const { data } = await req.json();
        const secret = req.headers.get('x-cms-secret');

        // 1. Validar Secreto de Acceso (Rigor H0 Security)
        if (!secret || secret !== process.env.CMS_ACCESS_KEY) {
            return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
        }

        // 2. Validar variables de entorno (Rigor H0)
        const token = process.env.GITHUB_TOKEN;
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || 'main';

        if (!token || !owner || !repo) {
            console.error('[CMS API] Error: Faltan variables de entorno GITHUB_*');
            return NextResponse.json(
                { error: 'Configuración de servidor incompleta' },
                { status: 500 }
            );
        }

        // 2. Inicializar Motor de Persistencia
        const cms = new GithubCMS({ owner, repo, auth: token, branch });

        // 3. Obtener el SHA actual para el commit (Atómico)
        const filePath = 'data/cms-content.json';
        let currentSha: string | undefined;

        try {
            const current = await cms.getFile(filePath);
            currentSha = current.sha;
        } catch (e) {
            // Si el archivo no existe, lo crearemos (currentSha será undefined)
            console.log('[CMS API] El archivo no existe, se creará uno nuevo.');
        }

        // 4. Ejecutar Commit Quirúrgico
        await cms.updateFile(
            filePath,
            data,
            '🔧 [HojaCero CMS] Cambio de contenido autogestionado',
            currentSha
        );

        return NextResponse.json({
            success: true,
            message: 'Cambios guardados. El sitio se reconstruirá en 1-2 minutos.'
        });

    } catch (error: any) {
        console.error('[CMS API Error]:', error);
        return NextResponse.json(
            { error: 'Error interno al sincronizar con GitHub', details: error.message },
            { status: 500 }
        );
    }
}
