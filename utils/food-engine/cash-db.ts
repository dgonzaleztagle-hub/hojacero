import { createClient } from '@/utils/supabase/client';

export const getCashDb = (prefix: string) => {
    const supabase = createClient();

    return {
        async getCurrentRegister() {
            const { data, error } = await supabase
                .from(`${prefix}cash_register`)
                .select('*')
                .is('closed_at', null)
                .order('opened_at', { ascending: false })
                .maybeSingle();

            if (error) throw error;
            return data;
        },

        async getMovements(registerId: string) {
            const { data, error } = await supabase
                .from(`${prefix}cash_movements`)
                .select('*')
                .eq('cash_register_id', registerId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        },

        async openRegister(amount: number, userId: string) {
            return await supabase
                .from(`${prefix}cash_register`)
                .insert({
                    initial_amount: amount,
                    opened_by: userId
                })
                .select()
                .single();
        },

        async closeRegister(registerId: string, closingData: any) {
            return await supabase
                .from(`${prefix}cash_register`)
                .update({
                    ...closingData,
                    closed_at: new Date().toISOString()
                })
                .eq('id', registerId);
        },

        async addMovement(movement: {
            cash_register_id: string;
            type: 'in' | 'out';
            amount: number;
            reason: string;
            created_by: string;
        }) {
            return await supabase
                .from(`${prefix}cash_movements`)
                .insert(movement);
        },

        async getExpensesSince(date: string) {
            return await supabase
                .from(`${prefix}expenses`)
                .select('amount')
                .gte('created_at', date);
        },

        async getSalesBreakdown(date: string) {
            return await supabase
                .from(`${prefix}orders`)
                .select('payment_method, total_amount')
                .eq('paid', true)
                .gte('created_at', date);
        }
    };
};
