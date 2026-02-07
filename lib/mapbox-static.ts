/**
 * MAPBOX STATIC MAPS GENERATOR
 * Genera URLs de mapas estáticos usando Mapbox Static Images API
 * HojaCero Intelligence © 2026
 */

export interface MapMarker {
    lat: number;
    lng: number;
    color?: string; // hex sin #, ej: 'ff0000'
    label?: string;
    size?: 'small' | 'medium' | 'large';
}

export interface StaticMapOptions {
    center: { lat: number; lng: number };
    zoom?: number; // 0-22, default 14
    width?: number; // max 1280
    height?: number; // max 1280
    markers?: MapMarker[];
    style?: 'streets-v12' | 'outdoors-v12' | 'light-v11' | 'dark-v11' | 'satellite-v9';
}

/**
 * Genera URL de mapa estático de Mapbox
 * Docs: https://docs.mapbox.com/api/maps/static-images/
 */
export function generateMapboxStaticUrl(options: StaticMapOptions, token: string): string {
    const {
        center,
        zoom = 14,
        width = 800,
        height = 600,
        markers = [],
        style = 'streets-v12'
    } = options;

    // Construir overlay de markers
    // Formato: pin-{size}+{color}({lng},{lat}) o pin-{size}-{label}+{color}({lng},{lat})
    const markerOverlays = markers.map(m => {
        const sizeCode = m.size === 'small' ? 's' : m.size === 'large' ? 'l' : 'm';
        const color = m.color || 'ff0000';
        const label = m.label || '';

        // Si hay label, usar formato con label, sino formato simple
        if (label) {
            return `pin-${sizeCode}-${label}+${color}(${m.lng},${m.lat})`;
        } else {
            return `pin-${sizeCode}+${color}(${m.lng},${m.lat})`;
        }
    }).join(',');

    // URL base
    const baseUrl = `https://api.mapbox.com/styles/v1/mapbox/${style}/static`;

    // Overlay + centro + zoom + dimensiones
    const overlayPart = markerOverlays ? `${markerOverlays}/` : '';
    const positionPart = `${center.lng},${center.lat},${zoom},0`; // lng,lat,zoom,bearing
    const sizePart = `${width}x${height}@2x`; // @2x para retina

    return `${baseUrl}/${overlayPart}${positionPart}/${sizePart}?access_token=${token}`;
}

/**
 * Genera mapa territorial con ubicación principal y competidores
 */
export function generateTerritorialMap(
    businessLocation: { lat: number; lng: number },
    competitors: Array<{ lat: number; lng: number; name: string }> = [],
    token: string
): string {
    const markers: MapMarker[] = [
        // Pin rojo grande para el negocio principal
        {
            lat: businessLocation.lat,
            lng: businessLocation.lng,
            color: 'ff0000',
            size: 'large'
        },
        // Pins para competidores (máximo 50 para reflejar saturación real)
        ...competitors.slice(0, 50).map(c => ({
            lat: c.lat,
            lng: c.lng,
            color: (c as any).color || '3b82f6', // Color por defecto azul si no se especifica
            size: 'small' as const
        }))
    ];

    return generateMapboxStaticUrl({
        center: businessLocation,
        zoom: 14, // Vista cercana para ver detalles de los pins
        width: 1000,
        height: 600,
        markers,
        style: 'streets-v12'
    }, token);
}
