/**
 * TOMTOM PLACES SCRAPER
 * Usa TomTom Search API para obtener restaurantes por ubicación
 * 
 * HojaCero Intelligence © 2026
 */

export interface RestaurantData {
    name: string;
    category: string;
    cuisine: string[];
    rating: number | null;
    address: string;
    distance: number;
    id: string;
    source: 'tomtom';
}

export interface SaturationResult {
    total: number;
    byCategory: Record<string, {
        count: number;
        level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'NULA';
        restaurants: string[];
    }>;
    oceanoAzul: string | null;
    oceanoRojo: string | null;
}

// Mapeo de categorías principales
const CUISINE_KEYWORDS: Record<string, string[]> = {
    'sushi': ['sushi', 'japonés', 'japanese', 'rolls'],
    'chinese': ['chino', 'chinese', 'cantonés', 'wok'],
    'korean': ['coreano', 'korean'],
    'pizza': ['pizza', 'pizzería', 'italiano'],
    'burger': ['burger', 'hamburguesa', 'american'],
    'chicken': ['pollo', 'chicken', 'broaster'],
    'mexican': ['mexicano', 'mexican', 'tacos'],
    'peruvian': ['peruano', 'peruvian'],
    'seafood': ['mariscos', 'seafood'],
    'healthy': ['saludable', 'healthy', 'vegano'],
};

/**
 * Clasifica un restaurante por nombre y categorías de TomTom
 */
function classifyRestaurant(name: string, categories: string[]): string[] {
    const text = `${name} ${categories.join(' ')}`.toLowerCase();
    const matches: string[] = [];

    for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw))) {
            matches.push(cuisine);
        }
    }

    return matches.length > 0 ? matches : ['otros'];
}

/**
 * Calcula nivel de saturación
 */
function getSaturationLevel(count: number): 'CRITICA' | 'ALTA' | 'MEDIA' | 'NULA' {
    if (count > 10) return 'CRITICA';
    if (count >= 5) return 'ALTA';
    if (count >= 1) return 'MEDIA';
    return 'NULA';
}

/**
 * Busca restaurantes en TomTom Search API
 */
export async function searchTomTom(
    lat: number,
    lng: number,
    apiKey: string,
    options: {
        radius?: number;
        limit?: number;
    } = {}
): Promise<RestaurantData[]> {
    const { radius = 3000, limit = 50 } = options;

    console.log(`🗺️ Consultando TomTom para: ${lat}, ${lng}`);

    const restaurants: RestaurantData[] = [];

    try {
        // TomTom Category Search para "RESTAURANT" (7315)
        const categoryId = '7315';
        const url = `https://api.tomtom.com/search/2/categorySearch/restaurant.json?key=${apiKey}&lat=${lat}&lon=${lng}&radius=${radius}&limit=${limit}&categorySet=${categoryId}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ TomTom error ${response.status}: ${errorText}`);
            throw new Error(`TomTom API error: ${response.status}`);
        }

        const data = await response.json();
        const results = data.results || [];

        console.log(`📍 TomTom encontró ${results.length} lugares`);

        for (const res of results) {
            const categories = res.poi?.categories || [];
            const cuisines = classifyRestaurant(res.poi?.name || '', categories);

            restaurants.push({
                name: res.poi?.name || 'Sin nombre',
                category: categories[0] || 'Restaurant',
                cuisine: cuisines,
                rating: null, // TomTom no suele dar rating en API base
                address: res.address?.freeformAddress || '',
                distance: res.dist || 0,
                id: res.id,
                source: 'tomtom',
            });
        }

    } catch (error: any) {
        console.error(`❌ Error en TomTom:`, error.message);
        throw error;
    }

    return restaurants;
}

/**
 * Analiza saturación por categoría
 */
export function analyzeTomTomSaturation(restaurants: RestaurantData[]): SaturationResult {
    const byCategory: Record<string, { count: number; restaurants: string[] }> = {};

    for (const cuisine of Object.keys(CUISINE_KEYWORDS)) {
        byCategory[cuisine] = { count: 0, restaurants: [] };
    }
    byCategory['otros'] = { count: 0, restaurants: [] };

    for (const r of restaurants) {
        for (const cuisine of r.cuisine) {
            if (!byCategory[cuisine]) {
                byCategory[cuisine] = { count: 0, restaurants: [] };
            }
            byCategory[cuisine].count++;
            if (byCategory[cuisine].restaurants.length < 5) {
                byCategory[cuisine].restaurants.push(r.name);
            }
        }
    }

    let oceanoAzul: string | null = null;
    let oceanoRojo: string | null = null;
    let minCount = Infinity;
    let maxCount = 0;

    const result: SaturationResult['byCategory'] = {};

    for (const [cuisine, data] of Object.entries(byCategory)) {
        if (cuisine === 'otros') continue;

        const level = getSaturationLevel(data.count);
        result[cuisine] = {
            count: data.count,
            level,
            restaurants: data.restaurants,
        };

        if (data.count < minCount) {
            minCount = data.count;
            oceanoAzul = cuisine;
        }
        if (data.count > maxCount) {
            maxCount = data.count;
            oceanoRojo = cuisine;
        }
    }

    return {
        total: restaurants.length,
        byCategory: result,
        oceanoAzul,
        oceanoRojo,
    };
}

/**
 * Función principal para TomTom
 */
export async function getTomTomCompetitors(
    lat: number,
    lng: number,
    apiKey: string
): Promise<SaturationResult> {
    const restaurants = await searchTomTom(lat, lng, apiKey);
    return analyzeTomTomSaturation(restaurants);
}
