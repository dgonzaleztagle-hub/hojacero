'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO V1 - "TERMINAL PREMIUM"
// 
// Copy principal: "Design that looks expensive. Engineering that performs."
// Microcopy: "Web / Apps / Branding / Marketing — built with taste, speed and intent."
// CTAs tipo terminal: [ Book a 15-min Call ]  [ Launch a Premium Landing ]
// Mini UI comando: > Choose your mission:
// ============================================================================

export default function HeroV1() {
    const containerRef = useRef<HTMLDivElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

        if (title1Ref.current && title2Ref.current && subtitleRef.current && ctaRef.current) {
            tl.fromTo(title1Ref.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, delay: 0.2 })
                .fromTo(title2Ref.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1 }, '-=1.2')
                .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.8')
                .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.6');
        }

    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden mix-blend-difference z-10">
            <div className="relative z-10 text-center">
                {/* TÍTULO PRINCIPAL - Sin cambios */}
                <div className="overflow-hidden">
                    <h1 ref={title1Ref} className="text-[15vw] leading-[0.8] uppercase font-bold font-display tracking-tighter">
                        HOJA
                    </h1>
                </div>
                <div className="overflow-hidden">
                    <h1 ref={title2Ref} className="text-[15vw] leading-[0.8] uppercase font-bold font-display tracking-tighter text-outline-accent hover:text-accent transition-colors duration-500 cursor-none">
                        CERO_
                    </h1>
                </div>

                {/* NUEVO: Subtítulo + Promesa de valor */}
                <div ref={subtitleRef} className="mt-8 space-y-3">
                    <p className="text-lg md:text-2xl font-light tracking-wide">
                        Design that looks expensive. Engineering that performs.
                    </p>
                    <p className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] opacity-50">
                        Web / Apps / Branding / Marketing — built with taste, speed and intent.
                    </p>
                </div>

                {/* NUEVO: CTAs tipo terminal */}
                <div ref={ctaRef} className="mt-12 flex flex-col items-center gap-6">
                    {/* Botones principales - estilo terminal */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://cal.com/hojacero"
                            target="_blank"
                            className="group px-6 py-3 border border-white/30 hover:border-accent hover:text-accent transition-all duration-300 font-mono text-sm tracking-wider"
                        >
                            <span className="opacity-50 group-hover:opacity-100">[</span>
                            <span className="mx-2">Book a 15-min Call</span>
                            <span className="opacity-50 group-hover:opacity-100">]</span>
                        </a>
                        <a
                            href="#services"
                            className="group px-6 py-3 border border-white/30 hover:border-accent hover:text-accent transition-all duration-300 font-mono text-sm tracking-wider"
                        >
                            <span className="opacity-50 group-hover:opacity-100">[</span>
                            <span className="mx-2">Launch a Premium Landing</span>
                            <span className="opacity-50 group-hover:opacity-100">]</span>
                        </a>
                    </div>

                    {/* Mini UI tipo comando */}
                    <div className="mt-4 font-mono text-xs opacity-40 hover:opacity-70 transition-opacity">
                        <p className="text-accent">&gt; Choose your mission:</p>
                        <div className="flex gap-4 mt-2">
                            <span className="hover:text-accent cursor-pointer transition-colors">[ Landing Express 24h ]</span>
                            <span className="hover:text-accent cursor-pointer transition-colors">[ Full Product / App ]</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Texto inferior izquierdo - MODIFICADO */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-xs md:text-sm font-light uppercase tracking-widest leading-relaxed opacity-60">
                <p className="font-mono text-accent/80">Spatial UI experiment.</p>
                <p>Santiago, Chile / Worldwide</p>
            </div>

            {/* Scroll indicator con CTA alternativo */}
            <div className="absolute bottom-12 right-6 md:right-12 text-right">
                <div className="flex flex-col items-end gap-3">
                    <div
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center hover-trigger cursor-none group transition-colors hover:border-white/50"
                    >
                        <span className="text-[10px] uppercase tracking-widest group-hover:scale-110 transition-transform">Scroll</span>
                    </div>
                    <p className="text-[10px] font-mono opacity-40">
                        or skip: <a href="#cta" className="underline hover:text-accent transition-colors">[Get a quote]</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
