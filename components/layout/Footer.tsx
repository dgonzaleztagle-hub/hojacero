'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// FOOTER GLOBAL — HOJACERO
// Estilo: Linear / Vercel / Locomotive — Minimalista, informativo, premium
// Uso: Se importa en landing, /vision, /pricing y cualquier página pública
// ============================================================================

const navigation = [
    { label: 'Work', href: '/#portfolio' },
    { label: 'Studio', href: '/#services' },
    { label: 'Vision', href: '/vision' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
];

const socials = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/hojacero.cl',
        hoverColor: 'hover:text-pink-400',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/hojacero',
        hoverColor: 'hover:text-blue-400',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/share/1TyKsQC3GJ/',
        hoverColor: 'hover:text-blue-500',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
        ),
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/56958946617',
        hoverColor: 'hover:text-green-400',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
        ),
    },
];

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Línea separadora se expande
            gsap.fromTo('.footer-divider',
                { scaleX: 0, transformOrigin: 'left' },
                {
                    scaleX: 1,
                    duration: 1.5,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 90%',
                    }
                }
            );

            // Stagger de columnas
            gsap.fromTo('.footer-col',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.12,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: 'top 85%',
                    }
                }
            );

            // Bottom bar
            gsap.fromTo('.footer-bottom',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.footer-bottom',
                        start: 'top 95%',
                    }
                }
            );
        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="relative z-10 bg-black text-white border-t border-white/[0.06]">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 md:px-20 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="footer-col md:col-span-5">
                        <Link href="/" className="inline-block group">
                            <span className="font-display font-bold tracking-[0.3em] text-sm text-white group-hover:opacity-70 transition-opacity">
                                HOJA CERO_
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-zinc-500 font-light leading-relaxed max-w-xs">
                            Architects of Digital Experiences.
                            <br />
                            Estudio digital en Santiago de Chile especializado en desarrollo web, apps y productos digitales a medida.
                        </p>
                        <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                            Santiago / Worldwide
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div className="footer-col md:col-span-3">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-6">
                            Navegación
                        </h4>
                        <ul className="space-y-3">
                            {navigation.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 relative group inline-block"
                                    >
                                        {item.label}
                                        <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-col md:col-span-4">
                        <h4 className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 mb-6">
                            Contacto
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:contacto@hojacero.cl"
                                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent/50 group-hover:bg-accent transition-colors" />
                                    contacto@hojacero.cl
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+56958946617"
                                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-400 transition-colors" />
                                    +56 9 5894 6617
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-zinc-400 hover:text-green-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Hablemos por WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="container mx-auto px-6 md:px-20">
                <div className="w-full h-[1px] bg-white/[0.06] footer-divider" />
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom container mx-auto px-6 md:px-20 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Social Icons */}
                    <div className="flex items-center gap-5">
                        {socials.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className={`text-zinc-600 ${social.hoverColor} hover:scale-110 transition-all duration-300`}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">
                        <span>© {new Date().getFullYear()} HojaCero</span>
                        <span className="hidden md:block">·</span>
                        <span>Todos los derechos reservados</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
