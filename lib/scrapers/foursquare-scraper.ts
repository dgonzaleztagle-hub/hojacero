/**
 * FOURSQUARE PLACES SCRAPER
 * Usa Foursquare Places API para obtener restaurantes por ubicación
 * 
 * Tier Gratis: 10,000 llamadas/mes (Pro endpoints)
 * Sin tarjeta de crédito requerida
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
    fsqId: string;
    source: 'foursquare';
}

export interface SaturationResult {
    total: number;
    byCategory: Record<string, {
        count: number;
        level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'NULA';
        names: string[];
    }>;
    oceanoAzul: string | null;
    oceanoRojo: string | null;
}

// Mapeo de categorías Foursquare a nuestras categorías
const FOURSQUARE_CATEGORY_MAP: Record<string, string> = {
    // Sushi / Japonés
    '13263': 'sushi', // Sushi Restaurant
    '13276': 'sushi', // Japanese Restaurant
    // Chino
    '13099': 'chinese', // Chinese Restaurant
    '13273': 'chinese', // Asian Restaurant
    // Coreano
    '13287': 'korean', // Korean Restaurant
    // Pizza
    '13064': 'pizza', // Pizza Place
    '13236': 'pizza', // Italian Restaurant
    // Burger / Americana
    '13031': 'burger', // Burger Joint
    '13001': 'burger', // American Restaurant
    '13145': 'burger', // Fast Food Restaurant
    // Pollo
    '13073': 'chicken', // Fried Chicken Joint
    '13388': 'chicken', // Wings Joint
    // Mexicano
    '13308': 'mexican', // Mexican Restaurant
    '13352': 'mexican', // Taco Place
    // Peruano
    '13323': 'peruvian', // Peruvian Restaurant
    '13305': 'peruvian', // Latin American Restaurant
    // Mariscos
    '13338': 'seafood', // Seafood Restaurant
    // Saludable
    '13377': 'healthy', // Vegetarian / Vegan Restaurant
    '13379': 'healthy', // Health Food Store
    '13303': 'healthy', // Salad Place
};

// Nuestras categorías principales
const CUISINE_KEYWORDS: Record<string, string[]> = {
    'sushi': ['sushi', 'japonés', 'japanese', 'rolls', 'temaki', 'asian', 'asiática'],
    'chinese': ['chino', 'chinese', 'cantonés', 'wok', 'chifa', 'asian', 'asiática'],
    'korean': ['coreano', 'korean', 'k-food', 'kimchi'],
    'pizza': ['pizza', 'pizzería', 'italiano', 'italian', 'pasta'],
    'burger': ['burger', 'hamburguesa', 'american', 'americana', 'fast food'],
    'chicken': ['pollo', 'chicken', 'broaster', 'frito', 'wings'],
    'mexican': ['mexicano', 'mexican', 'tacos', 'burritos'],
    'peruvian': ['peruano', 'peruvian', 'ceviche', 'lomo'],
    'seafood': ['mariscos', 'seafood', 'pescado', 'fish'],
    'healthy': ['saludable', 'healthy', 'ensaladas', 'vegano', 'vegan', 'fit'],
};

/**
 * Clasifica un restaurante por nombre y categorías
 */
function classifyRestaurant(name: string, categories: string[]): string[] {
    // Primero intentar por ID de categoría Foursquare
    for (const cat of categories) {
        if (FOURSQUARE_CATEGORY_MAP[cat]) {
            return [FOURSQUARE_CATEGORY_MAP[cat]];
        }
    }

    // Luego por keywords en nombre
    const text = name.toLowerCase();
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
 * Busca restaurantes en Foursquare Places API
 */
export async function searchFoursquare(
    lat: number,
    lng: number,
    apiKey: string,
    options: {
        radius?: number;
        limit?: number;
    } = {}
): Promise<RestaurantData[]> {
    const { radius = 3000, limit = 50 } = options;

    console.log(`🍴 Consultando Foursquare para: ${lat}, ${lng}`);

    const restaurants: RestaurantData[] = [];

    try {
        // Categorías de comida en Foursquare (13000 = Food)
        const categoryId = '13000'; // All food categories

        const url = new URL('https://api.foursquare.com/v3/places/search');
        url.searchParams.set('ll', `${lat},${lng}`);
        url.searchParams.set('radius', radius.toString());
        url.searchParams.set('categories', categoryId);
        url.searchParams.set('limit', limit.toString());
        url.searchParams.set('sort', 'DISTANCE');

        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'Authorization': apiKey
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Foursquare error ${response.status}: ${errorText}`);
            throw new Error(`Foursquare API error: ${response.status}`);
        }

        const data = await response.json();
        const places = data.results || [];

        console.log(`📍 Foursquare encontró ${places.length} lugares`);

        for (const place of places) {
            const categoryIds = place.categories?.map((c: any) => c.id.toString()) || [];
            const cuisines = classifyRestaurant(place.name, categoryIds);

            restaurants.push({
                name: place.name,
                category: place.categories?.[0]?.name || 'Restaurant',
                cuisine: cuisines,
                rating: place.rating || null,
                address: place.location?.formatted_address || place.location?.address || '',
                distance: place.distance || 0,
                fsqId: place.fsq_id,
                source: 'foursquare',
            });
        }

        console.log(`✅ Procesados ${restaurants.length} restaurantes de Foursquare`);

    } catch (error: any) {
        console.error(`❌ Error en Foursquare:`, error.message);
        throw error;
    }

    return restaurants;
}

/**
 * Analiza saturación por categoría
 */
export function analyzeSaturation(restaurants: RestaurantData[]): SaturationResult {
    const byCategory: Record<string, { count: number; names: string[] }> = {};

    // Inicializar categorías
    for (const cuisine of Object.keys(CUISINE_KEYWORDS)) {
        byCategory[cuisine] = { count: 0, names: [] };
    }
    byCategory['otros'] = { count: 0, names: [] };

    // Clasificar restaurantes
    for (const r of restaurants) {
        for (const cuisine of r.cuisine) {
            if (!byCategory[cuisine]) {
                byCategory[cuisine] = { count: 0, names: [] };
            }
            byCategory[cuisine].count++;
            if (byCategory[cuisine].names.length < 5) {
                byCategory[cuisine].names.push(r.name);
            }
        }
    }

    // Encontrar océanos
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
            names: data.names,
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

    console.log(`🔵 Océano Azul: ${oceanoAzul} (${minCount} competidores)`);
    console.log(`🔴 Océano Rojo: ${oceanoRojo} (${maxCount} competidores)`);

    return {
        total: restaurants.length,
        byCategory: result,
        oceanoAzul,
        oceanoRojo,
    };
}

/**
 * Función principal: busca y analiza competidores
 */
export async function getFoursquareCompetitors(
    lat: number,
    lng: number,
    apiKey: string
): Promise<SaturationResult> {
    const restaurants = await searchFoursquare(lat, lng, apiKey);
    return analyzeSaturation(restaurants);
}
