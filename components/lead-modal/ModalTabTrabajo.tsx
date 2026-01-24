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
    const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

    // Local Email/Template State (Resets on mount)
    const [aiTemplate, setAiTemplate] = useState<{ content: string; type: 'whatsapp' | 'email' | null }>({ content: '', type: null });
    const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

    const generateTemplate = async (lead: any, type: 'whatsapp' | 'email') => {
        setIsGeneratingTemplate(true);
        setAiTemplate({ content: '', type });
        try {
            // Use local getLeadData or imported helper
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
            if (data.success) {
                setAiTemplate({ content: data.message, type });
            }
        } catch (err) {
            console.error('Error generating template:', err);
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

    // Agenda / Follow-up State
    // Initialize split state for Date and Time
    const initialDate = selectedLead.next_action_date ? new Date(selectedLead.next_action_date) : null;
    const [dateInput, setDateInput] = useState(initialDate ? initialDate.toISOString().split('T')[0] : '');
    const [timeInput, setTimeInput] = useState(initialDate ? initialDate.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '09:00');

    const [nextActionNote, setNextActionNote] = useState(selectedLead.next_action_note || '');
    const [isSavingAction, setIsSavingAction] = useState(false);
    const prevLeadIdRef = useRef(selectedLead.id);

    // Chat & Email State
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [attachments, setAttachments] = useState<{ filename: string; path: string }[]>([]);

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

            // Clear Note Input only (keep date for context)
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
                    } else if (user.email.includes('gonzalez') || user.email.includes('dgonz') || user.email.includes('daniel')) {
                        defaultSig = data.find((s: any) => s.label.toLowerCase().includes('daniel')) || {
                            id: 'temp-daniel',
                            label: 'Daniel Default',
                            content: 'Daniel Gonzalez<br>Founder & Lead Architect<br>Hojacero.cl'
                        };
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

    const handleSendEmail = async () => {
        if (!selectedLead.email) return toast.error('No hay email destinatario');
        if (!emailSubject) return toast.error('Falta el asunto');
        if (!aiTemplate.content) return toast.error('El contenido está vacío');

        setIsSendingEmail(true);
        try {
            const bodyHtml = aiTemplate.content.replace(/\n/g, '<br/>') +
                (selectedSignature ? `<br/><br/>${selectedSignature.content}` : '');

            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedLead.email,
                    subject: emailSubject,
                    html: bodyHtml,
                    text: aiTemplate.content, // Fallback
                    attachments: attachments
                })
            });

            if (!res.ok) throw new Error('Error enviando email');

            toast.success('Email enviado correctamente');

            // Log to Bitacora
            const supabase = createClient();
            await supabase.from('bitacora_clientes').insert({
                lead_id: selectedLead.id || selectedLead.db_id,
                author: 'Yo', // Use 'Yo' to match chat messages
                message: `📧 EMAIL ENVIADO: ${emailSubject}\n\n${aiTemplate.content.substring(0, 100)}...${attachments.length > 0 ? `\n📎 Adjuntos: ${attachments.length}` : ''}`,
                created_at: new Date().toISOString()
            });

            // Clear
            setAttachments([]);
            setAiTemplate({ content: '', type: null });
            setActiveChannel('whatsapp'); // Reset or stay?

        } catch (e) {
            console.error(e);
            toast.error('Error al enviar el email');
        } finally {
            setIsSendingEmail(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* CONTACT DATA CARD */}
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

            {/* STRATEGY DISPLAY & DETAILS */}
            <StrategyDisplay
                analysis={analysis}
                isDark={isDark}
                selectedLead={selectedLead}
                setIsReportBuilderOpen={setIsReportBuilderOpen}
            />

            {/* COMMUNICATION HUB (Separated from Strategy Display for cleaner layout) */}
            <div className={`mt-2 rounded-2xl border overflow-hidden transition-all ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
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
                    )}

                    {activeChannel === 'email' && (
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

            {/* AGENDA / FOLLOW-UP */}
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

            {/* BITÁCORA / CHAT INTERNO */}
            <ChatSystem
                chatMessages={chatMessages}
                newChatMessage={newChatMessage}
                setNewChatMessage={setNewChatMessage}
                chatAuthor={chatAuthor}
                setChatAuthor={setChatAuthor}
                onSendChatMessage={onSendChatMessage}
                isDark={isDark}
            />

            {/* ACTIVITY LOG */}
            <ActivityList
                leadActivities={leadActivities}
                isDark={isDark}
            />

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
