'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO V2 - "MÁS ELEGANTE / MENOS TEXTO"
// 
// Copy principal: "Premium websites & apps for brands who care about aesthetics."
// Microcopy: "From concept to deploy."
// CTAs: [ Schedule a call ]  [ Get a quote ]
// Estilo: Ultra limpio, sofisticado, espacioso
// ============================================================================

export default function HeroV2() {
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

                {/* Subtítulo elegante - minimal */}
                <div ref={subtitleRef} className="mt-10 space-y-2">
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-xl mx-auto">
                        Premium websites & apps for brands who care about aesthetics.
                    </p>
                    <p className="text-sm italic opacity-50">
                        From concept to deploy.
                    </p>
                </div>

                {/* CTAs elegantes - sin corchetes, más suaves */}
                <div ref={ctaRef} className="mt-14 flex flex-wrap justify-center gap-6">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="px-8 py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-sm uppercase tracking-[0.15em] font-light"
                    >
                        Schedule a call
                    </a>
                    <a
                        href="mailto:hello@hojacero.com?subject=Quote%20Request"
                        className="px-8 py-4 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-500 text-sm uppercase tracking-[0.15em] font-light"
                    >
                        Get a quote
                    </a>
                </div>
            </div>

            {/* Texto inferior izquierdo - minimal */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-xs font-light uppercase tracking-widest leading-relaxed opacity-40">
                <p>Design studio</p>
                <p>Santiago / Worldwide</p>
            </div>

            {/* Scroll indicator - sin texto extra */}
            <div className="absolute bottom-12 right-6 md:right-12">
                <div
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center hover-trigger cursor-none group transition-all hover:border-white/30 hover:scale-110"
                >
                    <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">↓</span>
                </div>
            </div>
        </section>
    );
}
