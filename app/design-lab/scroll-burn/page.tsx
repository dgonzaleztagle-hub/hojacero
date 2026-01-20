"use client";

import { BurningPaper } from "@/components/fx/BurningPaper";
import { LiquidBackground } from "@/components/fx/LiquidBackground";
import { EditorialReveal } from "@/components/fx/EditorialReveal";
import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";

export default function ScrollBurnPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // This translates the paper content UP as we scroll down, mimicking natural scroll
    // while the container stays fixed to allow the burning effect to happen in-place.
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Map scroll to burn.
        // Start burning immediately but map 0-1 scroll to 0-1.2 burn (to fully consume)
        const burnProgress = latest * 1.5;
        progressRef.current = Math.min(1.2, Math.max(0, burnProgress));
    });

    return (
        <div ref={containerRef} className="relative h-[250vh] bg-neutral-900 font-serif">

            {/* 1. FIXED BACKGROUND LAYER (The Reveal) */}
            {/* Stays put while the paper burns away "on top" of it */}
            <div className="fixed inset-0 z-0 flex flex-col items-center justify-center bg-[#1a1a1a] text-white">
                <LiquidBackground colorA="#1a1a1a" colorB="#2d2d2d" />

                <div className="relative z-10 max-w-2xl text-center p-8">
                    <motion.div style={{ opacity: scrollYProgress }}>
                        <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest mb-4 block">
                            Transformed State
                        </span>
                        <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-8">
                            Alchemy
                        </h1>
                        <p className="text-xl font-sans text-neutral-400 leading-relaxed">
                            The paper has been consumed. <br />
                            Only the essence remains.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* 2. SCROLLABLE PAPER LAYER (The 'Page') */}
            {/* 
          We use a sticky container to keep the shader covering the screen,
          but we animate the INNER content to simulate movement.
      */}

            <div className="relative z-10 w-full min-h-screen pointer-events-none">
                <div className="sticky top-0 h-screen w-full overflow-hidden">

                    {/* The Shader Canvas (The Paper Texture) handles the dissolve */}
                    <BurningPaper
                        src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2000&auto=format&fit=crop"
                        progressRef={progressRef}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* The Content ON the paper (Moves with scroll to simulate "page going down") */}
                    <motion.div
                        style={{ y }}
                        className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-center"
                    >
                        <div className="max-w-2xl p-12 bg-white/5 backdrop-blur-sm border border-neutral-900/10 shadow-2xl">
                            <EditorialReveal>
                                <h2 className="text-5xl md:text-7xl font-medium text-neutral-900 mb-6 tracking-tight">
                                    The Manifesto
                                </h2>
                            </EditorialReveal>

                            <EditorialReveal delay={0.2}>
                                <div className="text-lg md:text-xl font-sans text-neutral-800 space-y-6 leading-relaxed text-justify">
                                    <p>
                                        <strong>Scroll to destroy.</strong> This document is transient.
                                        As you read further, the medium itself begins to disintegrate.
                                    </p>
                                    <p>
                                        Unlike a standard fade, the "Burning Paper" effect uses a dissolve shader
                                        driven by Perlin noise. The fire eats the edges precisely where the alpha threshold cuts.
                                    </p>
                                    <p>
                                        Keep scrolling. Watch the edges. feel the heat.
                                    </p>
                                </div>
                            </EditorialReveal>

                            <div className="mt-12 flex justify-center">
                                <ArrowDown className="w-6 h-6 text-neutral-900 animate-bounce" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference text-white">
                <Link
                    href="/design-lab"
                    className="inline-flex items-center gap-2 hover:text-orange-300 transition-colors font-sans uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Lab</span>
                </Link>
                <span className="font-sans text-xs font-bold border border-white/20 px-3 py-1 rounded-full uppercase">
                    Interactive Scroll Burn
                </span>
            </nav>

        </div>
    );
}
