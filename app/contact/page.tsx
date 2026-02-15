'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// CONTACT PAGE V2 — SCROLL-DRIVEN EXPERIENCE
// No es una página. Es una experiencia.
// Cada scroll step transforma la vista. Pinned sections, horizontal scroll,
// text scramble by scroll, split letter animations.
// ============================================================================

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
);

const GridPattern = () => (
    <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
);

// --- Constants ---
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]';
const HERO_WORD = 'HABLEMOS';

// --- Contact data ---
const channels = [
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        value: '+56 9 5894 6617',
        desc: 'Respuesta inmediata',
        href: 'https://wa.me/56958946617?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto.',
        color: '#4ade80',
        external: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
        ),
    },
    {
        id: 'email',
        label: 'Email',
        value: 'contacto@hojacero.cl',
        desc: 'Propuestas y cotizaciones',
        href: 'mailto:contacto@hojacero.cl',
        color: '#00f0ff',
        external: false,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        ),
    },
    {
        id: 'phone',
        label: 'Teléfono',
        value: '+56 9 5894 6617',
        desc: 'L–V · 9:00 – 19:00',
        href: 'tel:+56958946617',
        color: '#a78bfa',
        external: false,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        id: 'instagram',
        label: 'Instagram',
        value: '@hojacero.cl',
        desc: 'Nuestro trabajo en vivo',
        href: 'https://www.instagram.com/hojacero.cl',
        color: '#f472b6',
        external: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
        ),
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        value: '/company/hojacero',
        desc: 'Red profesional',
        href: 'https://www.linkedin.com/company/hojacero',
        color: '#60a5fa',
        external: true,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
];

// --- Live Clock ---
const LiveClock = () => {
    const [time, setTime] = useState('');
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(new Intl.DateTimeFormat('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now));
            const h = parseInt(new Intl.DateTimeFormat('en', { timeZone: 'America/Santiago', hour: 'numeric', hour12: false }).format(now));
            const d = new Intl.DateTimeFormat('en', { timeZone: 'America/Santiago', weekday: 'short' }).format(now);
            setAvailable(h >= 9 && h < 19 && !['Sat', 'Sun'].includes(d));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return { time, available };
};

// ============================================================================
// MAIN
// ============================================================================
export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const heroTextRef = useRef<HTMLHeadingElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);
    const horizontalWrapRef = useRef<HTMLDivElement>(null);
    const splitRef = useRef<HTMLHeadingElement>(null);
    const [scrambleText, setScrambleText] = useState(HERO_WORD.replace(/./g, '—'));
    const { time, available } = LiveClock();

    // --- Scramble based on scroll progress ---
    const updateScramble = useCallback((progress: number) => {
        const len = HERO_WORD.length;
        const revealed = Math.floor(progress * len);

        const result = HERO_WORD.split('').map((char, i) => {
            if (i < revealed) return char;
            if (i === revealed && progress > 0) {
                // Current char is scrambling
                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            return '—';
        }).join('');

        setScrambleText(result);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // =============================================
            // HERO — Pinned. Scramble on scroll.
            // =============================================
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top top',
                end: '+=150%',
                pin: true,
                scrub: 0.5,
                onUpdate: (self) => {
                    updateScramble(self.progress);
                },
            });

            // Hero subtitle + line animate during pin
            gsap.fromTo('.hero-sub', { y: 60, opacity: 0 }, {
                y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '+=80%',
                    scrub: 0.5,
                },
            });

            gsap.fromTo('.hero-line', { scaleX: 0 }, {
                scaleX: 1,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: '+=60%',
                    end: '+=90%',
                    scrub: 0.5,
                },
            });

            // =============================================
            // SPLIT TEXT — Each letter animates on scroll
            // =============================================
            if (splitRef.current) {
                const letters = splitRef.current.querySelectorAll('.split-letter');
                gsap.fromTo(letters,
                    { y: 120, opacity: 0, rotateX: -90 },
                    {
                        y: 0, opacity: 1, rotateX: 0,
                        stagger: 0.05,
                        scrollTrigger: {
                            trigger: splitRef.current,
                            start: 'top 80%',
                            end: 'top 30%',
                            scrub: 0.3,
                        },
                    }
                );
            }

            // =============================================
            // HORIZONTAL SCROLL — Cards move left on scroll
            // =============================================
            if (horizontalRef.current && horizontalWrapRef.current) {
                const cards = horizontalWrapRef.current;
                const totalScrollWidth = cards.scrollWidth - window.innerWidth;

                gsap.to(cards, {
                    x: -totalScrollWidth,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: horizontalRef.current,
                        start: 'top top',
                        end: () => `+=${totalScrollWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });
            }

            // =============================================
            // CLOCK + CTA — Reveal
            // =============================================
            gsap.fromTo('.clock-wrap',
                { y: 80, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1.2,
                    scrollTrigger: { trigger: '.clock-wrap', start: 'top 80%' },
                }
            );

            gsap.fromTo('.cta-wrap',
                { y: 60, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 1,
                    scrollTrigger: { trigger: '.cta-wrap', start: 'top 85%' },
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, [updateScramble]);

    return (
        <>
            <CustomCursor />

            <main ref={containerRef} className="relative bg-[#050505] text-white overflow-hidden">
                <GridPattern />
                <NoiseOverlay />
                <Navbar />

                {/* ═══════════════════════════════════════════ */}
                {/* HERO — PINNED + SCROLL SCRAMBLE             */}
                {/* ═══════════════════════════════════════════ */}
                <section
                    ref={heroRef}
                    className="relative z-10 h-screen flex flex-col justify-center items-center px-6"
                >
                    {/* Floating orb behind text */}
                    <div className="absolute w-[500px] h-[500px] rounded-full opacity-20" style={{
                        background: 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%)',
                        filter: 'blur(100px)',
                    }} />

                    {/* Scrambled title */}
                    <h1
                        ref={heroTextRef}
                        className="relative font-display font-bold text-[clamp(3.5rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-center select-none"
                    >
                        {scrambleText.split('').map((char, i) => (
                            <span
                                key={i}
                                className="inline-block transition-colors duration-200"
                                style={{
                                    color: char === HERO_WORD[i] ? '#ffffff' : 'rgba(0,240,255,0.4)',
                                    fontFamily: char === HERO_WORD[i] ? 'inherit' : 'monospace',
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle — appears during scroll */}
                    <p className="hero-sub relative mt-8 text-lg md:text-xl text-zinc-500 font-light text-center max-w-lg opacity-0">
                        Cada gran proyecto empieza con una conversación.
                    </p>

                    {/* Line */}
                    <div className="hero-line relative w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-10 origin-center" style={{ transform: 'scaleX(0)' }} />

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-16"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-zinc-700">Scroll</span>
                            <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-600 to-transparent" />
                        </div>
                    </motion.div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* SPLIT TEXT — "ELIGE CÓMO CONECTAR"          */}
                {/* ═══════════════════════════════════════════ */}
                <section className="relative z-10 py-24 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-zinc-600 mb-8 text-center">Canales directos</p>
                        <h2
                            ref={splitRef}
                            className="text-[clamp(3rem,12vw,10rem)] font-display font-bold leading-[0.9] text-center"
                            style={{ perspective: '1000px' }}
                        >
                            {'CONECTA'.split('').map((char, i) => (
                                <span
                                    key={i}
                                    className="split-letter inline-block"
                                    style={{ transformOrigin: 'bottom center' }}
                                >
                                    {char}
                                </span>
                            ))}
                        </h2>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* HORIZONTAL SCROLL — CHANNEL CARDS           */}
                {/* ═══════════════════════════════════════════ */}
                <section ref={horizontalRef} className="relative z-10 h-screen">
                    <div
                        ref={horizontalWrapRef}
                        className="absolute top-0 left-0 h-full flex items-center gap-6 pl-[10vw] pr-[5vw]"
                        style={{ willChange: 'transform' }}
                    >
                        {channels.map((ch, i) => (
                            <a
                                key={ch.id}
                                href={ch.href}
                                target={ch.external ? '_blank' : undefined}
                                rel={ch.external ? 'noopener noreferrer' : undefined}
                                className="h-card group relative flex-shrink-0 w-[80vw] md:w-[380px] h-[60vh] md:h-[55vh] rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-10 flex flex-col justify-between transition-colors duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '800px',
                                }}
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left - rect.width / 2;
                                    const y = e.clientY - rect.top - rect.height / 2;
                                    gsap.to(e.currentTarget, {
                                        rotateY: x / 12,
                                        rotateX: -y / 12,
                                        scale: 1.04,
                                        boxShadow: `0 20px 80px ${ch.color}20, 0 0 40px ${ch.color}10`,
                                        borderColor: `${ch.color}50`,
                                        duration: 0.4,
                                        ease: 'power2.out',
                                    });
                                    // Move icon towards cursor
                                    const icon = e.currentTarget.querySelector('.card-icon');
                                    if (icon) {
                                        gsap.to(icon, { x: x / 15, y: y / 15, scale: 1.15, color: ch.color, duration: 0.3 });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, {
                                        rotateY: 0,
                                        rotateX: 0,
                                        scale: 1,
                                        boxShadow: '0 0 0 0 transparent',
                                        borderColor: 'rgba(255,255,255,0.06)',
                                        duration: 0.8,
                                        ease: 'elastic.out(1, 0.4)',
                                    });
                                    const icon = e.currentTarget.querySelector('.card-icon');
                                    if (icon) {
                                        gsap.to(icon, { x: 0, y: 0, scale: 1, color: '#52525b', duration: 0.5 });
                                    }
                                }}
                            >
                                {/* Top: number + icon */}
                                <div>
                                    <div className="flex items-start justify-between mb-12">
                                        <span className="text-[11px] font-mono text-zinc-700 tracking-wider">0{i + 1}</span>
                                        <div className="card-icon text-zinc-600 transition-none">
                                            {ch.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-display font-bold mb-3 transition-colors duration-300 group-hover:text-white">
                                        {ch.label}
                                    </h3>
                                    <p className="text-sm font-mono text-zinc-500 mb-2">{ch.value}</p>
                                    <p className="text-xs text-zinc-700">{ch.desc}</p>
                                </div>

                                {/* Bottom: arrow */}
                                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-700 transition-colors duration-300 group-hover:text-white">
                                    <span>Abrir</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:translate-x-2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </div>

                                {/* Accent line bottom — appears on hover */}
                                <div
                                    className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100"
                                    style={{ background: `linear-gradient(to right, transparent, ${ch.color}, transparent)` }}
                                />
                            </a>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* CLOCK — LIVE TIME + AVAILABILITY             */}
                {/* ═══════════════════════════════════════════ */}
                <section className="relative z-10 py-24 px-6">
                    <div className="clock-wrap container mx-auto max-w-3xl text-center">
                        <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-zinc-600 mb-16">Santiago, Chile · UTC-3</p>

                        <p className="font-mono text-[clamp(3rem,10vw,8rem)] font-extralight tracking-[0.2em] text-white/70 leading-none">
                            {time}
                        </p>

                        <div className="flex items-center justify-center gap-3 mt-8">
                            <span className={`w-2.5 h-2.5 rounded-full ${available ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`} />
                            <span className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-500">
                                {available ? 'Disponible ahora' : 'Fuera de horario'}
                            </span>
                        </div>

                        <p className="mt-8 text-xs text-zinc-700 max-w-xs mx-auto leading-relaxed">
                            Lunes a Viernes, 9:00 – 19:00 CLT
                        </p>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* CTA FINAL — DRAMATIC                        */}
                {/* ═══════════════════════════════════════════ */}
                <section className="relative z-10 py-24 px-6">
                    <div className="cta-wrap container mx-auto max-w-3xl text-center">
                        <h2 className="text-[clamp(2rem,6vw,5rem)] font-display font-bold leading-[0.95] mb-8">
                            No importa el tamaño.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                                Si tiene ambición,
                            </span>
                            <br />
                            nos interesa.
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16">
                            {/* Primary */}
                            <a
                                href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-[0.15em] hover:bg-cyan-400 transition-all duration-300 hover:scale-105"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Hablemos
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-1">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </a>

                            {/* Secondary */}
                            <a
                                href="mailto:contacto@hojacero.cl"
                                className="inline-flex items-center gap-2 px-8 py-5 border border-white/10 rounded-full text-sm font-medium uppercase tracking-[0.15em] text-zinc-400 hover:text-white hover:border-white/30 transition-all duration-300"
                            >
                                contacto@hojacero.cl
                            </a>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </>
    );
}
