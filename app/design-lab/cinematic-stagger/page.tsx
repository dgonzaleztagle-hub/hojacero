"use client";

import { StaggerContainer, StaggerItem } from "@/components/fx/CinematicStagger";
import Link from "next/link";
import { ArrowLeft, RefreshCw, LayoutGrid, Image as ImageIcon, Box } from "lucide-react";
import { useState } from "react";

export default function CinematicStaggerPage() {
    const [key, setKey] = useState(0);

    const features = [
        { title: "Smart Grids", icon: LayoutGrid, desc: "Alineación automática inteligente." },
        { title: "Fluid Media", icon: ImageIcon, desc: "Imágenes que respiran con el scroll." },
        { title: "3D Assets", icon: Box, desc: "Modelos optimizados para web." },
        { title: "Deep Analytics", icon: LayoutGrid, desc: "Datos que cuentan historias." },
        { title: "Global CDN", icon: ImageIcon, desc: "Entrega instantánea mundial." },
        { title: "Zero Config", icon: Box, desc: "Despliegue sin dolor de cabeza." },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans">
            <nav className="p-8 pb-0 flex justify-between items-center z-50">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al Lab</span>
                </Link>
                <button
                    onClick={() => setKey(k => k + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 hover:bg-neutral-800 bg-neutral-900/50 backdrop-blur text-xs font-medium text-neutral-400"
                >
                    <RefreshCw className="w-3 h-3" />
                    Replay
                </button>
            </nav>

            <main key={key} className="flex-1 flex flex-col items-center justify-center p-8 gap-16 max-w-7xl mx-auto w-full">

                {/* Header Section */}
                <div className="text-center max-w-2xl">
                    <StaggerContainer>
                        <StaggerItem>
                            <span className="text-emerald-500 font-medium tracking-wider text-sm uppercase mb-4 block">
                                Design Lab / Exp 02
                            </span>
                        </StaggerItem>
                        <StaggerItem>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                                Cinematic Stagger
                            </h1>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="text-xl text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
                                El secreto del orden visual. Controla cómo el ojo percibe la densidad de información mediante micro-retrasos orquestados.
                            </p>
                        </StaggerItem>
                    </StaggerContainer>
                </div>

                {/* The Grid Demo */}
                <StaggerContainer
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                    delay={0.2} // Wait for header to finish a bit
                    staggerBase={0.1}
                >
                    {features.map((feature, i) => (
                        <StaggerItem key={i} className="group h-full">
                            <div className="h-full bg-neutral-900/40 border border-neutral-800/60 p-8 rounded-3xl hover:bg-neutral-800/60 transition-colors duration-500 flex flex-col items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent flex items-center justify-center border border-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                                    <feature.icon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-neutral-200 mb-2">{feature.title}</h3>
                                    <p className="text-neutral-500 leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

            </main>
        </div>
    );
}
