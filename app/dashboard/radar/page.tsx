'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Loader2, ClipboardList } from 'lucide-react';
import { useRadar } from '@/hooks/useRadar';
import { useDashboard } from '@/app/dashboard/DashboardContext';
import { RadarScanner } from '@/components/radar/RadarScanner';
import { RadarResultsList } from '@/components/radar/RadarResultsList';
import { TargetIcon } from '@/components/radar/shared';
import { RadarLeadModal } from '@/components/radar/RadarLeadModal';
import { getAnalysis } from '@/utils/radar-helpers';

function RadarContent() {
    // 1. Initialize Hook
    const radar = useRadar();
    const router = useRouter();
    const {
        activeTab, setActiveTab,
        leads, historyLeads, closedLeads,
        query, setQuery, location, setLocation,
        isScanning, isFlashMode, setIsFlashMode,
        error,
        selectedLead, setSelectedLead,
        handleScan,
        fetchLeadActivities, fetchNotes, fetchChatMessages,
        userRole
    } = radar;

    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    // 2. Access Control
    if (userRole !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                <p className={isDark ? 'text-zinc-500' : 'text-gray-500'}>Cargando acceso...</p>
            </div>
        );
    }

    // 3. Determine Display Data
    const displayLeads = activeTab === 'scanner' ? leads
        : activeTab === 'history' ? historyLeads
            : activeTab === 'closed' ? closedLeads
                : [];

    // 4. Render
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-2 animate-in fade-in duration-500 max-w-full mx-auto pb-0 px-4">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-2 border-b pb-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                    <h1 className={`text-3xl font-light tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <TargetIcon />
                        RADAR
                        <span className="text-xs bg-cyan-500/20 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/30">Pro</span>
                    </h1>
                    <p className={`mt-2 text-sm max-w-xl ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Inteligencia de Leads con IA • Emails • WhatsApp • Tech Stack • Estrategia de Ventas
                    </p>
                </div>

                {displayLeads.length > 0 && (
                    <div className="flex gap-3 text-xs font-mono">
                        <div className={`border px-3 py-1.5 rounded-lg flex items-center gap-2 ${isDark ? 'bg-zinc-900 border-green-500/20' : 'bg-white border-green-200 shadow-sm'}`}>
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-green-400">{displayLeads.filter(l => (getAnalysis(l).score || 0) >= 80).length}</span>
                            <span className={isDark ? 'text-zinc-500' : 'text-gray-400'}>Alta Oportunidad</span>
                        </div>
                    </div>
                )}


            </div>

            {/* Tabs */}
            <div className={`flex gap-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <button
                    onClick={() => setActiveTab('scanner')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'scanner' ? 'text-cyan-400' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    🔍 Escáner
                    {activeTab === 'scanner' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-cyan-400' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    📚 Historial
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('closed')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'closed' ? 'text-green-400' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    ✅ Cerrados
                    {activeTab === 'closed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></div>}
                </button>
            </div>

            {/* Scanner Inputs */}
            {activeTab === 'scanner' && (
                <RadarScanner
                    query={query}
                    setQuery={setQuery}
                    location={location}
                    setLocation={setLocation}
                    profileName={radar.profileName || 'Daniel'}
                    isScanning={isScanning}
                    isFlashMode={isFlashMode}
                    setIsFlashMode={setIsFlashMode}
                    handleScan={handleScan}
                    error={error}
                />
            )}

            {/* Results List */}
            {['scanner', 'history', 'closed'].includes(activeTab) && (
                <RadarResultsList
                    leads={displayLeads}
                    isLoading={isScanning && activeTab === 'scanner'}
                    activeTab={activeTab}
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
                <div className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-3xl ${isDark ? 'text-zinc-800 border-zinc-900' : 'text-gray-200 border-gray-100'
                    }`}>
                    <Target className="w-16 h-16 mb-4 opacity-10" />
                    <p className={`font-medium ${isDark ? 'text-zinc-700' : 'text-gray-400'}`}>Radar en espera</p>
                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Inicia un escaneo para mapear el terreno.</p>
                </div>
            )}

            {/* Pipeline Board */}
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
