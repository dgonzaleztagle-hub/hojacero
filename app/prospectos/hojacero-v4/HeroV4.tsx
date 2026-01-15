'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from '@/components/ui/TextScramble';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO V4 - "THE STATEMENT"
// 
// Slogan Híbrido: EN -> ES on Hover
// Statement: "Spatial UI experiment"
// CTAs: Español, claros, conversión.
// ============================================================================

export default function HeroV4() {
    const containerRef = useRef<HTMLDivElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    // Estado para el hover del slogan
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

                {/* SLOGAN HÍBRIDO (EN -> ES) */}
                <div
                    ref={subtitleRef}
                    className="mt-10 cursor-help relative h-20 md:h-24 flex flex-col items-center justify-center group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Versión Inglés (Default) */}
                    <div className={`transition-opacity duration-300 absolute top-0 left-0 w-full flex flex-col items-center ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="text-xl md:text-3xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
                            If your website looks cheap,<br />
                            <span className="font-semibold text-white">your business looks cheap.</span>
                        </p>
                        <p className="text-lg md:text-xl italic opacity-50 mt-2">
                            We fix that.
                        </p>
                    </div>

                    {/* Versión Español (Hover) */}
                    <div className={`transition-opacity duration-300 absolute top-0 left-0 w-full flex flex-col items-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <p className="text-xl md:text-3xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed text-accent">
                            Si tu sitio se ve barato,<br />
                            <span className="font-semibold">tu negocio se ve barato.</span>
                        </p>
                        <p className="text-lg md:text-xl italic opacity-100 mt-2 text-white">
                            Nosotros lo arreglamos.
                        </p>
                    </div>
                </div>

                {/* CTAs en ESPAÑOL (Conversión) */}
                <div ref={ctaRef} className="mt-8 flex flex-wrap justify-center gap-6">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="group px-8 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] font-bold hover:bg-accent hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)]"
                    >
                        Agenda una llamada
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                    <a
                        href="#portfolio"
                        className="px-8 py-4 border-2 border-white/30 text-white text-sm uppercase tracking-[0.15em] font-bold hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Ver Proyectos
                    </a>
                </div>
            </div>

            {/* STATEMENT TÉCNICO V4 (Confirmado por usuario) */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-xs font-mono uppercase tracking-widest leading-relaxed opacity-60 hover:opacity-100 transition-opacity">
                <p className="text-accent">Spatial UI experiment.</p>
                <p className="text-[10px] opacity-70">Interactive WebGL Core</p>
            </div>

            {/* SCROLL INDICATOR CLEAN */}
            <div className="absolute bottom-12 right-6 md:right-12">
                <div
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover-trigger cursor-none group transition-all hover:border-accent hover:scale-110"
                >
                    <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity text-accent">↓</span>
                </div>
            </div>
        </section>
    );
}
