'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, Briefcase, Code, Megaphone, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

interface VictoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: VictoryData) => Promise<void>;
    leadName: string;
    isDark?: boolean;
}

export type VictoryData = {
    dealType: 'plan_150' | 'custom_dev' | 'custom_mkt';
    amount: number;
    partnerSplit: 'daniel_major' | 'gaston_major';
    justifications: string[];
};

export const VictoryModal = ({ isOpen, onClose, onConfirm, leadName, isDark = true }: VictoryModalProps) => {
    const [dealType, setDealType] = useState<'plan_150' | 'custom_dev' | 'custom_mkt'>('plan_150');
    const [amount, setAmount] = useState<number>(150);
    const [justifications, setJustifications] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-configure based on Deal Type
    useEffect(() => {
        if (dealType === 'plan_150') {
            setAmount(150);
            setJustifications([]); // Clear justifications as Plan 150 is standard
        }
    }, [dealType]);

    if (!isOpen) return null;

    // Calculate Preview Split
    const danielShare = dealType === 'plan_150' ? 0.65 : (dealType === 'custom_dev' ? 0.65 : 0.35);
    const gastonShare = 1 - danielShare;

    const danielAmount = (amount * danielShare).toFixed(1);
    const gastonAmount = (amount * gastonShare).toFixed(1);

    const handleSubmit = async () => {
        if (amount <= 0) {
            toast.error('El monto debe ser mayor a 0');
            return;
        }

        if (dealType !== 'plan_150' && justifications.length === 0) {
            // Optional: Enforce justification for custom deals?
            // toast.warning('¿Sin justificación? Asegúrate de documentar por qué.');
        }

        setIsSubmitting(true);
        try {
            await onConfirm({
                dealType,
                amount,
                partnerSplit: danielShare === 0.65 ? 'daniel_major' : 'gaston_major',
                justifications
            });
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl ${isDark ? 'bg-[#0a0a0a] border border-white/10' : 'bg-white border-gray-200'}`} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-900/40 to-black p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">¡Venta Cerrada! 🎉</h2>
                    <p className="text-emerald-400 text-sm font-medium uppercase tracking-wide">Nuevo Cliente: {leadName}</p>
                </div>

                <div className="p-6 space-y-6">

                    {/* Deal Type Selector */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tipo de Acuerdo</label>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => setDealType('plan_150')}
                                className={`flex items-center p-3 rounded-xl border transition-all text-left group ${dealType === 'plan_150' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'}`}
                            >
                                <div className={`p-2 rounded-lg mr-3 ${dealType === 'plan_150' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`font-bold ${dealType === 'plan_150' ? 'text-emerald-400' : 'text-white'}`}>Plan 150 (Standard)</div>
                                    <div className="text-xs text-zinc-500">Auto: $150 USD | Split 65/35 Fijo</div>
                                </div>
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setDealType('custom_dev')}
                                    className={`flex items-center p-3 rounded-xl border transition-all text-left ${dealType === 'custom_dev' ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'}`}
                                >
                                    <div className={`p-2 rounded-lg mr-3 ${dealType === 'custom_dev' ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                        <Code className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`font-bold text-sm ${dealType === 'custom_dev' ? 'text-cyan-400' : 'text-white'}`}>Custom Dev</div>
                                        <div className="text-[10px] text-zinc-500">Daniel Major</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setDealType('custom_mkt')}
                                    className={`flex items-center p-3 rounded-xl border transition-all text-left ${dealType === 'custom_mkt' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-zinc-900 border-white/5 hover:bg-zinc-800'}`}
                                >
                                    <div className={`p-2 rounded-lg mr-3 ${dealType === 'custom_mkt' ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                        <Megaphone className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`font-bold text-sm ${dealType === 'custom_mkt' ? 'text-purple-400' : 'text-white'}`}>Custom Mkt</div>
                                        <div className="text-[10px] text-zinc-500">Gastón Major</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Monto Cierre (USD)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-zinc-500 font-bold">$</span>
                            </div>
                            <input
                                type="number"
                                value={amount}
                                disabled={dealType === 'plan_150'}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className={`w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-7 pr-4 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-colors ${dealType === 'plan_150' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Split Visualizer */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs text-zinc-400">Distribución Estimada</span>
                        </div>
                        <div className="flex w-full h-4 bg-zinc-800 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${danielShare * 100}%` }} title="Daniel" />
                            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${gastonShare * 100}%` }} title="Gastón" />
                        </div>
                        <div className="flex justify-between text-xs font-mono">
                            <span className="text-cyan-400">Daniel: ${danielAmount} ({danielShare * 100}%)</span>
                            <span className="text-purple-400">Gastón: ${gastonAmount} ({gastonShare * 100}%)</span>
                        </div>
                    </div>

                    {/* Custom Justifications */}
                    {dealType !== 'plan_150' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                <Info className="w-3 h-3" /> Justificación (Para socio minoritario)
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { id: 'extra_manual_load', label: 'Carga Manual Extra (Gastón)' },
                                    { id: 'custom_feature_dev', label: 'Desarrollo Feature Nuevo (Daniel)' },
                                    { id: 'account_management', label: 'Account Management Intensivo' },
                                    { id: 'complex_setup', label: 'Setup Complejo / Migración' },
                                ].map((item) => (
                                    <label key={item.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg cursor-pointer hover:bg-zinc-900 transition-colors border border-transparent hover:border-white/5">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${justifications.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-600'}`}>
                                            {justifications.includes(item.id) && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={justifications.includes(item.id)}
                                            onChange={() => {
                                                if (justifications.includes(item.id)) {
                                                    setJustifications(justifications.filter(j => j !== item.id));
                                                } else {
                                                    setJustifications([...justifications, item.id]);
                                                }
                                            }}
                                        />
                                        <span className="text-sm text-zinc-300">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-zinc-900/50 border-t border-white/10 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors uppercase tracking-wider"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                        Confirmar Cierre
                    </button>
                </div>
            </div>
        </div>
    );
};
