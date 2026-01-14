'use client';

import { Activity, Clock, FileCheck, AlertCircle } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function PulsePage() {
    const { currentClient } = useDashboard();
    const stats = currentClient.stats;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Pulso del Sistema</h1>
                    <p className="text-zinc-500 mt-1">Resumen del Proyecto: <span className="text-cyan-400">{currentClient.name}</span></p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border ${stats.health === 'NOMINAL' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        stats.health === 'ATENCIÓN' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${stats.health === 'NOMINAL' ? 'bg-green-500' :
                            stats.health === 'ATENCIÓN' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                    SISTEMAS {stats.health}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="FASE ACTUAL" value={stats.phase} icon={Activity} color="text-cyan-400" />
                <Card title="PRÓXIMA ENTREGA" value={stats.nextDelivery} icon={Clock} color="text-purple-400" />
                <Card title="ACCIONES PENDIENTES" value="1 REVISIÓN" icon={AlertCircle} color="text-yellow-400" />
            </div>

            {/* Timeline / Progress */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Trayectoria de Vuelo</h3>
                    <span className="text-2xl font-mono text-white">{stats.progress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                        style={{ width: `${stats.progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-4 text-xs font-mono text-zinc-600">
                    <span>INIT</span>
                    <span className={stats.progress > 20 ? 'text-white' : ''}>DISEÑO</span>
                    <span className={stats.progress > 50 ? 'text-white' : ''}>DEV</span>
                    <span className={stats.progress > 80 ? 'text-white' : ''}>QA</span>
                    <span className={stats.progress === 100 ? 'text-white' : ''}>LANZAMIENTO</span>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Transmisiones Recientes</h3>
                    <div className="space-y-4">
                        {currentClient.activity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 group">
                                <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                    } group-hover:scale-125 transition-transform`} />
                                <p className="text-zinc-300 text-sm flex-1">{activity.text}</p>
                                <span className="text-xs text-zinc-600 font-mono">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 flex items-start justify-between hover:border-white/10 transition-colors">
            <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-xl font-medium text-white tracking-tight">{value}</p>
            </div>
            <Icon className={`w-5 h-5 ${color}`} />
        </div>
    );
}
