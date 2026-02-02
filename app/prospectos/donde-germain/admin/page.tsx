"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import {
    Clock, Flame, Package, CheckCircle2,
    Bell, BellOff, ShoppingBag, User,
    Phone, LogOut, ChevronRight, AlertCircle,
    Check
} from 'lucide-react';
import Link from 'next/link';

export default function GermainAdminPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pedidos' | 'metricas'>('pedidos');
    const [currentSession, setCurrentSession] = useState<any>(null);
    const [sessionHistory, setSessionHistory] = useState<any[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<any>(null);
    const [liveSessionTotal, setLiveSessionTotal] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const supabase = createClient();

        const fetchAll = async (isSilent = false) => {
            if (!isSilent) setLoading(true);
            const { data: ords } = await supabase
                .from('germain_orders')
                .select('*, germain_order_items(*)')
                .order('created_at', { ascending: false });
            if (ords) setOrders(ords);

            const { data: sess } = await supabase
                .from('germain_sessions')
                .select('*')
                .eq('status', 'open')
                .maybeSingle();
            setCurrentSession(sess);

            const { data: history } = await supabase
                .from('germain_sessions')
                .select('*')
                .eq('status', 'closed')
                .order('start_time', { ascending: false })
                .limit(10);
            if (history) setSessionHistory(history);

            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
            const { data: stats } = await supabase
                .from('germain_orders')
                .select('total_amount')
                .gte('created_at', startOfMonth);

            if (stats) {
                const total = stats.reduce((sum, o) => sum + o.total_amount, 0);
                setMonthlyStats({ total, count: stats.length });
            }

            // Calcular venta viva de la sesión actual
            if (sess) {
                const liveTotal = (ords || [])
                    .filter(o => o.session_id === sess.id)
                    .reduce((sum, o) => sum + o.total_amount, 0);
                setLiveSessionTotal(liveTotal);
            } else {
                setLiveSessionTotal(0);
            }

            if (!isSilent) setLoading(false);
        };

        fetchAll();

        const channel = supabase
            .channel('admin_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'germain_orders' }, () => fetchAll(true))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'germain_sessions' }, () => fetchAll(true))
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    // Efecto separado para el sonido para no reiniciar la suscripción
    const lastOrderCount = useRef(0);
    useEffect(() => {
        if (orders.length > lastOrderCount.current && lastOrderCount.current > 0) {
            if (soundEnabled && audioRef.current) {
                audioRef.current.play().catch(e => console.log("Audio fail:", e));
            }
        }
        lastOrderCount.current = orders.length;
    }, [orders, soundEnabled]);

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        // Optimistic UI update
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

        const supabase = createClient();
        const { error } = await supabase
            .from('germain_orders')
            .update({ status })
            .eq('id', id);

        if (error) {
            alert("Error al actualizar: " + error.message);
            // Rollback is complex here but we at least alert
        }
        setUpdatingId(null);
    };

    const startSession = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('germain_sessions')
            .insert({ status: 'open', opening_cash: 0 })
            .select()
            .single();
        if (data) setCurrentSession(data);
    };

    const closeSession = async () => {
        if (!currentSession) return;
        const supabase = createClient();

        // --- LÓGICA DE CAPTURA PURA POR SESIÓN ---
        // Contamos solo lo que pertenece a esta sesión específica
        const { data: sessionOrders } = await supabase
            .from('germain_orders')
            .select('total_amount')
            .eq('session_id', currentSession.id);

        const total = (sessionOrders || []).reduce((sum, o) => sum + o.total_amount, 0);

        const { error } = await supabase
            .from('germain_sessions')
            .update({
                status: 'closed',
                end_time: new Date().toISOString(),
                total_sales: total,
                orders_count: (sessionOrders || []).length
            })
            .eq('id', currentSession.id);

        if (!error) {
            setCurrentSession(null);
            // Refrescar historial
            const { data: history } = await supabase
                .from('germain_sessions')
                .select('*')
                .eq('status', 'closed')
                .order('start_time', { ascending: false })
                .limit(10);
            if (history) setSessionHistory(history);

            alert(`Jornada cerrada con éxito.\nTotal: $${total.toLocaleString()}\nPEDIDOS: ${(sessionOrders || []).length}`);
        } else {
            alert("Error al cerrar jornada: " + error.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="text-[#FFCC00] text-4xl font-black italic">GERMAIN ADMIN...</motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white font-sans p-6 lg:p-12 selection:bg-[#FFCC00] selection:text-black">
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-[#FFCC00] p-8 rounded-[2.5rem] text-black shadow-[20px_20px_0_rgba(255,204,0,0.1)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-[#FFCC00]">
                        <Flame size={40} className={currentSession ? 'animate-pulse' : 'opacity-20'} />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">GERMAIN <br /> CONTROL</h1>
                        <p className="font-bold italic uppercase opacity-60 mt-1 text-xs">
                            {currentSession ? `🟢 LOCAL ABIERTO DESDE ${new Date(currentSession.start_time).toLocaleTimeString()}` : '🔴 LOCAL CERRADO'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setActiveTab(activeTab === 'pedidos' ? 'metricas' : 'pedidos')}
                        className="bg-black/10 border-4 border-black px-6 py-4 rounded-2xl font-black italic uppercase hover:bg-black hover:text-[#FFCC00] transition-all flex items-center gap-2"
                    >
                        {activeTab === 'pedidos' ? <AlertCircle size={20} /> : <ShoppingBag size={20} />}
                        {activeTab === 'pedidos' ? 'Métricas' : 'Ver Pedidos'}
                    </button>

                    {currentSession ? (
                        <button
                            onClick={closeSession}
                            className="bg-black text-[#FFCC00] px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black hover:scale-105 transition-transform"
                        >
                            <LogOut size={20} /> Cerrar Jornada
                        </button>
                    ) : (
                        <button
                            onClick={startSession}
                            className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black italic uppercase flex items-center gap-2 border-4 border-black hover:scale-105 transition-transform"
                        >
                            <Flame size={20} /> Abrir Local
                        </button>
                    )}

                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-4 rounded-2xl border-4 border-black transition-all ${soundEnabled ? 'bg-black text-[#FFCC00]' : 'bg-red-600 text-white animate-pulse'}`}
                    >
                        {soundEnabled ? <Bell size={24} /> : <BellOff size={24} />}
                    </button>
                </div>
            </header>

            {activeTab === 'metricas' ? (
                <div className="space-y-12">
                    <div className={`grid grid-cols-1 ${currentSession ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6`}>
                        {currentSession && (
                            <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-[#FFCC00]/50 relative overflow-hidden group hover:border-[#FFCC00] transition-all duration-300 shadow-[0_0_30px_rgba(255,204,0,0.1)]">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCC00]/10 blur-3xl animate-pulse" />
                                <p className="text-[10px] font-black italic uppercase text-[#FFCC00] mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#FFCC00] rounded-full animate-ping" />
                                    VENTA DEL TURNO (VIVO)
                                </p>
                                <h2 className="text-7xl font-black italic text-white tracking-tighter leading-tight drop-shadow-md">
                                    ${liveSessionTotal.toLocaleString()}
                                </h2>
                                <p className="text-[10px] font-bold italic text-[#FFCC00]/40 uppercase mt-2">Progreso Actual</p>
                            </div>
                        )}

                        <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 relative overflow-hidden group hover:border-[#FFCC00]/30 transition-all duration-300">
                            <p className="text-[10px] font-black italic uppercase text-[#FFCC00] mb-4 tracking-[0.2em]">VENTAS DEL MES</p>
                            <h2 className="text-7xl font-black italic text-[#FFCC00] tracking-tighter leading-tight">
                                ${monthlyStats?.total?.toLocaleString() || 0}
                            </h2>
                            <p className="text-[10px] font-bold italic text-white/20 uppercase mt-2">Bruto Acumulado</p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
                            <p className="text-[10px] font-black italic uppercase text-white/40 mb-4 tracking-[0.2em]">PEDIDOS TOTALES</p>
                            <h2 className="text-7xl font-black italic text-white tracking-tighter leading-tight">
                                {monthlyStats?.count || 0}
                            </h2>
                            <p className="text-[10px] font-bold italic text-white/20 uppercase mt-2">Órdenes Procesadas</p>
                        </div>

                        <div className="bg-white/5 p-8 rounded-[2.5rem] border-2 border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                            <p className="text-[10px] font-black italic uppercase text-blue-400 mb-4 tracking-[0.2em]">TICKET PROMEDIO</p>
                            <h2 className="text-7xl font-black italic text-blue-400 tracking-tighter leading-tight">
                                ${monthlyStats?.count ? Math.round(monthlyStats.total / monthlyStats.count).toLocaleString() : 0}
                            </h2>
                            <p className="text-[10px] font-bold italic text-white/20 uppercase mt-2">Valor de Orden</p>
                        </div>
                    </div>

                    <div className="bg-white/5 p-10 rounded-[3rem] border-2 border-white/10">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">HISTORIAL DE JORNADAS</h3>
                            <div className="h-[1px] flex-1 mx-8 bg-white/10" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-white/10 text-[10px] font-black italic uppercase text-white/20 tracking-widest">
                                        <th className="pb-6 px-4">DÍA</th>
                                        <th className="pb-6 px-4 text-center">TURNO</th>
                                        <th className="pb-6 px-4 text-center">PEDIDOS</th>
                                        <th className="pb-6 px-4 text-right">TOTAL VENTAS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sessionHistory.length > 0 ? (
                                        sessionHistory.map((sess, idx) => (
                                            <tr key={sess.id || idx} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="py-8 px-4 font-black italic text-2xl uppercase">
                                                    {new Date(sess.start_time).toLocaleDateString('es-CL')}
                                                </td>
                                                <td className="py-8 px-4 text-center">
                                                    <span className="text-sm font-bold opacity-40 uppercase tabular-nums">
                                                        {new Date(sess.start_time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                                        <span className="mx-2 opacity-10">/</span>
                                                        {sess.end_time ? new Date(sess.end_time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }) : '--'}
                                                    </span>
                                                </td>
                                                <td className="py-8 px-4 text-center font-black italic text-4xl opacity-20 group-hover:opacity-100 transition-opacity">
                                                    {sess.orders_count || 0}
                                                </td>
                                                <td className="py-8 px-4 text-right font-black italic text-5xl text-[#FFCC00] tracking-tighter tabular-nums">
                                                    ${(sess.total_sales || 0).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center opacity-10 font-black italic uppercase text-4xl tracking-tighter">No hay jornadas</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-white">
                    <AnimatePresence mode="popLayout">
                        {orders.filter(o => o.status !== 'entregado').map((order) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    boxShadow: order.status === 'cocinando' ? '0 0 40px rgba(255,100,0,0.1)' : 'none'
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={order.id}
                                className={`p-8 rounded-[3rem] border-4 flex flex-col justify-between transition-all duration-500 ${order.status === 'entregado' ? 'opacity-40 grayscale border-white/5' : order.status === 'cocinando' ? 'bg-gradient-to-br from-white/10 to-transparent border-[#FFCC00]/50' : 'bg-white/5 border-white/10 hover:border-[#FFCC00]/50'}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="bg-[#FFCC00] text-black px-4 py-1 rounded-full font-black italic text-xs uppercase">
                                            {order.order_code}
                                        </span>
                                        <span className="text-xs opacity-40 font-bold uppercase italic">
                                            {new Date(order.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-3xl font-black italic uppercase leading-tight mb-2">{order.client_name}</h3>
                                        <div className="flex items-center gap-2 text-[#FFCC00] font-bold italic text-sm mb-4">
                                            <Phone size={14} /> {order.client_whatsapp}
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black italic uppercase">{order.delivery_type}</span>
                                            {order.table_number && <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black italic uppercase">Mesa {order.table_number}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-8 border-t border-white/10 pt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        <p className="text-[10px] font-black italic uppercase opacity-40 mb-2">Comanda:</p>
                                        {order.germain_order_items?.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl mb-1 border border-white/5 group hover:border-[#FFCC00]/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-[#FFCC00] text-black rounded-lg flex items-center justify-center font-black italic text-xs">
                                                        {item.quantity}x
                                                    </span>
                                                    <p className="font-bold italic uppercase text-xs tracking-tight">
                                                        {item.product_name || 'Producto Germain'}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] font-black italic opacity-40">${(item.unit_price || 0).toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {(!order.germain_order_items || order.germain_order_items.length === 0) && (
                                            <p className="text-xs italic opacity-40 uppercase">Sin items registrados</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-xs font-black italic opacity-40 uppercase">Total</p>
                                        <p className="text-3xl font-black italic text-[#FFCC00]">${order.total_amount.toLocaleString()}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {order.status === 'pendiente' && (
                                            <button
                                                disabled={updatingId === order.id}
                                                onClick={() => updateStatus(order.id, 'cocinando')}
                                                className="bg-[#FFCC00] text-black py-5 rounded-2xl font-black italic uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_8px_0_#b28900] active:shadow-none active:translate-y-1"
                                            >
                                                {updatingId === order.id ? <Clock className="animate-spin" /> : <Flame size={20} />}
                                                EMPEZAR COCINA
                                            </button>
                                        )}
                                        {order.status === 'cocinando' && (
                                            <div className="space-y-3">
                                                <div className="bg-white/10 p-4 rounded-xl flex items-center justify-center gap-3 border border-[#FFCC00]/30 animate-pulse mb-2">
                                                    <Flame size={16} className="text-[#FFCC00]" />
                                                    <span className="text-[10px] font-black italic uppercase text-[#FFCC00]">En Preparación...</span>
                                                </div>
                                                <button
                                                    disabled={updatingId === order.id}
                                                    onClick={() => updateStatus(order.id, 'listo')}
                                                    className="w-full bg-green-500 text-black py-5 rounded-2xl font-black italic uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_8px_0_#15803d] active:shadow-none active:translate-y-1"
                                                >
                                                    {updatingId === order.id ? <Clock className="animate-spin" /> : <Package size={20} />}
                                                    MARCAR COMO LISTO
                                                </button>
                                            </div>
                                        )}
                                        {order.status === 'listo' && (
                                            <button
                                                disabled={updatingId === order.id}
                                                onClick={() => updateStatus(order.id, 'entregado')}
                                                className="bg-blue-500 text-white py-5 rounded-2xl font-black italic uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_8px_0_#1e3a8a] active:shadow-none active:translate-y-1"
                                            >
                                                {updatingId === order.id ? <Clock className="animate-spin" /> : <CheckCircle2 size={20} />}
                                                ORDEN ENTREGADA
                                            </button>
                                        )}
                                        {order.status === 'entregado' && (
                                            <div className="bg-white/5 py-4 rounded-2xl text-center text-xs font-black italic uppercase opacity-40 border border-white/10">
                                                PEDIDO COMPLETADO
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[50vh] opacity-20">
                    <ShoppingBag size={100} strokeWidth={1} />
                    <p className="text-2xl font-black italic uppercase mt-4">No hay pedidos hoy</p>
                </div>
            )}
        </div>
    );
}
