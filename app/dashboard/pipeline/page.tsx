
'use client';

import { Suspense, useEffect } from 'react';
import { Loader2, KanbanSquare } from 'lucide-react';
import { useRadar } from '@/hooks/useRadar';
import { PipelineBoard } from '@/components/pipeline/Board';
import { RadarLeadModal } from '@/components/radar/RadarLeadModal';
import { TargetIcon } from '@/components/radar/shared';

function PipelineContent() {
    // 1. Initialize Hook
    const radar = useRadar();
    const {
        pipelineLeads,
        fetchPipeline,
        selectedLead, setSelectedLead,
        fetchLeadActivities, fetchNotes, fetchChatMessages,
        userRole
    } = radar;

    useEffect(() => {
        fetchPipeline();
    }, []);

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
                    <div className="flex gap-3 text-xs font-mono">
                        <div className="bg-zinc-900 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="text-green-400 font-bold">{pipelineLeads.length}</span>
                            <span className="text-zinc-500">Oportunidades Activas</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Pipeline Board */}
            <div className="flex-1 min-h-0 animate-in fade-in duration-500">
                <PipelineBoard
                    leads={pipelineLeads}
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
