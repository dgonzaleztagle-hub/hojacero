import { createClient } from '@/utils/supabase/client';

export const getPosDb = (prefix: string) => {
    const supabase = createClient();

    return {
        async getTables() {
            const { data, error } = await supabase
                .from(`${prefix}tables`)
                .select('*')
                .order('table_number');
            if (error) throw error;
            return data || [];
        },

        async updateTableStatus(tableId: string, status: 'available' | 'occupied' | 'reserved') {
            return await supabase
                .from(`${prefix}tables`)
                .update({ status })
                .eq('id', tableId);
        },

        async createPosOrder(order: any, items: any[]) {
            // 1. Crear la orden
            const { data: orderData, error: orderError } = await supabase
                .from(`${prefix}orders`)
                .insert(order)
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Crear los items
            const orderItems = items.map(item => ({
                ...item,
                order_id: orderData.id
            }));

            const { error: itemsError } = await supabase
                .from(`${prefix}order_items`)
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Si tiene mesa, marcarla como ocupada
            if (order.table_id) {
                await this.updateTableStatus(order.table_id, 'occupied');
            }

            return orderData;
        },

        async completeOrder(orderId: string, paymentData: any) {
            // Actualizar orden
            const { data: order, error } = await supabase
                .from(`${prefix}orders`)
                .update({
                    ...paymentData,
                    status: 'ready',
                    paid: true
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            // Liberar mesa si existe
            if (order.table_id) {
                await this.updateTableStatus(order.table_id, 'available');
            }

            return order;
        }
    };
};
