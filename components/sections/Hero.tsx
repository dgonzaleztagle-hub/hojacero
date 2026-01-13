'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

        // Delay slightly to allow Loader to finish (controlled by parent technically, but good to have initial state)
        // Actually, if we mount this after loader, we can start immediately.

        if (title1Ref.current && title2Ref.current) {
            tl.fromTo(title1Ref.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, delay: 0.2 })
                .fromTo(title2Ref.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1 }, '-=1.2');
        }

    }, []);

    return (
        <section ref={containerRef} className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden mix-blend-difference z-10">
            <div className="relative z-10 text-center">
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
            </div>

            <div className="absolute bottom-12 left-6 md:left-12 max-w-xs text-xs md:text-sm font-light uppercase tracking-widest leading-relaxed opacity-60">
                <p>Impacto Inmediato.</p>
                <p>Santiago, Chile / Worldwide</p>
            </div>

            <div className="absolute bottom-12 right-6 md:right-12">
                <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center hover-trigger cursor-none group">
                    <span className="text-[10px] uppercase tracking-widest group-hover:scale-110 transition-transform">Scroll</span>
                </div>
            </div>
        </section>
    );
}
