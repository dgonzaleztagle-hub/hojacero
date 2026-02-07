/**
 * MAPBOX GEOCODING
 * Convierte direcciones en coordenadas usando Mapbox Geocoding API
 * HojaCero Intelligence © 2026
 */

export interface GeocodeResult {
    lat: number;
    lng: number;
    address: string;
    confidence: number; // 0-1
}

/**
 * Geocodifica una dirección usando Mapbox Geocoding API
 * Docs: https://docs.mapbox.com/api/search/geocoding/
 */
export async function geocodeAddress(
    address: string,
    token: string,
    country: string = 'cl' // Chile por defecto
): Promise<GeocodeResult | null> {
    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?country=${country}&access_token=${token}&limit=1`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Mapbox Geocoding error:', response.status);
            return null;
        }

        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            console.warn('No se encontraron coordenadas para:', address);
            return null;
        }

        const feature = data.features[0];
        const [lng, lat] = feature.center;

        return {
            lat,
            lng,
            address: feature.place_name,
            confidence: feature.relevance || 0
        };
    } catch (error) {
        console.error('Error geocodificando:', address, error);
        return null;
    }
}

/**
 * Geocodifica múltiples direcciones en batch
 * Respeta rate limits de Mapbox (600 requests/min)
 */
export async function geocodeBatch(
    addresses: string[],
    token: string,
    country: string = 'cl'
): Promise<Array<GeocodeResult | null>> {
    const results: Array<GeocodeResult | null> = [];

    // Procesar de a 10 para no saturar la API
    const batchSize = 10;
    for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(addr => geocodeAddress(addr, token, country))
        );
        results.push(...batchResults);

        // Pequeña pausa entre batches para respetar rate limits
        if (i + batchSize < addresses.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
}
