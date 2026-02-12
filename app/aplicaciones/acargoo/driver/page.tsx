'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    Navigation,
    CheckCircle2,
    Camera,
    PenTool,
    Phone,
    MapPin,
    Clock,
    AlertTriangle,
    ChevronRight,
    Play,
    Check,
    Box,
    XCircle,
    Power,
    Users
} from 'lucide-react';

import LogoAcargoo from '@/components/aplicaciones/acargoo/LogoAcargoo';

// Estilos consistentes con la marca Acargoo+
const COLORS = {
    navy: '#1e3a5f',
    orange: '#ff9900',
    bg: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    white: '#ffffff'
};

export default function AcargooDriverPage() {
    const [status, setStatus] = useState<'offline' | 'available' | 'to_pick' | 'to_delivery' | 'done'>('offline');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-orange-500 selection:text-white" style={{ backgroundColor: COLORS.bg }}>
            {/* Header / StatusBar */}
            <header className="px-8 pt-12 pb-8 bg-[#1e3a5f] text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />

                <div className="flex justify-between items-center relative z-10">
                    <LogoAcargoo variant="dark" size="sm" showTagline={false} />
                    <button
                        onClick={() => setStatus(status === 'offline' ? 'available' : 'offline')}
                        className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${status === 'offline' ? 'bg-white/10 text-white/40' : 'bg-orange-500 text-white ring-4 ring-orange-500/20'}`}
                    >
                        <Power size={22} className="stroke-[3]" />
                    </button>
                </div>

                <div className="mt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Daniel Gonzalez (Unidad H0-302)</p>
                    <div className="flex items-center gap-3">
                        <StatusPill active={status !== 'offline'} label={status === 'offline' ? 'Desconectado' : 'Operativo On-Road'} color={status === 'offline' ? 'bg-slate-500' : 'bg-green-500'} />
                        {status !== 'offline' && status !== 'available' && (
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                                <StatusPill active label="En Servicio" color="bg-orange-500" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 px-6 py-8 space-y-6">
                <AnimatePresence mode="wait">
                    {status === 'offline' && (
                        <EmptyState
                            key="offline"
                            icon={<Power className="w-12 h-12 text-slate-300" />}
                            title="Desconectado"
                            desc="Pasa a modo 'Online' para comenzar a recibir órdenes de carga."
                        />
                    )}

                    {status === 'available' && (
                        <div key="available" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-widest px-1">Próximo Turno</h3>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStatus('to_pick')}
                                className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-blue-900/5 cursor-pointer group hover:border-orange-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-5 py-2 rounded-xl bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">Nueva Asignación</div>
                                    <span className="text-slate-400 text-xs font-bold uppercase italic">#AG-7281</span>
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-2">Carga Automotriz</h4>
                                <p className="text-sm text-slate-500 font-medium mb-8">Bodegas Enea, Pudahuel <ChevronRight className="inline mx-1 text-orange-500" /> Vitacura Central</p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase italic">
                                        <Clock size={16} /> 15m estimado
                                    </div>
                                    <span className="text-orange-500 font-black uppercase text-xs italic tracking-tighter flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Detalles <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {(status === 'to_pick' || status === 'to_delivery') && (
                        <div key="active" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-8 rounded-[2.5rem] bg-[#1e3a5f] text-white shadow-2xl relative overflow-hidden">
                                <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
                                    <span>Servicio en Curso</span>
                                    <span>{status === 'to_pick' ? 'Pick-up' : 'Delivery'}</span>
                                </div>

                                <div className="flex gap-4 mb-8">
                                    <div className="w-1.5 bg-orange-500 rounded-full" />
                                    <div>
                                        <p className="text-xs font-bold text-white/60 uppercase mb-1">{status === 'to_pick' ? 'Origen (Carga)' : 'Destino (Entrega)'}</p>
                                        <h4 className="text-xl font-bold">{status === 'to_pick' ? 'Av. Américo Vespucio 1200' : 'Calle Nueva 44, Of 20'}</h4>
                                        <p className="text-sm text-orange-400 font-bold mt-1 italic uppercase tracking-tighter">Pudahuel, Región Metropolitana</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex-1 bg-white text-[#1e3a5f] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl border-b-4 border-slate-200 active:border-b-0 active:translate-y-[4px] transition-all">
                                        <Navigation size={18} /> Navegar
                                    </button>
                                    <button
                                        onClick={() => setStatus(status === 'to_pick' ? 'to_delivery' : 'done')}
                                        className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 border-b-4 border-orange-700 active:border-b-0 active:translate-y-[4px] transition-all"
                                    >
                                        <CheckCircle2 size={18} /> Llegué
                                    </button>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 p-6 rounded-[2rem] bg-slate-100 text-slate-500 font-bold text-xs uppercase tracking-widest border-2 border-dashed border-slate-200">
                                <AlertTriangle size={18} /> Notificar Incidencia
                            </button>
                        </div>
                    )}

                    {status === 'done' && (
                        <div key="done" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center py-6">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                                    <Check size={40} className="stroke-[3]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800">Carga en Destino</h3>
                                <p className="text-slate-500 mt-2">Por favor, captura las pruebas de entrega.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 shadow-sm active:bg-slate-50 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Camera size={24} /></div>
                                        <span className="font-bold text-sm text-slate-700">Foto de Carga (Opcional)</span>
                                    </div>
                                    <ChevronRight className="text-slate-400" />
                                </label>

                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                        <PenTool size={16} /> Firma del Cliente
                                    </div>
                                    {/* Placeholder de Firma */}
                                    <div className="h-48 w-full bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 italic text-sm">
                                        Firmar aquí
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStatus('available')}
                                    className="w-full bg-[#1e3a5f] text-white py-6 rounded-[2rem] font-bold text-lg uppercase tracking-widest shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    Finalizar y Cerrar <Truck size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            {/* Bottom Nav Simulation */}
            <footer className="h-24 bg-white border-t border-slate-100 flex items-center justify-around px-8">
                <BottomNavItem icon={<Truck />} label="Ruta" active={status !== 'offline'} />
                <BottomNavItem icon={<Box />} label="Inventario" />
                <BottomNavItem icon={<Users />} label="Asistencia" />
            </footer >
        </div>
    );
}

function StatusPill({ active, label, color }: { active: boolean, label: string, color: string }) {
    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 ${active ? 'bg-white/10 opacity-100' : 'bg-white/5 opacity-50'}`}>
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{label}</span>
        </div>
    );
}

function EmptyState({ icon, title, desc }: any) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center pt-20 text-center px-10">
            <div className="mb-6">{icon}</div>
            <h4 className="text-xl font-bold text-slate-800">{title}</h4>
            <p className="text-slate-500 mt-2 leading-relaxed">{desc}</p>
        </div>
    );
}

function BottomNavItem({ icon, label, active }: any) {
    return (
        <div className={`flex flex-col items-center gap-1 ${active ? 'text-orange-500' : 'text-slate-400 opacity-50'}`}>
            {React.cloneElement(icon, { size: 24 })}
            <span className="text-[10px] font-black uppercase tracking-tighter italic">{label}</span>
        </div>
    );
}

function ArrowUpRight({ size, className }: any) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
    );
}
