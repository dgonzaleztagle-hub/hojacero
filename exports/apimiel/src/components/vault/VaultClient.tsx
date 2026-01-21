'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, Plus } from 'lucide-react';
import { Cliente } from './types';
import { getEstado } from './utils';
import VaultList from './VaultList';
import VaultDetail from './VaultDetail';

export default function VaultClient() {
    const supabase = createClient();

    // State
    const [clients, setClients] = useState<Cliente[]>([]);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'activos' | 'criticos'>('activos');
    const [loading, setLoading] = useState(true);

    // Fetch Logic
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        setLoading(true);
        // Optimized Fetch: Only what we need
        const { data: sitesData, error } = await supabase
            .from('monitored_sites')
            .select(`
                *,
                site_status (is_active)
            `)
            .eq('status', 'active')
            .order('client_name');

        if (error) {
            console.error('Vault Error:', error);
            setLoading(false);
            return;
        }

        // Hydrate with auxiliary data (Payments, Alerts)
        // Note: In V2 this should be an Edge Function or View, but keeping logic for now
        const hydratedClients = await Promise.all((sitesData || []).map(async (site) => {
            const { data: pagoData } = await supabase
                .from('pagos')
                .select('fecha_pago')
                .eq('site_id', site.id)
                .eq('tipo', 'mantencion')
                .order('fecha_pago', { ascending: false })
                .limit(1);

            const { count: alertasCount } = await supabase
                .from('alertas_enviadas')
                .select('*', { count: 'exact', head: true })
                .eq('site_id', site.id);

            return {
                ...site,
                is_active: site.site_status?.[0]?.is_active ?? true,
                ultimo_pago: pagoData?.[0]?.fecha_pago || null,
                alertas_count: alertasCount || 0,
            };
        }));

        setClients(hydratedClients as Cliente[]);
        setLoading(false);
    };

    // Filter Logic
    const { filteredClients, criticalCount } = useMemo(() => {
        const query = searchQuery.toLowerCase();

        const allFiltered = clients.filter(c =>
            c.client_name.toLowerCase().includes(query) ||
            c.site_url.toLowerCase().includes(query)
        );

        const critical = allFiltered.filter(c => getEstado(c.ultimo_pago, c.dia_cobro).esCritico);

        let result = activeTab === 'activos'
            ? allFiltered.filter(c => !getEstado(c.ultimo_pago, c.dia_cobro).esCritico)
            : critical;

        // Sort by priority logic
        result.sort((a, b) => {
            const prioA = getEstado(a.ultimo_pago, a.dia_cobro).prioridad;
            const prioB = getEstado(b.ultimo_pago, b.dia_cobro).prioridad;
            return prioA - prioB;
        });

        return {
            filteredClients: result,
            criticalCount: clients.filter(c => getEstado(c.ultimo_pago, c.dia_cobro).esCritico).length
        };
    }, [clients, searchQuery, activeTab]);


    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden relative">

            {/* Left Panel: List & Search */}
            <div className="flex-1 flex flex-col h-full overflow-hidden p-6 gap-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">VAULT</h1>
                        <p className="text-zinc-500 text-sm">Gestión de Activos y Credenciales</p>
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20">
                        <Plus className="w-4 h-4" /> Nuevo Cliente
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Tabs */}
                    <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5 self-start">
                        <button
                            onClick={() => setActiveTab('activos')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'activos' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            Activos
                        </button>
                        <button
                            onClick={() => setActiveTab('criticos')}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'criticos' ? 'bg-red-500/10 text-red-500 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            Críticos {criticalCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{criticalCount}</span>}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dominio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all placeholder-zinc-600"
                        />
                    </div>
                </div>

                {/* List Grid */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <VaultList
                        clientes={filteredClients}
                        selectedId={selectedClient?.id || null}
                        onSelect={setSelectedClient}
                        isLoading={loading}
                    />
                </div>
            </div>

            {/* Right Panel: Detail (Drawer on Mobile) */}
            <VaultDetail
                cliente={selectedClient}
                onClose={() => setSelectedClient(null)}
            />

        </div>
    );
}
