'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Rocket, Check, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';

interface CheckoutOfferProps {
    price: string;
    productName: string;
}

export function CheckoutOffer({ price, productName }: CheckoutOfferProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePurchase = () => {
        setIsProcessing(true);
        // Simulate payment logic
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center space-y-4"
            >
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-900/40">
                    <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">¡Activación Iniciada!</h3>
                <p className="text-zinc-400 text-sm">Tu Upgrade H0 ha sido procesado. En breve recibirás los accesos a tu nuevo servidor militar.</p>
            </motion.div>
        );
    }

    return (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-white/5 bg-gradient-to-br from-cyan-900/40 to-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/40">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-tight uppercase">{productName}</h4>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Pago Único • Alta Disponibilidad</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-black text-white">{price}</span>
                    <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Iva Incluido</span>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                        <Check className="w-3 h-3 text-cyan-500" /> Migración Headless (Next.js)
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                        <Check className="w-3 h-3 text-cyan-500" /> TTFB inferior a 200ms
                    </li>
                    <li className="flex items-center gap-2 text-[11px] text-zinc-300 font-medium">
                        <Check className="w-3 h-3 text-cyan-500" /> Certificado SSL Grado Militar
                    </li>
                </ul>

                <button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Procesando Orden...
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4" />
                            Activar con Webpay
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-600 uppercase font-bold tracking-widest pb-2">
                    <ShieldCheck className="w-3 h-3" />
                    Transacción Protegida por H0 Vault
                </div>
            </div>
        </div>
    );
}
