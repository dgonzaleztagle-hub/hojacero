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

                {/* SUB-SLOGAN ANIMADO */}
                <div className="mt-6 h-6 overflow-hidden relative">
                    <div className="animate-slide-up-fade flex flex-col items-center gap-2">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light opacity-60 text-cyan-200">
                            WEB APPS
                        </p>
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light opacity-60 text-purple-200">
                            MARKETING
                        </p>
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light opacity-60 text-emerald-200">
                            ECOMMERCE
                        </p>
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-light opacity-60 text-amber-200">
                            SOFTWARE
                        </p>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes slide-up-fade {
                        0%, 20% { transform: translateY(0); }
                        25%, 45% { transform: translateY(-33%); }
                        50%, 70% { transform: translateY(-66%); }
                        75%, 95% { transform: translateY(-100%); } // Adjust based on height
                        100% { transform: translateY(0); }
                    }
                    .animate-slide-up-fade {
                        animation: slide-up-fade 8s infinite cubic-bezier(0.4, 0, 0.2, 1);
                    }
                `}</style>


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
