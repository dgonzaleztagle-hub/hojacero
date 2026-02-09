'use client';

import { motion } from 'framer-motion';
import { LogOut, Calendar, DollarSign, TrendingUp, Target } from 'lucide-react';

interface EstrategiaSalidaSectionProps {
    data: {
        horizonte_años?: number;
        valor_venta_estimado_uf?: number;
        utilidad_capital_uf?: number;
        hoja_ruta?: string[];
    };
}

export function EstrategiaSalidaSection({ data }: EstrategiaSalidaSectionProps) {
    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
            {/* Premium Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
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
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50" />
                            <LogOut className="w-20 h-20 relative text-purple-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                        Estrategia de Salida
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Exit Strategy: Proyección de valor y utilidad de capital a mediano plazo
                    </p>
                </motion.div>

                {/* Métricas Clave */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {data.horizonte_años && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-35 transition" />

                            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8">
                                <Calendar className="w-12 h-12 text-blue-400 mb-4" />
                                <p className="text-slate-400 text-sm mb-2">Horizonte de Inversión</p>
                                <p className="text-5xl font-bold text-blue-400 mb-1">{data.horizonte_años}</p>
                                <p className="text-slate-500 text-sm">años</p>
                            </div>
                        </motion.div>
                    )}

                    {data.valor_venta_estimado_uf && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-35 transition" />

                            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8">
                                <DollarSign className="w-12 h-12 text-purple-400 mb-4" />
                                <p className="text-slate-400 text-sm mb-2">Valor de Venta Estimado</p>
                                <p className="text-5xl font-bold text-purple-400 mb-1">
                                    {data.valor_venta_estimado_uf.toLocaleString('es-CL')}
                                </p>
                                <p className="text-slate-500 text-sm">UF</p>
                            </div>
                        </motion.div>
                    )}

                    {data.utilidad_capital_uf && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition" />

                            <div className="relative bg-gradient-to-br from-green-950/50 via-slate-900 to-slate-900 border-2 border-green-500/30 rounded-2xl p-8">
                                <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
                                <p className="text-slate-400 text-sm mb-2">Utilidad de Capital</p>
                                <p className="text-5xl font-bold text-green-400 mb-1">
                                    {data.utilidad_capital_uf.toLocaleString('es-CL')}
                                </p>
                                <p className="text-slate-500 text-sm">UF</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Hoja de Ruta */}
                {data.hoja_ruta && data.hoja_ruta.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000" />

                            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800 rounded-3xl p-12">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 blur-lg opacity-50" />
                                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Target className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            Hoja de Ruta de Ejecución
                                        </h3>
                                        <p className="text-purple-400 text-lg">
                                            Pasos estratégicos para maximizar el retorno de inversión
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {data.hoja_ruta.map((paso, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex items-start gap-4 bg-slate-950/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition group/item"
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 blur-md opacity-0 group-hover/item:opacity-50 transition" />
                                                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold">{index + 1}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-lg leading-relaxed flex-1">
                                                {paso}
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
