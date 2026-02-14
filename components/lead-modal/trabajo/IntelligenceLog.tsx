
import React, { useState } from 'react';
import { Brain, Save, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

type IntelligenceNote = {
    id: string;
    content: string;
    author: 'Antigravity' | 'User';
    created_at: string;
};

interface IntelligenceLogProps {
    leadId: string;
    isDark: boolean;
    initialNotes?: unknown[];
}

export function IntelligenceLog({ leadId, isDark, initialNotes = [] }: IntelligenceLogProps) {
    const normalizedInitialNotes: IntelligenceNote[] = initialNotes
        .map((note, idx) => {
            if (!note || typeof note !== 'object') return null;
            const record = note as Record<string, unknown>;
            const content = typeof record.content === 'string' ? record.content : '';
            if (!content) return null;
            return {
                id: typeof record.id === 'string' ? record.id : `${Date.now()}-${idx}`,
                content,
                author: record.author === 'User' ? 'User' : 'Antigravity',
                created_at: typeof record.created_at === 'string' ? record.created_at : new Date().toISOString()
            };
        })
        .filter((note): note is IntelligenceNote => note !== null);
    const [notes, setNotes] = useState<IntelligenceNote[]>(normalizedInitialNotes);
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [author, setAuthor] = useState<'Antigravity' | 'User'>('Antigravity');

    const supabase = createClient();

    const handleSaveNote = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        try {
            const noteEntry = {
                id: Date.now().toString(),
                content: newNote,
                author: author,
                created_at: new Date().toISOString()
            };

            const updatedNotes = [noteEntry, ...notes];

            // Persist in source_data.intelligence_log
            const { data: lead } = await supabase.from('leads').select('source_data').eq('id', leadId).single();
            const updatedSourceData = {
                ...(lead?.source_data || {}),
                intelligence_log: updatedNotes
            };

            await supabase.from('leads').update({ source_data: updatedSourceData }).eq('id', leadId);

            setNotes(updatedNotes);
            setNewNote('');
            toast.success('Nota de inteligencia guardada');
        } catch (err) {
            console.error(err);
            toast.error('Error al guardar nota');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Brain className="w-4 h-4 text-purple-400" /> Cerebro del Lead
                    </h4>
                    <p className="text-[10px] text-zinc-500">Bitácora de investigación, hallazgos IA y contexto persistente</p>
                </div>
                <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
                    <button
                        onClick={() => setAuthor('Antigravity')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${author === 'Antigravity' ? 'bg-purple-500 text-white' : 'text-zinc-500'}`}
                    >
                        IA
                    </button>
                    <button
                        onClick={() => setAuthor('User')}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${author === 'User' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
                    >
                        YO
                    </button>
                </div>
            </div>

            {/* Note Editor */}
            <div className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder={author === 'Antigravity' ? 'Escribe aquí los hallazgos de investigación que quieres que yo recuerde...' : 'Añade contexto o instrucciones específicas para mi investigación...'}
                    rows={4}
                    className={`w-full bg-transparent text-sm resize-none outline-none ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
                <div className="flex justify-end mt-2 pt-2 border-t border-white/5">
                    <button
                        onClick={handleSaveNote}
                        disabled={isSaving || !newNote.trim()}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase flex items-center gap-2 transition-all ${isSaving || !newNote.trim()
                                ? 'bg-zinc-800 text-zinc-600'
                                : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20'
                            }`}
                    >
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Guardar Hallazgo
                    </button>
                </div>
            </div>

            {/* Intelligence Timeline */}
            <div className="space-y-4">
                {notes.length === 0 ? (
                    <div className="py-8 text-center space-y-2 opacity-30">
                        <Sparkles className="w-6 h-6 mx-auto text-purple-400" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Esperando primer descubrimiento</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="relative pl-6 border-l border-white/10 py-1">
                            {/* Dot */}
                            <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${note.author === 'Antigravity' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-zinc-500'}`} />

                            <div className={`flex items-center gap-2 mb-1`}>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${note.author === 'Antigravity' ? 'text-purple-400' : 'text-zinc-400'}`}>
                                    {note.author === 'Antigravity' ? 'Inteligencia IA' : 'Nota de Usuario'}
                                </span>
                                <span className="text-[9px] text-zinc-600 font-mono">
                                    {new Date(note.created_at).toLocaleString('es-CL', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className={`p-3 rounded-xl text-xs leading-relaxed ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                                {note.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
