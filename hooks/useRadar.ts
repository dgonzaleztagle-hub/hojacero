import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useDashboard } from '@/app/dashboard/DashboardContext';
import { useSearchParams } from 'next/navigation';

export interface ChatMessage {
    id: string;
    author: 'Yo' | 'Gaston' | 'Sistema';
    message: string;
    created_at: string;
}

export function useRadar() {
    const { userRole, theme } = useDashboard();
    const supabase = createClient();
    const searchParams = useSearchParams();

    // Tabs & Navigation
    const [activeTab, setActiveTab] = useState<'scanner' | 'pipeline' | 'history'>('scanner');
    const [modalTab, setModalTab] = useState<'diagnostico' | 'auditoria' | 'estrategia' | 'trabajo'>('diagnostico');

    // Data Lists
    const [historyLeads, setHistoryLeads] = useState<any[]>([]);
    const [pipelineLeads, setPipelineLeads] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);

    // Scanner State
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Santiago, Chile');
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');

    // Selected Lead State
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [leadActivities, setLeadActivities] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);

    // Actions State
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editData, setEditData] = useState({ email: '', whatsapp: '', telefono: '', demo_url: '' });

    // Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newChatMessage, setNewChatMessage] = useState('');
    const [chatAuthor, setChatAuthor] = useState<'Yo' | 'Gaston'>('Yo');

    // Notes State
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Deep Analysis State
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);

    // Manual Entry State
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    // --- Helpers ---

    const getAnalysis = (lead: any) => {
        const raw = lead.analysis || lead.source_data?.analysis || {};
        if (raw.painPoints && !raw.salesStrategy) {
            return {
                salesStrategy: {
                    painPoints: Array.isArray(raw.painPoints) ? raw.painPoints : [raw.painPoints || 'Sin dolor detectado'],
                    hook: raw.vibe ? `Abordaje ${raw.vibe}` : 'Consultoría Digital',
                    proposedSolution: raw.suggestedSolution || 'Pendiente',
                    estimatedValue: raw.estimatedValue || 'Por Definir'
                },
                scoreBreakdown: raw.scoreBreakdown || {},
                recommendedChannel: 'Email',
                competitiveAnalysis: raw.vibe || 'Análisis pendiente'
            };
        }
        return raw;
    };

    const getLeadData = (lead: any) => {
        const sourceData = lead.source_data || {};
        return {
            title: lead.title || lead.nombre || 'Sin nombre',
            address: lead.address || lead.direccion || '',
            phone: lead.telefono || lead.phoneNumber || sourceData.telefono || '',
            email: lead.emails?.[0] || lead.email || sourceData.emails?.[0] || sourceData.email || null,
            whatsapp: lead.whatsapp || sourceData.whatsapp || null,
            instagram: lead.instagram || sourceData.instagram || null,
            facebook: lead.facebook || sourceData.facebook || null,
            website: lead.website || lead.sitio_web || sourceData.sitio_web || null,
            rating: lead.rating || sourceData.rating || null,
            techStack: lead.techStack || sourceData.techStack || [],
            hasSSL: lead.hasSSL ?? sourceData.scraped?.hasSSL ?? sourceData.hasSSL ?? true,
            analysis: lead.analysis || sourceData.analysis || {},
            zona: lead.zona_busqueda || location,
            nota: lead.nota_revision || '',
            revisadoPor: lead.revisado_por || null,
            demo_url: lead.demo_url || sourceData.demo_url || '',
        };
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // --- Fetchers ---

    const fetchLeadActivities = async (leadId: string) => {
        const { data } = await supabase.from('lead_activity_log').select('*').eq('lead_id', leadId).order('created_at', { ascending: false });
        if (data) setLeadActivities(data);
    };

    const fetchNotes = async (leadId: string) => {
        const { data } = await supabase.from('lead_notas').select('*').eq('lead_id', leadId).order('created_at', { ascending: false });
        if (data) setNotes(data);
    };

    const fetchChatMessages = async (leadId: string) => {
        const { data } = await supabase.from('bitacora_clientes').select('*').eq('lead_id', leadId).order('created_at', { ascending: true });
        if (data) setChatMessages(data as ChatMessage[]);
    };

    const fetchHistory = async () => {
        const { data } = await supabase.from('leads').select('*').in('estado', ['detected', 'discarded']).order('created_at', { ascending: false });
        if (data) setHistoryLeads(data);
    };

    const fetchPipeline = async () => {
        const { data } = await supabase.from('leads')
            .select('*')
            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
            .order('pipeline_order', { ascending: true })
            .order('created_at', { ascending: false });
        if (data) setPipelineLeads(data);
    };

    // --- Actions ---

    const handleScan = async () => {
        if (!query) return;
        setIsScanning(true);
        setError('');
        setLeads([]);
        try {
            const res = await fetch('/api/radar/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, location })
            });
            const data = await res.json();
            if (data.success) {
                setLeads(data.leads);
            } else {
                setError(data.error || 'Error al escanear.');
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setIsScanning(false);
        }
    };

    const sendChatMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const leadId = selectedLead?.id || selectedLead?.db_id;
        if (!leadId || !newChatMessage.trim()) return;
        try {
            const { error } = await supabase.from('bitacora_clientes').insert({
                lead_id: leadId,
                author: chatAuthor,
                message: newChatMessage.trim(),
                created_at: new Date().toISOString()
            });
            if (error) throw error;
            setNewChatMessage('');
            fetchChatMessages(leadId);
        } catch (err: any) {
            alert('Error al enviar mensaje: ' + err.message);
        }
    };

    const saveNote = async () => {
        const leadId = selectedLead?.id || selectedLead?.db_id;
        if (!newNote.trim() || !leadId) return;
        setIsSavingNote(true);
        try {
            const { error } = await supabase.from('lead_notas').insert({
                lead_id: leadId,
                contenido: newNote,
                categoria: 'general'
            });
            if (error) throw error;
            setNewNote('');
            fetchNotes(leadId);
        } catch (err) {
            console.error('Error saving note:', err);
        } finally {
            setIsSavingNote(false);
        }
    };

    const deleteNote = async (noteId: string) => {
        try {
            await supabase.from('lead_notas').delete().eq('id', noteId);
            setNotes(notes.filter(n => n.id !== noteId));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };



    const logActivity = async (leadId: string, accion: string, estadoAnterior: string | null, estadoNuevo: string, nota?: string) => {
        try {
            await supabase.from('lead_activity_log').insert({
                lead_id: leadId,
                usuario: 'Daniel', // Should be dynamic
                accion,
                estado_anterior: estadoAnterior,
                estado_nuevo: estadoNuevo,
                nota: nota || null
            });
        } catch (err) {
            console.error('Error logging activity:', err);
        }
    };

    const performReanalysis = async () => {
        if (!selectedLead) return;
        const leadId = selectedLead.id || selectedLead.db_id;

        setIsReanalyzing(true);
        try {
            const res = await fetch('/api/radar/reanalyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId })
            });
            const data = await res.json();

            if (data.success) {
                // Merge data into selectedLead
                const updatedSourceData = {
                    ...(selectedLead.source_data || {}),
                    analysis: data.analysis
                };

                const updatedLead = {
                    ...selectedLead,
                    puntaje_oportunidad: data.analysis.score,
                    razon_ia: data.analysis.analysisReport,
                    source_data: updatedSourceData
                };

                // Update Local State
                setSelectedLead(updatedLead);
                // Also update lists
                setLeads(prev => prev.map(l => (l.id === leadId || l.db_id === leadId) ? updatedLead : l));
                setPipelineLeads(prev => prev.map(l => (l.id === leadId || l.db_id === leadId) ? updatedLead : l));
            } else {
                alert('Re-analysis failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Re-analysis error. Check console.');
        } finally {
            setIsReanalyzing(false);
        }
    };

    const performDeepAnalysis = async () => {
        if (!selectedLead) return;
        const leadId = selectedLead.id || selectedLead.db_id;
        const url = selectedLead.website || selectedLead.sitio_web || selectedLead.source_data?.sitio_web;

        // Validation needs to be robust as restored leads might have partial data
        if (!url) {
            alert('No web URL found for this lead');
            return;
        }

        setIsDeepAnalyzing(true);
        try {
            const res = await fetch('/api/radar/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    url,
                    businessName: selectedLead.nombre || selectedLead.title,
                    businessType: selectedLead.categoria || 'General'
                })
            });
            const data = await res.json();

            if (data.success) {
                // Merge data into selectedLead
                const updatedSourceData = {
                    ...(selectedLead.source_data || {}),
                    scraped: data.scraped,
                    deep_analysis: { ...data.analysis, techSpecs: data.analysis.techSpecs }, // ensure structure matches
                    last_audit_date: new Date().toISOString()
                };

                const updatedLead = {
                    ...selectedLead,
                    source_data: updatedSourceData
                };

                // Update Local State
                setSelectedLead(updatedLead);
                // Also update lists
                setLeads(prev => prev.map(l => (l.id === leadId || l.db_id === leadId) ? updatedLead : l));
                setPipelineLeads(prev => prev.map(l => (l.id === leadId || l.db_id === leadId) ? updatedLead : l));

                // Switch to Auditoria Tab to show results
                setModalTab('auditoria');
            } else {
                alert('Analysis failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Analysis error. Check console.');
        } finally {
            setIsDeepAnalyzing(false);
        }
    };


    // --- Effects ---

    useEffect(() => {
        if (activeTab === 'history') fetchHistory();
        if (activeTab === 'pipeline') fetchPipeline();
    }, [activeTab]);

    // Deep Linking
    useEffect(() => {
        const targetId = searchParams.get('leadId');
        if (targetId && !selectedLead) {
            const checkAndOpen = async () => {
                let target = leads.find(l => l.id === targetId) || pipelineLeads.find(l => l.id === targetId);
                if (!target) {
                    const { data } = await supabase.from('leads').select('*').eq('id', targetId).single();
                    if (data) target = data;
                }
                if (target) {
                    setSelectedLead(target);
                    fetchLeadActivities(target.id || target.db_id);
                    fetchNotes(target.id || target.db_id);
                    fetchChatMessages(target.id || target.db_id);
                    window.history.replaceState(null, '', '/dashboard/radar');
                }
            };
            checkAndOpen();
        }
    }, [searchParams, leads, pipelineLeads]);

    // Realtime Chat
    useEffect(() => {
        if (!selectedLead) return;
        const leadId = selectedLead.id || selectedLead.db_id;
        const channel = supabase.channel(`chat:${leadId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bitacora_clientes', filter: `lead_id=eq.${leadId}` }, (payload) => {
                const newMessage = payload.new as ChatMessage;
                setChatMessages((prev) => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [selectedLead]);

    return {
        // State
        activeTab, setActiveTab,
        modalTab, setModalTab,
        historyLeads, setHistoryLeads,
        pipelineLeads, setPipelineLeads,
        leads, setLeads,
        query, setQuery,
        location, setLocation,
        isScanning,
        error, setError,
        selectedLead, setSelectedLead,
        leadActivities,
        notes,
        copiedField,
        isSaving, setIsSaving,
        isEditingContact, setIsEditingContact,
        editData, setEditData,
        chatMessages, newChatMessage, setNewChatMessage, chatAuthor, setChatAuthor,
        newNote, setNewNote, isSavingNote,
        isReanalyzing, setIsReanalyzing,
        isDeepAnalyzing,
        isManualModalOpen, setIsManualModalOpen,
        userRole, theme,

        // Actions
        handleScan,
        performDeepAnalysis,
        performReanalysis,
        sendChatMessage,
        saveNote,
        deleteNote,
        logActivity,
        copyToClipboard,
        getAnalysis,
        getLeadData,
        fetchLeadActivities,
        fetchNotes,
        fetchChatMessages,
        fetchHistory,
        fetchPipeline
    };
}
