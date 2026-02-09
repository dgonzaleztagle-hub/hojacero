'use client';

import { motion } from 'framer-motion';
import { Rocket, Target, Users } from 'lucide-react';

interface EstrategiaLanzamientoSectionProps {
    data: {
        fase_1_hype?: { nombre: string; acciones: string[] };
        fase_2_marcha_blanca?: { nombre: string; acciones: string[] };
        fase_3_retencion?: { nombre: string; acciones: string[] };
    };
}

export function EstrategiaLanzamientoSection({ data }: EstrategiaLanzamientoSectionProps) {
    const fases = [
        { key: 'fase_1_hype', icon: Rocket, color: 'from-purple-500 to-pink-500', data: data.fase_1_hype },
        { key: 'fase_2_marcha_blanca', icon: Target, color: 'from-blue-500 to-cyan-500', data: data.fase_2_marcha_blanca },
        { key: 'fase_3_retencion', icon: Users, color: 'from-green-500 to-emerald-500', data: data.fase_3_retencion },
    ];

    return (
        <section className="relative py-24 px-6 bg-gradient-to-b from-black via-slate-900 to-black">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Estrategia de Lanzamiento
                    </h2>
                    <p className="text-slate-400 text-lg">Plan de ejecución en 3 fases</p>
                </motion.div>

                <div className="space-y-8">
                    {fases.map((fase, index) => {
                        const Icon = fase.icon;
                        return fase.data && (
                            <motion.div
                                key={fase.key}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl p-8"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${fase.color} flex items-center justify-center`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{fase.data.nombre}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {fase.data.acciones?.map((accion, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                            <span className="text-slate-300">{accion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
