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
    BarChart2
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Chart */}
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-indigo-400" />
                                Tendencia de Ingresos (6 Meses)
                            </h2>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                                    <span className="text-zinc-400">Mantención</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-pink-500 rounded-sm"></div>
                                    <span className="text-zinc-400">Implementación</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between px-4 gap-4 border-b border-white/5 pb-2">
                            {metrics.chartData?.map((data: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    <div className="w-full relative flex flex-col justify-end gap-0.5 rounded-t-lg overflow-hidden transition-all duration-500" style={{ height: `${data.totalPercentage}%` }}>
                                        {/* Implementation Segment (Top) */}
                                        {data.implementacion > 0 && (
                                            <div
                                                className="w-full bg-pink-500/80 hover:bg-pink-500 transition-colors relative group/imp"
                                                style={{ height: `${(data.implementacion / data.total) * 100}%` }}
                                            >
                                                <div className="invisible group-hover/imp:visible absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded z-20 whitespace-nowrap border border-white/10">
                                                    IMP: {formatCurrency(data.implementacion)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Mantencion Segment (Bottom) */}
                                        {data.mantencion > 0 && (
                                            <div
                                                className="w-full bg-indigo-500/80 hover:bg-indigo-500 transition-colors relative group/man"
                                                style={{ height: `${(data.mantencion / data.total) * 100}%` }}
                                            >
                                                <div className="invisible group-hover/man:visible absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-2 py-1 rounded z-20 whitespace-nowrap border border-white/10">
                                                    MAN: {formatCurrency(data.mantencion)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Total Label on Top (Always visible if data > 0) */}
                                        {data.total > 0 && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                {formatCurrency(data.total)}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-zinc-500 font-medium uppercase mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
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
