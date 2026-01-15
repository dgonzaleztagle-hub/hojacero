'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// HERO V3 - "CASI ARROGANTE"
// 
// Copy principal: "If your website looks cheap, your business looks cheap."
// Microcopy: "We fix that."
// CTAs: [ Upgrade my brand ]  [ Build something real ]
// Estilo: Provocativo, confiado, memorable
// ============================================================================

export default function HeroV3() {
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

                {/* PROVOCATIVO: Mensaje directo */}
                <div ref={subtitleRef} className="mt-10 space-y-3">
                    <p className="text-xl md:text-3xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                        If your website looks cheap,<br />
                        <span className="font-semibold">your business looks cheap.</span>
                    </p>
                    <p className="text-lg md:text-xl italic opacity-70 text-accent">
                        We fix that.
                    </p>
                </div>

                {/* CTAs provocativos */}
                <div ref={ctaRef} className="mt-14 flex flex-wrap justify-center gap-6">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="group px-8 py-4 bg-white text-black text-sm uppercase tracking-[0.15em] font-bold hover:bg-accent hover:text-black transition-all duration-300"
                    >
                        Upgrade my brand
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                    <a
                        href="mailto:hello@hojacero.com?subject=Let's%20build%20something%20real"
                        className="px-8 py-4 border-2 border-white text-white text-sm uppercase tracking-[0.15em] font-bold hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Build something real
                    </a>
                </div>

                {/* Mini statement */}
                <p className="mt-8 text-xs font-mono opacity-30">
                    No templates. No shortcuts. Just premium work.
                </p>
            </div>

            {/* Texto inferior izquierdo - statement */}
            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-xs font-light uppercase tracking-widest leading-relaxed opacity-40">
                <p className="text-accent">Design that demands respect.</p>
                <p>Santiago / Worldwide</p>
            </div>

            {/* Scroll minimal */}
            <div className="absolute bottom-12 right-6 md:right-12">
                <div
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover-trigger cursor-none group transition-all hover:border-accent hover:scale-110"
                >
                    <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">↓</span>
                </div>
            </div>
        </section>
    );
}
