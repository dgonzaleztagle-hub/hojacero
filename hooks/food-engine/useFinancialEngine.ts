"use client";

import { useState, useEffect } from 'react';
import { getFinancialDb } from '@/utils/food-engine/financial-db';

export function useFinancialEngine(prefix: string) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const db = getFinancialDb(prefix);

    const fetchFinance = async () => {
        try {
            const { orders, expenses } = await db.getConsolidated();

            const totalGross = orders.reduce((sum: number, o: any) => sum + o.total_amount, 0);
            const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
            const avgTicket = orders.length > 0 ? totalGross / orders.length : 0;

            const paymentBreakdown = orders.reduce((acc: any, o: any) => {
                acc[o.payment_method] = (acc[o.payment_method] || 0) + o.total_amount;
                return acc;
            }, {});

            setData({
                totalGross,
                totalExpenses,
                netProfit: totalGross - totalExpenses,
                avgTicket,
                paymentBreakdown,
                orderCount: orders.length
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinance();
    }, [prefix]);

    return { data, loading, refresh: fetchFinance };
}
