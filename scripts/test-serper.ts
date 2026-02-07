/**
 * Script de prueba para Serper (Google Maps)
 * Ejecutar con: npx tsx scripts/test-serper.ts
 */

import { getSerperCompetitors } from '../lib/scrapers/serper-scraper';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('🚀 Iniciando prueba técnica definitiva (Google Maps via Serper)\n');

    // Coordenadas y dirección de La Roblería 1501, Lampa (Larapinta)
    const address = 'La Roblería 1501, Lampa, Chile';
    const lat = -33.2918564;
    const lng = -70.8741548;

    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
        console.log('❌ Error: SERPER_API_KEY no configurada');
        return;
    }

    console.log(`📍 Ubicación: ${address} (${lat}, ${lng})\n`);

    const subQueries = [
        `sushi en ${address}`,
        `comida china en ${address}`,
        `comida coreana en ${address}`,
        `pizzeria en ${address}`,
        `hamburguesas en ${address}`,
        `comida rapida en ${address}`,
        `restaurantes en ${address}`
    ];

    try {
        const result = await getSerperCompetitors(lat, lng, address, apiKey, subQueries);

        console.log('\n========================================');
        console.log('📊 RESULTADOS REALES DE LARAPINTA (GOOGLE MAPS)');
        console.log('========================================\n');

        console.log(`Total locales detectados: ${result.total}\n`);

        console.log('🏪 Saturación por categoría:');
        console.log('--------------------------------');

        const sorted = Object.entries(result.byCategory)
            .sort((a, b) => b[1].count - a[1].count);

        for (const [category, data] of sorted) {
            const emoji = data.level === 'CRITICA' ? '🔴' :
                data.level === 'ALTA' ? '🟠' :
                    data.level === 'MEDIA' ? '🟡' : '🔵';

            console.log(`${emoji} ${category.toUpperCase()}: ${data.count} (${data.level})`);
            if (data.names && data.names.length > 0) {
                console.log(`   → ${data.names.slice(0, 3).join(', ')}`);
            }
        }

        console.log('\n========================================');
        console.log(`🔵 OCÉANO AZUL: ${result.oceanoAzul?.toUpperCase() || 'No detectado'}`);
        console.log(`🔴 OCÉANO ROJO: ${result.oceanoRojo?.toUpperCase() || 'No detectado'}`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error en Serper:', error);
    }
}

main();
