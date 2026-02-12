import React from 'react';
import { Mail, User, Zap, Loader2, Copy, CheckCircle2, Send, AlertTriangle, Paperclip, X, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface EmailComposerProps {
    selectedLead: any;
    isDark: boolean;
    analysis: any;
    emailSubject: string;
    setEmailSubject: (val: string) => void;
    signatures: any[];
    selectedSignature: any;
    setSelectedSignature: (val: any) => void;
    aiTemplate: { content: string; type: 'whatsapp' | 'email' | null };
    setAiTemplate: (val: any) => void;
    isGeneratingTemplate: boolean;
    onGenerateTemplate: (lead: any, type: 'whatsapp' | 'email') => void;
    attachments: { filename: string; path: string }[];
    setAttachments: (val: any[]) => void;
    handleSendEmail: () => Promise<any> | void;
    isSendingEmail: boolean;
    copyToClipboard: (text: string, field: string) => void;
    copiedField: string | null;
    onContactSuccess: () => Promise<void> | void;
    getFullEmailBody: () => string;
}

export const EmailComposer = ({
    selectedLead,
    isDark,
    analysis,
    emailSubject,
    setEmailSubject,
    signatures,
    selectedSignature,
    setSelectedSignature,
    aiTemplate,
    setAiTemplate,
    isGeneratingTemplate,
    onGenerateTemplate,
    attachments,
    setAttachments,
    handleSendEmail,
    isSendingEmail,
    copyToClipboard,
    copiedField,
    onContactSuccess,
    getFullEmailBody
}: EmailComposerProps) => {

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Subject Selector */}
            <div className="space-y-4">
                {/* SENDER SELECTOR */}
                <div className="flex items-center justify-between p-3 rounded-xl border bg-zinc-500/5 border-white/5">
                    <div className="flex items-center gap-2">
                        <User className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                        <span className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Enviado por:</span>
                    </div>
                    <div className="flex gap-2">
                        {signatures.map((sig: any) => (
                            <button
                                key={sig.id}
                                onClick={() => setSelectedSignature(sig)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedSignature?.id === sig.id
                                    ? (isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white')
                                    : (isDark ? 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                                    }`}
                            >
                                {sig.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>1. Selecciona un Asunto (Ángulo de Venta)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(analysis.sales_angles || []).map((angle: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => setEmailSubject(angle)}
                                className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${emailSubject === angle
                                    ? (isDark ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-700')
                                    : (isDark ? 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:border-white/20' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300')
                                    }`}
                            >
                                {angle}
                            </button>
                        ))}
                        <button
                            onClick={() => setEmailSubject("Propuesta de Diseño Web - " + (selectedLead.title || selectedLead.source_data?.title))}
                            className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${isDark ? 'bg-zinc-800/50 border-white/5 text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                        >
                            Genérico
                        </button>
                    </div>
                    <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Asunto del correo..."
                        className={`w-full px-3 py-2 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500/50 transition-all ${isDark ? 'bg-black/20 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900'
                            }`}
                    />
                </div>

                {/* Body Generator */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>2. Contenido IA (Hunter)</span>
                        {!aiTemplate.content && (
                            <button
                                onClick={() => onGenerateTemplate(selectedLead, 'email')}
                                disabled={isGeneratingTemplate}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center gap-2`}
                            >
                                {isGeneratingTemplate ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                Redactar Correo
                            </button>
                        )}
                    </div>

                    {(isGeneratingTemplate || (aiTemplate.content && aiTemplate.type === 'email')) && (
                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-black/40 border-blue-500/20' : 'bg-blue-50/50 border-blue-200'}`}>
                            {isGeneratingTemplate ? (
                                <div className="space-y-2">
                                    <div className={`h-2 rounded-full w-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                                    <div className={`h-2 rounded-full w-full animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                                    <div className={`h-2 rounded-full w-2/3 animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <textarea
                                        value={aiTemplate.content}
                                        onChange={(e) => setAiTemplate({ ...aiTemplate, content: e.target.value })}
                                        className={`w-full bg-transparent border-none resize-none focus:ring-0 text-sm ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}
                                        rows={8}
                                    />
                                    {/* ATTACHMENT TOOLS */}
                                    <div className="flex flex-col gap-2 px-2 pb-2">
                                        {/* Chips */}
                                        {attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {attachments.map((file, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg text-[10px] border border-indigo-500/20">
                                                        <Paperclip className="w-3 h-3" />
                                                        <span className="max-w-[150px] truncate">{file.filename}</span>
                                                        <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            {(selectedLead.pdf_url || selectedLead.source_data?.pdf_url) && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            const url = selectedLead.pdf_url || selectedLead.source_data?.pdf_url;
                                                            // Check if already attached
                                                            if (attachments.find(a => a.path === url)) return toast.error('Ya está adjunto');
                                                            setAttachments([...attachments, { filename: 'Reporte_Estrategico.pdf', path: url }]);
                                                        }}
                                                        className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition-opacity ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}
                                                    >
                                                        <Paperclip className="w-3 h-3" /> Adjuntar PDF
                                                    </button>
                                                    <button
                                                        onClick={() => setAiTemplate({ ...aiTemplate, content: aiTemplate.content + `\n\n📄 Ver Reporte Estratégico: ${selectedLead.pdf_url || selectedLead.source_data?.pdf_url}` })}
                                                        className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition-opacity ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}
                                                    >
                                                        <ExternalLink className="w-3 h-3" /> Insertar Link PDF
                                                    </button>
                                                </>
                                            )}
                                            {(selectedLead.demo_url || selectedLead.source_data?.demo_url) && (
                                                <button
                                                    onClick={() => {
                                                        const rawUrl = selectedLead.demo_url || selectedLead.source_data?.demo_url || '';
                                                        const url = rawUrl.startsWith('http') ? rawUrl : `https://hojacero.cl${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
                                                        setAiTemplate({ ...aiTemplate, content: aiTemplate.content + `\n\n🔗 Ver Demo Propuesto: ${url}` });
                                                    }}
                                                    className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition-opacity ${isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-600 border-pink-200'}`}
                                                >
                                                    <LinkIcon className="w-3 h-3" /> Insertar Link Demo
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2 border-t border-dashed border-white/10">
                                        <button
                                            onClick={() => copyToClipboard(getFullEmailBody(), 'email-msg')}
                                            className={`p-2 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {copiedField === 'email-msg' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        {selectedLead.email ? (
                                            <button
                                                onClick={handleSendEmail}
                                                disabled={isSendingEmail}
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                            >
                                                {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                Enviar Email
                                            </button>
                                        ) : (
                                            <button
                                                disabled
                                                className={`px-4 py-2 font-bold rounded-lg text-xs flex items-center gap-2 transition-all cursor-not-allowed ${isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-200 text-gray-400'}`}
                                                title="No hay email registrado"
                                            >
                                                <AlertTriangle className="w-3 h-3" /> Falta Email
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
