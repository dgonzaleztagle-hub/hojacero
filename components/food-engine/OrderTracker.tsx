"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Package, CheckCircle2, ShoppingBag } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface OrderTrackerProps {
    orderCode: string;
    prefix: string;
    clientName: string;
    accentColor?: string;
}

export default function OrderTracker({
    orderCode,
    prefix,
    clientName,
    accentColor = "#FFCC00"
}: OrderTrackerProps) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchOrder = async () => {
        const { data } = await supabase
            .from(`${prefix}orders`)
            .select('*')
            .eq('order_code', orderCode)
            .single();

        if (data) setOrder(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();

        const channel = supabase
            .channel(`order_${orderCode}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: `${prefix}orders`,
                filter: `order_code=eq.${orderCode}`
            }, (payload: any) => {
                setOrder(payload.new);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [orderCode, prefix]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity }} className="text-white font-black italic">Rastreando pedido...</motion.div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={64} className="mb-6 opacity-20" />
            <h1 className="text-4xl font-black italic uppercase mb-4">Orden no encontrada</h1>
            <p className="opacity-60 mb-8 font-bold italic">Verifica tu código e intenta de nuevo.</p>
        </div>
    );

    const steps = [
        { id: 'pendiente', label: 'Recibido', icon: Clock },
        { id: 'cocinando', label: 'En Cocina', icon: Flame },
        { id: 'listo', label: 'Listo', icon: Package },
        { id: 'entregado', label: 'Entregado', icon: CheckCircle2 }
    ];

    const currentIdx = steps.findIndex(s => s.id === order.status);

    return (
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <header className="text-center mb-12">
                    <h1 className="text-2xl font-black italic uppercase opacity-40 mb-2">{clientName}</h1>
                    <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">ESTADO DEL <br /> PEDIDO</h2>
                    <p className="mt-4 font-black italic text-[#FFCC00] text-xl">#{order.order_code}</p>
                </header>

                <div className="space-y-4">
                    {steps.map((step, idx) => {
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;
                        const Icon = step.icon;

                        return (
                            <motion.div
                                key={step.id}
                                initial={false}
                                animate={{
                                    opacity: isDone ? 1 : 0.2,
                                    scale: isCurrent ? 1.05 : 1
                                }}
                                className={`p-6 rounded-3xl border-4 flex items-center gap-6 ${isCurrent ? 'bg-white/10' : 'bg-transparent'} ${isDone ? 'border-[#FFCC00]' : 'border-white/10'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDone ? 'bg-[#FFCC00] text-black' : 'bg-white/5'}`}>
                                    <Icon size={24} className={isCurrent ? 'animate-pulse' : ''} />
                                </div>
                                <div>
                                    <p className="text-xs font-black italic uppercase opacity-40">{step.id === 'entregado' ? 'Final' : `Paso ${idx + 1}`}</p>
                                    <h3 className="text-2xl font-black italic uppercase leading-none">{step.label}</h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <footer className="mt-12 text-center">
                    <p className="text-xs font-bold italic opacity-20 uppercase tracking-widest">Powered by HojaCero Food Engine</p>
                </footer>
            </div>
        </div>
    );
}
