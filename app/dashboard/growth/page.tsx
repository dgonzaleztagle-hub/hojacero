'use client';

import { useState } from 'react';
import { Rocket, TrendingUp } from 'lucide-react';
import { useDashboard } from '@/app/dashboard/DashboardContext';
import { GrowthRoster } from '@/components/growth/GrowthRoster';
import { GrowthClientView } from '@/components/growth/GrowthClientView';

export default function GrowthPage() {
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 animate-in fade-in duration-500 max-w-full mx-auto pb-0 px-4">
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-2 border-b pb-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div>
                    <h1 className={`text-3xl font-light tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Rocket className="w-8 h-8 text-purple-500" />
                        GROWTH
                        <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded border border-purple-500/30">Engine</span>
                    </h1>
                    <p className={`mt-2 text-sm max-w-xl ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Ingeniería de Crecimiento • Gestión de Planes • KPIs
                    </p>
                </div>

                <div className="flex gap-3 text-xs font-mono">
                    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border ${isDark ? 'bg-zinc-900 border-purple-500/20' : 'bg-white border-purple-200 shadow-sm'}`}>
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-400 font-bold">4 Activos</span>
                        <span className={isDark ? 'text-zinc-500' : 'text-gray-400'}>En Gestión</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 min-h-0 rounded-3xl border overflow-hidden relative ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                {selectedClientId ? (
                    <GrowthClientView
                        clientId={selectedClientId}
                        onBack={() => setSelectedClientId(null)}
                    />
                ) : (
                    <GrowthRoster onSelectClient={setSelectedClientId} />
                )}
            </div>
        </div>
    );
}
