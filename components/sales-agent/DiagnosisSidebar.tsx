'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Zap, Search, AlertTriangle, ExternalLink, ArrowRight, Target } from 'lucide-react';

interface DiagnosisSidebarProps {
    results: any;
    isAnalyzing: boolean;
    currentStep: string;
}

export function DiagnosisSidebar({ results, isAnalyzing, currentStep }: DiagnosisSidebarProps) {
    return (
        <div className="flex flex-col h-full bg-zinc-900/10 p-6 space-y-8">
            <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600">Estado del Sistema</h3>
                <div className="flex items-center gap-3">
                    <Activity className={`w-4 h-4 ${isAnalyzing ? 'text-cyan-500 animate-pulse' : 'text-zinc-700'}`} />
                    <span className="text-xs font-bold text-zinc-400 capitalize">
                        {isAnalyzing ? `Ejecutando: ${currentStep}` : results ? 'Análisis Finalizado' : 'En Espera'}
                    </span>
                </div>
            </div>

            {/* Score Radial or Big Text */}
            <div className="relative group">
                <div className="aspect-square border border-white/5 bg-zinc-900/50 rounded-3xl flex flex-col items-center justify-center overflow-hidden shadow-2xl relative">
                    {isAnalyzing && (
                        <motion.div
                            className="absolute inset-0 bg-cyan-500/5"
                            animate={{ opacity: [0, 0.1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                    <span className="text-[10px] uppercase font-bold text-zinc-500 mb-2">Health Score</span>
                    <div className="text-7xl font-black text-white tracking-tighter">
                        {isAnalyzing ? '...' : results ? `${results.score}%` : '00'}
                    </div>
                </div>
            </div>

            {/* Detail Metrics */}
            <div className="space-y-6">
                <MetricBar
                    label="Performance & Abandono"
                    value={isAnalyzing && currentStep === 'ttfb' ? undefined : (results ? 45 : 0)}
                    icon={<Zap className="w-3 h-3" />}
                    color={results && parseInt(results.ttfb.value) > 1500 ? 'red' : 'cyan'}
                    status={results ? `${results.ttfb.value} (${results.ttfb.abandonmentRate} fuga)` : undefined}
                />
                <MetricBar
                    label="Seguridad & Servidor"
                    value={isAnalyzing && currentStep === 'security' ? undefined : (results ? 80 : 0)}
                    icon={<Shield className="w-3 h-3" />}
                    color={results?.security?.ssl === 'Válido' ? 'emerald' : 'red'}
                    status={results?.security?.ssl === 'Válido' ? 'SSL OK' : 'Riesgo SSL'}
                    subStatus={results?.security?.serverHeader}
                />
                <MetricBar
                    label="Tech Stack"
                    value={results ? (results.tech.isSlow ? 30 : 90) : 0}
                    icon={<Search className="w-3 h-3" />}
                    color={results?.tech.isSlow ? 'red' : 'blue'}
                    status={results?.tech.builder}
                />
                <MetricBar
                    label="Visibilidad (SEO)"
                    value={isAnalyzing && currentStep === 'seo' ? undefined : (results ? results.score : 0)}
                    icon={<Target className="w-3 h-3" />}
                    color={results && results.score < 50 ? 'red' : 'green'}
                    status={results ? `${results.score}%` : undefined}
                />
            </div>

            {/* Insight Card */}
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${(results.score < 50 || parseInt(results.ttfb.value) > 1500) ? 'bg-red-500/10 border-red-500/40' : 'bg-orange-500/5 border-orange-500/20'} border rounded-2xl p-4 space-y-3 relative overflow-hidden`}
                    >
                        {(results.score < 50 || parseInt(results.ttfb.value) > 1500) && (
                            <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg animate-pulse uppercase">
                                Alerta Crítica
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-wider">Impacto en Conversión</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            {parseInt(results.ttfb.value) > 1500
                                ? `Tu servidor está en zona roja. Cada segundo de carga adicional en ${results.competitor.location} reduce tu tasa de conversión en un 7%.`
                                : `Tu score de ${results.score}% indica que eres invisible para el 60% de tus prospectos locales.`}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {results && (
                <button className="w-full group py-4 px-6 bg-white text-black rounded-2xl flex items-center justify-between font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all">
                    Solucionar Ahora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
}

function MetricBar({ label, value, icon, color, status, subStatus }: { label: string, value?: number, icon: any, color: string, status?: string, subStatus?: string }) {
    const isScanning = value === undefined;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2 text-zinc-500">
                    {icon}
                    {label}
                </div>
                <div className="flex flex-col items-end">
                    <span className={status ? 'text-zinc-300' : 'text-zinc-600'}>
                        {status || (isScanning ? 'Escaneando...' : 'N/A')}
                    </span>
                    {subStatus && <span className="text-[8px] text-zinc-500 font-mono">{subStatus}</span>}
                </div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isScanning ? '40%' : `${value}%` }}
                    className={`h-full bg-${color}-500 ${isScanning ? 'animate-pulse' : ''}`}
                />
            </div>
        </div>
    );
}
