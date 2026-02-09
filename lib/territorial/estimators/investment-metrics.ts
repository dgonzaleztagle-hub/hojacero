/**
 * Investment Metrics
 * 
 * Cálculos de métricas de inversión inmobiliaria.
 * Fórmulas validadas para análisis de rentabilidad.
 */

export interface CapRateCalculation {
    arriendo_mensual_uf: number;
    ingresos_anuales_uf: number;
    gastos_operativos_uf: number;
    noi_anual_uf: number;
    inversion_total_uf: number;
    cap_rate_porcentaje: number;
    interpretacion: 'excelente' | 'bueno' | 'regular' | 'bajo';
}

/**
 * Calcula el Cap Rate (Capitalization Rate) de una inversión inmobiliaria
 * 
 * Fórmula: Cap Rate = (NOI Anual / Inversión Total) × 100
 * 
 * Donde:
 * - NOI (Net Operating Income) = Ingresos Anuales - Gastos Operativos
 * - Ingresos Anuales = Arriendo Mensual × 12
 * - Gastos Operativos = % de los ingresos (típicamente 15-20%)
 * - Inversión Total = Precio Adquisición + Habilitación
 * 
 * @param arriendoMensualUF Arriendo mensual en UF
 * @param precioAdquisicionUF Precio de compra en UF
 * @param habilitacionUF Costo de habilitación/remodelación en UF
 * @param gastosOperativosPorc Porcentaje de gastos operativos (default: 15%)
 * @returns Cálculo completo de Cap Rate
 */
export function calcularCapRate(
    arriendoMensualUF: number,
    precioAdquisicionUF: number,
    habilitacionUF: number,
    gastosOperativosPorc: number = 0.15 // 15% de gastos operativos (conservador)
): CapRateCalculation {
    // Inversión total
    const inversionTotal = precioAdquisicionUF + habilitacionUF;

    // Ingresos anuales
    const ingresosAnuales = arriendoMensualUF * 12;

    // Gastos operativos (mantenimiento, seguros, impuestos, etc.)
    const gastosOperativos = ingresosAnuales * gastosOperativosPorc;

    // NOI (Net Operating Income)
    const noiAnual = ingresosAnuales - gastosOperativos;

    // Cap Rate
    const capRate = (noiAnual / inversionTotal) * 100;

    // Interpretación
    let interpretacion: 'excelente' | 'bueno' | 'regular' | 'bajo';
    if (capRate >= 8) {
        interpretacion = 'excelente'; // >8% es excelente en Chile
    } else if (capRate >= 6) {
        interpretacion = 'bueno'; // 6-8% es bueno
    } else if (capRate >= 4) {
        interpretacion = 'regular'; // 4-6% es regular
    } else {
        interpretacion = 'bajo'; // <4% es bajo
    }

    return {
        arriendo_mensual_uf: arriendoMensualUF,
        ingresos_anuales_uf: ingresosAnuales,
        gastos_operativos_uf: gastosOperativos,
        noi_anual_uf: noiAnual,
        inversion_total_uf: inversionTotal,
        cap_rate_porcentaje: Math.round(capRate * 100) / 100, // 2 decimales
        interpretacion
    };
}

/**
 * Valida que el Cap Rate sea realista
 * 
 * @param capRate Cap Rate calculado
 * @returns Validación con advertencias si aplica
 */
export function validarCapRate(
    capRate: CapRateCalculation
): { valido: boolean; advertencias: string[] } {
    const advertencias: string[] = [];

    // Cap Rate muy alto (>15%) puede ser poco realista
    if (capRate.cap_rate_porcentaje > 15) {
        advertencias.push('Cap Rate muy alto (>15%), verificar datos de arriendo y precio');
    }

    // Cap Rate muy bajo (<2%) puede no ser atractivo
    if (capRate.cap_rate_porcentaje < 2) {
        advertencias.push('Cap Rate muy bajo (<2%), inversión poco atractiva');
    }

    // NOI negativo (imposible)
    if (capRate.noi_anual_uf < 0) {
        advertencias.push('NOI negativo: los gastos operativos superan los ingresos');
    }

    return {
        valido: advertencias.length === 0,
        advertencias
    };
}

/**
 * Calcula el payback period (años para recuperar inversión)
 * 
 * @param inversionTotalUF Inversión total en UF
 * @param noiAnualUF NOI anual en UF
 * @returns Años para recuperar la inversión
 */
export function calcularPayback(
    inversionTotalUF: number,
    noiAnualUF: number
): number {
    if (noiAnualUF <= 0) return Infinity; // Nunca se recupera
    return Math.round((inversionTotalUF / noiAnualUF) * 10) / 10; // 1 decimal
}

/**
 * Calcula ROI (Return on Investment) proyectado
 * 
 * @param inversionTotalUF Inversión total en UF
 * @param noiAnualUF NOI anual en UF
 * @param años Años de proyección
 * @returns ROI en porcentaje
 */
export function calcularROI(
    inversionTotalUF: number,
    noiAnualUF: number,
    años: number = 5
): number {
    const gananciaTotal = noiAnualUF * años;
    const roi = (gananciaTotal / inversionTotalUF) * 100;
    return Math.round(roi * 100) / 100; // 2 decimales
}
