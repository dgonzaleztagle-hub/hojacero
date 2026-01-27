
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Loader2, KanbanSquare, ClipboardList } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRadar } from '@/hooks/useRadar';
import { PipelineBoard } from '@/components/pipeline/Board';
import { RadarLeadModal } from '@/components/radar/RadarLeadModal';
import { ManualEntryModal } from '@/components/radar/ManualEntryModal';
import { TargetIcon } from '@/components/radar/shared';
import { createClient } from '@/utils/supabase/client';

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

    // Local state for real-time visits
    const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
    const supabase = createClient();

    useEffect(() => {
        fetchPipeline();
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        // Fetch all visits (optimized: just prospecto field)
        const { data } = await supabase.from('demo_visits').select('prospecto');
        if (data) {
            const counts: Record<string, number> = {};
            data.forEach((visit: any) => {
                if (visit.prospecto) {
                    counts[visit.prospecto] = (counts[visit.prospecto] || 0) + 1;
                }
            });
            setVisitCounts(counts);
        }
    };

    // Merge leads with live visit counts
    const mergedLeads = pipelineLeads.map((l: any) => ({
        ...l,
        visits_count: l.prospecto ? (visitCounts[l.prospecto] || 0) : 0
    }));

    // 2. Access Control
    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                <p className="text-zinc-500">Cargando acceso...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 animate-in fade-in duration-500 max-w-full mx-auto pb-0 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <KanbanSquare className="w-8 h-8 text-green-400" />
                        PIPELINE
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded border border-green-500/30">Deals</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm max-w-xl">
                        Gestión de Oportunidades • Seguimiento • Cierre de Ventas
                    </p>
                </div>

                {pipelineLeads.length > 0 && (
                    <div className="flex gap-3 text-xs font-mono items-center">
                        <div className="bg-zinc-900 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="text-green-400 font-bold">{pipelineLeads.length}</span>
                            <span className="text-zinc-500">Oportunidades Activas</span>
                        </div>
                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            className="bg-white text-black hover:bg-zinc-200 p-2 md:px-4 md:py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] ml-2"
                            title="Ingresar Dato Manual"
                        >
                            <ClipboardList className="w-4 h-4" />
                            <span className="hidden md:inline">Ingresar Dato</span>
                        </button>
                    </div>
                )}
                {pipelineLeads.length === 0 && (
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="bg-white text-black hover:bg-zinc-200 p-2 md:px-4 md:py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        title="Ingresar Dato Manual"
                    >
                        <ClipboardList className="w-4 h-4" />
                        <span className="hidden md:inline">Ingresar Dato</span>
                    </button>
                )}
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
                            fetchLeadActivities(found.id || found.db_id);
                            fetchNotes(found.id || found.db_id);
                            fetchChatMessages(found.id || found.db_id);
                        }
                    }}
                />
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <RadarLeadModal radar={radar} />
            )}

            <ManualEntryModal
                isOpen={radar.isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onSuccess={(lead) => {
                    fetchPipeline(); // Refresh pipeline
                }}
            />
        </div>
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
