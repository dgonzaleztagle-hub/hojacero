"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useFood } from './FoodEngineProvider';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
    accentColor?: string;
    bgColor?: string;
    textColor?: string;
}

export default function CartDrawer({
    isOpen,
    onClose,
    onCheckout,
    accentColor = "#FFCC00",
    bgColor = "#FFCC00",
    textColor = "black"
}: CartDrawerProps) {
    const { cart, cartTotal, cartCount, updateQuantity, removeFromCart } = useFood();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{ backgroundColor: bgColor, color: textColor }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-[110] shadow-2xl p-8 overflow-y-auto border-l-8 border-black"
                    >
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                                TU <br /> PEDIDO
                            </h3>
                            <button
                                onClick={onClose}
                                className="bg-black text-white p-2 rounded-xl"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6 mb-12">
                            {cart.length > 0 ? (
                                cart.map((item, i) => (
                                    <div key={i} className="bg-black text-white p-4 rounded-2xl flex items-center justify-between group">
                                        <div className="flex-1">
                                            <p className="font-black italic uppercase leading-tight">{item.name}</p>
                                            <p style={{ color: accentColor }} className="font-black italic text-xs">
                                                ${item.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.name, -1)}
                                                style={{ backgroundColor: accentColor }}
                                                className="text-black p-1 rounded-lg"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-black italic min-w-[1.5rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.name, 1)}
                                                style={{ backgroundColor: accentColor }}
                                                className="text-black p-1 rounded-lg"
                                            >
                                                <Plus size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeFromCart(item.name)}
                                                className="text-red-500 ml-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 opacity-40">
                                    <ShoppingBag size={48} className="mx-auto mb-4" />
                                    <p className="font-black italic uppercase">Tu carrito está vacío</p>
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t-4 border-black border-dotted pt-8 space-y-4">
                                <div className="flex justify-between items-end">
                                    <p className="font-black italic uppercase opacity-60">Subtotal</p>
                                    <p className="text-2xl font-black italic">${cartTotal.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="font-black italic uppercase opacity-60">Envío</p>
                                    <p className="text-xl font-black italic">GRATIS*</p>
                                </div>
                                <div className="pt-4">
                                    <div className="flex justify-between items-end mb-8">
                                        <p className="text-2xl font-black italic uppercase">TOTAL</p>
                                        <p className="text-5xl font-black italic tracking-tighter">
                                            ${cartTotal.toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onCheckout}
                                        className="w-full bg-black text-white py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_10px_0_#444] active:shadow-none active:translate-y-2 transition-all hover:scale-[1.02]"
                                    >
                                        FINALIZAR PEDIDO
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
