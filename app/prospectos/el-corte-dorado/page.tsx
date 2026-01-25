'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { KineticText } from '@/components/premium/KineticText';
import { VelocityScroll } from '@/components/premium/VelocityScroll';
import { GrainTexture } from '@/components/premium/GrainTexture';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';

// =============================================================================
// DESIGN BRIEF: "El Corte Dorado" - Barbería Premium
// =============================================================================
// Layout: Cinematic Fullscreen (100vh sections)
// Typography: The Editorial (Bebas Neue + Lora)
// Motion: Theater Curtain (ClipPath reveals)
// Color: Deep Earth (#1a1512, #c9a050, #8b5e3c)
// Prompt: "Barber Club" from batch_7_new_categories.sql
// =============================================================================

const cuts = [
    { name: 'Classic Fade', price: '$25', desc: 'El corte insignia. Degradado perfecto.' },
    { name: 'Skin Fade', price: '$30', desc: 'Precisión militar. Cero imperfecciones.' },
    { name: 'Beard Sculpt', price: '$20', desc: 'Escultura facial. Líneas que definen.' },
    { name: 'The Executive', price: '$45', desc: 'Corte + Barba + Toalla caliente.' },
];

const products = [
    { name: 'Pomada Clásica', desc: 'Fijación media, brillo natural' },
    { name: 'Aceite de Barba', desc: 'Argán + Jojoba. Suavidad premium.' },
    { name: 'Aftershave', desc: 'Frescura mentolada. El clásico.' },
];

// Theater Curtain Animation Variants
const curtainReveal = {
    hidden: { clipPath: 'inset(100% 0 0 0)' },
    visible: {
        clipPath: 'inset(0% 0 0 0)',
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] as const }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
    }
};

export default function ElCorteDoradoPage() {
    return (
        <main
            className="bg-[#1a1512] text-[#f5f0e8] overflow-x-hidden"
            style={{ fontFamily: "'Lora', Georgia, serif" }}
        >
            <GrainTexture opacity={0.08} animated={true} />

            {/* =========================================================== */}
            {/* HERO - THE CHAIR (100vh) */}
            {/* =========================================================== */}
            <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                {/* Background with brass gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512] via-[#1a1512] to-[#0d0b09]" />

                {/* Spotlight effect */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#c9a050]/10 rounded-full blur-[120px]" />

                {/* Content */}
                <motion.div
                    className="relative z-10 text-center px-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.2 } }
                    }}
                >
                    {/* Badge */}
                    <motion.div variants={fadeUp} className="mb-8">
                        <span className="text-[#c9a050] tracking-[0.4em] uppercase text-xs font-sans">
                            Est. 2018 • Santiago
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        variants={curtainReveal}
                        className="text-6xl md:text-[10rem] leading-[0.85] tracking-tight uppercase"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        <span className="block text-[#f5f0e8]">STAY</span>
                        <KineticText
                            text="SHARP"
                            className="text-[#c9a050] block"
                            animation="scale"
                            duration={0.6}
                            stagger={0.08}
                        />
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        variants={fadeUp}
                        className="mt-8 text-lg md:text-xl text-[#a89a88] max-w-md mx-auto italic"
                    >
                        "El corte perfecto no es un lujo. Es un estándar."
                    </motion.p>

                    {/* CTA */}
                    <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-[#c9a050] text-[#1a1512] px-10 py-4 text-sm uppercase tracking-widest font-sans font-bold hover:bg-[#f5f0e8] transition-colors">
                            Reservar Hora
                        </button>
                        <button className="border border-[#c9a050]/30 text-[#c9a050] px-10 py-4 text-sm uppercase tracking-widest font-sans hover:bg-[#c9a050]/10 transition-colors">
                            Ver Servicios
                        </button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[#c9a050]/50 text-xs uppercase tracking-widest">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-[#c9a050]/50 to-transparent" />
                </div>
            </section>

            {/* =========================================================== */}
            {/* VELOCITY SCROLL - STATEMENT */}
            {/* =========================================================== */}
            <section className="py-16 bg-[#0d0b09] border-y border-[#c9a050]/10 overflow-hidden">
                <VelocityScroll
                    text="FADE • BEARD • SHARP • GENTLEMAN • CLASSIC •"
                    default_velocity={2}
                    className="text-6xl md:text-8xl text-[#2a2420] uppercase font-['Bebas_Neue']"
                />
            </section>

            {/* =========================================================== */}
            {/* SECTION 2 - THE CUTS (Services) */}
            {/* =========================================================== */}
            <section className="min-h-screen py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        <div>
                            <motion.span variants={fadeUp} className="text-[#c9a050] text-sm uppercase tracking-widest">
                                Servicios
                            </motion.span>
                            <motion.h2
                                variants={curtainReveal}
                                className="text-5xl md:text-7xl uppercase mt-2"
                                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                            >
                                The Cuts
                            </motion.h2>
                        </div>
                        <motion.div variants={fadeUp} className="text-right">
                            <span className="text-[#a89a88] text-sm">Años de experiencia</span>
                            <AnimatedCounter to={6} className="text-4xl text-[#c9a050] block font-['Bebas_Neue']" />
                        </motion.div>
                    </motion.div>

                    {/* Cuts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cuts.map((cut, i) => (
                            <motion.div
                                key={cut.name}
                                className="group border border-[#c9a050]/20 p-8 hover:border-[#c9a050]/50 hover:bg-[#c9a050]/5 transition-all duration-500"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3
                                        className="text-3xl text-[#f5f0e8] group-hover:text-[#c9a050] transition-colors"
                                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                                    >
                                        {cut.name}
                                    </h3>
                                    <span className="text-2xl text-[#c9a050]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                        {cut.price}
                                    </span>
                                </div>
                                <p className="text-[#a89a88] italic">{cut.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================== */}
            {/* SECTION 3 - THE PRODUCTS */}
            {/* =========================================================== */}
            <section className="py-24 px-6 bg-[#0d0b09]">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        <motion.span variants={fadeUp} className="text-[#c9a050] text-sm uppercase tracking-widest">
                            Productos
                        </motion.span>
                        <motion.h2
                            variants={curtainReveal}
                            className="text-5xl md:text-7xl uppercase mt-2"
                            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                            The Shelf
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map((product, i) => (
                            <motion.div
                                key={product.name}
                                className="text-center p-8"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                transition={{ delay: i * 0.15 }}
                            >
                                {/* Product Icon Placeholder */}
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-[#c9a050]/30 flex items-center justify-center">
                                    <span className="text-3xl text-[#c9a050]">✦</span>
                                </div>
                                <h3
                                    className="text-2xl text-[#f5f0e8] mb-2"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                                >
                                    {product.name}
                                </h3>
                                <p className="text-[#a89a88] italic text-sm">{product.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================== */}
            {/* SECTION 4 - STATS */}
            {/* =========================================================== */}
            <section className="py-24 px-6 border-y border-[#c9a050]/10">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: 12000, suffix: '+', label: 'Cortes realizados' },
                        { value: 6, suffix: '', label: 'Años de experiencia' },
                        { value: 4, suffix: '', label: 'Barberos expertos' },
                        { value: 98, suffix: '%', label: 'Clientes satisfechos' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            transition={{ delay: i * 0.1 }}
                        >
                            <AnimatedCounter
                                to={stat.value}
                                suffix={stat.suffix}
                                className="text-4xl md:text-5xl text-[#c9a050] font-['Bebas_Neue']"
                            />
                            <span className="text-[#a89a88] text-sm block mt-2">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* =========================================================== */}
            {/* FOOTER CTA */}
            {/* =========================================================== */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#c9a050]/5 to-transparent" />

                <motion.div
                    className="relative z-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    <motion.h2
                        variants={curtainReveal}
                        className="text-5xl md:text-8xl uppercase mb-8"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                        ¿Listo para el<br />
                        <span className="text-[#c9a050]">cambio?</span>
                    </motion.h2>

                    <motion.button
                        variants={fadeUp}
                        className="bg-[#c9a050] text-[#1a1512] px-14 py-5 text-lg uppercase tracking-widest font-sans font-bold hover:bg-[#f5f0e8] transition-colors"
                    >
                        Reservar Ahora
                    </motion.button>

                    <motion.div variants={fadeUp} className="mt-12 text-[#a89a88]">
                        <p className="text-sm">📍 Av. Providencia 1234, Santiago</p>
                        <p className="text-sm mt-1">📞 +56 9 1234 5678</p>
                        <p className="text-sm mt-1">⏰ Lun-Sáb: 10:00 - 20:00</p>
                    </motion.div>
                </motion.div>
            </section>

            {/* =========================================================== */}
            {/* FOOTER - BARBERSHOP STYLE */}
            {/* =========================================================== */}
            <footer className="relative py-12 px-6 bg-[#0d0b09] overflow-hidden">
                {/* Barber Pole Stripe Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c9a050] via-[#8b5e3c] to-[#c9a050]" />

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Logo/Brand */}
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <span className="text-3xl">✂</span>
                                <span
                                    className="text-2xl text-[#c9a050] tracking-wider"
                                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                                >
                                    EL CORTE DORADO
                                </span>
                            </div>
                            <p className="text-[#a89a88] text-xs mt-2 italic">
                                "Donde los caballeros se afinan"
                            </p>
                        </div>

                        {/* Hours */}
                        <div className="text-center border-x border-[#c9a050]/20 py-4">
                            <span className="text-[#c9a050] text-xs uppercase tracking-widest block mb-2">
                                Horario
                            </span>
                            <p className="text-[#f5f0e8] text-sm">Lun-Vie: 10:00 - 20:00</p>
                            <p className="text-[#f5f0e8] text-sm">Sáb: 10:00 - 18:00</p>
                            <p className="text-[#a89a88] text-xs mt-1">Dom: Día de descanso</p>
                        </div>

                        {/* Social/Contact */}
                        <div className="text-center md:text-right">
                            <div className="flex justify-center md:justify-end gap-4 mb-3">
                                <a href="#" className="text-[#a89a88] hover:text-[#c9a050] transition-colors text-xl">📷</a>
                                <a href="#" className="text-[#a89a88] hover:text-[#c9a050] transition-colors text-xl">💬</a>
                                <a href="#" className="text-[#a89a88] hover:text-[#c9a050] transition-colors text-xl">📍</a>
                            </div>
                            <p className="text-[#a89a88] text-xs">+56 9 1234 5678</p>
                            <p className="text-[#a89a88] text-xs">Av. Providencia 1234</p>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-8 pt-6 border-t border-[#c9a050]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[#a89a88]/50 text-xs">
                            © 2024 El Corte Dorado. Tradición desde 2018.
                        </p>
                        <p className="text-[#a89a88]/30 text-xs flex items-center gap-2">
                            Sitio creado por <span className="text-[#c9a050]/50">HojaCero</span> ✦
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
