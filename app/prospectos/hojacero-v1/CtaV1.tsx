'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CTA V1 - "TERMINAL PREMIUM"
// 
// Mantiene el "LET'S TALK" pero agrega CTAs funcionales
// Estilo terminal/comando consistente con el hero
// ============================================================================

export default function CtaV1() {
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
                <p className="text-sm font-mono uppercase tracking-widest mb-8 text-gray-500">¿Tienes una visión?</p>

                <div className="overflow-hidden">
                    <h2 ref={textRef} className="text-6xl md:text-9xl font-display font-bold hover:tracking-widest transition-all duration-500 cursor-pointer hover:text-outline-black">
                        LET'S TALK
                    </h2>
                </div>

                {/* NUEVO: Terminal UI de conversión */}
                <div className="mt-16 max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-8 text-left font-mono">
                    <p className="text-gray-400 text-sm mb-4">&gt; Ready to launch?</p>
                    <p className="text-gray-600 text-sm mb-6">&gt; Choose your mission:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="https://cal.com/hojacero"
                            target="_blank"
                            className="group p-6 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-center"
                        >
                            <span className="text-2xl mb-2 block">⚡</span>
                            <span className="font-bold block mb-1">Landing Express</span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-300">Demo en 24 horas</span>
                        </a>
                        <a
                            href="mailto:hello@hojacero.com?subject=Proyecto%20Full%20Product"
                            className="group p-6 border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-center"
                        >
                            <span className="text-2xl mb-2 block">🚀</span>
                            <span className="font-bold block mb-1">Full Product / App</span>
                            <span className="text-xs text-gray-500 group-hover:text-gray-300">Proyecto completo</span>
                        </a>
                    </div>

                    <p className="text-gray-400 text-xs mt-6 text-center">
                        <span className="animate-pulse">▋</span> Respuesta en menos de 24 horas
                    </p>
                </div>

                {/* Links originales mejorados */}
                <div className="mt-16 flex justify-center gap-12">
                    <a
                        href="https://cal.com/hojacero"
                        target="_blank"
                        className="text-xl font-bold uppercase tracking-[0.2em] relative group hover-trigger"
                    >
                        [ Schedule Call ]
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
                    </a>
                    <a href="mailto:hello@hojacero.com" className="text-xl font-bold uppercase tracking-[0.2em] relative group hover-trigger">
                        [ Get a Quote ]
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
                    </a>
                </div>

                <div className="absolute bottom-12 w-full left-0 px-8 flex justify-between text-xs font-mono uppercase tracking-widest text-gray-400">
                    <span>© 2026 HOJACERO</span>
                    <span>SANTIAGO / WORLDWIDE</span>
                </div>
            </div>
        </section>
    );
}
