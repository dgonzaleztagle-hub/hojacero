'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface ProyeccionFinancieraSectionProps {
    data: {
        pedidos_lunes_jueves?: string;
        pedidos_viernes_sabado?: string;
        ticket_promedio?: number;
        venta_mensual?: number;
        nota?: string;
    };
}

export function ProyeccionFinancieraSection({ data }: ProyeccionFinancieraSectionProps) {
    return (
        <section className="relative py-24 px-6 bg-gradient-to-b from-black via-slate-950 to-black">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-400" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Proyección Financiera
                    </h2>
                    <p className="text-slate-400 text-lg">Estimación conservadora de ventas</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-8"
                    >
                        <Calendar className="w-10 h-10 mb-4 text-blue-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Lunes - Jueves</h3>
                        <p className="text-3xl font-bold text-blue-400 mb-2">{data.pedidos_lunes_jueves || 'N/A'}</p>
                        <p className="text-sm text-slate-500">Pedidos diarios estimados</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-8"
                    >
                        <Calendar className="w-10 h-10 mb-4 text-purple-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Viernes - Sábado</h3>
                        <p className="text-3xl font-bold text-purple-400 mb-2">{data.pedidos_viernes_sabado || 'N/A'}</p>
                        <p className="text-sm text-slate-500">Pedidos diarios estimados</p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8"
                    >
                        <TrendingUp className="w-10 h-10 mb-4 text-green-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Ticket Promedio</h3>
                        <p className="text-4xl font-bold text-green-400">
                            ${data.ticket_promedio?.toLocaleString('es-CL') || 'N/A'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">CLP por pedido</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-8"
                    >
                        <DollarSign className="w-10 h-10 mb-4 text-blue-400" />
                        <h3 className="text-lg font-bold mb-2 text-white">Venta Mensual</h3>
                        <p className="text-4xl font-bold text-blue-400">
                            ${data.venta_mensual?.toLocaleString('es-CL') || 'N/A'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">CLP proyectados</p>
                    </motion.div>
                </div>

                {data.nota && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
                    >
                        <p className="text-slate-400 text-sm italic">{data.nota}</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
