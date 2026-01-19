'use client';

import { Suspense } from 'react';
import { Target, Loader2, ClipboardList } from 'lucide-react';
import { useRadar } from '@/hooks/useRadar';
import { RadarScanner } from '@/components/radar/RadarScanner';
import { RadarResultsList } from '@/components/radar/RadarResultsList';
import { TargetIcon } from '@/components/radar/shared';
import { PipelineBoard } from '@/components/pipeline/Board';
import { RadarLeadModal } from '@/components/radar/RadarLeadModal';
import { getAnalysis } from '@/utils/radar-helpers';

function RadarContent() {
    // 1. Initialize Hook
    const radar = useRadar();
    const {
        activeTab, setActiveTab,
        leads, historyLeads, pipelineLeads,
        query, setQuery, location, setLocation,
        isScanning, error,
        selectedLead, setSelectedLead,
        handleScan,
        fetchLeadActivities, fetchNotes, fetchChatMessages, fetchPipeline,
        userRole, setIsManualModalOpen
    } = radar;

    // 2. Access Control
    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                <p className="text-zinc-500">Cargando acceso...</p>
            </div>
        );
    }

    // 3. Determine Display Data
    const displayLeads = activeTab === 'scanner' ? leads : activeTab === 'history' ? historyLeads : [];

    // 4. Render
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-2 animate-in fade-in duration-500 max-w-full mx-auto pb-0 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <TargetIcon />
                        RADAR
                        <span className="text-xs bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/30">Pro</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm max-w-xl">
                        Inteligencia de Leads con IA • Emails • WhatsApp • Tech Stack • Estrategia de Ventas
                    </p>
                </div>

                {displayLeads.length > 0 && activeTab !== 'pipeline' && (
                    <div className="flex gap-3 text-xs font-mono">
                        <div className="bg-zinc-900 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-green-400">{displayLeads.filter(l => (getAnalysis(l).score || 0) >= 80).length}</span>
                            <span className="text-zinc-500">Alta Oportunidad</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <ClipboardList className="w-4 h-4" />
                    Ingresar Dato
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('pipeline')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'pipeline' ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    📋 Pipeline
                    {pipelineLeads.length > 0 && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">{pipelineLeads.length}</span>
                    )}
                    {activeTab === 'pipeline' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('scanner')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'scanner' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    🔍 Escáner
                    {activeTab === 'scanner' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    📚 Historial
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
            </div>

            {/* Scanner Inputs */}
            {activeTab === 'scanner' && (
                <RadarScanner
                    query={query}
                    setQuery={setQuery}
                    location={location}
                    setLocation={setLocation}
                    isScanning={isScanning}
                    handleScan={handleScan}
                    error={error}
                />
            )}

            {/* Results List */}
            {(activeTab === 'scanner' || activeTab === 'history') && (
                <RadarResultsList
                    leads={displayLeads}
                    onSelectLead={(lead) => {
                        setSelectedLead(lead);
                        fetchLeadActivities(lead.id || lead.db_id);
                        fetchNotes(lead.id || lead.db_id);
                        fetchChatMessages(lead.id || lead.db_id);
                    }}
                />
            )}

            {/* Empty State */}
            {activeTab === 'scanner' && !isScanning && leads.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-800 border-2 border-dashed border-zinc-900 rounded-3xl">
                    <Target className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-medium text-zinc-700">Radar en espera</p>
                    <p className="text-sm">Inicia un escaneo para mapear el terreno.</p>
                </div>
            )}

            {/* Pipeline Board */}
            {activeTab === 'pipeline' && (
                <div className="flex-1 min-h-0 animate-in fade-in duration-500 mt-2">
                    <PipelineBoard
                        leads={pipelineLeads}
                        onLeadMove={fetchPipeline}
                        onTicketClick={async (id) => {
                            let found = pipelineLeads.find(l => l.id === id) || leads.find(l => l.id === id);
                            if (found) {
                                setSelectedLead(found);
                                fetchLeadActivities(found.id || found.db_id);
                                fetchNotes(found.id || found.db_id);
                                fetchChatMessages(found.id || found.db_id);
                            }
                        }}
                    />
                </div>
            )}

            {/* Lead Detail Modal */}
            {selectedLead && (
                <RadarLeadModal radar={radar} />
            )}
        </div>
    );
}

export default function RadarPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
        }>
            <RadarContent />
        </Suspense>
    );
}
