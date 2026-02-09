/**
 * Proyecciones Financieras
 * 
 * Cálculos matemáticos puros para proyecciones de ventas y ganancias.
 * Estos cálculos se hacen en TypeScript (no en el LLM) para garantizar precisión.
 */

export interface ProyeccionFinanciera {
    pedidos_diarios_estimados: number;
    ticket_promedio_clp: number;
    ventas_diarias_clp: number;
    ventas_mensuales_clp: number;
    margen_neto_estimado: number; // %
    ganancia_mensual_clp: number;
    confianza: 'alta' | 'media' | 'baja';
}

/**
 * Calcula proyección financiera basada en pedidos y ticket promedio
 * 
 * @param pedidosDiariosMin Mínimo de pedidos diarios estimados
 * @param pedidosDiariosMax Máximo de pedidos diarios estimados
 * @param ticketPromedioCLP Ticket promedio en CLP
 * @param margenNeto Margen neto después de costos (default: 15%)
 * @returns Proyección financiera completa
 */
export function calcularProyeccionFinanciera(
    pedidosDiariosMin: number,
    pedidosDiariosMax: number,
    ticketPromedioCLP: number,
    margenNeto: number = 0.15 // 15% por defecto (conservador)
): ProyeccionFinanciera {
    // Promedio de pedidos diarios
    const pedidosDiariosPromedio = Math.round((pedidosDiariosMin + pedidosDiariosMax) / 2);

    // Cálculos
    const ventasDiarias = pedidosDiariosPromedio * ticketPromedioCLP;
    const ventasMensuales = ventasDiarias * 30;
    const gananciaMensual = ventasMensuales * margenNeto;

    // Confianza basada en rango de pedidos
    let confianza: 'alta' | 'media' | 'baja';
    const rangoVariacion = (pedidosDiariosMax - pedidosDiariosMin) / pedidosDiariosPromedio;

    if (rangoVariacion < 0.3) {
        confianza = 'alta'; // Variación menor al 30%
    } else if (rangoVariacion < 0.6) {
        confianza = 'media'; // Variación entre 30-60%
    } else {
        confianza = 'baja'; // Variación mayor al 60%
    }

    return {
        pedidos_diarios_estimados: pedidosDiariosPromedio,
        ticket_promedio_clp: ticketPromedioCLP,
        ventas_diarias_clp: Math.round(ventasDiarias),
        ventas_mensuales_clp: Math.round(ventasMensuales),
        margen_neto_estimado: margenNeto * 100,
        ganancia_mensual_clp: Math.round(gananciaMensual),
        confianza
    };
}

/**
 * Valida que las proyecciones sean realistas
 * 
 * @param proyeccion Proyección a validar
 * @param gse GSE de la zona
 * @returns true si la proyección es realista
 */
export function validarProyeccion(
    proyeccion: ProyeccionFinanciera,
    gse: string
): { valida: boolean; advertencias: string[] } {
    const advertencias: string[] = [];

    // Validar ticket promedio por GSE
    const ticketsEsperados: Record<string, { min: number; max: number }> = {
        'ABC1': { min: 15000, max: 100000 },
        'C2': { min: 10000, max: 50000 },
        'C3': { min: 5000, max: 30000 },
        'D': { min: 3000, max: 20000 },
        'E': { min: 2000, max: 15000 }
    };

    const rangoEsperado = ticketsEsperados[gse] || ticketsEsperados['C3'];

    if (proyeccion.ticket_promedio_clp < rangoEsperado.min) {
        advertencias.push(`Ticket promedio muy bajo para GSE ${gse} (esperado: $${rangoEsperado.min.toLocaleString()} - $${rangoEsperado.max.toLocaleString()})`);
    }

    if (proyeccion.ticket_promedio_clp > rangoEsperado.max) {
        advertencias.push(`Ticket promedio muy alto para GSE ${gse} (esperado: $${rangoEsperado.min.toLocaleString()} - $${rangoEsperado.max.toLocaleString()})`);
    }

    // Validar margen neto (debe estar entre 5% y 30%)
    if (proyeccion.margen_neto_estimado < 5) {
        advertencias.push('Margen neto muy bajo (<5%), revisar costos');
    }

    if (proyeccion.margen_neto_estimado > 30) {
        advertencias.push('Margen neto muy alto (>30%), puede ser poco realista');
    }

    return {
        valida: advertencias.length === 0,
        advertencias
    };
}
