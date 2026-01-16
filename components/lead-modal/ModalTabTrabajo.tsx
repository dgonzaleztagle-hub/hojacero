'use client';

import React from 'react';
import { Mail, MessageCircle, Phone, Instagram, Facebook, Globe, Zap, Copy, ExternalLink, Save, Trash2, CheckCircle2 } from 'lucide-react';

interface ModalTabTrabajoProps {
    selectedLead: any;
    ld: any;
    isDark: boolean;
    analysis: any;
    // Contact editing
    isEditingContact: boolean;
    editData: { email: string; whatsapp: string; telefono: string; demo_url: string };
    setEditData: (data: any) => void;
    setIsEditingContact: (val: boolean) => void;
    onSaveContact: () => void;
    isSaving: boolean;
    // Notes
    notes: any[];
    newNote: string;
    setNewNote: (val: string) => void;
    onSaveNote: () => void;
    onDeleteNote: (id: string) => void;
    isSavingNote: boolean;
    // Activity
    leadActivities: any[];
    // AI Templates
    onGenerateTemplate: (lead: any, type: 'whatsapp' | 'email') => void;
    isGeneratingTemplate: boolean;
    aiTemplate: { content: string; type: 'whatsapp' | 'email' | null };
    setAiTemplate: (val: any) => void;
    // Utils
    copyToClipboard: (text: string, field: string) => void;
    copiedField: string | null;
    getLeadData: (lead: any) => any;
}

export const ModalTabTrabajo = ({
    selectedLead,
    ld,
    isDark,
    analysis,
    isEditingContact,
    editData,
    setEditData,
    setIsEditingContact,
    onSaveContact,
    isSaving,
    notes,
    newNote,
    setNewNote,
    onSaveNote,
    onDeleteNote,
    isSavingNote,
    leadActivities,
    onGenerateTemplate,
    isGeneratingTemplate,
    aiTemplate,
    setAiTemplate,
    copyToClipboard,
    copiedField,
    getLeadData
}: ModalTabTrabajoProps) => {
    return (
        <div className="space-y-6">
            {/* CONTACT DATA CARD */}
            <div className={`rounded-3xl p-6 border relative group/contact transition-colors ${isDark ? 'bg-zinc-900/50 backdrop-blur-xl border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-center mb-5">
                    <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canales de Contacto</h4>
                    {!isEditingContact && (
                        <button
                            onClick={() => {
                                setEditData({
                                    email: ld.email || '',
                                    whatsapp: ld.whatsapp || '',
                                    telefono: ld.phone || '',
                                    demo_url: ld.demo_url || ''
                                });
                                setIsEditingContact(true);
                            }}
                            className={`text-[10px] font-bold transition-colors uppercase px-3 py-1.5 rounded-lg border ${isDark ? 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                        >
                            Editar Datos
                        </button>
                    )}
                </div>

                {isEditingContact ? (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Email</label>
                            <input
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
                                placeholder="correo@empresa.com"
                            />
                        </div>
                        <div>
                            <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>WhatsApp</label>
                            <input
                                value={editData.whatsapp}
                                onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'}`}
                                placeholder="569..."
                            />
                        </div>
                        <div>
                            <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Teléfono</label>
                            <input
                                value={editData.telefono}
                                onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-zinc-500' : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'}`}
                                placeholder="+56 9 ..."
                            />
                        </div>
                        <div>
                            <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Demo URL</label>
                            <input
                                value={editData.demo_url}
                                onChange={(e) => setEditData({ ...editData, demo_url: e.target.value })}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}`}
                                placeholder="/prospectos/ejemplo"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                disabled={isSaving}
                                onClick={onSaveContact}
                                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button onClick={() => setIsEditingContact(false)} className="px-5 bg-white/5 hover:bg-white/10 text-zinc-500 text-xs font-medium rounded-xl border border-white/10">
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Email */}
                        <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`p-2 rounded-lg shrink-0 ${selectedLead.email ? (isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-500') : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}>
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className={`text-sm truncate select-all ${selectedLead.email ? (isDark ? 'text-zinc-200' : 'text-gray-900') : (isDark ? 'text-zinc-600 italic' : 'text-gray-400 italic')}`}>
                                    {selectedLead.email || 'Sin email'}
                                </span>
                            </div>
                            {selectedLead.email && (
                                <button onClick={() => copyToClipboard(selectedLead.email, 'email')} className={`p-2 ml-2 rounded-lg shrink-0 transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                                    <Copy className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* WhatsApp */}
                        <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`p-2 rounded-lg shrink-0 ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? 'bg-green-500/10 text-green-500' : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}>
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <span className={`text-sm truncate select-all ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? (isDark ? 'text-zinc-200' : 'text-gray-900') : (isDark ? 'text-zinc-600 italic' : 'text-gray-400 italic')}`}>
                                    {selectedLead.whatsapp || selectedLead.source_data?.whatsapp || 'Sin WhatsApp'}
                                </span>
                            </div>
                            {(selectedLead.whatsapp || selectedLead.source_data?.whatsapp) && (
                                <button onClick={() => copyToClipboard(selectedLead.whatsapp || selectedLead.source_data?.whatsapp, 'wa')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                                    <Copy className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Demo URL Display */}
                        {selectedLead.demo_url && (
                            <div className={`flex items-center justify-between p-3 mt-2 rounded-xl border border-dashed ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                        URL Demo Activa
                                    </span>
                                </div>
                                <a href={selectedLead.demo_url} target="_blank" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold hover:bg-purple-400 transition-colors shadow-lg shadow-purple-500/20`}>
                                    Ver Demo <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}

                        {/* Social & Meta */}
                        <div className="grid grid-cols-4 gap-3 pt-2">
                            {[
                                { icon: Phone, color: 'zinc', active: !!(selectedLead.telefono || selectedLead.source_data?.phone), link: `tel:${selectedLead.telefono || selectedLead.source_data?.phone}` },
                                { icon: Instagram, color: 'pink', active: !!ld.instagram, link: ld.instagram?.startsWith('http') ? ld.instagram : `https://instagram.com/${ld.instagram}` },
                                { icon: Facebook, color: 'blue', active: !!ld.facebook, link: ld.facebook?.startsWith('http') ? ld.facebook : `https://facebook.com/${ld.facebook}` },
                                { icon: Globe, color: 'cyan', active: !!ld.website, link: ld.website }
                            ].map((item, idx) => (
                                <div key={idx} className={`relative flex items-center justify-center p-3 rounded-xl border transition-all ${item.active ? `bg-${item.color}-500/10 border-${item.color}-500/20 text-${item.color}-400 hover:bg-${item.color}-500/20 cursor-pointer` : 'bg-zinc-900/50 border-white/5 text-zinc-800'}`}>
                                    <item.icon className="w-5 h-5" />
                                    {item.active && <a href={item.link} target="_blank" className="absolute inset-0"></a>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* SALES STRATEGY CARD */}
            {analysis.salesStrategy ? (
                <div className={`border rounded-3xl p-6 space-y-5 shadow-xl relative overflow-hidden transition-colors ${isDark ? 'bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-purple-500/10' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
                    {isDark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full"></div>}

                    <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        <Zap className={`w-4 h-4 ${isDark ? 'fill-purple-400/20' : 'fill-purple-500/30'}`} /> Estrategia Ganadora
                    </h3>

                    <div className={`relative group p-5 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Gancho de Apertura</span>
                        <p className={`text-sm italic leading-relaxed font-light pr-6 ${isDark ? 'text-zinc-200' : 'text-gray-700'}`}>
                            "{analysis.salesStrategy.hook}"
                        </p>
                        <button onClick={() => copyToClipboard(analysis.salesStrategy.hook, 'hook')} className={`absolute right-3 top-3 p-2 rounded-lg transition-colors ${isDark ? 'text-zinc-600 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}>
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => {
                                const wa = selectedLead.whatsapp || selectedLead.source_data?.whatsapp;
                                if (!wa) { setIsEditingContact(true); return; }
                                onGenerateTemplate(selectedLead, 'whatsapp');
                            }}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${!(selectedLead.whatsapp || selectedLead.source_data?.whatsapp)
                                ? 'bg-zinc-800/30 border-white/5 text-zinc-700'
                                : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'}`}
                        >
                            <MessageCircle className="w-3 h-3" /> WhatsApp IA
                        </button>
                        <button
                            onClick={() => {
                                const email = selectedLead.email;
                                if (!email) { setIsEditingContact(true); return; }
                                onGenerateTemplate(selectedLead, 'email');
                            }}
                            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${!selectedLead.email
                                ? 'bg-zinc-800/30 border-white/5 text-zinc-700'
                                : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'}`}
                        >
                            <Mail className="w-3 h-3" /> Email IA
                        </button>
                    </div>

                    {/* AI Output */}
                    {(isGeneratingTemplate || aiTemplate.content) && (
                        <div className={`border rounded-xl p-3 mt-1 animate-in slide-in-from-bottom-2 duration-300 ${isDark ? 'bg-black/40 border-purple-500/20' : 'bg-white border-purple-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {isGeneratingTemplate ? 'Generando...' : `Draft ${aiTemplate.type === 'whatsapp' ? 'WhatsApp' : 'Email'}`}
                                </span>
                                {!isGeneratingTemplate && (
                                    <button onClick={() => copyToClipboard(aiTemplate.content, 'ai-out')} className={`${isDark ? 'text-zinc-600 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                                        {copiedField === 'ai-out' ? <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5" />}
                                    </button>
                                )}
                            </div>
                            {isGeneratingTemplate ? (
                                <div className="space-y-1.5 py-1">
                                    <div className={`h-1.5 rounded-full w-full animate-pulse ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}></div>
                                    <div className={`h-1.5 rounded-full w-[80%] animate-pulse ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}></div>
                                </div>
                            ) : (
                                <>
                                    <p className={`text-[10px] leading-normal max-h-[80px] overflow-y-auto whitespace-pre-wrap mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                        {aiTemplate.content}
                                    </p>
                                    <div className="flex gap-2">
                                        {aiTemplate.type === 'whatsapp' && (selectedLead.whatsapp || selectedLead.source_data?.whatsapp) && (
                                            <a
                                                href={`https://wa.me/${(selectedLead.whatsapp || selectedLead.source_data?.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(aiTemplate.content)}`}
                                                target="_blank"
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            >
                                                <MessageCircle className="w-3 h-3" /> Enviar por WhatsApp
                                            </a>
                                        )}
                                        {aiTemplate.type === 'email' && selectedLead.email && (
                                            <a
                                                href={`mailto:${selectedLead.email}?subject=Oportunidad para ${getLeadData(selectedLead).title}&body=${encodeURIComponent(aiTemplate.content)}`}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            >
                                                <Mail className="w-3 h-3" /> Abrir en Email
                                            </a>
                                        )}
                                        <button
                                            onClick={() => setAiTemplate({ content: '', type: null })}
                                            className={`px-3 py-2 rounded-lg text-[10px] font-bold transition-colors ${isDark ? 'bg-white/5 text-zinc-500 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-8 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-zinc-700 text-[10px] font-medium uppercase tracking-widest">Estrategia Pendiente</p>
                </div>
            )}

            {/* NOTES SECTION */}
            <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Notas Privadas</h3>

                <div className="relative mb-4">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Agregar nota..."
                        className={`w-full rounded-xl p-4 text-sm pr-12 resize-none outline-none border transition-all ${isDark ? 'bg-zinc-900 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-200 text-gray-800'}`}
                        rows={2}
                    />
                    <button
                        onClick={onSaveNote}
                        disabled={!newNote.trim() || isSavingNote}
                        className="absolute right-2 bottom-2 p-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3 pl-2 border-l border-zinc-700/50 ml-1 max-h-[150px] overflow-y-auto custom-scrollbar">
                    {notes.length === 0 ? (
                        <p className="text-xs text-zinc-500 italic pl-3">Sin notas</p>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="relative pl-5 pb-2 group">
                                <div className={`absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-zinc-900 border-yellow-500' : 'bg-white border-yellow-500'}`}></div>
                                <div className={`p-3 rounded-xl border text-sm whitespace-pre-wrap relative leading-relaxed ${isDark ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                    {note.contenido}
                                    <button
                                        onClick={() => onDeleteNote(note.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <span className="text-[10px] text-zinc-500 pl-1 block mt-1">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Historial de Actividad</h3>

                <div className="space-y-4 pl-2 border-l border-zinc-700/50 ml-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {leadActivities.length === 0 ? (
                        <p className="text-xs text-zinc-500 italic pl-3">Sin actividad registrada</p>
                    ) : (
                        leadActivities.map((log) => (
                            <div key={log.id} className="relative pl-5 pb-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-zinc-900 border-zinc-600' : 'bg-white border-gray-300'}`}></div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                            {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span className={`text-sm mt-0.5 font-medium ${isDark ? 'text-zinc-300' : 'text-gray-800'}`}>
                                        {log.accion === 'contacted' ? '💬 Contactado' :
                                            log.accion === 'proposal_sent' ? '📄 Propuesta Enviada' :
                                                log.accion === 'qualified' ? '✅ Calificado' :
                                                    log.accion === 'discarded' ? '🗑️ Descartado' :
                                                        log.accion === 'closed_won' ? '🎉 Ganado' :
                                                            log.accion === 'closed_lost' ? '❌ Perdido' : log.accion}
                                    </span>
                                    {log.nota && (
                                        <p className="text-xs text-zinc-400 mt-1.5 italic bg-white/5 p-2 rounded-lg leading-relaxed">
                                            "{log.nota}"
                                        </p>
                                    )}
                                    <span className="text-[10px] text-zinc-600 mt-1">
                                        por {log.usuario} • {log.estado_anterior} → {log.estado_nuevo}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
