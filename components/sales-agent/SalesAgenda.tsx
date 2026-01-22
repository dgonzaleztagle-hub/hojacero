'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, ArrowRight, Loader2 } from 'lucide-react';

interface TimeSlot {
    start: string;
    end: string;
    available: boolean;
    suggested?: boolean;
}

interface SalesAgendaProps {
    date?: string; // YYYY-MM-DD, default: mañana
    onBooked?: (slot: string) => void;
}

export function SalesAgenda({ date, onBooked }: SalesAgendaProps) {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooked, setIsBooked] = useState(false);
    const [targetDate, setTargetDate] = useState('');

    useEffect(() => {
        // Default: mañana
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = date || tomorrow.toISOString().split('T')[0];
        setTargetDate(dateStr);

        const fetchSlots = async () => {
            try {
                const res = await fetch(`/api/agenda/availability?date=${dateStr}`);
                const data = await res.json();
                if (data.success) {
                    // Extraer solo las horas formateadas
                    const formattedSlots = data.slots.slice(0, 6).map((s: TimeSlot) =>
                        new Date(s.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                    );
                    setSlots(formattedSlots);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [date]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setIsBooked(true);
        onBooked?.(selectedSlot);
    };

    if (isBooked) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center space-y-4"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/40">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">¡Cupo Reservado!</h3>
                <p className="text-zinc-400 text-sm">
                    {targetDate} a las {selectedSlot}. Te contactaremos para confirmar.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30">
                        <img src="https://ui-avatars.com/api/?name=Daniel+H0&background=0284c7&color=fff" alt="Daniel" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-tight uppercase">Sesión de Estrategia</h4>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Consultor: Daniel • 20 min</p>
                    </div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full animate-pulse">
                    <span className="text-[9px] text-red-400 font-black uppercase tracking-tighter">Alta Demanda</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                            {new Date(targetDate).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </span>
                    </div>
                    <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-500 font-bold">20 MIN</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                    </div>
                ) : slots.length === 0 ? (
                    <p className="text-center text-zinc-500 py-4 text-sm">No hay disponibilidad para este día</p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${selectedSlot === slot
                                    ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/40 scale-[1.02]'
                                    : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {slot}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        disabled={!selectedSlot}
                        onClick={handleBook}
                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-900/40 hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                        Confirmar Sesión
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[9px] text-zinc-600 text-center uppercase font-bold tracking-widest">
                        Disponibilidad en tiempo real
                    </p>
                </div>
            </div>
        </div>
    );
}
