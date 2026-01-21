export type ClientStatus = {
    estado: string;
    color: string;
    prioridad: number;
    esCritico: boolean;
    diasVencido: number;
};

export function getEstado(ultimoPago: string | null, diaCobro: number): ClientStatus {
    if (!ultimoPago) {
        return { estado: 'SIN PAGOS', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: 999 };
    }

    const hoy = new Date();
    const ultimoPagoDate = new Date(ultimoPago);
    const diasDesdePago = Math.floor((hoy.getTime() - ultimoPagoDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diasDesdePago > 60) return { estado: 'VENCIDO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 33) return { estado: 'CRÍTICO', color: 'text-red-400 bg-red-500/20', prioridad: 1, esCritico: true, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago > 30) return { estado: 'ATRASADO', color: 'text-orange-400 bg-orange-500/20', prioridad: 2, esCritico: false, diasVencido: diasDesdePago - 30 };
    if (diasDesdePago >= 28) return { estado: 'VENCE HOY', color: 'text-yellow-400 bg-yellow-500/20', prioridad: 3, esCritico: false, diasVencido: 0 };
    if (diasDesdePago >= 21) return { estado: 'PRÓXIMO', color: 'text-gray-400 bg-gray-500/20', prioridad: 4, esCritico: false, diasVencido: diasDesdePago - 30 };
    return { estado: 'AL DÍA', color: 'text-green-400 bg-green-500/20', prioridad: 5, esCritico: false, diasVencido: diasDesdePago - 30 };
}
