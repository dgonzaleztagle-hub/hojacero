import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import {
    LayoutDashboard, Users, CheckCircle2, AlertTriangle, Clock,
    Calendar, ArrowRight, Target, Zap, Activity, Mail, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();

    // Debug
    const { data: debugLeads, error: debugError } = await supabase.from('leads').select('count');
    console.log('HQ DEBUG - Total DB Leads:', debugLeads, 'Error:', debugError);

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // 2. Fetch Data
    // A. Pipeline Stats
    // A. Pipeline Stats
    let leads: any[] = [];
    let fetchError = null;

    try {
        const result = await supabase
            .from('leads')
            // TRYING MINIMAL QUERY FIRST to ensure connection
            // We request 'nombre' and 'estado'. If 'next_action_date' is missing in DB, this line will crash if we include it.
            // .select('id, estado, next_action_date, next_action_note, nombre, url');
            // SAFEST QUERY:
            .select('id, estado, pipeline_stage, next_action_date, next_action_note, nombre');

        if (result.error) throw result.error;
        leads = result.data || [];
    } catch (e: any) {
        console.error('HQ FATAL ERROR:', e);
        fetchError = e;
    }

    if (fetchError) {
        return (
            <div className="p-12 text-center text-red-500">
                <h1 className="text-2xl font-bold mb-4">🚨 Error de Base de Datos</h1>
                <pre className="bg-zinc-900 p-4 rounded text-left inline-block max-w-2xl overflow-auto text-xs font-mono border border-red-500/20">
                    {JSON.stringify(fetchError, null, 2)}
                </pre>
                <p className="mt-4 text-zinc-400">Por favor comparte este error con el desarrollador.</p>
            </div>
        );
    }

    // Calculate Stats based on Visual Pipeline Columns (pipeline_stage)
    // Fallback to 'estado' only if stage is missing
    const getStage = (l: any) => {
        if (l.pipeline_stage) return l.pipeline_stage.toLowerCase();
        // Legacy Fallback
        if (l.estado === 'ready_to_contact') return 'radar';
        if (l.estado === 'in_contact') return 'contactado';
        if (l.estado === 'proposal_sent') return 'negociacion';
        if (l.estado === 'won') return 'produccion';
        return 'unknown';
    };

    const totalLeads = leads.length;

    // Por Contactar: Columna 'Radar'
    const leadsContact = leads.filter(l => getStage(l) === 'radar').length;

    // En Proceso: 'Contactado' + 'Reunión' + 'Negociación'
    const leadsInProcess = leads.filter(l => {
        const s = getStage(l);
        return s === 'contactado' || s === 'reunion' || s === 'negociacion';
    }).length;

    // Cerrados: 'Producción'
    const leadsWon = leads.filter(l => getStage(l) === 'produccion').length;

    // B. Action Items (Today, Overdue & Tomorrow - 1 Day Buffer)
    const today = new Date();
    const bufferDate = new Date(today);
    bufferDate.setDate(today.getDate() + 1); // +1 Day (includes tomorrow)
    const bufferIso = bufferDate.toISOString().split('T')[0];

    const actionItems = leads?.filter(l => {
        // 1. Explicit Agenda (Today, Tomorrow, Overdue)
        const hasAgenda = l.next_action_date && l.next_action_date.split('T')[0] <= bufferIso;

        // 2. Implicit Rotting (Stale for > 3 days)
        const stage = getStage(l);
        const isStale = (stage === 'contactado' || stage === 'in_contact') &&
            (new Date().getTime() - new Date(l.last_activity_at || l.created_at).getTime() > 3 * 24 * 60 * 60 * 1000);

        return hasAgenda || isStale;
    }).sort((a, b) => {
        // Sort: Overdue/Stale first, then by date
        const dateA = a.next_action_date ? new Date(a.next_action_date).getTime() : 0;
        const dateB = b.next_action_date ? new Date(b.next_action_date).getTime() : 0;
        return dateA - dateB;
    }) || [];

    const isDark = true;

    return (
        <div className="p-8 max-w-[1600px] mx-auto space-y-8 fade-in-up">

            {/* Header */}
            <header className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Comando Central</h2>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Bienvenido al HQ, <span className="text-zinc-500">{user.user_metadata?.full_name?.split(' ')[0] || 'Agente'}</span>
                    </h1>
                </div>
                <div className="flex gap-3">
                    <div className="text-right">
                        <p className="text-2xl font-mono font-bold text-white">{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-zinc-500 uppercase">{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
            </header>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-12 h-12 text-cyan-500" />
                    </div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Leads</p>
                    <p className="text-4xl font-mono font-bold text-white">{totalLeads}</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-12 h-12 text-amber-500" />
                    </div>
                    <p className="text-amber-500/80 text-xs font-bold uppercase tracking-wider mb-1">Por Contactar</p>
                    <p className="text-4xl font-mono font-bold text-white">{leadsContact}</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-blue-500/80 text-xs font-bold uppercase tracking-wider mb-1">En Proceso</p>
                    <p className="text-4xl font-mono font-bold text-white">{leadsInProcess}</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-12 h-12 text-emerald-500" />
                    </div>
                    <p className="text-emerald-500/80 text-xs font-bold uppercase tracking-wider mb-1">Cerrados</p>
                    <p className="text-4xl font-mono font-bold text-white">{leadsWon}</p>
                </div>
            </div>

            {/* MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

                {/* LEFT: ACTION ITEMS (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Acciones Críticas
                        </h3>
                        <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold border border-amber-500/20">
                            {actionItems.length} Pendientes
                        </span>
                    </div>

                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden min-h-[400px]">
                        {actionItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 text-zinc-600">
                                <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">Bandeja limpia. ¡Buen trabajo!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {actionItems.map((item) => {
                                    const isStale = !item.next_action_date && (getStage(item) === 'contactado' || getStage(item) === 'in_contact');

                                    return (
                                        <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group">
                                            {/* DATE / STATUS BADGE */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${isStale ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {isStale ? (
                                                    <AlertCircle className="w-5 h-5 animate-pulse" />
                                                ) : (
                                                    <>
                                                        {new Date(item.next_action_date).getDate()}
                                                        <span className="text-[9px] uppercase block -mt-1">{new Date(item.next_action_date).toLocaleDateString('es-CL', { month: 'short' })}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-white text-sm truncate">{item.nombre}</h4>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase ${item.estado === 'won' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                        item.estado === 'discarded' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {item.estado}
                                                    </span>
                                                </div>
                                                <p className={`text-xs truncate ${isStale ? 'text-red-400 font-medium' : 'text-zinc-400'}`}>
                                                    {isStale ? '🔴 Cliente desatendido (>3 días sin respuesta)' : (item.next_action_note || 'Sin nota adjunta')}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/dashboard/radar?leadId=${item.id}`} // Deep Link by ID
                                                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"
                                            >
                                                Gestionar
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: QUICK LINKS & VIGILANTE (1/3) */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <LayoutDashboard className="w-5 h-5 text-zinc-400" />
                        Accesos Rápidos
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/dashboard/radar" className="group p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-cyan-500/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Radar Comercial</h4>
                                    <p className="text-xs text-zinc-500">Buscar y gestionar leads</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </Link>

                        <Link href="/dashboard/inbox" className="group p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-purple-500/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">Inbox</h4>
                                    <p className="text-xs text-zinc-500">Correos y conversaciones</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </Link>

                        <Link href="/dashboard/vault" className="group p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">El Vigilante</h4>
                                    <p className="text-xs text-zinc-500">Monitoreo de clientes</p>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Icon for Vigilante (Action Items)
function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    )
}
