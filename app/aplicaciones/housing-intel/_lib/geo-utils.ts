import { BoundingBox } from './types';

/**
 * Calcula un Bounding Box (Viewport) a partir de un punto central y un radio en metros.
 * Útil para filtrar propiedades en un radio específico en TOCTOC u otros mapas.
 * 
 * @param lat Latitud central
 * @param lng Longitud central
 * @param radiusInMeters Radio en metros (ej: 500 para ~5 cuadras)
 * @returns BoundingBox { sw: {lat, lng}, ne: {lat, lng} }
 */
export function calculateBoundingBox(
  lat: number,
  lng: number,
  radiusInMeters: number
): BoundingBox {
  // Constantes de conversión aproximada
  // 1 grado de latitud ~ 111,111 metros
  // 1 grado de longitud ~ 111,111 * cos(lat) metros
  
  const latDelta = radiusInMeters / 111111;
  const lngDelta = radiusInMeters / (111111 * Math.cos(lat * (Math.PI / 180)));

  return {
    sw: {
      lat: lat - latDelta,
      lng: lng - lngDelta,
    },
    ne: {
      lat: lat + latDelta,
      lng: lng + lngDelta,
    },
  };
}

/**
 * Genera el string de viewport para la URL de TOCTOC
 * Formato: lat1,lng1,lat2,lng2
 */
export function getTocTocViewportString(bbox: BoundingBox): string {
  // TOCTOC suele usar sw_lat,sw_lng,ne_lat,ne_lng
  return `${bbox.sw.lat.toFixed(6)},${bbox.sw.lng.toFixed(6)},${bbox.ne.lat.toFixed(6)},${bbox.ne.lng.toFixed(6)}`;
}

/**
 * Calcula distancia entre dos puntos (Haversine) - Reutilizado para filtrado post-scraping
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}
