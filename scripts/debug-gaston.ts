/**
 * Script para investigar la discrepancia entre Gastón y Serper
 * Buscamos específicamente a los "fantasmas" que Gastón nombró
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function search(query: string) {
    const response = await fetch('https://google.serper.dev/places', {
        method: 'POST',
        headers: {
            'X-API-KEY': process.env.SERPER_API_KEY!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: query
        })
    });
    return await response.json();
}

async function main() {
    console.log('🕵️ Buscando los locales de Gastón...\n');

    const queries = [
        'Happy Sushi Lampa',
        'Gran China Lampa',
        'Jianhao Lampa',
        'Sushi en Larapinta Lampa',
        'Comida china Larapinta Lampa'
    ];

    for (const q of queries) {
        console.log(`🔍 Query: "${q}"`);
        const data = await search(q);
        const places = data.places || [];
        console.log(`Resultados: ${places.length}`);
        places.slice(0, 3).forEach((p: any) => {
            console.log(`   - ${p.title} (${p.category}) - ${p.address}`);
        });
        console.log('-------------------\n');
    }
}

main();
