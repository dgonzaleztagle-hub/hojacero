"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Instagram, Phone, ChevronRight, Menu as MenuIcon, X, Flame, ShoppingBag, ArrowRight, Gamepad2, Plus, Minus, Trash2, Check } from 'lucide-react';
import GermainGame from './GermainGame';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface MenuItem {
    name: string;
    price: number;
    desc?: string;
    category: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

const BURGERS = [
    { name: "Chesse Burger", desc: "DOBLE SMASH, DOBLE CHEDDAR Y SALSA DE LA CASA", price: 7000, tag: "Nuestra Mafia" },
    { name: "1/4 De Libra", desc: "DOBLE SMASH, DOBLE CHEDDAR, CEBOLLA EN CUBO, PEPINILLOS, KETCHUP Y MOSTAZA", price: 7000 },
    { name: "American Classic", desc: "DOBLE SMASH, DOBLE CHEDDAR, LECHUGA, TOMATE, CEBOLLA EN CUBO, PEPINILLOS Y SALSA DE LA CASA", price: 7000 },
    { name: "Golden Chesse", desc: "DOBLE SMASH, DOBLE CHEDDAR, CEBOLLA GRILLADA Y SALSA DE LA CASA", price: 7000 },
    { name: "Golden Jalapeño", desc: "DOBLE SMASH, DOBLE CHEDDAR, CEBOLLA GRILLADA, JALAPEÑOS Y SALSA DE LA CASA", price: 7000, hot: true },
    { name: "La Bacon", desc: "DOBLE SMASH, DOBLE CHEDDAR, TOCINO, MAYONESA Y BARBECUE", price: 7000 },
];

const EMPANADAS_HORNO = [
    { name: "Pino horno", price: 2000 },
    { name: "Queso masa hoja", price: 2000 },
];

const EMPANADAS_FRITAS = [
    { name: "Pino", price: 2000 },
    { name: "Queso", price: 2000 },
    { name: "Choclo queso", price: 2200 },
    { name: "Aceituna queso", price: 2200 },
    { name: "Tomate queso", price: 2200 },
    { name: "Jamón queso", price: 2200 },
    { name: "Champiñón queso", price: 2500 },
    { name: "Napolitana", price: 2500 },
    { name: "Camarón queso", price: 2500 },
    { name: "Mechada queso", price: 2700 },
    { name: "Pollo queso", price: 2700 },
];

const PROMOS = [
    { name: "PROMO 1", desc: "2 empanadas pino o queso + lata", price: 4800 },
    { name: "PROMO 2", desc: "4 empanadas pino o queso + bebida 1.5", price: 10000 },
    { name: "PROMO 3", desc: "2 empanadas (aceituna, choclo, jamón o tomate) + lata", price: 5200 },
    { name: "PROMO 4", desc: "4 empanadas (aceituna, choclo, jamón o tomate) + bebida 1.5", price: 11000 },
    { name: "PROMO 5", desc: "2 empanadas (napolitana, champiñón o camarón) + lata", price: 5800 },
    { name: "PROMO 6", desc: "4 empanadas (napolitana, champiñón o camarón) + bebida 1.5", price: 12000 },
    { name: "PROMO 7", desc: "2 empanadas (mechada o pollo) + lata", price: 6300 },
    { name: "PROMO 8", desc: "4 empanadas (mechada o pollo) + bebida 1.5", price: 13000 },
];

const BEBIDAS = [
    { name: "Bebida Latas", price: 1200 },
    { name: "Bebida Medio", price: 1500 },
    { name: "Jugo lata o boca ancha", price: 1500 },
    { name: "Agua mineral", price: 1000 },
    { name: "Gatorade 1L", price: 2000 },
    { name: "Jugos 1.5", price: 2500 },
    { name: "1.5 litros", price: 2500 },
    { name: "2.5 litros", price: 3000 },
];

export default function DondeGermainPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [category, setCategory] = useState<'burger' | 'empanada'>('burger');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Checkout Form State
    const [customerName, setCustomerName] = useState('');
    const [customerWhatsApp, setCustomerWhatsApp] = useState('');
    const [deliveryType, setDeliveryType] = useState<'local' | 'llevar' | 'mesa'>('local');
    const [tableNumber, setTableNumber] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderResult, setOrderResult] = useState<{ code: string } | null>(null);
    const [isLocalOpen, setIsLocalOpen] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (item: any, cat: string) => {
        if (!isLocalOpen) return;
        setCart(prev => {
            const existing = prev.find(i => i.name === item.name);
            if (existing) {
                return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, category: cat, quantity: 1 }];
        });
    };

    const updateQuantity = (name: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.name === name) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (name: string) => {
        setCart(prev => prev.filter(item => item.name !== name));
    };

    useEffect(() => {
        const supabase = createClient();

        // Check if local is open (active session)
        const checkSession = async () => {
            const { data } = await supabase
                .from('germain_sessions')
                .select('id')
                .eq('status', 'open')
                .maybeSingle();

            setIsLocalOpen(!!data);
            setActiveSessionId(data?.id || null);
        };

        checkSession();

        // Realtime sync for session
        const channel = supabase.channel('session_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'germain_sessions' }, () => checkSession())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    useEffect(() => {
        // Basic schedule check - keeping it simple for now
        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 18 || hour <= 1; // 18:00 to 01:00
        setIsOpen(isOpen);

        // Service Worker Registration for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#FFCC00] text-black font-sans selection:bg-black selection:text-[#FFCC00]">

            {/* --- NOISE OVERLAY --- */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* --- HEADER / NAV --- */}
            <header className="fixed top-0 left-0 w-full z-50 p-6">
                <div className="flex justify-between items-center bg-black/5 backdrop-blur-md rounded-2xl p-4 border border-black/10">
                    <div className="flex items-center gap-3">
                        <img src="/prospectos/donde-germain/logo.png" alt="Donde Germain Logo" className="h-16 w-auto object-contain" />
                    </div>

                    <nav className="hidden md:flex gap-8 items-center font-black uppercase italic text-sm">
                        <a href="#menu" className="text-white/80 hover:text-white hover:line-through decoration-[#FFCC00] decoration-4 transition-colors">La Carta</a>
                        <a href="#ubicacion" className="text-white/80 hover:text-white hover:line-through decoration-[#FFCC00] decoration-4 transition-colors">Lampa</a>
                        {isLocalOpen && (
                            <motion.a
                                href="https://wa.me/message/ZTMGHN4TWIBDN1"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-[#FFCC00] px-6 py-2 rounded-full"
                            >
                                HACER PEDIDO
                            </motion.a>
                        )}
                    </nav>

                    <button className="md:hidden" onClick={() => setMobileMenu(true)}>
                        <MenuIcon size={28} />
                    </button>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="relative h-screen flex flex-col justify-end p-6 md:p-20 overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    <motion.video
                        key={category}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover grayscale-[30%]"
                    >
                        <source src={`/prospectos/donde-germain/${category === 'burger' ? 'hero.mp4' : 'hero1.mp4'}?v=2`} type="video/mp4" />
                    </motion.video>
                </AnimatePresence>

                {/* Cinematic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent hidden md:block" />

                {/* --- SELECTION OVERLAY (THE "SWITCH") --- */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 flex gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10 shadow-2xl scale-75 md:scale-100">
                    <button
                        onClick={() => setCategory('burger')}
                        className={`px-8 py-3 rounded-full font-black italic uppercase transition-all flex flex-col items-center gap-1 ${category === 'burger' ? 'bg-[#FFCC00] text-black scale-110 shadow-[0_0_20px_rgba(255,204,0,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        <span>HAMBURGUESAS</span>
                        {category !== 'burger' && <span className="text-[10px] animate-bounce text-[#FFCC00]">Toca aquí</span>}
                    </button>
                    <button
                        onClick={() => setCategory('empanada')}
                        className={`px-8 py-3 rounded-full font-black italic uppercase transition-all flex flex-col items-center gap-1 ${category === 'empanada' ? 'bg-[#FFCC00] text-black scale-110 shadow-[0_0_20px_rgba(255,204,0,0.4)]' : 'text-white/40 hover:text-white'}`}
                    >
                        <span>EMPANADAS</span>
                        {category !== 'empanada' && <span className="text-[10px] animate-bounce text-[#FFCC00]">Toca aquí</span>}
                    </button>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="mb-4 inline-flex items-center gap-2 bg-[#FFCC00] px-4 py-1 rounded-sm text-xs font-black uppercase italic tracking-widest text-black">
                            {isLocalOpen ? '🟢 Abierto Ahora' : '⚪ Modo Catálogo'}
                        </div>
                        <h1 className="text-6xl md:text-[10vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-8 text-white drop-shadow-2xl">
                            {category === 'burger' ? 'REYES DEL' : 'TESOROS DEL'} <br /> <span className="text-[#FFCC00]">{category === 'burger' ? 'SABOR' : 'HORNO'}</span>
                        </h1>
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                            <p className="text-xl md:text-3xl font-black text-white/80 max-w-xl italic leading-none">
                                {category === 'burger' ? 'DOBLE CARNE. DOBLE QUESO.' : 'MASA CRUNCHY. MUCHO PINO.'} <br />
                                <span className="text-[#FFCC00]">SIN EXCUSAS.</span>
                            </p>
                            <motion.a
                                href="#menu"
                                whileHover={{ rotate: [-1, 1, -1] }}
                                className="bg-[#FFCC00] text-black px-12 py-6 rounded-2xl text-2xl font-black italic uppercase flex items-center gap-3 shadow-[10px_10px_0px_#000]"
                            >
                                {isLocalOpen ? 'TENGO HAMBRE' : 'VER CARTA'} <ArrowRight size={28} />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- MARQUEE --- */}
            <div className="bg-black py-6 overflow-hidden border-y-4 border-black border-dotted">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <span key={i} className="text-[#FFCC00] text-5xl md:text-9xl font-black italic uppercase mx-8 leading-none">
                            EMPANADAS QUE FLOTAN • SMASH QUE GOTEAN •
                        </span>
                    ))}
                </div>
            </div>

            {/* --- THE REAL MENU (YELLOW POWER) --- */}
            <section id="menu" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* STICKY INTRO */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                            <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8] mb-4">
                                LA <br /> <span className="bg-black text-[#FFCC00] px-4">CARTA</span>
                            </h2>
                            <p className="text-xl font-black italic mb-6 border-l-4 border-black pl-4">
                                "Sabor que se ve, <br /> gusto que no falla."
                            </p>

                            <div className="space-y-4">
                                <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_#000] rotate-[-2deg]">
                                    <Flame className="mb-4 text-red-600" size={32} />
                                    <h3 className="font-black text-xl italic uppercase">ADVERTENCIA:</h3>
                                    <p className="font-bold text-sm leading-tight">Todas las Burgers vienen con papas fritas incluidas. No nos hacemos responsables por la adicción que causan.</p>
                                </div>
                                <motion.div
                                    onClick={() => setCategory(category === 'burger' ? 'empanada' : 'burger')}
                                    whileHover={{ rotate: 2, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative aspect-[4/3] rounded-[30px] overflow-hidden border-4 border-black shadow-[10px_10px_0px_#000] cursor-pointer group"
                                >
                                    <img
                                        src={`/prospectos/donde-germain/${category === 'burger' ? 'empanada-hot.jpg' : 'burger.png'}`}
                                        alt="Switch Category"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* --- COMIC SPEECH BUBBLE (VIÑETA) --- */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center p-4">
                                        <motion.div
                                            initial={{ rotate: -5 }}
                                            animate={{ rotate: [-5, 5, -5] }}
                                            transition={{ repeat: Infinity, duration: 4 }}
                                            className="bg-[#FFCC00] border-4 border-black p-4 shadow-[6px_6px_0px_#000] -rotate-3"
                                        >
                                            <p className="font-black italic uppercase leading-none text-center">
                                                {category === 'burger' ? '¿Y una' : '¿Prefieres'} <br />
                                                <span className="text-2xl">{category === 'burger' ? 'Empanadita?' : 'una Smash?'}</span> <br />
                                                <span className="text-[10px] mt-1 block bg-black text-[#FFCC00] px-2 py-0.5">TOCA AQUÍ</span>
                                            </p>
                                        </motion.div>
                                    </div>

                                    <div className="absolute top-3 left-3 bg-black text-[#FFCC00] px-3 py-1 text-[10px] font-black uppercase italic rounded-full">
                                        CAMBIO DE PLANES
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* THE CONTENT */}
                        <div className="lg:col-span-8 space-y-24">

                            {/* BURGERS (Filtrado) */}
                            <AnimatePresence mode="wait">
                                {category === 'burger' && (
                                    <motion.div
                                        key="burgers"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-4xl font-black uppercase italic mb-12 flex items-center gap-4">
                                            <span className="w-12 h-12 bg-black text-[#FFCC00] flex items-center justify-center rounded-full text-lg">01</span>
                                            Empire Smash
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {BURGERS.map((b, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ scale: 1.02 }}
                                                    className="group bg-black/5 hover:bg-black p-8 rounded-[40px] transition-all duration-300 border-2 border-transparent hover:border-black"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className="text-xs font-black bg-black text-[#FFCC00] px-2 py-1 rounded hidden group-hover:block">TOP VENTAS</span>
                                                        <span className="text-3xl font-black italic group-hover:text-[#FFCC00]">${b.price.toLocaleString()}</span>
                                                    </div>
                                                    <h4 className="text-3xl font-black uppercase italic mb-2 tracking-tighter group-hover:text-white">
                                                        {b.name.replace('Chesse', 'Cheese')}
                                                    </h4>
                                                    <p className="text-sm font-bold opacity-60 group-hover:text-[#FFCC00] leading-tight mb-8">{b.desc}</p>
                                                    {isLocalOpen && (
                                                        <button
                                                            onClick={() => addToCart(b, 'burger')}
                                                            className="w-10 h-10 bg-black group-hover:bg-[#FFCC00] rounded-full flex items-center justify-center text-[#FFCC00] group-hover:text-black transition-colors"
                                                        >
                                                            <ShoppingBag size={20} />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* EMPANADAS (Filtrado) */}
                            <AnimatePresence mode="wait">
                                {category === 'empanada' && (
                                    <motion.div
                                        key="empanadas"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-black text-[#FFCC00] p-12 rounded-[60px] relative overflow-hidden border-4 border-black"
                                    >
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFCC00]/10 rounded-full blur-3xl" />

                                        <h3 className="text-5xl font-black uppercase italic mb-12 flex items-center gap-4 text-white">
                                            <span className="w-12 h-12 bg-[#FFCC00] text-black flex items-center justify-center rounded-full text-lg italic">02</span>
                                            Tesoros de Masa
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                                            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-[#FFCC00] shadow-[10px_10px_0px_rgba(255,204,0,0.2)]">
                                                <img
                                                    src="/prospectos/donde-germain/empanadas.png"
                                                    alt="Nuestras Empanadas"
                                                    className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
                                                />
                                            </div>
                                            <p className="text-[#FFCC00] font-black italic text-2xl leading-none uppercase">
                                                MASA CRUNCHY. <br /> RELLENO BRUTAL. <br /> <span className="text-white text-lg">HECHAS A MANO CADA DÍA.</span>
                                            </p>
                                        </div>

                                        <div className="space-y-12">
                                            <div>
                                                <h4 className="text-white/60 font-black uppercase tracking-widest text-xs mb-6 italic">Empanadas Fritas (Fuego Eterno)</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                                    {EMPANADAS_FRITAS.map((e, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex justify-between items-center group ${isLocalOpen ? 'cursor-pointer' : 'cursor-default'}`}
                                                            onClick={() => isLocalOpen && addToCart(e, 'empanada_frita')}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl font-black uppercase italic group-hover:translate-x-2 transition-transform text-white group-hover:text-[#FFCC00]">{e.name}</span>
                                                                {isLocalOpen && <Plus size={16} className="opacity-0 group-hover:opacity-100 text-[#FFCC00] transition-opacity" />}
                                                            </div>
                                                            <span className="text-xl font-black italic opacity-60 group-hover:opacity-100 text-[#FFCC00]">${e.price.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-12 border-t border-white/10">
                                                <h4 className="text-white/60 font-black uppercase tracking-widest text-xs mb-6 italic">De Horno (Tradición Brutal)</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                                    {EMPANADAS_HORNO.map((e, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex justify-between items-center group ${isLocalOpen ? 'cursor-pointer' : 'cursor-default'}`}
                                                            onClick={() => isLocalOpen && addToCart(e, 'empanada_horno')}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl font-black uppercase italic group-hover:translate-x-2 transition-transform text-white group-hover:text-[#FFCC00]">{e.name}</span>
                                                                {isLocalOpen && <Plus size={16} className="opacity-0 group-hover:opacity-100 text-[#FFCC00] transition-opacity" />}
                                                            </div>
                                                            <span className="text-xl font-black italic opacity-60 group-hover:opacity-100 text-[#FFCC00]">${e.price.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* EXTRAS */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-white border-4 border-black p-8 rounded-3xl rotate-[-2deg] shadow-[8px_8px_0px_#000]">
                                    <h5 className="font-black italic text-xl uppercase mb-4 tracking-tighter">METE MÁS SABOR ($500)</h5>
                                    <div className="grid grid-cols-2 gap-2 text-sm font-bold uppercase italic">
                                        <span>• Choclo</span>
                                        <span>• Aceituna</span>
                                        <span>• Jamón</span>
                                        <span>• Tomate</span>
                                        <span>• Champiñón</span>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black text-[#FFCC00] p-8 rounded-3xl rotate-[2deg] shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
                                    <h5 className="font-black italic text-xl uppercase mb-4 tracking-tighter">LEVEL UP ($1.000)</h5>
                                    <div className="grid grid-cols-2 gap-2 text-sm font-bold uppercase italic">
                                        <span>• Mechada</span>
                                        <span>• Pollo</span>
                                        <span>• Camarón</span>
                                    </div>
                                </div>
                            </div>

                            {/* COMBOS / PROMOS */}
                            <div className="bg-[#FFCC00] border-4 border-black p-12 rounded-[60px] shadow-[15px_15px_0px_#000]">
                                <h3 className="text-5xl font-black uppercase italic mb-12 flex items-center gap-4">
                                    <span className="w-12 h-12 bg-black text-[#FFCC00] flex items-center justify-center rounded-full text-lg italic">03</span>
                                    Combos Salvajes
                                </h3>

                                <div className="mb-12 relative h-64 md:h-80 rounded-[40px] overflow-hidden border-4 border-black group">
                                    <img
                                        src="/prospectos/donde-germain/festin.png"
                                        alt="Festín Germain"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                        <p className="text-white font-black italic text-3xl uppercase tracking-tighter">EL FESTÍN QUE MERECES</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {PROMOS.map((p, i) => (
                                        <div
                                            key={i}
                                            onClick={() => isLocalOpen && addToCart(p, 'combo')}
                                            className={`border-b-2 border-black pb-4 hover:translate-x-2 transition-transform group ${isLocalOpen ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xl font-black uppercase italic group-hover:text-white transition-colors">{p.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-black italic">${p.price.toLocaleString()}</span>
                                                    {isLocalOpen && <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold uppercase opacity-70 leading-tight group-hover:opacity-100">{p.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BEBIDAS */}
                            <div className="bg-black text-white p-12 rounded-[60px] relative overflow-hidden border-4 border-black">
                                <h3 className="text-5xl font-black uppercase italic mb-12 flex items-center gap-4">
                                    <span className="w-12 h-12 bg-[#FFCC00] text-black flex items-center justify-center rounded-full text-lg italic">04</span>
                                    Hidratación
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    {BEBIDAS.map((b, i) => (
                                        <div
                                            key={i}
                                            onClick={() => isLocalOpen && addToCart(b, 'bebida')}
                                            className={`flex justify-between items-center group ${isLocalOpen ? 'cursor-pointer' : 'cursor-default'}`}
                                        >
                                            <span className="text-lg font-black uppercase italic group-hover:text-[#FFCC00] transition-colors">{b.name}</span>
                                            <div className="flex-1 border-b border-dotted border-white/20 mx-4" />
                                            <div className="flex items-center gap-2 text-[#FFCC00]">
                                                <span className="text-lg font-black italic">${b.price.toLocaleString()}</span>
                                                {isLocalOpen && <Plus size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- STREET INFO --- */}
            <section id="ubicacion" className="bg-black text-[#FFCC00] py-40 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div className="relative">
                            <div className="absolute -top-20 -left-10 text-[20vw] font-black italic opacity-[0.05] text-white leading-none whitespace-nowrap pointer-events-none">
                                VEN A VERNOS
                            </div>
                            <h2 className="text-[10vw] font-black uppercase italic leading-[0.7] tracking-tighter mb-12 relative z-10">
                                MUCHA <br /> <span className="text-white">ACTITUD.</span>
                            </h2>
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-[#FFCC00] text-black flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">
                                        <MapPin size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60">Dirección Mística</p>
                                        <p className="text-4xl font-black italic">Los Halcones 1280, Lampa.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 bg-[#FFCC00] text-black flex items-center justify-center rounded-2xl group-hover:-rotate-12 transition-transform">
                                        <Clock size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60">Horario de Combate</p>
                                        <p className="text-2xl font-black italic uppercase">Lun-Jue 13-22 | Vie-Sab 13-00 | Dom 13-21</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <a href="https://instagram.com/dondegermain" target="_blank" rel="noopener noreferrer">
                                <motion.div
                                    whileHover={{ scale: 1.05, rotate: 0 }}
                                    className="aspect-square bg-[#FFCC00] border-8 border-white rounded-[100px] flex items-center justify-center rotate-3 shadow-[0_0_50px_rgba(255,69,0,0.2)] relative overflow-hidden group cursor-pointer"
                                >
                                    {/* Glowing border effect for IG */}
                                    <div className="absolute inset-0 border-[10px] border-transparent group-hover:border-red-500/20 transition-all rounded-[100px]" />

                                    <Instagram size={120} strokeWidth={3} className="text-black group-hover:scale-110 transition-transform" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="font-black italic text-4xl uppercase -rotate-12 text-white bg-black px-6 shadow-[10px_10px_0px_#FFCC00]">@dondegermain</span>
                                    </div>
                                </motion.div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Background "GERMAIN" text */}
                <div className="absolute bottom-0 left-0 text-[30vw] font-black italic leading-none opacity-[0.03] select-none pointer-events-none">
                    GERMAIN
                </div>
            </section>

            {/* --- GAME SECTION --- */}
            <GermainGame />

            {/* --- CALL TO ACTION (LOUD) --- */}
            <section className="bg-[#FFCC00] py-40 text-center px-6 border-t-8 border-black border-dotted">
                <motion.div
                    whileInView={{ scale: [0.9, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <h3 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none mb-12">
                        ¿YA TIENES <br /> HAMBRE?
                    </h3>
                    <a
                        href="https://wa.me/message/ZTMGHN4TWIBDN1"
                        className="inline-block bg-black text-[#FFCC00] text-3xl md:text-5xl font-black italic uppercase px-12 py-8 rounded-[40px] shadow-[15px_15px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
                    >
                        PÍDELO YA POR WA <ArrowRight size={48} className="inline ml-4" />
                    </a>
                </motion.div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-black text-[#FFCC00]/40 py-12 px-6 text-center font-black italic uppercase text-xs tracking-widest">
                <p>Donde Germain - Reyes del Sabor &copy; 2026</p>
                <a
                    href="https://hojacero.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-white/40 uppercase tracking-[0.5em] hover:text-[#FFCC00] transition-colors"
                >
                    By hojacero.cl
                </a>
            </footer>

            {/* --- CART FLOATING BUTTON --- */}
            <AnimatePresence>
                {cartCount > 0 && isLocalOpen && (
                    <motion.button
                        initial={{ scale: 0, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: 100 }}
                        onClick={() => setIsCartOpen(true)}
                        className="fixed bottom-8 right-8 z-[60] bg-black text-[#FFCC00] p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-4 border-[#FFCC00] flex items-center gap-4 group hover:scale-110 transition-transform"
                    >
                        <div className="relative">
                            <ShoppingBag size={32} />
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 1.5 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black"
                            >
                                {cartCount}
                            </motion.span>
                        </div>
                        <div className="text-left leading-none uppercase italic font-black">
                            <p className="text-[10px] opacity-60">Tu Pedido</p>
                            <p className="text-xl">${cartTotal.toLocaleString()}</p>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* --- CART DRAWER --- */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FFCC00] z-[110] shadow-2xl p-8 overflow-y-auto border-l-8 border-black"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black">TU <br /> PEDIDO</h3>
                                <button onClick={() => setIsCartOpen(false)} className="bg-black text-[#FFCC00] p-2 rounded-xl">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6 mb-12">
                                {cart.map((item, i) => (
                                    <div key={i} className="bg-black text-white p-4 rounded-2xl flex items-center justify-between group">
                                        <div className="flex-1">
                                            <p className="font-black italic uppercase leading-tight">{item.name}</p>
                                            <p className="text-[#FFCC00] font-black italic text-xs">${item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => updateQuantity(item.name, -1)} className="bg-[#FFCC00] text-black p-1 rounded-lg">
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-black italic min-w-[1.5rem] text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.name, 1)} className="bg-[#FFCC00] text-black p-1 rounded-lg">
                                                <Plus size={16} />
                                            </button>
                                            <button onClick={() => removeFromCart(item.name)} className="text-red-500 ml-2">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-4 border-black border-dotted pt-8 space-y-4 text-black">
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
                                        <p className="text-5xl font-black italic tracking-tighter">${cartTotal.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setIsCheckoutOpen(true);
                                        }}
                                        className="w-full bg-black text-[#FFCC00] py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_10px_0_#444] active:shadow-none active:translate-y-2 transition-all"
                                    >
                                        FINALIZAR PEDIDO
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- CHECKOUT MODAL --- */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[120]"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#FFCC00] z-[130] p-10 rounded-[40px] border-8 border-black shadow-[20px_20px_0_#000] overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-start mb-8 text-black">
                                <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">DATOS DEL <br /> TICKET</h3>
                                <button onClick={() => setIsCheckoutOpen(false)} className="bg-black text-[#FFCC00] p-2 rounded-xl">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (isSubmitting) return;
                                setIsSubmitting(true);

                                try {
                                    const supabase = createClient();
                                    const orderCode = `GER-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

                                    const { data: order, error: orderError } = await supabase
                                        .from('germain_orders')
                                        .insert({
                                            client_name: customerName,
                                            client_whatsapp: customerWhatsApp,
                                            delivery_type: deliveryType,
                                            table_number: deliveryType === 'mesa' ? tableNumber : null,
                                            total_amount: cartTotal,
                                            order_code: orderCode,
                                            status: 'pendiente',
                                            session_id: activeSessionId
                                        })
                                        .select()
                                        .single();

                                    if (orderError) throw orderError;

                                    const orderItems = cart.map(item => ({
                                        order_id: order.id,
                                        product_id: null,
                                        product_name: item.name,
                                        quantity: item.quantity,
                                        unit_price: item.price
                                    }));

                                    const { error: itemsError } = await supabase
                                        .from('germain_order_items')
                                        .insert(orderItems);

                                    if (itemsError) throw itemsError;

                                    const itemsText = cart.map(item => `• ${item.quantity}x ${item.name}`).join('\n');
                                    const trackingUrl = `${window.location.origin}/prospectos/donde-germain/track/${orderCode}`;
                                    const message = `*NUEVO PEDIDO GERMAIN (${orderCode})*\n\n*Cliente:* ${customerName}\n*Tipo:* ${deliveryType.toUpperCase()} ${tableNumber ? `(Mesa ${tableNumber})` : ''}\n\n*Detalle:*\n${itemsText}\n\n*Total:* $${cartTotal.toLocaleString()}\n\n*Sigue tu pedido aquí:* \n${trackingUrl}\n\n---\n_Enviado desde dondegermain.cl_`;

                                    const whatsappUrl = `https://wa.me/56930219505?text=${encodeURIComponent(message)}`;

                                    setCart([]);
                                    setIsCheckoutOpen(false);
                                    setOrderResult({ code: orderCode });
                                    window.open(whatsappUrl, '_blank');

                                } catch (err) {
                                    console.error("Error:", err);
                                    alert("Hubo un error al procesar tu pedido.");
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }} className="space-y-6 text-black">
                                <div>
                                    <label className="block font-black italic uppercase text-sm mb-2">Tu Nombre</label>
                                    <input
                                        required
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full bg-white border-4 border-black p-4 rounded-2xl font-bold italic focus:outline-none text-black"
                                        placeholder="EJ: DANIEL TAGLE"
                                    />
                                </div>
                                <div>
                                    <label className="block font-black italic uppercase text-sm mb-2">WhatsApp</label>
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
                                            className={`p-3 rounded-xl border-4 border-black font-black italic text-xs transition-all ${deliveryType === type ? 'bg-black text-[#FFCC00]' : 'bg-white text-black'}`}
                                        >
                                            {type.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {deliveryType === 'mesa' && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4">
                                        <label className="block font-black italic uppercase text-sm mb-2 text-black">Número de Mesa</label>
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
                                    className="w-full bg-black text-[#FFCC00] py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_10px_0_#444] active:shadow-none active:translate-y-2 mt-8 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                                >
                                    {isSubmitting ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                            <ShoppingBag size={24} />
                                        </motion.div>
                                    ) : (
                                        <>ENVIAR A COCINA <ChevronRight size={24} /></>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- CLOSED NOTIFICATION BANNER --- */}
            <AnimatePresence>
                {!isLocalOpen && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full bg-black text-[#FFCC00] z-[200] p-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center border-t-4 border-[#FFCC00]"
                    >
                        <div className="flex items-center gap-2 font-black italic uppercase text-sm">
                            <Clock size={18} className="animate-pulse" />
                            <span>LOCAL CERRADO • SOLO VISUALIZACIÓN</span>
                        </div>
                        <p className="text-[10px] font-bold opacity-60 uppercase">Vuelve de Martes a Domingo (18:00 - 01:00) para hacer tu pedido.</p>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* --- SUCCESS MODAL --- */}
            <AnimatePresence>
                {orderResult && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200]"
                        />
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm text-center z-[210] p-6"
                        >
                            <div className="w-24 h-24 bg-[#FFCC00] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,204,0,0.4)]">
                                <Check size={48} className="text-black" strokeWidth={4} />
                            </div>
                            <h3 className="text-5xl font-black uppercase italic italic text-white mb-4 leading-none tracking-tighter">TICKET <br /> GENERADO</h3>
                            <p className="text-[#FFCC00] font-black italic mb-12 opacity-60">TU CÓDIGO: {orderResult.code}</p>

                            <div className="space-y-4">
                                <Link
                                    href={`/prospectos/donde-germain/track/${orderResult.code}`}
                                    className="block bg-[#FFCC00] text-black py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_10px_0_#000] active:shadow-none active:translate-y-2 transition-all"
                                >
                                    SEGUIR MI PEDIDO
                                </Link>
                                <button
                                    onClick={() => setOrderResult(null)}
                                    className="text-white/40 font-black italic uppercase text-sm hover:text-white transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                  animation: marquee 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
