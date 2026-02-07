"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle2, Package, Flame, ShoppingBag, ArrowLeft, Check, Instagram, Phone } from 'lucide-react';
import Link from 'next/link';
import GermainGame from '../../GermainGame';

export default function OrderTrackingPage() {
    const params = useParams();
    const orderCode = params.code as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('germain_orders')
                .select('*, germain_order_items(*)')
                .eq('order_code', orderCode)
                .single();

            if (data) setOrder(data);
            setLoading(false);
        };

        fetchOrder();

        // Realtime subscription
        const channel = supabase
            .channel('order_updates')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'germain_orders',
                filter: `order_code=eq.${orderCode}`
            }, (payload) => {
                setOrder((prev: any) => ({ ...prev, ...payload.new }));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderCode]);

    if (loading) return (
        <div className="min-h-screen bg-[#FFCC00] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-8 border-black border-t-transparent rounded-full"
            />
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-[#FFCC00] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-black uppercase italic mb-8 tracking-tighter">ORDEN NO <br /> ENCONTRADA</h1>
            <Link href="/prospectos/donde-germain" className="bg-black text-[#FFCC00] px-8 py-4 rounded-2xl font-black italic uppercase">Volver al Menú</Link>
        </div>
    );

    const steps = [
        { id: 'pendiente', label: 'Pendiente', icon: Clock, desc: 'Esperando confirmación' },
        { id: 'cocinando', label: 'Cocinando', icon: Flame, desc: 'Tu pedido está en el fuego' },
        { id: 'listo', label: 'Listo', icon: Package, desc: '¡Retira tu pedido!' },
        { id: 'entregado', label: 'Entregado', icon: CheckCircle2, desc: '¡Buen provecho!' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === order.status);

    return (
        <div className="min-h-screen bg-[#FFCC00] text-black font-sans selection:bg-black selection:text-[#FFCC00] p-6 lg:p-24 overflow-hidden relative">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 text-[30vw] font-black italic opacity-[0.03] select-none pointer-events-none leading-none -translate-y-1/2 translate-x-1/4">
                GERMAIN
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
                    <div>
                        <Link href="/prospectos/donde-germain" className="inline-flex items-center gap-2 font-black italic uppercase text-xs mb-8 bg-black text-[#FFCC00] px-6 py-2 rounded-full hover:scale-110 transition-transform">
                            <ArrowLeft size={14} /> Volver al Menú
                        </Link>
                        <h1 className="text-8xl lg:text-[10rem] font-black uppercase italic leading-[0.7] tracking-tighter mb-4">
                            SABOR EN <br /> <span className="text-white drop-shadow-[10px_10px_0_#000]">CAMINO</span>
                        </h1>
                        <p className="text-3xl font-black italic opacity-40 mt-4 tracking-tight uppercase">Ticket #{orderCode}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Status Section */}
                    <div className="lg:col-span-7 space-y-6">
                        {steps.map((step, index) => {
                            const isPast = index < currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative p-10 rounded-[3rem] border-4 border-black flex items-center gap-8 transition-all duration-500 ${isCurrent ? 'bg-black text-[#FFCC00] scale-105 shadow-[15px_15px_0_#FFF] z-20' : isPast ? 'bg-white/40 opacity-40 grayscale' : 'bg-white/20'}`}
                                >
                                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-colors ${isCurrent ? 'bg-[#FFCC00] text-black ring-8 ring-[#FFCC00]/20' : 'bg-black text-[#FFCC00]'}`}>
                                        <step.icon size={40} className={isCurrent ? 'animate-bounce' : ''} />
                                    </div>
                                    <div>
                                        <h3 className="font-black italic uppercase text-3xl leading-none mb-1">{step.label}</h3>
                                        <p className="font-bold italic text-sm opacity-60 uppercase">{step.desc}</p>
                                    </div>
                                    {isPast && <Check className="ml-auto text-green-600" size={40} strokeWidth={4} />}
                                    {isCurrent && (
                                        <motion.div
                                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="ml-auto w-6 h-6 bg-[#FFCC00] rounded-full shadow-[0_0_20px_#FFCC00]"
                                        />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Summary Section - Styled as a Physical Ticket */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white text-black p-10 rounded-sm border-x-4 border-black shadow-2xl relative overflow-hidden"
                            style={{
                                backgroundImage: 'linear-gradient(to bottom, #fff 0%, #f9f9f9 100%)',
                                boxShadow: '20px 20px 0 rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Zigzag Top */}
                            <div className="absolute top-0 left-0 w-full h-4 flex overflow-hidden -translate-y-1/2">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="min-w-[20px] h-20 bg-[#FFCC00] rotate-45 -translate-y-10" />
                                ))}
                            </div>

                            <div className="text-center mb-10 pb-10 border-b-4 border-black border-dotted">
                                <ShoppingBag size={48} className="mx-auto mb-4" />
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter">DONDE GERMAIN</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">La Mafia del Sabor</p>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex justify-between items-end border-b-2 border-black/5 pb-2">
                                    <p className="font-black italic uppercase opacity-40 text-[10px]">Cliente</p>
                                    <p className="text-lg font-black italic uppercase">{order.client_name}</p>
                                </div>
                                <div className="flex justify-between items-end border-b-2 border-black/5 pb-2">
                                    <p className="font-black italic uppercase opacity-40 text-[10px]">Entrega</p>
                                    <p className="text-lg font-black italic uppercase">{order.delivery_type} {order.table_number ? `(M5)` : ''}</p>
                                </div>

                                <div className="py-6 space-y-3">
                                    {order.germain_order_items?.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm font-black italic uppercase">
                                            <span>{item.quantity}x {item.product_name || 'Combo Germain'}</span>
                                            <span>${item.unit_price.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t-8 border-black border-double flex justify-between items-baseline">
                                <p className="text-xl font-black italic uppercase">Total</p>
                                <p className="text-5xl font-black italic tracking-tighter text-black">${order.total_amount.toLocaleString()}</p>
                            </div>

                            {/* Zigzag Bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-4 flex overflow-hidden translate-y-1/2">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="min-w-[20px] h-20 bg-black rotate-45 translate-y-2" />
                                ))}
                            </div>
                        </motion.div>

                        <div className="mt-12 text-center">
                            <p className="font-black italic uppercase text-xs opacity-30 mb-2">Compartir seguimiento</p>
                            <div className="flex justify-center gap-4">
                                <button className="w-12 h-12 bg-black text-[#FFCC00] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <Instagram size={24} />
                                </button>
                                <button className="w-12 h-12 bg-black text-[#FFCC00] rounded-2xl flex items-center justify-center hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- GAME SECTION --- */}
                <div className="mt-20">
                    <GermainGame />
                </div>

                <footer className="mt-32 text-center pb-20">
                    <p className="font-black italic uppercase opacity-20 text-[10px] tracking-[0.5em]">© 2026 DONDE GERMAIN • AGENCIA HOJACERO</p>
                </footer>
            </div>
        </div>
    );
}
