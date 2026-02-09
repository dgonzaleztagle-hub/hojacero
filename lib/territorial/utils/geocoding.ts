/**
 * Geocoding Utilities
 * 
 * Funciones para geocodificar direcciones usando Nominatim (OpenStreetMap).
 */

import { GSE_DATA } from '../data/gse-data';

export interface GeocodeResult {
    lat: number;
    lng: number;
    comuna: string;
    display: string;
}

/**
 * Geocodifica una dirección usando Nominatim
 * @param address Dirección completa a geocodificar
 * @returns Coordenadas, comuna y nombre completo, o null si no se encuentra
 */
export async function geocode(address: string): Promise<GeocodeResult | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=cl&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HojaCero/3.0' } });
    const data = await res.json();

    if (!data.length) return null;

    const { lat, lon, display_name } = data[0];
    const parts = display_name.split(',').map((p: string) => p.trim().toLowerCase());

    // Detectar comuna de forma más precisa
    let comuna = 'Santiago';

    // Priorizar partes de la dirección que coincidan exactamente con GSE_DATA
    for (const part of parts) {
        const cleanPart = part.toLowerCase().replace('comuna de ', '').trim();
        if (GSE_DATA[cleanPart]) {
            comuna = cleanPart.charAt(0).toUpperCase() + cleanPart.slice(1);
            break;
        }
    }

    // Backup: si no se encontró en GSE_DATA, intentar buscar específicamente comunas conocidas
    if (comuna === 'Santiago') {
        const knownComunas = ['lampa', 'colina', 'til til', 'pudahuel'];
        for (const known of knownComunas) {
            if (display_name.toLowerCase().includes(known)) {
                comuna = known.charAt(0).toUpperCase() + known.slice(1);
                break;
            }
        }
    }

    return { lat: parseFloat(lat), lng: parseFloat(lon), comuna, display: display_name };
}
