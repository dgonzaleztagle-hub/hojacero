'use client';

import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { Car, Footprints, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';

interface FlujosSectionProps {
    data: {
        titulo?: string;
        flujo_vehicular: string;
        flujo_peatonal: string;
        polos_atraccion?: string | string[];
    };
    anchors_fallback?: Array<{ name: string; category?: string }>;
}

export function FlujosSection({ data, anchors_fallback }: FlujosSectionProps) {
    // Fallback: Si Groq no generó polos_atraccion, usar las anclas comerciales crudas
    const hasPolosAtraccion = data.polos_atraccion && (
        Array.isArray(data.polos_atraccion) ? data.polos_atraccion.length > 0 : data.polos_atraccion.trim() !== ''
    );
    const shouldShowAnchors = hasPolosAtraccion || (anchors_fallback && anchors_fallback.length > 0);

    return (
        <SectionContainer id="flujos" className="bg-gradient-to-b from-slate-900 to-blue-950/20">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 rounded-full mb-8"
                    >
                        <Car className="w-4 h-4 text-green-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">
                            Flow Dynamics • Lvl 3
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white uppercase">
                        Análisis de <span className="text-green-500 italic">Flujos</span>
                    </h2>

                    <div className="max-w-3xl mx-auto">
                        <div className="h-1 w-24 bg-green-500 mx-auto rounded-full mb-8" />
                        <p className="text-2xl text-zinc-400 font-light leading-snug">
                            Mapeo de atracción comercial e intensidad de tráfico en el punto focal.
                        </p>
                    </div>
                </div>

                {/* Grid de Flujos */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Flujo Vehicular */}
                    <ScrollReveal delay={0.2}>
                        <GlassPanel gradient="from-green-500/10 to-emerald-500/5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-500/20 rounded-xl">
                                        <Car className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Flujo Vehicular</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-green-500/50 to-transparent" />
                                <p className="text-lg text-zinc-300 leading-relaxed">
                                    {data.flujo_vehicular}
                                </p>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-sm text-zinc-400">
                                        El flujo vehicular determina la visibilidad de tu local desde la calle
                                        y la facilidad de acceso para clientes motorizados.
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>

                    {/* Flujo Peatonal */}
                    <ScrollReveal delay={0.3}>
                        <GlassPanel gradient="from-emerald-500/10 to-green-500/5">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                                        <Footprints className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Flujo Peatonal</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
                                <p className="text-lg text-zinc-300 leading-relaxed">
                                    {data.flujo_peatonal}
                                </p>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-sm text-zinc-400">
                                        El tráfico peatonal es crítico para negocios que dependen de compras
                                        impulsivas o clientes que caminan por la zona.
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                </div>

                {/* Polos de Atracción */}
                {shouldShowAnchors && (
                    <ScrollReveal delay={0.4}>
                        <GlassPanel gradient="from-green-500/5 via-emerald-500/5 to-transparent">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-500/20 rounded-xl">
                                        <Anchor className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Polos de Atracción (Anclas)</h3>
                                </div>
                                <div className="h-px bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-transparent" />
                                {hasPolosAtraccion ? (
                                    // Mostrar datos de Groq
                                    Array.isArray(data.polos_atraccion) ? (
                                        <ul className="text-lg text-zinc-300 leading-relaxed space-y-2">
                                            {data.polos_atraccion.map((polo, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <span className="text-green-400 mt-1">•</span>
                                                    <span>{polo}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-lg text-zinc-300 leading-relaxed">
                                            {data.polos_atraccion}
                                        </p>
                                    )
                                ) : (
                                    // Fallback: Mostrar anclas comerciales crudas
                                    <ul className="text-lg text-zinc-300 leading-relaxed space-y-2">
                                        {anchors_fallback?.map((anchor, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <span className="text-green-400 mt-1">•</span>
                                                <span>
                                                    {anchor.name}
                                                    {anchor.category && (
                                                        <span className="text-zinc-500 text-sm ml-2">({anchor.category})</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <p className="text-sm text-zinc-400">
                                        💡 <span className="text-green-300 font-semibold">Insight Estratégico:</span> Los
                                        polos de atracción generan tráfico constante que puedes aprovechar. Posiciónate
                                        cerca de estas anclas para capturar clientes en tránsito.
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>
                    </ScrollReveal>
                )}
            </ScrollReveal>
        </SectionContainer>
    );
}
