/**
 * Script de prueba para Foursquare Places API
 * Ejecutar con: npx tsx scripts/test-foursquare.ts
 * 
 * IMPORTANTE: Necesitas una API Key de Foursquare
 * Obtenerla en: https://foursquare.com/developers/signup
 */

import { getFoursquareCompetitors } from '../lib/scrapers/foursquare-scraper';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
    console.log('🚀 Iniciando prueba del Foursquare Places API\n');

    // Coordenadas de La Roblería 1501, Lampa (Larapinta)
    const lat = -33.2918564;
    const lng = -70.8741548;

    // API Key de Foursquare (debe estar en .env.local)
    const apiKey = process.env.FOURSQUARE_API_KEY;

    if (!apiKey) {
        console.log('❌ Error: FOURSQUARE_API_KEY no está configurada en .env.local');
        console.log('\n📝 Instrucciones para obtener API Key gratis (SIN TARJETA):');
        console.log('1. Ir a: https://foursquare.com/developers/signup');
        console.log('2. Crear cuenta con email');
        console.log('3. Crear un proyecto');
        console.log('4. Copiar la API Key');
        console.log('5. Agregar a .env.local: FOURSQUARE_API_KEY=fsq3...');
        return;
    }

    console.log(`📍 Coordenadas: ${lat}, ${lng} (Larapinta, Lampa)\n`);

    try {
        const result = await getFoursquareCompetitors(lat, lng, apiKey);

        console.log('\n========================================');
        console.log('📊 RESULTADOS DEL ANÁLISIS (FOURSQUARE)');
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
        console.log(`   → ¡Oportunidad! Menor competencia`);
        console.log(`🔴 OCÉANO ROJO: ${result.oceanoRojo?.toUpperCase() || 'No detectado'}`);
        console.log(`   → Cuidado: Alta saturación`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
