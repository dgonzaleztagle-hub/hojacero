"use client";

import { motion } from "framer-motion";
import { Tv, Home, Package, Zap, ArrowLeft } from "lucide-react";

interface Service {
    id: string;
    name: string;
    icon: string;
    description: string;
    estimatedTime: string;
    IconComponent: any;
}

interface ServiceSelectorProps {
    onSelect: (service: { id: string; name: string; icon: string }) => void;
    onBack: () => void;
}

const SERVICES: Service[] = [
    {
        id: "tv-transport",
        name: "Transporte de TV",
        icon: "tv",
        description: "Instalación y traslado seguro de televisores",
        estimatedTime: "2-3 horas",
        IconComponent: Tv,
    },
    {
        id: "small-move",
        name: "Mudanza Pequeña",
        icon: "home",
        description: "Hasta 15m³ de carga",
        estimatedTime: "4-6 horas",
        IconComponent: Home,
    },
    {
        id: "general-cargo",
        name: "Carga General",
        icon: "package",
        description: "Transporte de mercancía estándar",
        estimatedTime: "3-4 horas",
        IconComponent: Package,
    },
    {
        id: "express",
        name: "Servicio Express",
        icon: "zap",
        description: "Entrega prioritaria mismo día",
        estimatedTime: "1-2 horas",
        IconComponent: Zap,
    },
];

export default function ServiceSelector({ onSelect, onBack }: ServiceSelectorProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Header */}
            <div className="w-full max-w-4xl mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#1e3a5f] transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">
                    Selecciona tu servicio
                </h2>
                <p className="text-slate-600">
                    Elige el tipo de logística que necesitas
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {SERVICES.map((service, index) => (
                    <motion.button
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                            onSelect({
                                id: service.id,
                                name: service.name,
                                icon: service.icon,
                            })
                        }
                        className="group relative bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-[#ff9900] transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
                    >
                        {/* Icon */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center group-hover:from-[#ff9900] group-hover:to-[#ff7700] transition-all duration-300">
                                <service.IconComponent className="w-7 h-7 text-white" />
                            </div>
                            {service.id === "express" && (
                                <span className="px-3 py-1 bg-[#ff9900] text-white text-xs font-semibold rounded-full">
                                    Popular
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-[#1e3a5f] mb-2 group-hover:text-[#ff9900] transition-colors">
                            {service.name}
                        </h3>
                        <p className="text-slate-600 text-sm mb-4">
                            {service.description}
                        </p>

                        {/* Estimated Time */}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-[#ff9900]"></div>
                            Tiempo estimado: {service.estimatedTime}
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff9900]/5 to-[#ff7700]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.button>
                ))}
            </div>

            {/* Info Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-slate-500 mt-8 text-center max-w-2xl"
            >
                ¿No encuentras lo que buscas?{" "}
                <a href="#" className="text-[#ff9900] hover:underline font-semibold">
                    Contáctanos directamente
                </a>
            </motion.p>
        </div>
    );
}
