/**
 * Estimadores de Flujo y Ticket Promedio
 * 
 * Basados en datos de mercado chileno y análisis territorial.
 * Usados en Plan 350k (Estrategia) para proyecciones comerciales.
 */

export interface FlowEstimate {
    flujo_diario_estimado: number;
    flujo_mensual_estimado: number;
    confianza: 'alta' | 'media' | 'baja';
    factores: string[];
}

export interface TicketEstimate {
    ticket_promedio_clp: number;
    ticket_promedio_uf: number;
    rango_min_clp: number;
    rango_max_clp: number;
    confianza: 'alta' | 'media' | 'baja';
}

/**
 * Estima flujo peatonal diario basado en GSE y metros cuadrados
 */
export function estimarFlujoPeatonal(
    gse: string,
    metrosCuadrados: number,
    tieneMetro: boolean,
    distanciaMetro?: number
): FlowEstimate {
    // Base: metros cuadrados (más grande = más flujo potencial)
    let flujoBase = metrosCuadrados * 2; // 2 personas por m² al día (conservador)

    // Multiplicador por GSE
    const multiplicadorGSE: Record<string, number> = {
        'ABC1': 1.5,  // Alto poder adquisitivo, más movimiento
        'C2': 1.3,
        'C3': 1.2,
        'D': 1.0,
        'E': 0.8
    };

    const multGSE = multiplicadorGSE[gse] || 1.0;
    flujoBase *= multGSE;

    // Bonus por metro cercano
    let bonusMetro = 1.0;
    const factores: string[] = [];

    if (tieneMetro && distanciaMetro) {
        if (distanciaMetro < 300) {
            bonusMetro = 1.8; // Muy cerca del metro
            factores.push('Metro a menos de 300m (+80% flujo)');
        } else if (distanciaMetro < 500) {
            bonusMetro = 1.4;
            factores.push('Metro a menos de 500m (+40% flujo)');
        } else if (distanciaMetro < 1000) {
            bonusMetro = 1.2;
            factores.push('Metro a menos de 1km (+20% flujo)');
        }
    }

    flujoBase *= bonusMetro;

    // Confianza basada en factores
    let confianza: 'alta' | 'media' | 'baja' = 'media';
    if (tieneMetro && distanciaMetro && distanciaMetro < 500) {
        confianza = 'alta';
    } else if (!tieneMetro) {
        confianza = 'baja';
    }

    factores.push(`GSE ${gse} (x${multGSE})`);
    factores.push(`${metrosCuadrados}m² de área`);

    return {
        flujo_diario_estimado: Math.round(flujoBase),
        flujo_mensual_estimado: Math.round(flujoBase * 30),
        confianza,
        factores
    };
}

/**
 * Estima ticket promedio por rubro y GSE
 */
export function estimarTicketPromedio(
    rubro: string,
    gse: string
): TicketEstimate {
    // Valor UF actual (aproximado): 38,000 CLP
    const UF_CLP = 38000;

    // Tickets promedio por rubro (en CLP) para GSE C2-C3
    const ticketsBase: Record<string, number> = {
        // Gastronomía
        'restaurant': 15000,
        'cafe': 8000,
        'fast_food': 6000,
        'bakery': 5000,

        // Retail
        'pharmacy': 12000,
        'supermarket': 25000,
        'convenience_store': 8000,
        'clothing_store': 35000,
        'shoe_store': 40000,

        // Servicios
        'gym': 45000,
        'beauty_salon': 25000,
        'veterinary': 30000,
        'pet_shop': 20000,

        // Otros
        'bookstore': 18000,
        'florist': 15000,
        'default': 15000
    };

    const ticketBase = ticketsBase[rubro] || ticketsBase['default'];

    // Multiplicador por GSE
    const multiplicadorGSE: Record<string, number> = {
        'ABC1': 1.8,  // Gastan casi el doble
        'C2': 1.3,
        'C3': 1.0,    // Base
        'D': 0.7,
        'E': 0.5
    };

    const multGSE = multiplicadorGSE[gse] || 1.0;
    const ticketFinal = Math.round(ticketBase * multGSE);

    // Rangos (±30%)
    const rangoMin = Math.round(ticketFinal * 0.7);
    const rangoMax = Math.round(ticketFinal * 1.3);

    // Confianza
    const confianza: 'alta' | 'media' | 'baja' =
        ticketsBase[rubro] ? 'alta' : 'media';

    return {
        ticket_promedio_clp: ticketFinal,
        ticket_promedio_uf: parseFloat((ticketFinal / UF_CLP).toFixed(2)),
        rango_min_clp: rangoMin,
        rango_max_clp: rangoMax,
        confianza
    };
}

/**
 * Estima ventas mensuales proyectadas
 */
export function estimarVentasMensuales(
    flujo: FlowEstimate,
    ticket: TicketEstimate,
    tasaConversion: number = 0.15 // 15% de conversión por defecto
): {
    ventas_mensuales_clp: number;
    ventas_mensuales_uf: number;
    clientes_mensuales: number;
} {
    const UF_CLP = 38000;

    const clientesMensuales = Math.round(flujo.flujo_mensual_estimado * tasaConversion);
    const ventasMensualesCLP = clientesMensuales * ticket.ticket_promedio_clp;

    return {
        ventas_mensuales_clp: ventasMensualesCLP,
        ventas_mensuales_uf: parseFloat((ventasMensualesCLP / UF_CLP).toFixed(2)),
        clientes_mensuales: clientesMensuales
    };
}
