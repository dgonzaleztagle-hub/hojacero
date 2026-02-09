'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface AuditoriaDigitalProfundaSectionProps {
    data: {
        competidor_1?: {
            nombre: string;
            presencia: string;
            debilidad: string;
            oportunidad: string;
        };
        competidor_2?: {
            nombre: string;
            presencia: string;
            debilidad: string;
            oportunidad: string;
        };
        conclusion_digital?: string;
    };
}

export function AuditoriaDigitalProfundaSection({ data }: AuditoriaDigitalProfundaSectionProps) {
    return (
        <section className="relative py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Auditoría Digital Profunda
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Análisis de debilidades digitales de la competencia
                    </p>
                </motion.div>

                {/* Competidores */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {data.competidor_1 && (
                        <CompetitorCard competitor={data.competidor_1} index={1} />
                    )}
                    {data.competidor_2 && (
                        <CompetitorCard competitor={data.competidor_2} index={2} />
                    )}
                </div>

                {/* Conclusión */}
                {data.conclusion_digital && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">
                            Conclusión Digital
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            {data.conclusion_digital}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function CompetitorCard({ competitor, index }: { competitor: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
        >
            <h3 className="text-xl font-bold mb-4 text-white">
                {competitor.nombre}
            </h3>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Presencia Digital</p>
                    <p className="text-slate-300">{competitor.presencia}</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-sm text-red-400 mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Debilidad Detectada
                    </p>
                    <p className="text-slate-300">{competitor.debilidad}</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-sm text-green-400 mb-1">Oportunidad</p>
                    <p className="text-slate-300">{competitor.oportunidad}</p>
                </div>
            </div>
        </motion.div>
    );
}
