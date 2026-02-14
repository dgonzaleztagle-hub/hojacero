'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Globe, Monitor, Clock, MapPin } from 'lucide-react';

interface TrackingPanelProps {
    prospecto: string;
    isDark: boolean;
}

interface Visit {
    id: number;
    created_at: string;
    visitor_ip: string;
    city?: string;
    country?: string;
    user_agent: string;
    referrer?: string;
}

export const TrackingPanel = ({ prospecto, isDark }: TrackingPanelProps) => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVisits = async () => {
            if (!prospecto) return;
            try {
                // Fetch to our API wrapper to filter internal visits
                const res = await fetch(`/api/tracking/demo?prospecto=${prospecto}`);
                const data = await res.json();
                if (data.success) {
                    setVisits(data.visits || []);
                }
            } catch (error) {
                console.error("Error fetching visits", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVisits();
    }, [prospecto]);

    if (!prospecto) return null;

    return (
        <div className={`rounded-xl border p-6 mt-6 ${isDark ? 'border-white/10 bg-zinc-900/30' : 'border-zinc-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-800'}`}>
                    <Globe className="w-4 h-4 text-emerald-500" />
                    tráfico en tiempo real
                </h3>
                <span className={`text-xs font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                    {visits.length} Visitas
                </span>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
            ) : visits.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs italic">
                    No se han registrado visitas externas aún.
                </div>
            ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {visits.map((visit) => (
                        <div
                            key={visit.id}
                            className={`p-3 rounded-lg border text-xs ${isDark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-zinc-100 bg-zinc-50 hover:bg-zinc-100'} transition-colors`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <MapPin className="w-3 h-3" />
                                    <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                                        {visit.city || 'Desconocido'}, {visit.country || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
                                    <Clock className="w-3 h-3" />
                                    {new Date(visit.created_at).toLocaleString('es-CL', {
                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <Monitor className="w-3 h-3" />
                                <span className="truncate max-w-[200px]" title={visit.user_agent}>
                                    {visit.user_agent.includes('Mobile') ? 'Móvil' : 'Desktop'} • {visit.user_agent.split(')')[0].split('(')[1] || 'Unknown OS'}
                                </span>
                            </div>

                            {visit.referrer && (
                                <div className="text-[10px] text-zinc-600 truncate mt-1 pl-5 border-l-2 border-emerald-500/20">
                                    Ref: {visit.referrer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
