'use client';

import { motion } from 'framer-motion';
import { Home, Store, Building, TrendingUp, AlertCircle, Crown } from 'lucide-react';

interface EscenariosDesarrolloSectionProps {
    data: {
        disclaimer?: string;
        escenario_residencial?: {
            descripcion: string;
            precio_venta_uf_m2: number | string;
            cap_rate_estimado: string;
            viabilidad: string;
        };
        escenario_comercial_light?: {
            descripcion: string;
            precio_venta_uf_m2: string;
            cap_rate_estimado: string;
            viabilidad: string;
        };
        escenario_obra_nueva?: {
            descripcion: string;
            inversion_estimada_uf: string;
            cap_rate_estimado: string;
            viabilidad: string;
        };
        recomendacion_highest_best_use?: string;
    };
}

export function EscenariosDesarrolloSection({ data }: EscenariosDesarrolloSectionProps) {
    const getViabilidadColor = (viabilidad: string) => {
        if (viabilidad?.includes('ALTA')) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', border: 'border-green-500/30' };
        if (viabilidad?.includes('MEDIA')) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400', border: 'border-yellow-500/30' };
        return { bg: 'from-red-500 to-rose-500', text: 'text-red-400', border: 'border-red-500/30' };
    };

    const escenarios = [
        {
            key: 'residencial',
            icon: Home,
            title: 'Desarrollo Residencial',
            color: 'from-blue-500 to-cyan-500',
            data: data.escenario_residencial
        },
        {
            key: 'comercial_light',
            icon: Store,
            title: 'Comercial Light',
            color: 'from-purple-500 to-pink-500',
            data: data.escenario_comercial_light
        },
        {
            key: 'obra_nueva',
            icon: Building,
            title: 'Obra Nueva',
            color: 'from-orange-500 to-red-500',
            data: data.escenario_obra_nueva
        }
    ];

    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
                        style={{
                            background: `linear-gradient(to right, ${['#3b82f6', '#a855f7', '#f97316'][i]}, ${['#06b6d4', '#ec4899', '#ef4444'][i]})`,
                            top: `${20 + i * 30}%`,
                            left: `${10 + i * 30}%`,
                            animation: `float ${8 + i * 2}s ease-in-out infinite`,
                            animationDelay: `${i * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-block mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50" />
                            <Building className="w-20 h-20 relative text-blue-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Escenarios de Desarrollo
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed mb-4">
                        Análisis comparativo de <span className="text-purple-400 font-semibold">Highest & Best Use</span>
                    </p>

                    <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                        Evaluación financiera de diferentes escenarios de desarrollo para maximizar retorno de inversión
                    </p>
                </motion.div>

                {/* Disclaimer */}
                {data.disclaimer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                            <p className="text-yellow-200 leading-relaxed">{data.disclaimer}</p>
                        </div>
                    </motion.div>
                )}

                {/* Escenarios Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-20">
                    {escenarios.map((escenario, index) => {
                        const Icon = escenario.icon;
                        const viabilidad = escenario.data ? getViabilidadColor(escenario.data.viabilidad) : null;

                        return escenario.data && (
                            <motion.div
                                key={escenario.key}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative group"
                            >
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${escenario.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500`} />

                                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8 h-full flex flex-col">
                                    {/* Icon Header */}
                                    <div className="mb-6">
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${escenario.color} flex items-center justify-center mb-4`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {escenario.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {escenario.data.descripcion}
                                        </p>
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-4 mb-6 flex-1">
                                        {escenario.data.precio_venta_uf_m2 && (
                                            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                                                <p className="text-slate-500 text-sm mb-1">Precio Venta</p>
                                                <p className="text-white text-xl font-bold">
                                                    {typeof escenario.data.precio_venta_uf_m2 === 'number'
                                                        ? `${escenario.data.precio_venta_uf_m2} UF/m²`
                                                        : escenario.data.precio_venta_uf_m2}
                                                </p>
                                            </div>
                                        )}

                                        {escenario.key === 'obra_nueva' && escenario.data.inversion_estimada_uf && (
                                            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                                                <p className="text-slate-500 text-sm mb-1">Inversión Estimada</p>
                                                <p className="text-white text-xl font-bold">
                                                    {escenario.data.inversion_estimada_uf}
                                                </p>
                                            </div>
                                        )}

                                        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="w-4 h-4 text-green-400" />
                                                <p className="text-slate-500 text-sm">Cap Rate Estimado</p>
                                            </div>
                                            <p className="text-green-400 text-2xl font-bold">
                                                {escenario.data.cap_rate_estimado}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Viabilidad Badge */}
                                    {viabilidad && (
                                        <div className={`border ${viabilidad.border} rounded-lg p-4 bg-gradient-to-br ${viabilidad.bg} bg-opacity-10`}>
                                            <p className="text-slate-400 text-xs mb-1">Viabilidad</p>
                                            <p className={`${viabilidad.text} text-lg font-bold`}>
                                                {escenario.data.viabilidad}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Recomendación Highest & Best Use */}
                {data.recomendacion_highest_best_use && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-50 transition duration-1000" />

                            <div className="relative bg-gradient-to-br from-yellow-950/30 via-slate-900 to-slate-900 border-2 border-yellow-500/40 rounded-3xl p-12">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 blur-lg opacity-75 animate-pulse" />
                                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                                            <Crown className="w-10 h-10 text-slate-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">
                                            🏆 Highest & Best Use
                                        </h3>
                                        <p className="text-yellow-400 text-xl font-medium">
                                            Recomendación estratégica basada en análisis financiero
                                        </p>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-xl max-w-none">
                                    <p className="text-slate-200 text-xl leading-relaxed whitespace-pre-line">
                                        {data.recomendacion_highest_best_use}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </section>
    );
}
