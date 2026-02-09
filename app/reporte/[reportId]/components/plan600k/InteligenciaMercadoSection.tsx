'use client';

import { motion } from 'framer-motion';
import { Store, XCircle, CheckCircle, Target, Lightbulb, TrendingUp } from 'lucide-react';

interface InteligenciaMercadoSectionProps {
    data: {
        tenant_mix_evitar?: Array<{ rubro: string; razon: string }>;
        tenant_mix_recomendado?: Array<{ prioridad: number; rubro: string; data: string; estrategia: string }>;
    };
}

export function InteligenciaMercadoSection({ data }: InteligenciaMercadoSectionProps) {
    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-50" />
                            <Store className="w-20 h-20 relative text-orange-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                        Inteligencia de Mercado
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Análisis estratégico de <span className="text-orange-400 font-semibold">Tenant Mix</span> para maximizar rentabilidad y minimizar riesgo de vacancia
                    </p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-1 w-32 mx-auto mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    />
                </motion.div>

                {/* Rubros a EVITAR - Zona de Peligro */}
                {data.tenant_mix_evitar && data.tenant_mix_evitar.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-20"
                    >
                        <div className="relative group">
                            {/* Danger Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000" />

                            <div className="relative bg-gradient-to-br from-red-950/50 via-slate-900 to-slate-900 border-2 border-red-500/30 rounded-3xl p-10">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 animate-pulse" />
                                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                            <XCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            ⚠️ Rubros a EVITAR
                                        </h3>
                                        <p className="text-red-400 text-lg font-medium">
                                            Sectores saturados o de alto riesgo identificados
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {data.tenant_mix_evitar.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="bg-slate-900/70 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                                                <h4 className="text-xl font-bold text-red-400">{item.rubro}</h4>
                                            </div>
                                            <p className="text-slate-300 leading-relaxed pl-8">
                                                {item.razon}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Rubros RECOMENDADOS - Zona de Oportunidad */}
                {data.tenant_mix_recomendado && data.tenant_mix_recomendado.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div className="relative group">
                            {/* Success Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000" />

                            <div className="relative bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900 border-2 border-green-500/30 rounded-3xl p-10">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500 blur-lg opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            ✅ Rubros RECOMENDADOS
                                        </h3>
                                        <p className="text-green-400 text-lg font-medium">
                                            Oportunidades estratégicas con alto potencial de rentabilidad
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {data.tenant_mix_recomendado
                                        .sort((a, b) => a.prioridad - b.prioridad)
                                        .map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + index * 0.15 }}
                                                className="relative group/card"
                                            >
                                                {/* Priority Badge Glow */}
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover/card:opacity-30 transition duration-500" />

                                                <div className="relative bg-slate-900/70 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 transition-all">
                                                    {/* Priority Badge */}
                                                    <div className="absolute -top-4 -right-4">
                                                        <div className="relative">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 blur-md opacity-75" />
                                                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center border-4 border-slate-900">
                                                                <span className="text-slate-900 font-bold text-lg">#{item.prioridad}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Header */}
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                                            <Target className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                                {item.rubro}
                                                            </h4>
                                                            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                                                <TrendingUp className="w-4 h-4" />
                                                                <span>Prioridad {item.prioridad}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Data Section */}
                                                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 mb-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Lightbulb className="w-5 h-5 text-blue-400" />
                                                            <h5 className="text-lg font-semibold text-blue-400">Justificación con Datos</h5>
                                                        </div>
                                                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                                            {item.data}
                                                        </p>
                                                    </div>

                                                    {/* Strategy Section */}
                                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                            <h5 className="text-lg font-semibold text-green-400">Estrategia de Ejecución</h5>
                                                        </div>
                                                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                                            {item.estrategia}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
