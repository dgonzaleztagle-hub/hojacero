'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useDashboard } from '../DashboardContext';
import {
    Search, Loader2, Globe, MapPin, Star, AlertCircle, Save, ChevronRight, Target,
    Mail, Phone, MessageCircle, Instagram, Facebook, Shield, ShieldOff, Zap, TrendingUp,
    ExternalLink, Copy, CheckCircle2, XCircle, ClipboardList, Trash2
} from 'lucide-react';

export default function RadarPage() {
    const { userRole, theme } = useDashboard();
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<'scanner' | 'pipeline' | 'history'>('scanner');
    const [historyLeads, setHistoryLeads] = useState<any[]>([]);
    const [pipelineLeads, setPipelineLeads] = useState<any[]>([]);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Santiago, Chile');
    const [isScanning, setIsScanning] = useState(false);
    const [leads, setLeads] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [reviewNote, setReviewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser] = useState('Daniel'); // TODO: Get from auth later
    const [aiTemplate, setAiTemplate] = useState<{ content: string; type: 'whatsapp' | 'email' | null }>({ content: '', type: null });
    const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [editData, setEditData] = useState({ email: '', whatsapp: '', telefono: '', demo_url: '' });
    const [isReanalyzing, setIsReanalyzing] = useState(false);
    const [leadActivities, setLeadActivities] = useState<any[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Helper function to log activity to lead_activity_log
    const logActivity = async (
        leadId: string,
        accion: string,
        estadoAnterior: string | null,
        estadoNuevo: string,
        nota?: string
    ) => {
        try {
            await supabase.from('lead_activity_log').insert({
                lead_id: leadId,
                usuario: currentUser,
                accion,
                estado_anterior: estadoAnterior,
                estado_nuevo: estadoNuevo,
                nota: nota || null
            });
        } catch (err) {
            console.error('Error logging activity:', err);
        }
    };

    // Fetch activities when selecting a lead from history/pipeline
    const fetchLeadActivities = async (leadId: string) => {
        const { data } = await supabase
            .from('lead_activity_log')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });
        if (data) setLeadActivities(data);
    };

    const fetchNotes = async (leadId: string) => {
        const { data } = await supabase
            .from('lead_notas')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });
        if (data) setNotes(data);
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

    useEffect(() => {
        if (activeTab === 'history') {
            const fetchHistory = async () => {
                const { data } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('fuente', 'radar')
                    .in('estado', ['detected', 'discarded'])
                    .order('created_at', { ascending: false });
                if (data) setHistoryLeads(data);
            };
            fetchHistory();
        }
        if (activeTab === 'pipeline') {
            const fetchPipeline = async () => {
                const { data } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('fuente', 'radar')
                    .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                    .order('created_at', { ascending: false });
                if (data) setPipelineLeads(data);
            };
            fetchPipeline();
        }
    }, [activeTab]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

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

    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="bg-red-500/10 p-6 rounded-full">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-light text-white">Acceso Restringido</h2>
                <p className="text-zinc-500 max-w-md">El módulo RADAR es exclusivo para el equipo de HojaCero.</p>
            </div>
        );
    }

    // Helper to get analysis data from different structures
    const getAnalysis = (lead: any) => {
        return lead.analysis || lead.source_data?.analysis || {};
    };

    // Helper to normalize lead data (works for both scanner and DB leads)
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
            hasSSL: lead.hasSSL ?? sourceData.hasSSL ?? true,
            analysis: lead.analysis || sourceData.analysis || {},
            zona: lead.zona_busqueda || location,
            nota: lead.nota_revision || '',
            nota: lead.nota_revision || '',
            revisadoPor: lead.revisado_por || null,
            demo_url: lead.demo_url || sourceData.demo_url || '',
        };
    };

    const generateTemplate = async (lead: any, type: 'whatsapp' | 'email') => {
        setIsGeneratingTemplate(true);
        setAiTemplate({ content: '', type });
        try {
            const leadData = getLeadData(lead);
            const res = await fetch('/api/radar/template', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadData: { ...leadData, analysis: lead.source_data?.analysis || lead.analysis }, type })
            });
            const data = await res.json();
            if (data.success) {
                setAiTemplate({ content: data.message, type });
            }
        } catch (err) {
            console.error('Error generating template:', err);
        } finally {
            setIsGeneratingTemplate(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <TargetIcon />
                        RADAR
                        <span className="text-xs bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/30">Pro</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm max-w-xl">
                        Inteligencia de Leads con IA • Emails • WhatsApp • Tech Stack • Estrategia de Ventas
                    </p>
                </div>
                {leads.length > 0 && (
                    <div className="flex gap-3 text-xs font-mono">
                        <div className="bg-zinc-900 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-green-400">{leads.filter(l => (getAnalysis(l).score || 0) >= 80).length}</span>
                            <span className="text-zinc-500">Alta Oportunidad</span>
                        </div>
                        <div className="bg-zinc-900 border border-cyan-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <Mail className="w-3 h-3 text-cyan-400" />
                            <span className="text-cyan-400">{leads.filter(l => l.emails?.length > 0).length}</span>
                            <span className="text-zinc-500">Con Email</span>
                        </div>
                        <div className="bg-zinc-900 border border-purple-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <MessageCircle className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-400">{leads.filter(l => l.whatsapp).length}</span>
                            <span className="text-zinc-500">Con WhatsApp</span>
                        </div>
                    </div>
                )}
            </div>

            {/* TABS */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('scanner')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'scanner' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    🔍 Escáner
                    {activeTab === 'scanner' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'pipeline' ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    📋 Pipeline
                    {pipelineLeads.length > 0 && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{pipelineLeads.length}</span>
                    )}
                    {activeTab === 'pipeline' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    📚 Historial
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
            </div>

            {/* SCANNER VIEW */}
            {activeTab === 'scanner' && (
                <>
                    {/* SEARCH CONTROLS */}
                    <div className="bg-black border border-white/10 p-1 rounded-2xl flex flex-col md:flex-row shadow-xl">
                        <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 relative group">
                            <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rubro / Nicho</div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ej: Dentistas, Gimnasios, Restaurantes..."
                                className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                            />
                        </div>
                        <div className="w-full md:w-1/3 relative group">
                            <div className="absolute top-3 left-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Zona</div>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ej: Las Condes, Providencia"
                                className="w-full bg-transparent p-4 pb-2 pt-8 text-white focus:outline-none placeholder:text-zinc-700 h-16"
                            />
                        </div>
                        <button
                            onClick={handleScan}
                            disabled={isScanning || !query}
                            className={`px-8 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all m-1
                                ${isScanning ? 'bg-zinc-900 text-zinc-500 cursor-wait' : 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'}
                            `}
                        >
                            {isScanning ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                            {isScanning ? 'Escaneando...' : 'Escanear'}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </>
            )}

            {/* RESULTS LIST */}
            {(leads.length > 0 || (activeTab === 'history' && historyLeads.length > 0)) && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-12 gap-4 px-6 text-[10px] uppercase tracking-wider font-bold text-zinc-500 pb-2 border-b border-white/5">
                        <div className="col-span-3">Negocio</div>
                        <div className="col-span-2">Contacto</div>
                        <div className="col-span-3">Oportunidad</div>
                        <div className="col-span-2">Tech</div>
                        <div className="col-span-1 text-center">Score</div>
                        <div className="col-span-1"></div>
                    </div>

                    {(activeTab === 'scanner' ? leads : historyLeads).map((lead, idx) => {
                        const analysis = getAnalysis(lead);
                        return (
                            <div
                                key={lead.id || idx}
                                onClick={() => { setSelectedLead(lead); fetchLeadActivities(lead.id || lead.db_id); fetchNotes(lead.id || lead.db_id); }}
                                className="group grid grid-cols-12 gap-4 p-4 items-center bg-black border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-white/[0.02] cursor-pointer transition-all"
                            >
                                {/* NAME & ADDRESS */}
                                <div className="col-span-3 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-white truncate text-sm group-hover:text-cyan-400 transition-colors">
                                            {lead.title || lead.nombre}
                                        </h3>
                                        {!(lead.website || lead.sitio_web) && (
                                            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-bold flex-shrink-0">NO WEB</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-600 text-xs mt-0.5 truncate">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">{lead.address || lead.direccion}</span>
                                    </div>
                                </div>

                                {/* CONTACT ICONS */}
                                <div className="col-span-2 flex items-center gap-2">
                                    {(lead.emails?.length > 0 || lead.email) && (
                                        <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400" title={lead.emails?.[0] || lead.email}>
                                            <Mail className="w-3 h-3" />
                                        </div>
                                    )}
                                    {(lead.whatsapp || lead.source_data?.whatsapp) && (
                                        <div className="p-1.5 rounded bg-green-500/10 text-green-400" title="WhatsApp disponible">
                                            <MessageCircle className="w-3 h-3" />
                                        </div>
                                    )}
                                    {(lead.instagram || lead.source_data?.instagram) && (
                                        <div className="p-1.5 rounded bg-pink-500/10 text-pink-400">
                                            <Instagram className="w-3 h-3" />
                                        </div>
                                    )}
                                    {lead.telefono && (
                                        <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
                                            <Phone className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>

                                {/* OPPORTUNITY */}
                                <div className="col-span-3 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-medium">{analysis.opportunity || 'Pendiente'}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                        {analysis.salesStrategy?.hook || analysis.analysisReport?.slice(0, 50) || '...'}
                                    </p>
                                </div>

                                {/* TECH STACK */}
                                <div className="col-span-2 flex items-center gap-1 flex-wrap">
                                    {(lead.techStack || lead.source_data?.techStack || []).slice(0, 2).map((tech: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]">{tech}</span>
                                    ))}
                                    {(lead.hasSSL === false || lead.source_data?.hasSSL === false) && (
                                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px]">No SSL</span>
                                    )}
                                </div>

                                {/* SCORE */}
                                <div className="col-span-1 flex justify-center">
                                    <ScoreIndicator score={analysis.score || 0} />
                                </div>

                                {/* ARROW */}
                                <div className="col-span-1 flex justify-end">
                                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-400 transition-colors" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* EMPTY STATE - Scanner */}
            {activeTab === 'scanner' && !isScanning && leads.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-800 border-2 border-dashed border-zinc-900 rounded-3xl">
                    <Target className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-medium text-zinc-700">Radar en espera</p>
                    <p className="text-sm">Inicia un escaneo para mapear el terreno.</p>
                </div>
            )}

            {/* PIPELINE VIEW - KANBAN */}
            {activeTab === 'pipeline' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {pipelineLeads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-800 border-2 border-dashed border-zinc-900 rounded-3xl">
                            <ClipboardList className="w-16 h-16 mb-4 opacity-10" />
                            <p className="font-medium text-zinc-700">Pipeline vacío</p>
                            <p className="text-sm text-center max-w-md">
                                Escanea leads y guárdalos para contacto.<br />
                                Los leads que marques aparecerán aquí.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-4">
                            {/* Columna 1: Por Contactar */}
                            <div className="bg-zinc-900/30 rounded-2xl p-3 border border-green-500/20">
                                <div className="flex items-center gap-2 mb-3 px-2">
                                    <span className="text-lg">📞</span>
                                    <span className="text-xs font-bold uppercase text-green-400 tracking-wider">Por Contactar</span>
                                    <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                        {pipelineLeads.filter(l => l.estado === 'ready_to_contact').length}
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {pipelineLeads.filter(l => l.estado === 'ready_to_contact').map(lead => (
                                        <div
                                            key={lead.id}
                                            onClick={() => { setSelectedLead(lead); setReviewNote(lead.nota_revision || ''); fetchLeadActivities(lead.id || lead.db_id); fetchNotes(lead.id || lead.db_id); }}
                                            className="bg-black/50 border border-green-500/20 rounded-xl p-3 hover:border-green-500/40 cursor-pointer transition-all group"
                                        >
                                            <h4 className="text-white text-sm font-medium truncate group-hover:text-green-400">{lead.nombre}</h4>
                                            <p className="text-zinc-600 text-xs truncate mt-0.5">{lead.direccion}</p>
                                            {lead.nota_revision && (
                                                <p className="text-yellow-500 text-[10px] mt-2 truncate">📝 {lead.nota_revision}</p>
                                            )}
                                            <div className="flex gap-1 mt-2">
                                                {lead.email && <span className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center"><Mail className="w-3 h-3 text-cyan-400" /></span>}
                                                {lead.whatsapp && <span className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center"><MessageCircle className="w-3 h-3 text-green-400" /></span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Columna 2: En Contacto */}
                            <div className="bg-zinc-900/30 rounded-2xl p-3 border border-cyan-500/20">
                                <div className="flex items-center gap-2 mb-3 px-2">
                                    <span className="text-lg">💬</span>
                                    <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider">En Contacto</span>
                                    <span className="ml-auto text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                                        {pipelineLeads.filter(l => l.estado === 'in_contact').length}
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {pipelineLeads.filter(l => l.estado === 'in_contact').map(lead => (
                                        <div
                                            key={lead.id}
                                            onClick={() => { setSelectedLead(lead); setReviewNote(lead.nota_revision || ''); fetchLeadActivities(lead.id || lead.db_id); fetchNotes(lead.id || lead.db_id); }}
                                            className="bg-black/50 border border-cyan-500/20 rounded-xl p-3 hover:border-cyan-500/40 cursor-pointer transition-all group"
                                        >
                                            <h4 className="text-white text-sm font-medium truncate group-hover:text-cyan-400">{lead.nombre}</h4>
                                            <p className="text-zinc-600 text-xs truncate mt-0.5">{lead.direccion}</p>
                                            {lead.nota_revision && (
                                                <p className="text-yellow-500 text-[10px] mt-2 truncate">📝 {lead.nota_revision}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Columna 3: Propuesta Enviada */}
                            <div className="bg-zinc-900/30 rounded-2xl p-3 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-3 px-2">
                                    <span className="text-lg">📄</span>
                                    <span className="text-xs font-bold uppercase text-purple-400 tracking-wider">Propuesta</span>
                                    <span className="ml-auto text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                                        {pipelineLeads.filter(l => l.estado === 'proposal_sent').length}
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {pipelineLeads.filter(l => l.estado === 'proposal_sent').map(lead => (
                                        <div
                                            key={lead.id}
                                            onClick={() => { setSelectedLead(lead); setReviewNote(lead.nota_revision || ''); fetchLeadActivities(lead.id || lead.db_id); fetchNotes(lead.id || lead.db_id); }}
                                            className="bg-black/50 border border-purple-500/20 rounded-xl p-3 hover:border-purple-500/40 cursor-pointer transition-all group"
                                        >
                                            <h4 className="text-white text-sm font-medium truncate group-hover:text-purple-400">{lead.nombre}</h4>
                                            <p className="text-zinc-600 text-xs truncate mt-0.5">{lead.direccion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Columna 4: Cerrado */}
                            <div className="bg-zinc-900/30 rounded-2xl p-3 border border-white/10">
                                <div className="flex items-center gap-2 mb-3 px-2">
                                    <span className="text-lg">✅</span>
                                    <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Cerrado</span>
                                    <span className="ml-auto text-xs bg-white/10 text-zinc-400 px-2 py-0.5 rounded-full">
                                        {pipelineLeads.filter(l => l.estado === 'won' || l.estado === 'lost').length}
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                    {pipelineLeads.filter(l => l.estado === 'won' || l.estado === 'lost').map(lead => (
                                        <div
                                            key={lead.id}
                                            onClick={() => { setSelectedLead(lead); setReviewNote(lead.nota_revision || ''); fetchLeadActivities(lead.id || lead.db_id); fetchNotes(lead.id || lead.db_id); }}
                                            className={`bg-black/50 border rounded-xl p-3 cursor-pointer transition-all group ${lead.estado === 'won'
                                                ? 'border-green-500/30 bg-green-500/5'
                                                : 'border-red-500/30 bg-red-500/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{lead.estado === 'won' ? '🎉' : '❌'}</span>
                                                <h4 className="text-white text-sm font-medium truncate">{lead.nombre}</h4>
                                            </div>
                                            <p className="text-zinc-600 text-xs truncate mt-0.5">{lead.direccion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ==================== DETAIL MODAL ==================== */}
            {selectedLead && (() => {
                const ld = getLeadData(selectedLead);
                const analysis = getAnalysis(selectedLead);
                const isDark = theme === 'dark';
                return (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 ${isDark ? 'bg-black/90' : 'bg-black/50'}`}>
                        <div className={`border rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto flex flex-col shadow-2xl transition-colors ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-gray-200'
                            }`}>
                            {/* Modal Header */}
                            <div className={`p-6 border-b flex justify-between items-start sticky top-0 z-10 transition-colors ${isDark ? 'border-white/10 bg-zinc-950' : 'border-gray-200 bg-white'
                                }`}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className={`text-2xl font-light truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{ld.title}</h2>
                                        <ScoreIndicator score={analysis.score || selectedLead.puntaje_oportunidad || 0} />
                                    </div>
                                    <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ld.address}</span>
                                        {ld.rating && (
                                            <span className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-3 h-3 fill-current" /> {ld.rating}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {ld.website && (
                                        <a
                                            href={ld.website}
                                            target="_blank"
                                            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-500' : 'text-blue-500'}`} />
                                            Ver Sitio Web
                                        </a>
                                    )}
                                    <button onClick={() => setSelectedLead(null)} className={`text-2xl p-2 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>&times;</button>
                                </div>
                            </div>

                            {/* Modal Body - Refactored for Premium Look & Order */}
                            <div className="p-6 overflow-y-auto max-h-[85vh]">
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                                    {/* COLUMN 1: INTELLIGENCE & ANALYSIS (3/5) */}
                                    <div className="lg:col-span-3 space-y-6">
                                        {/* AI ANALYSIS CARD */}
                                        <div className={`backdrop-blur-xl rounded-3xl p-6 border space-y-6 shadow-2xl relative overflow-hidden transition-colors ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-gray-50 border-gray-200'
                                            }`}>
                                            {isDark && <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>}

                                            <div className="flex items-center justify-between relative">
                                                <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                                                    <Target className="w-4 h-4" /> Diagnóstico del Lead
                                                </h3>
                                                <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-tighter ${isDark ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-gray-100 border-gray-200 text-gray-500'
                                                    }`}>
                                                    Vibe: {analysis.vibe || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="space-y-4 relative">
                                                {(selectedLead.razon_ia?.includes('Error AI') || analysis.analysisReport?.includes('Error AI')) ? (
                                                    <div className="flex flex-col gap-3">
                                                        <p className="text-[13px] text-red-400 leading-relaxed font-light">
                                                            ⚠️ {selectedLead.razon_ia || analysis.analysisReport}
                                                        </p>
                                                        <button
                                                            onClick={async () => {
                                                                setIsReanalyzing(true);
                                                                try {
                                                                    const res = await fetch('/api/radar/reanalyze', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ leadId: selectedLead.id })
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.success) {
                                                                        // Update the local lead data
                                                                        setSelectedLead((prev: any) => ({
                                                                            ...prev,
                                                                            razon_ia: data.analysis.analysisReport,
                                                                            puntaje_oportunidad: data.analysis.score,
                                                                            source_data: { ...prev.source_data, analysis: data.analysis }
                                                                        }));
                                                                        // Refresh history/pipeline if needed
                                                                        if (activeTab === 'history') {
                                                                            setHistoryLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, razon_ia: data.analysis.analysisReport, source_data: { ...l.source_data, analysis: data.analysis } } : l));
                                                                        } else if (activeTab === 'pipeline') {
                                                                            setPipelineLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, razon_ia: data.analysis.analysisReport, source_data: { ...l.source_data, analysis: data.analysis } } : l));
                                                                        }
                                                                    } else {
                                                                        alert('Error: ' + data.error);
                                                                    }
                                                                } catch (e: any) {
                                                                    alert('Error: ' + e.message);
                                                                } finally {
                                                                    setIsReanalyzing(false);
                                                                }
                                                            }}
                                                            disabled={isReanalyzing}
                                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all disabled:opacity-50"
                                                        >
                                                            {isReanalyzing ? (
                                                                <><Loader2 className="w-3 h-3 animate-spin" /> Re-analizando...</>
                                                            ) : (
                                                                <><Zap className="w-3 h-3" /> Re-analizar con IA</>
                                                            )}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className={`text-[13px] leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                        {analysis.analysisReport || analysis.reason || selectedLead.razon_ia || 'Sin análisis disponible'}
                                                    </p>
                                                )}

                                                {analysis.competitiveAnalysis && (
                                                    <div className={`rounded-2xl p-4 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-white border-gray-200'}`}>
                                                        <span className={`text-[9px] font-bold uppercase block mb-2 tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Contexto Competitivo</span>
                                                        <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>"{analysis.competitiveAnalysis}"</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Score Breakdown - Visual Checklist */}
                                            {analysis.scoreBreakdown && (
                                                <div className={`pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {[
                                                            { key: 'sinWeb', label: 'Web', icon: '🌐' },
                                                            { key: 'ratingBajo', label: 'Estrellas', icon: '⭐' },
                                                            { key: 'sinContactoDigital', label: 'Contacto', icon: '📧' },
                                                            { key: 'techObsoleta', label: 'Tech', icon: '⚙️' },
                                                            { key: 'sinRedesSociales', label: 'Social', icon: '📱' },
                                                        ].map(({ key, label, icon }) => {
                                                            const score = (analysis.scoreBreakdown as any)[key] || 0;
                                                            const isGood = score === 0;
                                                            return (
                                                                <div key={key} className={`text-center p-2.5 rounded-2xl border transition-all ${isGood ? 'bg-green-500/10 border-green-500/20 opacity-60' : 'bg-red-500/10 border-red-500/20'}`}>
                                                                    <div className="text-lg mb-1">{icon}</div>
                                                                    <div className={`text-[10px] font-black ${isGood ? 'text-green-600' : 'text-red-500'}`}>
                                                                        {isGood ? '✓' : `+${score}`}
                                                                    </div>
                                                                    <div className={`text-[7px] font-bold uppercase mt-1 tracking-tighter ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{label}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {/* OPPORTUNITY FACTORS GRID - Using REAL AI data */}
                                            <div className={`grid grid-cols-2 gap-3 mt-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                                                <div className={`p-3 rounded-2xl border transition-all group cursor-help ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`} title={analysis.salesStrategy?.painPoints?.length > 0 ? analysis.salesStrategy.painPoints.join(', ') : 'Sin pain points detectados'}>
                                                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Pain Points</span>
                                                    <p className="text-[10px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                                        {analysis.salesStrategy?.painPoints?.length > 0
                                                            ? analysis.salesStrategy.painPoints.slice(0, 2).join(', ')
                                                            : 'Sin pain points detectados'}
                                                    </p>
                                                </div>
                                                <div className={`p-3 rounded-2xl border transition-all group cursor-help ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`} title={analysis.salesStrategy?.proposedSolution || 'Pendiente análisis'}>
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest block mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Solución Propuesta</span>
                                                    <p className={`text-[10px] leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                        {analysis.salesStrategy?.proposedSolution || 'Pendiente análisis'}
                                                    </p>
                                                </div>
                                                <div className={`p-3 rounded-2xl border transition-all group cursor-help ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`} title={analysis.recommendedChannel || 'Email'}>
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest block mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canal Recomendado</span>
                                                    <p className={`text-[10px] leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                        {analysis.recommendedChannel || 'Email'}
                                                    </p>
                                                </div>
                                                <div className={`p-3 rounded-2xl border transition-all group cursor-help ${isDark ? 'bg-black/20 border-white/5 hover:border-cyan-500/20' : 'bg-white border-gray-200 hover:border-blue-300'}`} title={analysis.salesStrategy?.estimatedValue || 'Medio'}>
                                                    <span className={`text-[8px] font-bold uppercase tracking-widest block mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Valor Estimado</span>
                                                    <p className={`text-[10px] leading-relaxed transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                                        {analysis.salesStrategy?.estimatedValue || 'Medio'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TECH STACK CARD */}
                                        <div className={`rounded-3xl p-5 border transition-colors ${isDark ? 'bg-zinc-900/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                                    <Zap className="w-3 h-3 text-yellow-500" /> Infraestructura Técnica
                                                </h4>
                                                <div className={`px-2 py-0.5 rounded-full border text-[8px] font-bold flex items-center gap-1 ${ld.hasSSL ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                                    {ld.hasSSL ? 'SSL OK' : 'No Seguro'}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {(ld.techStack || []).length > 0 ? (
                                                    (ld.techStack || []).map((tech: string, i: number) => (
                                                        <span key={i} className={`px-2.5 py-1 border rounded-lg text-[10px] ${isDark ? 'bg-white/5 border-white/5 text-zinc-400' : 'bg-white border-gray-200 text-gray-600'}`}>
                                                            {tech}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className={`text-[10px] italic ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Detección básica completa</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUMN 2: EXECUTION & STRATEGY (2/5) */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* CONTACTS CARD (Smart & Editable) */}
                                        <div className={`rounded-3xl p-5 border relative group/contact transition-colors ${isDark ? 'bg-zinc-900/50 backdrop-blur-xl border-white/5' : 'bg-gray-50 border-gray-200'
                                            }`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canales de Contacto</h4>
                                                {!isEditingContact && (
                                                    <button
                                                        onClick={() => {
                                                            const d = getLeadData(selectedLead);
                                                            setEditData({ email: d.email || '', whatsapp: d.whatsapp || '', telefono: d.phone || '', demo_url: d.demo_url || '' });
                                                            setIsEditingContact(true);
                                                        }}
                                                        className={`text-[9px] font-bold transition-colors uppercase ${isDark ? 'text-cyan-500 hover:text-cyan-400' : 'text-blue-600 hover:text-blue-500'}`}
                                                    >
                                                        Editar Datos
                                                    </button>
                                                )}
                                            </div>

                                            {isEditingContact ? (
                                                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                                                    <div>
                                                        <label className={`text-[8px] font-bold uppercase ml-1 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>Email</label>
                                                        <input
                                                            value={editData.email}
                                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
                                                            placeholder="correo@empresa.com"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`text-[8px] font-bold uppercase ml-1 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>WhatsApp</label>
                                                        <input
                                                            value={editData.whatsapp}
                                                            onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                                                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'}`}
                                                            placeholder="569..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`text-[8px] font-bold uppercase ml-1 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>Teléfono</label>
                                                        <input
                                                            value={editData.telefono}
                                                            onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                                                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-zinc-500' : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'}`}
                                                            placeholder="+56 9 ..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={`text-[8px] font-bold uppercase ml-1 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>Demo URL</label>
                                                        <input
                                                            value={editData.demo_url}
                                                            onChange={(e) => setEditData({ ...editData, demo_url: e.target.value })}
                                                            className={`w-full border rounded-xl px-3 py-2 text-xs outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-purple-500' : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'}`}
                                                            placeholder="/prospectos/ejemplo"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 pt-1">
                                                        <button
                                                            disabled={isSaving}
                                                            onClick={async () => {
                                                                setIsSaving(true);
                                                                const leadId = selectedLead.id || selectedLead.db_id;
                                                                if (!leadId) return;
                                                                try {
                                                                    const updatedSourceData = {
                                                                        ...(selectedLead.source_data || {}),
                                                                        email: editData.email,
                                                                        emails: [editData.email, ...(selectedLead.source_data?.emails?.filter((e: string) => e !== editData.email) || [])].filter(Boolean),
                                                                        whatsapp: editData.whatsapp,
                                                                        phone: editData.telefono
                                                                    };
                                                                    await supabase.from('leads').update({
                                                                        email: editData.email,
                                                                        telefono: editData.telefono,
                                                                        demo_url: editData.demo_url,
                                                                        source_data: updatedSourceData
                                                                    }).eq('id', leadId);

                                                                    const updatedLead = { ...selectedLead, email: editData.email, whatsapp: editData.whatsapp, telefono: editData.telefono, demo_url: editData.demo_url, source_data: updatedSourceData };
                                                                    setSelectedLead(updatedLead);
                                                                    setPipelineLeads(pipelineLeads.map(l => (l.id === leadId || l.db_id === leadId) ? updatedLead : l));
                                                                    setIsEditingContact(false);
                                                                } catch (err) { console.error(err); } finally { setIsSaving(false); }
                                                            }}
                                                            className="flex-1 bg-cyan-500 text-black text-[10px] font-bold py-2.5 rounded-xl transition-all"
                                                        >
                                                            {isSaving ? 'Guardando...' : 'Guardar'}
                                                        </button>
                                                        <button onClick={() => setIsEditingContact(false)} className="px-3 bg-white/5 text-zinc-500 text-[10px] rounded-xl">
                                                            Cerrar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {/* Email */}
                                                    <div className={`flex items-center justify-between p-2 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <Mail className={`w-3 h-3 ${selectedLead.email ? (isDark ? 'text-cyan-400' : 'text-blue-500') : (isDark ? 'text-zinc-700' : 'text-gray-400')}`} />
                                                            <span className={`text-[11px] truncate max-w-[140px] ${selectedLead.email ? (isDark ? 'text-zinc-300' : 'text-gray-900') : (isDark ? 'text-zinc-700' : 'text-gray-400') + ' italic'}`}>
                                                                {selectedLead.email || 'Sin email'}
                                                            </span>
                                                        </div>
                                                        {selectedLead.email && (
                                                            <button onClick={() => copyToClipboard(selectedLead.email, 'email')} className={`transition-colors ${isDark ? 'text-zinc-700 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                                                                <Copy className="w-2.5 h-2.5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* WhatsApp */}
                                                    <div className={`flex items-center justify-between p-2 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <MessageCircle className={`w-3 h-3 ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? 'text-green-500' : (isDark ? 'text-zinc-700' : 'text-gray-400')}`} />
                                                            <span className={`text-[11px] ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? (isDark ? 'text-zinc-300' : 'text-gray-900') : (isDark ? 'text-zinc-700' : 'text-gray-400') + ' italic'}`}>
                                                                {selectedLead.whatsapp || selectedLead.source_data?.whatsapp || 'Sin WhatsApp'}
                                                            </span>
                                                        </div>
                                                        {(selectedLead.whatsapp || selectedLead.source_data?.whatsapp) && (
                                                            <button onClick={() => copyToClipboard(selectedLead.whatsapp || selectedLead.source_data?.whatsapp, 'wa')} className={`transition-colors ${isDark ? 'text-zinc-700 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                                                                <Copy className="w-2.5 h-2.5" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Demo URL Display */}
                                                    {selectedLead.demo_url && (
                                                        <div className={`flex items-center justify-between p-2 mt-2 rounded-xl border border-dashed ${isDark ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="w-3 h-3 text-purple-400" />
                                                                <span className={`text-[11px] font-medium truncate max-w-[140px] ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                                                                    URL Demo Activa
                                                                </span>
                                                            </div>
                                                            <a href={selectedLead.demo_url} target="_blank" className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-purple-500 text-white font-bold hover:bg-purple-400 transition-colors`}>
                                                                Ver <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                    )}

                                                    {/* Social & Meta */}
                                                    <div className="grid grid-cols-4 gap-2 pt-1">
                                                        {[
                                                            { icon: Phone, color: 'zinc', active: !!(selectedLead.telefono || selectedLead.source_data?.phone), link: `tel:${selectedLead.telefono || selectedLead.source_data?.phone}` },
                                                            { icon: Instagram, color: 'pink', active: !!ld.instagram, link: ld.instagram?.startsWith('http') ? ld.instagram : `https://instagram.com/${ld.instagram}` },
                                                            { icon: Facebook, color: 'blue', active: !!ld.facebook, link: ld.facebook?.startsWith('http') ? ld.facebook : `https://facebook.com/${ld.facebook}` },
                                                            { icon: Globe, color: 'cyan', active: !!ld.website, link: ld.website }
                                                        ].map((item, idx) => (
                                                            <div key={idx} className={`relative flex items-center justify-center p-2 rounded-xl border transition-all ${item.active ? `bg-${item.color}-500/10 border-${item.color}-500/20 text-${item.color}-400 hover:bg-${item.color}-500/20` : 'bg-zinc-900/50 border-white/5 text-zinc-800'}`}>
                                                                <item.icon className="w-3.5 h-3.5" />
                                                                {item.active && <a href={item.link} target="_blank" className="absolute inset-0"></a>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* SALES STRATEGY & ACTIONS CARD */}
                                        {analysis.salesStrategy ? (
                                            <div className={`border rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden transition-colors ${isDark ? 'bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-purple-500/10' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
                                                }`}>
                                                {isDark && <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full"></div>}

                                                <h3 className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                                    <Zap className={`w-3.5 h-3.5 ${isDark ? 'fill-purple-400/20' : 'fill-purple-500/30'}`} /> Estrategia Ganadora
                                                </h3>

                                                <div className={`relative group p-3 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                                                    <span className={`text-[8px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>Gancho de Apertura</span>
                                                    <p className={`text-[11px] italic leading-relaxed font-light pr-4 ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                        "{analysis.salesStrategy.hook}"
                                                    </p>
                                                    <button onClick={() => copyToClipboard(analysis.salesStrategy.hook, 'hook')} className={`absolute right-2 top-2 p-1 ${isDark ? 'text-zinc-700 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'}`}>
                                                        <Copy className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const wa = selectedLead.whatsapp || selectedLead.source_data?.whatsapp;
                                                            if (!wa) { setIsEditingContact(true); return; }
                                                            generateTemplate(selectedLead, 'whatsapp');
                                                        }}
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${!(selectedLead.whatsapp || selectedLead.source_data?.whatsapp)
                                                            ? 'bg-zinc-800/30 border-white/5 text-zinc-700'
                                                            : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'}`}
                                                    >
                                                        <MessageCircle className="w-3 h-3" /> WhatsApp IA
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const email = (selectedLead.email);
                                                            if (!email) { setIsEditingContact(true); return; }
                                                            generateTemplate(selectedLead, 'email');
                                                        }}
                                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-bold transition-all border ${!(selectedLead.email)
                                                            ? 'bg-zinc-800/30 border-white/5 text-zinc-700'
                                                            : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'}`}
                                                    >
                                                        <Mail className="w-3 h-3" /> Email IA
                                                    </button>
                                                </div>

                                                {/* AI Output Inline */}
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
                                                                {/* SEND BUTTONS */}
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
                                        <div className={`mt-6 border-t pt-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Notas Privadas</h3>

                                            {/* Input */}
                                            <div className="relative mb-4">
                                                <textarea
                                                    value={newNote}
                                                    onChange={(e) => setNewNote(e.target.value)}
                                                    placeholder="Agregar nota..."
                                                    className={`w-full rounded-xl p-3 text-xs pr-10 resize-none outline-none border transition-all ${isDark ? 'bg-zinc-900 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-200 text-gray-800'}`}
                                                    rows={2}
                                                />
                                                <button
                                                    onClick={saveNote}
                                                    disabled={!newNote.trim() || isSavingNote}
                                                    className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                                                >
                                                    <Save className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* List */}
                                            <div className="space-y-2 pl-2 border-l border-zinc-700/50 ml-1 max-h-[150px] overflow-y-auto custom-scrollbar">
                                                {notes.length === 0 ? (
                                                    <p className="text-[10px] text-zinc-500 italic pl-2">Sin notas</p>
                                                ) : (
                                                    notes.map((note) => (
                                                        <div key={note.id} className="relative pl-4 pb-2 group">
                                                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-zinc-900 border-yellow-500' : 'bg-white border-yellow-500'}`}></div>
                                                            <div className={`p-2 rounded-lg border text-xs whitespace-pre-wrap relative ${isDark ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                                                {note.contenido}
                                                                <button
                                                                    onClick={() => deleteNote(note.id)}
                                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-400"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                            <span className="text-[9px] text-zinc-600 pl-1 block mt-0.5">
                                                                {new Date(note.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                        {/* ACTIVITY LOG */}
                                        <div className={`mt-6 border-t pt-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Historial de Actividad</h3>

                                            <div className="space-y-3 pl-2 border-l border-zinc-700/50 ml-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                                {leadActivities.length === 0 ? (
                                                    <p className="text-xs text-zinc-500 italic pl-2">Sin actividad registrada</p>
                                                ) : (
                                                    leadActivities.map((log) => (
                                                        <div key={log.id} className="relative pl-4 pb-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-zinc-900 border-zinc-600' : 'bg-white border-gray-300'}`}></div>
                                                            <div className="flex flex-col">
                                                                <div className="flex justify-between items-start">
                                                                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                                                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <span className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                                                                    {log.accion === 'contacted' ? '💬 Contactado' :
                                                                        log.accion === 'proposal_sent' ? '📄 Propuesta Enviada' :
                                                                            log.accion === 'qualified' ? '✅ Calificado' :
                                                                                log.accion === 'discarded' ? '🗑️ Descartado' :
                                                                                    log.accion === 'closed_won' ? '🎉 Ganado' :
                                                                                        log.accion === 'closed_lost' ? '❌ Perdido' : log.accion}
                                                                </span>
                                                                {log.nota && (
                                                                    <p className="text-[10px] text-zinc-500 mt-1 italic bg-white/5 p-1 rounded">
                                                                        "{log.nota}"
                                                                    </p>
                                                                )}
                                                                <span className="text-[9px] text-zinc-600 mt-1">
                                                                    por {log.usuario} • {log.estado_anterior} → {log.estado_nuevo}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - CONTEXTUAL based on lead state */}
                            <div className="p-6 border-t border-white/10 bg-zinc-900/50 sticky bottom-0 space-y-4">

                                {/* === ESTADO: detected (leads nuevos del escáner) === */}
                                {(!selectedLead.estado || selectedLead.estado === 'detected') && (
                                    <>
                                        {/* Review Note Input */}
                                        <div>
                                            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                                                📝 Nota de revisión (opcional)
                                            </label>
                                            <textarea
                                                value={reviewNote}
                                                onChange={(e) => setReviewNote(e.target.value)}
                                                placeholder="Ej: Cliente tiene web fea, contactar por email, revisar SEO urgente..."
                                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 resize-none"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-zinc-600">
                                                Zona: {selectedLead.zona_busqueda || location} • {currentUser}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={async () => {
                                                        setIsSaving(true);
                                                        const leadId = selectedLead.id || selectedLead.db_id;
                                                        if (leadId) {
                                                            await supabase.from('leads').update({
                                                                estado: 'discarded',
                                                                nota_revision: reviewNote || 'Descartado sin nota',
                                                                revisado_por: currentUser,
                                                                revisado_at: new Date().toISOString()
                                                            }).eq('id', leadId);
                                                            await logActivity(leadId, 'discarded', selectedLead.estado || 'detected', 'discarded', reviewNote || 'Descartado desde escáner');
                                                        }
                                                        setLeads(leads.filter(l => l.id !== leadId && l.db_id !== leadId));
                                                        setSelectedLead(null);
                                                        setReviewNote('');
                                                        setIsSaving(false);
                                                    }}
                                                    disabled={isSaving}
                                                    className="px-5 py-3 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Descartar
                                                </button>
                                                <button
                                                    onClick={() => setSelectedLead(null)}
                                                    className="px-5 py-3 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5 transition-colors"
                                                >
                                                    Cerrar
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const leadId = selectedLead.id || selectedLead.db_id;
                                                        if (!leadId) return;
                                                        setIsSaving(true);
                                                        try {
                                                            await supabase.from('leads').update({
                                                                estado: 'ready_to_contact',
                                                                nota_revision: reviewNote,
                                                                revisado_por: currentUser,
                                                                revisado_at: new Date().toISOString()
                                                            }).eq('id', leadId);
                                                            await logActivity(leadId, 'qualified', selectedLead.estado || 'detected', 'ready_to_contact', reviewNote || 'Movido a pipeline para contactar');

                                                            const { data } = await supabase
                                                                .from('leads')
                                                                .select('*')
                                                                .eq('fuente', 'radar')
                                                                .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                                .order('created_at', { ascending: false });
                                                            if (data) setPipelineLeads(data);

                                                            // Remove from local lists
                                                            setLeads(prev => prev.filter(l => l.id !== leadId && l.db_id !== leadId));
                                                            setHistoryLeads(prev => prev.filter(l => l.id !== leadId && l.db_id !== leadId));

                                                            setSelectedLead(null);
                                                            setReviewNote('');
                                                        } catch (err) {
                                                            console.error('Error qualifying lead:', err);
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    disabled={isSaving}
                                                    className="px-6 py-3 rounded-xl font-bold text-sm bg-green-500 text-black hover:bg-green-400 transition-all shadow-lg flex items-center gap-2"
                                                >
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                    Guardar para Contacto
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* === ESTADO: ready_to_contact (en el Pipeline) === */}
                                {selectedLead.estado === 'ready_to_contact' && (
                                    <>
                                        {/* Nota existente (solo lectura) */}
                                        {selectedLead.nota_revision && (
                                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                                                <span className="text-[10px] text-yellow-500 font-bold uppercase block mb-1">📝 Nota de revisión</span>
                                                <p className="text-yellow-400 text-sm">{selectedLead.nota_revision}</p>
                                                <p className="text-xs text-zinc-600 mt-1">por {selectedLead.revisado_por} • {new Date(selectedLead.revisado_at).toLocaleDateString()}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-zinc-600">
                                                Estado: <span className="text-green-400 font-medium">Listo para Contactar</span> • {currentUser}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        const leadId = selectedLead.id || selectedLead.db_id;
                                                        if (!leadId) return;
                                                        setIsSaving(true);
                                                        try {
                                                            await supabase.from('leads').update({
                                                                estado: 'discarded',
                                                                revisado_por: currentUser,
                                                                revisado_at: new Date().toISOString()
                                                            }).eq('id', leadId);
                                                            await logActivity(leadId, 'discarded', 'ready_to_contact', 'discarded', 'Descartado desde pipeline');
                                                            const { data } = await supabase
                                                                .from('leads')
                                                                .select('*')
                                                                .eq('fuente', 'radar')
                                                                .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                                .order('created_at', { ascending: false });
                                                            if (data) setPipelineLeads(data);
                                                            setSelectedLead(null);
                                                        } catch (err) {
                                                            console.error('Error discarding lead:', err);
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    disabled={isSaving}
                                                    className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Descartar
                                                </button>
                                                <button
                                                    onClick={() => setSelectedLead(null)}
                                                    className="px-4 py-2.5 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5 transition-colors"
                                                >
                                                    Cerrar
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const leadId = selectedLead.id || selectedLead.db_id;
                                                        if (!leadId) return;
                                                        setIsSaving(true);
                                                        try {
                                                            await supabase.from('leads').update({
                                                                estado: 'in_contact',
                                                                revisado_por: currentUser,
                                                                revisado_at: new Date().toISOString()
                                                            }).eq('id', leadId);
                                                            await logActivity(leadId, 'contacted', 'ready_to_contact', 'in_contact', 'Primer contacto realizado');

                                                            const { data } = await supabase
                                                                .from('leads')
                                                                .select('*')
                                                                .eq('fuente', 'radar')
                                                                .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                                .order('created_at', { ascending: false });

                                                            if (data) setPipelineLeads(data);
                                                            setSelectedLead(null);
                                                        } catch (err) {
                                                            console.error('Error updating status:', err);
                                                        } finally {
                                                            setIsSaving(false);
                                                        }
                                                    }}
                                                    disabled={isSaving}
                                                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-lg flex items-center gap-2"
                                                >
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                                                    Marcar Contactado
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* === ESTADO: in_contact (ya contactado) === */}
                                {selectedLead.estado === 'in_contact' && (
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-zinc-600">
                                            Estado: <span className="text-cyan-400 font-medium">En Contacto</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'discarded',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        await logActivity(leadId, 'discarded', 'in_contact', 'discarded', 'Descartado después de contacto');
                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error discarding in_contact lead:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Descartar
                                            </button>
                                            <button onClick={() => setSelectedLead(null)} className="px-4 py-2.5 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5">Cerrar</button>
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'proposal_sent',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        await logActivity(leadId, 'proposal_sent', 'in_contact', 'proposal_sent', 'Propuesta comercial enviada');

                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error sent proposal:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-purple-500 text-white hover:bg-purple-400 transition-all flex items-center gap-2"
                                            >
                                                📄 Propuesta Enviada
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* === ESTADO: proposal_sent === */}
                                {selectedLead.estado === 'proposal_sent' && (
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-zinc-600">
                                            Estado: <span className="text-purple-400 font-medium">Propuesta Enviada</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'discarded',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        await logActivity(leadId, 'discarded', 'proposal_sent', 'discarded', 'Descartado después de propuesta');
                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error discarding proposal lead:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Descartar
                                            </button>
                                            <button onClick={() => setSelectedLead(null)} className="px-4 py-2.5 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5">Cerrar</button>
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'lost',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        await logActivity(leadId, 'closed_lost', 'proposal_sent', 'lost', 'Cliente no aceptó la propuesta');

                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error closing lost:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/20 text-red-400 border border-red-500/30"
                                            >
                                                ❌ Perdido
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'won',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        await logActivity(leadId, 'closed_won', 'proposal_sent', 'won', '¡Cliente cerrado! Nueva venta');

                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error closing won:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-green-500 text-black hover:bg-green-400 shadow-lg flex items-center gap-2"
                                            >
                                                🎉 Ganado!
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {['won', 'lost'].includes(selectedLead.estado) && (
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-zinc-600">
                                            Resultado: <span className={selectedLead.estado === 'won' ? 'text-green-400' : 'text-red-400'}>
                                                {selectedLead.estado === 'won' ? '🎉 Ganado' : '❌ Perdido'}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'discarded',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error discarding closed lead:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-medium text-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                                            >
                                                Descartar
                                            </button>
                                            <button onClick={() => setSelectedLead(null)} className="px-4 py-2.5 rounded-xl font-medium text-sm text-zinc-400 hover:bg-white/5">Cerrar</button>
                                            <button
                                                onClick={async () => {
                                                    const leadId = selectedLead.id || selectedLead.db_id;
                                                    if (!leadId) return;
                                                    setIsSaving(true);
                                                    try {
                                                        await supabase.from('leads').update({
                                                            estado: 'ready_to_contact',
                                                            revisado_por: currentUser,
                                                            revisado_at: new Date().toISOString()
                                                        }).eq('id', leadId);
                                                        const { data } = await supabase
                                                            .from('leads')
                                                            .select('*')
                                                            .eq('fuente', 'radar')
                                                            .in('estado', ['ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'])
                                                            .order('created_at', { ascending: false });
                                                        if (data) setPipelineLeads(data);
                                                        setSelectedLead(null);
                                                    } catch (err) {
                                                        console.error('Error recycling lead:', err);
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700 transition-all flex items-center gap-2"
                                            >
                                                ♻️ Reciclar Lead
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

// Score Indicator Component
function ScoreIndicator({ score }: { score: number }) {
    let colorClass = 'bg-zinc-700 text-zinc-400 border-zinc-600';
    if (score >= 80) colorClass = 'bg-green-500 text-black border-green-400 font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]';
    else if (score >= 50) colorClass = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    else if (score > 0) colorClass = 'bg-red-500/20 text-red-500 border-red-500/30';

    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border ${colorClass} transition-all`}>
            {score}
        </div>
    );
}

// Target Icon Component
function TargetIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500 animate-pulse">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-20" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="opacity-50" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
    );
}
