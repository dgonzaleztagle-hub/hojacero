/**
 * Script de prueba para TomTom Places API
 * Ejecutar con: npx tsx scripts/test-tomtom.ts
 */

import { getTomTomCompetitors } from '../lib/scrapers/tomtom-scraper';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('🚀 Iniciando prueba del TomTom Places API\n');

    // Coordenadas de La Roblería 1501, Lampa (Larapinta)
    const lat = -33.2918564;
    const lng = -70.8741548;

    // API Key (usamos la que el usuario puso en TOMTOM_API_KEY o la que sospechamos)
    const apiKey = process.env.TOMTOM_API_KEY || process.env.FOURSQUARE_API_KEY;

    if (!apiKey) {
        console.log('❌ Error: API Key no configurada');
        return;
    }

    console.log(`📍 Coordenadas: ${lat}, ${lng} (Larapinta, Lampa)\n`);

    try {
        const result = await getTomTomCompetitors(lat, lng, apiKey);

        console.log('\n========================================');
        console.log('📊 RESULTADOS DEL ANÁLISIS (TOMTOM)');
        console.log('========================================\n');

        console.log(`Total restaurantes encontrados: ${result.total}\n`);

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
        console.error('❌ Error en TomTom:', error);
    }
}

main();
