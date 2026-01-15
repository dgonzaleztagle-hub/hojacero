'use client';

import { useState, useEffect } from 'react';
import { Search, PenSquare, Mail, Trash2, Phone, Globe, Calendar, Clock, Save } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function InboxPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [currentUser] = useState('Daniel'); // TODO: Auth integration
    const supabase = createClient();

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        if (selectedLead) {
            fetchNotes(selectedLead.id);
        } else {
            setNotes([]);
        }
    }, [selectedLead]);

    const fetchLeads = async () => {
        console.log("Fetching leads from Supabase...");
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        console.log("Supabase Response:", { data, error });

        if (data) setLeads(data);
        setLoading(false);
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
        if (!newNote.trim() || !selectedLead) return;
        setIsSavingNote(true);
        try {
            const { error } = await supabase.from('lead_notas').insert({
                lead_id: selectedLead.id,
                contenido: newNote,
                categoria: 'general'
            });
            if (error) throw error;
            setNewNote('');
            fetchNotes(selectedLead.id);
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

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Agenda / Inbox</h1>
                    <p className="text-zinc-500 text-sm mt-1">Gestión de Leads & Oportunidades <span className="text-cyan-500 text-xs ml-2">● SYNCED</span></p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                    <PenSquare className="w-4 h-4" />
                    Nueva Nota
                </button>
            </div>

            {/* Main Interface */}
            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden flex">

                {/* Lead List (Sidebar) */}
                <div className="w-1/3 border-r border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Buscar leads..."
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors 
                                    ${selectedLead?.id === lead.id ? 'bg-white/10 border-l-2 border-cyan-400' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium text-white truncate max-w-[70%]">{lead.nombre}</span>
                                    {lead.puntaje_oportunidad > 80 && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-mono">
                                            {lead.puntaje_oportunidad}%
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm mb-1 truncate text-zinc-400">{lead.sitio_web || 'Sin Sitio Web'}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusStyle(lead.estado)}`}>
                                        {lead.estado.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-zinc-600 ml-auto">{new Date(lead.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Detail Pane */}
                <div className="flex-1 flex flex-col">
                    {selectedLead ? (
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            {/* Header */}
                            <div className="p-8 border-b border-white/5 bg-black/20">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-light text-white">{selectedLead.nombre}</h2>
                                    <div className="flex gap-2">
                                        <button className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Globe className="w-4 h-4 text-zinc-600" />
                                        <a href={selectedLead.sitio_web} target="_blank" className="hover:text-cyan-400 transition-colors truncate">{selectedLead.sitio_web || 'N/A'}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Phone className="w-4 h-4 text-zinc-600" />
                                        <span>{selectedLead.telefono || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Calendar className="w-4 h-4 text-zinc-600" />
                                        <span>Seguimiento: {selectedLead.fecha_proximo_seguimiento ? new Date(selectedLead.fecha_proximo_seguimiento).toLocaleDateString() : 'No programado'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Context */}
                            <div className="p-8 border-b border-white/5">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Inteligencia Artificial</h3>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-zinc-300 text-sm italic">"{selectedLead.razon_ia}"</p>
                                    <div className="mt-3 flex gap-2">
                                        <span className="text-xs bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded border border-cyan-500/20">
                                            Oportunidad: {selectedLead.categoria}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes / History (Mock for now) */}
                            {/* Notes / History */}
                            <div className="p-8 flex-1 bg-zinc-900/30 flex flex-col min-h-[400px]">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Notas & Bitácora</h3>

                                {/* New Note Input */}
                                <div className="mb-6 relative">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Escribe una nota rápida, recordatorio o detalle importante..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 resize-none h-24 transition-all"
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                        <button
                                            onClick={saveNote}
                                            disabled={!newNote.trim() || isSavingNote}
                                            className="bg-cyan-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-900/20"
                                        >
                                            <Save className="w-3 h-3" />
                                            {isSavingNote ? 'Guardando...' : 'Guardar Nota'}
                                        </button>
                                    </div>
                                </div>

                                {/* Notes List */}
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {notes.length === 0 ? (
                                        <div className="text-center py-8 text-zinc-600 text-sm italic border border-white/5 border-dashed rounded-xl">
                                            No hay notas registradas para este lead.
                                        </div>
                                    ) : (
                                        notes.map((note) => (
                                            <div key={note.id} className="bg-black/40 border border-white/5 p-4 rounded-xl group hover:border-white/10 transition-colors animate-in fade-in slide-in-from-bottom-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] text-zinc-500 font-mono">
                                                        {new Date(note.created_at).toLocaleDateString()} • {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <button
                                                        onClick={() => deleteNote(note.id)}
                                                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{note.contenido}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">Selecciona un lead para gestionar</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'nuevo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'contactado': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'cerrado': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
}
