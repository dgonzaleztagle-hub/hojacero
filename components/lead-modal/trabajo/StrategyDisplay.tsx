import React from 'react';
import { Lightbulb, Zap, Copy, Download, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface StrategyDisplayProps {
    analysis: any;
    isDark: boolean;
    selectedLead: any;
    setIsReportBuilderOpen: (val: boolean) => void;
}

export const StrategyDisplay = ({ analysis, isDark, selectedLead, setIsReportBuilderOpen }: StrategyDisplayProps) => {

    if (!analysis.salesStrategy) return null;

    return (
        <div className={`border rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden transition-colors ${isDark ? 'bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-purple-500/10' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
            {isDark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full"></div>}

            <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                <Zap className={`w-4 h-4 ${isDark ? 'fill-purple-400/20' : 'fill-purple-500/30'}`} /> Hunter HQ
            </h3>

            {/* ANGLES & PDF TOOLS */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {/* PDF GEN BUTTON */}
                <button
                    onClick={() => setIsReportBuilderOpen(true)}
                    title="Generar un reporte PDF formal con diseño visual, ideal para enviar por correo al cliente."
                    className={`shrink-0 px-4 py-2 rounded-xl border flex flex-col items-center justify-center gap-1 min-w-[100px] transition-all ${isDark
                        ? 'bg-zinc-900/50 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 group'
                        : 'bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 group'
                        }`}
                >
                    <Download className={`w-5 h-5 mb-0.5 ${isDark ? 'text-cyan-400 group-hover:scale-110 transition-transform' : 'text-cyan-600'}`} />
                    <span className={`text-[9px] font-bold uppercase leading-none ${isDark ? 'text-zinc-400 group-hover:text-cyan-200' : 'text-gray-500 group-hover:text-cyan-700'}`}>Generar PDF</span>
                    <span className={`text-[8px] font-medium opacity-60 leading-none ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Reporte Visual</span>
                </button>

                {/* VIEW PDF LINK */}
                {(selectedLead.pdf_url || selectedLead.source_data?.pdf_url) && (
                    <a
                        href={selectedLead.pdf_url || selectedLead.source_data?.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        title="Ver el PDF generado y guardado en la nube."
                        className={`shrink-0 px-4 py-2 rounded-xl border flex flex-col items-center justify-center gap-1 min-w-[100px] transition-all ${isDark
                            ? 'bg-zinc-900/50 border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 group'
                            : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 group'
                            }`}
                    >
                        <ExternalLink className={`w-5 h-5 mb-0.5 ${isDark ? 'text-indigo-400 group-hover:scale-110 transition-transform' : 'text-indigo-600'}`} />
                        <span className={`text-[9px] font-bold uppercase leading-none ${isDark ? 'text-zinc-400 group-hover:text-indigo-200' : 'text-gray-500 group-hover:text-indigo-700'}`}>Ver PDF</span>
                        <span className={`text-[8px] font-medium opacity-60 leading-none ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Guardado</span>
                    </a>
                )}

                {/* DEMO LINK BUTTON */}
                {(selectedLead.demo_url || selectedLead.source_data?.demo_url) && (
                    <button
                        onClick={() => {
                            const url = selectedLead.demo_url || selectedLead.source_data?.demo_url;
                            navigator.clipboard.writeText(url);
                            toast.success('Link del Demo copiado');
                        }}
                        title="Copiar el enlace de la landing page demo (Factory)."
                        className={`shrink-0 px-4 py-2 rounded-xl border flex flex-col items-center justify-center gap-1 min-w-[100px] transition-all ${isDark
                            ? 'bg-zinc-900/50 border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 group'
                            : 'bg-white border-gray-200 hover:border-pink-400 hover:bg-pink-50 group'
                            }`}
                    >
                        <LinkIcon className={`w-5 h-5 mb-0.5 ${isDark ? 'text-pink-400 group-hover:scale-110 transition-transform' : 'text-pink-600'}`} />
                        <span className={`text-[9px] font-bold uppercase leading-none ${isDark ? 'text-zinc-400 group-hover:text-pink-200' : 'text-gray-500 group-hover:text-pink-700'}`}>Link Demo</span>
                        <span className={`text-[8px] font-medium opacity-60 leading-none ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Landing Page</span>
                    </button>
                )}

                {/* COPY STRATEGY BUTTON */}
                <button
                    onClick={() => {
                        const text = `
Estrategia Hunter para ${selectedLead.title || 'Cliente'}:
--------------------------------
🎯 Gancho: ${analysis.salesStrategy?.hook || 'N/A'}

⚠️ Dolores:
${analysis.salesStrategy?.painPoints?.map((p: string) => `- ${p}`).join('\n') || 'N/A'}

💡 Solución: ${analysis.salesStrategy?.proposedSolution || 'N/A'}
💰 Valor: ${analysis.salesStrategy?.estimatedValue || 'N/A'}

🔐 Ángulos:
${(analysis.sales_angles || []).map((a: string) => `- ${a}`).join('\n')}
                        `.trim();
                        navigator.clipboard.writeText(text);
                        toast.success('Resumen copiado para WhatsApp');
                    }}
                    title="Copiar resumen en texto plano (sin diseño), ideal para pegar en WhatsApp o Slack."
                    className={`shrink-0 px-4 py-2 rounded-xl border flex flex-col items-center justify-center gap-1 min-w-[100px] transition-all ${isDark
                        ? 'bg-zinc-900/50 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 group'
                        : 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 group'
                        }`}
                >
                    <Copy className={`w-5 h-5 mb-0.5 ${isDark ? 'text-purple-400 group-hover:scale-110 transition-transform' : 'text-purple-600'}`} />
                    <span className={`text-[9px] font-bold uppercase leading-none ${isDark ? 'text-zinc-400 group-hover:text-purple-200' : 'text-gray-500 group-hover:text-purple-700'}`}>Copiar Plan</span>
                    <span className={`text-[8px] font-medium opacity-60 leading-none ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Resumen Texto</span>
                </button>

                {/* SALES ANGLES (Horizontally Scrollable) */}
                {(analysis.sales_angles || analysis.content_ideas?.email_subjects || []).map((angle: string, i: number) => (
                    <div key={i} className={`shrink-0 p-3 rounded-xl border w-[200px] flex flex-col gap-2 relative group ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="w-3 h-3 text-amber-400" />
                            <span className="text-[9px] font-bold uppercase text-zinc-500">Ángulo {i + 1}</span>
                        </div>
                        <p className={`text-[10px] leading-snug line-clamp-3 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                            {angle}
                        </p>
                    </div>
                ))}
            </div>

            <div className={`relative group p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Gancho de Apertura</span>
                <p className={`text-sm italic leading-relaxed font-light pr-6 ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                    "{analysis.salesStrategy?.hook || "Pendiente de análisis"}"
                </p>
            </div>

            {/* STRATEGY DETAILS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* PAIN POINTS */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-red-900/10 border-red-500/10' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Puntos de Dolor</span>
                    </div>
                    <ul className="space-y-1">
                        {analysis.salesStrategy?.painPoints?.slice(0, 3).map((pain: string, idx: number) => (
                            <li key={idx} className={`textxs leading-snug flex items-start gap-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                <span className="text-red-500 mt-0.5">•</span>
                                <span className="text-xs">{pain}</span>
                            </li>
                        )) || <li className="text-xs text-zinc-500">Sin detectar</li>}
                    </ul>
                </div>

                {/* SOLUTION & VALUE */}
                <div className="space-y-3">
                    <div className={`p-3 rounded-xl border ${isDark ? 'bg-emerald-900/10 border-emerald-500/10' : 'bg-emerald-50 border-emerald-100'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block mb-1">Solución</span>
                        <p className={`text-xs ${isDark ? 'text-emerald-100/70' : 'text-emerald-800'}`}>
                            {analysis.salesStrategy?.proposedSolution || "Pendiente"}
                        </p>
                    </div>
                    <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-amber-900/10 border-amber-500/10' : 'bg-amber-50 border-amber-100'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Valor Est.</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                            {analysis.salesStrategy?.estimatedValue || "?"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
