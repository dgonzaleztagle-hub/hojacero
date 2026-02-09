'use client';

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';

interface MatrizRiesgoSectionProps {
    data: {
        regulatorio?: { nivel: string; descripcion: string };
        economico?: { nivel: string; descripcion: string };
        competencia?: { nivel: string; descripcion: string };
    };
}

export function MatrizRiesgoSection({ data }: MatrizRiesgoSectionProps) {
    const riesgos = [
        { key: 'regulatorio', label: 'Regulatorio', icon: Shield, data: data.regulatorio },
        { key: 'economico', label: 'Económico', icon: TrendingDown, data: data.economico },
        { key: 'competencia', label: 'Competencia', icon: AlertTriangle, data: data.competencia },
    ];

    const getNivelColor = (nivel: string) => {
        if (nivel?.includes('BAJO')) return 'from-green-500 to-emerald-500';
        if (nivel?.includes('MEDIO')) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    return (
        <section className="relative py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        Matriz de Riesgo
                    </h2>
                    <p className="text-slate-400 text-lg">Análisis de factores críticos</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {riesgos.map((riesgo, index) => {
                        const Icon = riesgo.icon;
                        return (
                            <motion.div
                                key={riesgo.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                            >
                                <Icon className="w-10 h-10 mb-4 text-blue-400" />
                                <h3 className="text-xl font-bold mb-3 text-white">{riesgo.label}</h3>
                                {riesgo.data && (
                                    <>
                                        <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${getNivelColor(riesgo.data.nivel)} mb-4`}>
                                            <span className="text-white font-bold">{riesgo.data.nivel}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{riesgo.data.descripcion}</p>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
