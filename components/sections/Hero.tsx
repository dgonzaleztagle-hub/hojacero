'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

        if (subtitleRef.current && ctaRef.current) {
            // Title is now static on load as requested
            tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2 })
                .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.6');
        }

    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden mix-blend-difference z-10">
            <div className="relative z-10 text-center flex flex-col items-center">
                {/* TÍTULO PRINCIPAL - Ahora con Imagen Híbrida */}
                {/* 
                <h1 className="leading-[0.8]">
                    <span className="block text-[15vw] uppercase font-bold font-display tracking-tighter">
                        HOJA
                    </span>
                    <span className="block text-[15vw] uppercase font-bold font-display tracking-tighter text-outline-accent hover:text-accent transition-colors duration-500 cursor-none">
                        CERO_
                    </span>
                </h1> 
                */}

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative px-6"
                >
                    <img
                        src="/logo-h0-hybrid-no-text.png"
                        alt="HojaCero Architects"
                        className="w-[85vw] md:w-[65vw] max-w-5xl h-auto object-contain drop-shadow-[0_0_60px_rgba(0,183,255,0.2)]"
                    />
                </motion.div>

                {/* SLOGAN - Architects of Digital Experiences - Ajustado para que respire con el logo */}
                <div
                    ref={subtitleRef}
                    className="mt-6 md:mt-10 cursor-help relative h-8 md:h-12 w-full flex justify-center group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Versión Inglés (Default) */}
                    <p className={`transition-all duration-500 absolute top-0 text-xs sm:text-lg md:text-3xl font-light tracking-[0.1em] md:tracking-[0.15em] uppercase w-full text-center px-4 ${isHovered ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
                        Architects of Digital Experiences
                    </p>

                    {/* Versión Español (Hover) */}
                    <p className={`transition-all duration-500 absolute top-0 text-xs sm:text-lg md:text-3xl font-light tracking-[0.1em] md:tracking-[0.15em] uppercase text-accent w-full text-center px-4 ${isHovered ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'}`}>
                        Arquitectos de Experiencias Digitales
                    </p>
                </div>

                {/* SUB-SLOGAN STATIC - Clean & Premium */}
                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 w-full">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-zinc-400">
                        WEB
                    </p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-zinc-500 hidden md:block">•</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-cyan-200">
                        WEB APPS
                    </p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-zinc-500 hidden md:block">•</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-emerald-200">
                        ECOMMERCE
                    </p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-zinc-500 hidden md:block">•</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light text-purple-200">
                        MARKETING
                    </p>
                </div>


                {/* CTAs - Estilo V2 */}
                <div ref={ctaRef} className="mt-16 flex flex-wrap justify-center gap-8">
                    <a
                        href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20agendar%20una%20reuni%C3%B3n."
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

            {/* STATEMENT TÉCNICO & CONTACTO */}
            <div className="absolute bottom-8 left-6 md:left-12 flex flex-col gap-4 z-20">
                <div className="max-w-xs text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <p>Spatial UI experiment.</p>
                    <p>Santiago / Worldwide</p>
                    <a href="mailto:contacto@hojacero.cl" className="hover:text-cyan-400 mt-1 block decoration-dotted underline underline-offset-4 transition-colors">
                        contacto@hojacero.cl
                    </a>
                    <a href="tel:+56958946617" className="hover:text-green-400 block mt-0.5">
                        +56 9 5894 6617
                    </a>
                </div>

                {/* SOCIAL DOCK */}
                <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                    <a href="https://www.instagram.com/hojacero.cl" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                    </a>
                    <a href="https://www.linkedin.com/company/hojacero" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                    </a>
                    <a href="https://www.facebook.com/share/1TyKsQC3GJ/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </a>
                    <a href="https://wa.me/56958946617" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 hover:scale-110 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>
                    </a>
                </div>
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
