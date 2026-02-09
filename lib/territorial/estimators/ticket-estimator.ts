/**
 * Ticket Estimator
 * 
 * Estima el ticket promedio de compra basado en GSE y tipo de negocio.
 * Utilizado para proyecciones financieras en análisis territorial.
 */

export interface TicketEstimate {
    promedio: number;
    rango: { min: number; max: number };
    nota: string;
}

const TICKET_BASE: Record<string, Record<string, number>> = {
    'ABC1': {
        restaurant: 25000,
        cafe: 8000,
        fast_food: 12000,
        bakery: 6000,
        pharmacy: 15000,
        gym: 50000,
        supermarket: 35000,
        hairdresser: 25000,
        beauty: 30000,
        dental: 80000,
        medical: 60000,
        veterinary: 40000,
        hardware: 20000,
        bookstore: 15000,
        optics: 120000,
        clothes: 40000,
        car_service: 80000,
        laundry: 15000,
        pet_store: 25000,
        florist: 20000
    },
    'C1a': {
        restaurant: 18000,
        cafe: 6000,
        fast_food: 10000,
        bakery: 5000,
        pharmacy: 12000,
        gym: 40000,
        supermarket: 25000,
        hairdresser: 20000,
        beauty: 25000,
        dental: 60000,
        medical: 50000,
        veterinary: 30000,
        hardware: 15000,
        bookstore: 12000,
        optics: 100000,
        clothes: 30000,
        car_service: 60000,
        laundry: 12000,
        pet_store: 20000,
        florist: 15000
    },
    'C1b': {
        restaurant: 16000,
        cafe: 5500,
        fast_food: 9000,
        bakery: 4500,
        pharmacy: 11000,
        gym: 35000,
        supermarket: 22000,
        hairdresser: 18000,
        beauty: 22000,
        dental: 55000,
        medical: 45000,
        veterinary: 28000,
        hardware: 14000,
        bookstore: 11000,
        optics: 90000,
        clothes: 28000,
        car_service: 55000,
        laundry: 11000,
        pet_store: 18000,
        florist: 14000
    },
    'C2': {
        restaurant: 15000,
        cafe: 5000,
        fast_food: 8000,
        bakery: 4000,
        pharmacy: 10000,
        gym: 30000,
        supermarket: 20000,
        hairdresser: 15000,
        beauty: 20000,
        dental: 50000,
        medical: 40000,
        veterinary: 25000,
        hardware: 12000,
        bookstore: 10000,
        optics: 80000,
        clothes: 25000,
        car_service: 50000,
        laundry: 10000,
        pet_store: 15000,
        florist: 12000
    },
    'C3': {
        restaurant: 12000,
        cafe: 4000,
        fast_food: 7000,
        bakery: 3000,
        pharmacy: 8000,
        gym: 25000,
        supermarket: 15000,
        hairdresser: 12000,
        beauty: 15000,
        dental: 40000,
        medical: 30000,
        veterinary: 20000,
        hardware: 10000,
        bookstore: 8000,
        optics: 60000,
        clothes: 20000,
        car_service: 40000,
        laundry: 8000,
        pet_store: 12000,
        florist: 10000
    },
    'D': {
        restaurant: 8000,
        cafe: 3000,
        fast_food: 5000,
        bakery: 2000,
        pharmacy: 5000,
        gym: 20000,
        supermarket: 10000,
        hairdresser: 8000,
        beauty: 10000,
        dental: 30000,
        medical: 25000,
        veterinary: 15000,
        hardware: 8000,
        bookstore: 6000,
        optics: 50000,
        clothes: 15000,
        car_service: 30000,
        laundry: 6000,
        pet_store: 10000,
        florist: 8000
    },
    'E': {
        restaurant: 5000,
        cafe: 2000,
        fast_food: 4000,
        bakery: 1500,
        pharmacy: 3000,
        gym: 15000,
        supermarket: 8000,
        hairdresser: 6000,
        beauty: 8000,
        dental: 25000,
        medical: 20000,
        veterinary: 12000,
        hardware: 6000,
        bookstore: 5000,
        optics: 40000,
        clothes: 12000,
        car_service: 25000,
        laundry: 5000,
        pet_store: 8000,
        florist: 6000
    }
};

/**
 * Estima el ticket promedio basado en GSE y tipo de negocio
 * @param gse Grupo socioeconómico (ABC1, C1a, C1b, C2, C3, D, E)
 * @param businessType Tipo de negocio
 * @returns Estimación de ticket con promedio, rango y nota
 */
export function estimateTicket(gse: string, businessType: string): TicketEstimate {
    const base = TICKET_BASE[gse]?.[businessType] || 10000;

    return {
        promedio: base,
        rango: { min: Math.round(base * 0.7), max: Math.round(base * 1.3) },
        nota: `Estimación basada en GSE ${gse} y benchmarks de mercado`
    };
}
