'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO V5 - "THE PERFECT MERGE"
// 
// Layout: Basado en V2 (Más espacio, tipografía fina)
// Slogan: Híbrido (EN -> ES) pero estilizado como V2
// CTAs: Español, estilo V2 (clean borders)
// ============================================================================

export default function HeroV5() {
    const containerRef = useRef<HTMLDivElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState(false);

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
                {/* TÍTULO PRINCIPAL - Intacto */}
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

                {/* SLOGAN HÍBRIDO - Estilo V2 (Light & Airy) */}
                <div
                    ref={subtitleRef}
                    className="mt-12 cursor-help relative h-20 md:h-24 flex flex-col items-center justify-start group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Versión Inglés (Default) - V2 Style: Light, tracking wide */}
                    <div className={`transition-all duration-500 absolute top-0 left-0 w-full flex flex-col items-center ${isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                        <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto">
                            If your website looks cheap, your business looks cheap.
                        </p>
                        <p className="text-sm italic opacity-50 mt-3 font-serif tracking-widest">
                            We fix that.
                        </p>
                    </div>

                    {/* Versión Español (Hover) - V2 Style */}
                    <div className={`transition-all duration-500 absolute top-0 left-0 w-full flex flex-col items-center ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-accent">
                            Si tu sitio se ve barato, tu negocio se ve barato.
                        </p>
                        <p className="text-sm italic opacity-100 mt-3 font-serif tracking-widest text-white">
                            Nosotros lo arreglamos.
                        </p>
                    </div>
                </div>

                {/* CTAs - Estilo V2 (Clean Borders, More Padding) */}
                <div ref={ctaRef} className="mt-16 flex flex-wrap justify-center gap-8">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="px-10 py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-xs uppercase tracking-[0.2em] font-medium"
                    >
                        Agenda una llamada
                    </a>
                    <a
                        href="#portfolio"
                        className="px-10 py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-xs uppercase tracking-[0.2em] font-medium"
                    >
                        Ver Proyectos
                    </a>
                </div>
            </div>

            {/* STATEMENT TÉCNICO - Minimal V2 Style */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                <p>Spatial UI experiment.</p>
                <p>Santiago / Worldwide</p>
            </div>

            {/* SCROLL INDICATOR - V2 Style (Clean) */}
            <div className="absolute bottom-12 right-6 md:right-12">
                <div
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover-trigger cursor-none group transition-all hover:border-white/30 hover:scale-105"
                >
                    <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity text-white">↓</span>
                </div>
            </div>
        </section>
    );
}
