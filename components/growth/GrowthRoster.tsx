'use client';

import { useState, useEffect } from 'react';
import {
    ArrowRight, Search, Plus, Filter, Layout, Calendar, ChevronRight,
    Rocket, Shield, Zap, Crown, Settings, Trash2, Loader2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { ClientImporter } from './ClientImporter';

interface GrowthClient {
    id: string;
    client_name: string;
    website: string;
    plan_tier: string;
    health_score: number;
    status: string;
    next_audit_date: string;
}

interface GrowthRosterProps {
    onSelectClient: (clientId: string) => void;
}

export function GrowthRoster({ onSelectClient }: GrowthRosterProps) {
    const [clients, setClients] = useState<GrowthClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchClients = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('growth_clients')
                .select('*')
                .order('client_name');

            if (error) throw error;
            if (data) setClients(data);
        } catch (err) {
            console.error('Error fetching growth clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClient = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (!confirm(`¿Estás seguro de que quieres eliminar a "${name}" de Growth? Se borrarán todas sus tareas.`)) return;

        setDeletingId(id);
        try {
            await supabase.from('growth_tasks').delete().eq('client_id', id);
            const { error } = await supabase.from('growth_clients').delete().eq('id', id);

            if (error) throw error;
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Error al eliminar cliente');
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchClients();

        const channel = supabase.channel('growth_roster_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'growth_clients' }, () => {
                fetchClients();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredClients = clients.filter(c =>
        c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.website.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-purple-500" />
                <p>Cargando Cartera...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Import Modal */}
            {showImportModal && (
                <ClientImporter
                    onImported={() => { fetchClients(); setShowImportModal(false); }}
                    onClose={() => setShowImportModal(false)}
                />
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Rocket className="w-6 h-6 text-purple-500" />
                        Cartera de Crecimiento
                    </h2>
                    <p className="text-zinc-500 text-sm mt-1">Gestiona los planes activos y la salud de tus clientes</p>
                </div>
                <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Cliente
                </button>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar cliente por nombre o dominio..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-sm text-zinc-400 hover:bg-white/5 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filtros
                </button>
            </div>

            <div className="grid grid-cols-12 gap-4 px-4 mb-4 text-[10px] items-center font-bold text-zinc-500 uppercase tracking-widest">
                <div className="col-span-4">Cliente / Dominio</div>
                <div className="col-span-2 text-center">Plan</div>
                <div className="col-span-2 text-center">Salud</div>
                <div className="col-span-2 text-center">Próxima Auditoría</div>
                <div className="col-span-2"></div>
            </div>

            <div className="space-y-3">
                {filteredClients.map(client => (
                    <div
                        key={client.id}
                        onClick={() => onSelectClient(client.id)}
                        className="group grid grid-cols-12 gap-4 items-center bg-zinc-900/30 hover:bg-zinc-800/40 border border-white/5 hover:border-purple-500/30 p-4 rounded-2xl cursor-pointer transition-all"
                    >
                        <div className="col-span-4 min-w-0 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                                <img
                                    src={`https://www.google.com/s2/favicons?domain=${client.website}&sz=64`}
                                    alt=""
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.client_name)}&background=8b5cf6&color=fff&bold=true`;
                                    }}
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-white truncate group-hover:text-purple-300 transition-colors">{client.client_name}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://${client.website}`, '_blank');
                                    }}
                                    className="text-xs text-zinc-500 hover:text-cyan-400 flex items-center gap-1 transition-colors hover:underline"
                                >
                                    {client.website}
                                    <ArrowRight className="w-3 h-3 -rotate-45" />
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${client.plan_tier === 'dominance' || client.plan_tier === 'enterprise' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                client.plan_tier === 'velocity' || client.plan_tier === 'custom' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                    client.plan_tier === 'foundation' || client.plan_tier === 'medio' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' :
                                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}>
                                {client.plan_tier}
                            </span>
                        </div>

                        <div className="col-span-2 flex items-center gap-2 justify-center px-4">
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden shrink-0">
                                <div
                                    className={`h-full rounded-full ${client.health_score >= 80 ? 'bg-green-500' : client.health_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${client.health_score}%` }}
                                />
                            </div>
                            <span className={`text-xs font-bold ${client.health_score >= 80 ? 'text-green-500' :
                                client.health_score >= 50 ? 'text-amber-500' :
                                    'text-red-500'
                                }`}>{client.health_score}</span>
                        </div>

                        <div className={`col-span-2 text-center text-xs font-mono ${new Date(client.next_audit_date) < new Date() ? 'text-red-400' : 'text-zinc-400'
                            }`}>
                            {new Date(client.next_audit_date).toLocaleDateString()}
                        </div>

                        <div className="col-span-2 flex justify-end items-center gap-4 pr-2">
                            <button
                                onClick={(e) => handleDeleteClient(e, client.id, client.client_name)}
                                disabled={deletingId === client.id}
                                className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Eliminar de Growth"
                            >
                                {deletingId === client.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                            <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
