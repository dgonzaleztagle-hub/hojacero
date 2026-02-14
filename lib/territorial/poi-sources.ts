export async function getCompetitors(
  lat: number,
  lng: number,
  businessType: string,
  radius: number = 500
): Promise<Array<Record<string, unknown>>> {
  const typeMap: Record<string, string> = {
    restaurant: 'amenity=restaurant',
    cafe: 'amenity=cafe',
    fast_food: 'amenity=fast_food',
    pharmacy: 'amenity=pharmacy',
    supermarket: 'shop=supermarket',
    gym: 'leisure=fitness_centre',
    hairdresser: 'shop=hairdresser',
    clothes: 'shop=clothes',
    bakery: 'shop=bakery'
  };

  const tag = typeMap[businessType] || 'shop';
  const query = `[out:json][timeout:15];(node(around:${radius},${lat},${lng})[${tag}];way(around:${radius},${lat},${lng})[${tag}];);out body 20;`;

  console.log('🔍 Overpass Query:', { businessType, tag, radius, lat, lng });

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();
    console.log('📊 Overpass resultados:', data.elements?.length || 0, 'lugares encontrados');

    const results = (data.elements || []).map((e: Record<string, unknown>) => {
      const tags = (e.tags || {}) as Record<string, unknown>;
      return {
        name: (tags.name as string) || 'Sin nombre',
        brand: tags.brand as string | undefined,
        cuisine: tags.cuisine as string | undefined,
        opening_hours: tags.opening_hours as string | undefined,
        lat: e.lat,
        lng: e.lon
      };
    }).slice(0, 15);

    console.log('✅ Retornando', results.length, 'competidores con coordenadas');
    return results;
  } catch (error) {
    console.error('❌ Error en Overpass:', error);
    return [];
  }
}

export async function getAnchors(
  lat: number,
  lng: number,
  radius: number = 1000
): Promise<Array<Record<string, unknown>>> {
  const query = `[out:json][timeout:15];(
        node(around:${radius},${lat},${lng})[amenity=hospital];
        node(around:${radius},${lat},${lng})[amenity=school];
        node(around:${radius},${lat},${lng})[shop=mall];
        node(around:${radius},${lat},${lng})[amenity=university];
    );out body 10;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();

    return ((data.elements || []) as Array<Record<string, unknown>>).map((e) => {
      const tags = (e.tags || {}) as Record<string, unknown>;
      return {
        name: (tags.name as string) || 'Sin nombre',
        type: (tags.amenity as string) || (tags.shop as string)
      };
    }).slice(0, 10);
  } catch {
    return [];
  }
}
