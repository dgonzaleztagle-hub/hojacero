/**
 * Frequency Estimator
 * 
 * Estima la frecuencia de compra basada en GSE y tipo de negocio.
 * Utilizado para proyecciones de demanda en análisis territorial.
 */

export type Frequency = 'diaria' | 'semanal' | 'quincenal' | 'mensual';

export interface FrequencyEstimate {
    frecuencia: Frequency;
    veces_por_mes: number;
    nota: string;
}

const FREQUENCY_MAP: Record<string, Record<string, FrequencyEstimate>> = {
    restaurant: {
        'ABC1': { frecuencia: 'semanal', veces_por_mes: 8, nota: 'Comen fuera 2 veces/semana' },
        'C1a': { frecuencia: 'semanal', veces_por_mes: 6, nota: 'Comen fuera 1.5 veces/semana' },
        'C2': { frecuencia: 'quincenal', veces_por_mes: 4, nota: 'Ocasional, fines de semana' },
        'C3': { frecuencia: 'quincenal', veces_por_mes: 2, nota: 'Muy ocasional' },
        'D': { frecuencia: 'mensual', veces_por_mes: 1, nota: 'Excepcional' }
    },
    cafe: {
        'ABC1': { frecuencia: 'diaria', veces_por_mes: 20, nota: 'Café diario' },
        'C1a': { frecuencia: 'semanal', veces_por_mes: 12, nota: '3 veces/semana' },
        'C2': { frecuencia: 'semanal', veces_por_mes: 8, nota: '2 veces/semana' },
        'C3': { frecuencia: 'semanal', veces_por_mes: 4, nota: '1 vez/semana' },
        'D': { frecuencia: 'quincenal', veces_por_mes: 2, nota: 'Ocasional' }
    },
    fast_food: {
        'ABC1': { frecuencia: 'semanal', veces_por_mes: 6, nota: 'Conveniencia frecuente' },
        'C2': { frecuencia: 'semanal', veces_por_mes: 8, nota: 'Solución rápida habitual' },
        'C3': { frecuencia: 'semanal', veces_por_mes: 10, nota: 'Opción principal' },
        'D': { frecuencia: 'semanal', veces_por_mes: 6, nota: 'Alternativa accesible' }
    },
    pharmacy: {
        'ABC1': { frecuencia: 'quincenal', veces_por_mes: 3, nota: 'Compras planificadas' },
        'C2': { frecuencia: 'quincenal', veces_por_mes: 2, nota: 'Necesidades básicas' },
        'C3': { frecuencia: 'mensual', veces_por_mes: 2, nota: 'Compras esenciales' },
        'D': { frecuencia: 'mensual', veces_por_mes: 1, nota: 'Solo urgencias' }
    },
    gym: {
        'ABC1': { frecuencia: 'mensual', veces_por_mes: 1, nota: 'Membresía mensual' },
        'C2': { frecuencia: 'mensual', veces_por_mes: 1, nota: 'Membresía mensual' },
        'C3': { frecuencia: 'mensual', veces_por_mes: 1, nota: 'Membresía mensual' }
    },
    supermarket: {
        'ABC1': { frecuencia: 'semanal', veces_por_mes: 6, nota: 'Compras frecuentes' },
        'C2': { frecuencia: 'semanal', veces_por_mes: 4, nota: 'Compra semanal' },
        'C3': { frecuencia: 'quincenal', veces_por_mes: 3, nota: 'Compra quincenal' },
        'D': { frecuencia: 'quincenal', veces_por_mes: 2, nota: 'Compra básica' }
    }
};

/**
 * Estima la frecuencia de compra basada en GSE y tipo de negocio
 * @param gse Grupo socioeconómico
 * @param businessType Tipo de negocio
 * @returns Estimación de frecuencia con veces por mes y nota
 */
export function estimateFrequency(gse: string, businessType: string): FrequencyEstimate {
    const typeMap = FREQUENCY_MAP[businessType];
    if (!typeMap) {
        return {
            frecuencia: 'semanal',
            veces_por_mes: 4,
            nota: 'Estimación genérica'
        };
    }

    return typeMap[gse] || typeMap['C2'] || {
        frecuencia: 'semanal',
        veces_por_mes: 4,
        nota: 'Estimación genérica'
    };
}
