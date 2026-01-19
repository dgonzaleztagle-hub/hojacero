'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO (V5 FINAL) - "THE PERFECT MERGE"
// 
// Layout: Basado en V2 (Más espacio, tipografía fina)
// Slogan: Híbrido (EN -> ES) pero estilizado como V2
// CTAs: Español, estilo V2 (clean borders)
// ============================================================================

export default function Hero() {
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
                {/* TÍTULO PRINCIPAL */}
                <h1 className="overflow-hidden">
                    <span ref={title1Ref} className="block text-[15vw] leading-[0.8] uppercase font-bold font-display tracking-tighter">
                        HOJA
                    </span>
                    <span ref={title2Ref} className="block text-[15vw] leading-[0.8] uppercase font-bold font-display tracking-tighter text-outline-accent hover:text-accent transition-colors duration-500 cursor-none">
                        CERO_
                    </span>
                </h1>

                {/* SLOGAN - Architects of Digital Experiences */}
                <div
                    ref={subtitleRef}
                    className="mt-12 cursor-help relative h-16 md:h-20 flex flex-col items-center justify-start group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    role="text"
                    aria-label="Architects of Digital Experiences - Arquitectos de Experiencias Digitales"
                >
                    {/* Versión Inglés (Default) */}
                    <p className={`transition-all duration-500 absolute top-0 left-0 w-full text-xl md:text-3xl font-light tracking-[0.15em] uppercase ${isHovered ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
                        Architects of Digital Experiences
                    </p>

                    {/* Versión Español (Hover) */}
                    <p className={`transition-all duration-500 absolute top-0 left-0 w-full text-xl md:text-3xl font-light tracking-[0.15em] uppercase text-accent ${isHovered ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}`}>
                        Arquitectos de Experiencias Digitales
                    </p>
                </div>

                {/* SUB-SLOGAN */}
                <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.3em] font-light opacity-60 animate-pulse">
                    web apps • mkt
                </p>

                {/* CTAs - Estilo V2 */}
                <div ref={ctaRef} className="mt-16 flex flex-wrap justify-center gap-8">
                    <a
                        href="https://wa.me/56972739105?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20agendar%20una%20reuni%C3%B3n."
                        target="_blank"
                        rel="noopener noreferrer"
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

            {/* STATEMENT TÉCNICO */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex flex-col gap-1">
                <p>Spatial UI experiment.</p>
                <p>Santiago / Worldwide</p>
                <a href="mailto:contacto@hojacero.cl" className="hover:text-accent mt-1 block decoration-dotted underline underline-offset-4">
                    contacto@hojacero.cl
                </a>
            </div>

            {/* SCROLL INDICATOR */}
            <div className="absolute bottom-12 right-6 md:right-12">
                <button
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    aria-label="Scroll hacia servicios"
                    className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover-trigger cursor-none group transition-all hover:border-white/30 hover:scale-105 bg-transparent"
                >
                    <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity text-white" aria-hidden="true">↓</span>
                </button>
            </div>
        </section>
    );
}
