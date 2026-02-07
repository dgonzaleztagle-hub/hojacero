import React, { useState, useEffect } from 'react';
import {
    X, Target, Zap, Search, Shield, ShieldOff, Globe, MapPin, Star, AlertCircle,
    Save, Copy, CheckCircle2, MessageCircle, Mail, Phone, Instagram, Facebook,
    Trash2, ExternalLink, Activity, FileText, ChevronRight, Loader2, CreditCard, ShieldAlert,
    Map as MapIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { createClient } from '@/utils/supabase/client';
import { useRadar } from '@/hooks/useRadar';
import { getAnalysis, getLeadData } from '@/utils/radar-helpers';
import { ScoreIndicator, TargetIcon } from './shared';

// Import Modal Tabs
import {
    ModalTabDiagnostico,
    ModalTabAuditoria,
    ModalTabEstrategia,
    ModalTabTrabajo,
    ModalTabForense,
    ModalTabTerritorial
} from '@/components/lead-modal';
import { VictoryModal, VictoryData } from '@/components/pipeline/VictoryModal';

interface RadarLeadModalProps {
    radar: ReturnType<typeof useRadar>;
}

export function RadarLeadModal({ radar }: RadarLeadModalProps) {
    const {
        selectedLead, setSelectedLead,
        modalTab, setModalTab,
        leads, setLeads,
        pipelineLeads, setPipelineLeads,
        historyLeads, setHistoryLeads,
        location,
        logActivity,
        copyToClipboard,
        copiedField,
        isEditingContact, setIsEditingContact,
        editData, setEditData,
        isSaving, setIsSaving,
        notes, newNote, setNewNote, saveNote, deleteNote, isSavingNote,
        leadActivities,
        chatMessages, newChatMessage, setNewChatMessage, sendChatMessage, chatAuthor, setChatAuthor,
        fetchLeadActivities, fetchNotes, fetchChatMessages, fetchPipeline, fetchClosed,
        performDeepAnalysis, isDeepAnalyzing, performReanalysis, isReanalyzing, setIsReanalyzing,
        deleteLead,
        theme
    } = radar;

    const supabase = createClient();
    const router = useRouter();

    // --- Vault Onboarding State ---
    const [showVaultSetup, setShowVaultSetup] = useState(false);
    const [vaultConfig, setVaultConfig] = useState({
        hasMaintenance: true,
        monthlyFee: 1.5,
        billingStart: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
        currency: 'UF'
    });

    // Victory Modal State
    const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);

    // Vault Logic State
    const [inVault, setInVault] = useState(false);

    // Check Vault Status
    useEffect(() => {
        const checkVault = async () => {
            if (!selectedLead) return;
            const query = selectedLead.website
                ? `client_name.eq."${selectedLead.title || selectedLead.nombre}", site_url.eq."${selectedLead.website}"`
                : `client_name.eq."${selectedLead.title || selectedLead.nombre}"`;

            const { data } = await supabase
                .from('monitored_sites')
                .select('id')
                .or(query)
                .maybeSingle();

            setInVault(!!data);
        };
        checkVault();
    }, [selectedLead?.id, selectedLead?.website]);

    const handleMoveToVault = async () => {
        setShowVaultSetup(true);
    };

    const confirmVaultSetup = async () => {
        setIsSaving(true);
        try {
            const startDate = new Date(vaultConfig.billingStart);
            const contractEnd = new Date(startDate);

            if (vaultConfig.hasMaintenance) {
                contractEnd.setMonth(contractEnd.getMonth() + 1);
                contractEnd.setDate(contractEnd.getDate() + 5);
            } else {
                contractEnd.setFullYear(contractEnd.getFullYear() + 1);
            }

            const { data: siteData, error } = await supabase.from('monitored_sites').insert({
                client_name: selectedLead.title || selectedLead.nombre,
                site_url: selectedLead.website || '',
                status: 'active',
                plan_type: vaultConfig.hasMaintenance ? 'Mensual' : 'One-Off',
                email_contacto: selectedLead.email,
                dia_cobro: startDate.getDate(),
                monto_mensual: vaultConfig.hasMaintenance ? parseFloat(vaultConfig.monthlyFee.toString()) : 0,
                moneda: vaultConfig.currency,
                cuotas_implementacion: 3,
                cuotas_pagadas: 0,
                contract_start: vaultConfig.billingStart,
                contract_end: contractEnd.toISOString(),
                lead_id: selectedLead.id || selectedLead.db_id
            }).select('id').single();

            if (error) throw error;

            if (siteData) {
                await supabase.from('site_status').insert({ id: siteData.id, is_active: true });
            }

            await supabase.from('leads').update({
                pipeline_stage: 'archived',
                estado: 'won'
            }).eq('id', selectedLead.id || selectedLead.db_id);

            toast.success('Cliente configurado y migrado al Vault');
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#00f0ff', '#10b981', '#ffffff']
            });
            setInVault(true);
            setShowVaultSetup(false);

            await logActivity(selectedLead.id || selectedLead.db_id, 'moved_to_vault', 'won', 'vault', `Migrado a Vault. Mantención: ${vaultConfig.hasMaintenance ? 'SI' : 'NO'}`);
            removeFromLists(selectedLead.id || selectedLead.db_id);
            fetchPipeline();
            router.push('/dashboard/vault');

        } catch (err: any) {
            console.error('Error vault:', err);
            toast.error('Error al mover al Vault: ' + (err.message || 'Error desconocido'));
        } finally {
            setIsSaving(false);
        }
    };

    const isDark = true;
    const currentUser = 'Daniel';

    useEffect(() => {
        if (!modalTab) setModalTab('diagnostico');
    }, [modalTab, setModalTab]);

    useEffect(() => {
        if (selectedLead?.id && selectedLead.id !== 'preview') {
            const refreshLead = async () => {
                const { data } = await supabase.from('leads').select('*').eq('id', selectedLead.id).single();
                if (data) {
                    const currentKeys = Object.keys(selectedLead.source_data || {}).length;
                    const newKeys = Object.keys(data.source_data || {}).length;
                    if (!selectedLead.source_data?.deep_analysis && data.source_data?.deep_analysis) {
                        setSelectedLead((prev: any) => ({ ...prev, ...data }));
                    } else if (newKeys > currentKeys) {
                        setSelectedLead((prev: any) => ({ ...prev, ...data }));
                    }
                }
            };
            refreshLead();
        }
    }, [selectedLead?.id]);

    if (!selectedLead) return null;

    const analysis = getAnalysis(selectedLead);
    const ld = getLeadData(selectedLead);

    const removeFromLists = (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id && l.db_id !== id));
        setHistoryLeads(prev => prev.filter(l => l.id !== id && l.db_id !== id));
    };

    const handleVictoryConfirm = async (data: VictoryData) => {
        setIsVictoryModalOpen(false);
        setIsSaving(true);
        const id = selectedLead.id || selectedLead.db_id;
        try {
            await supabase.from('leads').update({
                estado: 'won',
                deal_type: data.dealType,
                deal_amount: data.amount,
                partner_split: data.partnerSplit,
                services_justification: data.justifications
            }).eq('id', id);
            await logActivity(id, 'closed_won', selectedLead.estado, 'won', `Cierre Ganado (${data.dealType}) - $${data.amount}`);
            fetchPipeline();
            setSelectedLead(null);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f0ff', '#10b981', '#ffffff']
            });
            toast.success('¡Venta registrada exitosamente!');
        } catch (err: any) {
            console.error(err);
            toast.error('Error al cerrar venta: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedLead(null)}>
            <div className={`relative w-full h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-colors md:w-[95vw] md:max-w-7xl ${isDark ? 'bg-[#0a0a0a] border border-white/10' : 'bg-white border-gray-200'}`} onClick={(e) => e.stopPropagation()}>

                {/* VAULT SETUP OVERLAY */}
                {showVaultSetup && (
                    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Configuración de Servicio</h3>
                                <p className="text-zinc-400 text-sm">Define los términos operativos para {ld.title}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">¿Mantención Mensual?</span>
                                        <span className="text-xs text-zinc-500">Activa el Kill Switch recurrente</span>
                                    </div>
                                    <button
                                        onClick={() => setVaultConfig({ ...vaultConfig, hasMaintenance: !vaultConfig.hasMaintenance })}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${vaultConfig.hasMaintenance ? 'bg-green-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${vaultConfig.hasMaintenance ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                {vaultConfig.hasMaintenance && (
                                    <div className="animate-in slide-in-from-top-2 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-zinc-500 mb-1 block">Monto Mensual</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={vaultConfig.monthlyFee}
                                                        onChange={(e) => setVaultConfig({ ...vaultConfig, monthlyFee: parseFloat(e.target.value) })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-white focus:border-green-500 outline-none"
                                                    />
                                                    <span className="absolute right-3 top-2 text-zinc-500 text-xs font-bold">{vaultConfig.currency}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500 mb-1 block">Moneda</label>
                                                <select
                                                    value={vaultConfig.currency}
                                                    onChange={(e) => setVaultConfig({ ...vaultConfig, currency: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-green-500 outline-none appearance-none"
                                                >
                                                    <option value="UF">UF</option>
                                                    <option value="CLP">CLP</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 mb-1 block">Inicio Facturación</label>
                                            <input
                                                type="date"
                                                value={vaultConfig.billingStart}
                                                onChange={(e) => setVaultConfig({ ...vaultConfig, billingStart: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-green-500 outline-none [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowVaultSetup(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-700 transition-colors">Cancelar</button>
                                <button onClick={confirmVaultSetup} disabled={isSaving} className="flex-1 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL HEADER */}
                <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${isDark ? 'border-white/10 bg-black/40' : 'border-gray-100 bg-white'}`}>
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="p-2.5 bg-zinc-800 rounded-xl shrink-0">
                            <Target className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div className="min-w-0">
                            <h2 className={`text-lg font-bold truncate flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {ld.title}
                                {ld.rating && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1">
                                        <Star className="w-2.5 h-2.5 fill-yellow-500" /> {ld.rating}
                                    </span>
                                )}
                            </h2>
                            <div className="flex items-center gap-3 text-xs text-zinc-500 truncate">
                                <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" /> {ld.address}</span>
                                {ld.website && (
                                    <a href={ld.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-500 hover:underline truncate">
                                        <Globe className="w-3 h-3" /> {ld.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${selectedLead.estado === 'ready_to_contact' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            selectedLead.estado === 'in_contact' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                                selectedLead.estado === 'discarded' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>
                            {selectedLead.estado || 'DETECTED'}
                        </div>
                        <button onClick={() => deleteLead(selectedLead.id || selectedLead.db_id)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-red-500/20 text-zinc-500 hover:text-red-500' : 'hover:bg-red-50'}`} title="Eliminar permanentemente">
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => setSelectedLead(null)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* MODAL CONTENT */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                    <div className={`w-64 border-r hidden md:flex flex-col p-2 space-y-1 overflow-y-auto shrink-0 ${isDark ? 'border-white/10 bg-zinc-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
                        <button onClick={() => setModalTab('diagnostico')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'diagnostico' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
                            <Activity className="w-4 h-4" /> Diagnóstico
                        </button>
                        <button onClick={() => setModalTab('auditoria')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'auditoria' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
                            <Shield className="w-4 h-4" /> Auditoría
                        </button>
                        <button onClick={() => setModalTab('estrategia')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'estrategia' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
                            <Zap className="w-4 h-4" /> Estrategia
                        </button>
                        <button onClick={() => setModalTab('trabajo')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'trabajo' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}>
                            <FileText className="w-4 h-4" /> Trabajo
                        </button>
                        <button onClick={() => setModalTab('forense')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'forense' ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'text-zinc-500 hover:bg-red-500/5 hover:text-red-400'}`}>
                            <ShieldAlert className="w-4 h-4" /> Forense
                        </button>
                        <button onClick={() => setModalTab('territorial')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${modalTab === 'territorial' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'text-zinc-500 hover:bg-indigo-500/5 hover:text-indigo-400'}`}>
                            <MapIcon className="w-4 h-4" /> Territorial
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
                        <div className="md:hidden flex overflow-x-auto p-2 border-b border-white/10 gap-2 shrink-0">
                            {['diagnostico', 'auditoria', 'estrategia', 'trabajo', 'forense', 'territorial'].map((t) => (
                                <button key={t} onClick={() => setModalTab(t as any)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${modalTab === t ? 'bg-cyan-500 text-black' : 'bg-black/40 text-zinc-500'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="p-4 md:p-8 max-w-5xl mx-auto">
                            {modalTab === 'diagnostico' && (
                                <ModalTabDiagnostico
                                    selectedLead={selectedLead}
                                    analysis={analysis}
                                    ld={ld}
                                    isDark={isDark}
                                    isDeepAnalyzing={isDeepAnalyzing}
                                    onDeepAnalyze={performDeepAnalysis}
                                    isReanalyzing={isReanalyzing}
                                    onReanalyze={performReanalysis}
                                    copyToClipboard={copyToClipboard}
                                    isEditingContact={isEditingContact}
                                    setIsEditingContact={setIsEditingContact}
                                    editData={editData}
                                    setEditData={setEditData}
                                    isSaving={isSaving}
                                    setIsSaving={setIsSaving}
                                    copiedField={copiedField}
                                    newNote={newNote}
                                    setNewNote={setNewNote}
                                    saveNote={saveNote}
                                    notes={notes}
                                    deleteNote={deleteNote}
                                    isSavingNote={isSavingNote}
                                    leadActivities={leadActivities}
                                    onUpdateContact={async () => {
                                        setIsSaving(true);
                                        const leadId = selectedLead.id || selectedLead.db_id;
                                        if (!leadId) return;
                                        try {
                                            const updatedSourceData = {
                                                ...(selectedLead.source_data || {}),
                                                email: editData.email,
                                                emails: [editData.email, ...(selectedLead.source_data?.emails?.filter((e: string) => e !== editData.email) || [])].filter(Boolean),
                                                whatsapp: editData.whatsapp,
                                                phone: editData.telefono,
                                                demo_url: editData.demo_url
                                            };
                                            await supabase.from('leads').update({
                                                nombre_contacto: editData.nombre_contacto,
                                                email: editData.email,
                                                telefono: editData.telefono,
                                                whatsapp: editData.whatsapp,
                                                demo_url: editData.demo_url,
                                                source_data: updatedSourceData
                                            }).eq('id', leadId);
                                            setSelectedLead({ ...selectedLead, ...editData, source_data: updatedSourceData });
                                            fetchPipeline();
                                            setIsEditingContact(false);
                                        } catch (err) { console.error(err); } finally { setIsSaving(false); }
                                    }}
                                />
                            )}
                            {modalTab === 'auditoria' && (
                                <ModalTabAuditoria
                                    selectedLead={selectedLead}
                                    isDark={isDark}
                                    isReanalyzing={isReanalyzing}
                                    setIsReanalyzing={setIsReanalyzing}
                                    isDeepAnalyzing={isDeepAnalyzing}
                                    onDeepAnalyze={performDeepAnalysis}
                                />
                            )}
                            {modalTab === 'estrategia' && (
                                <ModalTabEstrategia
                                    selectedLead={selectedLead}
                                    analysis={analysis}
                                    isDark={isDark}
                                    copyToClipboard={copyToClipboard}
                                />
                            )}
                            {modalTab === 'trabajo' && (
                                <ModalTabTrabajo
                                    selectedLead={selectedLead}
                                    ld={ld}
                                    isDark={isDark}
                                    analysis={analysis}
                                    isEditingContact={isEditingContact}
                                    setIsEditingContact={setIsEditingContact}
                                    editData={editData}
                                    setEditData={setEditData}
                                    onSaveContact={async () => {
                                        setIsSaving(true);
                                        const leadId = selectedLead.id || selectedLead.db_id;
                                        try {
                                            const updatedSourceData = {
                                                ...(selectedLead.source_data || {}),
                                                email: editData.email,
                                                whatsapp: editData.whatsapp,
                                                phone: editData.telefono,
                                                demo_url: editData.demo_url
                                            };
                                            await supabase.from('leads').update({
                                                nombre_contacto: editData.nombre_contacto,
                                                email: editData.email,
                                                telefono: editData.telefono,
                                                whatsapp: editData.whatsapp,
                                                demo_url: editData.demo_url,
                                                source_data: updatedSourceData
                                            }).eq('id', leadId);
                                            setSelectedLead({ ...selectedLead, ...editData, source_data: updatedSourceData });
                                            fetchPipeline();
                                            setIsEditingContact(false);
                                        } catch (err) { console.error(err); } finally { setIsSaving(false); }
                                    }}
                                    isSaving={isSaving}
                                    chatMessages={chatMessages}
                                    newChatMessage={newChatMessage}
                                    setNewChatMessage={setNewChatMessage}
                                    onSendChatMessage={sendChatMessage}
                                    chatAuthor={chatAuthor}
                                    setChatAuthor={setChatAuthor}
                                    leadActivities={leadActivities}
                                    copyToClipboard={copyToClipboard}
                                    copiedField={copiedField}
                                    onLeadUpdate={setSelectedLead}
                                />
                            )}
                            {modalTab === 'forense' && (
                                <ModalTabForense
                                    selectedLead={selectedLead}
                                    isDark={isDark}
                                    onLeadUpdate={setSelectedLead}
                                    onDeepAnalyze={performDeepAnalysis}
                                    isDeepAnalyzing={isDeepAnalyzing}
                                    setModalTab={setModalTab}
                                />
                            )}
                            {modalTab === 'territorial' && (
                                <ModalTabTerritorial
                                    selectedLead={selectedLead}
                                    isDark={isDark}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="p-6 border-t border-white/10 bg-zinc-900/50 sticky bottom-0">
                    {['ready_to_contact', 'in_contact', 'meeting_scheduled', 'proposal_sent', 'negotiation'].includes(selectedLead.estado) && (
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Estado Actual</span>
                                <span className="text-sm font-bold text-white">{selectedLead.estado.replace(/_/g, ' ').toUpperCase()}</span>
                            </div>
                            <div className="flex gap-2">
                                {selectedLead.estado === 'ready_to_contact' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'in_contact', revisado_por: currentUser }).eq('id', id);
                                        await logActivity(id, 'contacted', 'ready_to_contact', 'in_contact');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase hover:bg-cyan-400 flex gap-2 shadow-lg transition-all">
                                        <MessageCircle className="w-4 h-4" /> Marcar Contactado
                                    </button>
                                )}
                                {selectedLead.estado === 'in_contact' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'meeting_scheduled' }).eq('id', id);
                                        await logActivity(id, 'meeting_booked', 'in_contact', 'meeting_scheduled');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase hover:bg-indigo-400 flex gap-2 shadow-lg transition-all">
                                        <Activity className="w-4 h-4" /> Agendar Reunión
                                    </button>
                                )}
                                {(selectedLead.estado === 'negotiation' || selectedLead.estado === 'proposal_sent') && (
                                    <button onClick={() => setIsVictoryModalOpen(true)} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl text-xs uppercase hover:shadow-lg flex gap-2 transition-all">
                                        <CheckCircle2 className="w-4 h-4" /> ¡Cerrar Venta!
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <VictoryModal
                    isOpen={isVictoryModalOpen}
                    onClose={() => setIsVictoryModalOpen(false)}
                    onConfirm={handleVictoryConfirm}
                    leadName={ld.title}
                    isDark={isDark}
                />
            </div>
        </div>
    );
}
