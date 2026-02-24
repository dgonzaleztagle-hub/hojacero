"use client";

import { useEffect, useMemo, useState } from "react";
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
    onSelect: (service: { id: string; name: string; icon: string; description: string }) => void;
    onBack: () => void;
}

type ApiService = {
    id: string;
    name: string;
    icon: string;
    description: string;
};

const iconMap: Record<string, any> = {
    tv: Tv,
    home: Home,
    package: Package,
    zap: Zap,
    truck: Package,
};

function estimateTime(name: string) {
    const value = name.toLowerCase();
    if (value.includes("express")) return "1-2 horas";
    if (value.includes("mudanza")) return "4-6 horas";
    if (value.includes("tv")) return "2-3 horas";
    return "3-4 horas";
}

export default function ServiceSelector({ onSelect, onBack }: ServiceSelectorProps) {
    const [services, setServices] = useState<ApiService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadServices = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("/api/acargoo/services", {
                    cache: "no-store",
                    signal: controller.signal,
                });
                const payload = await response.json();

                if (!response.ok || !payload?.ok) {
                    throw new Error(payload?.error || "No fue posible cargar los servicios.");
                }

                setServices(payload.services || []);
            } catch (fetchError: any) {
                if (fetchError?.name === "AbortError") return;
                setError(fetchError?.message || "No fue posible cargar los servicios.");
            } finally {
                setLoading(false);
            }
        };

        loadServices();
        return () => controller.abort();
    }, []);

    const normalizedServices: Service[] = useMemo(
        () =>
            services.map((service) => {
                const iconKey = (service.icon || "").toLowerCase();
                return {
                    ...service,
                    estimatedTime: estimateTime(service.name),
                    IconComponent: iconMap[iconKey] || Package,
                };
            }),
        [services]
    );

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

            {loading && (
                <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-lg">
                    Cargando servicios...
                </div>
            )}

            {!loading && error && (
                <div className="w-full max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <p className="font-semibold text-red-700 mb-2">No pudimos cargar los servicios.</p>
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && normalizedServices.length === 0 && (
                <div className="w-full max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <p className="font-semibold text-amber-800 mb-2">No hay servicios configurados.</p>
                    <p className="text-sm text-amber-700">
                        Agrega al menos un servicio activo en `acargoo_services` para poder agendar.
                    </p>
                </div>
            )}

            {/* Services Grid */}
            {!loading && !error && normalizedServices.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                    {normalizedServices.map((service, index) => (
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
                                description: service.description,
                            })
                        }
                        className="group relative bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-[#ff9900] transition-all duration-300 text-left shadow-lg hover:shadow-2xl"
                    >
                        {/* Icon */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center group-hover:from-[#ff9900] group-hover:to-[#ff7700] transition-all duration-300">
                                <service.IconComponent className="w-7 h-7 text-white" />
                            </div>
                            {service.name.toLowerCase().includes("express") && (
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
            )}

            {/* Info Footer */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-slate-500 mt-8 text-center max-w-2xl"
            >
                Nuestro equipo puede ayudarte si necesitas una logística fuera de catálogo.
            </motion.p>
        </div>
    );
}
