
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Loader2, KanbanSquare, ClipboardList, Archive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRadar } from '@/hooks/useRadar';
import { PipelineBoard } from '@/components/pipeline/Board';
import { RadarLeadModal } from '@/components/radar/RadarLeadModal';
import { ManualEntryModal } from '@/components/radar/ManualEntryModal';
import { CementerioModal } from '@/components/pipeline/CementerioModal_v2';
import { TargetIcon } from '@/components/radar/shared';
import { createClient } from '@/utils/supabase/client';
import { useDashboard } from '@/app/dashboard/DashboardContext';

function PipelineContent() {
    // 1. Initialize Hook
    const radar = useRadar();
    const router = useRouter();
    const {
        pipelineLeads,
        fetchPipeline,
        selectedLead, setSelectedLead,
        fetchLeadActivities, fetchNotes, fetchChatMessages,
        userRole, setIsManualModalOpen
    } = radar;

    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    // Local state for real-time visits
    const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
    const [isCementerioOpen, setIsCementerioOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchPipeline();
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const res = await fetch('/api/tracking/stats');
            const data = await res.json();
            if (data.success) {
                setVisitCounts(data.counts);
            }
        } catch (error) {
            console.error("Error fetching visit stats:", error);
        }
    };

    // Merge leads with live visit counts AND Robust Matching
    const mergedLeads = pipelineLeads.map((l: any) => {
        // 1. Try direct prospecto field
        let key = l.prospecto;
        // 2. Try extracting from demo_url (e.g. .../prospectos/biocrom)
        if (!key && l.demo_url) {
            key = l.demo_url.split('/prospectos/')[1]?.split('/')[0];
        }
        // 3. Last resort: slugify name (fallback)
        if (!key && l.nombre) {
            key = l.nombre.toLowerCase().replace(/ /g, '-');
        }

        return {
            ...l,
            visits_count: key ? (visitCounts[key] || 0) : 0
        };
    });

    // 2. Access Control
    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                <p className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Cargando acceso...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] animate-in fade-in duration-500 -mx-4 md:-mx-8 w-auto overflow-hidden">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 mb-4 px-4 md:px-8 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="space-y-1">
                    <h1 className={`text-4xl font-black tracking-tight flex items-center gap-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <KanbanSquare className="w-10 h-10 text-green-400" />
                        PIPELINE
                        <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded font-black uppercase tracking-tighter">Deals</span>
                    </h1>
                    <p className={`text-sm font-medium ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Gestión de Oportunidades • Seguimiento • Cierre de Ventas
                    </p>
                </div>

                <div className="flex gap-4 text-xs font-mono items-center pr-6">
                    <button
                        onClick={() => setIsCementerioOpen(true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all border ${isDark
                            ? 'text-zinc-400 border-white/5 hover:text-zinc-200 hover:bg-white/5 hover:border-white/10'
                            : 'text-gray-600 border-gray-200 bg-white hover:text-gray-900 hover:border-gray-300 hover:shadow-sm'
                            }`}
                        title="Ver Leads Perdidos"
                    >
                        <Archive className={`w-4 h-4 ${isDark ? 'text-zinc-600 group-hover:text-zinc-400' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="hidden md:inline">Cementerio</span>
                    </button>

                    <div className={`border px-4 py-2 rounded-xl flex items-center gap-3 ${isDark ? 'bg-zinc-900/50 border-white/5 shadow-inner' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <span className="text-green-500 font-black text-base">{pipelineLeads.length}</span>
                        <span className={`uppercase tracking-widest text-[9px] font-bold ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Activas</span>
                    </div>
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95 ${isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-black text-white hover:bg-zinc-800 shadow-black/10'
                            }`}
                        title="Ingresar Dato Manual"
                    >
                        <ClipboardList className="w-4 h-4" />
                        <span className="hidden md:inline">Ingresar Dato</span>
                    </button>
                </div>
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 min-h-0 animate-in fade-in duration-500">
                <PipelineBoard
                    leads={mergedLeads}
                    onLeadMove={fetchPipeline}
                    onTicketClick={async (id) => {
                        let found = pipelineLeads.find(l => l.id === id);
                        if (found) {
                            setSelectedLead(found);
                            const leadId = found.id || found.db_id;
                            if (!leadId) return;
                            fetchLeadActivities(leadId);
                            fetchNotes(leadId);
                            fetchChatMessages(leadId);
                        }
                    }}
                />
            </div>

            {/* Lead Detail Modal */}
            {
                selectedLead && (
                    <RadarLeadModal radar={radar} />
                )
            }

            <ManualEntryModal
                isOpen={radar.isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onSuccess={(lead) => {
                    fetchPipeline(); // Refresh pipeline
                }}
            />

            <CementerioModal
                isOpen={isCementerioOpen}
                onClose={() => setIsCementerioOpen(false)}
                onRestore={() => fetchPipeline()}
                isDark={isDark}
            />
        </div >
    );
}

export default function PipelinePage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        }>
            <PipelineContent />
        </Suspense>
    );
}
