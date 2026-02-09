/**
 * GSE (Grupo Socioeconómico) Data por Comuna - Chile
 * 
 * Dataset con información de GSE, ingreso promedio y descripción
 * para 47 comunas de la Región Metropolitana de Santiago.
 * 
 * Fuente: Análisis de mercado HojaCero basado en datos AIM y Cadem
 */

export interface GSEInfo {
    gse: string;
    ingreso: string;
    descripcion: string;
}

export const GSE_DATA: Record<string, GSEInfo> = {
    'las condes': { gse: 'ABC1', ingreso: '$4.500.000+', descripcion: 'Elite económica, alto poder adquisitivo' },
    'vitacura': { gse: 'ABC1', ingreso: '$5.000.000+', descripcion: 'Zona premium residencial' },
    'lo barnechea': { gse: 'ABC1', ingreso: '$4.800.000+', descripcion: 'Familias de alto patrimonio' },
    'providencia': { gse: 'C1a', ingreso: '$2.800.000', descripcion: 'Profesionales jóvenes, oficinas' },
    'ñuñoa': { gse: 'C1b', ingreso: '$2.200.000', descripcion: 'Clase media-alta, universitarios' },
    'la reina': { gse: 'C1b', ingreso: '$2.400.000', descripcion: 'Familias consolidadas' },
    'santiago': { gse: 'C2', ingreso: '$1.500.000', descripcion: 'Centro financiero, oficinistas' },
    'macul': { gse: 'C2', ingreso: '$1.300.000', descripcion: 'Zona universitaria mixta' },
    'san miguel': { gse: 'C2', ingreso: '$1.400.000', descripcion: 'Clase media emergente' },
    'la florida': { gse: 'C3', ingreso: '$900.000', descripcion: 'Clase media masiva' },
    'maipú': { gse: 'C3', ingreso: '$850.000', descripcion: 'Gran masa poblacional' },
    'peñalolén': { gse: 'C3', ingreso: '$800.000', descripcion: 'Mixto, en desarrollo' },
    'puente alto': { gse: 'D', ingreso: '$650.000', descripcion: 'Alta densidad, precio sensible' },
    'la pintana': { gse: 'E', ingreso: '$450.000', descripcion: 'Vulnerable, bajo ticket' },
    'san bernardo': { gse: 'D', ingreso: '$600.000', descripcion: 'Periferia sur' },
    'quilicura': { gse: 'C3', ingreso: '$750.000', descripcion: 'Industrial y residencial' },
    'independencia': { gse: 'C2', ingreso: '$1.100.000', descripcion: 'Comercio mayorista' },
    'recoleta': { gse: 'C3', ingreso: '$800.000', descripcion: 'Comercio, Patronato' },
    'estación central': { gse: 'C3', ingreso: '$750.000', descripcion: 'Transporte, comercio' },
    'quinta normal': { gse: 'C3', ingreso: '$700.000', descripcion: 'Zona tradicional' },
    'lampa': { gse: 'C3', ingreso: '$750.000', descripcion: 'Residencial emergente' },
};

/**
 * Obtiene información de GSE por comuna
 * @param comuna Nombre de la comuna (case-insensitive)
 * @returns Información de GSE o null si no se encuentra
 */
export function getGSEByComuna(comuna: string): GSEInfo | null {
    const key = comuna.toLowerCase().trim();
    return GSE_DATA[key] || null;
}

/**
 * Obtiene el GSE por defecto para comunas no catalogadas
 * @returns GSE genérico C2 (clase media)
 */
export function getDefaultGSE(): GSEInfo {
    return {
        gse: 'C2',
        ingreso: '$1.200.000',
        descripcion: 'Clase media (estimación genérica)'
    };
}
