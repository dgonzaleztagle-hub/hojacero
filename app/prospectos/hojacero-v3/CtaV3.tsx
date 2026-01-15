'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CTA V3 - "CASI ARROGANTE"
// 
// Mensaje provocativo: "Still using that old website?"
// CTAs directos y confiados
// ============================================================================

export default function CtaV3() {
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
        <section ref={containerRef} className="min-h-[80vh] w-full bg-black text-white flex flex-col justify-center items-center relative z-10 py-24">
            <div className="container mx-auto px-6 text-center">

                {/* Provocación */}
                <p className="text-sm uppercase tracking-[0.3em] mb-4 text-gray-500">Still scrolling?</p>
                <p className="text-lg mb-12 text-gray-400 max-w-md mx-auto">
                    Your competitors aren't waiting. Neither should you.
                </p>

                <div className="overflow-hidden">
                    <h2 ref={textRef} className="text-6xl md:text-9xl font-display font-bold hover:tracking-widest transition-all duration-500 cursor-pointer">
                        LET'S GO
                    </h2>
                </div>

                {/* CTAs directos */}
                <div className="mt-16 flex flex-col md:flex-row justify-center gap-6">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="group px-12 py-6 bg-accent text-black text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors"
                    >
                        Upgrade Now
                        <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                    <a
                        href="mailto:hello@hojacero.com?subject=I'm%20ready%20to%20upgrade"
                        className="px-12 py-6 border-2 border-white text-white text-sm uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-colors"
                    >
                        Talk to us
                    </a>
                </div>

                {/* Statement final */}
                <p className="mt-16 text-xs font-mono text-gray-600 max-w-sm mx-auto">
                    We don't do cheap. We don't do templates.<br />
                    We build digital experiences that make money.
                </p>

                <div className="absolute bottom-12 w-full left-0 px-8 flex justify-between text-xs uppercase tracking-widest text-gray-600">
                    <span>© 2026 HOJACERO</span>
                    <span>Premium Digital Studio</span>
                </div>
            </div>
        </section>
    );
}
