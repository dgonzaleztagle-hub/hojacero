'use client';

import { useState } from 'react';
import { ScrollReveal } from './shared/ScrollReveal';
import { GlassPanel } from './shared/GlassPanel';
import { SectionContainer } from './shared/SectionContainer';
import { UtensilsCrossed, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompetenciaSectionProps {
    data: {
        titulo?: string;
        analisis_saturacion?: string;
        oportunidad?: string;
        riesgo?: string;
        categorias?: Record<string, { count: number; level: string; names?: string[] }>;
        tiers?: {
            local: {
                total: number;
                categories: Record<string, { count: number; details: Array<{ name: string, address: string }> }>;
            };
            delivery: {
                total: number;
                categories: Record<string, { count: number; details: Array<{ name: string, address: string }> }>;
            };
        };
    };
}

export function CompetenciaSection({ data }: CompetenciaSectionProps) {
    const [activeTier, setActiveTier] = useState<'local' | 'delivery'>('local');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const currentTierData = activeTier === 'local' ? data.tiers?.local : data.tiers?.delivery;

    // Categorías maestras para asegurar que se muestren todas (Océanos Azules)
    const masterCategories = [
        'sushi', 'chinese', 'korean', 'pizza', 'burger', 'chicken',
        'mexican', 'peruvian', 'seafood', 'healthy', 'grill', 'cafe'
    ];

    const activeCategoryData = selectedCategory ? currentTierData?.categories?.[selectedCategory] : null;

    return (
        <SectionContainer id="competencia" className="bg-gradient-to-b from-blue-950/20 to-slate-900 border-t border-white/5">
            <ScrollReveal>
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center gap-3 px-6 py-2 mb-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                    >
                        <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em]">
                            Inteligencia Competitiva Multicapa
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                        Dossier de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Saturación</span>
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full" />

                        {/* TIER SELECTOR */}
                        <div className="flex justify-center mt-8">
                            <div className="bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl flex gap-1">
                                <button
                                    onClick={() => {
                                        setActiveTier('local');
                                        setSelectedCategory(null);
                                    }}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTier === 'local' ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    PROXIMIDAD (2.5km)
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTier('delivery');
                                        setSelectedCategory(null);
                                    }}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTier === 'delivery' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    ZONA DELIVERY (5km+)
                                </button>
                            </div>
                        </div>

                        <p className="text-xl text-zinc-400 leading-relaxed font-light mt-8">
                            {activeTier === 'local'
                                ? "Análisis de causación por cercanía. Clientes que eligen por proximidad geográfica o acceso caminable."
                                : "Análisis de impacto digital y logística. Alcance de plataformas de despacho y competencia por conveniencia."}
                        </p>
                    </div>
                </div>

                {/* Dossier de Categorías - GRID ACTUALIZADO */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {masterCategories.map((categoria, i) => {
                        const tierCategory = currentTierData?.categories?.[categoria];
                        // @ts-ignore - Adaptación quirúrgica
                        const count = tierCategory?.count || 0;

                        const emoji = {
                            'sushi': '🍣', 'chinese': '🥡', 'korean': '🍜', 'pizza': '🍕',
                            'burger': '🍔', 'chicken': '🍗', 'mexican': '🌮', 'peruvian': '🇵🇪',
                            'seafood': '🦐', 'cafe': '☕', 'healthy': '🥗', 'grill': '🥩'
                        }[categoria.toLowerCase()] || '🍽️';

                        const level = count >= 4 ? 'CRÍTICA' : count >= 2 ? 'ALTA' : count >= 1 ? 'MEDIA' : 'NULA';

                        const levelConfig = {
                            'CRÍTICA': { color: 'text-red-400', border: 'border-red-500/30' },
                            'ALTA': { color: 'text-orange-400', border: 'border-orange-500/30' },
                            'MEDIA': { color: 'text-yellow-400', border: 'border-yellow-500/30' },
                            'NULA': { color: 'text-emerald-400', border: 'border-emerald-500/30' },
                        }[level];

                        return (
                            <motion.div
                                key={`${activeTier}-${categoria}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => count > 0 && setSelectedCategory(categoria)}
                                className={`relative p-5 bg-zinc-900/40 border ${levelConfig.border} rounded-2xl backdrop-blur-sm group hover:bg-zinc-900/60 transition-all cursor-pointer overflow-hidden`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`text-4xl grayscale group-hover:grayscale-0 transition-all duration-500`}>
                                            {emoji}
                                        </span>
                                        {level === 'NULA' && (
                                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase tracking-tighter">
                                                Océano Azul
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">{categoria}</h4>
                                    <div className="text-3xl font-black text-white mb-2">
                                        {count.toString().padStart(2, '0')}
                                    </div>
                                    <div className={`text-[9px] font-black uppercase tracking-widest ${levelConfig.color}`}>
                                        Saturación {level}
                                    </div>

                                    {count > 0 && (
                                        <div className="mt-4 text-[8px] text-zinc-500 uppercase tracking-widest font-bold group-hover:text-zinc-300 transition-colors">
                                            Ver actores
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* MODAL PARA ACTORES */}
                <AnimatePresence>
                    {selectedCategory && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedCategory(null)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl z-[101] overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-3xl">
                                            {{
                                                'sushi': '🍣', 'chinese': '🥡', 'korean': '🍜', 'pizza': '🍕',
                                                'burger': '🍔', 'chicken': '🍗', 'mexican': '🌮', 'peruvian': '🇵🇪',
                                                'seafood': '🦐', 'cafe': '☕', 'healthy': '🥗', 'grill': '🥩'
                                            }[selectedCategory.toLowerCase()] || '🍽️'}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white uppercase tracking-widest leading-none mb-2">
                                                {selectedCategory}
                                            </h3>
                                            <div className="text-xs font-black text-orange-400 uppercase tracking-widest">
                                                Actores en {activeTier === 'local' ? 'Proximidad' : 'Delivery'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-zinc-400" />
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {activeCategoryData?.details.map((local: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                                        >
                                            <div className="text-sm font-bold text-zinc-100 group-hover:text-orange-400 transition-colors mb-1">
                                                {local.name}
                                            </div>
                                            <div className="text-xs text-zinc-500 font-light flex items-center gap-2">
                                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                                {local.address || 'Dirección no disponible'}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="w-full mt-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-200 transition-all"
                                >
                                    Cerrar Intelligence
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Estratégico Section */}
                <div className="grid md:grid-cols-2 gap-8">
                    {data.oportunidad && (
                        <div className="p-8 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl relative overflow-hidden group">
                            <TrendingUp className="absolute top-4 right-4 w-12 h-12 text-emerald-500/10 group-hover:scale-125 transition-transform duration-700" />
                            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Ventaja Competitiva</h4>
                            <p className="text-xl text-zinc-300 font-light leading-relaxed">
                                {data.oportunidad}
                            </p>
                        </div>
                    )}
                    {data.riesgo && (
                        <div className="p-8 bg-red-950/20 border border-red-500/20 rounded-3xl relative overflow-hidden group">
                            <AlertTriangle className="absolute top-4 right-4 w-12 h-12 text-red-500/10 group-hover:scale-125 transition-transform duration-700" />
                            <h4 className="text-sm font-black text-red-400 uppercase tracking-[0.3em] mb-4">Riesgo de Mercado</h4>
                            <p className="text-xl text-zinc-300 font-light leading-relaxed">
                                {data.riesgo}
                            </p>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </SectionContainer>
    );
}
