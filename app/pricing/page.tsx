'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/ui/CustomCursor';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// PRICING PAGE - INTERNATIONAL AGENCY LEVEL
// Inspired by: Linear, Vercel, Stripe, Arc
// Features: Floating orbs, magnetic cards, text morphing, parallax layers
// ============================================================================

// Floating gradient orbs background
const GradientOrbs = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Orb 1 - Cyan top left */}
        <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                left: '-20%',
                top: '-20%',
            }}
            animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
        {/* Orb 2 - Purple center right */}
        <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
                filter: 'blur(80px)',
                right: '-10%',
                top: '30%',
            }}
            animate={{
                x: [0, -80, 0],
                y: [0, 100, 0],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
        {/* Orb 3 - Blue bottom */}
        <motion.div
            className="absolute w-[700px] h-[700px] rounded-full"
            style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                filter: 'blur(100px)',
                left: '30%',
                bottom: '-30%',
            }}
            animate={{
                x: [0, 60, 0],
                y: [0, -80, 0],
                scale: [1, 0.9, 1],
            }}
            transition={{
                duration: 18,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        />
    </div>
);

// Noise texture overlay
const NoiseOverlay = () => (
    <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
    />
);

// Grid pattern
const GridPattern = () => (
    <div
        className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03]"
        style={{
            backgroundImage: `
                linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
        }}
    />
);

// Magnetic Card Component
const MagneticCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(cardRef.current, {
            rotateY: x / 20,
            rotateX: -y / 20,
            transformPerspective: 1000,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transform-style-preserve-3d ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    );
};

// Plan data
interface Plan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number | null;
    yearlyPrice: number | null;
    highlight: boolean;
    badge?: string;
    features: string[];
    cta: string;
    gradient: string;
}

const plans: Plan[] = [
    {
        id: 'express',
        name: 'Express',
        description: 'Landing page premium en 48 hrs',
        monthlyPrice: null,
        yearlyPrice: 150000,
        highlight: true,
        badge: 'Popular',
        features: [
            'Diseño premium responsive',
            'Animaciones fluidas',
            'Optimizado para SEO',
            'SSL incluido',
            'Entrega en 48-72 hrs',
        ],
        cta: 'Empezar ahora',
        gradient: 'from-cyan-500/20 to-blue-500/10',
    },
    {
        id: 'audit',
        name: 'Auditoría',
        description: 'Diagnóstico completo de tu web',
        monthlyPrice: null,
        yearlyPrice: 100000,
        highlight: false,
        features: [
            'Análisis técnico profundo',
            'Reporte de velocidad',
            'Auditoría de seguridad',
            'Análisis de competencia',
            'Reunión de 30 minutos',
        ],
        cta: 'Solicitar auditoría',
        gradient: 'from-purple-500/15 to-pink-500/5',
    },
    {
        id: 'custom',
        name: 'Custom',
        description: 'Apps, sistemas, e-commerce',
        monthlyPrice: null,
        yearlyPrice: null,
        highlight: false,
        features: [
            'Desarrollo a medida',
            'Apps web complejas',
            'E-commerce completo',
            'Integraciones API',
            'Automatización con IA',
        ],
        cta: 'Conversemos',
        gradient: 'from-white/10 to-gray-500/5',
    },
];

const addons = [
    { name: 'Mantención', price: 25000, unit: '/mes', icon: '⚙️' },
    { name: 'SEO', price: 75000, unit: '', icon: '📈' },
    { name: 'Analytics', price: 50000, unit: '', icon: '📊' },
    { name: 'Dominio', price: 15000, unit: '/año', icon: '🌐' },
];

// Reveal text animation 
const RevealText = ({ children, delay = 0 }: { children: string; delay?: number }) => {
    return (
        <motion.span
            className="inline-block overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <motion.span
                className="inline-block"
                variants={{
                    hidden: { y: '100%', opacity: 0 },
                    visible: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            delay,
                            ease: [0.33, 1, 0.68, 1]
                        }
                    },
                }}
            >
                {children}
            </motion.span>
        </motion.span>
    );
};

export default function PricingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [isAnnual, setIsAnnual] = useState(true);
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const { scrollYProgress } = useScroll();
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // GSAP animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Stagger hero elements
            gsap.fromTo('.hero-element',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: 0.3
                }
            );

            // Cards entrance
            gsap.fromTo('.pricing-card',
                { y: 100, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.pricing-section',
                        start: 'top 80%',
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <CustomCursor />

            <main ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
                {/* Background layers */}
                <GridPattern />
                <GradientOrbs />
                <NoiseOverlay />

                {/* Navbar Global */}
                <Navbar />

                {/* Hero Section */}
                <section
                    ref={heroRef}
                    className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden"
                >
                    {/* Video Robot Background - Fullscreen */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, delay: 0.3 }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-40"
                            >
                                <source src="/robot.mp4" type="video/mp4" />
                            </video>
                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                            {/* Cyan glow overlay */}
                            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent opacity-60" />
                        </motion.div>
                    </div>

                    <div className="text-center max-w-4xl relative z-10">
                        {/* Eyebrow */}
                        <motion.div
                            className="hero-element mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm text-xs font-medium tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                Transparencia total
                            </span>
                        </motion.div>

                        {/* Main title with stagger */}
                        <div className="hero-element overflow-hidden">
                            <h1 className="text-[clamp(3rem,12vw,10rem)] font-display font-bold leading-[0.9] tracking-tighter">
                                <RevealText>Simple</RevealText>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                                    <RevealText delay={0.1}>Pricing</RevealText>
                                </span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            className="hero-element mt-8 text-xl md:text-2xl text-zinc-400 font-light max-w-xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Sin letra chica. Sin sorpresas.
                            <br />
                            <span className="text-white">Solo resultados.</span>
                        </motion.p>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500">Scroll</span>
                            <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent" />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Pricing Section */}
                <section className="pricing-section relative z-10 py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section header */}
                        <motion.div
                            className="text-center mb-20"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                                Elige tu plan
                            </h2>
                            <p className="text-zinc-500 text-lg">
                                Calidad premium, precios honestos.
                            </p>
                        </motion.div>

                        {/* Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {plans.map((plan, index) => (
                                <MagneticCard key={plan.id}>
                                    <motion.div
                                        className={`pricing-card relative h-full rounded-3xl border transition-all duration-500 cursor-none hover-trigger
                                            ${plan.highlight
                                                ? 'border-cyan-500/30 bg-gradient-to-b ' + plan.gradient
                                                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                            }
                                        `}
                                        onMouseEnter={() => setHoveredPlan(plan.id)}
                                        onMouseLeave={() => setHoveredPlan(null)}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Highlight glow */}
                                        {plan.highlight && (
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                        )}

                                        {/* Badge */}
                                        {plan.badge && (
                                            <div className="absolute -top-3 left-6">
                                                <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                                                    {plan.badge}
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-8 lg:p-10">
                                            {/* Plan header */}
                                            <div className="mb-8">
                                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                                <p className="text-sm text-zinc-500">{plan.description}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-8">
                                                {plan.yearlyPrice !== null ? (
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl lg:text-6xl font-display font-bold">
                                                            $<AnimatedCounter to={plan.yearlyPrice} duration={1.5} />
                                                        </span>
                                                        <span className="text-zinc-500">CLP</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-5xl font-display font-light text-zinc-400">
                                                        Cotizar
                                                    </div>
                                                )}
                                                <p className="text-xs text-zinc-600 mt-2">Pago único</p>
                                                {plan.id === 'express' && (
                                                    <p className="text-xs text-cyan-400/80 mt-1">+ $25.000/mes mantención opcional</p>
                                                )}
                                            </div>

                                            {/* Features */}
                                            <ul className="space-y-4 mb-10">
                                                {plan.features.map((feature, i) => (
                                                    <motion.li
                                                        key={i}
                                                        className="flex items-center gap-3 text-sm"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: 0.1 * i }}
                                                    >
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                                                            <span className="text-cyan-400 text-xs">✓</span>
                                                        </span>
                                                        <span className="text-zinc-400">{feature}</span>
                                                    </motion.li>
                                                ))}
                                            </ul>

                                            {/* CTA */}
                                            <motion.a
                                                href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20tengo%20dudas%20sobre%20los%20planes."
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`block w-full py-4 rounded-xl text-center text-sm font-semibold transition-all
                                                    ${plan.highlight
                                                        ? 'bg-white text-black hover:bg-cyan-400'
                                                        : 'bg-white/5 border border-white/10 hover:bg-white hover:text-black'
                                                    }
                                                `}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {plan.cta}
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                </MagneticCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Add-ons */}
                <section className="relative z-10 py-24 px-6 border-t border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2
                            className="text-center text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            Servicios adicionales
                        </motion.h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {addons.map((addon, i) => (
                                <motion.div
                                    key={addon.name}
                                    className="text-center group cursor-none hover-trigger"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                                        {addon.icon}
                                    </div>
                                    <div className="text-2xl font-bold group-hover:text-cyan-400 transition-colors">
                                        $<AnimatedCounter to={addon.price} duration={0.8} />{addon.unit}
                                    </div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">
                                        {addon.name}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="relative z-10 py-24 px-6">
                    <div className="max-w-2xl mx-auto">
                        <motion.h2
                            className="text-3xl font-display font-bold text-center mb-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            Preguntas frecuentes
                        </motion.h2>

                        <div className="space-y-4">
                            {[
                                { q: '¿Qué incluye la mantención?', a: 'Hosting rápido, SSL, actualizaciones de seguridad, cambios menores y soporte por WhatsApp.' },
                                { q: '¿Puedo pagar en pesos chilenos?', a: 'Sí, aceptamos transferencia en CLP al tipo de cambio del día, PayPal y cripto.' },
                                { q: '¿Cuánto demora una landing Express?', a: 'Entre 48 y 72 horas desde que nos envías tu contenido (logo, textos, fotos).' },
                            ].map((item, i) => (
                                <motion.details
                                    key={i}
                                    className="group border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <summary className="p-6 cursor-pointer font-medium list-none flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                                        {item.q}
                                        <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl">+</span>
                                    </summary>
                                    <div className="px-6 pb-6 text-zinc-400 text-sm">
                                        {item.a}
                                    </div>
                                </motion.details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative z-10 py-40 px-6">
                    <div className="text-center">
                        <motion.h2
                            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white">
                                ¿Empezamos?
                            </span>
                        </motion.h2>

                        <motion.p
                            className="text-zinc-500 mb-12 max-w-md mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Escríbenos y te respondemos en minutos
                        </motion.p>

                        <motion.a
                            href="https://wa.me/56972739105?text=Hola%20HojaCero%2C%20quiero%20empezar"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-sm rounded-full hover:bg-cyan-400 transition-all cursor-none hover-trigger"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-xl">💬</span>
                            Hablemos por WhatsApp
                        </motion.a>
                    </div>
                </section>

                {/* Footer Global */}
                <Footer />
            </main>
        </>
    );
}
