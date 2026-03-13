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
 * Geocodifica una dirección usando Mapbox (Más robusto que Nominatim)
 * @param address Dirección completa a geocodificar
 * @returns Coordenadas, comuna y nombre completo, o null si no se encuentra
 */
export async function geocode(address: string): Promise<GeocodeResult | null> {
    let lat = 0, lng = 0, display_name = '', comuna = 'Santiago';

    // --- Google Geocoding Attempt ---
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
        console.error('❌ Error: GOOGLE_MAPS_API_KEY no configurado para Google Geocoding.');
        // Do not return here, proceed to Mapbox fallback
    } else {
        try {
            console.log(`🌍 Geocodificando con Google: ${address}`);
            const encodedAddress = encodeURIComponent(address);
            const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=cl&key=${googleApiKey}`;
            
            const res = await fetch(googleUrl);
            const data = await res.json();
            
            if (data.status === 'OK' && data.results?.length > 0) {
                const result = data.results[0];
                lat = result.geometry.location.lat;
                lng = result.geometry.location.lng;
                display_name = result.formatted_address;

                // Detectar comuna de Google
                let foundInGSE = false;
                const addressComponents = result.address_components || [];
                for (const component of addressComponents) {
                    const types = component.types;
                    if (types.includes('locality') || types.includes('administrative_area_level_3')) {
                        const text = component.long_name.toLowerCase();
                        if (GSE_DATA[text]) {
                            comuna = component.long_name;
                            foundInGSE = true;
                            break;
                        }
                    }
                }
                // Backup: si no está en GSE_DATA, usar el componente de nivel 3 como nombre de comuna
                if (!foundInGSE) {
                    const adminLevel3 = addressComponents.find((c: any) => c.types.includes('administrative_area_level_3'));
                    if (adminLevel3) {
                        comuna = adminLevel3.long_name;
                    }
                }

                console.log(`✅ Google éxito: ${comuna} (${lat}, ${lng})`);
                return { lat, lng, comuna, display: display_name };
            }
            console.warn(`⚠️ Google Geocode falló (Status: ${data.status || 'UNKNOWN'}). Usando fallback Mapbox...`);
        } catch (e) {
            console.error('❌ Error en Google Geocode:', e);
            console.warn('⚠️ Error en Google Geocode. Usando fallback Mapbox...');
        }
    }

    // --- FALLBACK: Mapbox ---
    try {
        const mapboxToken = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!mapboxToken) {
            console.error('❌ Error: MAPBOX_TOKEN no configurado para Mapbox Geocoding.');
            return null; // If Mapbox token is also missing, we can't proceed
        }

        console.log(`🌍 Geocodificando con Mapbox (Fallback): ${address}`);
        const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=cl&access_token=${mapboxToken}&limit=1`;
        
        const res = await fetch(mapboxUrl);
        if (!res.ok) {
            console.error(`❌ Mapbox API request failed with status: ${res.status}`);
            return null;
        }
        const data = await res.json();
        
        if (data.features?.length > 0) {
            const feature = data.features[0];
            [lng, lat] = feature.center;
            display_name = feature.place_name;

            // Detectar comuna de Mapbox context
            let foundInGSE = false;
            const context = feature.context || [];
            for (const ctx of context) {
                // Mapbox context items have id, text, wikidata, short_code, etc.
                // We are interested in the 'text' property for comparison.
                if (ctx.text && GSE_DATA[ctx.text.toLowerCase()]) {
                    comuna = ctx.text;
                    foundInGSE = true;
                    break;
                }
            }
            // If not found in GSE_DATA, try to find a 'place' type context item
            if (!foundInGSE) {
                const placeContext = context.find((ctx: any) => ctx.id?.startsWith('place.'));
                if (placeContext) {
                    comuna = placeContext.text;
                }
            }

            console.log(`✅ Mapbox éxito: ${comuna} (${lat}, ${lng})`);
            return { lat, lng, comuna, display: display_name };
        } else {
            console.warn('⚠️ Mapbox Geocode no encontró resultados.');
        }
    } catch (e) {
        console.error('❌ Error en Mapbox Fallback:', e);
    }

    return null;
}
