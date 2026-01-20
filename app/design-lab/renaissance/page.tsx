"use client";

import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { EditorialReveal, EditorialFlow } from "@/components/fx/EditorialReveal";
import { MagneticButton } from "@/components/fx/MagneticButton";
import Link from "next/link";
import { ArrowLeft, ArrowDown } from "lucide-react";

export default function RenaissancePage() {
    return (
        <div className="relative min-h-[200vh] text-neutral-900 font-serif selection:bg-emerald-900 selection:text-white bg-transparent">

            {/* 1. The Living Atmosphere (WebGL) */}
            <div className="fixed inset-0 z-0">
                <LiquidBackground />
            </div>

            {/* 2. Navigation Layer */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference text-white">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 hover:text-emerald-300 transition-colors font-sans uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Hojo Lab</span>
                </Link>
                <span className="font-sans text-xs font-bold border border-white/20 px-3 py-1 rounded-full uppercase">
                    Renaissance Edition
                </span>
            </nav>

            {/* 3. Hero Section (Layered) */}
            <main className="relative z-10 pt-40 px-8 md:px-16 pb-20">

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end min-h-[60vh]">

                    {/* Title Block */}
                    <div className="lg:col-span-8">
                        <EditorialFlow gap={0.1}>
                            <h1 className="text-[13vw] leading-[0.8] tracking-tighter">
                                Digital
                            </h1>
                            <div className="flex items-center gap-6">
                                <h1 className="text-[13vw] leading-[0.8] tracking-tighter italic text-emerald-900/80">
                                    Rebirth
                                </h1>
                                <div className="hidden md:block w-32 h-1 bg-neutral-900 mt-8" />
                            </div>
                        </EditorialFlow>
                    </div>

                    {/* Description Block */}
                    <div className="lg:col-span-4 font-sans space-y-8 pb-4">
                        <EditorialReveal delay={0.8}>
                            <p className="text-lg leading-relaxed text-neutral-600 font-medium max-w-xs">
                                Donde la tecnología WebGL se encuentra con la estética clásica. Un fondo vivo que respira, capas que flotan y tipografía que pesa.
                            </p>
                        </EditorialReveal>

                        <EditorialReveal delay={1}>
                            <MagneticButton strength={0.3}>
                                <button className="flex items-center gap-3 text-sm uppercase tracking-widest border-b border-neutral-900 pb-1 hover:text-emerald-800 transition-colors">
                                    Explore the collection
                                    <ArrowDown className="w-4 h-4 animate-bounce" />
                                </button>
                            </MagneticButton>
                        </EditorialReveal>
                    </div>
                </div>

                {/* 4. Scroll Context (The "Deep" Part) */}
                <div className="max-w-4xl mx-auto mt-40 space-y-32">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="relative aspect-[3/4] bg-neutral-200 overflow-hidden group">
                            {/* Placeholder for "Classical Art" */}
                            <img
                                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2000&auto=format&fit=crop"
                                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
                                alt="Statue"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <span className="font-sans text-xs uppercase tracking-widest">Figure 01. The Sculpture</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <span className="text-emerald-700 font-sans text-xs uppercase tracking-widest font-bold">The Philosophy</span>
                            <h2 className="text-5xl font-light leading-tight">
                                No es video.<br />Es código.
                            </h2>
                            <p className="text-neutral-600 leading-relaxed font-sans">
                                El fondo que ves no es un video pesado de 20MB. Es un shader matemático de <span className="font-mono text-xs bg-neutral-200 px-1 rounded">2KB</span> que calcula el color de cada pixel 60 veces por segundo.
                                Es infinito, no se repite y responde a la resolución del dispositivo.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
