"use client";

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Users, Receipt } from 'lucide-react';
import { useFinancialEngine } from '@/hooks/food-engine/useFinancialEngine';

interface FinanceDashboardProps {
    prefix: string;
}

export default function FinanceDashboard({ prefix }: FinanceDashboardProps) {
    const { data, loading } = useFinancialEngine(prefix);

    if (loading) return <div className="p-10 text-center opacity-20 animate-pulse font-black italic">Consolidando Finanzas...</div>;
    if (!data) return null;

    return (
        <div className="space-y-8">
            {/* --- MAIN KPIs --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Ventas Brutas" value={data.totalGross} sub="Ingreso total (30d)" icon={<TrendingUp />} color="text-green-500" />
                <MetricCard title="Gastos" value={data.totalExpenses} sub="Costos operativos" icon={<TrendingDown />} color="text-red-500" />
                <MetricCard title="Ganancia Neta" value={data.netProfit} sub="Utilidad real" icon={<DollarSign />} color="text-blue-400" border />
                <MetricCard title="Ticket Promedio" value={data.avgTicket} sub="Por cliente" icon={<Users />} color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* --- PAYMENT BREAKDOWN --- */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                    <h3 className="text-xl font-black italic uppercase mb-8 flex items-center gap-3">
                        <PieChart className="opacity-40" /> Métodos de Pago
                    </h3>
                    <div className="space-y-6">
                        {Object.entries(data.paymentBreakdown).map(([method, amount], i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-black italic uppercase text-[10px] opacity-40">{method}</span>
                                    <span className="font-black italic text-lg leading-none">${(amount as number).toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((amount as number) / data.totalGross) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- ACTIVITY --- */}
                <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                    <Receipt size={48} className="opacity-10 mb-6" />
                    <p className="text-4xl font-black italic uppercase leading-none mb-2">{data.orderCount}</p>
                    <p className="font-black italic uppercase text-xs opacity-40">Órdenes Procesadas</p>
                    <div className="mt-8 grid grid-cols-2 gap-12 border-t border-white/10 pt-8 w-full">
                        <div>
                            <p className="text-xl font-black italic">$0</p>
                            <p className="text-[10px] font-black uppercase opacity-40">Propinas Estimadas</p>
                        </div>
                        <div>
                            <p className="text-xl font-black italic">0</p>
                            <p className="text-[10px] font-black uppercase opacity-40">Clientes Nuevos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, sub, icon, color, border }: any) {
    return (
        <div className={`p-8 rounded-[2rem] bg-white/5 border ${border ? 'border-white/20' : 'border-white/5'}`}>
            <div className={`w-10 h-10 mb-6 flex items-center justify-center rounded-xl bg-white/5 ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-3xl font-black italic leading-none mb-2 ${color}`}>${value.toLocaleString()}</p>
            <p className="text-[10px] font-bold opacity-30 italic">{sub}</p>
        </div>
    );
}
