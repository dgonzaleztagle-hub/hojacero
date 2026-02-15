'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CTA (V5 FINAL) - "PRODUCCIÓN"
// 
// Links Reales:
// - Opción 1 (Agenda): WhatsApp +56958946617
// - Opción 2 (Cotiza): Email contacto@hojacero.cl
// ============================================================================

export default function Cta() {
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

                {/* Pregunta gancho */}
                <p className="text-sm uppercase tracking-[0.3em] mb-4 text-gray-500">¿Tienes una visión?</p>

                <div className="overflow-hidden">
                    <h2 ref={textRef} className="text-6xl md:text-9xl font-display font-bold hover:tracking-widest transition-all duration-500 cursor-pointer hover:text-outline-black">
                        LET'S TALK
                    </h2>
                </div>

                {/* Cards de Conversión */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                    {/* Opción Rápida - WHATSAPP */}
                    <a
                        href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20estoy%20listo%20para%20empezar."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-8 border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-left rounded-xl overflow-hidden"
                    >
                        <div className="relative z-10">
                            <span className="text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-white/80">Opción 1</span>
                            <h3 className="text-2xl font-bold mt-2 mb-1">Hablemos por WhatsApp</h3>
                            <p className="text-sm text-gray-500 group-hover:text-white/90">Respuesta inmediata · Directo</p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xl">💬</span>
                        </div>
                    </a>

                    {/* Opción Cotización - EMAIL */}
                    <a
                        href="mailto:contacto@hojacero.cl?subject=Solicitud%20de%20Cotizaci%C3%B3n&body=Hola%20HojaCero%2C%0A%0AQuisiera%20cotizar%20un%20proyecto%20de..."
                        className="group relative p-8 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-left rounded-xl overflow-hidden"
                    >
                        <div className="relative z-10">
                            <span className="text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-gray-500">Opción 2</span>
                            <h3 className="text-2xl font-bold mt-2 mb-1">Pídeme una cotización</h3>
                            <p className="text-sm text-gray-500 group-hover:text-gray-300">Respuesta detallada vía Email</p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xl">✉</span>
                        </div>
                    </a>
                </div>


            </div>
        </section>
    );
}
