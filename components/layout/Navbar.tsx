'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const menuItems = [
    { label: 'Work', href: '#portfolio', isScroll: true },
    { label: 'Studio', href: '#services', isScroll: true },
    { label: 'Pricing', href: '/pricing', isScroll: false },
    { label: 'Contact', href: '#cta', isScroll: true },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false);
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof menuItems[0]) => {
        if (item.isScroll) {
            scrollToSection(e, item.href.replace('#', ''));
        } else {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Desktop + Mobile Logo Bar */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference animate-in fade-in duration-1000">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border border-current animate-spin-slow" aria-hidden="true"></div>
                    <span className="font-display font-bold tracking-widest text-sm text-white">HOJA CERO</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-white">
                    {menuItems.map((item) => (
                        item.isScroll ? (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href.replace('#', ''))}
                                className="hover-trigger relative group cursor-none"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hover-trigger relative group cursor-none"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                            </Link>
                        )
                    ))}
                </div>

                {/* Mobile Pill Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden relative z-[60] px-5 py-2.5 rounded-full border border-white/30 backdrop-blur-md bg-black/20 text-white text-xs font-bold tracking-[0.2em] uppercase overflow-hidden"
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        backgroundColor: isOpen ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.span
                        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -10 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="block"
                    >
                        Menú
                    </motion.span>
                    <motion.span
                        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        Cerrar
                    </motion.span>
                </motion.button>
            </nav>

            {/* Mobile Full-screen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at calc(100% - 60px) 40px)' }}
                        animate={{ clipPath: 'circle(150% at calc(100% - 60px) 40px)' }}
                        exit={{ clipPath: 'circle(0% at calc(100% - 60px) 40px)' }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[55] bg-black/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.1 + index * 0.08,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                >
                                    {item.isScroll ? (
                                        <a
                                            href={item.href}
                                            onClick={(e) => handleMenuClick(e, item)}
                                            className="text-4xl font-display font-bold text-white tracking-widest hover:text-white/60 transition-colors"
                                        >
                                            {item.label.split('').map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.2 + index * 0.08 + charIndex * 0.03,
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-4xl font-display font-bold text-white tracking-widest hover:text-white/60 transition-colors"
                                        >
                                            {item.label.split('').map((char, charIndex) => (
                                                <motion.span
                                                    key={charIndex}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: 0.2 + index * 0.08 + charIndex * 0.03,
                                                    }}
                                                    className="inline-block"
                                                >
                                                    {char}
                                                </motion.span>
                                            ))}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                            {/* Decorative Element */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="absolute bottom-20 w-64 h-64 rounded-full border border-white/20"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
