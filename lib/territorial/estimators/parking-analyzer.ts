/**
 * Parking Analyzer
 * 
 * Analiza la disponibilidad de estacionamiento basándose en el tipo de calle
 * y recomienda el modelo de negocio óptimo (delivery vs local).
 */

export interface ParkingAnalysis {
    tipo_calle: 'avenida' | 'calle' | 'pasaje';
    estacionamiento_estimado: 'Difícil' | 'Moderado' | 'Fácil';
    recomendacion_modelo: string;
    nota: string;
}

/**
 * Analiza el estacionamiento y recomienda modelo de negocio
 * @param address Dirección completa
 * @param businessType Tipo de negocio (opcional, para ajustes específicos)
 * @returns Análisis de estacionamiento con recomendación de modelo
 */
export function analyzeParking(address: string, businessType?: string): ParkingAnalysis {
    const addressLower = address.toLowerCase();

    // Detectar tipo de calle
    if (addressLower.includes('av.') || addressLower.includes('avenida')) {
        return {
            tipo_calle: 'avenida',
            estacionamiento_estimado: 'Difícil',
            recomendacion_modelo: '70% Delivery / 30% Pick-up',
            nota: 'Avenida principal: Requiere bahía o estacionamiento propio. Priorizar modelo delivery.'
        };
    }

    if (addressLower.includes('pasaje') || addressLower.includes('psje') || addressLower.includes('pje')) {
        return {
            tipo_calle: 'pasaje',
            estacionamiento_estimado: 'Fácil',
            recomendacion_modelo: '40% Delivery / 60% Local',
            nota: 'Pasaje residencial: Estacionamiento abundante. Ideal para modelo local con atención presencial.'
        };
    }

    // Default: calle normal
    return {
        tipo_calle: 'calle',
        estacionamiento_estimado: 'Moderado',
        recomendacion_modelo: '50% Delivery / 50% Local',
        nota: 'Calle residencial: Estacionamiento disponible. Modelo híbrido balanceado.'
    };
}
