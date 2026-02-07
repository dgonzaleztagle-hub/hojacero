'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Users, TrendingUp, ShieldAlert, Wifi, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalTabTerritorialProps {
    selectedLead: any;
    isDark: boolean;
}

/**
 * ModalTabTerritorial - Muestra datos territoriales del lead
 * Nota: El análisis territorial completo está en /dashboard/territorial
 * Este tab muestra un resumen de datos geográficos del lead
 */
export function ModalTabTerritorial({ selectedLead, isDark }: ModalTabTerritorialProps) {
    const address = selectedLead?.address || selectedLead?.source_data?.scraped?.address;
    const comuna = selectedLead?.comuna || 'No detectada';

    // Datos territoriales guardados (si existen)
    const territorialData = selectedLead?.source_data?.territorial;

    const dimensions = [
        { key: 'demografia', icon: Users, label: 'Demografía', color: 'purple', details: 'Población y GSE de la zona' },
        { key: 'flujo', icon: MapPin, label: 'Flujo', color: 'blue', details: 'Tráfico peatonal y vehicular' },
        { key: 'comercial', icon: TrendingUp, label: 'Comercial', color: 'orange', details: 'Competencia en el sector' },
        { key: 'riesgo', icon: ShieldAlert, label: 'Riesgo', color: 'red', details: 'Factores de riesgo territorial' },
        { key: 'digital', icon: Wifi, label: 'Digital', color: 'cyan', details: 'Presencia digital de la zona' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className={cn(
                "p-6 rounded-2xl border",
                isDark ? "bg-zinc-900/60 border-white/10" : "bg-white border-gray-200"
            )}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                            Análisis Territorial
                        </h3>
                        <p className={cn("text-sm mt-1", isDark ? "text-zinc-400" : "text-gray-500")}>
                            {address || 'Sin dirección registrada'}
                        </p>
                        {comuna && (
                            <span className={cn(
                                "inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold",
                                isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"
                            )}>
                                Comuna: {comuna}
                            </span>
                        )}
                    </div>
                    <a
                        href="/dashboard/territorial"
                        target="_blank"
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                            isDark
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "bg-blue-600 text-white hover:bg-blue-500"
                        )}
                    >
                        <ExternalLink className="w-4 h-4" />
                        Análisis Completo
                    </a>
                </div>
            </div>

            {/* Grid de Dimensiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dimensions.map((dim, index) => {
                    const Icon = dim.icon;
                    const data = territorialData?.[dim.key];

                    return (
                        <motion.div
                            key={dim.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-5 rounded-2xl border transition-all hover:border-white/20",
                                isDark ? "bg-zinc-900/40 border-white/10" : "bg-white border-gray-200"
                            )}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    `bg-${dim.color}-500/20`
                                )}>
                                    <Icon className={cn("w-5 h-5", `text-${dim.color}-400`)} />
                                </div>
                                <div>
                                    <h4 className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>
                                        {dim.label}
                                    </h4>
                                </div>
                            </div>
                            <p className={cn("text-xs leading-relaxed", isDark ? "text-zinc-400" : "text-gray-500")}>
                                {data?.details || dim.details}
                            </p>
                            {data?.score && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full", `bg-${dim.color}-500`)}
                                            style={{ width: `${data.score}%` }}
                                        />
                                    </div>
                                    <span className={cn("text-xs font-bold", `text-${dim.color}-400`)}>
                                        {data.score}%
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* CTA para análisis completo */}
            {!territorialData && (
                <div className={cn(
                    "p-6 rounded-2xl border border-dashed text-center",
                    isDark ? "bg-blue-500/10 border-blue-500/30" : "bg-blue-50 border-blue-300"
                )}>
                    <MapPin className={cn("w-8 h-8 mx-auto mb-3", isDark ? "text-blue-400" : "text-blue-600")} />
                    <h4 className={cn("font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                        Análisis Territorial Disponible
                    </h4>
                    <p className={cn("text-sm mb-4", isDark ? "text-zinc-400" : "text-gray-500")}>
                        Genera un reporte completo de viabilidad comercial para esta ubicación
                    </p>
                    <a
                        href="/dashboard/territorial"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all"
                    >
                        Ir al Motor Territorial
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            )}
        </div>
    );
}
