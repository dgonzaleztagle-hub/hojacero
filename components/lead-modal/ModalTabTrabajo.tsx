'use client';

import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mail, MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ReportBuilderModal } from '../report/ReportBuilderModal';
import { toast } from 'sonner';

// Sub-components
import { ContactCard } from './trabajo/ContactCard';
import { StrategyDisplay } from './trabajo/StrategyDisplay';
import { WhatsappPanel } from './trabajo/WhatsappPanel';
import { EmailComposer } from './trabajo/EmailComposer';
import { AgendaPanel } from './trabajo/AgendaPanel';
import { ChatSystem } from './trabajo/ChatSystem';
import { ActivityList } from './trabajo/ActivityList';
import { TrackingPanel } from './trabajo/TrackingPanel';
import { AssetVault } from './trabajo/AssetVault';
import { IntelligenceLog } from './trabajo/IntelligenceLog';
import { getLeadData } from '@/utils/radar-helpers';
import { ChatMessage } from '@/hooks/useRadar';
import { Brain, HardDrive } from 'lucide-react';

type LeadRecord = {
    id?: string;
    db_id?: string;
    email?: string;
    telefono?: string;
    whatsapp?: string;
    nombre_contacto?: string;
    pipeline_stage?: string;
    estado?: string;
    next_action_date?: string | null;
    next_action_note?: string;
    demo_url?: string;
    url?: string;
    nombre?: string;
    source_data?: {
        analysis?: unknown;
        assets?: unknown[];
        intelligence_log?: unknown[];
        [key: string]: unknown;
    };
    [key: string]: unknown;
};

type LeadDetails = Record<string, unknown>;

type EmailSignature = {
    id?: string;
    label: string;
    content: string;
    is_default?: boolean;
};

interface ModalTabTrabajoProps {
    selectedLead: LeadRecord;
    ld: LeadDetails;
    isDark: boolean;
    analysis: Record<string, unknown>;
    isEditingContact: boolean;
    editData: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string };
    setEditData: (data: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string }) => void;
    setIsEditingContact: (val: boolean) => void;
    onSaveContact: () => Promise<void> | void;
    isSaving: boolean;
    onLeadUpdate?: (lead: LeadRecord) => void;
    chatMessages: ChatMessage[];
    newChatMessage: string;
    setNewChatMessage: (val: string) => void;
    chatAuthor: 'Yo' | 'Gaston';
    setChatAuthor: (val: 'Yo' | 'Gaston') => void;
    onSendChatMessage: (e?: React.FormEvent) => Promise<void> | void;
    leadActivities: Array<Record<string, unknown>>;
    copyToClipboard: (text: string, field: string) => void;
    copiedField: string | null;
}

type TrabajoSubTab = 'datos' | 'comms' | 'seguimiento' | 'activo' | 'investigacion' | 'assets';

const getDefaultTrabajoSubTab = (lead: LeadRecord): TrabajoSubTab => {
    const hasContactInfo = Boolean(
        lead?.email ||
        lead?.telefono ||
        lead?.whatsapp ||
        lead?.nombre_contacto
    );
    if (!hasContactInfo) return 'datos';

    const stage = String(lead?.pipeline_stage || '').toLowerCase();
    const state = String(lead?.estado || '').toLowerCase();

    if (['contactado', 'negociacion', 'archived'].includes(stage) || ['in_contact', 'meeting_scheduled'].includes(state)) {
        return 'seguimiento';
    }
    if (['proposal_sent', 'negotiation'].includes(state)) {
        return 'activo';
    }
    if (stage === 'radar' || state === 'ready_to_contact' || state === 'detected') {
        return 'comms';
    }
    return 'comms';
};

const getRecommendedTrabajoAction = (lead: LeadRecord): {
    label: string;
    detail: string;
    tab: TrabajoSubTab;
    channel?: 'whatsapp' | 'email';
} => {
    const hasContactInfo = Boolean(
        lead?.email ||
        lead?.telefono ||
        lead?.whatsapp ||
        lead?.nombre_contacto
    );

    if (!hasContactInfo) {
        return {
            label: 'Completar datos de contacto',
            detail: 'Sin contacto operativo no se puede iniciar outreach.',
            tab: 'datos'
        };
    }

    const state = String(lead?.estado || '').toLowerCase();
    const hasFollowUp = Boolean(lead?.next_action_date);

    if (state !== 'in_contact' && state !== 'meeting_scheduled') {
        return {
            label: 'Iniciar contacto por WhatsApp',
            detail: 'Primer toque para mover el lead a conversación activa.',
            tab: 'comms',
            channel: 'whatsapp'
        };
    }

    if (!hasFollowUp) {
        return {
            label: 'Programar siguiente acción',
            detail: 'Define fecha y nota para no perder continuidad.',
            tab: 'seguimiento'
        };
    }

    return {
        label: 'Actualizar activo comercial',
        detail: 'Revisa demo, tracking y recursos de cierre.',
        tab: 'activo'
    };
};

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
    chatMessages,
    newChatMessage,
    setNewChatMessage,
    chatAuthor,
    setChatAuthor,
    onSendChatMessage,
    leadActivities,
    copyToClipboard,
    copiedField,
    onLeadUpdate
}: ModalTabTrabajoProps) => {
    const leadId = selectedLead.id || selectedLead.db_id || '';
    // Nav State
    const [activeSubTab, setActiveSubTab] = useState<TrabajoSubTab>(getDefaultTrabajoSubTab(selectedLead));

    // Report Logic
    const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

    // AI Template State
    const [aiTemplate, setAiTemplate] = useState<{ content: string; type: 'whatsapp' | 'email' | null }>({ content: '', type: null });
    const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

    const generateTemplate = async (lead: LeadRecord, type: 'whatsapp' | 'email') => {
        setIsGeneratingTemplate(true);
        setAiTemplate({ content: '', type });
        try {
            const leadData = getLeadData(lead);
            const res = await fetch('/api/radar/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadData: { ...leadData, analysis: lead.source_data?.analysis || lead.analysis },
                    type,
                    author: chatAuthor
                })
            });
            const data = await res.json();
            if (data.success) setAiTemplate({ content: data.message, type });
        } catch {
            toast.error('Error generando plantilla');
        } finally {
            setIsGeneratingTemplate(false);
        }
    };

    // Communication Hub State
    const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
    const [commsStep, setCommsStep] = useState<1 | 2 | 3>(1);
    const [emailSubject, setEmailSubject] = useState('');
    const [signatures, setSignatures] = useState<EmailSignature[]>([]);
    const [selectedSignature, setSelectedSignature] = useState<EmailSignature | null>(null);

    // Agenda State
    const initialDate = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
    const [dateInput, setDateInput] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
    const [timeInput, setTimeInput] = useState(initialDate ? initialDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');
    const [nextActionNote, setNextActionNote] = useState(selectedLead.next_action_note || '');
    const [isSavingAction, setIsSavingAction] = useState(false);
    const prevLeadIdRef = useRef(leadId);

    // Email Sending State
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [attachments, setAttachments] = useState<{ filename: string; path: string }[]>([]);
    const recommendedAction = getRecommendedTrabajoAction(selectedLead);
    const trackingProspecto =
        (selectedLead.demo_url?.split('/').pop()) ||
        (selectedLead.url?.split('/').pop()) ||
        selectedLead.nombre?.toLowerCase().replace(/ /g, '-') ||
        'lead';
    const hasDraftForChannel = Boolean(
        aiTemplate.content?.trim() &&
        aiTemplate.type === activeChannel
    );

    // Effects & Handlers (Kept same logic)
    useEffect(() => {
        if (leadId !== prevLeadIdRef.current) {
            const d = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
            setDateInput(d ? d.toISOString().split('T')[0] : '');
            setTimeInput(d ? d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');
            setNextActionNote(selectedLead.next_action_note || '');
            setAiTemplate({ content: '', type: null });
            setEmailSubject('');
            setAttachments([]);
            setActiveSubTab(getDefaultTrabajoSubTab(selectedLead));
            setCommsStep(1);
            prevLeadIdRef.current = leadId;
        }
    }, [leadId, selectedLead, selectedLead.next_action_date, selectedLead.next_action_note]);

    useEffect(() => {
        setCommsStep(1);
    }, [activeChannel]);

    useEffect(() => {
        if (aiTemplate.content?.trim() && aiTemplate.type === activeChannel) {
            setCommsStep(2);
        }
    }, [aiTemplate.content, aiTemplate.type, activeChannel]);

    const handleSaveAction = async () => {
        try {
            setIsSavingAction(true);
            const supabase = createClient();
            let finalTimestamp = null;
            if (dateInput) {
                const combined = new Date(`${dateInput}T${timeInput || '09:00'}:00`);
                finalTimestamp = combined.toISOString();
            }
            const { error } = await supabase.from('leads').update({
                next_action_date: finalTimestamp,
                next_action_note: nextActionNote
            }).eq('id', leadId);
            if (error) throw error;
            toast.success('Agenda actualizada');
            if (onLeadUpdate) onLeadUpdate({ ...selectedLead, next_action_date: finalTimestamp, next_action_note: nextActionNote });
            setNextActionNote('');
        } catch {
            toast.error('Error al guardar agenda');
        } finally {
            setIsSavingAction(false);
        }
    };

    const handleContactSuccess = async () => {
        // Optimistic refresh
        if (onLeadUpdate) {
            onLeadUpdate({
                ...selectedLead,
                pipeline_stage: 'contactado',
                estado: 'in_contact'
            });
        }
        // Force server sync
        try {
            const supabase = createClient();
            await supabase.from('leads').update({
                pipeline_stage: 'contactado',
                estado: 'in_contact',
                last_activity_at: new Date().toISOString()
            }).eq('id', leadId);
            toast.success('Lead movido a Contactado');
            if (onLeadUpdate) {
                onLeadUpdate({
                    ...selectedLead,
                    pipeline_stage: 'contactado',
                    estado: 'in_contact',
                    last_activity_at: new Date().toISOString()
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const initData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setChatAuthor(user.email.includes('gaston') || user.email.includes('colocolo') ? 'Gaston' : 'Yo');
            }
            const { data } = await supabase.from('email_signatures').select('*').order('is_default', { ascending: false });
            if (data && data.length > 0) {
                const signatureRows = data as EmailSignature[];
                setSignatures(signatureRows);
                let defaultSig: EmailSignature | undefined;
                if (user?.email) {
                    if (user.email.includes('gaston')) defaultSig = signatureRows.find((s) => s.label.toLowerCase().includes('gastón'));
                    else if (user.email.includes('gonzalez') || user.email.includes('daniel')) defaultSig = signatureRows.find((s) => s.label.toLowerCase().includes('daniel'));
                }
                setSelectedSignature(defaultSig || signatureRows.find((s) => s.is_default) || signatureRows[0]);
            }
        };
        initData();
    }, [setChatAuthor]);

    const getFullEmailBody = () => {
        if (!aiTemplate.content) return '';
        const signatureText = selectedSignature ? `\n\n${selectedSignature.label}\n${selectedSignature.content.replace(/<[^>]*>?/gm, '')}` : '';
        return `${aiTemplate.content}${signatureText}`;
    }

    const handleSendEmail = async () => {
        if (!selectedLead.email) {
            toast.error('No hay email destinatario');
            return;
        }
        if (!emailSubject) {
            toast.error('Falta el asunto');
            return;
        }
        if (!aiTemplate.content) {
            toast.error('El contenido está vacío');
            return;
        }
        setIsSendingEmail(true);
        try {
            const bodyHtml = aiTemplate.content.replace(/\n/g, '<br/>') + (selectedSignature ? `<br/><br/>${selectedSignature.content}` : '');
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedLead.email,
                    subject: emailSubject,
                    html: bodyHtml,
                    text: aiTemplate.content,
                    attachments: attachments
                })
            });
            if (!res.ok) throw new Error('Error enviando email');
            toast.success('Email enviado correctamente');
            const supabase = createClient();
            await supabase.from('bitacora_clientes').insert({
                lead_id: leadId,
                author: 'Yo',
                message: `📧 EMAIL ENVIADO: ${emailSubject}\n\n${aiTemplate.content.substring(0, 100)}...${attachments.length > 0 ? `\n📎 Adjuntos: ${attachments.length}` : ''}`,
                created_at: new Date().toISOString()
            });
            setAttachments([]);
            setAiTemplate({ content: '', type: null });
            handleContactSuccess();
        } catch {
            toast.error('Error al enviar el email');
        } finally {
            setIsSendingEmail(false);
        }
    };

    // TAB COMPONENTS MAP
    return (
        <div className="flex flex-col h-full min-h-[500px]">
            <div className={`mb-4 p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Siguiente Paso</p>
                    <p className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{recommendedAction.label}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{recommendedAction.detail}</p>
                </div>
                <button
                    onClick={() => {
                        setActiveSubTab(recommendedAction.tab);
                        if (recommendedAction.tab === 'comms' && recommendedAction.channel) {
                            setActiveChannel(recommendedAction.channel);
                        }
                    }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20' : 'bg-white border-cyan-300 text-cyan-700 hover:bg-cyan-100'}`}
                >
                    Ir ahora
                </button>
            </div>

            {/* TABS HEADER */}
            <div className="md:hidden mb-3">
                <select
                    value={activeSubTab}
                    onChange={(e) => setActiveSubTab(e.target.value as TrabajoSubTab)}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${isDark ? 'bg-zinc-900 border-white/10 text-zinc-200' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                    <option value="datos">Datos</option>
                    <option value="comms">Contacto</option>
                    <option value="seguimiento">Seguimiento</option>
                    <option value="activo">Activo / Demo</option>
                    <option value="investigacion">Inteligencia</option>
                    <option value="assets">Activos</option>
                </select>
            </div>

            <div className={`hidden md:flex border-b mb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                <button
                    onClick={() => setActiveSubTab('datos')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'datos' ? 'border-zinc-500 text-zinc-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    ℹ Datos
                </button>
                <button
                    onClick={() => setActiveSubTab('comms')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'comms' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    💬 Contacto
                </button>
                <button
                    onClick={() => setActiveSubTab('seguimiento')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'seguimiento' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    📅 Seguimiento
                </button>
                <button
                    onClick={() => setActiveSubTab('activo')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'activo' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    ⚡ Activo / Demo
                </button>
                <button
                    onClick={() => setActiveSubTab('investigacion')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'investigacion' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Brain className="w-4 h-4 inline mr-2" /> Inteligencia
                </button>
                <button
                    onClick={() => setActiveSubTab('assets')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'assets' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    <HardDrive className="w-4 h-4 inline mr-2" /> Activos
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-hidden flex flex-col">

                {/* 1. DATOS (Contact Card) */}
                {activeSubTab === 'datos' && (
                    <div className="animate-in fade-in duration-300">
                        <ContactCard
                            selectedLead={selectedLead}
                            ld={ld}
                            isDark={isDark}
                            isEditingContact={isEditingContact}
                            setIsEditingContact={setIsEditingContact}
                            editData={editData}
                            setEditData={setEditData}
                            onSaveContact={onSaveContact}
                            isSaving={isSaving}
                            copyToClipboard={copyToClipboard}
                        />
                    </div>
                )}

                {/* 2. COMMS HUB */}
                {activeSubTab === 'comms' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className={`p-3 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>Wizard Contacto</p>
                                <span className={`text-[10px] font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Paso {commsStep}/3</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { step: 1 as const, label: 'Redactar' },
                                    { step: 2 as const, label: 'Enviar' },
                                    { step: 3 as const, label: 'Registrar' }
                                ].map((item) => (
                                    <button
                                        key={item.step}
                                        onClick={() => setCommsStep(item.step)}
                                        className={`px-2 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${commsStep === item.step
                                            ? (isDark ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700')
                                            : (isDark ? 'bg-black/30 border-white/10 text-zinc-500 hover:text-zinc-300' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700')
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Channel Switcher */}
                        <div className={`rounded-xl border flex overflow-hidden ${isDark ? 'border-white/10 bg-zinc-900/50' : 'border-zinc-200 bg-white'}`}>
                            <button
                                onClick={() => setActiveChannel('whatsapp')}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2 ${activeChannel === 'whatsapp' ? 'bg-green-500/10 text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                            <div className="w-[1px] bg-white/10"></div>
                            <button
                                onClick={() => setActiveChannel('email')}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase flex items-center justify-center gap-2 ${activeChannel === 'email' ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Mail className="w-4 h-4" /> Email
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-zinc-900/30' : 'border-zinc-200 bg-white'}`}>
                            {activeChannel === 'whatsapp' ? (
                                <WhatsappPanel
                                    aiTemplate={aiTemplate}
                                    setAiTemplate={setAiTemplate}
                                    onGenerateTemplate={generateTemplate}
                                    isGeneratingTemplate={isGeneratingTemplate}
                                    selectedLead={selectedLead}
                                    isDark={isDark}
                                    copyToClipboard={copyToClipboard}
                                    copiedField={copiedField}
                                />
                            ) : (
                                <EmailComposer
                                    selectedLead={selectedLead}
                                    isDark={isDark}
                                    analysis={analysis}
                                    emailSubject={emailSubject}
                                    setEmailSubject={setEmailSubject}
                                    signatures={signatures}
                                    selectedSignature={selectedSignature}
                                    setSelectedSignature={setSelectedSignature}
                                    aiTemplate={aiTemplate}
                                    setAiTemplate={setAiTemplate}
                                    isGeneratingTemplate={isGeneratingTemplate}
                                    onGenerateTemplate={generateTemplate}
                                    attachments={attachments}
                                    setAttachments={setAttachments}
                                    handleSendEmail={handleSendEmail}
                                    isSendingEmail={isSendingEmail}
                                    copyToClipboard={copyToClipboard}
                                    copiedField={copiedField}
                                    getFullEmailBody={getFullEmailBody}
                                />
                            )}
                        </div>

                        <div className={`p-3 rounded-xl border flex flex-wrap gap-2 justify-end ${isDark ? 'bg-black/30 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                            {commsStep === 1 && (
                                <button
                                    onClick={() => setCommsStep(2)}
                                    disabled={!hasDraftForChannel}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700'} disabled:opacity-40`}
                                >
                                    Siguiente: Enviar
                                </button>
                            )}
                            {commsStep === 2 && (
                                <button
                                    onClick={() => setCommsStep(3)}
                                    disabled={!hasDraftForChannel}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border ${isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700'} disabled:opacity-40`}
                                >
                                    Siguiente: Registrar
                                </button>
                            )}
                            {commsStep === 3 && (
                                <>
                                    <button
                                        onClick={() => {
                                            handleContactSuccess();
                                            setActiveSubTab('seguimiento');
                                        }}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border ${isDark ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-green-100 border-green-300 text-green-700'}`}
                                    >
                                        Marcar Contactado
                                    </button>
                                    <button
                                        onClick={() => setActiveSubTab('seguimiento')}
                                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-white border-gray-300 text-gray-700'}`}
                                    >
                                        Ir a Seguimiento
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. SEGUIMIENTO (Agenda + Bitacora) */}
                {activeSubTab === 'seguimiento' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <AgendaPanel
                            selectedLead={selectedLead}
                            isDark={isDark}
                            dateInput={dateInput}
                            setDateInput={setDateInput}
                            timeInput={timeInput}
                            setTimeInput={setTimeInput}
                            nextActionNote={nextActionNote}
                            setNextActionNote={setNextActionNote}
                            handleSaveAction={handleSaveAction}
                            isSavingAction={isSavingAction}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ChatSystem
                                chatMessages={chatMessages}
                                newChatMessage={newChatMessage}
                                setNewChatMessage={setNewChatMessage}
                                chatAuthor={chatAuthor}
                                setChatAuthor={setChatAuthor}
                                onSendChatMessage={onSendChatMessage}
                                isDark={isDark}
                            />

                            <ActivityList
                                leadActivities={leadActivities}
                                isDark={isDark}
                            />
                        </div>
                    </div>
                )}

                {/* 4. ACTIVO / DEMO */}
                {activeSubTab === 'activo' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <StrategyDisplay
                            analysis={analysis}
                            isDark={isDark}
                            selectedLead={selectedLead}
                            setIsReportBuilderOpen={setIsReportBuilderOpen}
                        />

                        {/* Tracking Hub */}
                        <TrackingPanel
                            prospecto={trackingProspecto}
                            isDark={isDark}
                        />

                        <ReportBuilderModal
                            isOpen={isReportBuilderOpen}
                            onClose={() => setIsReportBuilderOpen(false)}
                            lead={selectedLead}
                            isDark={isDark}
                            onSaveSuccess={(url) => { if (onLeadUpdate) onLeadUpdate({ ...selectedLead, pdf_url: url }); }}
                        />
                    </div>
                )}

                {/* 5. INTELLIGENCE LOG */}
                {activeSubTab === 'investigacion' && (
                    <div className="animate-in fade-in duration-300 overflow-y-auto">
                        <IntelligenceLog
                            leadId={leadId}
                            isDark={isDark}
                            initialNotes={selectedLead.source_data?.intelligence_log || []}
                        />
                    </div>
                )}

                {/* 6. ASSETS VAULT */}
                {activeSubTab === 'assets' && (
                    <div className="animate-in fade-in duration-300 overflow-y-auto">
                        <AssetVault
                            leadId={leadId}
                            isDark={isDark}
                            initialAssets={selectedLead.source_data?.assets || []}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};
