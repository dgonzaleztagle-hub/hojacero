"use client";

import { motion } from "framer-motion";
import { Truck, Clock, Shield, ArrowRight } from "lucide-react";

interface AcargooHeroProps {
    onStart: () => void;
}

export default function AcargooHero({ onStart }: AcargooHeroProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a5f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Logo Animado */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        {/* A estilizada */}
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                            <path
                                d="M50 10L80 90H65L60 75H40L35 90H20L50 10Z M45 60H55L50 40L45 60Z"
                                fill="#1e3a5f"
                                className="drop-shadow-lg"
                            />
                            <motion.path
                                d="M85 85 Q 90 80, 95 85"
                                stroke="#ff9900"
                                strokeWidth="3"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            />
                        </svg>
                    </motion.div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f]">
                            carg<span className="text-[#ff9900]">oo+</span>
                        </h1>
                        <p className="text-sm text-slate-600 tracking-wider uppercase mt-1">
                            Logistics Solutions
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Tagline */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-700 text-center max-w-2xl mb-12"
            >
                Agenda tu servicio de logística en{" "}
                <span className="font-semibold text-[#ff9900]">menos de 3 minutos</span>
            </motion.p>

            {/* CTA Principal */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
                <span className="flex items-center gap-3">
                    Agendar Servicio
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff9900] to-[#ff7700] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </motion.button>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full"
            >
                {[
                    {
                        icon: Clock,
                        title: "Disponibilidad 24/7",
                        desc: "Agenda cuando quieras",
                    },
                    {
                        icon: Shield,
                        title: "Servicio Garantizado",
                        desc: "Profesionales certificados",
                    },
                    {
                        icon: Truck,
                        title: "Tracking en Tiempo Real",
                        desc: "Seguimiento de tu carga",
                    },
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:border-[#ff9900] transition-all duration-300 hover:shadow-lg"
                    >
                        <feature.icon className="w-8 h-8 text-[#ff9900] mb-3" />
                        <h3 className="font-semibold text-[#1e3a5f] mb-1">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600">{feature.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
