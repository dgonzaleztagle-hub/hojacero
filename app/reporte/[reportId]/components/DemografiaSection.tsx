'use client';

import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { Users, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface DemografiaSectionProps {
    data: {
        titulo?: string;
        perfil_principal: string;
        poder_adquisitivo: string;
        densidad: string;
        dato_clave?: string;
    };
}

export function DemografiaSection({ data }: DemografiaSectionProps) {
    return (
        <SectionContainer id="demografia" className="bg-gradient-to-b from-blue-950/20 to-slate-900">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 rounded-full mb-8"
                    >
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            Consumer Insight • Lvl 2
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase">
                        Perfil del <span className="text-purple-500 italic">Consumidor</span>
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full mb-8" />
                        <p className="text-2xl text-zinc-400 font-light leading-snug">
                            Análisis socio-económico y psicográfico de la demanda potencial.
                        </p>
                    </div>
                </div>

                {/* Perfil Principal - Hero Card */}
                <ScrollReveal delay={0.2}>
                    <GlassPanel className="mb-8" gradient="from-purple-500/10 via-pink-500/5 to-transparent">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">Perfil del Cliente</h3>
                            </div>
                            <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent" />
                            <p className="text-lg text-zinc-300 leading-relaxed">
                                {data.perfil_principal}
                            </p>
                        </div>
                    </GlassPanel>
                </ScrollReveal>

                {/* Dato Clave - Destacado */}
                {data.dato_clave && (
                    <ScrollReveal delay={0.3}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="mb-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 rounded-2xl backdrop-blur-xl"
                        >
                            <div className="flex items-start gap-4">
                                <Sparkles className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-pink-300 uppercase tracking-wider mb-2">
                                        Dato Clave
                                    </p>
                                    <p className="text-xl text-white font-medium italic">
                                        "{data.dato_clave}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </ScrollReveal>
                )}

                {/* Grid de Métricas */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Poder Adquisitivo */}
                    <ScrollReveal delay={0.4}>
                        <GlassPanel gradient="from-purple-500/10 to-pink-500/5">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <DollarSign className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Poder Adquisitivo</h3>
                                    <p className="text-zinc-300 leading-relaxed">{data.poder_adquisitivo}</p>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-sm text-zinc-400">
                                            Este indicador define la capacidad de gasto de tu cliente potencial y te ayuda
                                            a calibrar tu estrategia de precios.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>

                    {/* Densidad */}
                    <ScrollReveal delay={0.5}>
                        <GlassPanel gradient="from-pink-500/10 to-purple-500/5">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-500/20 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-pink-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Densidad Poblacional</h3>
                                    <p className="text-2xl font-bold text-pink-300 mb-3">{data.densidad}</p>
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-sm text-zinc-400">
                                            La densidad poblacional determina el tamaño potencial de tu mercado local
                                            y la frecuencia de tráfico esperada.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                </div>

                {/* Bottom insight */}
                <ScrollReveal delay={0.6}>
                    <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl">
                        <p className="text-center text-zinc-400 italic">
                            💡 <span className="text-purple-300 font-semibold">Pro Tip:</span> Estos datos demográficos
                            te permiten diseñar una propuesta de valor que resuene directamente con las necesidades
                            y capacidades de tu audiencia objetivo.
                        </p>
                    </div>
                </ScrollReveal>
            </ScrollReveal>
        </SectionContainer>
    );
}
