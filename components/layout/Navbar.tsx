'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const menuItems = [
    { label: 'Work', href: '#portfolio', isScroll: true },
    { label: 'Vision', href: '/vision', isScroll: false },
    { label: 'Studio', href: '#services', isScroll: true },
    { label: 'Pricing', href: '/pricing', isScroll: false },
    { label: 'Contact', href: '#cta', isScroll: true },
];

export default function Navbar() {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
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

            {/* Mobile: Solo botón Pricing elegante */}
            <Link href="/pricing" className="md:hidden">
                <motion.div
                    className="relative px-5 py-2.5 rounded-full overflow-hidden group"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Borde animado con gradiente */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/40 via-white/10 to-white/40 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-md" />
                    </div>

                    {/* Efecto shimmer */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Texto */}
                    <span className="relative z-10 text-white text-xs font-bold tracking-[0.2em] uppercase">
                        Pricing
                    </span>
                </motion.div>
            </Link>
        </nav>
    );
}
