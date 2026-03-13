/**
 * SERPER (GOOGLE MAPS) SCRAPER
 * Usa Serper API para obtener datos de Google Maps sin tarjeta de crédito propia
 * 
 * Ventaja: Usa la SERPER_API_KEY que ya tenemos configurada.
 * HojaCero Intelligence © 2026
 */

export interface RestaurantData {
    name: string;
    category: string;
    cuisine: string[];
    rating: number | null;
    address: string;
    distance: string;
    lat?: number;
    lng?: number;
    source: 'google_maps';
}



const CUISINE_KEYWORDS: Record<string, string[]> = {
    'sushi': ['sushi', 'japonés', 'japanese', 'rolls'],
    'chinese': ['chino', 'chinese', 'cantonés', 'wok', 'chifa', 'comida china'],
    'korean': ['coreano', 'korean', 'kimchi'],
    'pizza': ['pizza', 'pizzería', 'italiano'],
    'burger': ['burger', 'hamburguesa', 'american'],
    'chicken': ['pollo', 'chicken', 'broaster'],
    'mexican': ['mexicano', 'mexican', 'tacos', 'burritos'],
    'peruvian': ['peruano', 'peruvian', 'ceviche'],
    'seafood': ['mariscos', 'seafood', 'pescado'],
    'healthy': ['saludable', 'healthy', 'ensaladas', 'vegan', 'vegetariano'],
    'grill': ['parrilla', 'grill', 'asado', 'carnes'],
    'cafe': ['café', 'cafetería', 'coffee', 'pastelería'],
    'arab': ['árabe', 'shawarma', 'falafel', 'kebab'],
    'thai': ['tailandés', 'thai', 'pad thai'],
    'indian': ['indio', 'indian', 'curry'],
    'fast_food': ['comida rápida', 'fast food', 'completos', 'sandwich']
};

function classifyRestaurant(name: string, category: string): string[] {
    const text = `${name} ${category}`.toLowerCase();
    const matches: string[] = [];

    for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw))) {
            matches.push(cuisine);
        }
    }

    return matches.length > 0 ? matches : ['otros'];
}

/**
 * Calcula distancia en km entre dos puntos (Haversine)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Extrae coordenadas de un place de Serper (si las tiene)
 */
function extractCoordinates(place: any): { lat: number; lng: number } | null {
    // 1. Root properties (Formatos más comunes de Serper)
    if (typeof place.latitude === 'number' && typeof place.longitude === 'number') {
        return { lat: place.latitude, lng: place.longitude };
    }

    // 2. Coordinates object
    if (place.coordinates?.latitude && place.coordinates?.longitude) {
        return {
            lat: parseFloat(place.coordinates.latitude),
            lng: parseFloat(place.coordinates.longitude)
        };
    }

    // 3. Fallback a string si vienen como texto en la raíz
    if (place.latitude && place.longitude) {
        return {
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
        };
    }

    return null;
}

/**
 * Busca en Google Maps (via Serper) usando múltiples keywords para evitar omisiones
 */
export async function searchSerperMaps(
    lat: number,
    lng: number,
    address: string,
    apiKey: string,
    specificQueries?: string[],
    maxRadius: number = 5 // Radio máximo en km (ideal para análisis territorial)
): Promise<RestaurantData[]> {
    const searchQueries = specificQueries && specificQueries.length > 0
        ? specificQueries
        : [`restaurantes en ${address}`];

    console.log(`🔍 Iniciando Smart Hunting Serper (${searchQueries.length} búsquedas) para: ${address}`);

    const allPlaces: Map<string, any> = new Map();

    for (const q of searchQueries) {
        try {
            console.log(`   🔎 Query: "${q}" (coordenadas: ${lat}, ${lng})`);
            const response = await fetch('https://google.serper.dev/places', {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: q,
                    location: `${lat},${lng}`,
                    gl: "cl", // Pin to Chile to avoid foreign results (Lampa, Peru or US)
                    hl: "es", // Spanish results
                    num: 20
                })
            });

            const data = await response.json();
            const places = data.places || [];

            for (const place of places) {
                // Validación de GEOCERCANÍA (Evitar que se filtren locales de Santiago centro en Lampa)
                // Si el local tiene coordenadas y está a más de 12km (o el radio definido), ignorar.
                if (place.latitude && place.longitude) {
                    const dist = calculateDistance(lat, lng, place.latitude, place.longitude);
                    if (dist > maxRadius * 1.5) { // Un poco de margen sobre el radio solicitado
                        continue;
                    }
                }

                const key = `${place.title}-${place.address}`.toLowerCase();
                if (!allPlaces.has(key)) {
                    allPlaces.set(key, place);
                }
            }
        } catch (error: any) {
            console.error(`❌ Error en query "${q}":`, error.message);
        }
    }

    const restaurants: RestaurantData[] = [];
    let filteredOut = 0;

    console.log(`📍 Google Maps encontró ${allPlaces.size} lugares únicos tras deduplicación`);

    for (const place of allPlaces.values()) {
        const coords = extractCoordinates(place);
        const distance = coords ? calculateDistance(lat, lng, coords.lat, coords.lng) : null;

        // Filtro de radio: Solo si tenemos coordenadas y están realmente lejos (> radio + margen)
        if (coords && distance && distance > maxRadius * 1.5) {
            filteredOut++;
            console.log(`   🚫 Filtrado por distancia: ${place.title} (${distance.toFixed(1)}km)`);
            continue;
        }

        const category = place.category || 'Restaurant';
        // NO clasificar aquí - dejar que analyzeSaturation lo haga dinámicamente según business_type

        restaurants.push({
            name: place.title,
            category,
            cuisine: [], // Vacío - se llenará en analyzeSaturation
            rating: place.rating || null,
            address: place.address || '',
            lat: coords?.lat,
            lng: coords?.lng,
            distance: distance ? `${distance.toFixed(1)}km` : '',
            source: 'google_maps',
        });
    }

    if (filteredOut > 0) {
        console.log(`\n✅ Filtrados ${filteredOut} lugares fuera del radio de ${maxRadius}km`);
    }
    console.log(`📊 Locales válidos dentro del radio: ${restaurants.length}`);

    return restaurants;
}

export interface SaturationResult {
    total: number;
    byCategory: Record<string, {
        count: number;
        level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'NULA';
        names: string[];
    }>;
    // Tiers con detalles quirúrgicos para interactividad (Paso 2 del plan)
    tiers: {
        local: {
            total: number;
            categories: Record<string, { count: number; details: Array<{ name: string, address: string }> }>;
        };
        delivery: {
            total: number;
            categories: Record<string, { count: number; details: Array<{ name: string, address: string }> }>;
        };
    };
    oceanoAzul: string | null;
    oceanoRojo: string | null;
    restaurants: RestaurantData[];
}

export function analyzeSaturation(restaurants: RestaurantData[], businessType: string = 'restaurant'): SaturationResult {
    // DEBUG: Ver qué business_type está llegando
    console.log('🔍 analyzeSaturation recibió businessType:', businessType);

    // Definir keywords dinámicas según el tipo de negocio
    let categoryKeywords: Record<string, string[]> = {};

    switch (businessType) {
        case 'cafe':
            categoryKeywords = {
                'cafe': ['café', 'cafetería', 'coffee'],
                'heladeria': ['heladería', 'helados', 'gelato', 'ice cream'],
                'pasteleria': ['pastelería', 'repostería', 'pasteles', 'tortas'],
                'confiteria': ['confitería', 'dulces', 'chocolates'],
                'coffee_shop': ['coffee shop', 'espresso', 'latte']
            };
            break;

        case 'fast_food':
            categoryKeywords = {
                'burger': ['burger', 'hamburguesa'],
                'chicken': ['pollo', 'chicken', 'broaster'],
                'completos': ['completos', 'hot dog'],
                'sandwiches': ['sandwich', 'sandwichería'],
                'pizza': ['pizza', 'pizzería']
            };
            break;

        case 'bakery':
            categoryKeywords = {
                'panaderia': ['panadería', 'pan', 'bakery'],
                'pasteleria': ['pastelería', 'repostería', 'pasteles'],
                'confiteria': ['confitería', 'dulces']
            };
            break;

        case 'pharmacy':
            categoryKeywords = {
                'cruz_verde': ['cruz verde'],
                'salcobrand': ['salcobrand'],
                'ahumada': ['ahumada'],
                'dr_simi': ['dr simi', 'similares'],
                'independiente': ['farmacia']
            };
            break;

        case 'gym':
            categoryKeywords = {
                'gimnasio': ['gimnasio', 'gym', 'fitness'],
                'crossfit': ['crossfit'],
                'funcional': ['funcional', 'entrenamiento'],
                'yoga': ['yoga', 'pilates']
            };
            break;

        case 'supermarket':
            categoryKeywords = {
                'ok_market': ['ok market', 'ok'],
                'unimarc': ['unimarc'],
                'tottus': ['tottus'],
                'santa_isabel': ['santa isabel'],
                'independiente': ['minimarket', 'almacén']
            };
            break;

        case 'hairdresser':
            categoryKeywords = {
                'peluqueria': ['peluquería', 'barbería', 'barber'],
                'salon': ['salón', 'estilista'],
                'barberia': ['barbería', 'barber shop']
            };
            break;

        case 'beauty':
            categoryKeywords = {
                'estetica': ['estética', 'spa', 'belleza'],
                'unas': ['uñas', 'manicure', 'pedicure'],
                'depilacion': ['depilación', 'láser']
            };
            break;

        case 'dental':
            categoryKeywords = {
                'clinica': ['clínica dental', 'odontología'],
                'ortodoncista': ['ortodoncia', 'brackets'],
                'dentista': ['dentista', 'dental']
            };
            break;

        case 'medical':
            categoryKeywords = {
                'centro_medico': ['centro médico', 'clínica'],
                'consultorio': ['consultorio', 'médico'],
                'laboratorio': ['laboratorio', 'exámenes']
            };
            break;

        case 'veterinary':
            categoryKeywords = {
                'veterinaria': ['veterinaria', 'veterinario'],
                'clinica_vet': ['clínica veterinaria'],
                'pet_shop': ['pet shop', 'mascotas']
            };
            break;

        case 'hardware':
            categoryKeywords = {
                'ferreteria': ['ferretería', 'materiales'],
                'construccion': ['construcción', 'maestro'],
                'sodimac': ['sodimac', 'homecenter']
            };
            break;

        case 'bookstore':
            categoryKeywords = {
                'libreria': ['librería', 'libros'],
                'papeleria': ['papelería', 'útiles'],
                'feria_chilena': ['feria chilena']
            };
            break;

        case 'optics':
            categoryKeywords = {
                'optica': ['óptica', 'lentes'],
                'gmo': ['gmo'],
                'rotter': ['rotter & krauss']
            };
            break;

        case 'clothes':
            categoryKeywords = {
                'ropa': ['ropa', 'vestuario'],
                'zapateria': ['zapatería', 'calzado'],
                'deportiva': ['deportiva', 'sport']
            };
            break;

        case 'car_service':
            categoryKeywords = {
                'mecanica': ['mecánica', 'taller'],
                'lubricentro': ['lubricentro', 'cambio aceite'],
                'lavado': ['lavado', 'car wash']
            };
            break;

        case 'laundry':
            categoryKeywords = {
                'lavanderia': ['lavandería', 'tintorería'],
                'lavado_seco': ['lavado en seco'],
                'planchado': ['planchado']
            };
            break;

        case 'pet_store':
            categoryKeywords = {
                'mascotas': ['mascotas', 'pet shop'],
                'alimento': ['alimento', 'comida mascotas'],
                'accesorios': ['accesorios', 'juguetes']
            };
            break;

        case 'florist':
            categoryKeywords = {
                'floreria': ['florería', 'flores'],
                'plantas': ['plantas', 'vivero'],
                'arreglos': ['arreglos florales']
            };
            break;

        case 'restaurant':
        default:
            // Keywords originales para restaurantes
            categoryKeywords = {
                'sushi': ['sushi', 'japonés', 'japanese', 'rolls'],
                'chinese': ['chino', 'chinese', 'cantonés', 'wok', 'chifa'],
                'korean': ['coreano', 'korean', 'kimchi'],
                'pizza': ['pizza', 'pizzería', 'italiano'],
                'burger': ['burger', 'hamburguesa', 'american'],
                'chicken': ['pollo', 'chicken', 'broaster'],
                'mexican': ['mexicano', 'mexican', 'tacos', 'burritos'],
                'peruvian': ['peruano', 'peruvian', 'ceviche'],
                'seafood': ['mariscos', 'seafood', 'pescado'],
                'healthy': ['saludable', 'healthy', 'ensaladas', 'vegan'],
                'grill': ['parrilla', 'grill', 'asado', 'carnes'],
                'cafe': ['café', 'cafetería', 'coffee'],
                'arab': ['árabe', 'shawarma', 'falafel', 'kebab'],
                'thai': ['tailandés', 'thai', 'pad thai'],
                'indian': ['indio', 'indian', 'curry'],
                'fast_food': ['comida rápida', 'fast food', 'completos']
            };
            break;
    }

    const byCategory: Record<string, { count: number; names: string[] }> = {};
    const tiers: SaturationResult['tiers'] = {
        local: { total: 0, categories: {} },
        delivery: { total: 0, categories: {} }
    };

    // Inicializar TODAS las categorías dinámicas
    for (const cuisine of Object.keys(categoryKeywords)) {
        byCategory[cuisine] = { count: 0, names: [] };
        tiers.local.categories[cuisine] = { count: 0, details: [] };
        tiers.delivery.categories[cuisine] = { count: 0, details: [] };
    }
    byCategory['otros'] = { count: 0, names: [] };

    for (const r of restaurants) {
        const distNum = r.distance ? parseFloat(r.distance.replace('km', '')) : 99;
        const isLocal = distNum <= 2.5;

        if (isLocal) tiers.local.total++;
        else tiers.delivery.total++;

        // Clasificar usando keywords dinámicas
        const text = `${r.name} ${r.category}`.toLowerCase();
        const matches: string[] = [];

        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(kw => text.includes(kw))) {
                matches.push(category);
            }
        }

        const cuisines = matches.length > 0 ? matches : ['otros'];

        for (const cuisine of cuisines) {
            if (!byCategory[cuisine]) continue;

            byCategory[cuisine].count++;
            byCategory[cuisine].names.push(r.name);

            // Poblar detalles quirúrgicos por tier
            const tierTarget = isLocal ? tiers.local : tiers.delivery;
            if (tierTarget.categories[cuisine]) {
                tierTarget.categories[cuisine].count++;
                tierTarget.categories[cuisine].details.push({
                    name: r.name,
                    address: r.address
                });
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

        const level = data.count >= 5 ? 'ALTA' : data.count >= 3 ? 'MEDIA' : data.count >= 1 ? 'BAJA' : 'NULA';

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

    return {
        total: restaurants.length,
        byCategory: result,
        tiers,
        oceanoAzul,
        oceanoRojo,
        restaurants,
    };
}

// Interface para anclas comerciales
export interface AnchorData {
    name: string;
    category: string;
    address: string;
    source: 'google_maps';
}

// Interface extendida para el análisis territorial
export interface TerritorialData {
    restaurants: RestaurantData[];
    anchors: AnchorData[];
    saturation: SaturationResult;
}

/**
 * Busca anclas comerciales específicas (colegios, supermercados, centros importantes)
 */
export async function searchAnchorPoints(
    lat: number,
    lng: number,
    address: string,
    apiKey: string,
    maxRadius: number = 2 // Radio más pequeño para anclas importantes
): Promise<AnchorData[]> {
    const anchorQueries = [
        `colegios en ${address}`,
        `supermercados en ${address}`,
        `centros comerciales en ${address}`,
        `universidades en ${address}`,
        `hospitales en ${address}`,
        `mall en ${address}`,
        `farmacias en ${address}`,
        `parques en ${address}`,
        `centros deportivos en ${address}`,
        `bibliotecas en ${address}`
    ];

    console.log(`🏢 Buscando anclas comerciales (${anchorQueries.length} categorías) para: ${address}`);

    const allAnchors: Map<string, any> = new Map();

    for (const q of anchorQueries) {
        try {
            console.log(`   🔍 Ancla Query: "${q}"`);
            const response = await fetch('https://google.serper.dev/places', {
                method: 'POST',
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: q,
                    location: `${lat},${lng}`
                })
            });

            const data = await response.json();
            const places = data.places || [];

            for (const place of places) {
                // Deduplicar por nombre y dirección
                const key = `${place.title}-${place.address}`.toLowerCase();
                if (!allAnchors.has(key)) {
                    // Clasificar la categoría basada en la query
                    let category = 'Otros';
                    if (q.includes('colegio')) category = 'Educación';
                    else if (q.includes('supermercado') || q.includes('mall')) category = 'Retail';
                    else if (q.includes('hospital')) category = 'Salud';
                    else if (q.includes('universidad')) category = 'Educación Superior';
                    else if (q.includes('farmacia')) category = 'Salud';
                    else if (q.includes('parque') || q.includes('deportivo')) category = 'Recreación';

                    allAnchors.set(key, {
                        ...place,
                        calculatedCategory: category
                    });
                }
            }
        } catch (error: any) {
            console.error(`❌ Error en ancla query "${q}":`, error.message);
        }
    }

    // Filtrar por distancia si tenemos coordenadas
    const anchors: AnchorData[] = [];
    for (const place of allAnchors.values()) {
        const coords = extractCoordinates(place);
        if (coords) {
            const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
            if (distance <= maxRadius) {
                anchors.push({
                    name: place.title,
                    category: place.calculatedCategory || place.category || 'Otros',
                    address: place.address || '',
                    source: 'google_maps'
                });
            }
        } else {
            // Si no hay coordenadas, incluirlo de todas formas (menos preciso)
            anchors.push({
                name: place.title,
                category: place.calculatedCategory || place.category || 'Otros',
                address: place.address || '',
                source: 'google_maps'
            });
        }
    }

    console.log(`✅ Encontrados ${anchors.length} anclas comerciales relevantes`);
    return anchors;
}

export async function getSerperCompetitors(
    lat: number,
    lng: number,
    address: string,
    apiKey: string,
    specificQueries?: string[],
    maxRadius: number = 5
): Promise<SaturationResult> {
    const restaurants = await searchSerperMaps(lat, lng, address, apiKey, specificQueries, maxRadius);
    return analyzeSaturation(restaurants);
}

/**
 * Obtiene tanto competidores como anclas comerciales para análisis territorial completo
 */
export async function getTerritorialData(
    lat: number,
    lng: number,
    address: string,
    apiKey: string,
    specificQueries?: string[],
    maxRadius: number = 5,
    businessType: string = 'restaurant' // NUEVO: tipo de negocio para clasificación dinámica
): Promise<TerritorialData> {
    // Obtener competidores (restaurantes, etc.)
    const restaurants = await searchSerperMaps(lat, lng, address, apiKey, specificQueries, maxRadius);

    // Obtener anclas comerciales (colegios, supermercados, etc.)
    console.log(`🏢 Buscando anclas en radio de ${maxRadius}km...`);
    const anchors = await searchAnchorPoints(lat, lng, address, apiKey, maxRadius);

    // Analizar saturación con clasificación dinámica según business_type
    const saturation = analyzeSaturation(restaurants, businessType);

    return {
        restaurants,
        anchors,
        saturation
    };
}
