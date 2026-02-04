import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard, Users, CheckCircle2, AlertTriangle, Clock,
    Calendar, ArrowRight, Target, Zap, Activity, Mail, AlertCircle,
    Shield, Heart, Rocket, ShieldAlert, BarChart3, Globe, KanbanSquare, Lock
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 2. Fetch Data (Optimized Parallel Fetch)
    const [
        { data: leads },
        { data: sites },
        { data: growthClients },
        { data: pagos },
        { data: wonLeads }
    ] = await Promise.all([
        supabase.from('leads').select('id, estado, pipeline_stage, next_action_date, next_action_note, nombre, created_at, last_activity_at'),
        supabase.from('monitored_sites').select('id, status, monto_mensual, site_status(is_active)'),
        supabase.from('growth_clients').select('id, health_score'),
        supabase.from('pagos').select('monto, fecha_pago, tipo'),
        supabase.from('leads').select('deal_type, deal_amount, partner_split').eq('estado', 'won')
    ]);

    // --- CALCULATIONS: OPERATIONS ---
    const getStage = (l: any) => {
        if (l.pipeline_stage) return l.pipeline_stage.toLowerCase();
        if (l.estado === 'ready_to_contact') return 'radar';
        if (l.estado === 'in_contact') return 'contactado';
        if (l.estado === 'proposal_sent') return 'negociacion';
        if (l.estado === 'won') return 'produccion';
        return 'unknown';
    };

    const leadsCount = (leads || []).length;
    const leadsContact = (leads || []).filter(l => getStage(l) === 'radar').length;
    const leadsInProcess = (leads || []).filter(l => {
        const s = getStage(l);
        return s === 'contactado' || s === 'reunion' || s === 'negociacion';
    }).length;
    const leadsWon = (leads || []).filter(l => getStage(l) === 'produccion').length;

    // Action Items
    const today = new Date();
    const bufferDate = new Date(today);
    bufferDate.setDate(today.getDate() + 1);
    const bufferIso = bufferDate.toISOString().split('T')[0];

    const actionItems = (leads || []).filter(l => {
        const hasAgenda = l.next_action_date && l.next_action_date.split('T')[0] <= bufferIso;
        const stage = getStage(l);
        const isStale = (stage === 'contactado' || stage === 'in_contact') &&
            (new Date().getTime() - new Date(l.last_activity_at || l.created_at).getTime() > 3 * 24 * 60 * 60 * 1000);
        return hasAgenda || isStale;
    }).sort((a, b) => {
        const dateA = a.next_action_date ? new Date(a.next_action_date).getTime() : 0;
        const dateB = b.next_action_date ? new Date(b.next_action_date).getTime() : 0;
        return dateA - dateB;
    });

    // --- CALCULATIONS: FINANCIALS ---
    const mrr = (sites || []).reduce((sum, s) => {
        const isActive = s.status === 'active' && s.site_status?.[0]?.is_active !== false;
        return sum + (isActive ? (s.monto_mensual || 0) : 0);
    }, 0);

    const yearTotal = (pagos || []).reduce((sum, p) => {
        const isThisYear = new Date(p.fecha_pago).getFullYear() === new Date().getFullYear();
        return sum + (isThisYear ? (p.monto || 0) : 0);
    }, 0);

    // Partner Splits
    let danielTotal = 0;
    let gastonTotal = 0;
    wonLeads?.forEach(lead => {
        const amount = lead.deal_amount || 0;
        const split = lead.partner_split === 'daniel_major' ? 0.65 : (lead.partner_split === 'gaston_major' ? 0.35 : 0.65);
        danielTotal += amount * split;
        gastonTotal += amount * (1 - split);
    });

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 fade-in-up">
            <header className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Comando Central</h2>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        HQ HojaCero_ <span className="text-zinc-500">{user.user_metadata?.full_name?.split(' ')[0]}</span>
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-white">{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Estado Operativo: 🔥 ACTIVO</p>
                </div>
            </header>

            {/* KPI OVERVIEW GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="MRR Mensual" value={formatCurrency(mrr)} icon={Activity} color="text-emerald-400" />
                <MetricCard title="Leads Activos" value={leadsInProcess.toString()} icon={Target} color="text-blue-400" />
                <MetricCard title="Cierres Mes" value={leadsWon.toString()} icon={Zap} color="text-amber-400" />
                <MetricCard title="Meta Anual (YTD)" value={formatCurrency(yearTotal)} icon={Rocket} color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: CRITICAL OPS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> Acciones Críticas
                        </h3>
                    </div>
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden min-h-[300px] divide-y divide-white/5">
                        {actionItems.length === 0 ? (
                            <div className="p-12 text-center text-zinc-600 italic">Bandeja despejada.</div>
                        ) : (
                            actionItems.slice(0, 6).map(item => (
                                <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                        {item.next_action_date ? new Date(item.next_action_date).getDate() : '!'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{item.nombre}</h4>
                                        <p className="text-xs text-zinc-500 truncate">{item.next_action_note || 'Pendiente de gestión'}</p>
                                    </div>
                                    <Link href={`/dashboard/radar?leadId=${item.id}`} className="px-4 py-2 bg-white text-black text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-all uppercase">Ver Lead</Link>
                                </div>
                            ))
                        )}
                    </div>

                    {/* FUSION SECTION: RENDIMIENTO PARTNERS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-cyan-500/10 group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Daniel (Dev/Audit)</span>
                                <BarChart3 className="w-4 h-4 text-cyan-500" />
                            </div>
                            <p className="text-2xl font-mono font-bold text-white">{formatCurrency(danielTotal)}</p>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acumulado Ganado (65% Split)</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-purple-500/10 group">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Gastón (Mkt/Ops)</span>
                                <Activity className="w-4 h-4 text-purple-500" />
                            </div>
                            <p className="text-2xl font-mono font-bold text-white">{formatCurrency(gastonTotal)}</p>
                            <p className="text-[10px] text-zinc-500 mt-1 uppercase">Acumulado Ganado (Partner Split)</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: QUICK ACCESS & STATUS */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Globe className="w-5 h-5 text-zinc-400" /> Accesos HQ
                    </h3>
                    <div className="space-y-3">
                        <QuickLink href="/dashboard/radar" label="Radar Comercial" sub="Nuevos leads y análisis" icon={Target} color="text-cyan-400" />
                        <QuickLink href="/dashboard/pipeline" label="Pipeline de Ventas" sub="Gestión de cierres" icon={KanbanSquare} color="text-blue-400" />
                        <QuickLink href="/dashboard/vault" label="Vault Operativo" sub="Sitios y Kill Switch" icon={Lock} color="text-emerald-400" />
                        <QuickLink href="/dashboard/inbox" label="Cofre de Correos" sub="Comunicaciones activas" icon={Mail} color="text-purple-400" />
                    </div>
                </div>
            </div>

            {/* TREND SECTION: HISTÓRICO */}
            <div className="bg-zinc-900/10 p-8 rounded-[3rem] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-400" /> Rendimiento & Crecimiento
                    </h3>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Últimos meses</span>
                </div>

                <div className="h-48 flex items-end justify-around gap-4 px-4 overflow-hidden">
                    {/* Simulación de Chart con datos reales del server si fuera posible, por ahora lo dejamos como un placeholder estético o calculamos rápido */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group w-full">
                            <div className="w-full bg-zinc-800/50 rounded-t-xl relative overflow-hidden transition-all group-hover:bg-zinc-800" style={{ height: `${Math.random() * 80 + 20}%` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent" />
                            </div>
                            <span className="text-[9px] font-black text-zinc-600 uppercase">Mes -{6 - i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-zinc-900/30 border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
            <div className={`absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-mono font-bold text-white`}>{value}</p>
        </div>
    );
}

function QuickLink({ href, label, sub, icon: Icon, color }: any) {
    return (
        <Link href={href} className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
            <div className={`p-2 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{label}</h4>
                <p className="text-[10px] text-zinc-500 uppercase">{sub}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-white transition-colors" />
        </Link>
    );
}

