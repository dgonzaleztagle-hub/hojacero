/**
 * Test del Portal Inmobiliario Scraper
 * 
 * Ejecutar: npx tsx test-portal-scraper.ts
 */

import { getComercialPropertyData, normalizarComuna } from './lib/scrapers/portal-inmobiliario-scraper';

async function main() {
    console.log('🚀 TESTING Portal Inmobiliario Scraper\n');

    const comuna = 'lampa';
    const comunaNormalizada = normalizarComuna(comuna);

    console.log(`📍 Comuna: ${comuna} → ${comunaNormalizada}\n`);

    try {
        const data = await getComercialPropertyData(comunaNormalizada);

        console.log('\n📊 RESULTADOS:\n');

        console.log('🏢 VENTA:');
        console.log(`  - Precio promedio: ${data.venta.precio_promedio_uf} UF`);
        console.log(`  - Precio UF/m²: ${data.venta.precio_uf_m2} UF/m²`);
        console.log(`  - Muestra: ${data.venta.muestra} propiedades`);

        if (data.venta.propiedades.length > 0) {
            console.log(`\n  Ejemplo (primera propiedad):`);
            const ejemplo = data.venta.propiedades[0];
            console.log(`    - Título: ${ejemplo.titulo}`);
            console.log(`    - Precio: ${ejemplo.precio} ${ejemplo.moneda}`);
            console.log(`    - Metros: ${ejemplo.metros} m²`);
            console.log(`    - Ubicación: ${ejemplo.ubicacion}`);
            console.log(`    - Link: ${ejemplo.link}`);
        }

        console.log('\n🏪 ARRIENDO:');
        console.log(`  - Precio promedio: ${data.arriendo.precio_promedio_uf} UF`);
        console.log(`  - Precio UF/m²: ${data.arriendo.precio_uf_m2} UF/m²`);
        console.log(`  - Muestra: ${data.arriendo.muestra} propiedades`);

        if (data.arriendo.propiedades.length > 0) {
            console.log(`\n  Ejemplo (primera propiedad):`);
            const ejemplo = data.arriendo.propiedades[0];
            console.log(`    - Título: ${ejemplo.titulo}`);
            console.log(`    - Precio: ${ejemplo.precio} ${ejemplo.moneda}`);
            console.log(`    - Metros: ${ejemplo.metros} m²`);
            console.log(`    - Ubicación: ${ejemplo.ubicacion}`);
            console.log(`    - Link: ${ejemplo.link}`);
        }

        console.log('\n✅ TEST COMPLETADO');

    } catch (error) {
        console.error('\n❌ ERROR:', error);
        process.exit(1);
    }
}

main();
