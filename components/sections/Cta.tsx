'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        <section ref={containerRef} className="h-[80vh] w-full bg-white text-black flex flex-col justify-center items-center relative z-10">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-mono uppercase tracking-widest mb-8 text-gray-500">¿Tienes una visión?</p>

                <div className="overflow-hidden">
                    <h2 ref={textRef} className="text-6xl md:text-9xl font-display font-bold hover:tracking-widest transition-all duration-500 cursor-pointer hover:text-outline-black">
                        LET'S TALK
                    </h2>
                </div>

                <div className="mt-16 flex justify-center gap-12">
                    <a href="mailto:hello@hojacero.com" className="text-xl font-bold uppercase tracking-[0.2em] relative group hover-trigger">
                        Email
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" className="text-xl font-bold uppercase tracking-[0.2em] relative group hover-trigger">
                        Dashboard
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
