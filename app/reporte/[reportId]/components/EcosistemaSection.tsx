'use client';

import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { MapPin, Wifi, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface EcosistemaSectionProps {
    data: {
        titulo?: string;
        tipo_zona: string;
        dinamica: string;
        conectividad?: string;
    };
}

export function EcosistemaSection({ data }: EcosistemaSectionProps) {
    return (
        <SectionContainer id="ecosistema" className="bg-gradient-to-b from-slate-900 to-blue-950/20">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 rounded-full mb-8"
                    >
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            Territorial Intelligence • Lvl 1
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase">
                        Análisis del <span className="text-blue-500 italic">Entorno</span>
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full mb-8" />
                        <p className="text-2xl text-zinc-400 font-light leading-snug">
                            Evaluación macro-territorial del cuadrante estratégico y dinámicas de barrio.
                        </p>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Tipo de Zona */}
                    <ScrollReveal delay={0.2}>
                        <GlassPanel gradient="from-blue-500/10 to-cyan-500/5">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Navigation className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Tipo de Zona</h3>
                                    <p className="text-2xl font-bold text-blue-300 mb-3">{data.tipo_zona}</p>
                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        Esta clasificación define el carácter fundamental del territorio y las dinámicas
                                        comerciales que puedes esperar.
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>

                    {/* Conectividad */}
                    {data.conectividad && (
                        <ScrollReveal delay={0.3}>
                            <GlassPanel gradient="from-cyan-500/10 to-blue-500/5">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-cyan-500/20 rounded-xl">
                                        <Wifi className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">Conectividad</h3>
                                        <p className="text-zinc-300 leading-relaxed">{data.conectividad}</p>
                                    </div>
                                </div>
                            </GlassPanel>
                        </ScrollReveal>
                    )}
                </div>

                {/* Dinámica - Full Width Narrative */}
                <ScrollReveal delay={0.4}>
                    <GlassPanel className="mt-8" gradient="from-blue-500/5 via-cyan-500/5 to-transparent">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                Dinámica del Barrio
                            </h3>
                            <div className="h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-transparent" />
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                {data.dinamica}
                            </p>

                            {/* Decorative element */}
                            <div className="flex items-center gap-2 pt-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                                <span className="text-xs text-blue-400/60 uppercase tracking-widest">Análisis Territorial</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                            </div>
                        </div>
                    </GlassPanel>
                </ScrollReveal>

                {/* Bottom accent */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-zinc-500 italic">
                        Este análisis se basa en datos geoespaciales, flujos de movilidad y observación territorial
                    </p>
                </div>
            </ScrollReveal>
        </SectionContainer>
    );
}
