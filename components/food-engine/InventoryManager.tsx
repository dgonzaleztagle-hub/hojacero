"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Plus, Minus, AlertTriangle, History, Pencil, Trash2, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { useInventoryEngine } from '@/hooks/food-engine/useInventoryEngine';

interface InventoryManagerProps {
    prefix: string;
    userId: string;
}

export default function InventoryManager({ prefix, userId }: InventoryManagerProps) {
    const { inventory, movements, lowStockItems, loading, saveItem, registerMovement, deleteItem } = useInventoryEngine(prefix);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form states
    const [formData, setFormData] = useState({ name: '', unit: 'unidades', min_stock: '0', cost_per_unit: '0' });
    const [moveData, setMoveData] = useState({ type: 'entry', quantity: '', reason: '' });

    if (loading) return <div className="p-8 text-center opacity-20 animate-pulse font-black italic uppercase">Cargando Inventario...</div>;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await saveItem({
                ...selectedItem,
                ...formData,
                min_stock: parseFloat(formData.min_stock),
                cost_per_unit: parseFloat(formData.cost_per_unit)
            });
            setIsEditModalOpen(false);
            setSelectedItem(null);
        } catch (err) { console.error(err); }
    };

    const handleMove = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerMovement({
                inventory_id: selectedItem.id,
                type: moveData.type,
                quantity: parseFloat(moveData.quantity),
                reason: moveData.reason,
                created_by: userId
            });
            setIsMoveModalOpen(false);
            setSelectedItem(null);
            setMoveData({ type: 'entry', quantity: '', reason: '' });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            {/* --- ALERTS --- */}
            <AnimatePresence>
                {lowStockItems.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        className="bg-red-500/10 border-2 border-red-500/30 rounded-3xl p-6 overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <AlertTriangle size={24} />
                            <h3 className="font-black italic uppercase">Alertas de Reposición ({lowStockItems.length})</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {lowStockItems.map((item, i) => (
                                <div key={i} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold italic text-xs uppercase flex items-center gap-2">
                                    {item.name} <span className="opacity-50">Stock: {item.current_stock} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- INVENTORY LIST --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-black italic uppercase flex items-center gap-3">
                            <Box className="text-blue-400" /> Stock de Insumos
                        </h3>
                        <button
                            onClick={() => { setSelectedItem(null); setFormData({ name: '', unit: 'unidades', min_stock: '0', cost_per_unit: '0' }); setIsEditModalOpen(true); }}
                            className="bg-blue-600 text-white p-3 rounded-2xl hover:scale-110 transition-transform"
                        >
                            <Plus />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {inventory.map((item, i) => (
                            <div key={i} className="group flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
                                <div>
                                    <h4 className="font-black italic uppercase text-lg leading-none">{item.name}</h4>
                                    <p className="opacity-40 font-bold italic text-[10px] uppercase mt-1 tracking-widest">{item.unit}</p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className={`text-2xl font-black italic ${item.current_stock <= item.min_stock ? 'text-red-500' : 'text-white'}`}>
                                            {item.current_stock}
                                        </p>
                                        <p className="text-[10px] font-bold opacity-30 uppercase">Actual</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedItem(item); setIsMoveModalOpen(true); }}
                                            className="p-3 bg-white/10 rounded-xl hover:bg-green-500/20 hover:text-green-500 transition-colors"
                                            title="Registrar Movimiento"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setFormData({ name: item.name, unit: item.unit, min_stock: item.min_stock.toString(), cost_per_unit: item.cost_per_unit.toString() });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-3 bg-white/10 rounded-xl hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RECENT MOVEMENTS --- */}
                <div className="lg:col-span-4 bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
                    <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                        <History size={20} className="opacity-40" /> Historial
                    </h3>
                    <div className="space-y-4">
                        {movements.slice(0, 10).map((m, i) => {
                            const item = inventory.find(inv => inv.id === m.inventory_id);
                            return (
                                <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${m.type === 'entry' ? 'bg-green-500/20 text-green-500' : m.type === 'exit' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            {m.type === 'entry' ? <TrendingUp size={14} /> : m.type === 'exit' ? <TrendingDown size={14} /> : <RefreshCcw size={14} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black italic text-xs uppercase leading-none truncate">{item?.name || 'Item'}</p>
                                            <p className="text-[10px] opacity-30 font-bold mt-1 uppercase">{m.reason || m.type}</p>
                                        </div>
                                    </div>
                                    <span className={`font-black italic text-sm ${m.type === 'entry' ? 'text-green-500' : 'text-red-500'}`}>
                                        {m.type === 'entry' ? '+' : '-'}{m.quantity}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- MODALES --- */}
            {/* Modal de Movimiento */}
            <AnimatePresence>
                {isMoveModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMoveModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-zinc-900 border-4 border-white/10 p-10 rounded-[3rem] w-full max-w-md relative z-10 shadow-2xl">
                            <h3 className="text-3xl font-black italic uppercase mb-8">Stock: {selectedItem?.name}</h3>
                            <form onSubmit={handleMove} className="space-y-6">
                                <div className="flex gap-2">
                                    {['entry', 'exit', 'adjustment'].map((t) => (
                                        <button
                                            key={t} type="button"
                                            onClick={() => setMoveData({ ...moveData, type: t as any })}
                                            className={`flex-1 py-3 rounded-xl font-black italic uppercase text-[10px] border-2 transition-all ${moveData.type === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 opacity-40'}`}
                                        >
                                            {t === 'entry' ? 'Entrada' : t === 'exit' ? 'Salida' : 'Ajuste'}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number" step="0.01" value={moveData.quantity} onChange={(e) => setMoveData({ ...moveData, quantity: e.target.value })}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-2xl font-black italic outline-none focus:border-blue-500" placeholder="Cantidad" required
                                />
                                <input
                                    type="text" value={moveData.reason} onChange={(e) => setMoveData({ ...moveData, reason: e.target.value })}
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-lg font-bold italic outline-none focus:border-blue-500" placeholder="Motivo (ej: Compra factura 12)"
                                />
                                <button type="submit" className="w-full py-6 bg-blue-600 rounded-2xl text-2xl font-black italic uppercase shadow-xl hover:scale-105 active:scale-95">Confirmar</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
