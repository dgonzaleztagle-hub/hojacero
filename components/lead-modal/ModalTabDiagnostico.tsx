'use client';

import React from 'react';
import { Target, Zap, CheckCircle2, Loader2 } from 'lucide-react';

interface ModalTabDiagnosticoProps {
    selectedLead: {
        source_data?: {
            lead_type?: string;
            concept?: string;
            references?: string;
            deep_analysis?: Record<string, unknown>;
            kimi_forensics?: {
                secuestro?: { esSecuestrable?: boolean };
                copyright?: { añoDetectado?: string | number };
                saludSocial?: unknown[];
            };
            [key: string]: unknown;
        };
        branding?: {
            logo_url?: string;
            palette?: Record<string, string>;
            palette_approved?: boolean;
            generate_logo?: boolean;
        };
        website?: string;
        razon_ia?: string;
        [key: string]: unknown;
    };
    analysis: {
        vibe?: string;
        analysisReport?: string;
        reason?: string;
        competitiveAnalysis?: string;
        scoreBreakdown?: Record<string, number>;
        salesStrategy?: {
            painPoints?: string[];
            proposedSolution?: string;
            estimatedValue?: string;
        };
        recommendedChannel?: string;
        [key: string]: unknown;
    };
    ld: { hasSSL?: boolean; techStack?: string[] };
    isDark: boolean;
    isDeepAnalyzing: boolean;
    isReanalyzing: boolean;
    onDeepAnalyze: () => void;
    onReanalyze: () => void;
    // New Props for ContactStrategyPanel
    copyToClipboard: (text: string, field: string) => void;
    isEditingContact: boolean;
    setIsEditingContact: (v: boolean) => void;
    editData: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string };
    setEditData: (d: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string }) => void;
    isSaving: boolean;
    setIsSaving: (v: boolean) => void; // Added based on usage
    onUpdateContact: () => void;
    copiedField: string | null;
    newNote: string;
    setNewNote: (s: string) => void;
    saveNote: () => void;
    notes: Array<Record<string, unknown>>;
    deleteNote: (id: string) => void;
    isSavingNote: boolean;
    leadActivities: Array<Record<string, unknown>>;
}

export const ModalTabDiagnostico = ({
    selectedLead,
    analysis,
    ld,
    isDark,
    isDeepAnalyzing,
    isReanalyzing,
    onDeepAnalyze,
    onReanalyze,
}: ModalTabDiagnosticoProps) => {
    const painPoints = analysis.salesStrategy?.painPoints ?? [];

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* CONSTRUCTION HEADER (If applicable) */}
            {selectedLead.source_data?.lead_type === 'construction' && (
                <div className={`rounded-3xl p-8 border overflow-hidden relative transition-all ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Zap className="w-32 h-32 text-amber-500" />
                    </div>

                    <div className="relative space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/20">
                                🏗️ Proyecto en Construcción
                            </span>
                            <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Lead Caliente</span>
                        </div>

                        <div className="space-y-2">
                            <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                {selectedLead.source_data?.concept || 'Visión por definir'}
                            </h2>
                            <p className="text-sm text-zinc-500 font-medium">Concepto del Proyecto</p>
                        </div>

                        {selectedLead.source_data?.references && (
                            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-gray-200'}`}>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Referentes / Competencia</span>
                                <p className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                    {selectedLead.source_data.references}
                                </p>
                            </div>
                        )}

                        {/* BRANDING SECTION */}
                        {selectedLead.branding && (selectedLead.branding.logo_url || selectedLead.branding.palette) && (
                            <div className={`p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-gray-200'}`}>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">🎨 Identidad Visual</span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Logo */}
                                    {selectedLead.branding.logo_url && (
                                        <div className="space-y-2">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Logo</span>
                                            <div className={`p-4 rounded-xl border flex items-center justify-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={selectedLead.branding.logo_url}
                                                    alt="Logo"
                                                    className="max-h-20 max-w-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Color Palette */}
                                    {selectedLead.branding.palette && (
                                        <div className="space-y-2">
                                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Paleta de Colores</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(selectedLead.branding.palette).map(([key, color]) => (
                                                    <div key={key} className="space-y-1">
                                                        <div
                                                            className="h-12 rounded-lg border border-white/10 shadow-inner"
                                                            style={{ backgroundColor: String(color) }}
                                                        />
                                                        <div className="flex items-center justify-between px-1">
                                                            <span className="text-[8px] font-bold text-zinc-500 uppercase">{key}</span>
                                                            <span className="text-[8px] font-mono text-zinc-400">{String(color)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {!selectedLead.branding.palette_approved && (
                                                <p className="text-[9px] text-amber-500 italic mt-2">
                                                    ⚠️ Paleta pendiente de aprobación
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedLead.branding.generate_logo && !selectedLead.branding.logo_url && (
                                    <div className={`p-3 rounded-lg border ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                                        <p className="text-[9px] text-amber-600 font-medium">
                                            💡 Generación de logo solicitada - Pendiente de diseño
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FORENSIC SNAPSHOT (sin pérdida mensual estimada) */}
            {selectedLead.source_data?.lead_type !== 'construction' && selectedLead.source_data?.kimi_forensics && (
                <div className={`rounded-3xl p-6 border transition-all ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 mb-3 block">Snapshot Forense</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="text-[9px] font-bold uppercase text-zinc-500">Secuestro Técnico</div>
                            <div className="text-xs font-black mt-1 text-red-400">
                                {selectedLead.source_data.kimi_forensics.secuestro?.esSecuestrable ? 'Detectado' : 'No detectado'}
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="text-[9px] font-bold uppercase text-zinc-500">Copyright</div>
                            <div className="text-xs font-black mt-1 text-amber-400">
                                {selectedLead.source_data.kimi_forensics.copyright?.añoDetectado || 'Sin señal'}
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="text-[9px] font-bold uppercase text-zinc-500">Redes activas</div>
                            <div className="text-xs font-black mt-1 text-blue-400">
                                {selectedLead.source_data.kimi_forensics.saludSocial?.length || 0}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI ANALYSIS CARD */}
            <div className={`backdrop-blur-xl rounded-3xl p-6 border space-y-6 shadow-2xl relative overflow-hidden transition-colors ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                            <Target className="w-4 h-4" /> Diagnóstico del Lead
                        </h3>
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${isDark ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                            Vibe: {analysis.vibe || 'N/A'}
                        </span>

                        {/* RE-SCAN BUTTON (Always available) */}
                        <button
                            onClick={onReanalyze}
                            disabled={isReanalyzing}
                            className={`p-1.5 rounded-lg border transition-all ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-cyan-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
                            title="Forzar re-escaneo del sitio web"
                        >
                            {isReanalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    {/* Deep Analysis Button - triggers switch to Auditoría tab */}
                    {!selectedLead.source_data?.deep_analysis && selectedLead.website ? (
                        <button
                            onClick={onDeepAnalyze}
                            disabled={isDeepAnalyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-[10px] font-bold uppercase hover:shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                        >
                            {isDeepAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                            {isDeepAnalyzing ? 'Auditando...' : 'Auditoría Profunda'}
                        </button>
                    ) : selectedLead.source_data?.deep_analysis ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Auditado
                        </div>
                    ) : null}
                </div>

                {isDark && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>}

                <div className="space-y-4 relative">
                    {selectedLead.source_data?.lead_type === 'construction' ? (
                        <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            Este proyecto se encuentra en fase de definición estratégica. No hay un sitio web previo para auditar, por lo que nos enfocaremos en la construcción del activo digital desde cero.
                        </p>
                    ) : (!analysis.analysisReport && !selectedLead.razon_ia) || selectedLead.razon_ia?.includes('Error AI') || analysis.analysisReport?.includes('Error AI') ? (
                        <div className="flex flex-col gap-3 py-4 text-center items-center">
                            <p className="text-sm text-zinc-400 leading-relaxed font-light">
                                {(selectedLead.razon_ia?.includes('Error AI') || analysis.analysisReport?.includes('Error AI'))
                                    ? `⚠️ ${selectedLead.razon_ia || analysis.analysisReport}`
                                    : 'Aún no se ha generado el diagnóstico inicial para este lead.'}
                            </p>
                            <button
                                onClick={onReanalyze}
                                disabled={isReanalyzing}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/10"
                            >
                                {isReanalyzing ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Escaneando...</>
                                ) : (
                                    <><Zap className="w-4 h-4" /> {analysis.analysisReport ? 'Re-intentar AI' : 'Generar Diagnóstico Inicial'}</>
                                )}
                            </button>
                        </div>
                    ) : (
                        <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {analysis.analysisReport || analysis.reason || selectedLead.razon_ia || 'Sin análisis disponible'}
                        </p>
                    )}

                    {analysis.competitiveAnalysis && (
                        <div className={`rounded-2xl p-5 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-gray-200'}`}>
                            <span className={`text-[10px] font-bold uppercase block mb-2 tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Contexto Competitivo</span>
                            <p className={`text-sm leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>&quot;{analysis.competitiveAnalysis}&quot;</p>
                        </div>
                    )}
                </div>

                {/* Opportunity Factors Grid - Hide for construction */}
                {selectedLead.source_data?.lead_type !== 'construction' && analysis.scoreBreakdown && (
                    <div className="grid grid-cols-5 gap-2 pt-4 border-t border-white/5">
                        {[
                            { key: 'webScore', icon: '🌐', label: 'WEB' },
                            { key: 'reviewsScore', icon: '⭐', label: 'ESTRELLAS' },
                            { key: 'contactScore', icon: '📞', label: 'CONTACTO' },
                            { key: 'techScore', icon: '⚙️', label: 'TECH' },
                            { key: 'socialScore', icon: '📱', label: 'SOCIAL' }
                        ].map(({ key, icon, label }) => {
                            const score = analysis.scoreBreakdown?.[key] || 0;
                            const isGood = score === 0;
                            return (
                                <div key={key} className={`text-center p-2.5 rounded-2xl border transition-all ${isGood ? 'bg-green-500/10 border-green-500/20 opacity-60' : 'bg-red-500/10 border-red-500/20'}`}>
                                    <div className="text-lg mb-1">{icon}</div>
                                    <div className={`text-[10px] font-black ${isGood ? 'text-green-600' : 'text-red-500'}`}>
                                        {isGood ? '✓' : `+${score}`}
                                    </div>
                                    <div className={`text-[7px] font-bold uppercase mt-1 tracking-tighter ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{label}</div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pain Points & Solution */}
                <div className={`grid grid-cols-2 gap-3 mt-6 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <div className={`col-span-2 p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Pain Points</span>
                        <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                            {painPoints.length > 0
                                ? painPoints.join(', ')
                                : (selectedLead.source_data?.lead_type === 'construction' ? 'Falta de presencia digital, pérdida de autoridad.' : 'Sin pain points detectados')}
                        </p>
                    </div>

                    <div className={`col-span-2 p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Solución Propuesta</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.salesStrategy?.proposedSolution || (selectedLead.source_data?.lead_type === 'construction' ? 'Construcción de activo maestro HojaCero.' : 'Pendiente análisis')}
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canal Recomendado</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.recommendedChannel || 'Directo'}
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Valor Estimado</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.salesStrategy?.estimatedValue || 'Alto'}
                        </p>
                    </div>
                </div>
            </div>

            {/* TECH STACK CARD - Hide for construction */}
            {selectedLead.source_data?.lead_type !== 'construction' && (
                <div className={`rounded-3xl p-5 border transition-colors ${isDark ? 'bg-zinc-900/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            <Zap className="w-3 h-3 text-yellow-500" /> Infraestructura Técnica
                        </h4>
                        <div className={`px-2 py-0.5 rounded-full border text-[8px] font-bold flex items-center gap-1 ${ld.hasSSL ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                            {ld.hasSSL ? 'SSL OK' : 'No Seguro'}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(ld.techStack || []).length > 0 ? (
                            (ld.techStack || []).map((tech: string, i: number) => (
                                <span key={i} className={`px-2.5 py-1 border rounded-lg text-[10px] ${isDark ? 'bg-white/5 border-white/5 text-zinc-400' : 'bg-white border-gray-200 text-gray-600'}`}>
                                    {tech}
                                </span>
                            ))
                        ) : (
                            <span className={`text-[10px] italic ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Sin tecnologías detectadas</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
