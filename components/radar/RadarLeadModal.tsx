import React, { useState, useEffect } from 'react';
import {
    X, Target, Zap, Search, Shield, ShieldOff, Globe, MapPin, Star, AlertCircle,
    Save, Copy, CheckCircle2, MessageCircle, Mail, Phone, Instagram, Facebook,
    Trash2, ExternalLink, Activity, FileText, ChevronRight, Loader2, CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useRadar } from '@/hooks/useRadar';
import { getAnalysis, getLeadData } from '@/utils/radar-helpers';
import { ScoreIndicator, TargetIcon } from './shared';

// Import Modal Tabs
import { ModalTabDiagnostico } from '@/components/lead-modal/ModalTabDiagnostico';
import { ModalTabAuditoria } from '@/components/lead-modal/ModalTabAuditoria';
import { ModalTabEstrategia } from '@/components/lead-modal/ModalTabEstrategia';
import { ModalTabTrabajo } from '@/components/lead-modal/ModalTabTrabajo';

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
        fetchLeadActivities, fetchNotes, fetchChatMessages, fetchPipeline,
        performDeepAnalysis, isDeepAnalyzing, performReanalysis, isReanalyzing, // NEW PROPS
        theme // assuming theme is available
    } = radar;

    const supabase = createClient();
    const router = useRouter();

    // --- Vault Onboarding State ---
    const [showVaultSetup, setShowVaultSetup] = useState(false);
    const [vaultConfig, setVaultConfig] = useState({
        hasMaintenance: true,
        monthlyFee: 1.5, // Default UF
        billingStart: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // Today + 5 default
        currency: 'UF'
    });

    // Vault Logic State
    const [inVault, setInVault] = useState(false);

    // Check Vault Status
    useEffect(() => {
        const checkVault = async () => {
            if (!selectedLead) return;
            // Check by name or website
            const query = selectedLead.website
                ? `client_name.eq."${selectedLead.title || selectedLead.nombre}",site_url.eq."${selectedLead.website}"`
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
        // if (!confirm('¿Mover cliente a producción en el Vault?')) return; // Replaced by setup modal
        setShowVaultSetup(true);
    };

    const confirmVaultSetup = async () => {
        setIsSaving(true);
        try {
            // 1. Calculate Contract End (Next Payment Due)
            // If Maintenance: Start Date + 1 Month + 5 Days Grace
            // If One-Off: Start Date + 1 Year (Warranty)
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
                moneda: vaultConfig.currency, // Ensure column exists or map accordingly
                cuotas_implementacion: 3,
                cuotas_pagadas: 0,
                contract_start: vaultConfig.billingStart,
                contract_end: contractEnd.toISOString(),
                lead_id: selectedLead.id || selectedLead.db_id // Link to history
            }).select('id').single();

            if (error) {
                console.error("SUPABASE INSERT ERROR:", error);
                throw error;
            }

            // 2. Create Kill Switch Entry
            if (siteData) {
                await supabase.from('site_status').insert({ id: siteData.id, is_active: true });
            }

            // 3. Auto-Archive Lead Logic
            await supabase.from('leads').update({
                pipeline_stage: 'archived',
                estado: 'won'
            }).eq('id', selectedLead.id || selectedLead.db_id);

            toast.success('Cliente configurado y migrado al Vault');
            setInVault(true);
            setShowVaultSetup(false);

            await logActivity(selectedLead.id || selectedLead.db_id, 'moved_to_vault', 'won', 'vault', `Migrado a Vault. Mantención: ${vaultConfig.hasMaintenance ? 'SI' : 'NO'}`);

            // Update Local State to reflect Archive
            removeFromLists(selectedLead.id || selectedLead.db_id);
            fetchPipeline(); // Ensure pipeline is refreshed

            // Seamless Navigation
            router.push('/dashboard/vault');

            // Seamless Navigation
            router.push('/dashboard/vault');

        } catch (err: any) {
            console.error('Error vault raw:', err);
            const msg = err.message || err.details || err.hint || JSON.stringify(err);
            toast.error('Error al mover al Vault: ' + msg);
        } finally {
            setIsSaving(false);
        }
    };
    const isDark = true; // Forcing dark mode based on previous UI or use theme logic
    const currentUser = 'Daniel'; // Hardcoded for now as per original
    const [reviewNote, setReviewNote] = useState(selectedLead?.nota_revision || '');

    useEffect(() => {
        if (!modalTab) setModalTab('diagnostico');
    }, [modalTab, setModalTab]);

    // NEW: Silent Refresh on Open to ensure Deep Analysis / Updates are visible
    useEffect(() => {
        if (selectedLead?.id && selectedLead.id !== 'preview') {
            const refreshLead = async () => {
                const { data } = await supabase.from('leads').select('*').eq('id', selectedLead.id).single();
                if (data) {
                    // Only update if we have new data (deep compare source_data length/keys roughly)
                    const currentKeys = Object.keys(selectedLead.source_data || {}).length;
                    const newKeys = Object.keys(data.source_data || {}).length;

                    // Or specifically check for missing critical data
                    if (!selectedLead.source_data?.deep_analysis && data.source_data?.deep_analysis) {
                        console.log('🔄 Refreshing Lead Data (Syncing missing analysis)...');
                        setSelectedLead((prev: any) => ({ ...prev, ...data }));
                    } else if (newKeys > currentKeys) {
                        console.log('🔄 Refreshing Lead Data (Newer version found)...');
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

    // --- Helpers for updating local lists after state change ---
    const removeFromLists = (id: string) => {
        setLeads(prev => prev.filter(l => l.id !== id && l.db_id !== id));
        setHistoryLeads(prev => prev.filter(l => l.id !== id && l.db_id !== id));
        // Pipeline update handled by re-fetch usually
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`relative w-full h-[95vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl transition-colors md:w-[95vw] md:max-w-7xl ${isDark ? 'bg-[#0a0a0a] border border-white/10' : 'bg-white border-gray-200'}`}>

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
                                {/* Toggle Maintenance */}
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
                                            <p className="text-[10px] text-zinc-500 mt-1">
                                                * El Kill Switch se activará el {new Date(new Date(vaultConfig.billingStart).setMonth(new Date(vaultConfig.billingStart).getMonth() + 1)).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowVaultSetup(false)}
                                    className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmVaultSetup}
                                    disabled={isSaving}
                                    className="flex-1 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Confirmar
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
                                    <a href={ld.website} target="_blank" className="flex items-center gap-1 text-cyan-500 hover:underline truncate">
                                        <Globe className="w-3 h-3" /> {ld.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${selectedLead.estado === 'ready_to_contact' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            selectedLead.estado === 'in_contact' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                                selectedLead.estado === 'discarded' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>
                            {selectedLead.estado || 'DETECTED'}
                        </div>

                        <button
                            onClick={() => setSelectedLead(null)}
                            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* MODAL CONTENT: TABS + SCROLLVIEW */}
                <div className="flex-1 flex min-h-0 overflow-hidden">

                    {/* SIDEBAR TABS (Desktop) - Explicitly Flex */}
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
                    </div>

                    {/* MAIN SCROLLABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20">
                        {/* Mobile Tabs - Explicitly Hidden on Desktop */}
                        <div className="md:hidden flex overflow-x-auto p-2 border-b border-white/10 gap-2 shrink-0">
                            {['diagnostico', 'auditoria', 'estrategia', 'trabajo'].map((t) => (
                                <button key={t} onClick={() => setModalTab(t as any)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${modalTab === t ? 'bg-cyan-500 text-black' : 'bg-black/40 text-zinc-500'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-4 md:p-8 max-w-5xl mx-auto">
                            {modalTab === 'diagnostico' && (
                                <ModalTabDiagnostico
                                    selectedLead={selectedLead}
                                    analysis={analysis}
                                    ld={ld} // Added missing prop
                                    isDark={isDark}
                                    isDeepAnalyzing={isDeepAnalyzing}
                                    onDeepAnalyze={performDeepAnalysis}
                                    isReanalyzing={isReanalyzing}
                                    onReanalyze={performReanalysis}
                                    // Passing handlers from radar
                                    copyToClipboard={copyToClipboard}
                                    isEditingContact={isEditingContact}
                                    setIsEditingContact={setIsEditingContact}
                                    editData={editData}
                                    setEditData={setEditData}
                                    isSaving={isSaving}
                                    setIsSaving={setIsSaving}
                                    // Handlers for "Estrategia Ganadora" which is part of Diagnostico UI in original
                                    // REMOVED DUPLICATE setIsSaving
                                    copiedField={copiedField}
                                    // Notes & Activity
                                    newNote={newNote}
                                    setNewNote={setNewNote}
                                    saveNote={saveNote}
                                    notes={notes}
                                    deleteNote={deleteNote}
                                    isSavingNote={isSavingNote}
                                    leadActivities={leadActivities}
                                    // ... any other props needed
                                    // We need to inject the update logic for contact edit
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
                                                email: editData.email,
                                                telefono: editData.telefono,
                                                demo_url: editData.demo_url,
                                                source_data: updatedSourceData
                                            }).eq('id', leadId);

                                            // Optimistic update
                                            const updatedLead = { ...selectedLead, email: editData.email, whatsapp: editData.whatsapp, telefono: editData.telefono, demo_url: editData.demo_url, source_data: updatedSourceData };
                                            setSelectedLead(updatedLead);
                                            // We should also update pipeline leads if possible but useRadar doesn't expose list setter easily for search
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
                                    isReanalyzing={radar.isReanalyzing}
                                    setIsReanalyzing={radar.setIsReanalyzing}
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
                                    // Contact Editing
                                    isEditingContact={isEditingContact}
                                    setIsEditingContact={setIsEditingContact}
                                    editData={editData}
                                    setEditData={setEditData}
                                    onSaveContact={async () => {
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
                                                email: editData.email,
                                                telefono: editData.telefono,
                                                demo_url: editData.demo_url,
                                                source_data: updatedSourceData
                                            }).eq('id', leadId);

                                            const updatedLead = { ...selectedLead, email: editData.email, whatsapp: editData.whatsapp, telefono: editData.telefono, demo_url: editData.demo_url, source_data: updatedSourceData };
                                            setSelectedLead(updatedLead);
                                            fetchPipeline();
                                            setIsEditingContact(false);
                                        } catch (err) { console.error(err); } finally { setIsSaving(false); }
                                    }}
                                    isSaving={isSaving}

                                    // Chat
                                    chatMessages={chatMessages}
                                    newChatMessage={newChatMessage}
                                    setNewChatMessage={setNewChatMessage}
                                    onSendChatMessage={sendChatMessage}
                                    chatAuthor={chatAuthor}
                                    setChatAuthor={setChatAuthor}

                                    // AI & Activity
                                    leadActivities={leadActivities}
                                    copyToClipboard={copyToClipboard}
                                    copiedField={copiedField}
                                    onLeadUpdate={setSelectedLead}
                                />
                            )}
                        </div>
                    </div>
                </div>


                {/* MODAL FOOTER */}
                <div className="p-6 border-t border-white/10 bg-zinc-900/50 sticky bottom-0 space-y-4">
                    {/* PREVIEW */}
                    {selectedLead.id === 'preview' && (
                        <div className="flex justify-end gap-3 w-full border-t border-white/5 pt-4">
                            <button onClick={() => setSelectedLead(null)} className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors">Cancelar</button>
                            <button disabled={isSaving} onClick={async () => {
                                setIsSaving(true);
                                try {
                                    const res = await fetch('/api/radar/manual', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            nombre: selectedLead.nombre,
                                            sitio_web: selectedLead.sitio_web,
                                            telefono: selectedLead.telefono,
                                            direccion: selectedLead.direccion
                                        })
                                    });
                                    if ((await res.json()).success) {
                                        setSelectedLead(null);
                                        // radar.setActiveTab('pipeline')? No exposed in logic
                                        fetchPipeline();
                                    }
                                } finally { setIsSaving(false); }
                            }} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-xs font-bold uppercase hover:shadow-lg flex items-center gap-2">
                                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Confirmar
                            </button>
                        </div>
                    )}

                    {/* DETECTED (Initial Review) */}
                    {(!selectedLead.estado || selectedLead.estado === 'detected') && selectedLead.id !== 'preview' && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-black/30 p-2 rounded-xl">
                                <textarea value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Nota de revisión..." className="w-full bg-transparent text-sm text-white resize-none outline-none" rows={1} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-zinc-600">Zona: {location}</span>
                                <div className="flex gap-3">
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'discarded', nota_revision: reviewNote, revisado_por: currentUser }).eq('id', id);
                                        await logActivity(id, 'discarded', 'detected', 'discarded', reviewNote);
                                        removeFromLists(id);
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-3 rounded-xl font-medium text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 flex gap-2">
                                        <Trash2 className="w-4 h-4" /> Descartar
                                    </button>
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'ready_to_contact', nota_revision: reviewNote, revisado_por: currentUser }).eq('id', id);
                                        await logActivity(id, 'qualified', 'detected', 'ready_to_contact', reviewNote);
                                        fetchPipeline();
                                        removeFromLists(id);
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-6 py-3 rounded-xl font-bold text-sm bg-green-500 text-black hover:bg-green-400 flex gap-2 shadow-lg">
                                        <CheckCircle2 className="w-4 h-4" /> Guardar para Contacto
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PIPELINE ACTIONS (Advanced Flows) */}
                    {['ready_to_contact', 'in_contact', 'meeting_scheduled', 'proposal_sent', 'negotiation'].includes(selectedLead.estado) && (
                        <div className="flex justify-between items-center animate-in slide-in-from-bottom-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Estado Actual</span>
                                <span className={`text-sm font-bold ${selectedLead.estado === 'won' ? 'text-green-500' :
                                    selectedLead.estado === 'lost' ? 'text-red-500' :
                                        'text-white'
                                    }`}>
                                    {selectedLead.estado.replace(/_/g, ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {/* Ready to Contact -> Contacted */}
                                {selectedLead.estado === 'ready_to_contact' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'in_contact', revisado_por: currentUser }).eq('id', id);
                                        await logActivity(id, 'contacted', 'ready_to_contact', 'in_contact');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-xs uppercase tracking-wide hover:bg-cyan-400 flex gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
                                        <MessageCircle className="w-4 h-4" /> Marcar Contactado
                                    </button>
                                )}

                                {/* In Contact -> Meeting Scheduled */}
                                {selectedLead.estado === 'in_contact' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'meeting_scheduled' }).eq('id', id);
                                        await logActivity(id, 'meeting_booked', 'in_contact', 'meeting_scheduled');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wide hover:bg-indigo-400 flex gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                                        <Activity className="w-4 h-4" /> Agendar Reunión
                                    </button>
                                )}

                                {/* Meeting Scheduled -> Proposal Sent */}
                                {selectedLead.estado === 'meeting_scheduled' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'proposal_sent' }).eq('id', id);
                                        await logActivity(id, 'proposal_sent', 'meeting_scheduled', 'proposal_sent');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-wide hover:bg-purple-400 flex gap-2 shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
                                        <FileText className="w-4 h-4" /> Enviar Propuesta
                                    </button>
                                )}

                                {/* Proposal Sent -> Negotiation */}
                                {selectedLead.estado === 'proposal_sent' && (
                                    <button onClick={async () => {
                                        setIsSaving(true);
                                        const id = selectedLead.id || selectedLead.db_id;
                                        await supabase.from('leads').update({ estado: 'negotiation' }).eq('id', id);
                                        await logActivity(id, 'negotiation_started', 'proposal_sent', 'negotiation');
                                        fetchPipeline();
                                        setSelectedLead(null);
                                        setIsSaving(false);
                                    }} className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wide hover:bg-orange-400 flex gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105">
                                        <Activity className="w-4 h-4" /> Iniciar Negociación
                                    </button>
                                )}

                                {/* Negotiation -> WON/LOST */}
                                {(selectedLead.estado === 'negotiation' || selectedLead.estado === 'proposal_sent') && (
                                    <>
                                        <button onClick={async () => {
                                            if (!confirm('¿Estás seguro de marcar esta oportunidad como PERDIDA?')) return;
                                            setIsSaving(true);
                                            const id = selectedLead.id || selectedLead.db_id;
                                            await supabase.from('leads').update({ estado: 'closed_lost' }).eq('id', id);
                                            await logActivity(id, 'closed_lost', selectedLead.estado, 'closed_lost');
                                            fetchPipeline();
                                            setSelectedLead(null);
                                            setIsSaving(false);
                                        }} className="px-4 py-2 bg-red-500/10 text-red-500 font-bold rounded-xl text-xs uppercase tracking-wide hover:bg-red-500/20 flex gap-2 border border-red-500/20 transition-colors">
                                            <Trash2 className="w-4 h-4" /> Descartar
                                        </button>

                                        <button onClick={async () => {
                                            if (!confirm('¡Felicidades! ¿Confirmar cierre ganado? Esto moverá el cliente al Vault.')) return;
                                            setIsSaving(true);
                                            const id = selectedLead.id || selectedLead.db_id;
                                            await supabase.from('leads').update({ estado: 'won' }).eq('id', id);
                                            await logActivity(id, 'closed_won', selectedLead.estado, 'won', 'Ganado - Movido a Vault');
                                            // Optional: Create Project in another table if needed

                                            fetchPipeline();
                                            setSelectedLead(null);
                                            setIsSaving(false);
                                            // Could trigger confetti here in parent
                                        }} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl text-xs uppercase tracking-wide hover:shadow-lg hover:shadow-green-500/20 flex gap-2 transition-all hover:scale-105">
                                            <CheckCircle2 className="w-4 h-4" /> ¡Cerrar Venta!
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* WON STATE - Already Closed */}
                    {selectedLead.estado === 'won' && (
                        <div className="w-full bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-full text-black">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider">Cliente Cerrado</h4>
                                    <p className="text-xs text-green-500/60">
                                        {inVault ? 'Este proyecto está en producción en el Vault.' : 'Venta cerrada. Falta migrar al Vault.'}
                                    </p>
                                </div>
                            </div>

                            {inVault ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (!confirm('¿Archivar este lead? Desaparecerá del pipeline pero quedará en historial.')) return;
                                            setIsSaving(true);
                                            // Archive logic: change pipeline_stage to 'archived'
                                            // This removes it from the board view
                                            const { error } = await supabase.from('leads').update({ pipeline_stage: 'archived' }).eq('id', selectedLead.id || selectedLead.db_id);

                                            if (error) {
                                                toast.error('Error al archivar');
                                            } else {
                                                toast.success('Lead archivado');
                                                fetchPipeline();
                                                setSelectedLead(null);
                                            }
                                            setIsSaving(false);
                                        }}
                                        className="px-4 py-2 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-lg hover:bg-zinc-700 transition-colors border border-white/5 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Limpiar
                                    </button>
                                    <button
                                        onClick={() => window.open('/dashboard/vault', '_blank')}
                                        className="px-4 py-2 bg-black/40 text-green-400 text-xs font-bold uppercase rounded-lg hover:bg-black/60 transition-colors border border-green-500/10 flex items-center gap-2"
                                    >
                                        Ver en Vault <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowVaultSetup(true)}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-green-500 text-black text-xs font-bold uppercase rounded-lg hover:bg-green-400 transition-colors shadow-lg shadow-green-900/20 flex items-center gap-2"
                                >
                                    <CreditCard className="w-3 h-3" />
                                    Pasar a Vault
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
