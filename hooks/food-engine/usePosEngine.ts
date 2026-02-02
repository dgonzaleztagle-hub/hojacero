"use client";

import { useState, useEffect } from 'react';
import { getPosDb } from '@/utils/food-engine/pos-db';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export function usePosEngine(prefix: string) {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getPosDb(prefix);
    const supabase = createClient();

    const fetchTables = async () => {
        try {
            const data = await db.getTables();
            setTables(data);
        } catch (err) {
            console.error("Error fetching tables:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();

        const channel = supabase.channel(`${prefix}pos_sync`)
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}tables` }, () => fetchTables())
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}orders` }, () => fetchTables())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [prefix]);

    const submitOrder = async (orderData: any, items: any[]) => {
        try {
            const orderCode = `${prefix.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            await db.createPosOrder({
                ...orderData,
                order_code: orderCode
            }, items);
            toast.success("Pedido enviado a cocina");
        } catch (err) {
            console.error(err);
            toast.error("Error al crear pedido");
            throw err;
        }
    };

    const processPayment = async (orderId: string, paymentMethod: string, amount: number) => {
        try {
            await db.completeOrder(orderId, {
                payment_method: paymentMethod,
                total_amount: amount
            });
            toast.success("Venta completada");
        } catch (err) {
            console.error(err);
            toast.error("Error al procesar pago");
        }
    };

    return {
        tables,
        loading,
        submitOrder,
        processPayment,
        refresh: fetchTables
    };
}
