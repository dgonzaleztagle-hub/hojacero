"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Flame, Package, CheckCircle2,
    Bell, BellOff, ShoppingBag, User,
    Phone, LogOut, ChevronRight, AlertCircle,
    Check, DollarSign, Box, BarChart3
} from 'lucide-react';
import { getFoodDb } from '@/utils/food-engine/db';
import CashManager from './CashManager';
import InventoryManager from './InventoryManager';
import FinanceDashboard from './FinanceDashboard';

interface AdminTitanProps {
    prefix: string;
    clientName: string;
    accentColor?: string;
    secondaryColor?: string;
    showCash?: boolean;
    showInventory?: boolean;
    showFinance?: boolean;
    userId?: string;
}

export default function AdminTitan({
    prefix,
    clientName,
    accentColor = "#FFCC00",
    secondaryColor = "rgba(255, 204, 0, 0.1)",
    showCash = false,
    showInventory = false,
    showFinance = false,
    userId = "system"
}: AdminTitanProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pedidos' | 'metricas' | 'caja' | 'inventario' | 'finanzas'>('pedidos');
    const [currentSession, setCurrentSession] = useState<any>(null);
    const [sessionHistory, setSessionHistory] = useState<any[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<any>(null);
    const [liveSessionTotal, setLiveSessionTotal] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const db = getFoodDb(prefix);

    const fetchAll = async (isSilent = false) => {
        if (!isSilent) setLoading(true);

        try {
            const { data: ords } = await db.getOrders();
            if (ords) setOrders(ords);

            const { data: sess } = await db.getActiveSession();
            setCurrentSession(sess);

            const { data: history } = await db.getSessionHistory();
            if (history) setSessionHistory(history);

            const { data: stats } = await db.getMonthlyStats();
            if (stats) {
                const total = stats.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
                setMonthlyStats({ total, count: stats.length });
            }

            if (sess) {
                const liveTotal = (ords || [])
                    .filter((o: any) => o.session_id === sess.id)
                    .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
                setLiveSessionTotal(liveTotal);
            } else {
                setLiveSessionTotal(0);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();

        const orderSub = db.subscribeToChanges('orders', () => fetchAll(true));
        const sessionSub = db.subscribeToChanges('sessions', () => fetchAll(true));

        return () => {
            orderSub.unsubscribe();
            sessionSub.unsubscribe();
        };
    }, [prefix]);

    const lastOrderCount = useRef(0);
    useEffect(() => {
        if (orders.length > lastOrderCount.current && lastOrderCount.current > 0) {
            if (soundEnabled && audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
        }
        lastOrderCount.current = orders.length;
    }, [orders, soundEnabled]);

    const handleUpdateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        const { error } = await db.updateOrderStatus(id, status);
        if (error) alert("Error al actualizar: " + error.message);
        setUpdatingId(null);
    };

    const handleCloseSession = async () => {
        if (!currentSession) return;
        const confirmClose = window.confirm("¿Estás seguro de cerrar la jornada?");
        if (!confirmClose) return;

        const { data: sessionOrders } = await db.getOrders(currentSession.id);
        const total = (sessionOrders || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

        const { error } = await db.closeSession(
            currentSession.id,
            total,
            (sessionOrders || []).length
        );

        if (!error) {
            alert(`Jornada cerrada.\nTotal: $${total.toLocaleString()}`);
            fetchAll();
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} style={{ color: accentColor }} className="text-4xl font-black italic uppercase">
                Cargando {clientName}...
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-12 selection:bg-white selection:text-black">
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />

            {/* Header */}
            <header style={{ backgroundColor: accentColor }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 p-8 rounded-[2.5rem] text-black shadow-[20px_20px_0_rgba(255,255,255,0.05)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
                        <Flame size={40} className={currentSession ? 'animate-pulse' : 'opacity-20'} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{clientName} <br /> CONTROL</h1>
                        <p className="font-bold italic uppercase opacity-60 mt-1 text-xs tabular-nums">
                            {currentSession ? `🟢 ABIERTO DESDE ${new Date(currentSession.start_time).toLocaleTimeString()}` : '🔴 LOCAL CERRADO'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 text-white">
                    <button onClick={() => setActiveTab('pedidos')} className={`px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black transition-all ${activeTab === 'pedidos' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        <ShoppingBag size={20} /> Pedidos
                    </button>

                    {showCash && (
                        <button onClick={() => setActiveTab('caja')} className={`px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black transition-all ${activeTab === 'caja' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            <DollarSign size={20} /> Caja
                        </button>
                    )}

                    {showInventory && (
                        <button onClick={() => setActiveTab('inventario')} className={`px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black transition-all ${activeTab === 'inventario' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            <Box size={20} /> Stock
                        </button>
                    )}

                    {showFinance && (
                        <button onClick={() => setActiveTab('finanzas')} className={`px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black transition-all ${activeTab === 'finanzas' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            <BarChart3 size={20} /> Finanzas
                        </button>
                    )}

                    <button onClick={() => setActiveTab('metricas')} className={`px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black transition-all ${activeTab === 'metricas' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        <AlertCircle size={20} /> Métricas
                    </button>

                    {currentSession ? (
                        <button onClick={handleCloseSession} className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black hover:bg-black transition-colors">
                            <LogOut size={20} /> Cerrar
                        </button>
                    ) : (
                        <button onClick={() => db.startSession()} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black hover:bg-black transition-colors">
                            <Flame size={20} /> Abrir
                        </button>
                    )}

                    <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-4 rounded-2xl border-4 border-black transition-all ${soundEnabled ? 'bg-black text-[#FFCC00]' : 'bg-red-600 text-white'}`}>
                        {soundEnabled ? <Bell size={24} /> : <BellOff size={24} />}
                    </button>
                </div>
            </header>

            {activeTab === 'metricas' ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {currentSession && (
                            <div style={{ borderColor: accentColor, boxShadow: `0 0 30px ${secondaryColor}` }} className="bg-white/5 p-8 rounded-[2.5rem] border-2 relative overflow-hidden group">
                                <p style={{ color: accentColor }} className="text-[10px] font-black italic uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <span style={{ backgroundColor: accentColor }} className="w-2 h-2 rounded-full animate-ping" />
                                    VENTA TURNO
                                </p>
                                <h2 className="text-7xl font-black italic text-white tracking-tighter leading-tight">${liveSessionTotal.toLocaleString()}</h2>
                            </div>
                        )}
                        <MetricCard title="VENTAS DEL MES" value={`$${monthlyStats?.total?.toLocaleString() || 0}`} label="Bruto Acumulado" accentColor={accentColor} />
                        <MetricCard title="PEDIDOS TOTALES" value={monthlyStats?.count || 0} label="Órdenes Procesadas" />
                        <MetricCard title="TICKET PROMEDIO" value={`$${monthlyStats?.count ? Math.round(monthlyStats.total / monthlyStats.count).toLocaleString() : 0}`} label="Valor Orden" />
                    </div>

                    <div className="bg-white/5 p-10 rounded-[3rem] border-2 border-white/10">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">HISTORIAL DE JORNADAS</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <tbody className="divide-y divide-white/5">
                                    {sessionHistory.map((sess, idx) => (
                                        <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="py-8 px-4 font-black italic text-2xl uppercase">{new Date(sess.start_time).toLocaleDateString()}</td>
                                            <td className="py-8 px-4 text-center font-black italic text-4xl opacity-20 group-hover:opacity-100">{sess.orders_count || 0}</td>
                                            <td style={{ color: accentColor }} className="py-8 px-4 text-right font-black italic text-5xl tabular-nums">${(sess.total_sales || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'caja' ? (
                <CashManager prefix={prefix} userId={userId} />
            ) : activeTab === 'inventario' ? (
                <InventoryManager prefix={prefix} userId={userId} />
            ) : activeTab === 'finanzas' ? (
                <FinanceDashboard prefix={prefix} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {orders.filter(o => o.status !== 'entregado').map((order) => (
                            <OrderCard key={order.id} order={order} updatingId={updatingId} onUpdate={handleUpdateStatus} accentColor={accentColor} prefix={prefix} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

function MetricCard({ title, value, label, accentColor }: any) {
    return (
        <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 group hover:border-white/30 transition-all">
            <p style={{ color: accentColor || 'white', opacity: accentColor ? 1 : 0.4 }} className="text-[10px] font-black italic uppercase mb-4 tracking-[0.2em]">{title}</p>
            <h2 className="text-7xl font-black italic tracking-tighter leading-tight" style={{ color: accentColor || 'white' }}>{value}</h2>
            <p className="text-[10px] font-bold italic text-white/20 uppercase mt-2">{label}</p>
        </div>
    );
}

function OrderCard({ order, updatingId, onUpdate, accentColor, prefix }: any) {
    const itemsTable = `${prefix}order_items`;
    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-[3rem] border-4 flex flex-col justify-between bg-white/5 ${order.status === 'cocinando' ? 'border-orange-500' : 'border-white/10'}`}>
            <div>
                <div className="flex justify-between items-start mb-6">
                    <span style={{ backgroundColor: accentColor }} className="text-black px-4 py-1 rounded-full font-black italic text-xs uppercase">{order.order_code}</span>
                    <span className="text-xs opacity-40 font-bold uppercase italic">{new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase leading-tight mb-2">{order.client_name}</h3>
                <div className="flex items-center gap-2 font-bold italic text-sm mb-4 opacity-60">
                    <Phone size={14} /> {order.client_whatsapp}
                </div>
                <div className="space-y-2 mb-8 border-t border-white/10 pt-4">
                    {order[itemsTable]?.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-xs font-bold uppercase italic">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="opacity-40">${(item.unit_price || 0).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-end mb-4">
                    <p className="text-xs font-black italic opacity-40 uppercase">Total</p>
                    <p style={{ color: accentColor }} className="text-3xl font-black italic">${(order.total_amount || 0).toLocaleString()}</p>
                </div>
                <StatusButton order={order} updatingId={updatingId} onUpdate={onUpdate} accentColor={accentColor} />
            </div>
        </motion.div>
    );
}

function StatusButton({ order, updatingId, onUpdate, accentColor }: any) {
    const isUpdating = updatingId === order.id;
    if (order.status === 'pendiente') {
        return <button disabled={isUpdating} onClick={() => onUpdate(order.id, 'cocinando')} style={{ backgroundColor: accentColor }} className="w-full text-black py-5 rounded-2xl font-black italic uppercase flex items-center justify-center gap-2 shadow-[0_8px_0_rgba(0,0,0,0.2)]">{isUpdating ? <Clock className="animate-spin" /> : <Flame size={20} />} EMPEZAR COMANDA</button>;
    }
    if (order.status === 'cocinando') {
        return <button disabled={isUpdating} onClick={() => onUpdate(order.id, 'listo')} className="w-full bg-green-500 text-black py-5 rounded-2xl font-black italic uppercase flex items-center justify-center gap-2 shadow-[0_8px_0_rgba(0,0,0,0.2)]">{isUpdating ? <Clock className="animate-spin" /> : <Package size={20} />} MARCAR LISTO</button>;
    }
    if (order.status === 'listo') {
        return <button disabled={isUpdating} onClick={() => onUpdate(order.id, 'entregado')} className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black italic uppercase flex items-center justify-center gap-2 shadow-[0_8px_0_rgba(0,0,0,0.2)]">{isUpdating ? <Clock className="animate-spin" /> : <CheckCircle2 size={20} />} ENTREGAR PEDIDO</button>;
    }
    return null;
}
