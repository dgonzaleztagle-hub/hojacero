'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ============================================================================
// NAVBAR GLOBAL — HOJACERO
// Un solo componente para TODAS las páginas públicas
//   - En landing (/): scroll suave a secciones
//   - En otras páginas: redirige a /#seccion
//   - Mobile: menú hamburguesa fullscreen con animaciones
// ============================================================================

const menuItems = [
    { label: 'Work', section: 'portfolio' },
    { label: 'Vision', href: '/vision' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const isLanding = pathname === '/';
    const [mobileOpen, setMobileOpen] = useState(false);

    // Cerrar menú al cambiar de ruta
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Bloquear scroll cuando el menú mobile está abierto
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
        if (isLanding) {
            e.preventDefault();
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            setMobileOpen(false);
        } else {
            // Navega a /#section — cerramos el menú
            setMobileOpen(false);
        }
    };

    const getHref = (item: typeof menuItems[0]) => {
        if (item.href) return item.href;
        return isLanding ? `#${item.section}` : `/#${item.section}`;
    };

    const isActive = (item: typeof menuItems[0]) => {
        if (item.href) return pathname === item.href;
        return false;
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group" onClick={() => setMobileOpen(false)}>
                    <span className="font-display font-bold tracking-[0.3em] text-sm text-white transition-opacity group-hover:opacity-70">
                        HOJA CERO_
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-white">
                    {menuItems.map((item) => {
                        if (item.section) {
                            return (
                                <a
                                    key={item.label}
                                    href={getHref(item)}
                                    onClick={(e) => handleClick(e, item.section!)}
                                    className="hover-trigger relative group cursor-none"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                                </a>
                            );
                        }
                        return (
                            <Link
                                key={item.label}
                                href={item.href!}
                                className={`hover-trigger relative group cursor-none ${isActive(item) ? 'opacity-50' : ''}`}
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile: Hamburger Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 mix-blend-difference"
                    aria-label="Menú"
                >
                    <motion.span
                        animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-[1.5px] bg-white origin-center"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                        className="block w-6 h-[1.5px] bg-white"
                        transition={{ duration: 0.2 }}
                    />
                    <motion.span
                        animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                        className="block w-6 h-[1.5px] bg-white origin-center"
                        transition={{ duration: 0.3 }}
                    />
                </button>
            </nav>

            {/* Mobile Fullscreen Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[55] bg-black flex flex-col justify-center items-center"
                    >
                        {/* Background subtle grid */}
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="relative z-10 flex flex-col items-center gap-8">
                            {menuItems.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                                >
                                    {item.section ? (
                                        <a
                                            href={getHref(item)}
                                            onClick={(e) => handleClick(e, item.section!)}
                                            className="text-3xl font-display font-bold tracking-[0.15em] uppercase text-white hover:text-cyan-400 transition-colors duration-300"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href!}
                                            onClick={() => setMobileOpen(false)}
                                            className={`text-3xl font-display font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${isActive(item) ? 'text-cyan-400' : 'text-white hover:text-cyan-400'}`}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                            {/* Separador */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="w-16 h-[1px] bg-white/20 my-2"
                            />

                            {/* CTA WhatsApp */}
                            <motion.a
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                href="https://wa.me/56958946617?text=Hola%20HojaCero%2C%20me%20gustar%C3%ADa%20conversar%20sobre%20un%20proyecto."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-2 px-6 py-3 border border-white/10 rounded-full text-xs font-medium uppercase tracking-[0.15em] text-zinc-400 hover:border-green-500/50 hover:text-green-400 transition-all duration-300"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                WhatsApp
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
