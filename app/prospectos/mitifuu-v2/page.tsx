'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock, Leaf, Dog, ChefHat, Wine, Star, ArrowRight, Phone } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid';

// ============================================================================
// MITIFUU V2 - MIDNIGHT THEATRE STYLE
// Prompt: Gastronomía - Midnight Theatre (Dark Futurism) V3.2
// Real Content: Editorial Curation from https://mitifuu.mesa247.la/
// ============================================================================

export default function MitifuuV2Page() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // REAL DATA EXTRACTED (Editorial Curation Protocol)
    const realData = {
        name: "MITIFUU",
        tagline: "Restaurante Familiar - Comida de Autor",
        location: "Cam. El Arpa 2250, Buin, Región Metropolitana",
        valley: "Valle del Maipo",
        owners: { host: "Kanko y Lissi", chef: "Chef Kanko" },
        team: ["Pablo", "Isadora", "Matilde"],
        philosophy: "Comida de Autor en un ambiente acogedor de sonidos, aromas, visiones, texturas y sabores únicos.",
        origin: "Desde la cordillera al valle, desde el Cajón del Maipo a Buin",
        features: ["Pet Friendly", "Familias", "Parejas", "Grupos"],
        hours: {
            weekday: "13:00 - 21:00",
            friday: "13:00 - 22:00",
            sunday: "13:00 - 17:00"
        }
    };

    // Curated dishes (editorial selection from site context)
    const dishes = [
        {
            name: "Plateada al Jugo",
            description: "12 horas de cocción lenta. Pastelera de choclo rústica, reducción de Carmenere.",
            tag: "Chef's Choice",
            featured: true
        },
        {
            name: "Risotto de Setas",
            description: "Trufa negra local, queso parmesano añejado, hierbas del jardín.",
            price: "$14.900"
        },
        {
            name: "Atún Suculento",
            description: "Costra de sésamo negro, salsa ponzu, vegetales de estación.",
            price: "$16.500"
        },
        {
            name: "Tres Carnes",
            description: "Lomo, filete y entraña grillada. Chimichurri de la casa.",
            price: "$22.000"
        },
        {
            name: "Opción Vegana",
            description: "Platos 100% vegetales con técnica de autor. Consulta del día.",
            tag: "Vegano"
        }
    ];

    return (
        <main className="w-full bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans">

            {/* ============================================================
                NAVBAR - Minimal Dark
            ============================================================ */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    {/* Logo */}
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-amber-500/30">
                        <Image
                            src="/prospectos/mitifuu-v2/logo.jpg"
                            alt="Mitifuu Logo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex gap-10 text-xs tracking-[0.25em] uppercase font-light text-gray-400">
                        <a href="#experiencia" className="hover:text-amber-400 transition-colors">Experiencia</a>
                        <a href="#carta" className="hover:text-amber-400 transition-colors">Carta</a>
                        <a href="#historia" className="hover:text-amber-400 transition-colors">La Casona</a>
                    </div>

                    {/* CTA */}
                    <a
                        href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                        target="_blank"
                        className="bg-amber-500 text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-amber-400 transition-colors"
                    >
                        Reservar
                    </a>
                </div>
            </nav>

            {/* ============================================================
                HERO - Asymmetric 7/5 Split (Midnight Theatre)
                SELF-CHECK: ✅ Not centered, ✅ Dramatic, ✅ Unique
            ============================================================ */}
            <section className="min-h-screen pt-20 flex flex-col lg:flex-row">
                {/* LEFT: Typography Drama (5/12) */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center p-10 lg:p-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Location Tag */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] w-16 bg-amber-500"></div>
                            <span className="text-amber-500 text-xs uppercase tracking-[0.3em]">
                                {realData.valley}
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-6xl lg:text-8xl font-serif leading-[0.9] mb-8 tracking-tight">
                            <span className="block text-white/90">SABOR</span>
                            <span className="block italic text-amber-400 font-light">Nocturno.</span>
                        </h1>

                        {/* Philosophy */}
                        <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed font-light">
                            Una experiencia de <span className="text-white">Comida de Autor</span> donde
                            la cordillera abraza al valle. Aromas, texturas y sabores únicos
                            de la mano de <span className="text-amber-400">{realData.owners.chef}</span>.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-amber-500 text-black px-8 py-4 text-sm uppercase tracking-widest font-semibold hover:bg-amber-400 transition-all group"
                            >
                                Reservar Mesa
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#carta"
                                className="inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-sm uppercase tracking-widest font-light hover:border-amber-500 hover:text-amber-400 transition-colors"
                            >
                                Ver Carta
                            </a>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-16 flex items-center gap-4">
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-gray-500 text-sm italic">"El mejor Risotto de Buin"</span>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: Visual Immersion (7/12) */}
                <div className="w-full lg:w-7/12 h-[70vh] lg:h-auto relative overflow-hidden">
                    <motion.div style={{ y }} className="absolute inset-0 h-[130%]">
                        <Image
                            src="/prospectos/mitifuu-v2/interior_moody.png"
                            alt="Mitifuu Interior"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                    </motion.div>

                    {/* Floating Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-12 right-12 bg-black/90 backdrop-blur-xl border border-white/10 p-8 max-w-xs hidden lg:block"
                    >
                        <ChefHat className="w-8 h-8 text-amber-500 mb-4" />
                        <p className="font-serif italic text-xl text-white/90 mb-2">"Cocinamos con el ritmo de la tierra."</p>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">{realData.owners.chef}</p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================================
                SIGNATURE DISH SPOTLIGHT (3DCard-like emphasis)
            ============================================================ */}
            <section className="py-24 px-6 lg:px-0 relative" id="experiencia">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-sm overflow-hidden group"
                    >
                        {/* Hero Dish Image */}
                        <div className="relative h-[60vh] lg:h-[70vh]">
                            <Image
                                src="/prospectos/mitifuu-v2/hero_dish.png"
                                alt="Plateada al Jugo"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        {/* Dish Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-16">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-amber-500 text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    Chef's Choice
                                </span>
                                <span className="text-gray-400 text-sm font-serif italic">12 Horas de Cocción</span>
                            </div>
                            <h2 className="font-serif text-5xl lg:text-7xl mb-4">Plateada al Jugo</h2>
                            <p className="text-gray-400 max-w-xl text-lg leading-relaxed mb-6">
                                Nuestra especialidad de la casa. Corte selecto cocinado lentamente con hierbas aromáticas del jardín.
                                Acompañada de pastelera de choclo rústica y reducción de Carmenere del valle.
                            </p>
                            <div className="flex items-center gap-3 text-amber-400">
                                <Wine className="w-5 h-5" />
                                <span className="text-sm uppercase tracking-wider">Maridaje: Carmenere Reserva</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============================================================
                MENU BENTO GRID (Real prices from V1 + organized)
            ============================================================ */}
            <section className="py-24 px-6 bg-[#0a0a0a]" id="carta">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
                        <div>
                            <span className="text-amber-500 text-xs uppercase tracking-[0.3em] block mb-4">Nuestra Carta</span>
                            <h2 className="font-serif text-4xl lg:text-5xl">Sabores Únicos</h2>
                        </div>
                        <p className="text-gray-500 max-w-md mt-6 lg:mt-0 font-light">
                            Fusión de técnica Nikkei con la despensa chilena.
                            Ingredientes frescos del mercado de Buin.
                        </p>
                    </div>

                    {/* Dishes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dishes.filter(d => !d.featured).map((dish, i) => (
                            <motion.div
                                key={dish.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 p-8 hover:border-amber-500/50 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-serif text-xl group-hover:text-amber-400 transition-colors">{dish.name}</h3>
                                    {dish.price && (
                                        <span className="text-amber-500 font-light">{dish.price}</span>
                                    )}
                                    {dish.tag && (
                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 text-[10px] uppercase tracking-wider">{dish.tag}</span>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">{dish.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Wine Pairing CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4">
                            <Wine className="w-5 h-5 text-amber-500" />
                            <span className="text-gray-400 text-sm">
                                Carta de vinos del Valle del Maipo · <span className="text-white">Santa Rita Medalla Real</span> recomendado
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                LA CASONA - History Section (Real content)
            ============================================================ */}
            <section className="py-32 relative overflow-hidden" id="historia">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 -skew-x-12 pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Text */}
                    <div>
                        <span className="text-amber-500 text-xs uppercase tracking-[0.3em] block mb-6">
                            {realData.origin}
                        </span>
                        <h2 className="font-serif text-4xl lg:text-5xl mb-8 leading-tight">
                            Un refugio para<br />
                            <span className="italic text-amber-400">la familia y el alma.</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6 font-light">
                            Ubicados en el histórico Camino El Arpa, a pasos de la mítica Viña Santa Rita.
                            Nuestra casona ha sido testigo de la historia de Buin y hoy abre sus puertas
                            como un punto de encuentro.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-10 font-light">
                            Aquí no solo vienes a comer; vienes a desconectarte.
                            Jardines amplios, sombra de árboles centenarios y la calidez de
                            <span className="text-white font-medium"> {realData.owners.host}</span> en cada detalle.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <Dog className="w-5 h-5 text-amber-500" />
                                <span className="text-sm uppercase tracking-wider">Pet Friendly</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Leaf className="w-5 h-5 text-amber-500" />
                                <span className="text-sm uppercase tracking-wider">Vegano-Friendly</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <span className="text-sm uppercase tracking-wider">Slow Food</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                <span className="text-sm uppercase tracking-wider">Valle del Maipo</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Composition */}
                    <div className="relative">
                        <div className="relative aspect-[4/5] rotate-2 border-8 border-white/5 overflow-hidden">
                            <Image
                                src="/prospectos/mitifuu-v2/interior_moody.png"
                                alt="La Casona"
                                fill
                                className="object-cover opacity-80"
                            />
                        </div>
                        {/* Quote Card */}
                        <div className="absolute -bottom-8 -left-8 bg-amber-500 text-black p-8 max-w-[220px]">
                            <ChefHat className="w-8 h-8 mb-4" />
                            <p className="font-serif italic text-lg leading-tight">
                                "Fascinarás con cada plato."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FINAL CTA + CONTACT (Real info)
            ============================================================ */}
            <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-amber-500 text-xs uppercase tracking-[0.3em] block mb-6">Reservaciones</span>
                    <h2 className="font-serif text-4xl lg:text-6xl mb-8">¿Listo para la experiencia?</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-12 font-light">
                        Serán recibidos por {realData.owners.host}, atendidos por Pablo, Isadora y Matilde.
                        Reserva y deja que te sorprendamos.
                    </p>

                    <a
                        href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                        target="_blank"
                        className="inline-flex items-center gap-4 bg-amber-500 text-black px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-amber-400 transition-colors group"
                    >
                        Reservar Mesa Ahora
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </a>

                    {/* Schedule */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto text-sm">
                        <div>
                            <p className="text-gray-500 uppercase tracking-wider mb-2">Lun — Jue</p>
                            <p className="text-white">{realData.hours.weekday}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase tracking-wider mb-2">Vie — Sáb</p>
                            <p className="text-white">{realData.hours.friday}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 uppercase tracking-wider mb-2">Domingo</p>
                            <p className="text-white">{realData.hours.sunday}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}
            <footer className="py-16 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    {/* Logo + Address */}
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-amber-400">MITIFUU</h3>
                        <p className="text-gray-500 text-sm max-w-xs mb-6">
                            {realData.location}
                        </p>
                        <a
                            href="https://www.google.com/maps/place/MITIFUU"
                            target="_blank"
                            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
                        >
                            Ver en Google Maps →
                        </a>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16 text-xs uppercase tracking-widest text-gray-500">
                        <div>
                            <h5 className="text-white mb-4 font-medium">Navegar</h5>
                            <ul className="space-y-3">
                                <li><a href="#carta" className="hover:text-amber-400 transition-colors">Carta</a></li>
                                <li><a href="#historia" className="hover:text-amber-400 transition-colors">La Casona</a></li>
                                <li><a href="https://mitifuu.mesa247.la/reservas/#/mitifuu" className="hover:text-amber-400 transition-colors">Reservar</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-white mb-4 font-medium">Social</h5>
                            <ul className="space-y-3">
                                <li><a href="#" className="hover:text-amber-400 transition-colors">Instagram</a></li>
                                <li><a href="#" className="hover:text-amber-400 transition-colors">TripAdvisor</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center border-t border-white/5 mt-16 pt-8">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        © 2026 Mitifuu Restaurant · Demo generado por HojaCero Factory V3.2
                    </p>
                </div>
            </footer>
        </main>
    );
}
