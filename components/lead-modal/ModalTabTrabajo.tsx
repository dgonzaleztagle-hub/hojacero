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

import { getLeadData } from '@/utils/radar-helpers';
import { ChatMessage } from '@/hooks/useRadar';

// ... interface updates ...
interface ModalTabTrabajoProps {
    selectedLead: any;
    ld: any;
    isDark: boolean;
    analysis: any;
    // Contact editing
    isEditingContact: boolean;
    editData: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string };
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
    // Activity
    leadActivities: any[];
    // Utils
    copyToClipboard: (text: string, field: string) => void;
    copiedField: string | null;
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
    // Nav State
    const [activeSubTab, setActiveSubTab] = useState<'comms' | 'activo' | 'seguimiento' | 'datos'>('comms');

    // Report Logic
    const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

    // AI Template State
    const [aiTemplate, setAiTemplate] = useState<{ content: string; type: 'whatsapp' | 'email' | null }>({ content: '', type: null });
    const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

    const generateTemplate = async (lead: any, type: 'whatsapp' | 'email') => {
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
        } catch (err) {
            toast.error('Error generando plantilla');
        } finally {
            setIsGeneratingTemplate(false);
        }
    };

    // Communication Hub State
    const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email'>('whatsapp');
    const [emailSubject, setEmailSubject] = useState('');
    const [signatures, setSignatures] = useState<any[]>([]);
    const [selectedSignature, setSelectedSignature] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Agenda State
    const initialDate = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
    const [dateInput, setDateInput] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
    const [timeInput, setTimeInput] = useState(initialDate ? initialDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');
    const [nextActionNote, setNextActionNote] = useState(selectedLead.next_action_note || '');
    const [isSavingAction, setIsSavingAction] = useState(false);
    const prevLeadIdRef = useRef(selectedLead.id);

    // Email Sending State
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [attachments, setAttachments] = useState<{ filename: string; path: string }[]>([]);

    // Effects & Handlers (Kept same logic)
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
            let finalTimestamp = null;
            if (dateInput) {
                const combined = new Date(`${dateInput}T${timeInput || '09:00'}:00`);
                finalTimestamp = combined.toISOString();
            }
            const { error } = await supabase.from('leads').update({
                next_action_date: finalTimestamp,
                next_action_note: nextActionNote
            }).eq('id', selectedLead.id);
            if (error) throw error;
            toast.success('Agenda actualizada');
            if (onLeadUpdate) onLeadUpdate({ ...selectedLead, next_action_date: finalTimestamp, next_action_note: nextActionNote });
            setNextActionNote('');
        } catch (error) {
            toast.error('Error al guardar agenda');
        } finally {
            setIsSavingAction(false);
        }
    };

    useEffect(() => {
        const initData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            if (user?.email) {
                setChatAuthor(user.email.includes('gaston') || user.email.includes('colocolo') ? 'Gaston' : 'Yo');
            }
            const { data } = await supabase.from('email_signatures').select('*').order('is_default', { ascending: false });
            if (data && data.length > 0) {
                setSignatures(data);
                let defaultSig;
                if (user?.email) {
                    if (user.email.includes('gaston')) defaultSig = data.find((s: any) => s.label.toLowerCase().includes('gastón'));
                    else if (user.email.includes('gonzalez') || user.email.includes('daniel')) defaultSig = data.find((s: any) => s.label.toLowerCase().includes('daniel'));
                }
                setSelectedSignature(defaultSig || data.find((s: any) => s.is_default) || data[0]);
            }
        };
        initData();
    }, []);

    const getFullEmailBody = () => {
        if (!aiTemplate.content) return '';
        const signatureText = selectedSignature ? `\n\n${selectedSignature.label}\n${selectedSignature.content.replace(/<[^>]*>?/gm, '')}` : '';
        return `${aiTemplate.content}${signatureText}`;
    }

    const handleSendEmail = async () => {
        if (!selectedLead.email) return toast.error('No hay email destinatario');
        if (!emailSubject) return toast.error('Falta el asunto');
        if (!aiTemplate.content) return toast.error('El contenido está vacío');
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
                lead_id: selectedLead.id || selectedLead.db_id,
                author: 'Yo',
                message: `📧 EMAIL ENVIADO: ${emailSubject}\n\n${aiTemplate.content.substring(0, 100)}...${attachments.length > 0 ? `\n📎 Adjuntos: ${attachments.length}` : ''}`,
                created_at: new Date().toISOString()
            });
            setAttachments([]);
            setAiTemplate({ content: '', type: null });
        } catch (e) {
            toast.error('Error al enviar el email');
        } finally {
            setIsSendingEmail(false);
        }
    };

    // TAB COMPONENTS MAP
    return (
        <div className="flex flex-col h-full min-h-[500px]">
            {/* TABS HEADER */}
            <div className={`flex border-b mb-6 ${isDark ? 'border-white/10' : 'border-zinc-200'}`}>
                <button
                    onClick={() => setActiveSubTab('comms')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'comms' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    💬 Comunicación
                </button>
                <button
                    onClick={() => setActiveSubTab('activo')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'activo' ? 'border-amber-500 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    ⚡ Activo / Demo
                </button>
                <button
                    onClick={() => setActiveSubTab('seguimiento')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'seguimiento' ? 'border-purple-500 text-purple-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    📅 Seguimiento
                </button>
                <button
                    onClick={() => setActiveSubTab('datos')}
                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeSubTab === 'datos' ? 'border-zinc-500 text-zinc-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                    ℹ️ Datos
                </button>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-1 overflow-hidden flex flex-col">

                {/* 1. COMMS HUB */}
                {activeSubTab === 'comms' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
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
                    </div>
                )}

                {/* 2. ACTIVO / DEMO */}
                {activeSubTab === 'activo' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <StrategyDisplay
                            analysis={analysis}
                            isDark={isDark}
                            selectedLead={selectedLead}
                            setIsReportBuilderOpen={setIsReportBuilderOpen}
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

                {/* 4. DATOS (Contact Card) */}
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

            </div>
        </div>
    );
};
