'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ShieldOff, Globe, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface RadarReportProps {
    data: {
        score: number;
        vibe: string;
        analysisReport: string;
        opportunity: string;
        salesStrategy?: {
            hook: string;
            painPoints: string[];
            proposedSolution: string;
            estimatedValue: string;
        };
        techStack?: string[];
        hasSSL?: boolean;
        url?: string;
    };
}

export function RadarReport({ data }: RadarReportProps) {
    const score = data.score || 0;
    const isHighOpportunity = score > 70;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
        >
            {/* Header: Score & Vibe */}
            <div className={`p-4 flex items-center justify-between border-b border-white/5 ${isHighOpportunity ? 'bg-cyan-500/10' : 'bg-zinc-800/50'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${score > 80 ? 'bg-red-500 text-white' : score > 50 ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                        {score}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Opportunity Score</div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                            {data.vibe} <span className="opacity-20">•</span> {data.opportunity}
                        </div>
                    </div>
                </div>
                {data.hasSSL ? (
                    <Shield className="w-5 h-5 text-green-500" />
                ) : (
                    <ShieldOff className="w-5 h-5 text-red-500" />
                )}
            </div>

            {/* Analysis Text */}
            <div className="p-4 space-y-3">
                <p className="text-xs leading-relaxed text-zinc-300 italic">
                    "{data.analysisReport}"
                </p>

                {/* Tech & URL */}
                <div className="flex flex-wrap gap-2 pt-2">
                    {data.techStack?.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-bold text-zinc-400 uppercase">
                            {tech}
                        </span>
                    ))}
                    {data.url && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-400">
                            <Globe className="w-3 h-3" /> {data.url.replace(/^https?:\/\//, '')}
                        </div>
                    )}
                </div>
            </div>

            {/* Strategy Box */}
            {data.salesStrategy && (
                <div className="p-4 bg-black/40 grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <div className="text-[9px] font-bold uppercase tracking-tighter text-cyan-500 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Pain Points Detectados
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {data.salesStrategy.painPoints.map((p, i) => (
                                <span key={i} className="text-[10px] text-zinc-400 flex items-center gap-1">
                                    <AlertCircle className="w-2.5 h-2.5 text-red-500/50" /> {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                        <div className="text-[9px] font-bold uppercase tracking-tighter text-purple-400 mb-1">Solución Propuesta</div>
                        <p className="text-[10px] text-zinc-300 font-medium">
                            {data.salesStrategy.proposedSolution}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="text-[10px] text-zinc-500">
                            Valor Estimado: <span className="text-white font-bold">{data.salesStrategy.estimatedValue}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 italic">
                            Hook: {data.salesStrategy.hook}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
