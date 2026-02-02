"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Clock, Package, Flame, CheckCircle2 } from 'lucide-react';
import { useFood } from './FoodEngineProvider';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    accentColor?: string;
    bgColor?: string;
    textColor?: string;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    accentColor = "#FFCC00",
    bgColor = "#FFCC00",
    textColor = "black"
}: CheckoutModalProps) {
    const {
        submitOrder,
        isSubmitting,
        cart,
        cartTotal,
        clearCart,
        config
    } = useFood();

    const [customerName, setCustomerName] = useState('');
    const [customerWhatsApp, setCustomerWhatsApp] = useState('');
    const [deliveryType, setDeliveryType] = useState<'local' | 'llevar' | 'mesa'>('local');
    const [tableNumber, setTableNumber] = useState('');
    const [orderResult, setOrderResult] = useState<{ code: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            const result = await submitOrder({
                name: customerName,
                whatsapp: customerWhatsApp,
                deliveryType,
                tableNumber: deliveryType === 'mesa' ? tableNumber : undefined
            });

            if (result) {
                const { orderCode } = result;

                // Preparar mensaje de WhatsApp
                const itemsText = cart.map(item => `• ${item.quantity}x ${item.name}`).join('\n');
                const clientRoute = config.dbPrefix.endsWith('_') ? config.dbPrefix.slice(0, -1) : config.dbPrefix;
                const trackingUrl = `${window.location.origin}/prospectos/${clientRoute}/track/${orderCode}`;
                const message = `*NUEVO PEDIDO (${orderCode})*\n\n*Cliente:* ${customerName}\n*Tipo:* ${deliveryType.toUpperCase()} ${tableNumber ? `(Mesa ${tableNumber})` : ''}\n\n*Detalle:*\n${itemsText}\n\n*Total:* $${cartTotal.toLocaleString()}\n\n*Sigue tu pedido aquí:* \n${trackingUrl}\n\n---\n_Enviado desde ${config.clientName}_`;

                const whatsappUrl = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;

                setOrderResult({ code: orderCode });
                clearCart();
                window.open(whatsappUrl, '_blank');
            }
        } catch (err) {
            alert("Error al procesar el pedido. Por favor intenta de nuevo.");
        }
    };

    if (orderResult) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-[130] p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-full max-w-lg bg-black text-white p-12 rounded-[40px] border-4 border-[#FFCC00] text-center"
                        >
                            <div className="w-24 h-24 bg-[#FFCC00] rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={48} className="text-black" />
                            </div>
                            <h3 className="text-4xl font-black uppercase italic mb-4 text-[#FFCC00]">¡PEDIDO ENVIADO!</h3>
                            <p className="text-xl font-bold italic mb-8 opacity-60">Tu código: <span className="text-white">{orderResult.code}</span></p>
                            <p className="mb-12">Hemos abierto tu WhatsApp para confirmar el pedido. ¡Gracias por preferirnos!</p>
                            <button
                                onClick={() => {
                                    setOrderResult(null);
                                    onClose();
                                }}
                                className="w-full bg-[#FFCC00] text-black py-6 rounded-2xl text-xl font-black italic uppercase"
                            >
                                VOLVER AL SITIO
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md"
                    />
                    <div className="flex min-h-full items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{ backgroundColor: bgColor, color: textColor }}
                            className="relative w-full max-w-lg p-10 rounded-[40px] border-8 border-black shadow-[20px_20px_0_#000]"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                                    DATOS DEL <br /> TICKET
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="bg-black text-white p-2 rounded-xl"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block font-black italic uppercase text-sm mb-2 opacity-60">Tu Nombre</label>
                                    <input
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full bg-white border-4 border-black p-4 rounded-2xl font-bold italic focus:outline-none text-black"
                                        placeholder="EJ: DANIEL TAGLE"
                                    />
                                </div>
                                <div>
                                    <label className="block font-black italic uppercase text-sm mb-2 opacity-60">WhatsApp</label>
                                    <input
                                        required
                                        type="tel"
                                        value={customerWhatsApp}
                                        onChange={e => setCustomerWhatsApp(e.target.value)}
                                        className="w-full bg-white border-4 border-black p-4 rounded-2xl font-bold italic focus:outline-none text-black"
                                        placeholder="EJ: +569..."
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {['local', 'llevar', 'mesa'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setDeliveryType(type as any)}
                                            className={`p-3 rounded-xl border-4 border-black font-black italic text-xs transition-all ${deliveryType === type ? 'bg-black text-white' : 'bg-white text-black'}`}
                                        >
                                            {type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {deliveryType === 'mesa' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                        <label className="block font-black italic uppercase text-sm mb-2 opacity-60">Número de Mesa</label>
                                        <input
                                            required
                                            value={tableNumber}
                                            onChange={e => setTableNumber(e.target.value)}
                                            className="w-full bg-white border-4 border-black p-4 rounded-2xl font-bold italic focus:outline-none text-black"
                                            placeholder="EJ: 5"
                                        />
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting || cart.length === 0}
                                    className="w-full bg-black text-white py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_10px_0_#444] active:shadow-none active:translate-y-2 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
