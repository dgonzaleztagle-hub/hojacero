export type ClientStatus = {
    estado: string;
    color: string;
    prioridad: number;
    esCritico: boolean;
    diasVencido: number;
};

export function getEstado(ultimoPago: string | null, diaCobro: number, contractStart?: string): ClientStatus {
    const hoy = new Date();

    // CASO 1: Nunca ha pagado (Nuevo Cliente o Moroso total)
    if (!ultimoPago) {
        if (!contractStart) {
            return { estado: 'SIN DATA', color: 'text-gray-400 bg-gray-500/10', prioridad: 5, esCritico: false, diasVencido: 0 };
        }

        const start = new Date(contractStart);
        // Dias desde el inicio del contrato
        const diasDesdeInicio = Math.floor((hoy.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        // Si el contrato empezó en el futuro o hace menos de 30 días, está OK.
        if (diasDesdeInicio < 30) {
            return { estado: 'NUEVO', color: 'text-emerald-400 bg-emerald-500/10', prioridad: 5, esCritico: false, diasVencido: 0 };
        }

        // Si lleva más de 30 días sin pagar desde el inicio
        return { estado: 'IMPAGO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdeInicio };
    }

    // CASO 2: Tiene historial de pagos
    const ultimoPagoDate = new Date(ultimoPago);
    const diasDesdePago = Math.floor((hoy.getTime() - ultimoPagoDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diasDesdePago > 60) return { estado: 'VENCIDO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 33) return { estado: 'CRÍTICO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 30) return { estado: 'ATRASADO', color: 'text-orange-400 bg-orange-500/20', prioridad: 2, esCritico: false, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago >= 28) return { estado: 'VENCE HOY', color: 'text-yellow-400 bg-yellow-500/20', prioridad: 3, esCritico: false, diasVencido: 0 };
    if (diasDesdePago >= 21) return { estado: 'PRÓXIMO', color: 'text-gray-400 bg-gray-500/20', prioridad: 4, esCritico: false, diasVencido: diasDesdePago - 30 };
    return { estado: 'AL DÍA', color: 'text-green-400 bg-green-500/20', prioridad: 5, esCritico: false, diasVencido: diasDesdePago - 30 };
}
