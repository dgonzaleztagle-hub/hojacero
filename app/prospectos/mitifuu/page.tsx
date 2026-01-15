'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Utensils, MapPin, Wine, Star, ChefHat, Clock, Leaf } from 'lucide-react';

export default function MitifuuPage() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <main className="w-full bg-[#faf9f6] text-[#2b2b2b] selection:bg-[#8a9a5b] selection:text-white font-inter">

            {/* 1. NAVBAR - Minimal & Functional */}
            <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/80 backdrop-blur-md border-b border-[#e5e5e5]">
                <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
                    {/* Logo Real */}
                    <div className="relative h-16 w-16 md:w-20 rounded-full overflow-hidden border-2 border-[#8a9a5b]/20">
                        <Image
                            src="/prospectos/mitifuu/logo.jpg"
                            alt="Mitifuu Logo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="hidden md:flex gap-10 font-inter text-xs tracking-[0.2em] uppercase font-medium text-gray-500">
                        <a href="#historia" className="hover:text-[#8a9a5b] transition-colors">La Casona</a>
                        <a href="#menu" className="hover:text-[#8a9a5b] transition-colors">Carta</a>
                        <a href="#chef" className="hover:text-[#8a9a5b] transition-colors">Chef Kanko</a>
                    </div>

                    <button className="bg-[#2b2b2b] text-white px-8 py-3 rounded-none text-xs uppercase tracking-widest hover:bg-[#8a9a5b] transition-colors">
                        Reservar
                    </button>
                </div>
            </nav>

            {/* 2. HERO - Storytelling Split */}
            <section className="min-h-screen pt-24 flex flex-col lg:flex-row">
                {/* Left: Narrative */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center p-12 lg:p-24 bg-[#faf9f6] z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-[#8a9a5b]"></div>
                            <span className="text-[#8a9a5b] font-inter text-xs uppercase tracking-widest">
                                Valle del Maipo · Buin
                            </span>
                        </div>

                        <h1 className="font-playfair text-6xl lg:text-7xl leading-[1] mb-8 text-[#1a1a1a]">
                            Sabores con<br />
                            <span className="italic text-[#8a9a5b] font-serif">Memoria.</span>
                        </h1>

                        <p className="font-inter text-gray-500 leading-relaxed max-w-sm mb-12 text-sm">
                            Una casona patrimonial donde la cordillera abraza al valle.
                            La cocina de autor del <strong>Chef Kanko</strong> rescata ingredientes locales
                            en un ambiente donde el tiempo se detiene.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div className="flex -space-x-4">
                                {/* Social Proof Avatars */}
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#faf9f6] bg-gray-200 overflow-hidden relative">
                                        <Image src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100`} alt="Reviewer" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-medium">
                                <div className="flex text-[#8a9a5b] mb-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                                <span className="text-gray-400">"El mejor Risotto de Buin"</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Visual Immersion (Parallax) */}
                <div className="w-full lg:w-7/12 h-[60vh] lg:h-auto relative overflow-hidden group">
                    <motion.div style={{ y }} className="absolute inset-0 h-[120%]">
                        <Image
                            src="/prospectos/mitifuu/hero_bg.png"
                            alt="Mitifuu Ambience"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                    <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur p-6 max-w-xs shadow-xl hidden md:block">
                        <p className="font-playfair italic text-lg mb-2">"Un refugio histórico"</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Est. 2018</p>
                    </div>
                </div>
            </section>

            {/* 3. MENU HIGHLIGHTS (Deep Scraping Simulation) */}
            <section className="py-32 px-6 bg-white relative" id="menu">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-20">
                        <div>
                            <h2 className="font-playfair text-5xl mb-6">Nuestra Carta</h2>
                            <p className="text-gray-500 max-w-md">
                                Una propuesta que fusiona la técnica Nikkei con la despensa chilena.
                                Ingredientes frescos del mercado de Buin.
                            </p>
                        </div>
                        <div className="text-right hidden lg:block">
                            <a href="#" className="border-b border-[#2b2b2b] pb-1 text-sm uppercase tracking-widest hover:text-[#8a9a5b] hover:border-[#8a9a5b] transition-colors">Ver Menú Completo</a>
                        </div>
                    </div>

                    {/* The Bento Grid of Food */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. Star Dish */}
                        <div className="md:col-span-2 relative h-[500px] group overflow-hidden rounded-sm">
                            <Image
                                src="/prospectos/mitifuu/plateada_gourmet.png"
                                alt="Plateada al Jugo"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                            <div className="absolute bottom-0 left-0 p-10 text-white">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="bg-[#8a9a5b] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">Chef's Choice</span>
                                    <span className="font-playfair italic">Cocción Lenta</span>
                                </div>
                                <h3 className="text-4xl font-playfair mb-2">Plateada al Jugo</h3>
                                <p className="text-gray-300 text-sm max-w-lg mb-6 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    12 horas de cocción en nuestra casona. Acompañada de pastelera de choclo rústica y reducción de Carmenere del valle.
                                </p>
                            </div>
                        </div>

                        {/* 2. Secondary Dishes Checklist */}
                        <div className="bg-[#f9f9f9] p-10 flex flex-col justify-between border border-gray-100">
                            <div>
                                <Utensils className="w-6 h-6 text-[#8a9a5b] mb-8" />
                                <h4 className="font-playfair text-2xl mb-8">Favoritos de la Casa</h4>
                                <ul className="space-y-6">
                                    <li className="flex justify-between items-baseline group cursor-pointer">
                                        <div>
                                            <span className="block font-medium group-hover:text-[#8a9a5b] transition-colors">Risotto de Setas</span>
                                            <span className="text-xs text-gray-400">Trufa negra, queso parmesano</span>
                                        </div>
                                        <span className="text-sm font-serif italic text-gray-400">$14.900</span>
                                    </li>
                                    <li className="flex justify-between items-baseline group cursor-pointer">
                                        <div>
                                            <span className="block font-medium group-hover:text-[#8a9a5b] transition-colors">Atún Suculento</span>
                                            <span className="text-xs text-gray-400">Costra de sésamo, salsa ponzu</span>
                                        </div>
                                        <span className="text-sm font-serif italic text-gray-400">$16.500</span>
                                    </li>
                                    <li className="flex justify-between items-baseline group cursor-pointer">
                                        <div>
                                            <span className="block font-medium group-hover:text-[#8a9a5b] transition-colors">Tres Carnes</span>
                                            <span className="text-xs text-gray-400">Lomo, Filete y Entraña grillada</span>
                                        </div>
                                        <span className="text-sm font-serif italic text-gray-400">$22.000</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 pt-10 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Wine className="w-5 h-5 text-[#8a9a5b]" />
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Maridaje sugerido: <span className="text-black font-semibold">Santa Rita Medalla Real</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. THE EXPERIENCE (Vibe & History) */}
            <section className="bg-[#2b2b2b] text-[#faf9f6] py-32 overflow-hidden relative" id="historia">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#8a9a5b]/5 skew-x-12 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div>
                        <span className="text-[#8a9a5b] font-inter text-xs uppercase tracking-[0.2em] mb-6 block">
                            Desde 2018
                        </span>
                        <h2 className="font-playfair text-5xl mb-8 leading-tight">
                            Un refugio para <br />la familia y el alma.
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6 font-light">
                            Ubicados en el histórico Camino El Arpa, a pasos de la mítica Viña Santa Rita.
                            Nuestra casona ha sido testigo de la historia de Buin y hoy abre sus puertas
                            como un punto de encuentro.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-10 font-light">
                            Aquí no solo vienes a comer; vienes a desconectarte.
                            Jardines amplios, sombra de árboles centenarios y la calidez de
                            <strong>Lissi y Kanko</strong> en cada detalle.
                        </p>

                        <div className="grid grid-cols-2 gap-8 text-sm tracking-widest uppercase">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#8a9a5b]" />
                                <span>Slow Food</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Leaf className="w-5 h-5 text-[#8a9a5b]" />
                                <span>Pet Friendly</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Creative composition of images */}
                        <div className="relative z-10 aspect-[4/5] bg-gray-800 rotate-2 border-8 border-white/5">
                            <Image
                                src="/prospectos/mitifuu/hero_bg.png"
                                alt="Interiores"
                                fill
                                className="object-cover opacity-80"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 z-20 bg-[#8a9a5b] p-8 text-[#2b2b2b] max-w-[200px]">
                            <ChefHat className="w-8 h-8 mb-4" />
                            <p className="font-playfair text-xl italic leading-tight">"Cocinamos con el ritmo de la tierra."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div>
                        <h3 className="font-playfair text-2xl mb-6">MITIFUU</h3>
                        <p className="text-gray-500 text-sm max-w-xs mb-8">
                            Camino El Arpa 2250, Buin.<br />
                            Región Metropolitana, Chile.
                        </p>
                        <a href="mailto:reservas@mitifuu.cl" className="text-sm border-b border-gray-300 pb-1 hover:text-[#8a9a5b] hover:border-[#8a9a5b] transition-colors">
                            reservas@mitifuu.cl
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-16 font-inter text-xs uppercase tracking-widest text-[#2b2b2b]">
                        <div>
                            <h5 className="font-bold mb-6 text-gray-400">Horarios</h5>
                            <ul className="space-y-4">
                                <li>Lun — Jue: 13:00 - 21:00</li>
                                <li>Vie — Sab: 13:00 - 22:00</li>
                                <li>Domingo: 13:00 - 17:00</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6 text-gray-400">Social</h5>
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-[#8a9a5b]">Instagram</a></li>
                                <li><a href="#" className="hover:text-[#8a9a5b]">Facebook</a></li>
                                <li><a href="#" className="hover:text-[#8a9a5b]">TripAdvisor</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="text-center border-t border-gray-100 pt-12">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        &copy; 2026 Mitifuu Restaurant. Designed by HojaCero AI.
                    </p>
                </div>
            </footer>
        </main>
    );
}
