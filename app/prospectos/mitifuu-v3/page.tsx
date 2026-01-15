'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock, Leaf, Dog, ChefHat, Wine, Star, ArrowRight, Sun, Heart, Users } from 'lucide-react';

// ============================================================================
// MITIFUU V3 - TUSCAN WARMTH STYLE
// Prompt: Gastronomía - Tuscan Warmth (Mediterranean Comfort) V3.2
// Real Content: Editorial Curation from https://mitifuu.mesa247.la/
// ============================================================================

export default function MitifuuV3Page() {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

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

    // Curated dishes
    const dishes = [
        {
            name: "Plateada al Jugo",
            description: "12 horas de cocción lenta. Pastelera de choclo rústica, reducción de Carmenere.",
            tag: "Favorito",
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
        }
    ];

    return (
        <main className="w-full bg-[#faf8f5] text-[#2b2518] selection:bg-[#8b7355] selection:text-white font-sans">

            {/* ============================================================
                NAVBAR - Warm & Inviting
            ============================================================ */}
            <nav className="fixed top-0 w-full z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e0d5]">
                <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
                    {/* Logo */}
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#d4a574]/30 shadow-sm">
                        <Image
                            src="/prospectos/mitifuu-v3/logo.jpg"
                            alt="Mitifuu Logo"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex gap-10 text-xs tracking-[0.2em] uppercase font-medium text-[#8b7355]">
                        <a href="#historia" className="hover:text-[#d4a574] transition-colors">La Casona</a>
                        <a href="#carta" className="hover:text-[#d4a574] transition-colors">Carta</a>
                        <a href="#visita" className="hover:text-[#d4a574] transition-colors">Visítanos</a>
                    </div>

                    {/* CTA */}
                    <a
                        href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                        target="_blank"
                        className="bg-[#d4a574] text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#c49464] transition-colors shadow-md"
                    >
                        Reservar Mesa
                    </a>
                </div>
            </nav>

            {/* ============================================================
                HERO - Warm Split Layout (Tuscan Warmth)
                SELF-CHECK: ✅ Familiar, ✅ Inviting, ✅ Daylight vibe
            ============================================================ */}
            <section className="min-h-screen pt-24 flex flex-col lg:flex-row">
                {/* LEFT: Warm Typography */}
                <div className="w-full lg:w-5/12 flex flex-col justify-center p-10 lg:p-20 relative z-10 bg-[#faf8f5]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Location Tag */}
                        <div className="flex items-center gap-4 mb-6">
                            <Sun className="w-5 h-5 text-[#d4a574]" />
                            <span className="text-[#8b7355] text-xs uppercase tracking-[0.25em]">
                                {realData.valley} · Buin
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="font-serif text-5xl lg:text-7xl leading-[1.1] mb-8 text-[#2b2518]">
                            Sabores con
                            <span className="block italic text-[#d4a574]">Memoria.</span>
                        </h1>

                        {/* Philosophy */}
                        <p className="text-[#6b5d4d] text-lg max-w-md mb-10 leading-relaxed">
                            Una casona patrimonial donde la cordillera abraza al valle.
                            La cocina de autor de <span className="font-semibold text-[#2b2518]">{realData.owners.chef}</span> rescata
                            ingredientes locales en un ambiente donde el tiempo se detiene.
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            <span className="inline-flex items-center gap-2 bg-[#f0ebe4] text-[#8b7355] px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                                <Dog className="w-4 h-4" /> Pet Friendly
                            </span>
                            <span className="inline-flex items-center gap-2 bg-[#f0ebe4] text-[#8b7355] px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                                <Users className="w-4 h-4" /> Familias
                            </span>
                            <span className="inline-flex items-center gap-2 bg-[#f0ebe4] text-[#8b7355] px-4 py-2 rounded-full text-xs uppercase tracking-wider">
                                <Leaf className="w-4 h-4" /> Vegano-Friendly
                            </span>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                                target="_blank"
                                className="inline-flex items-center justify-center gap-3 bg-[#d4a574] text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-[#c49464] transition-all shadow-lg group"
                            >
                                Reservar Mesa
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="#carta"
                                className="inline-flex items-center justify-center gap-3 border-2 border-[#d4a574] text-[#d4a574] px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-[#d4a574] hover:text-white transition-colors"
                            >
                                Ver Carta
                            </a>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-12 flex items-center gap-4">
                            <div className="flex text-[#d4a574]">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <span className="text-[#8b7355] text-sm italic">"El mejor Risotto de Buin"</span>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: Warm Visual (7/12) */}
                <div className="w-full lg:w-7/12 h-[60vh] lg:h-auto relative overflow-hidden">
                    <motion.div style={{ y }} className="absolute inset-0 h-[120%]">
                        <Image
                            src="/prospectos/mitifuu-v3/hero.png"
                            alt="Mitifuu Terrace"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>

                    {/* Floating Quote Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="absolute bottom-10 left-10 bg-white/95 backdrop-blur-sm border border-[#e8e0d5] p-8 rounded-2xl shadow-xl max-w-xs hidden lg:block"
                    >
                        <Heart className="w-8 h-8 text-[#d4a574] mb-4" />
                        <p className="font-serif italic text-xl text-[#2b2518] mb-2">"Un refugio para la familia y el alma."</p>
                        <p className="text-[#8b7355] text-xs uppercase tracking-widest">Desde 2018</p>
                    </motion.div>
                </div>
            </section>

            {/* ============================================================
                LA HISTORIA - Family Story
            ============================================================ */}
            <section className="py-24 px-6 bg-white" id="historia">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/prospectos/mitifuu-v3/dish.png"
                                    alt="Plateada al Jugo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Chef Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-[#d4a574] text-white p-6 rounded-2xl shadow-lg">
                                <ChefHat className="w-10 h-10 mb-2" />
                                <p className="font-serif text-lg">{realData.owners.chef}</p>
                            </div>
                        </div>

                        {/* Story */}
                        <div>
                            <span className="text-[#d4a574] text-xs uppercase tracking-[0.25em] block mb-4">Quiénes Somos</span>
                            <h2 className="font-serif text-4xl lg:text-5xl mb-8 text-[#2b2518] leading-tight">
                                Un giro desde la cordillera<br />
                                <span className="italic text-[#d4a574]">al valle.</span>
                            </h2>
                            <p className="text-[#6b5d4d] leading-relaxed mb-6 text-lg">
                                Somos un restaurante familiar que nace del amor por la buena comida y la hospitalidad.
                                {realData.owners.host} les darán la bienvenida, mientras Pablo, Isadora y Matilde
                                se asegurarán de que cada momento sea inolvidable.
                            </p>
                            <p className="text-[#6b5d4d] leading-relaxed mb-8 text-lg">
                                <span className="font-semibold text-[#2b2518]">{realData.philosophy}</span> Todos nuestros platos
                                sobresalen por sí mismos, desde los netamente veganos y vegetarianos hasta nuestras carnes.
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-[#faf8f5] p-4 rounded-xl">
                                    <Clock className="w-5 h-5 text-[#d4a574]" />
                                    <span className="text-sm text-[#2b2518]">Slow Food</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#faf8f5] p-4 rounded-xl">
                                    <Dog className="w-5 h-5 text-[#d4a574]" />
                                    <span className="text-sm text-[#2b2518]">Pet Friendly</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#faf8f5] p-4 rounded-xl">
                                    <Leaf className="w-5 h-5 text-[#d4a574]" />
                                    <span className="text-sm text-[#2b2518]">Opciones Veganas</span>
                                </div>
                                <div className="flex items-center gap-3 bg-[#faf8f5] p-4 rounded-xl">
                                    <MapPin className="w-5 h-5 text-[#d4a574]" />
                                    <span className="text-sm text-[#2b2518]">Valle del Maipo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                MENU - Warm Cards
            ============================================================ */}
            <section className="py-24 px-6 bg-[#f5f0e8]" id="carta">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <span className="text-[#d4a574] text-xs uppercase tracking-[0.25em] block mb-4">Nuestra Carta</span>
                        <h2 className="font-serif text-4xl lg:text-5xl text-[#2b2518] mb-4">Favoritos de la Casa</h2>
                        <p className="text-[#6b5d4d] max-w-xl mx-auto">
                            Una propuesta que fusiona la técnica con la despensa chilena.
                            Ingredientes frescos del mercado de Buin.
                        </p>
                    </div>

                    {/* Featured Dish */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-72 lg:h-auto">
                                <Image
                                    src="/prospectos/mitifuu-v3/dish.png"
                                    alt="Plateada al Jugo"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-[#d4a574] text-white px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold">
                                    Chef's Choice
                                </div>
                            </div>
                            <div className="p-10 lg:p-16 flex flex-col justify-center">
                                <h3 className="font-serif text-3xl lg:text-4xl text-[#2b2518] mb-4">Plateada al Jugo</h3>
                                <p className="text-[#6b5d4d] text-lg mb-6 leading-relaxed">
                                    12 horas de cocción en nuestra casona. Acompañada de pastelera de choclo rústica
                                    y reducción de Carmenere del valle.
                                </p>
                                <div className="flex items-center gap-3 text-[#d4a574]">
                                    <Wine className="w-5 h-5" />
                                    <span className="text-sm">Maridaje: Santa Rita Medalla Real</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other Dishes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {dishes.filter(d => !d.featured).map((dish, i) => (
                            <motion.div
                                key={dish.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-serif text-xl text-[#2b2518]">{dish.name}</h3>
                                    {dish.price && (
                                        <span className="text-[#d4a574] font-semibold">{dish.price}</span>
                                    )}
                                </div>
                                <p className="text-[#8b7355] text-sm leading-relaxed">{dish.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                VISIT US - Schedule + Location
            ============================================================ */}
            <section className="py-24 px-6 bg-white" id="visita">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-[#d4a574] text-xs uppercase tracking-[0.25em] block mb-4">Visítanos</span>
                    <h2 className="font-serif text-4xl lg:text-5xl text-[#2b2518] mb-6">
                        Te esperamos en nuestra casona
                    </h2>
                    <p className="text-[#6b5d4d] max-w-xl mx-auto mb-12 text-lg">
                        Estamos en el histórico Camino El Arpa, a pasos de la mítica Viña Santa Rita.
                        Jardines amplios, sombra de árboles centenarios y la calidez de siempre.
                    </p>

                    {/* Schedule Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#faf8f5] p-8 rounded-2xl">
                            <p className="text-[#8b7355] text-xs uppercase tracking-widest mb-3">Lunes a Jueves</p>
                            <p className="font-serif text-2xl text-[#2b2518]">{realData.hours.weekday}</p>
                        </div>
                        <div className="bg-[#faf8f5] p-8 rounded-2xl">
                            <p className="text-[#8b7355] text-xs uppercase tracking-widest mb-3">Viernes y Sábado</p>
                            <p className="font-serif text-2xl text-[#2b2518]">{realData.hours.friday}</p>
                        </div>
                        <div className="bg-[#faf8f5] p-8 rounded-2xl">
                            <p className="text-[#8b7355] text-xs uppercase tracking-widest mb-3">Domingo</p>
                            <p className="font-serif text-2xl text-[#2b2518]">{realData.hours.sunday}</p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-center gap-3 text-[#6b5d4d] mb-8">
                        <MapPin className="w-5 h-5 text-[#d4a574]" />
                        <span>{realData.location}</span>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://mitifuu.mesa247.la/reservas/#/mitifuu"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-3 bg-[#d4a574] text-white px-10 py-5 rounded-full text-sm uppercase tracking-widest font-semibold hover:bg-[#c49464] transition-all shadow-lg group"
                        >
                            Reservar Mesa Ahora
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="https://www.google.com/maps/place/MITIFUU"
                            target="_blank"
                            className="inline-flex items-center justify-center gap-3 border-2 border-[#d4a574] text-[#d4a574] px-10 py-5 rounded-full text-sm uppercase tracking-widest hover:bg-[#d4a574] hover:text-white transition-colors"
                        >
                            Ver en Google Maps
                        </a>
                    </div>
                </div>
            </section>

            {/* ============================================================
                FOOTER
            ============================================================ */}
            <footer className="py-16 px-6 bg-[#2b2518] text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                        {/* Logo + Story */}
                        <div className="max-w-sm">
                            <h3 className="font-serif text-3xl mb-4 text-[#d4a574]">MITIFUU</h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-6">
                                {realData.origin}. Un refugio para compartir en familia, con amigos,
                                y por supuesto, con tu mascota.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-white/50 hover:text-[#d4a574] transition-colors text-sm">Instagram</a>
                                <a href="#" className="text-white/50 hover:text-[#d4a574] transition-colors text-sm">Facebook</a>
                                <a href="#" className="text-white/50 hover:text-[#d4a574] transition-colors text-sm">TripAdvisor</a>
                            </div>
                        </div>

                        {/* Contact */}
                        <div>
                            <h5 className="text-[#d4a574] text-xs uppercase tracking-widest mb-4">Contacto</h5>
                            <p className="text-white/70 text-sm mb-2">{realData.location}</p>
                            <a href="mailto:reservas@mitifuu.cl" className="text-white hover:text-[#d4a574] transition-colors text-sm">
                                reservas@mitifuu.cl
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-white/10 pt-8 text-center">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">
                            © 2026 Mitifuu Restaurant · Demo generado por HojaCero Factory V3.2 - Tuscan Warmth
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
