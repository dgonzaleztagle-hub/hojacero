"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, LayoutGrid, Receipt, CreditCard, User, Hash, Printer, Trash2, Plus, Minus } from 'lucide-react';
import { usePosEngine } from '@/hooks/food-engine/usePosEngine';

interface PosTerminalProps {
    prefix: string;
    products: any[];
}

export default function PosTerminal({ prefix, products }: PosTerminalProps) {
    const { tables, loading, submitOrder, processPayment } = usePosEngine(prefix);
    const [selectedTable, setSelectedTable] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [view, setView] = useState<'tables' | 'terminal'>('tables');

    const addToCart = (product: any) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === product.id);
            if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    };

    const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    const handleCheckout = async () => {
        if (!selectedTable) return;
        try {
            await submitOrder({
                table_id: selectedTable.id,
                delivery_type: 'mesa',
                status: 'pendiente',
                total_amount: cartTotal,
                paid: false
            }, cart.map(i => ({
                product_id: i.id,
                product_name: i.name,
                quantity: i.qty,
                unit_price: i.price
            })));

            setCart([]);
            setSelectedTable(null);
            setView('tables');
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="p-20 text-center font-black animate-pulse opacity-20 uppercase italic">Iniciando Terminal...</div>;

    return (
        <div className="h-[80vh] bg-black border-4 border-white/10 rounded-[3rem] overflow-hidden flex flex-col font-sans">
            {/* --- TOP NAV --- */}
            <nav className="bg-white/5 border-b border-white/10 p-6 flex justify-between items-center shrink-0">
                <div className="flex gap-4">
                    <button onClick={() => setView('tables')} className={`px-6 py-3 rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all ${view === 'tables' ? 'bg-white text-black' : 'bg-white/5 opacity-50'}`}>
                        Salón / Mesas
                    </button>
                    <button onClick={() => setView('terminal')} className={`px-6 py-3 rounded-2xl font-black italic uppercase text-xs tracking-widest transition-all ${view === 'terminal' ? 'bg-white text-black' : 'bg-white/5 opacity-50'}`}>
                        Terminal POS
                    </button>
                </div>
                {selectedTable && (
                    <div className="flex items-center gap-3 bg-green-500/20 text-green-500 px-6 py-3 rounded-2xl border border-green-500/30">
                        <Utensils size={16} />
                        <span className="font-black italic uppercase text-xs">Mesa {selectedTable.table_number}</span>
                    </div>
                )}
            </nav>

            <div className="flex-1 flex min-h-0">
                {/* --- MAIN AREA --- */}
                <main className="flex-1 overflow-y-auto p-10 bg-zinc-950">
                    {view === 'tables' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {tables.map((table, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setSelectedTable(table); setView('terminal'); }}
                                    className={`aspect-square rounded-[2rem] border-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${table.status === 'occupied' ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-white/5'}`}
                                >
                                    <span className="text-4xl font-black italic opacity-20">{table.table_number}</span>
                                    <span className="text-[10px] font-black uppercase opacity-40">{table.status === 'occupied' ? 'Ocupada' : 'Disponible'}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((p, i) => (
                                <button key={i} onClick={() => addToCart(p)} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 text-left transition-all active:scale-95">
                                    <h4 className="font-black italic uppercase text-sm leading-tight mb-2 truncate">{p.name}</h4>
                                    <p className="text-xl font-black italic text-blue-400">
                                        ${p.price.toLocaleString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </main>

                {/* --- CART SIDEBAR --- */}
                <aside className="w-[400px] border-l border-white/10 flex flex-col shrink-0">
                    <div className="p-8 flex-1 overflow-y-auto">
                        <h3 className="text-sm font-black italic uppercase opacity-40 mb-8 tracking-[.2em]">Detalle Pedido</h3>
                        <div className="space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 opacity-10">
                                    <Receipt size={64} className="mx-auto mb-4" />
                                    <p className="font-black italic uppercase">Terminal Vacía</p>
                                </div>
                            ) : (
                                cart.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <div className="min-w-0 pr-4">
                                            <p className="font-black italic uppercase text-xs truncate leading-none mb-1">{item.name}</p>
                                            <p className="text-[10px] font-bold opacity-30">${item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><Minus size={12} /></button>
                                            <span className="font-black italic min-w-[20px] text-center">{item.qty}</span>
                                            <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><Plus size={12} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* --- TOTALS --- */}
                    <div className="p-8 bg-zinc-900 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-black italic uppercase opacity-40 text-xs">Total</span>
                            <span className="text-4xl font-black italic">${cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || !selectedTable}
                            className="w-full py-6 bg-blue-600 rounded-2xl text-2xl font-black italic uppercase shadow-xl hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale transition-all"
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
