"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Inicio", href: "/" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Sustentabilidad", href: "/sustentabilidad" },
        { name: "Productos", href: "/productos" },
        { name: "Galería", href: "/galeria" }
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-xl h-20 border-b border-[#D4AF37]/20' : 'h-28 bg-transparent'}`}>
            <div className="max-w-screen-2xl mx-auto px-6 md:px-16 h-full flex items-center justify-between">

                {/* Logo Original - Lado Izquierdo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="block relative z-[1000]">
                        <img
                            src="/prospectos/apimiel/assets/logo_original.png"
                            alt="Apimiel"
                            className="h-10 md:h-14 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* MENÚS DERECHA - Visibilidad Blindada Sherlock */}
                <div className="flex items-center space-x-6 lg:space-x-10">
                    {/* Menú: Siempre visible para debug, luego refinamos breakpoints */}
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[11px] uppercase tracking-[0.4em] font-black text-[#FDF5E6] hover:text-[#D4AF37] transition-all duration-300 relative group py-2 whitespace-nowrap"
                            >
                                <span className="relative z-10">{item.name}</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#D4AF37]" />
                            </Link>
                        ))}
                    </div>

                    {/* Botón Tienda: Contraste Blindado H0 */}
                    {/* Botón Tienda: Blindaje Final Sherlock H0 */}
                    <motion.a
                        href="https://apimiel.cl/tienda"
                        target="_blank"
                        initial="initial"
                        whileHover="hover"
                        className="relative px-8 py-3 overflow-hidden border border-[#D4AF37] cursor-pointer"
                    >
                        <motion.span
                            variants={{
                                initial: { color: "#FDF5E6" },
                                hover: { color: "#000000" }
                            }}
                            transition={{ duration: 0.3 }}
                            className="relative z-20 text-[10px] uppercase tracking-[0.5em] font-black pointer-events-none"
                        >
                            Tienda
                        </motion.span>
                        <motion.div
                            variants={{
                                initial: { y: "101%" },
                                hover: { y: 0 }
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 bg-[#D4AF37] z-10"
                        />
                    </motion.a>

                    {/* Hamburguesa: Solo para móviles extremos */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2 text-[#D4AF37] hidden"
                    >
                        <div className="w-6 h-4 flex flex-col justify-between items-end">
                            <span className="h-[1px] bg-current w-6" />
                            <span className="h-[1px] bg-current w-4" />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu Overlay - Reforzado */}
                <div className={`fixed inset-0 bg-[#0A0A0A] z-[990] transition-transform duration-500 ease-in-out flex flex-col items-center justify-center space-y-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-2xl uppercase tracking-[0.5em] font-black text-[#FDF5E6] hover:text-[#D4AF37] transition-all"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <a
                        href="https://apimiel.cl/tienda"
                        target="_blank"
                        className="mt-8 px-12 py-4 bg-[#D4AF37] text-[#1A1A1A] text-xs uppercase tracking-[0.4em] font-black"
                    >
                        Tienda Real
                    </a>
                </div>
            </div>
        </nav>
    );
}
