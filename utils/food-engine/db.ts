import { createClient } from '@/utils/supabase/client';

export const getFoodDb = (prefix: string) => {
    const supabase = createClient();

    return {
        // --- SESIONES ---
        async getActiveSession() {
            return await supabase
                .from(`${prefix}sessions`)
                .select('*')
                .eq('status', 'open')
                .maybeSingle();
        },

        async startSession(openingCash = 0) {
            return await supabase
                .from(`${prefix}sessions`)
                .insert({ status: 'open', opening_cash: openingCash })
                .select()
                .single();
        },

        async closeSession(sessionId: string, totalSales: number, ordersCount: number) {
            return await supabase
                .from(`${prefix}sessions`)
                .update({
                    status: 'closed',
                    end_time: new Date().toISOString(),
                    total_sales: totalSales,
                    orders_count: ordersCount
                })
                .eq('id', sessionId);
        },

        async getSessionHistory(limit = 10) {
            return await supabase
                .from(`${prefix}sessions`)
                .select('*')
                .eq('status', 'closed')
                .order('start_time', { ascending: false })
                .limit(limit);
        },

        // --- PEDIDOS ---
        async getOrders(sessionId?: string) {
            const table = `${prefix}orders`;
            const itemsTable = `${prefix}order_items`;

            let query = (supabase.from(table) as any)
                .select(`*, ${itemsTable}(*)`)
                .order('created_at', { ascending: false });

            if (sessionId) {
                query = query.eq('session_id', sessionId);
            }

            return await query;
        },

        async updateOrderStatus(orderId: string, status: string) {
            return await supabase
                .from(`${prefix}orders`)
                .update({ status })
                .eq('id', orderId);
        },

        async getMonthlyStats() {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            return await supabase
                .from(`${prefix}orders`)
                .select('total_amount')
                .gte('created_at', startOfMonth);
        },

        // --- REALTIME ---
        subscribeToChanges(table: 'orders' | 'sessions', callback: () => void) {
            return supabase
                .channel(`${prefix}${table}_sync`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: `${prefix}${table}`
                }, callback)
                .subscribe();
        }
    };
};
