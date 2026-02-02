import { createClient } from '@/utils/supabase/client';

export const getInventoryDb = (prefix: string) => {
    const supabase = createClient();

    return {
        async getInventory() {
            const { data, error } = await supabase
                .from(`${prefix}inventory`)
                .select('*')
                .order('name');
            if (error) throw error;
            return data || [];
        },

        async getMovements(limit = 50) {
            const { data, error } = await supabase
                .from(`${prefix}inventory_movements`)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) throw error;
            return data || [];
        },

        async upsertItem(item: any) {
            return await supabase
                .from(`${prefix}inventory`)
                .upsert(item)
                .select()
                .single();
        },

        async addMovement(movement: {
            inventory_id: string;
            type: 'entry' | 'exit' | 'adjustment';
            quantity: number;
            reason?: string;
            created_by: string;
        }) {
            // Registrar movimiento
            const { data, error } = await supabase
                .from(`${prefix}inventory_movements`)
                .insert(movement)
                .select()
                .single();

            if (error) throw error;

            // Actualizar stock en la tabla principal
            const { data: item } = await supabase
                .from(`${prefix}inventory`)
                .select('current_stock')
                .eq('id', movement.inventory_id)
                .single();

            const currentStock = item?.current_stock || 0;
            const multiplier = movement.type === 'entry' ? 1 : movement.type === 'exit' ? -1 : 1;
            const newStock = movement.type === 'adjustment' ? movement.quantity : currentStock + (movement.quantity * multiplier);

            await supabase
                .from(`${prefix}inventory`)
                .update({ current_stock: newStock })
                .eq('id', movement.inventory_id);

            return data;
        },

        async deleteItem(id: string) {
            return await supabase
                .from(`${prefix}inventory`)
                .delete()
                .eq('id', id);
        }
    };
};
