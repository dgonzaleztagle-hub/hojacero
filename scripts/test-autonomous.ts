import { getTocTocProperties } from '../lib/housing-intel/toctoc-scraper';
import { calculateBoundingBox } from '../lib/housing-intel/geo-utils';

async function testAutonomousScraper() {
  const address = 'Avenida Lyon 120, Providencia, Santiago';
  const lat = -33.4241;
  const lng = -70.6065;
  const radius = 1000;
  const bbox = calculateBoundingBox(lat, lng, radius);

  console.log(`🔍 Probando Extracción Autónoma para: ${address}`);
  
  try {
    const properties = await getTocTocProperties({
      centerLat: lat,
      centerLng: lng,
      radiusInMeters: radius,
      bbox,
      type: 'departamento',
      addressHint: address
    });

    console.log(`✅ Resultado: Encontradas ${properties.length} propiedades.`);
    if (properties.length > 0) {
      console.log('Muestra:', properties.slice(0, 2));
    } else {
      console.log('❌ No se encontraron propiedades. El motor podría estar bloqueado o los selectores fallaron.');
    }
  } catch (err) {
    console.error('❌ Error en el test:', err);
  }
}

testAutonomousScraper();
