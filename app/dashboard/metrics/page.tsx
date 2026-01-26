'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import {
    Activity,
    TrendingUp,
    Users,
    AlertCircle,
    DollarSign,
    Calendar,
    Briefcase,
    CreditCard,
    BarChart2,
    Code,
    Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsState {
    totalClients: number;
    activeClients: number;
    churnedClients: number;
    mrr: number; // Monthly Recurring Revenue
    ytdIncome: number; // Year to Date Income
    paymentsToday: number;
    paymentsWeek: number;
    paymentsMonth: number;
    paymentsYear: number;
    incomeType: {
        mantencion: number;
        implementacion: number;
    };
    recentActivity: any[];
    chartData?: any[];
    pausedSitesData?: any[];
    loading: boolean;
    partnerRevenue?: {
        daniel: number;
        gaston: number;
        total: number;
        dealsCount: {
            daniel_major: number;
            gaston_major: number;
        };
    };
}

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<MetricsState>({
        totalClients: 0,
        activeClients: 0,
        churnedClients: 0,
        mrr: 0,
        ytdIncome: 0,
        paymentsToday: 0,
        paymentsWeek: 0,
        paymentsMonth: 0,
        paymentsYear: 0,
        incomeType: {
            mantencion: 0,
            implementacion: 0
        },
        recentActivity: [],
        loading: true
    });

    const supabase = createClient();

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            // 1. Fetch Sites with Status for accurate MRR and Churn logic
            const { data: sites, error: sitesError } = await supabase
                .from('monitored_sites')
                .select(`
                    id, 
                    client_name, 
                    monto_mensual, 
                    status, 
                    contract_start,
                    site_status (is_active, reason, notes)
                `);

            if (sitesError) throw sitesError;

            // 2. Fetch Payments for Income Stats & Chart
            const { data: pagos, error: pagosError } = await supabase
                .from('pagos')
                .select(`
                    monto, 
                    fecha_pago, 
                    tipo,
                    site_id,
                    monitored_sites (client_name)
                `)
                .order('fecha_pago', { ascending: false });

            if (pagosError) throw pagosError;

            // 3. Fetch Won Leads for Partner Splits
            const { data: wonLeads, error: leadsError } = await supabase
                .from('leads')
                .select('deal_type, deal_amount, partner_split')
                .eq('estado', 'won');

            if (leadsError) console.error("Error fetching leads for splits:", leadsError); // Non-blocking

            // --- CALCULATIONS ---

            // Active sites are those logically active in contract AND technically active in switch
            // site_status comes as array from Supabase 1:many logic usually, we take first or check structure
            const activeSites = sites?.filter(s => {
                const statusObj = Array.isArray(s.site_status) ? s.site_status[0] : s.site_status;
                // If is_active is explicitly false, it's paused. Otherwise (true or undefined) it's active.
                return s.status === 'active' && statusObj?.is_active !== false;
            }) || [];

            const pausedSites = sites?.filter(s => {
                const statusObj = Array.isArray(s.site_status) ? s.site_status[0] : s.site_status;
                return statusObj?.is_active === false;
            }) || [];



            const mrr = activeSites.reduce((sum, site) => sum + (site.monto_mensual || 0), 0);

            // Partner Revenue Calculation
            let danielTotal = 0;
            let gastonTotal = 0;
            let danielMajorCount = 0;
            let gastonMajorCount = 0;

            wonLeads?.forEach(lead => {
                const amount = lead.deal_amount || 0;
                let danielShare = 0;

                // Logic based on types
                if (lead.partner_split === 'daniel_major') { // Plan 150 or Custom Dev
                    danielShare = 0.65;
                    danielMajorCount++;
                } else if (lead.partner_split === 'gaston_major') { // Custom Mkt
                    danielShare = 0.35;
                    gastonMajorCount++;
                } else {
                    // Fallback using deal_type if partner_split is missing (legacy safety)
                    if (lead.deal_type === 'custom_mkt') {
                        danielShare = 0.35;
                        gastonMajorCount++;
                    } else {
                        // Default to Daniel Major (Plan 150 / Dev / Standard)
                        danielShare = 0.65;
                        danielMajorCount++;
                    }
                }

                danielTotal += amount * danielShare;
                gastonTotal += amount * (1 - danielShare);
            });

            // Time Ranges
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const startOfWeekDate = new Date(now);
            startOfWeekDate.setDate(now.getDate() - now.getDay());
            const startOfWeek = startOfWeekDate.toISOString().split('T')[0];
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();

            let todayTotal = 0;
            let weekTotal = 0;
            let monthTotal = 0;
            let yearTotal = 0;
            let mantencionTotal = 0;
            let implementacionTotal = 0;

            // Chart Data (Last 6 months)
            const last6Months = Array.from({ length: 6 }, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (5 - i));
                return {
                    month: d.toLocaleString('es-CL', { month: 'short' }),
                    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
                    mantencion: 0,
                    implementacion: 0,
                    total: 0
                };
            });

            pagos?.forEach(p => {
                const monto = p.monto || 0;
                const fecha = p.fecha_pago;
                const fechaObj = new Date(fecha + "T00:00:00"); // Fix timezone offset issues roughly

                // Time checks
                if (fecha >= startOfToday) todayTotal += monto;
                if (fecha >= startOfWeek) weekTotal += monto;
                if (fecha >= startOfMonth) monthTotal += monto;
                if (fecha >= startOfYear) yearTotal += monto;

                if (p.tipo === 'implementacion') {
                    implementacionTotal += monto;
                } else {
                    mantencionTotal += monto;
                }

                // Chart Aggregation
                const monthKey = `${fechaObj.getFullYear()}-${String(fechaObj.getMonth() + 1).padStart(2, '0')}`;
                const chartIndex = last6Months.findIndex(m => m.key === monthKey);
                if (chartIndex !== -1) {
                    if (p.tipo === 'implementacion') {
                        last6Months[chartIndex].implementacion += monto;
                    } else {
                        last6Months[chartIndex].mantencion += monto;
                    }
                    last6Months[chartIndex].total += monto;
                }
            });

            // Find max for scaling chart (based on total)
            const maxChartValue = Math.max(...last6Months.map(m => m.total), 10000);

            setMetrics({
                totalClients: sites?.length || 0,
                activeClients: activeSites.length,
                churnedClients: pausedSites.length,
                pausedSitesData: pausedSites,
                mrr,
                ytdIncome: yearTotal,
                paymentsToday: todayTotal,
                paymentsWeek: weekTotal,
                paymentsMonth: monthTotal,
                paymentsYear: yearTotal,
                incomeType: {
                    mantencion: mantencionTotal,
                    implementacion: implementacionTotal
                },
                recentActivity: pagos?.slice(0, 5) || [],
                chartData: last6Months.map(m => ({
                    ...m,
                    heightMantencion: (m.mantencion / maxChartValue) * 100,
                    heightImplementacion: (m.implementacion / maxChartValue) * 100,
                    totalPercentage: (m.total / maxChartValue) * 100
                })),

                partnerRevenue: {
                    daniel: danielTotal,
                    gaston: gastonTotal,
                    total: danielTotal + gastonTotal,
                    dealsCount: {
                        daniel_major: danielMajorCount,
                        gaston_major: gastonMajorCount
                    }
                },
                loading: false
            });

        } catch (error) {
            console.error('Error fetching metrics:', error);
            setMetrics(prev => ({ ...prev, loading: false }));
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
    };

    if (metrics.loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-xl">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Dashboard Financiero
                    </h1>
                    <p className="text-zinc-400 mt-1">Vista de águila: {new Date().getFullYear()}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-zinc-500">MRR Efectivo (Activos)</p>
                    <p className="text-3xl font-mono font-bold text-emerald-400">{formatCurrency(metrics.mrr)}</p>
                    <p className="text-xs text-zinc-600">Proyección Anual: {formatCurrency(metrics.mrr * 12)}</p>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/vault?tab=activos">
                    <StatCard
                        title="Ingresos Hoy"
                        value={formatCurrency(metrics.paymentsToday)}
                        icon={DollarSign}
                        trend={metrics.paymentsToday > 0 ? "🚀 Entró dinero hoy" : "Sin movimientos"}
                        color="text-emerald-400"
                    />
                </Link>
                <Link href="/dashboard/vault?tab=activos">
                    <StatCard
                        title="Ingresos Mes"
                        value={formatCurrency(metrics.paymentsMonth)}
                        icon={TrendingUp}
                        color="text-blue-400"
                        // Simple projection logic: active clients * fee
                        subtitle={`Meta: ${formatCurrency(metrics.mrr)}`}
                    />
                </Link>
                <StatCard
                    title="Total Año (YTD)"
                    value={formatCurrency(metrics.ytdIncome)}
                    icon={Briefcase}
                    color="text-amber-400"
                />
                <Link href="/dashboard/vault?tab=criticos">
                    <StatCard
                        title="Cartera Vencida"
                        value={metrics.churnedClients.toString()}
                        icon={AlertCircle}
                        color="text-red-500"
                        subtitle="Clientes suspendidos"
                    />
                </Link>
            </div>

            {/* Partner Split Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DANIEL */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-cyan-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Daniel (Dev/Tech)</h3>
                                <p className="text-xs text-cyan-400">Target: 65% Plan 150 / Dev</p>
                            </div>
                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                <Code className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-zinc-500">Revenue Acumulado</p>
                                <p className="text-3xl font-mono font-bold text-white">{formatCurrency(metrics.partnerRevenue?.daniel || 0)}</p>
                            </div>

                            {/* Distribution Bar */}
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-500"
                                    style={{ width: `${((metrics.partnerRevenue?.daniel || 0) / ((metrics.partnerRevenue?.total || 1))) * 100}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                                <div>
                                    <span className="block text-white font-bold">{metrics.partnerRevenue?.dealsCount?.daniel_major || 0} Deals</span>
                                    MAJOR (65%)
                                </div>
                                <div>
                                    <span className="block text-white font-bold">{metrics.partnerRevenue?.dealsCount?.gaston_major || 0} Deals</span>
                                    MINOR (35%)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GASTON */}
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-purple-500/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Gastón (Mkt/Ops)</h3>
                                <p className="text-xs text-purple-400">Target: 65% Mkt / 35% Plan 150</p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                <Megaphone className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-zinc-500">Revenue Acumulado</p>
                                <p className="text-3xl font-mono font-bold text-white">{formatCurrency(metrics.partnerRevenue?.gaston || 0)}</p>
                            </div>

                            {/* Distribution Bar */}
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500"
                                    style={{ width: `${((metrics.partnerRevenue?.gaston || 0) / ((metrics.partnerRevenue?.total || 1))) * 100}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                                <div>
                                    <span className="block text-white font-bold">{metrics.partnerRevenue?.dealsCount?.gaston_major || 0} Deals</span>
                                    MAJOR (65%)
                                </div>
                                <div>
                                    <span className="block text-white font-bold">{metrics.partnerRevenue?.dealsCount?.daniel_major || 0} Deals</span>
                                    MINOR (35%)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                        {/* Background Grid Lines (Decorative) */}
                        <div className="absolute inset-x-0 bottom-10 top-20 flex flex-col justify-between pointer-events-none opacity-20 px-6">
                            <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                            <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                            <div className="w-full h-px bg-white/10 border-t border-dashed border-white/20"></div>
                        </div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-indigo-400" />
                                Tendencia de Ingresos (6 Meses)
                            </h2>
                            <div className="flex gap-4 text-xs bg-zinc-900/80 px-3 py-1.5 rounded-full border border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-full"></div>
                                    <span className="text-zinc-400 font-medium">Mantención</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-full"></div>
                                    <span className="text-zinc-400 font-medium">Implementación</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="h-64 flex items-end justify-around px-2 gap-4 relative z-10">
                            {metrics.chartData?.map((data: any, i: number) => (
                                <div key={i} className="flex flex-col items-center justify-end h-full group w-16">
                                    {/* Value Label (Top) */}
                                    <div className={`mb-2 text-[10px] font-mono font-bold transition-all duration-300 ${data.total > 0 ? 'text-white translate-y-0 opacity-100' : 'text-transparent translate-y-2 opacity-0'}`}>
                                        {data.total > 0 ? formatCurrency(data.total) : '$0'}
                                    </div>

                                    {/* Bar Container */}
                                    <div className="w-8 md:w-10 relative flex flex-col justify-end bg-zinc-800/30 rounded-t-lg overflow-hidden backdrop-blur-sm transition-all duration-500 group-hover:bg-zinc-800/50" style={{ height: `${data.totalPercentage}%`, minHeight: data.total > 0 ? '4px' : '0px' }}>

                                        {/* Implementation Segment */}
                                        {data.implementacion > 0 && (
                                            <div
                                                className="w-full bg-gradient-to-t from-pink-600 to-pink-400 relative group/imp border-b border-pink-900/20"
                                                style={{ height: `${(data.implementacion / data.total) * 100}%` }}
                                            >
                                                <div className="opacity-0 group-hover/imp:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-pink-900/90 text-pink-200 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-20">
                                                    IMP: {formatCurrency(data.implementacion)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Mantencion Segment */}
                                        {data.mantencion > 0 && (
                                            <div
                                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 relative group/man"
                                                style={{ height: `${(data.mantencion / data.total) * 100}%` }}
                                            >
                                                <div className="opacity-0 group-hover/man:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-indigo-900/90 text-indigo-200 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none transition-opacity z-20">
                                                    MAN: {formatCurrency(data.mantencion)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* X-Axis Label */}
                                    <span className="text-[10px] text-zinc-500 font-medium uppercase mt-3 tracking-wider group-hover:text-zinc-300 transition-colors">
                                        {data.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8">

                    {/* Recent Activity */}
                    <div className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-semibold mb-6">Últimos Pagos</h2>
                        <div className="space-y-4">
                            {metrics.recentActivity.map((pago, i) => (
                                <Link
                                    href={`/dashboard/vault?search=${encodeURIComponent(pago.monitored_sites?.client_name || '')}`}
                                    key={i}
                                    className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/5 cursor-pointer block"
                                >
                                    <div>
                                        <p className="text-white font-medium">{formatCurrency(pago.monto)}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${pago.tipo === 'implementacion' ? 'bg-pink-500' : 'bg-indigo-500'}`}></span>
                                            <p className="text-xs text-zinc-500 capitalize">{pago.tipo || 'Mantención'}</p>
                                            <span className="text-zinc-600 text-[10px]">•</span>
                                            <p className="text-xs text-zinc-400 font-medium truncate max-w-[120px]">
                                                {pago.monitored_sites?.client_name || 'Desconocido'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-400">{new Date(pago.fecha_pago).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
                            {metrics.recentActivity.length === 0 && (
                                <p className="text-zinc-500 text-center py-4">No hay actividad reciente</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function StatCard({ title, value, icon: Icon, trend, color, subtitle }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-400 font-medium">{title}</span>
                <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            {trend && <div className="text-xs text-emerald-400">{trend}</div>}
            {subtitle && <div className="text-xs text-zinc-500 mt-1">{subtitle}</div>}
        </motion.div>
    );
}
