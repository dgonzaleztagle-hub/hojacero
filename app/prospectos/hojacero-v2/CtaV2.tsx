'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CTA V2 - "MÁS ELEGANTE"
// 
// Mantiene simplicidad extrema
// Sin elementos de terminal, más sofisticado y limpio
// ============================================================================

export default function CtaV2() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1.5, ease: 'power4.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="min-h-[80vh] w-full bg-white text-black flex flex-col justify-center items-center relative z-10 py-24">
            <div className="container mx-auto px-6 text-center">

                {/* Pregunta elegante */}
                <p className="text-sm uppercase tracking-[0.3em] mb-12 text-gray-400">Ready to start?</p>

                <div className="overflow-hidden">
                    <h2 ref={textRef} className="text-6xl md:text-9xl font-display font-bold hover:tracking-widest transition-all duration-500 cursor-pointer hover:text-outline-black">
                        LET'S TALK
                    </h2>
                </div>

                {/* CTAs simples y elegantes */}
                <div className="mt-16 flex flex-col md:flex-row justify-center gap-6">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="px-10 py-5 bg-black text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                    >
                        Schedule a call
                    </a>
                    <a
                        href="mailto:hello@hojacero.com?subject=Quote%20Request"
                        className="px-10 py-5 border-2 border-black text-black text-sm uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                    >
                        Get a quote
                    </a>
                </div>

                {/* Subtexto minimal */}
                <p className="mt-12 text-sm text-gray-400">
                    Response within 24 hours.
                </p>

                <div className="absolute bottom-12 w-full left-0 px-8 flex justify-between text-xs uppercase tracking-widest text-gray-300">
                    <span>© 2026 HOJACERO</span>
                    <span>Santiago / Worldwide</span>
                </div>
            </div>
        </section>
    );
}
