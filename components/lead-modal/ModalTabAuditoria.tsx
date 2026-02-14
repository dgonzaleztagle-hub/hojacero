'use client';

import React from 'react';
import { TrendingUp, Users, Link2, ShieldAlert, AlertTriangle, Zap, Loader2, Server, Globe, Clock } from 'lucide-react';

interface ModalTabAuditoriaProps {
    selectedLead: {
        source_data?: {
            deep_analysis?: {
                techSpecs?: {
                    security?: { https?: boolean; hsts?: boolean };
                    infrastructure?: { mxRecords?: boolean; host?: string; cloudflare?: boolean };
                    dns?: { hasSpf?: boolean };
                    performance?: { ttfb?: number };
                    pageSpeed?: {
                        mobileScore?: number | null;
                        desktopScore?: number | null;
                        isMobileFriendly?: boolean;
                        coreWebVitals?: { lcp?: string; cls?: string };
                    };
                };
                designAnalysis?: { estimatedAge?: string; worstProblems?: string[] };
                executiveSummary?: string;
                salesStrategy?: { painPoints?: string[]; hook?: string };
                painPoints?: string[];
                seoScore?: number;
                contentStrategy?: string;
                backlinkOpportunities?: string[];
                competitors?: string[];
                topCompetitors?: string[];
                technicalIssues?: Array<string | { issue?: string; impact?: string }>;
                [key: string]: unknown;
            };
            scraped?: {
                hasSSL?: boolean;
                forensic?: { archetype?: string };
            };
            deep_analysis_stale?: boolean;
        };
    };
    isDark: boolean;
    isDeepAnalyzing?: boolean; // make optional if not passed
    onDeepAnalyze?: () => void; // make optional
    ld?: Record<string, unknown>; // make optional
    isReanalyzing?: boolean; // Add this
    setIsReanalyzing?: (v: boolean) => void; // Add this
}

export const ModalTabAuditoria = ({
    selectedLead,
    isDark,
    isDeepAnalyzing,
    onDeepAnalyze
}: ModalTabAuditoriaProps) => {
    const deepAnalysis = selectedLead.source_data?.deep_analysis;
    const scraped = selectedLead.source_data?.scraped;
    const staleAudit = Boolean(selectedLead.source_data?.deep_analysis_stale);

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

    const techSpecs = deepAnalysis.techSpecs ?? {
        security: { https: false, hsts: false },
        infrastructure: { mxRecords: false, host: null, cloudflare: false },
        dns: { hasSpf: false },
        performance: { ttfb: null },
        pageSpeed: {
            mobileScore: null,
            desktopScore: null,
            isMobileFriendly: null,
            coreWebVitals: null
        }
    };
    const infra = techSpecs.infrastructure ?? { mxRecords: false, host: null, cloudflare: false };
    const dns = techSpecs.dns ?? { hasSpf: false };
    const perf = techSpecs.performance ?? { ttfb: null };
    const pageSpeed = techSpecs.pageSpeed ?? {
        mobileScore: null,
        desktopScore: null,
        isMobileFriendly: null,
        coreWebVitals: null
    };
    const mobileScore = typeof pageSpeed.mobileScore === 'number' ? pageSpeed.mobileScore : 0;
    const desktopScore = typeof pageSpeed.desktopScore === 'number' ? pageSpeed.desktopScore : 0;
    const seoScore = typeof deepAnalysis.seoScore === 'number' ? deepAnalysis.seoScore : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Reporte de Inteligencia (SEO & Competencia)
                </h4>
                <div className="flex items-center gap-2">
                    {staleAudit && (
                        <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] font-black text-amber-400 uppercase">
                            Datos potencialmente desactualizados
                        </span>
                    )}
                    {selectedLead.source_data?.scraped?.forensic?.archetype && (
                        <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-black text-red-400 uppercase">
                            Arquetipo: {selectedLead.source_data?.scraped?.forensic?.archetype}
                        </span>
                    )}
                    <button
                        onClick={onDeepAnalyze}
                        disabled={isDeepAnalyzing}
                        className={`p-1.5 rounded-lg border transition-all ${isDark ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-300' : 'bg-purple-50 border-purple-100 hover:bg-purple-100 text-purple-500'}`}
                        title="Forzar re-auditoría profunda"
                    >
                        {isDeepAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* TECHNICAL HEALTH (Web-Check Style) */}
            {techSpecs && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-3">
                    {/* Security / SSL */}
                    {/* Security - REMOVED PER USER REQUEST */}
                    {/*
                    <div className={`p-5 rounded-2xl border ${hasSSL ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className={`w-4 h-4 ${hasSSL ? 'text-green-400' : 'text-red-400'}`} />
                            <span className={`text-xs font-bold uppercase ${hasSSL ? 'text-green-400' : 'text-red-400'}`}>Seguridad</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {hasSSL ? 'SSL Activo' : 'Sin HTTPS'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {techSpecs?.security?.hsts ? '+HSTS' : 'Sin HSTS'}
                        </div>
                    </div>
                    */}

                    {/* Email / DNS */}
                    <div className={`p-5 rounded-2xl border ${infra.mxRecords ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Server className={`w-4 h-4 ${infra.mxRecords ? 'text-indigo-400' : 'text-yellow-400'}`} />
                            <span className={`text-xs font-bold uppercase ${infra.mxRecords ? 'text-indigo-400' : 'text-yellow-400'}`}>Email</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {infra.mxRecords ? 'MX Configurado' : 'Sin Email Prof.'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {dns.hasSpf ? 'SPF OK' : 'Posible Spam'}
                        </div>
                    </div>

                    {/* Performance */}
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold uppercase text-blue-400">Velocidad</span>
                        </div>
                        <div className={`text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                            {perf.ttfb ? `${perf.ttfb}ms TTFB` : 'N/A'}
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
                        <div className={`text-sm font-medium truncate ${isDark ? 'text-zinc-200' : 'text-gray-800'}`} title={infra.host || 'Desconocido'}>
                            {infra.host || 'Desconocido'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                            {infra.cloudflare ? 'Usando Cloudflare' : 'Direct IP'}
                        </div>
                    </div>
                </div>
            )}

            {/* PAGE SPEED & CORE WEB VITALS */}
            {techSpecs?.pageSpeed && (pageSpeed.mobileScore !== null) && (
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
                                <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${mobileScore >= 90 ? 'border-green-500 text-green-400' :
                                    mobileScore >= 50 ? 'border-yellow-500 text-yellow-400' :
                                        'border-red-500 text-red-400'
                                    }`}>
                                    <span className="text-xl font-bold">{mobileScore}</span>
                                </div>
                                <span className="text-xs uppercase font-bold text-zinc-500">Móvil</span>
                            </div>
                            {/* Desktop Score */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center ${desktopScore >= 90 ? 'border-green-500 text-green-400' :
                                    desktopScore >= 50 ? 'border-yellow-500 text-yellow-400' :
                                        'border-red-500 text-red-400'
                                    }`}>
                                    <span className="text-xl font-bold">{desktopScore}</span>
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
                                    {pageSpeed.coreWebVitals?.lcp || 'N/A'}
                                </div>
                            </div>
                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                <div className="text-xs text-zinc-500 mb-1">CLS (Estabilidad)</div>
                                <div className="text-lg font-mono font-medium text-zinc-200">
                                    {pageSpeed.coreWebVitals?.cls || 'N/A'}
                                </div>
                            </div>
                            <div className="col-span-2 bg-black/20 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                <div className="text-xs text-zinc-500">Mobile Friendly</div>
                                <div className={`text-xs font-bold px-2 py-1 rounded ${pageSpeed.isMobileFriendly
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {pageSpeed.isMobileFriendly ? 'COMPATIBLE' : 'PROBLEMAS'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BUYER PERSONA & PAIN POINTS - UPDATED FOR NEW JSON STRUCTURE */}
            {deepAnalysis.designAnalysis && (
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-xs text-purple-400 uppercase font-bold mb-1 tracking-wider">Análisis de Diseño (Edad: {deepAnalysis.designAnalysis.estimatedAge || 'N/A'})</div>
                            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                                {deepAnalysis.executiveSummary}
                            </p>
                            {/* NEW: Pain Points from salesStrategy */}
                            {deepAnalysis.salesStrategy?.painPoints && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {deepAnalysis.salesStrategy.painPoints.map((pain: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                                            😖 {pain}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {/* BACKWARDS COMPATIBILITY: Old painPoints field */}
                            {!deepAnalysis.salesStrategy?.painPoints && deepAnalysis.painPoints && (
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
                    <div className={`text-4xl font-light mb-2 ${seoScore > 70 ? 'text-green-400' : seoScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {seoScore}/100
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${seoScore > 70 ? 'bg-green-500' : seoScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${seoScore}%` }}
                        ></div>
                    </div>
                </div>
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5 flex flex-col justify-center">
                    <div className="text-xs text-zinc-500 uppercase font-bold mb-2">Gancho de Venta (Sales Hook)</div>
                    <div className="text-sm text-zinc-300 leading-relaxed font-light italic">
                                &quot;{deepAnalysis.salesStrategy?.hook || deepAnalysis.contentStrategy || 'No disponible'}&quot;
                            </div>
                        </div>
                    </div>

            {/* Backlinks & Competitors - UPDATED: Handle new structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-500/10 rounded-2xl p-5 border border-indigo-500/20">
                    <div className="text-xs text-indigo-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <Link2 className="w-4 h-4" /> Problemas Visuales
                    </div>
                    <ul className="space-y-2">
                        {/* Muestra worstProblems del analysis de diseño si existe */}
                        {deepAnalysis.designAnalysis?.worstProblems?.map((prob: string, i: number) => (
                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">●</span>
                                <span className="leading-snug">{prob}</span>
                            </li>
                        )) || (
                                deepAnalysis.backlinkOpportunities?.map((link: string, i: number) => (
                                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1">●</span>
                                        <span className="leading-snug">{link}</span>
                                    </li>
                                ))
                            ) || <li className="text-sm text-zinc-500 italic">No detectados</li>}
                    </ul>
                </div>
                <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/20">
                    <div className="text-xs text-red-400 uppercase font-bold mb-3 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Competidores
                    </div>
                    <ul className="space-y-2">
                        {/* Handle both new 'competitors' and old 'topCompetitors' keys */}
                        {(deepAnalysis.competitors || deepAnalysis.topCompetitors)?.map((comp: string, i: number) => (
                            <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                <span className="text-red-500 mt-1">⚔️</span>
                                <span className="font-medium">{comp}</span>
                            </li>
                        )) || <li className="text-sm text-zinc-500 italic">No detectados</li>}
                    </ul>
                </div>
            </div>

            {/* Technical Issues - UPDATED: Handle Objects {issue, severity} */}
            {(() => {
                const rawIssues = deepAnalysis.technicalIssues || [];
                // Filter out SSL false positives only if SSL is confirmed OK
                const filteredIssues = rawIssues.filter((issue) => {
                    const issueText = typeof issue === 'string' ? issue : issue.issue;
                    if (hasSSL && issueText && /ssl|https|certificado/i.test(issueText)) {
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
                            {filteredIssues.map((issue, i: number) => {
                                const isString = typeof issue === 'string';
                                const text = isString ? issue : issue.issue;
                                const impact = !isString ? issue.impact : null;

                                return (
                                    <li key={i} className="flex items-start gap-3 text-sm text-red-200/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                                        <div className="flex flex-col">
                                            <span className="leading-relaxed">{text}</span>
                                            {impact && <span className="text-xs text-red-400/60 mt-0.5">{impact}</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })()}
        </div>
    );
};


