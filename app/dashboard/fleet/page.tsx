'use client';

import React, { useState, useEffect } from 'react';
import { ThemeWrapper, MainContent } from '../ThemeComponents';
import { FleetGrid } from '@/app/dashboard/fleet/FleetGrid';
import { SiteEditor } from '@/app/dashboard/fleet/SiteEditor';
import { Shield, Rocket, Wifi, WifiOff, Search, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { Site } from '@/types/cms';

/**
 * PORTAAVIONES H0 - FLEET EDITOR
 * Centro de comando para la gestión de de sitios exportados.
 */


export default function FleetPage() {
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSite, setSelectedSite] = useState<Site | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const res = await fetch('/api/fleet/sites');
            const data = await res.json();
            if (data.sites) setSites(data.sites);
        } catch (error) {
            toast.error('Error al cargar la flota');
        } finally {
            setLoading(false);
        }
    };

    const filteredSites = sites.filter(site =>
        site.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.site_url?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ThemeWrapper>
            <MainContent>
                <div className="space-y-8 max-w-7xl mx-auto pb-20">
                    {/* Header Central de Comando */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                    <Shield className="w-5 h-5 text-cyan-400" />
                                </div>
                                <h1 className="text-4xl font-black italic uppercase tracking-tighter">Portaaviones H0</h1>
                            </div>
                            <p className="text-zinc-500 font-medium">Gestión centralizada de activos de alto valor (AEO/GEO Ready).</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar en la armada..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:border-cyan-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${sites.length > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    {sites.length} Sitivos Activos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Fleet Grid Component */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-48 bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <FleetGrid
                            sites={filteredSites}
                            onEdit={(site: Site) => setSelectedSite(site)}
                        />
                    )}
                </div>

                {/* Sliding Editor Panel */}
                {selectedSite && (
                    <SiteEditor
                        site={selectedSite}
                        onClose={() => setSelectedSite(null)}
                        onSaved={fetchSites}
                    />
                )}
            </MainContent>
        </ThemeWrapper>
    );
}
