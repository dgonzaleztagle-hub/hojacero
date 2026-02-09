'use client';

import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface FactibilidadNormativaSectionProps {
    data: {
        disclaimer?: string;
        zonificacion_estimada?: string;
        aptitud_comercial?: string;
        restricciones_potenciales?: string;
        pasos_siguientes?: string;
    };
}

export function FactibilidadNormativaSection({ data }: FactibilidadNormativaSectionProps) {
    const pasos = data.pasos_siguientes?.split(/\d+\./).filter(Boolean) || [];

    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring" }}
                        className="inline-block mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 blur-xl opacity-50" />
                            <FileText className="w-20 h-20 relative text-yellow-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                        Factibilidad Normativa
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Análisis preliminar de zonificación y aptitud comercial del terreno
                    </p>
                </motion.div>

                {/* Disclaimer Crítico */}
                {data.disclaimer && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-50 transition" />

                            <div className="relative bg-gradient-to-br from-yellow-950/50 via-slate-900 to-slate-900 border-2 border-yellow-500/40 rounded-2xl p-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-6 h-6 text-white animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-yellow-400 mb-2">Importante - Validación Requerida</h3>
                                        <p className="text-slate-300 leading-relaxed text-lg">
                                            {data.disclaimer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid de Análisis */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Zonificación */}
                    {data.zonificacion_estimada && (
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition" />

                            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8 h-full">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    Zonificación Estimada
                                </h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                    {data.zonificacion_estimada}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Aptitud Comercial */}
                    {data.aptitud_comercial && (
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition" />

                            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8 h-full">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    Aptitud Comercial
                                </h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                    {data.aptitud_comercial}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Restricciones */}
                {data.restricciones_potenciales && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition" />

                            <div className="relative bg-slate-900/90 border border-red-500/30 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    Restricciones Potenciales
                                </h3>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                                    {data.restricciones_potenciales}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pasos Siguientes */}
                {pasos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-35 transition" />

                            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800 rounded-3xl p-10">
                                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <ArrowRight className="w-6 h-6 text-white" />
                                    </div>
                                    Próximos Pasos Recomendados
                                </h3>

                                <div className="space-y-4">
                                    {pasos.map((paso, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 bg-slate-950/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold">{index + 1}</span>
                                            </div>
                                            <p className="text-slate-300 leading-relaxed flex-1">
                                                {paso.trim()}
                                            </p>
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
