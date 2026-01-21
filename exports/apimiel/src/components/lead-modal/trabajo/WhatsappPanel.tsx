import React from 'react';
import { Loader2, Zap, Copy, CheckCircle2, Send, AlertTriangle } from 'lucide-react';

interface WhatsappPanelProps {
    aiTemplate: { content: string; type: 'whatsapp' | 'email' | null };
    setAiTemplate: (val: any) => void;
    onGenerateTemplate: (lead: any, type: 'whatsapp') => void;
    isGeneratingTemplate: boolean;
    selectedLead: any;
    isDark: boolean;
    copyToClipboard: (text: string, field: string) => void;
    copiedField: string | null;
}

export const WhatsappPanel = ({
    aiTemplate,
    setAiTemplate,
    onGenerateTemplate,
    isGeneratingTemplate,
    selectedLead,
    isDark,
    copyToClipboard,
    copiedField
}: WhatsappPanelProps) => {
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center justify-between">
                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Genera un mensaje corto ("The Nudge") para iniciar conversación.
                </p>
                {!aiTemplate.content && (
                    <button
                        onClick={() => onGenerateTemplate(selectedLead, 'whatsapp')}
                        disabled={isGeneratingTemplate}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 transition-all flex items-center gap-2`}
                    >
                        {isGeneratingTemplate ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 fill-black" />}
                        Generar Mensaje
                    </button>
                )}
            </div>

            {(isGeneratingTemplate || (aiTemplate.content && aiTemplate.type === 'whatsapp')) && (
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/40 border-green-500/20' : 'bg-green-50/50 border-green-200'}`}>
                    {isGeneratingTemplate ? (
                        <div className="space-y-2">
                            <div className={`h-2 rounded-full w-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                            <div className={`h-2 rounded-full w-2/3 animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <textarea
                                value={aiTemplate.content}
                                onChange={(e) => setAiTemplate({ ...aiTemplate, content: e.target.value })}
                                className={`w-full bg-transparent border-none resize-none focus:ring-0 text-sm ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}
                                rows={4}
                            />
                            <div className="flex gap-2 justify-end pt-2 border-t border-dashed border-white/10">
                                <button
                                    onClick={() => copyToClipboard(aiTemplate.content, 'wa-msg')}
                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {copiedField === 'wa-msg' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                                {!!(selectedLead.whatsapp || selectedLead.source_data?.whatsapp) ? (
                                    <a
                                        href={`https://wa.me/${(selectedLead.whatsapp || selectedLead.source_data?.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(aiTemplate.content)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
                                    >
                                        <Send className="w-4 h-4" /> Enviar WhatsApp
                                    </a>
                                ) : (
                                    <button
                                        disabled
                                        className={`px-4 py-2 font-bold rounded-lg text-xs flex items-center gap-2 transition-all cursor-not-allowed ${isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-200 text-gray-400'}`}
                                        title="No hay número de WhatsApp registrado"
                                    >
                                        <AlertTriangle className="w-3 h-3" /> Falta WhatsApp
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
