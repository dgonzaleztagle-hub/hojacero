/**
 * Estaciones de Metro de Santiago
 * 
 * Dataset con coordenadas de las principales estaciones de metro
 * de la Región Metropolitana para cálculo de proximidad.
 */

export interface MetroStation {
    name: string;
    lat: number;
    lng: number;
    line: string;
}

export const METRO_STATIONS: MetroStation[] = [
    { name: 'Los Dominicos', lat: -33.4105, lng: -70.5227, line: '1' },
    { name: 'Hernando de Magallanes', lat: -33.4102, lng: -70.5356, line: '1' },
    { name: 'Manquehue', lat: -33.4097, lng: -70.5526, line: '1' },
    { name: 'Escuela Militar', lat: -33.4246, lng: -70.5943, line: '1' },
    { name: 'Tobalaba', lat: -33.4206, lng: -70.6012, line: '1' },
    { name: 'Los Leones', lat: -33.4260, lng: -70.6045, line: '1' },
    { name: 'Pedro de Valdivia', lat: -33.4253, lng: -70.6134, line: '1' },
    { name: 'Manuel Montt', lat: -33.4271, lng: -70.6206, line: '1' },
    { name: 'Salvador', lat: -33.4371, lng: -70.6331, line: '1' },
    { name: 'Baquedano', lat: -33.4373, lng: -70.6391, line: '1' },
    { name: 'Universidad Católica', lat: -33.4413, lng: -70.6416, line: '1' },
    { name: 'Santa Lucía', lat: -33.4421, lng: -70.6453, line: '1' },
    { name: 'Universidad de Chile', lat: -33.4435, lng: -70.6513, line: '1' },
    { name: 'La Moneda', lat: -33.4421, lng: -70.6541, line: '1' },
    { name: 'Los Héroes', lat: -33.4497, lng: -70.6584, line: '1' },
    { name: 'República', lat: -33.4541, lng: -70.6601, line: '1' },
    { name: 'Estación Central', lat: -33.4521, lng: -70.6778, line: '1' },
    { name: 'Parque O\'Higgins', lat: -33.4642, lng: -70.6482, line: '2' },
    { name: 'Franklin', lat: -33.4715, lng: -70.6469, line: '2' },
    { name: 'Vespucio Norte', lat: -33.3845, lng: -70.6096, line: '2' },
    { name: 'Plaza de Puente Alto', lat: -33.5977, lng: -70.5774, line: '4' },
    { name: 'Vicente Valdés', lat: -33.5287, lng: -70.5918, line: '5' },
    { name: 'Plaza Maipú', lat: -33.5169, lng: -70.7561, line: '5' },
];

/**
 * Encuentra la estación de metro más cercana a una coordenada
 * @param lat Latitud
 * @param lng Longitud
 * @param calculateDistance Función para calcular distancia (Haversine)
 * @returns Estación más cercana con distancia en metros, o null si no hay estaciones
 */
export function findNearestMetro(
    lat: number,
    lng: number,
    calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
): { station: string; line: string; distance: number } | null {
    if (METRO_STATIONS.length === 0) return null;

    let nearest = METRO_STATIONS[0];
    let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);

    for (const station of METRO_STATIONS) {
        const distance = calculateDistance(lat, lng, station.lat, station.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = station;
        }
    }

    // Solo considerar "cercano" si está a menos de 1km
    if (minDistance > 1000) return null;

    return {
        station: nearest.name,
        line: nearest.line,
        distance: Math.round(minDistance)
    };
}
