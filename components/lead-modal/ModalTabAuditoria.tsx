'use client';

import React from 'react';
import { TrendingUp, Users, Link2, ShieldAlert, AlertTriangle, Zap, Loader2, Server, Globe, Clock, Lock } from 'lucide-react';

interface ModalTabAuditoriaProps {
    selectedLead: any;
    isDark: boolean;
    isDeepAnalyzing: boolean;
    onDeepAnalyze: () => void;
    ld: any;
}

export const ModalTabAuditoria = ({
    selectedLead,
    isDark,
    isDeepAnalyzing,
    onDeepAnalyze,
    ld
}: ModalTabAuditoriaProps) => {
    const deepAnalysis = selectedLead.source_data?.deep_analysis;
    const scraped = selectedLead.source_data?.scraped;

    // Use scraped.hasSSL as the source of truth for SSL (more accurate)
    const hasSSL = scraped?.hasSSL ?? deepAnalysis?.techSpecs?.security?.https ?? false;

    if (!deepAnalysis) {
        return (
            <div className={`rounded-3xl p-8 border text-center ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                    Auditoría Pendiente
                </h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Aún no se ha realizado un análisis profundo de este lead. La auditoría incluye SEO, keywords, competidores y más.
                </p>
                <button
                    onClick={onDeepAnalyze}
                    disabled={isDeepAnalyzing}
                    className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-sm font-bold uppercase hover:shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
                >
                    {isDeepAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isDeepAnalyzing ? 'Auditando...' : 'Iniciar Auditoría Profunda'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Reporte de Inteligencia (SEO & Competencia)
                </h4>
                <button
                    onClick={onDeepAnalyze}
                    disabled={isDeepAnalyzing}
                    className={`p-1.5 rounded-lg border transition-all ${isDark ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-100 hover:bg-purple-100 text-purple-500'}`}
                    title="Forzar re-auditoría profunda"
                >
                    {isDeepAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* TECHNICAL HEALTH (Web-Check Style) */}
            {deepAnalysis.techSpecs && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-3">
                    {/* Security / SSL */}
                    <div className={`p-5 rounded-2xl border ${hasSSL ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className={`w-4 h-4 ${hasSSL ? 'text-green-400' : 'text-red-400'}`} />
                            <span className={`text-xs font-bold uppercase ${hasSSL ? 'text-green-400' : 'text-red-400'}`}>Seguridad</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {hasSSL ? 'SSL Activo' : 'Sin HTTPS'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {deepAnalysis.techSpecs?.security?.hsts ? '+HSTS' : 'Sin HSTS'}
                        </div>
                    </div>

                    {/* Email / DNS */}
                    <div className={`p-5 rounded-2xl border ${deepAnalysis.techSpecs.infrastructure.mxRecords ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Server className={`w-4 h-4 ${deepAnalysis.techSpecs.infrastructure.mxRecords ? 'text-indigo-400' : 'text-yellow-400'}`} />
                            <span className={`text-xs font-bold uppercase ${deepAnalysis.techSpecs.infrastructure.mxRecords ? 'text-indigo-400' : 'text-yellow-400'}`}>Email</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {deepAnalysis.techSpecs.infrastructure.mxRecords ? 'MX Configurado' : 'Sin Email Prof.'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {deepAnalysis.techSpecs.dns.hasSpf ? 'SPF OK' : 'Posible Spam'}
                        </div>
                    </div>

                    {/* Performance */}
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold uppercase text-blue-400">Velocidad</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {deepAnalysis.techSpecs.performance.ttfb ? `${deepAnalysis.techSpecs.performance.ttfb}ms TTFB` : 'N/A'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            Respuesta Server
                        </div>
                    </div>

                    {/* Hosting / Infra */}
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold uppercase text-purple-400">Infra</span>
                        </div>
                        <div className={`text-sm font-medium truncate ${isDark ? 'text-zinc-200' : 'text-gray-800'}`} title={deepAnalysis.techSpecs.infrastructure.host || 'Desconocido'}>
                            {deepAnalysis.techSpecs.infrastructure.host || 'Desconocido'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {deepAnalysis.techSpecs.infrastructure.cloudflare ? 'Usando Cloudflare' : 'Direct IP'}
                        </div>
                    </div>
                </div>
            )}

            {/* PAGE SPEED & CORE WEB VITALS */}
            {deepAnalysis.techSpecs?.pageSpeed && (deepAnalysis.techSpecs.pageSpeed.mobileScore !== null) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-3">
                    {/* Scores Section */}
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-bold uppercase text-zinc-400">Google PageSpeed</span>
                        </div>
                        <div className="flex items-center gap-8 justify-center">
                            {/* Mobile Score */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${deepAnalysis.techSpecs.pageSpeed.mobileScore >= 90 ? 'border-green-500 text-green-400' :
                                        deepAnalysis.techSpecs.pageSpeed.mobileScore >= 50 ? 'border-yellow-500 text-yellow-400' :
                                            'border-red-500 text-red-400'
                                    }`}>
                                    <span className="text-xl font-bold">{deepAnalysis.techSpecs.pageSpeed.mobileScore}</span>
                                </div>
                                <span className="text-xs uppercase font-bold text-zinc-500">Móvil</span>
                            </div>
                            {/* Desktop Score */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${deepAnalysis.techSpecs.pageSpeed.desktopScore >= 90 ? 'border-green-500 text-green-400' :
                                        deepAnalysis.techSpecs.pageSpeed.desktopScore >= 50 ? 'border-yellow-500 text-yellow-400' :
                                            'border-red-500 text-red-400'
                                    }`}>
                                    <span className="text-xl font-bold">{deepAnalysis.techSpecs.pageSpeed.desktopScore}</span>
                                </div>
                                <span className="text-xs uppercase font-bold text-zinc-500">Escritorio</span>
                            </div>
                        </div>
                    </div>

                    {/* Vitals Section */}
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold uppercase text-zinc-400">Core Web Vitals</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                <div className="text-xs text-zinc-500 mb-1">LCP (Carga)</div>
                                <div className="text-lg font-mono font-medium text-zinc-200">
                                    {deepAnalysis.techSpecs.pageSpeed.coreWebVitals?.lcp || 'N/A'}
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                <div className="text-xs text-zinc-500 mb-1">CLS (Estabilidad)</div>
                                <div className="text-lg font-mono font-medium text-zinc-200">
                                    {deepAnalysis.techSpecs.pageSpeed.coreWebVitals?.cls || 'N/A'}
                                </div>
                            </div>
                            <div className="col-span-2 bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                <div className="text-xs text-zinc-500">Mobile Friendly</div>
                                <div className={`text-xs font-bold px-2 py-1 rounded ${deepAnalysis.techSpecs.pageSpeed.isMobileFriendly
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {deepAnalysis.techSpecs.pageSpeed.isMobileFriendly ? 'COMPATIBLE' : 'PROBLEMAS'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deepAnalysis.buyerPersona && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-xs text-purple-400 uppercase font-bold mb-1 tracking-wider">Buyer Persona Detectado</div>
                            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                                "{deepAnalysis.buyerPersona}"
                            </p>
                            {deepAnalysis.painPoints && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {deepAnalysis.painPoints.map((pain: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                                            😖 {pain}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Score & Content Strategy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2">SEO Health Score</div>
                    <div className={`text-4xl font-light mb-2 ${deepAnalysis.seoScore > 70 ? 'text-green-400' : deepAnalysis.seoScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {deepAnalysis.seoScore}/100
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${deepAnalysis.seoScore > 70 ? 'bg-green-500' : deepAnalysis.seoScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${deepAnalysis.seoScore}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5 flex flex-col justify-center">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Estrategia de Contenido Sugerida</div>
                    <div className="text-sm text-zinc-300 leading-relaxed font-light">
                        {deepAnalysis.contentStrategy || 'No disponible'}
                    </div>
                </div>
            </div>

            {/* Backlinks & Competitors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-500/10 rounded-2xl p-5 border border-indigo-500/20">
                    <div className="text-xs text-indigo-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <Link2 className="w-4 h-4" /> Oportunidades de Backlinks
                    </div>
                    <ul className="space-y-2">
                        {deepAnalysis.backlinkOpportunities?.map((link: string, i: number) => (
                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">●</span>
                                <span className="leading-snug">{link}</span>
                            </li>
                        )) || <li className="text-sm text-zinc-500 italic">No detectadas</li>}
                    </ul>
                </div>
                <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/20">
                    <div className="text-xs text-red-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Top Competidores
                    </div>
                    <ul className="space-y-2">
                        {deepAnalysis.topCompetitors?.map((comp: string, i: number) => (
                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                <span className="text-red-500 mt-1">⚔️</span>
                                <span className="font-medium">{comp}</span>
                            </li>
                        )) || <li className="text-sm text-zinc-500 italic">No detectados</li>}
                    </ul>
                </div>
            </div>

            {/* Keywords */}
            <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Oportunidades de Keywords</span>
                <div className="flex flex-wrap gap-2">
                    {deepAnalysis.missingKeywords?.map((kw: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                            {kw}
                        </span>
                    )) || <span className="text-sm text-zinc-500 italic">No detectadas</span>}
                </div>
            </div>

            {/* Technical Issues - Filter out stale SSL issues if we know SSL is actually OK */}
            {(() => {
                const filteredIssues = (deepAnalysis.technicalIssues || []).filter((issue: string) => {
                    // If SSL is confirmed OK, remove any SSL-related false positives
                    if (hasSSL && /ssl|https|certificado/i.test(issue)) {
                        return false;
                    }
                    return true;
                });
                return filteredIssues.length > 0 && (
                    <div className="bg-red-900/10 rounded-2xl p-5 border border-red-500/20">
                        <h5 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Problemas Técnicos Críticos
                        </h5>
                        <ul className="space-y-2">
                            {filteredIssues.map((issue: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-red-200/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                                    <span className="leading-relaxed">{issue}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })()}
        </div>
    );
};
