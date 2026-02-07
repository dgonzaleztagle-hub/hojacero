import fetch from 'node-fetch';

async function testTerritorialAPI() {
    console.log('🧪 Prueba Final: Motor Territorial Completo\n');

    const payload = {
        address: 'La Roblería 1501, Lampa, Chile',
        businessType: 'restaurant',
        lat: -33.2918564,
        lng: -70.8741548
    };

    console.log('📍 Enviando análisis territorial para:', payload.address);
    console.log('⏳ Esto puede tomar 30-60 segundos (geocodificación)...\n');

    try {
        const response = await fetch('http://localhost:3000/api/territorial/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error en API:', data);
            return;
        }

        console.log('✅ Análisis completado!\n');
        console.log('📊 RESUMEN:');
        console.log('─────────────────────────────────────');
        console.log(`Comuna: ${data.comuna || 'N/A'}`);
        console.log(`GSE: ${data.gse || 'N/A'}`);
        console.log(`Viabilidad: ${data.viabilidad || 'N/A'}`);

        if (data.saturation) {
            console.log('\n🏪 SATURACIÓN POR CATEGORÍA:');
            for (const [cat, info] of Object.entries(data.saturation.categories || {})) {
                const categoryInfo = info as { count: number; level: string };
                console.log(`  ${cat}: ${categoryInfo.count} locales (${categoryInfo.level})`);
            }
            console.log(`\n🔵 Océano Azul: ${data.saturation.oceanoAzul || 'N/A'}`);
            console.log(`🔴 Océano Rojo: ${data.saturation.oceanoRojo || 'N/A'}`);
        }

        console.log('\n✅ Motor Territorial funcionando correctamente!');
        console.log('📄 Listo para generar PDF de reportes.');

    } catch (error: any) {
        console.error('❌ Error:', error?.message || error);
    }
}

testTerritorialAPI();
