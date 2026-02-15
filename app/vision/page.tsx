'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CASES } from './data';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// VISION SHOWCASE — AWWWARDS LEVEL EXPERIENCE
// ============================================================================

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
);

export default function VisionPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            // =============================================
            // DESKTOP: FULL 3D EXPERIENCE
            // =============================================
            const layers = document.querySelectorAll('.parallax-layer');
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const xPos = (clientX / window.innerWidth - 0.5) * 2;
                const yPos = (clientY / window.innerHeight - 0.5) * 2;

                layers.forEach((layer) => {
                    const depth = parseFloat(layer.getAttribute('data-depth') || '0');
                    gsap.to(layer, {
                        x: xPos * depth * 30,
                        y: yPos * depth * 30,
                        duration: 1.5,
                        ease: 'power2.out'
                    });
                });
            };
            window.addEventListener('mousemove', handleMouseMove);

            const heroTi = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "+=250%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            heroTi.to('.layer-fg', { scale: 3.5, z: 800, opacity: 0, filter: 'blur(50px)', duration: 1.2, ease: 'power2.in' }, 0);
            heroTi.to('.layer-text', { scale: 2.2, z: 400, opacity: 0, filter: 'blur(20px)', duration: 1.2, ease: 'power2.in' }, 0.2);
            heroTi.to('.layer-mid', { opacity: 0, duration: 1, ease: 'power2.in' }, 0.3);
            heroTi.to('.layer-bg', { opacity: 1, scale: 1, filter: 'grayscale(0) blur(0px)', duration: 1.2, ease: 'power2.out' }, 0.5);
            heroTi.to({}, { duration: 0.8 });

            return () => window.removeEventListener('mousemove', handleMouseMove);
        });

        mm.add("(max-width: 767px)", () => {
            // =============================================
            // MOBILE: FLUID & PERFORMANCE OPTIMIZED
            // =============================================
            const heroTi = gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "+=120%", // Más corto en móvil para evitar fatiga
                    pin: true,
                    scrub: 1,
                }
            });

            // Usamos Y-Parallax en lugar de Z-Zoom (Mejor para GPU móvil)
            heroTi.to('.layer-fg', { y: -200, opacity: 0, duration: 1 }, 0);
            heroTi.to('.layer-text', { y: -100, scale: 1.5, opacity: 0, duration: 1 }, 0.1);
            heroTi.to('.layer-mid', { opacity: 0, duration: 1 }, 0.2);
            heroTi.to('.layer-bg', { opacity: 1, scale: 1, duration: 1 }, 0.3);
        });

        // SHARED LOGIC: STACKING (Works on both, but we can refine)
        const cards = gsap.utils.toArray('.project-card') as HTMLElement[];
        cards.forEach((card, i) => {
            gsap.set(card, { zIndex: i + 10 });
            ScrollTrigger.create({
                trigger: card,
                start: 'top 5%',
                endTrigger: cardsContainerRef.current,
                end: 'bottom bottom',
                pin: true,
                pinSpacing: false,
                scrub: true,
            });

            if (i < cards.length - 1) {
                const nextCard = cards[i + 1];
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: nextCard,
                        start: 'top 85%',
                        end: 'top 5%',
                        scrub: true,
                    },
                    scale: 0.94,
                    opacity: 0.2,
                    filter: window.innerWidth > 768 ? 'blur(10px)' : 'none', // Quitamos blur en móvil
                    y: -40,
                    ease: 'none'
                });
            }
        });

        return () => mm.revert();
    }, []);

    return (
        <>
            <CustomCursor />
            <NoiseOverlay />

            <main ref={containerRef} className="relative bg-[#050505] text-white">
                <Navbar />

                {/* ═══════════════════════════════════════════ */}
                {/* HERO — 3D DEPTH EXPERIENCE                  */}
                {/* ═══════════════════════════════════════════ */}
                <section
                    ref={heroRef}
                    className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
                    style={{ perspective: '1200px' }}
                >
                    {/* Layer 0: Deep Background (Nebula) */}
                    <div className="parallax-layer layer-bg absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]" data-depth="0.1">
                        <Image
                            src="/hero-vision/vision_bg.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-60 grayscale-[0.2]"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Layer 1: Midground (Atmospheric Details) */}
                    <div className="parallax-layer layer-mid absolute inset-0 w-[125%] h-[125%] -left-[12.5%] -top-[12.5%]" data-depth="0.25">
                        <Image
                            src="/hero-vision/vision_mid.png"
                            alt="Midground"
                            fill
                            className="object-cover opacity-70 mix-blend-screen brightness-125 saturate-150"
                        />
                    </div>

                    {/* Layer 2: VISION INDEX (The core focus) */}
                    <div className="parallax-layer layer-text relative z-10 text-center" data-depth="0.5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        >
                            <h1 className="font-display font-bold text-[clamp(4rem,18vw,16rem)] leading-[0.8] tracking-[-0.05em] uppercase select-none">
                                VISION<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                    _INDEX
                                </span>
                            </h1>
                            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.8em] text-zinc-500">
                                {CASES.length} Proyectos • 0 Plantillas • 2026
                            </p>
                        </motion.div>
                    </div>

                    {/* Layer 3: Foreground (Blurred focus elements) */}
                    <div className="parallax-layer layer-fg absolute inset-0 w-[150%] h-[150%] -left-[25%] -top-[25%] pointer-events-none" data-depth="0.9">
                        <div className="relative w-full h-full grayscale brightness-150">
                            <Image
                                src="/hero-vision/vision_fg.png"
                                alt="Foreground"
                                fill
                                className="object-cover opacity-30 mix-blend-plus-lighter blur-[12px] scale-110"
                            />
                        </div>
                    </div>

                    {/* Scroll Hint */}
                    <div className="absolute bottom-12 flex flex-col items-center gap-4 z-20">
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-600">Explore the work</span>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* PROJECT SHOWCASE — STICKY DECK              */}
                {/* ═══════════════════════════════════════════ */}
                <section ref={cardsContainerRef} className="relative px-6">
                    <div className="container mx-auto space-y-0">
                        {CASES.map((item, i) => (
                            <div
                                key={item.id}
                                className="project-card sticky top-0 h-screen flex items-center justify-center py-20"
                            >
                                <Link
                                    href={item.viewUrl}
                                    className="relative w-full max-w-7xl h-[85vh] rounded-[2.5rem] border border-white/[0.08] bg-zinc-900/50 backdrop-blur-3xl overflow-hidden flex flex-col md:flex-row group cursor-pointer block"
                                    style={{
                                        boxShadow: `0 30px 100px -20px rgba(0,0,0,0.5)`,
                                    }}
                                >
                                    {/* Project Info (Left) */}
                                    <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="flex items-center gap-4 mb-10 overflow-hidden">
                                                <span className="text-zinc-600 font-mono text-sm">0{i + 1}</span>
                                                <div className="w-10 h-[1px] bg-zinc-800" />
                                                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">HojaCero • {item.year}</span>
                                            </div>

                                            <h2 className="text-6xl md:text-8xl font-display font-bold leading-[0.85] tracking-tighter mb-8 group-hover:translate-x-2 transition-transform duration-500">
                                                {item.client}
                                            </h2>

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {item.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="text-lg text-zinc-400 font-light max-w-sm leading-relaxed mb-12">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="inline-flex items-center gap-6 group/link">
                                            <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-all duration-300">
                                                <span className="text-2xl mt-[-4px]">↗</span>
                                            </div>
                                            <span className="font-display text-xl font-medium tracking-tight overflow-hidden">
                                                Ver proyecto completo
                                                <div className="h-[1px] w-full bg-white/20 mt-1 group-hover/link:translate-x-0 -translate-x-full transition-transform duration-500" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Visual Frame (Right) */}
                                    <div className="md:w-1/2 relative bg-zinc-950/50 p-6 md:p-12">
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors duration-500">
                                            {/* Accent Glow */}
                                            <div
                                                className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[100px] opacity-20 transition-all duration-700 group-hover:scale-150"
                                                style={{ backgroundColor: item.accentColor }}
                                            />

                                            {/* Image Layer */}
                                            <Image
                                                src={item.imageAfter}
                                                alt={item.client}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                                            />

                                            {/* Glass Reflection */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Side Label */}
                                    <div className="absolute -right-4 top-1/2 -rotate-90 origin-right text-[10px] font-mono tracking-[1em] text-zinc-800 uppercase pointer-events-none">
                                        Showcase • 2026
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="h-screen flex items-center justify-center bg-[#050505]">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-12">
                            ¿TU PROYECTO <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 italic">SIGUE AQUÍ?</span>
                        </h2>
                        <a href="/contact" className="px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all">
                            Hablemos hoy
                        </a>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}
