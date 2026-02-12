'use client';

import React, { useState, useEffect } from 'react';
import { X, Archive, History, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';

interface CementerioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore?: () => void; // Callback when a lead is restored
    isDark?: boolean;
}

type LostLead = {
    id: string;
    nombre: string;
    categoria: string;
    description: string;
    status_date: string;
    pipeline_stage: string;
    estado: string;
};

export const CementerioModal = ({ isOpen, onClose, onRestore, isDark = true }: CementerioModalProps) => {
    const [lostLeads, setLostLeads] = useState<LostLead[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchLostLeads();
        }
    }, [isOpen]);

    const fetchLostLeads = async () => {
        setIsLoading(true);
        try {
            // Corrected query based on useRadar.ts patterns
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .in('estado', ['lost', 'closed_lost', 'discarded'])
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setLostLeads(data.map((l: any) => ({
                id: l.id,
                nombre: l.nombre || 'Lead Sin Nombre',
                categoria: l.categoria || l.rubro || 'Sin categoría',
                description: l.descripcion_negocio || 'Sin descripción',
                status_date: l.created_at,
                pipeline_stage: l.pipeline_stage,
                estado: l.estado
            })));
        } catch (error) {
            console.error('Error fetching lost leads:', error);
            toast.error('Error al cargar el cementerio');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id: string) => {
        try {
            const { error } = await supabase
                .from('leads')
                .update({ pipeline_stage: 'radar', estado: 'ready_to_contact' }) // Restore to Radar
                .eq('id', id);

            if (error) throw error;

            toast.success('Lead revivido exitosamente');
            // Remove locally
            setLostLeads(prev => prev.filter(l => l.id !== id));
            if (onRestore) onRestore();
        } catch (error) {
            console.error('Error restoring lead:', error);
            toast.error('Error al revivir el lead');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className={`w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/10 bg-zinc-900/50' : 'border-gray-100 bg-gray-50/80'}`}>
                    <div>
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <span className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                <Archive className="w-5 h-5" />
                            </span>
                            El Cementerio
                        </h2>
                        <p className={`text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Historial de oportunidades perdidas</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
                            <RotateCcw className="w-6 h-6 animate-spin" />
                            <p className="text-xs">Exhumando registros...</p>
                        </div>
                    ) : lostLeads.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-20 space-y-4 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                            <History className="w-12 h-12 opacity-20" />
                            <p className="text-sm">No hay almas en pena aquí.</p>
                        </div>
                    ) : (
                        lostLeads.map((lead) => (
                            <div key={lead.id} className={`group p-4 rounded-xl border transition-all relative overflow-hidden ${isDark ? 'bg-zinc-900/30 border-white/5 hover:bg-zinc-900/80 hover:border-white/10' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'}`}>
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleRestore(lead.id)}
                                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                                        title="Revivir al Pipeline"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Revivir
                                    </button>
                                </div>

                                <div className="pr-10">
                                    <h3 className={`font-bold ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>{lead.nombre}</h3>
                                    <div className="flex items-center gap-2 mt-1 mb-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDark ? 'bg-zinc-800 text-zinc-400 border-white/5' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {lead.categoria}
                                        </span>
                                        <span className={`text-[10px] ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                            {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(lead.status_date))}
                                        </span>
                                    </div>
                                    <p className={`text-xs line-clamp-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{lead.description}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t text-center ${isDark ? 'border-white/10 bg-zinc-900/50' : 'border-gray-100 bg-gray-50/50'}`}>
                    <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                        Total en descanso: <span className={`font-bold ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>{lostLeads.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
