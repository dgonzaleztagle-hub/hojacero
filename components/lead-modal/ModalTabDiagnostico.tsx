'use client';

import React from 'react';
import { Target, Zap, CheckCircle2, Loader2 } from 'lucide-react';

interface ModalTabDiagnosticoProps {
    selectedLead: any;
    analysis: any;
    ld: any;
    isDark: boolean;
    isDeepAnalyzing: boolean;
    isReanalyzing: boolean;
    onDeepAnalyze: () => void;
    onReanalyze: () => void;
}

export const ModalTabDiagnostico = ({
    selectedLead,
    analysis,
    ld,
    isDark,
    isDeepAnalyzing,
    isReanalyzing,
    onDeepAnalyze,
    onReanalyze
}: ModalTabDiagnosticoProps) => {
    return (
        <div className="grid grid-cols-1 gap-6">
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
                    {!selectedLead.source_data?.deep_analysis ? (
                        <button
                            onClick={onDeepAnalyze}
                            disabled={isDeepAnalyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-[10px] font-bold uppercase hover:shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                        >
                            {isDeepAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                            {isDeepAnalyzing ? 'Auditando...' : 'Auditoría Profunda'}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Auditado
                        </div>
                    )}
                </div>

                {isDark && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>}

                <div className="space-y-4 relative">
                    {(!analysis.analysisReport && !selectedLead.razon_ia) || selectedLead.razon_ia?.includes('Error AI') || analysis.analysisReport?.includes('Error AI') ? (
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
                            <p className={`text-sm leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>"{analysis.competitiveAnalysis}"</p>
                        </div>
                    )}
                </div>

                {/* Opportunity Factors Grid */}
                {analysis.scoreBreakdown && (
                    <div className="grid grid-cols-5 gap-2 pt-4 border-t border-white/5">
                        {[
                            { key: 'webScore', icon: '🌐', label: 'WEB' },
                            { key: 'reviewsScore', icon: '⭐', label: 'ESTRELLAS' },
                            { key: 'contactScore', icon: '📞', label: 'CONTACTO' },
                            { key: 'techScore', icon: '⚙️', label: 'TECH' },
                            { key: 'socialScore', icon: '📱', label: 'SOCIAL' }
                        ].map(({ key, icon, label }) => {
                            const score = (analysis.scoreBreakdown as any)[key] || 0;
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
                            {analysis.salesStrategy?.painPoints?.length > 0
                                ? analysis.salesStrategy.painPoints.join(', ')
                                : 'Sin pain points detectados'}
                        </p>
                    </div>

                    <div className={`col-span-2 p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Solución Propuesta</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.salesStrategy?.proposedSolution || 'Pendiente análisis'}
                        </p>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canal Recomendado</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.recommendedChannel || 'Email'}
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl border transition-all group ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Valor Estimado</span>
                        <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {analysis.salesStrategy?.estimatedValue || 'Medio'}
                        </p>
                    </div>
                </div>
            </div>

            {/* TECH STACK CARD */}
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
        </div>
    );
};
