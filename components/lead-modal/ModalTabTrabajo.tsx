'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, MessageCircle, Phone, Instagram, Facebook, Globe, Zap, Copy, ExternalLink, Save, Trash2, CheckCircle2, Loader2, Send, MessageSquare, Download, Lightbulb, Link as LinkIcon, User, Calendar, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ReportBuilderModal } from '../report/ReportBuilderModal';
import { toast } from 'sonner';

interface ChatMessage {
    id: string;
    author: 'Yo' | 'Gaston' | 'Sistema';
    message: string;
    created_at: string;
}

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
    onSaveContact: () => Promise<void> | void;
    isSaving: boolean;
    onLeadUpdate?: (lead: any) => void;
    // Chat / Bitácora
    chatMessages: ChatMessage[];
    newChatMessage: string;
    setNewChatMessage: (val: string) => void;
    chatAuthor: 'Yo' | 'Gaston';
    setChatAuthor: (val: 'Yo' | 'Gaston') => void;
    onSendChatMessage: (e?: React.FormEvent) => Promise<void> | void;
    // Notes (Deprecated/Legacy - kept optional if needed, but UI removed)
    notes?: any[];
    newNote?: string;
    setNewNote?: (val: string) => void;
    onSaveNote?: () => void;
    onDeleteNote?: (id: string) => void;
    isSavingNote?: boolean;
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
    notes, // legacy
    newNote, // legacy
    setNewNote, // legacy
    onSaveNote, // legacy
    onDeleteNote, // legacy
    isSavingNote, // legacy
    chatMessages,
    newChatMessage,
    setNewChatMessage,
    chatAuthor,
    setChatAuthor,
    onSendChatMessage,
    leadActivities,
    onGenerateTemplate,
    isGeneratingTemplate,
    aiTemplate,
    setAiTemplate,
    copyToClipboard,
    copiedField,
    getLeadData,
    onLeadUpdate
}: ModalTabTrabajoProps) => {
    const [isEditingUrl, setIsEditingUrl] = useState(false);
    const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

    // Communication Hub State
    const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
    const [emailSubject, setEmailSubject] = useState('');
    const [signatures, setSignatures] = useState<any[]>([]);
    const [selectedSignature, setSelectedSignature] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Agenda / Follow-up State
    // Initialize split state for Date and Time
    const initialDate = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
    const [dateInput, setDateInput] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
    const [timeInput, setTimeInput] = useState(initialDate ? initialDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');

    const [nextActionNote, setNextActionNote] = useState(selectedLead.next_action_note || '');
    const [isSavingAction, setIsSavingAction] = useState(false);
    const prevLeadIdRef = useRef(selectedLead.id);

    // Sync Agenda State ONLY when lead changes (ID switch)
    useEffect(() => {
        if (selectedLead.id !== prevLeadIdRef.current) {
            const d = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
            setDateInput(d ? d.toISOString().split('T')[0] : '');
            setTimeInput(d ? d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');
            setNextActionNote(selectedLead.next_action_note || '');
            prevLeadIdRef.current = selectedLead.id;
        }
    }, [selectedLead.id, selectedLead.next_action_date, selectedLead.next_action_note]);

    const handleSaveAction = async () => {
        try {
            setIsSavingAction(true);
            const supabase = createClient();

            // Combine Date + Time
            let finalTimestamp = null;
            if (dateInput) {
                // Create local date object
                const combined = new Date(`${dateInput}T${timeInput || '09:00'}:00`);
                finalTimestamp = combined.toISOString();
            }

            const { error } = await supabase
                .from('leads')
                .update({
                    next_action_date: finalTimestamp,
                    next_action_note: nextActionNote
                })
                .eq('id', selectedLead.id);

            if (error) throw error;
            toast.success('Agenda actualizada');

            // Update parent state
            if (onLeadUpdate) {
                onLeadUpdate({
                    ...selectedLead,
                    next_action_date: finalTimestamp,
                    next_action_note: nextActionNote
                });
            }

            // Clear Note Input only (keep date for context or clear if desired? User said "mensaje")
            setNextActionNote('');

        } catch (error) {
            console.error('Error saving action:', error);
            toast.error('Error al guardar agenda');
        } finally {
            setIsSavingAction(false);
        }
    };


    // Fetch User & Signatures
    useEffect(() => {
        const initData = async () => {
            const supabase = createClient();

            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            // 2. Chat Author Auto-set
            if (user?.email) {
                if (user.email.includes('gaston') || user.email.includes('colocolo')) {
                    setChatAuthor('Gaston');
                } else {
                    setChatAuthor('Yo');
                }
            }

            // 3. Get Signatures
            const { data } = await supabase.from('email_signatures').select('*').order('is_default', { ascending: false });
            if (data && data.length > 0) {
                setSignatures(data);

                // Smart Selection based on User
                let defaultSig;
                if (user?.email) {
                    if (user.email.includes('gaston')) {
                        defaultSig = data.find((s: any) => s.label.toLowerCase().includes('gastón'));
                    } else if (user.email.includes('gonzalez') || user.email.includes('dgonz')) {
                        defaultSig = data.find((s: any) => s.label.toLowerCase().includes('daniel'));
                    }
                }

                setSelectedSignature(defaultSig || data.find((s: any) => s.is_default) || data[0]);
            }
        };
        initData();
    }, []);

    const getFullEmailBody = () => {
        if (!aiTemplate.content) return '';
        // Simulating HTML to Text conversion for mailto (basic)
        const signatureText = selectedSignature ? `\n\n${selectedSignature.label}\n${selectedSignature.content.replace(/<[^>]*>?/gm, '')}` : '';
        return `${aiTemplate.content}${signatureText}`;
    }

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
                        {/* Demo URL - PROMINENT SECTION (ISOLATED EDITING) */}
                        <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${isEditingUrl ? (isDark ? 'bg-purple-900/10 border-purple-500/30 ring-1 ring-purple-500/30' : 'bg-purple-50 border-purple-400 ring-1 ring-purple-200') : (isDark ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200')}`}>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                    <Zap className="w-3 h-3" /> Landing de Prospecto
                                </span>
                                {!isEditingUrl && !isEditingContact && (
                                    <button
                                        onClick={() => {
                                            setEditData({
                                                email: ld.email || '',
                                                whatsapp: ld.whatsapp || '',
                                                telefono: ld.phone || '',
                                                demo_url: ld.demo_url || ''
                                            });
                                            setIsEditingUrl(true);
                                        }}
                                        className={`text-[9px] font-bold uppercase px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors`}
                                    >
                                        Editar URL
                                    </button>
                                )}
                            </div>

                            {/* Content or Edit Form */}
                            {isEditingUrl ? (
                                <div className="animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex gap-2">
                                        <input
                                            value={editData.demo_url}
                                            onChange={(e) => setEditData({ ...editData, demo_url: e.target.value })}
                                            className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none transition-colors font-mono ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-purple-500' : 'bg-white border-purple-300 text-purple-900 focus:border-purple-500'}`}
                                            placeholder="https://hojacero.com/prospectos/ejemplo"
                                            autoFocus
                                        />
                                        <button
                                            disabled={isSaving}
                                            onClick={async () => {
                                                await onSaveContact();
                                                setIsEditingUrl(false);
                                            }}
                                            className="px-3 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-colors disabled:opacity-50"
                                            title="Guardar"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => setIsEditingUrl(false)}
                                            className={`px-3 py-2 rounded-xl border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500'}`}
                                            title="Cancelar"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className={`text-[10px] mt-2 italic ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                        Ingresa la URL completa donde está alojada la landing (ej: https://hojacero.com/prospectos/tienda).
                                    </p>
                                </div>
                            ) : (
                                selectedLead.demo_url ? (
                                    <div className="flex items-center gap-2">
                                        <div className={`flex-1 p-2 rounded-lg text-xs font-mono truncate border ${isDark ? 'bg-black/30 border-purple-500/30 text-purple-200' : 'bg-white border-purple-200 text-purple-700'}`}>
                                            {selectedLead.demo_url}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedLead.demo_url, 'demo_url')}
                                            className={`p-2 rounded-lg transition-colors border ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                                            title="Copiar URL"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={selectedLead.demo_url}
                                            target="_blank"
                                            className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-colors shadow-lg shadow-purple-500/20 border border-purple-400"
                                            title="Abrir Landing"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className={`text-xs italic text-center py-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                        Sin URL de prospecto asignada
                                    </div>
                                )
                            )}
                        </div>

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
                                    alert('Link del Demo copiado');
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

                    {/* COMMUNICATION HUB */}
                    <div className={`mt-6 rounded-2xl border overflow-hidden transition-all ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                        {/* Channel Tabs */}
                        <div className="flex border-b border-white/5">
                            <button
                                onClick={() => setActiveChannel('whatsapp')}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeChannel === 'whatsapp'
                                    ? (isDark ? 'bg-green-500/10 text-green-400 border-b-2 border-green-500' : 'bg-green-50 text-green-600 border-b-2 border-green-500')
                                    : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600')
                                    }`}
                            >
                                <MessageCircle className="w-4 h-4" /> WhatsApp (Nudge)
                            </button>
                            <button
                                onClick={() => setActiveChannel('email')}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeChannel === 'email'
                                    ? (isDark ? 'bg-blue-500/10 text-blue-400 border-b-2 border-blue-500' : 'bg-blue-50 text-blue-600 border-b-2 border-blue-500')
                                    : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-400 hover:text-gray-600')
                                    }`}
                            >
                                <Mail className="w-4 h-4" /> Cold Email
                            </button>
                        </div>

                        {/* Channel Content */}
                        <div className="p-5">
                            {activeChannel === 'whatsapp' && (
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
                            )}

                            {activeChannel === 'email' && (
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
                                                            <div className="flex gap-2 px-2 pb-2">
                                                                {(selectedLead.pdf_url || selectedLead.source_data?.pdf_url) && (
                                                                    <button
                                                                        onClick={() => setAiTemplate({ ...aiTemplate, content: aiTemplate.content + `\n\n📄 Ver Reporte Estratégico: ${selectedLead.pdf_url || selectedLead.source_data?.pdf_url}` })}
                                                                        className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition-opacity ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" /> Insertar Link PDF
                                                                    </button>
                                                                )}
                                                                {(selectedLead.demo_url || selectedLead.source_data?.demo_url) && (
                                                                    <button
                                                                        onClick={() => setAiTemplate({ ...aiTemplate, content: aiTemplate.content + `\n\n🔗 Ver Demo Propuesto: ${selectedLead.demo_url || selectedLead.source_data?.demo_url}` })}
                                                                        className={`text-[10px] px-2 py-1 rounded border flex items-center gap-1 hover:opacity-80 transition-opacity ${isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-600 border-pink-200'}`}
                                                                    >
                                                                        <LinkIcon className="w-3 h-3" /> Insertar Link Demo
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 justify-end pt-2 border-t border-dashed border-white/10">
                                                                <button
                                                                    onClick={() => copyToClipboard(getFullEmailBody(), 'email-msg')}
                                                                    className={`p-2 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:bg-white/5 hover:text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                                                                >
                                                                    {copiedField === 'email-msg' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                                </button>
                                                                {selectedLead.email ? (
                                                                    <a
                                                                        href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(getFullEmailBody())}`}
                                                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                                                    >
                                                                        <Mail className="w-4 h-4" /> Abrir Cliente de Correo
                                                                    </a>
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
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center bg-zinc-900/20 rounded-3xl border border-white/5 border-dashed">
                    <p className="text-zinc-700 text-[10px] font-medium uppercase tracking-widest">Estrategia Pendiente</p>
                </div>
            )}

            {/* AGENDA / FOLLOW-UP */}
            <div className={`mt-6 p-5 rounded-xl border ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Agenda de Seguimiento</h3>
                    </div>
                    {dateInput && (
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${new Date(dateInput + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0))
                            ? 'bg-red-500/20 text-red-500' // Vencido
                            : dateInput === new Date().toLocaleDateString('sv').split('T')[0] // 'sv' locale matches YYYY-MM-DD usually, or better use manual ISO
                                ? 'bg-amber-500/20 text-amber-500' // Hoy
                                : 'bg-green-500/20 text-green-500' // Futuro
                            }`}>
                            {new Date(dateInput + 'T12:00:00').toLocaleDateString()}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        {/* Quick Dates */}
                        {[
                            { label: 'Para Hoy', days: 0 },
                            { label: 'Mañana', days: 1 },
                            { label: 'Próx. Lunes', days: (1 + 7 - new Date().getDay()) % 7 || 7 } // Next Monday
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                onClick={() => {
                                    const d = new Date();
                                    d.setDate(d.getDate() + opt.days);
                                    setDateInput(d.toISOString().split('T')[0]);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${isDark
                                    ? 'bg-zinc-900 border-white/10 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400'
                                    : 'bg-gray-50 border-gray-200 hover:border-amber-500 hover:text-amber-600 text-gray-600'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                        <input
                            type="date"
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-1 focus:ring-amber-500/50 ${isDark
                                ? 'bg-zinc-900 border-white/10 text-white'
                                : 'bg-white border-gray-200 text-gray-900'}`}
                        />
                        <input
                            type="time"
                            value={timeInput}
                            onChange={(e) => setTimeInput(e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-1 focus:ring-amber-500/50 w-[80px] ${isDark
                                ? 'bg-zinc-900 border-white/10 text-white'
                                : 'bg-white border-gray-200 text-gray-900'}`}
                        />
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={nextActionNote}
                            onChange={(e) => setNextActionNote(e.target.value)}
                            placeholder="Nota para la acción (ej. Llamar para cerrar)"
                            className={`flex-1 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1 focus:ring-amber-500/50 ${isDark
                                ? 'bg-black/20 border-white/10 text-white placeholder:text-zinc-600'
                                : 'bg-white border-gray-200 text-gray-900'}`}
                        />
                        <button
                            onClick={handleSaveAction}
                            disabled={isSavingAction}
                            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center gap-2 transition-all ${isDark
                                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                                } disabled:opacity-50`}
                        >
                            {isSavingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSavingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar
                        </button>
                    </div>
                </div>

                {/* CURRENT AGENDA SUMMARY (PREMIUM CALENDAR CARD) */}
                {selectedLead.next_action_date && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                        <div className={`p-0 rounded-2xl border overflow-hidden relative group ${isDark ? 'bg-zinc-900/40 border-amber-500/20' : 'bg-white border-amber-200'}`}>
                            {/* Accent Bar */}
                            <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>

                            <div className="p-4 pl-5 flex items-center justify-between gap-4">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                            Próximo Evento
                                        </div>
                                    </div>

                                    <h3 className={`text-sm font-bold leading-tight truncate pr-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedLead.next_action_note || "Sin nota descriptiva"}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                        <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {new Date(selectedLead.next_action_date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <div className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center min-w-[70px] border ${isDark ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                        {new Date(selectedLead.next_action_date).toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')}
                                    </span>
                                    <span className={`text-2xl font-bold leading-none my-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {new Date(selectedLead.next_action_date).getDate()}
                                    </span>
                                    <span className={`text-[9px] uppercase ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                        {new Date(selectedLead.next_action_date).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* BITÁCORA / CHAT INTERNO */}
            <div className={`mt-6 p-5 rounded-xl border flex flex-col h-[400px] ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageSquare className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Bitácora / Chat Interno</h3>
                    </div>
                    <div className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-black/40 border-white/10 text-zinc-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                        {chatMessages.length} mensajes
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar flex flex-col-reverse">
                    {/* Reverse map to show newest at bottom if using flex-col, but usually we map normal and scroll to bottom. 
                        Let's use flex-col-reverse and reverse the array to stick to bottom. */}
                    {[...chatMessages].reverse().map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.author === 'Yo' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-end gap-2 max-w-[85%]">
                                {msg.author !== 'Yo' && (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${msg.author === 'Sistema' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' :
                                        'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' // Gaston
                                        }`}>
                                        {msg.author.charAt(0)}
                                    </div>
                                )}

                                <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.author === 'Yo'
                                    ? (isDark ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-none' : 'bg-blue-600 text-white rounded-tr-none')
                                    : msg.author === 'Sistema'
                                        ? (isDark ? 'bg-zinc-900/50 border border-white/5 text-zinc-400 text-xs italic' : 'bg-gray-100 text-gray-500 text-xs italic')
                                        : (isDark ? 'bg-white/5 border border-white/10 text-zinc-300 rounded-tl-none' : 'bg-white border-gray-200 text-gray-800 rounded-tl-none')
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                            <span className={`text-[9px] mt-1 px-1 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {msg.author}
                            </span>
                        </div>
                    ))}
                    {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-2 opacity-50">
                            <MessageSquare className="w-8 h-8" />
                            <p className="text-xs">No hay mensajes en la bitácora</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={onSendChatMessage} className="shrink-0 pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                        <div className="flex flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => setChatAuthor('Yo')}
                                className={`h-8 px-2 rounded-lg text-[10px] font-bold border transition-all ${chatAuthor === 'Yo' ? (isDark ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-blue-100 border-blue-300 text-blue-600') : (isDark ? 'bg-white/5 border-transparent text-zinc-500 hover:text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-500')}`}
                            >
                                YO
                            </button>
                            <button
                                type="button"
                                onClick={() => setChatAuthor('Gaston')}
                                className={`h-8 px-2 rounded-lg text-[10px] font-bold border transition-all ${chatAuthor === 'Gaston' ? (isDark ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-purple-100 border-purple-300 text-purple-600') : (isDark ? 'bg-white/5 border-transparent text-zinc-500 hover:text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-500')}`}
                            >
                                GS
                            </button>
                        </div>
                        <div className="flex-1 relative">
                            <input
                                value={newChatMessage}
                                onChange={(e) => setNewChatMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className={`w-full h-full rounded-xl pl-4 pr-12 text-sm outline-none border transition-all ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-white/30 placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-400 placeholder:text-gray-400'}`}
                            />
                            <button
                                type="submit"
                                disabled={!newChatMessage.trim()}
                                className={`absolute right-1 top-1 bottom-1 aspect-square rounded-lg flex items-center justify-center transition-all ${newChatMessage.trim() ? (isDark ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-blue-600 text-white hover:bg-blue-500') : (isDark ? 'bg-white/5 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
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
            {/* REPORT BUILDER MODAL */}
            <ReportBuilderModal
                isOpen={isReportBuilderOpen}
                onClose={() => setIsReportBuilderOpen(false)}
                lead={selectedLead}
                isDark={isDark}
                onSaveSuccess={(url) => {
                    // Update immediate scope
                    if (onLeadUpdate) {
                        onLeadUpdate({ ...selectedLead, pdf_url: url });
                    }
                }}
            />
        </div>
    );
};
