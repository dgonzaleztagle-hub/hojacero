"use client";

import { useState, useEffect } from 'react';
import { getInventoryDb } from '@/utils/food-engine/inventory-db';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export function useInventoryEngine(prefix: string) {
    const [inventory, setInventory] = useState<any[]>([]);
    const [movements, setMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const db = getInventoryDb(prefix);
    const supabase = createClient();

    const fetchInventoryData = async () => {
        try {
            const [items, movs] = await Promise.all([
                db.getInventory(),
                db.getMovements()
            ]);
            setInventory(items);
            setMovements(movs);
        } catch (err) {
            console.error("Error fetching inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventoryData();

        const channel = supabase.channel(`${prefix}inventory_sync`)
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}inventory` }, () => fetchInventoryData())
            .on('postgres_changes', { event: '*', schema: 'public', table: `${prefix}inventory_movements` }, () => fetchInventoryData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [prefix]);

    const saveItem = async (item: any) => {
        const { error } = await db.upsertItem(item);
        if (error) throw error;
        toast.success(item.id ? "Item actualizado" : "Item creado");
    };

    const registerMovement = async (data: any) => {
        const { error } = await db.addMovement(data);
        if (error) throw error;
        toast.success("Movimiento registrado");
    };

    const deleteItem = async (id: string) => {
        const { error } = await db.deleteItem(id);
        if (error) throw error;
        toast.success("Item eliminado");
    };

    const lowStockItems = inventory.filter(i => i.min_stock && i.current_stock <= i.min_stock);

    return {
        inventory,
        movements,
        lowStockItems,
        loading,
        saveItem,
        registerMovement,
        deleteItem,
        refresh: fetchInventoryData
    };
}
