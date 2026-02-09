'use client';

import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, MapPin, Sparkles } from 'lucide-react';

interface MacroEntornoSectionProps {
    data: {
        efecto_fortaleza?: string;
        masa_critica?: string;
        gse_predominante?: string;
        comportamiento_consumidor?: string;
    };
}

export function MacroEntornoSection({ data }: MacroEntornoSectionProps) {
    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Premium */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-block mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50" />
                            <Building2 className="w-20 h-20 relative text-blue-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                        Macro-Entorno Estratégico
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Análisis del ecosistema comercial y dinámicas de mercado que definen el potencial de inversión
                    </p>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-1 w-32 mx-auto mt-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                </motion.div>

                {/* Efecto Fortaleza - Hero Card */}
                {data.efecto_fortaleza && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-16"
                    >
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000" />

                            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800/50 rounded-3xl p-10 md:p-12">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 blur-lg opacity-50" />
                                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                            <Building2 className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                            Efecto Fortaleza
                                        </h3>
                                        <p className="text-blue-400 text-lg">
                                            Análisis de polo comercial y ecosistema cerrado
                                        </p>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none">
                                    <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                        {data.efecto_fortaleza}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Grid de Insights */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Masa Crítica */}
                    {data.masa_critica && (
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />

                            <div className="relative bg-slate-900/90 border border-slate-800/50 rounded-2xl p-8 h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                        <Users className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Masa Crítica
                                    </h3>
                                </div>

                                <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
                                    {data.masa_critica}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* GSE Predominante */}
                    {data.gse_predominante && (
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />

                            <div className="relative bg-slate-900/90 border border-slate-800/50 rounded-2xl p-8 h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <MapPin className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        GSE Predominante
                                    </h3>
                                </div>

                                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                                    {data.gse_predominante}
                                </div>

                                <p className="text-slate-400 text-sm">
                                    Grupo socioeconómico dominante en la zona
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Comportamiento del Consumidor - Full Width */}
                {data.comportamiento_consumidor && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000" />

                        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/90 border border-slate-800/50 rounded-3xl p-10">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 blur-lg opacity-50" />
                                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        Comportamiento del Consumidor
                                    </h3>
                                    <p className="text-cyan-400 text-lg">
                                        Tendencias y patrones de consumo identificados
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                                    {data.comportamiento_consumidor}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Decorative Element */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center mt-16"
                >
                    <div className="flex items-center gap-3 text-slate-600">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">Análisis Estratégico HojaCero</span>
                        <Sparkles className="w-5 h-5" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
