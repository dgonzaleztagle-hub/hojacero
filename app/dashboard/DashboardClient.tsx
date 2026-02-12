
'use client';

import {
    LayoutDashboard, Users, CheckCircle2, AlertTriangle, Clock,
    Calendar, ArrowRight, Target, Zap, Activity, Mail, AlertCircle,
    Shield, Heart, Rocket, ShieldAlert, BarChart3, Globe, KanbanSquare, Lock
} from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from './DashboardContext';

interface DashboardClientProps {
    user: any;
    leadsInProcess: number;
    leadsWon: number;
    mrr: number;
    yearTotal: number;
    actionItems: any[];
    danielTotal: number;
    gastonTotal: number;
}

export default function DashboardClient({
    user,
    leadsInProcess,
    leadsWon,
    mrr,
    yearTotal,
    actionItems,
    danielTotal,
    gastonTotal
}: DashboardClientProps) {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 fade-in-up">
            <header className={`flex justify-between items-end border-b pb-6 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                <div>
                    <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Comando Central</h2>
                    <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        HQ HojaCero_ <span className={isDark ? 'text-zinc-500' : 'text-gray-400'}>{user.user_metadata?.full_name?.split(' ')[0]}</span>
                    </h1>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Estado Operativo: 🔥 ACTIVO</p>
                </div>
            </header>

            {/* KPI OVERVIEW GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="MRR Mensual" value={formatCurrency(mrr)} icon={Activity} color="text-emerald-400" isDark={isDark} />
                <MetricCard title="Leads Activos" value={leadsInProcess.toString()} icon={Target} color="text-blue-400" isDark={isDark} />
                <MetricCard title="Cierres Mes" value={leadsWon.toString()} icon={Zap} color="text-amber-400" isDark={isDark} />
                <MetricCard title="Meta Anual (YTD)" value={formatCurrency(yearTotal)} icon={Rocket} color="text-purple-400" isDark={isDark} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: CRITICAL OPS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Acciones Críticas
                        </h3>
                    </div>
                    <div className={`border rounded-3xl overflow-hidden min-h-[300px] divide-y ${isDark ? 'bg-zinc-900/30 border-white/5 divide-white/5' : 'bg-white border-gray-200 divide-gray-100 shadow-sm'
                        }`}>
                        {actionItems.length === 0 ? (
                            <div className={`p-12 text-center italic ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>Bandeja despejada.</div>
                        ) : (
                            actionItems.slice(0, 6).map(item => (
                                <div key={item.id} className={`p-4 transition-colors flex items-center gap-4 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                        {item.next_action_date ? new Date(item.next_action_date).getDate() : '!'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.nombre}</h4>
                                        <p className={`text-xs truncate ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{item.next_action_note || 'Pendiente de gestión'}</p>
                                    </div>
                                    <Link href={`/dashboard/radar?leadId=${item.id}`} className={`px-4 py-2 text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Ver Lead</Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* FUSION SECTION: RENDIMIENTO PARTNERS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border group ${isDark ? 'bg-zinc-900/50 border-cyan-500/10' : 'bg-white border-cyan-500/20 shadow-sm'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Daniel (Dev/Audit)</span>
                                <BarChart3 className="w-4 h-4 text-cyan-500" />
                            </div>
                            <p className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(danielTotal)}</p>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acumulado Ganado (65% Split)</p>
                        </div>
                        <div className={`p-6 rounded-2xl border group ${isDark ? 'bg-zinc-900/50 border-purple-500/10' : 'bg-white border-purple-500/20 shadow-sm'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Gastón (Mkt/Ops)</span>
                                <Activity className="w-4 h-4 text-purple-500" />
                            </div>
                            <p className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(gastonTotal)}</p>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acumulado Ganado (Partner Split)</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: QUICK ACCESS & STATUS */}
                <div className="space-y-6">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Globe className="w-5 h-5 text-zinc-400" /> Accesos HQ
                    </h3>
                    <div className="space-y-3">
                        <QuickLink href="/dashboard/radar" label="Radar Comercial" sub="Nuevos leads y análisis" icon={Target} color="text-cyan-400" isDark={isDark} />
                        <QuickLink href="/dashboard/pipeline" label="Pipeline de Ventas" sub="Gestión de cierres" icon={KanbanSquare} color="text-blue-400" isDark={isDark} />
                        <QuickLink href="/dashboard/vault" label="Vault Operativo" sub="Sitios y Kill Switch" icon={Lock} color="text-emerald-400" isDark={isDark} />
                        <QuickLink href="/dashboard/inbox" label="Cofre de Correos" sub="Comunicaciones activas" icon={Mail} color="text-purple-400" isDark={isDark} />
                    </div>
                </div>
            </div>

            {/* TREND SECTION: HISTÓRICO */}
            <div className={`p-8 rounded-[3rem] border space-y-6 ${isDark ? 'bg-zinc-900/10 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <BarChart3 className="w-5 h-5 text-indigo-400" /> Rendimiento & Crecimiento
                    </h3>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Últimos meses</span>
                </div>

                <div className="h-48 flex items-end justify-around gap-4 px-4 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group w-full">
                            <div className={`w-full rounded-t-xl relative overflow-hidden transition-all ${isDark ? 'bg-zinc-800/50 group-hover:bg-zinc-800' : 'bg-gray-100 group-hover:bg-gray-200'}`} style={{ height: `${Math.random() * 80 + 20}%` }}>
                                <div className={`absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent`} />
                            </div>
                            <span className="text-[9px] font-black text-zinc-600 uppercase">Mes -{6 - i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, color, isDark }: any) {
    return (
        <div className={`border p-5 rounded-3xl relative overflow-hidden group transition-all ${isDark ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-gray-200 shadow-sm'
            }`}>
            <div className={`absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-mono font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
    );
}

function QuickLink({ href, label, sub, icon: Icon, color, isDark }: any) {
    return (
        <Link href={href} className={`flex items-center gap-4 p-4 border rounded-2xl transition-all group ${isDark ? 'bg-zinc-900/50 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
            }`}>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${isDark ? 'bg-white/5' : 'bg-gray-50'} ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</h4>
                <p className="text-[10px] text-zinc-500 uppercase">{sub}</p>
            </div>
            <ArrowRight className={`w-4 h-4 transition-colors ${isDark ? 'text-zinc-700 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
        </Link>
    );
}
