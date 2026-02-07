'use client';

import { useState, useEffect } from 'react';
import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { BarChart3, CheckCircle2, Rocket, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface VeredictoSectionProps {
    data: {
        titulo?: string;
        viabilidad: string;
        resumen: string;
        estrategia_recomendada?: string;
        recomendacion_final?: string;
    };
}

export function VeredictoSection({ data }: VeredictoSectionProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // Determinar color y mensaje según viabilidad
    const getViabilidadConfig = (viabilidad: string) => {
        const v = viabilidad.toUpperCase();
        if (v.includes('MUY_ALTA') || v.includes('ALTA')) return { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'from-emerald-950/40 to-slate-900', label: 'INVESTMENT GRADE' };
        if (v.includes('MEDIA')) return { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'from-amber-950/40 to-slate-900', label: 'MODERATE RISK' };
        return { color: 'text-red-400', border: 'border-red-500/30', bg: 'from-red-950/40 to-slate-900', label: 'HIGH RISK' };
    };

    const config = getViabilidadConfig(data.viabilidad);

    return (
        <SectionContainer id="veredicto" className="bg-slate-900 border-t border-white/5 pb-32">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1 border border-white/10 rounded-full mb-8"
                    >
                        <div className={`w-2 h-2 rounded-full animate-pulse ${config.color.replace('text', 'bg')}`} />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            Executive Summary • HojaCero Intel
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase">
                        Veredicto de <span className="text-zinc-600 italic">Inversión</span>
                    </h2>
                </div>

                {/* Scorecard de Inversión */}
                <div className="max-w-6xl mx-auto">
                    <div className={`grid lg:grid-cols-12 gap-px bg-white/5 border ${config.border} rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl`}>

                        {/* Rating Panel */}
                        <div className={`lg:col-span-4 p-12 bg-gradient-to-b ${config.bg} flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r ${config.border}`}>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Investment Score</p>
                            <div className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter ${config.color}`}>
                                {data.viabilidad.split(' ')[0]}
                            </div>
                            <div className="px-4 py-1 bg-black/40 rounded-full border border-white/10">
                                <span className={`text-xs font-black uppercase tracking-widest ${config.color}`}>
                                    {config.label}
                                </span>
                            </div>
                            <motion.div
                                className="mt-8 flex gap-1"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className={`w-8 h-1 rounded-full ${s <= (data.viabilidad.includes('ALTA') ? 5 : data.viabilidad.includes('MEDIA') ? 3 : 2) ? config.color.replace('text', 'bg') : 'bg-white/10'}`} />
                                ))}
                            </motion.div>
                        </div>

                        {/* Narrative Panel */}
                        <div className="lg:col-span-8 p-12 bg-black/40">
                            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <div className="w-8 h-px bg-zinc-800" />
                                Argumento de Negocios
                            </h3>
                            <div className="space-y-8">
                                <p className="text-2xl font-light text-white leading-tight">
                                    {data.resumen}
                                </p>

                                {data.estrategia_recomendada && (
                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                                                <Rocket className={`w-5 h-5 ${config.color}`} />
                                            </div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest mt-1">
                                                Producto Ganador y Estrategia
                                            </h4>
                                        </div>
                                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4">
                                            "{data.estrategia_recomendada}"
                                        </p>
                                        {data.recomendacion_final && (
                                            <p className="text-lg text-zinc-400 font-light leading-relaxed">
                                                {data.recomendacion_final}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer Técnico */}
                    <div className="mt-12 flex justify-between items-center text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em] px-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Validado por Motor HojaCero v4.2
                        </div>
                        <div>
                            Dossier Generado: {isMounted ? new Date().toLocaleDateString() : '--/--/----'}
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </SectionContainer>
    );
}
