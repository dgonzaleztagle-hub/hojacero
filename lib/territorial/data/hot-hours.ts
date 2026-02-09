/**
 * Hot Hours (Horarios de Oro) por Tipo de Negocio
 * 
 * Define los horarios de mayor flujo y actividad comercial
 * según el tipo de negocio para análisis territorial.
 */

export interface HotHour {
    hora: string;
    tipo: string;
    volumen: 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
}

export const HOT_HOURS_MAP: Record<string, HotHour[]> = {
    restaurant: [
        { hora: '13:00-14:30', tipo: 'Almuerzo', volumen: 'Alto' },
        { hora: '19:00-21:30', tipo: 'Cena', volumen: 'Crítico' }
    ],
    cafe: [
        { hora: '08:00-10:00', tipo: 'Desayuno', volumen: 'Alto' },
        { hora: '16:00-18:00', tipo: 'Once', volumen: 'Medio' }
    ],
    fast_food: [
        { hora: '12:00-14:00', tipo: 'Almuerzo', volumen: 'Crítico' },
        { hora: '19:00-21:00', tipo: 'Cena', volumen: 'Alto' }
    ],
    bakery: [
        { hora: '07:00-09:00', tipo: 'Desayuno', volumen: 'Crítico' },
        { hora: '18:00-19:30', tipo: 'Salida laboral', volumen: 'Alto' }
    ],
    pharmacy: [
        { hora: '09:00-12:00', tipo: 'Mañana', volumen: 'Alto' },
        { hora: '18:00-20:00', tipo: 'Salida laboral', volumen: 'Crítico' }
    ],
    gym: [
        { hora: '07:00-09:00', tipo: 'Pre-trabajo', volumen: 'Alto' },
        { hora: '18:00-21:00', tipo: 'Post-trabajo', volumen: 'Crítico' }
    ],
    supermarket: [
        { hora: '10:00-12:00', tipo: 'Compra semanal', volumen: 'Alto' },
        { hora: '18:00-20:00', tipo: 'Salida laboral', volumen: 'Crítico' }
    ],
    hairdresser: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '15:00-19:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    beauty: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '15:00-19:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    dental: [
        { hora: '09:00-12:00', tipo: 'Mañana', volumen: 'Alto' },
        { hora: '15:00-18:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    medical: [
        { hora: '09:00-12:00', tipo: 'Mañana', volumen: 'Crítico' },
        { hora: '15:00-18:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    veterinary: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '17:00-20:00', tipo: 'Post-trabajo', volumen: 'Alto' }
    ],
    hardware: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Alto' },
        { hora: '15:00-18:00', tipo: 'Tarde', volumen: 'Medio' }
    ],
    bookstore: [
        { hora: '11:00-14:00', tipo: 'Mediodía', volumen: 'Medio' },
        { hora: '16:00-19:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    optics: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '15:00-18:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    clothes: [
        { hora: '11:00-14:00', tipo: 'Mediodía', volumen: 'Medio' },
        { hora: '16:00-20:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
    car_service: [
        { hora: '08:00-10:00', tipo: 'Mañana temprano', volumen: 'Alto' },
        { hora: '17:00-19:00', tipo: 'Salida laboral', volumen: 'Crítico' }
    ],
    laundry: [
        { hora: '09:00-12:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '18:00-20:00', tipo: 'Salida laboral', volumen: 'Alto' }
    ],
    pet_store: [
        { hora: '10:00-13:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '17:00-20:00', tipo: 'Post-trabajo', volumen: 'Alto' }
    ],
    florist: [
        { hora: '09:00-12:00', tipo: 'Mañana', volumen: 'Medio' },
        { hora: '15:00-18:00', tipo: 'Tarde', volumen: 'Alto' }
    ],
};

/**
 * Obtiene los horarios de oro para un tipo de negocio
 * @param businessType Tipo de negocio
 * @returns Array de horarios de oro o array vacío si no se encuentra
 */
export function getHotHours(businessType: string): HotHour[] {
    return HOT_HOURS_MAP[businessType] || [];
}
