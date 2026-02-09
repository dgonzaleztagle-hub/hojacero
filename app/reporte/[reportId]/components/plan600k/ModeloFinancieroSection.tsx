'use client';

import { motion } from 'framer-motion';
import { DollarSign, Calculator, TrendingUp, PiggyBank } from 'lucide-react';

interface ModeloFinancieroSectionProps {
    data: {
        precio_adquisicion_uf?: number;
        habilitacion_uf?: number;
        inversion_total_uf?: number;
        arriendo_mensual_uf?: number;
        noi_uf?: number;
        cap_rate?: number;
    };
}

export function ModeloFinancieroSection({ data }: ModeloFinancieroSectionProps) {
    const metrics = [
        { label: 'Precio Adquisición', value: data.precio_adquisicion_uf, unit: 'UF', icon: DollarSign, color: 'from-blue-500 to-cyan-500' },
        { label: 'Habilitación', value: data.habilitacion_uf, unit: 'UF', icon: Calculator, color: 'from-purple-500 to-pink-500' },
        { label: 'Inversión Total', value: data.inversion_total_uf, unit: 'UF', icon: PiggyBank, color: 'from-orange-500 to-red-500', highlight: true },
        { label: 'Arriendo Mensual', value: data.arriendo_mensual_uf, unit: 'UF/mes', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
        { label: 'NOI Anual', value: data.noi_uf, unit: 'UF', icon: TrendingUp, color: 'from-teal-500 to-cyan-500' },
        { label: 'Cap Rate', value: data.cap_rate, unit: '%', icon: TrendingUp, color: 'from-yellow-500 to-orange-500', highlight: true },
    ];

    return (
        <section className="relative py-32 px-6 bg-gradient-to-b from-black via-slate-950 to-black overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent" />

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
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-xl opacity-50" />
                            <Calculator className="w-20 h-20 relative text-green-400" />
                        </div>
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Modelo Financiero
                    </h2>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                        Proyección de rentabilidad basada en datos reales de mercado
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return metric.value !== undefined && (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative group ${metric.highlight ? 'lg:col-span-1' : ''}`}
                            >
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${metric.color} rounded-2xl blur ${metric.highlight ? 'opacity-30' : 'opacity-20'} group-hover:opacity-40 transition`} />

                                <div className={`relative bg-slate-900/90 border ${metric.highlight ? 'border-green-500/30' : 'border-slate-800'} rounded-2xl p-8`}>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
                                    <p className={`text-4xl font-bold ${metric.highlight ? 'text-green-400' : 'text-white'} mb-1`}>
                                        {typeof metric.value === 'number' ? metric.value.toLocaleString('es-CL', { maximumFractionDigits: 2 }) : metric.value}
                                    </p>
                                    <p className="text-slate-500 text-sm">{metric.unit}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
