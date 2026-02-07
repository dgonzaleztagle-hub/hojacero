/**
 * Script de prueba para el Delivery Scraper
 * Ejecutar con: npx tsx scripts/test-delivery-scraper.ts
 */

import { getDeliveryCompetitors } from '../lib/scrapers';

async function main() {
    console.log('🚀 Iniciando prueba del Delivery Scraper Engine\n');

    // Coordenadas de La Roblería 1501, Lampa
    const lat = -33.2918564;
    const lng = -70.8741548;

    console.log(`📍 Coordenadas de prueba: ${lat}, ${lng} (Larapinta, Lampa)\n`);

    try {
        const result = await getDeliveryCompetitors(lat, lng);

        console.log('\n========================================');
        console.log('📊 RESULTADOS DEL ANÁLISIS');
        console.log('========================================\n');

        console.log(`Total restaurantes encontrados: ${result.total}\n`);

        console.log('🏪 Saturación por categoría:');
        console.log('--------------------------------');

        // Ordenar por cantidad de competidores
        const sorted = Object.entries(result.byCategory)
            .sort((a, b) => b[1].count - a[1].count);

        for (const [category, data] of sorted) {
            const emoji = data.level === 'CRITICA' ? '🔴' :
                data.level === 'ALTA' ? '🟠' :
                    data.level === 'MEDIA' ? '🟡' : '🔵';

            console.log(`${emoji} ${category.toUpperCase()}: ${data.count} (${data.level})`);
            if (data.restaurants.length > 0) {
                console.log(`   → ${data.restaurants.slice(0, 3).join(', ')}`);
            }
        }

        console.log('\n========================================');
        console.log(`🔵 OCÉANO AZUL: ${result.oceanoAzul?.toUpperCase() || 'No detectado'}`);
        console.log(`   → ¡Oportunidad! Menor competencia en esta categoría`);
        console.log(`🔴 OCÉANO ROJO: ${result.oceanoRojo?.toUpperCase() || 'No detectado'}`);
        console.log(`   → Cuidado: Alta saturación en esta categoría`);
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
