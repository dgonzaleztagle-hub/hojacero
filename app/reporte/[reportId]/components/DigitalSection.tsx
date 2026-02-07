'use client';

import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { Smartphone, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface DigitalSectionProps {
    data: {
        titulo?: string;
        presencia_local?: string;
        estrategia?: string;
        plan_ataque?: string[];
    };
}

export function DigitalSection({ data }: DigitalSectionProps) {
    // Determinar si tenemos contenido para mostrar
    const hasPlanAtaque = data.plan_ataque && data.plan_ataque.length > 0;
    const hasPresenciaLocal = data.presencia_local && data.presencia_local.trim().length > 0;
    const hasEstrategia = data.estrategia && data.estrategia.trim().length > 0;

    return (
        <SectionContainer id="digital" className="bg-gradient-to-b from-blue-950/20 to-slate-900">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 rounded-full mb-8"
                    >
                        <Smartphone className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            Digital Mindshare • Lvl 4
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase">
                        Dominio <span className="text-blue-500 italic">Digital</span>
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full mb-8" />
                        <p className="text-2xl text-zinc-400 font-light leading-snug">
                            Estrategia de captura de demanda en canales hiper-locales.
                        </p>
                    </div>
                </div>

                {/* Plan de Ataque (Array) */}
                {hasPlanAtaque && (
                    <ScrollReveal delay={0.2}>
                        <GlassPanel gradient="from-blue-500/10 via-purple-500/5 to-transparent">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/20 rounded-xl">
                                        <Target className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Presencia Digital Local</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent" />
                                <div className="space-y-3">
                                    {data.plan_ataque!.map((accion, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                                        >
                                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
                                                {i + 1}
                                            </span>
                                            <p className="text-lg text-zinc-300 leading-relaxed">
                                                {typeof accion === 'object' ? (
                                                    <>
                                                        <span className="font-bold text-blue-400">{(accion as any).plataforma}:</span> {(accion as any).detalle}
                                                    </>
                                                ) : (accion as any)}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                )}

                {/* Presencia Local (String - Legacy) */}
                {!hasPlanAtaque && hasPresenciaLocal && (
                    <ScrollReveal delay={0.2}>
                        <GlassPanel gradient="from-blue-500/10 via-purple-500/5 to-transparent">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/20 rounded-xl">
                                        <Target className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Presencia Digital Local</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent" />
                                <p className="text-lg text-zinc-300 leading-relaxed">
                                    {data.presencia_local}
                                </p>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                )}

                {/* Fallback cuando no hay contenido */}
                {!hasPlanAtaque && !hasPresenciaLocal && (
                    <ScrollReveal delay={0.2}>
                        <GlassPanel gradient="from-blue-500/10 via-purple-500/5 to-transparent">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/20 rounded-xl">
                                        <Target className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Presencia Digital Local</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-transparent" />
                                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <p className="text-lg text-blue-300 leading-relaxed">
                                        💡 Estrategia digital en análisis. Las recomendaciones incluirán presencia en redes sociales, grupos locales, y plataformas de delivery específicas para tu zona.
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                )}

                {/* Estrategia */}
                {hasEstrategia && (
                    <ScrollReveal delay={0.3}>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="mt-8 p-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-500/40 rounded-2xl backdrop-blur-xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/30 rounded-xl">
                                    <Zap className="w-8 h-8 text-purple-300" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-4">
                                        Tu Plan de Ataque Digital
                                    </p>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line">
                                            {data.estrategia}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </ScrollReveal>
                )}

                {/* Pro Tip */}
                <ScrollReveal delay={0.4}>
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl">
                        <p className="text-center text-zinc-400 italic">
                            💡 <span className="text-blue-300 font-semibold">Pro Tip:</span> El marketing digital
                            no reemplaza un buen producto, pero amplifica tu alcance. Implementa estas tácticas
                            de forma consistente durante los primeros 90 días.
                        </p>
                    </div>
                </ScrollReveal>
            </ScrollReveal>
        </SectionContainer>
    );
}
