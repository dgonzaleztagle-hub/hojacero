'use client';

import { motion } from 'framer-motion';
import { Activity, TrendingDown, Minus, TrendingUp } from 'lucide-react';

interface StressTestSectionProps {
    data: {
        pesimista?: { cap_rate: number; vacancia: string };
        base?: { cap_rate: number; vacancia: string };
        optimista?: { cap_rate: number; vacancia: string };
    };
}

export function StressTestSection({ data }: StressTestSectionProps) {
    const escenarios = [
        { key: 'pesimista', label: 'Escenario Pesimista', icon: TrendingDown, color: 'from-red-500 to-rose-500', data: data.pesimista },
        { key: 'base', label: 'Escenario Base', icon: Minus, color: 'from-yellow-500 to-orange-500', data: data.base },
        { key: 'optimista', label: 'Escenario Optimista', icon: TrendingUp, color: 'from-green-500 to-emerald-500', data: data.optimista },
    ];

    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-900 to-black overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
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
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-xl opacity-50 animate-pulse" />
                            <Activity className="w-20 h-20 relative text-red-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Análisis de Sensibilidad
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Stress Test: Evaluación de rentabilidad en diferentes escenarios de mercado
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {escenarios.map((escenario, index) => {
                        const Icon = escenario.icon;
                        return escenario.data && (
                            <motion.div
                                key={escenario.key}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative group"
                            >
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${escenario.color} rounded-2xl blur opacity-25 group-hover:opacity-35 transition`} />

                                <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-8 h-full">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${escenario.color} flex items-center justify-center mb-6`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-6">{escenario.label}</h3>

                                    <div className="space-y-6">
                                        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                                            <p className="text-slate-400 text-sm mb-2">Cap Rate</p>
                                            <p className="text-4xl font-bold text-white">
                                                {escenario.data.cap_rate}%
                                            </p>
                                        </div>

                                        <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6">
                                            <p className="text-slate-400 text-sm mb-2">Vacancia</p>
                                            <p className="text-2xl font-bold text-white">
                                                {escenario.data.vacancia}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
