'use client';

import { motion } from 'framer-motion';
import { Smartphone, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalisisAlgoritmosSectionProps {
    data: {
        disclaimer?: string;
        saturacion_apps?: {
            rappi?: string;
            uber_eats?: string;
            pedidos_ya?: string;
        };
        estimacion_presencia?: string;
        oportunidad_ranking?: string;
        recomendacion_estrategia?: string;
    };
}

export function AnalisisAlgoritmosSection({ data }: AnalisisAlgoritmosSectionProps) {
    const apps = [
        { name: 'Rappi', level: data.saturacion_apps?.rappi, color: 'from-orange-500 to-red-500' },
        { name: 'Uber Eats', level: data.saturacion_apps?.uber_eats, color: 'from-green-500 to-emerald-500' },
        { name: 'PedidosYa', level: data.saturacion_apps?.pedidos_ya, color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <section className="relative py-24 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Análisis de Algoritmos
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Saturación en apps de delivery
                    </p>
                </motion.div>

                {/* Disclaimer */}
                {data.disclaimer && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-12 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-200 text-sm">{data.disclaimer}</p>
                    </motion.div>
                )}

                {/* Apps Saturation */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {apps.map((app, index) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.color} mb-4 flex items-center justify-center`}>
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white">{app.name}</h3>
                            <p className="text-3xl font-bold mb-1 text-blue-400">{app.level || 'N/A'}</p>
                            <p className="text-sm text-slate-500">Saturación estimada</p>
                        </motion.div>
                    ))}
                </div>

                {/* Insights */}
                <div className="grid md:grid-cols-2 gap-8">
                    {data.estimacion_presencia && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-3 text-white">Presencia Estimada</h3>
                            <p className="text-slate-300">{data.estimacion_presencia}</p>
                        </motion.div>
                    )}

                    {data.oportunidad_ranking && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                        >
                            <h3 className="text-lg font-bold mb-3 text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Oportunidad de Ranking
                            </h3>
                            <p className="text-slate-300">{data.oportunidad_ranking}</p>
                        </motion.div>
                    )}
                </div>

                {/* Estrategia */}
                {data.recomendacion_estrategia && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">
                            Estrategia Recomendada
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            {data.recomendacion_estrategia}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
