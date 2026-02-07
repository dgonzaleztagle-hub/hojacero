'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Zap, FileText, TrendingUp, Users, Building2,
    Shield, Wifi, Download, Loader2, CheckCircle2, AlertCircle,
    ChevronRight, Sparkles, Target, BarChart3
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

const PLANS = [
    {
        id: 1,
        name: 'Validación Rápida',
        price: '$150.000',
        description: 'Viabilidad en 5-6 páginas',
        icon: Target,
        color: 'from-blue-600 to-cyan-600',
        features: [
            'Análisis de viabilidad',
            'Score de inversión',
            'Recomendación ejecutiva',
            'PDF profesional'
        ]
    },
    {
        id: 2,
        name: 'Estrategia Comercial',
        price: '$350.000',
        description: 'Análisis completo 10-12 páginas',
        icon: BarChart3,
        color: 'from-purple-600 to-pink-600',
        features: [
            'Todo lo de Plan 1',
            'Análisis FODA territorial',
            'Estrategia de lanzamiento',
            'Mapas de competencia',
            'Recomendaciones de marketing'
        ],
        popular: true
    },
    {
        id: 3,
        name: 'Inversión & Desarrollo',
        price: '$600.000',
        description: 'Dossier completo para bancos/socios',
        icon: TrendingUp,
        color: 'from-orange-600 to-red-600',
        features: [
            'Todo lo de Plan 2',
            'Proyección de plusvalía',
            'Análisis normativo detallado',
            'Comparativa con 3 zonas',
            'Dossier para inversores'
        ]
    }
];

interface Report {
    id: string;
    address: string;
    plan_type: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
    created_at: string;
    analysis?: any;
    dimensiones?: any;
    map_image_url?: string;
}

export default function TerritorialPage() {
    const [selectedPlan, setSelectedPlan] = useState(2);
    const [address, setAddress] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentReport, setCurrentReport] = useState<Report | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleAnalyze = async () => {
        if (!address.trim()) {
            setError('Ingresa una dirección válida');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setCurrentReport(null);

        try {
            // Llamar a Edge Function
            const { data, error: functionError } = await supabase.functions.invoke('territorial-analyzer', {
                body: {
                    address: address.trim(),
                    plan_type: selectedPlan,
                    business_type: 'restaurant' // Podría ser dinámico
                }
            });

            if (functionError) throw functionError;

            if (data.success) {
                setCurrentReport({
                    id: data.report_id,
                    address: data.address,
                    plan_type: selectedPlan,
                    status: 'COMPLETED',
                    created_at: new Date().toISOString(),
                    analysis: data.analysis,
                    dimensiones: data.dimensiones,
                    map_image_url: data.map_image_url
                });
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (err: any) {
            console.error('Error en análisis:', err);
            setError(err.message || 'Error al analizar la ubicación');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-full">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                            Inteligencia Territorial
                        </span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tight">
                        Motor de Análisis Territorial
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        Scraping de 5 dimensiones + IA para generar reportes profesionales de ubicaciones comerciales
                    </p>
                </motion.div>

                {/* Selector de Planes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <motion.button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "relative p-6 rounded-3xl border-2 transition-all text-left overflow-hidden group",
                                    isSelected
                                        ? "border-white/30 bg-white/5"
                                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                                        <span className="text-[10px] font-black uppercase text-white">Popular</span>
                                    </div>
                                )}

                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br",
                                    plan.color
                                )}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                                <p className="text-3xl font-black text-white mb-2">{plan.price}</p>
                                <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>

                                <ul className="space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {isSelected && (
                                    <motion.div
                                        layoutId="selected-plan"
                                        className="absolute inset-0 border-2 border-white rounded-3xl pointer-events-none"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Input de Dirección */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-black text-white">Dirección a Analizar</h2>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            placeholder="Ej: Av. Providencia 1234, Santiago"
                            className="flex-1 px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                            disabled={isAnalyzing}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !address.trim()}
                            className={cn(
                                "px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all flex items-center gap-3",
                                isAnalyzing || !address.trim()
                                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
                            )}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Analizar
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-sm text-red-300">{error}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Resultados */}
                <AnimatePresence mode="wait">
                    {currentReport && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Resumen Ejecutivo */}
                            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                                    <h2 className="text-2xl font-black text-white">Análisis Completado</h2>
                                </div>
                                <p className="text-zinc-300 leading-relaxed">
                                    {currentReport.analysis?.resumen_ejecutivo || 'Análisis territorial completado exitosamente.'}
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="px-4 py-2 bg-white/10 rounded-xl">
                                        <span className="text-xs text-zinc-400">Score</span>
                                        <p className="text-2xl font-black text-white">{currentReport.analysis?.score_ubicacion || 0}/100</p>
                                    </div>
                                    <div className="px-4 py-2 bg-white/10 rounded-xl">
                                        <span className="text-xs text-zinc-400">Veredicto</span>
                                        <p className="text-lg font-black text-green-400">{currentReport.analysis?.veredicto || 'VIABLE'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mapa de Ubicación */}
                            {currentReport.map_image_url && (
                                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <MapPin className="w-8 h-8 text-blue-400" />
                                        <h2 className="text-2xl font-black text-white">Ubicación</h2>
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-white/10">
                                        <img
                                            src={currentReport.map_image_url}
                                            alt={`Mapa de ${currentReport.address}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-2">
                                        📍 {currentReport.address}
                                    </p>
                                </div>
                            )}

                            {/* Dimensiones */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { key: 'demografia', icon: Users, label: 'Demografía', color: 'blue' },
                                    { key: 'flujo', icon: MapPin, label: 'Flujo', color: 'purple' },
                                    { key: 'comercial', icon: Building2, label: 'Comercial', color: 'orange' },
                                    { key: 'riesgo', icon: Shield, label: 'Riesgo', color: 'red' },
                                    { key: 'digital', icon: Wifi, label: 'Digital', color: 'cyan' }
                                ].map((dim) => {
                                    const Icon = dim.icon;
                                    const data = currentReport.dimensiones?.[dim.key];

                                    return (
                                        <div key={dim.key} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                                    `bg-${dim.color}-600/20`
                                                )}>
                                                    <Icon className={cn("w-5 h-5", `text-${dim.color}-400`)} />
                                                </div>
                                                <h3 className="font-black text-white">{dim.label}</h3>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                {JSON.stringify(data).substring(0, 100)}...
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Botón de Descarga */}
                            <button className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-black uppercase tracking-wider text-white flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-98">
                                <Download className="w-6 h-6" />
                                Descargar Reporte PDF
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}
