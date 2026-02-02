"use client";

import { useState, useEffect } from 'react';
import { getCashDb } from '@/utils/food-engine/cash-db';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface CashRegister {
    id: string;
    initial_amount: number;
    opened_at: string;
    closed_at: string | null;
    status: 'open' | 'closed';
}

export function useCashEngine(prefix: string) {
    const [currentRegister, setCurrentRegister] = useState<CashRegister | null>(null);
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        expectedCash: 0,
        totalSales: 0,
        totalExpenses: 0
    });

    const db = getCashDb(prefix);
    const supabase = createClient();

    const fetchCurrentState = async () => {
        try {
            const register = await db.getCurrentRegister();
            setCurrentRegister(register);

            if (register) {
                const movs = await db.getMovements(register.id);
                setMovements(movs);

                // Calcular balance
                const { data: sales } = await db.getSalesBreakdown(register.opened_at);
                const { data: expenses } = await db.getExpensesSince(register.opened_at);

                const totalSales = sales?.reduce((sum: number, s: any) => sum + s.total_amount, 0) || 0;
                const cashSales = sales?.filter((s: any) => s.payment_method === 'cash')
                    .reduce((sum: number, s: any) => sum + s.total_amount, 0) || 0;
                const totalExpenses = expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;

                const movsIn = movs.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0);
                const movsOut = movs.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0);

                setStats({
                    totalSales,
                    totalExpenses,
                    expectedCash: register.initial_amount + cashSales + movsIn - movsOut - totalExpenses
                });
            }
        } catch (err) {
            console.error("Error fetching cash state:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentState();

        const channel = supabase.channel(`${prefix}cash_sync`)
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}cash_register` }, () => fetchCurrentState())
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}cash_movements` }, () => fetchCurrentState())
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}orders` }, () => fetchCurrentState())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [prefix]);

    const openRegister = async (amount: number, userId: string) => {
        const { error } = await db.openRegister(amount, userId);
        if (error) throw error;
        toast.success("Caja abierta correctamente");
    };

    const addMovement = async (type: 'in' | 'out', amount: number, reason: string, userId: string) => {
        if (!currentRegister) return;
        const { error } = await db.addMovement({
            cash_register_id: currentRegister.id,
            type,
            amount,
            reason,
            created_by: userId
        });
        if (error) throw error;
        toast.success("Movimiento registrado");
    };

    const closeRegister = async (actualAmount: number, userId: string, notes?: string) => {
        if (!currentRegister) return;

        const difference = actualAmount - stats.expectedCash;

        const { error } = await db.closeRegister(currentRegister.id, {
            final_amount: actualAmount,
            expected_amount: stats.expectedCash,
            difference,
            closed_by: userId,
            notes
        });

        if (error) throw error;
        toast.success("Caja cerrada correctamente");
    };

    return {
        currentRegister,
        movements,
        stats,
        loading,
        openRegister,
        addMovement,
        closeRegister,
        refresh: fetchCurrentState
    };
}
