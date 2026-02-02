import { createClient } from '@/utils/supabase/client';

export const getFinancialDb = (prefix: string) => {
    const supabase = createClient();

    return {
        async getConsolidated(days = 30) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const isoDate = startDate.toISOString();

            // 1. Obtener todas las órdenes pagadas
            const { data: orders } = await supabase
                .from(`${prefix}orders`)
                .select('total_amount, payment_method, created_at')
                .eq('paid', true)
                .gte('created_at', isoDate);

            // 2. Obtener gastos
            const { data: expenses } = await supabase
                .from(`${prefix}expenses`)
                .select('amount')
                .gte('created_at', isoDate);

            return { orders: orders || [], expenses: expenses || [] };
        }
    };
};
