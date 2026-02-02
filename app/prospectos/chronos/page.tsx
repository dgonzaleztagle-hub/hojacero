'use client';

import React from 'react';
import { WaveLines } from '@/components/premium/WaveLines';
import { KineticText } from '@/components/premium/KineticText';
import { GrainTexture } from '@/components/premium/GrainTexture';
import { MagneticCursorDot } from '@/components/premium/MagneticCursor';
import { VelocityScroll } from '@/components/premium/VelocityScroll';
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid';
import { InfiniteMovingCards } from '@/components/premium/InfiniteMovingCards';
import { motion } from 'framer-motion';

/**
 * CHRONOS - Demo Luxury Watch Brand
 * Estilo: Geometría Líquida (Wave Lines) + Vidrio + Aire + Secciones Premium
 */
export default function ChronosDemo() {
    return (
        <main className="relative min-h-screen text-white overflow-x-hidden selection:bg-gold-500/30 font-sans">
            {/* Capa 0: Fondo Negro Absoluto (Base) */}
            <div className="fixed inset-0 bg-[#050505] -z-20" />

            {/* Capa 1: Geometría Líquida Concentrada (La referencia de Daniel) */}
            <WaveLines color="rgba(201, 162, 39, 0.8)" count={25} speed={0.005} opacity={0.3} />

            {/* Capa 2: Textura de Grano (El toque analógico/caro) */}
            <GrainTexture opacity={0.1} animated={true} blendMode="overlay" />

            {/* Capa 3: Cursor Magnético */}
            <MagneticCursorDot />

            {/* SECCIÓN 1: HERO */}
            <section className="relative h-screen flex flex-col justify-between px-6 md:px-12 pt-12 pb-20">
                {/* Header Sutil */}
                <nav className="flex justify-between items-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                    <span className="text-xl font-bold tracking-[0.3em] uppercase">Chronos</span>
                    <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-widest font-mono opacity-60">
                        <a href="#heritage" className="hover:text-white transition-colors">Heritage</a>
                        <a href="#collection" className="hover:text-white transition-colors">Collection</a>
                        <a href="#experience" className="hover:text-white transition-colors">Experience</a>
                    </div>
                </nav>

                <div className="max-w-[1000px]">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-6xl md:text-[140px] leading-[0.8] font-medium tracking-tighter mb-8">
                            <span className="block opacity-30">TIME IS</span>
                            <KineticText
                                text="EMOTION."
                                as="span"
                                animation="blur"
                                stagger={0.08}
                                className="text-white"
                            />
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1.5 }}
                        className="text-sm md:text-xl max-w-xl font-light leading-relaxed mb-12"
                    >
                        Ingeniería Suiza llevada al límite de la percepción. Más que un instrumento, un testamento de tu propia historia.
                    </motion.p>
                </div>

                <div className="flex justify-between items-end">
                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 }}
                        className="group relative px-10 py-5 bg-white text-black text-[10px] uppercase font-bold tracking-[0.3em] overflow-hidden"
                    >
                        <span className="relative z-10">Explorar Selección</span>
                        <div className="absolute inset-0 bg-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </motion.button>

                    <div className="hidden md:block text-[9px] uppercase tracking-[0.4em] font-mono opacity-30">
                        Scroll to explore [2026]
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: HERITAGE (VELOCITY SCROLL) */}
            <section id="heritage" className="py-32 bg-white/5 backdrop-blur-3xl border-y border-white/5">
                <VelocityScroll
                    text="LEGACY • PRECISION • SWISS MADE • "
                    className="text-white opacity-20 font-black italic"
                    default_velocity={3}
                />
            </section>

            {/* SECCIÓN 3: BENTO COLLECTION */}
            <section id="collection" className="py-40 px-6 container mx-auto">
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">La Colección [V1]</h2>
                    <p className="text-white/40 max-w-md font-light">Cuatro pilares de diseño que definen una era de precisión absoluta.</p>
                </div>

                <BentoGrid className="max-w-7xl mx-auto">
                    <BentoGridItem
                        title="Movimiento Infinito"
                        description="Calibre 9012 con reserva de marcha de 72 horas."
                        header={<div className="h-64 bg-gradient-to-br from-gold-900/40 to-black rounded-xl border border-white/5 flex items-center justify-center text-gold-500/20 text-8xl font-black">72H</div>}
                        className="md:col-span-2 !bg-black/40 !border-white/10"
                    />
                    <BentoGridItem
                        title="Cristal Zafiro"
                        description="Claridad extrema sin reflejos."
                        header={<div className="h-44 bg-blue-900/10 rounded-xl border border-white/5 animate-pulse" />}
                        className="md:col-span-1 !bg-black/40 !border-white/10"
                    />
                    <BentoGridItem
                        title="Titanio Grado 5"
                        description="Resistencia de grado aeroespacial."
                        header={<div className="h-44 bg-zinc-800/40 rounded-xl border border-white/5" />}
                        className="md:col-span-1 !bg-black/40 !border-white/10"
                    />
                    <BentoGridItem
                        title="Ingeniería de Luz"
                        description="Super-LumiNova para legibilidad en la oscuridad absoluta."
                        header={<div className="h-44 bg-gold-500/5 rounded-xl border border-white/5 border-dashed" />}
                        className="md:col-span-2 !bg-black/40 !border-white/10"
                    />
                </BentoGrid>
            </section>

            {/* SECCIÓN 4: TESTIMONIALS (INFINITE CARDS) */}
            <section id="experience" className="py-40 bg-white/5">
                <div className="container mx-auto px-6 mb-20 text-center">
                    <h2 className="text-3xl uppercase tracking-[0.3em] font-light text-gold-500/60 mb-4">Experience</h2>
                    <div className="h-px w-20 bg-gold-500/30 mx-auto" />
                </div>

                <InfiniteMovingCards
                    items={[
                        { quote: "El nivel de detalle en el pulido del titanio es algo que no había visto ni en marcas de 3 veces su precio.", name: "Julian Rossi", title: "Coleccionista" },
                        { quote: "Es el equilibrio perfecto entre una herramienta técnica y una joya arquitectónica.", name: "Sophia Wagner", title: "Diseñadora de Yates" },
                        { quote: "Una declaración de principios en la muñeca. La precisión es simplemente asustadora.", name: "Markus K.", title: "Ingeniero Aeroespacial" },
                    ]}
                    speed="slow"
                    className="!bg-transparent"
                />
            </section>

            {/* FOOTER FINAL */}
            <footer className="py-20 px-6 container mx-auto border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    <div>
                        <span className="text-2xl font-bold tracking-widest uppercase mb-4 block text-gold-500">Chronos</span>
                        <p className="text-[10px] uppercase font-mono tracking-widest text-white/40 leading-relaxed">
                            El tiempo es nuestra materia prima. <br />
                            La emoción es nuestro resultado final.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest font-mono text-white/60">
                        <span className="text-white/30">Explore</span>
                        <a href="#" className="hover:text-gold-500 transition-colors">Manufacture</a>
                        <a href="#" className="hover:text-gold-500 transition-colors">Boutiques</a>
                        <a href="#" className="hover:text-gold-500 transition-colors">Care</a>
                    </div>
                    <div className="flex flex-col gap-4 text-[10px] uppercase tracking-widest font-mono text-white/60">
                        <span className="text-white/30">Legal</span>
                        <a href="#" className="hover:text-gold-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gold-500 transition-colors">Warranty</a>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[8px] uppercase tracking-[0.5em] text-white/20">
                    <span>© 2026 Chronos Heritage Selection</span>
                    <span>Produced by studio hojacero.cl / Santiago</span>
                </div>
            </footer>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease forwards;
                }
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </main>
    );
}
