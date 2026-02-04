import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * HOJACERO CMS - CONTENT LOADER
 * Lee el archivo de contenido localmente.
 */

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data/cms-content.json');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Archivo de contenido no encontrado' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(fileContent));

    } catch (error) {
        return NextResponse.json({ error: 'Error leyendo contenido' }, { status: 500 });
    }
}
