"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Plus, Minus, Lock, Unlock, TrendingUp, TrendingDown, Clock, AlertCircle } from 'lucide-react';
import { useCashEngine } from '@/hooks/food-engine/useCashEngine';

interface CashManagerProps {
    prefix: string;
    userId: string;
    accentColor?: string;
}

export default function CashManager({ prefix, userId, accentColor = "#FFCC00" }: CashManagerProps) {
    const { currentRegister, movements, stats, loading, openRegister, addMovement, closeRegister } = useCashEngine(prefix);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState<'open' | 'close' | 'in' | 'out'>('open');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    if (loading) return <div className="p-8 text-center opacity-20 animate-pulse font-black italic uppercase">Cargando Caja...</div>;

    const handleAction = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return;

        try {
            if (actionType === 'open') await openRegister(numAmount, userId);
            if (actionType === 'close') await closeRegister(numAmount, userId, reason);
            if (actionType === 'in' || actionType === 'out') await addMovement(actionType, numAmount, reason, userId);

            setIsActionModalOpen(false);
            setAmount('');
            setReason('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* --- STATUS HEADER --- */}
            <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10">
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentRegister ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {currentRegister ? <Unlock size={32} /> : <Lock size={32} />}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black italic uppercase leading-none">{currentRegister ? 'Caja Abierta' : 'Caja Cerrada'}</h2>
                        <p className="opacity-40 font-bold italic text-xs uppercase mt-1">
                            {currentRegister ? `Desde ${new Date(currentRegister.opened_at).toLocaleTimeString()}` : 'Inicia jornada para operar'}
                        </p>
                    </div>
                </div>

                {!currentRegister ? (
                    <button
                        onClick={() => { setActionType('open'); setIsActionModalOpen(true); }}
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black italic uppercase hover:scale-105 transition-transform"
                    >
                        Abrir Caja
                    </button>
                ) : (
                    <button
                        onClick={() => { setActionType('close'); setIsActionModalOpen(true); }}
                        className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black italic uppercase hover:scale-105 transition-transform"
                    >
                        Cerrar Caja
                    </button>
                )}
            </header>

            {/* --- METRICS --- */}
            {currentRegister && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-black opacity-40 uppercase mb-2">Fondo Inicial</p>
                        <p className="text-3xl font-black italic">${currentRegister.initial_amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-green-500/10 blur-xl" />
                        <p className="text-[10px] font-black opacity-40 uppercase mb-2 text-green-500">Saldo Esperado (Vivo)</p>
                        <p className="text-3xl font-black italic text-green-500">${stats.expectedCash.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-black opacity-40 uppercase mb-2 text-red-400">Gastos Registrados</p>
                        <p className="text-3xl font-black italic text-red-400">-${stats.totalExpenses.toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* --- ACTIONS & MOVEMENTS --- */}
            {currentRegister && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Botones de acción rápida */}
                    <div className="lg:col-span-4 space-y-4">
                        <button
                            onClick={() => { setActionType('in'); setIsActionModalOpen(true); }}
                            className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 flex items-center justify-between group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-black italic uppercase">Ingreso Manual</span>
                            </div>
                            <Plus size={20} className="opacity-20" />
                        </button>
                        <button
                            onClick={() => { setActionType('out'); setIsActionModalOpen(true); }}
                            className="w-full bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 flex items-center justify-between group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform">
                                    <TrendingDown size={20} />
                                </div>
                                <span className="font-black italic uppercase">Retiro de Caja</span>
                            </div>
                            <Minus size={20} className="opacity-20" />
                        </button>
                    </div>

                    {/* Lista de movimientos */}
                    <div className="lg:col-span-8 bg-white/5 rounded-[2.5rem] border border-white/10 p-8">
                        <h3 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
                            <Clock size={20} /> Últimos Movimientos
                        </h3>
                        <div className="space-y-4">
                            {movements.length === 0 ? (
                                <p className="text-center py-12 opacity-20 font-bold italic uppercase">No hay movimientos en este turno</p>
                            ) : (
                                movements.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${m.type === 'in' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {m.type === 'in' ? <Plus size={16} /> : <Minus size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-black italic text-sm uppercase leading-none">{m.reason}</p>
                                                <p className="text-[10px] opacity-40 font-bold mt-1">{new Date(m.created_at).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xl font-black italic ${m.type === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                                            {m.type === 'in' ? '+' : '-'}${m.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE ACCIÓN --- */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsActionModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border-4 border-white/10 p-10 rounded-[3rem] w-full max-w-md relative z-10 shadow-2xl"
                        >
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                                {actionType === 'open' && 'Abrir Caja'}
                                {actionType === 'close' && 'Cerrar Jornada'}
                                {actionType === 'in' && 'Ingreso de Efectivo'}
                                {actionType === 'out' && 'Retiro de Efectivo'}
                            </h3>

                            <form onSubmit={handleAction} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black opacity-40 uppercase mb-2 block tracking-widest">Monto {actionType === 'close' ? 'Real en Mano' : ''}</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-2xl font-black italic outline-none focus:border-green-500 transition-colors"
                                        placeholder="0.00"
                                        autoFocus
                                        required
                                    />
                                </div>

                                {(actionType !== 'open') && (
                                    <div>
                                        <label className="text-[10px] font-black opacity-40 uppercase mb-2 block tracking-widest">{actionType === 'close' ? 'Notas de cierre' : 'Motivo / Concepto'}</label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-lg font-bold italic outline-none focus:border-green-500 transition-colors"
                                            placeholder="..."
                                            rows={3}
                                            required
                                        />
                                    </div>
                                )}

                                {actionType === 'close' && (
                                    <div className="p-4 bg-orange-500/20 border-2 border-orange-500/50 rounded-2xl flex gap-3">
                                        <AlertCircle className="text-orange-500 shrink-0" />
                                        <p className="text-xs font-bold italic text-orange-200 uppercase leading-snug">
                                            Se comparará tu monto real con los <span className="text-white">${stats.expectedCash.toLocaleString()}</span> esperados por el sistema.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={`w-full py-6 rounded-2xl text-2xl font-black italic uppercase shadow-xl transition-all ${actionType === 'close' ? 'bg-red-600' : 'bg-green-600'} hover:scale-105 active:scale-95`}
                                >
                                    {actionType === 'open' ? 'Iniciar Turno' : actionType === 'close' ? 'Cerrar y Cuadrar' : 'Confirmar'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
