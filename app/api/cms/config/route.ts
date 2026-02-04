import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * HOJACERO CMS - CONFIG LOADER
 * Lee el archivo de configuración del panel localmente.
 */

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data/cms-config.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent));

    } catch (error) {
        return NextResponse.json({ error: 'Error leyendo configuración' }, { status: 500 });
    }
}
