"use client";

import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { EditorialReveal, EditorialFlow } from "@/components/fx/EditorialReveal";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { ParallaxBentoGrid, ParallaxBentoItem } from "@/components/fx/ParallaxBento";
import { StaggerItem } from "@/components/fx/CinematicStagger";
import Link from "next/link";
import { ArrowLeft, ArrowDown, ExternalLink } from "lucide-react";

export default function GoldenMasterPage() {
    return (
        <div className="relative min-h-[300vh] text-neutral-900 font-serif selection:bg-indigo-500/30 bg-transparent">

            {/* 1. LAYER 0: The Atmosphere (Custom Color Palette) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Using a cooler, 'Deep Tech' palette for this master: Slate/Blue */}
                <LiquidBackground colorA="#0f172a" colorB="#1e1b4b" />
            </div>

            {/* 2. LAYER 1: UI Chrome */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 text-white mix-blend-difference">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 hover:text-indigo-300 transition-colors font-sans uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Hojo Lab</span>
                </Link>
                <MagneticButton strength={0.2}>
                    <span className="font-sans text-xs font-bold border border-white/20 px-4 py-2 rounded-full uppercase bg-white/5 backdrop-blur-md">
                        Golden Master
                    </span>
                </MagneticButton>
            </nav>

            <main className="relative z-10 px-6 md:px-12 pt-32 pb-32">

                {/* SECTION 1: The Hook */}
                <div className="min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto">
                    <div className="border-l border-white/20 pl-8 md:pl-12">
                        <EditorialFlow gap={0.15}>
                            <h1 className="text-[10vw] leading-[0.8] tracking-tighter text-white">
                                Digital
                            </h1>
                            <h1 className="text-[10vw] leading-[0.8] tracking-tighter text-indigo-200 italic">
                                Alchemy
                            </h1>
                            <h1 className="text-[10vw] leading-[0.8] tracking-tighter text-white">
                                Project
                            </h1>
                        </EditorialFlow>
                    </div>

                    <div className="w-full md:w-1/3 ml-auto mt-16 font-sans text-white/80 pr-8">
                        <EditorialReveal delay={0.8}>
                            <p className="text-lg leading-relaxed mb-8">
                                La fusión definitiva de ingeniería y arte.
                                Un entorno donde el código 3D, las físicas de interacción y la narrativa editorial convergen en una sola experiencia fluida.
                            </p>
                            <MagneticButton strength={0.3}>
                                <button className="group flex items-center gap-3 text-sm uppercase tracking-widest bg-white text-black px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors">
                                    Start Journey
                                    <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                </button>
                            </MagneticButton>
                        </EditorialReveal>
                    </div>
                </div>

                {/* SECTION 2: The Flow (Parallax Bento) */}
                <div className="py-32 max-w-[1600px] mx-auto">
                    <div className="mb-24 flex items-end justify-between px-4 border-b border-white/10 pb-8">
                        <h2 className="text-4xl text-white font-light">Selected Works</h2>
                        <span className="text-white/40 font-mono text-sm">2024 — 2026</span>
                    </div>

                    <ParallaxBentoGrid>
                        {/* Large Featured Item */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-8 h-[600px]">
                            <ParallaxBentoItem
                                src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop"
                                title="Urban Architecture"
                                subtitle="Tokyo, Japan"
                                parallaxSpeed={-0.1} // Moves slightly UP
                                className="h-full"
                            />
                        </div>

                        {/* Tall Side Item */}
                        <div className="col-span-1 md:col-span-6 lg:col-span-4 h-[600px] mt-24">
                            <ParallaxBentoItem
                                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"
                                title="Neon Nights"
                                subtitle="Cyberpunk Aesthetic"
                                parallaxSpeed={0.15} // Moves DOWN faster
                                className="h-full"
                            />
                        </div>

                        {/* Wide Bottom Item */}
                        <div className="col-span-1 md:col-span-12 h-[500px]">
                            <ParallaxBentoItem
                                src="https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2000&auto=format&fit=crop"
                                title="Zen Minimalism"
                                subtitle="Essential Living"
                                parallaxSpeed={0.05}
                                className="h-full"
                            />
                        </div>
                    </ParallaxBentoGrid>
                </div>

                {/* SECTION 3: The Feel (Footer) */}
                <div className="min-h-[50vh] flex items-center justify-center border-t border-white/10 mt-20">
                    <MagneticButton strength={0.5}>
                        <a href="#" className="text-[8vw] text-white font-serif hover:text-indigo-300 transition-colors leading-none text-center block group">
                            Next Project
                            <span className="block text-2xl font-sans text-white/40 mt-4 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                                (HojaCero Factory)
                            </span>
                        </a>
                    </MagneticButton>
                </div>

            </main>
        </div>
    );
}
