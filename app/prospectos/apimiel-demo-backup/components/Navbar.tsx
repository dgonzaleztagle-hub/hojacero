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
        { name: "Inicio", href: "/prospectos/apimiel" },
        { name: "Nosotros", href: "/prospectos/apimiel/nosotros" },
        { name: "Sustentabilidad", href: "/prospectos/apimiel/sustentabilidad" },
        { name: "Productos", href: "/prospectos/apimiel/productos" },
        { name: "Contacto", href: "/prospectos/apimiel/contacto" }
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl h-20 border-b border-[#D4AF37]/10' : 'h-24 bg-transparent'}`}>
            <div className="max-w-screen-2xl mx-auto px-8 md:px-12 h-full flex items-center justify-between">

                {/* Logo H0 Style: Discreto e integrado */}
                <Link href="/prospectos/apimiel" className="group relative">
                    <img
                        src="/prospectos/apimiel/assets/logo_original.png"
                        alt="Apimiel"
                        className="h-10 w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:brightness-100 transition-all duration-500"
                    />
                    <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
                </Link>

                {/* Desktop Menu: Minimalismo Técnico */}
                <div className="hidden md:flex items-center space-x-12">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#FDF5E6]/40 hover:text-[#D4AF37] transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <a
                        href="https://apimiel.cl/tienda"
                        target="_blank"
                        className="px-6 py-2 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-[#1A1A1A] transition-all duration-500"
                    >
                        Tienda Real
                    </a>
                </div>
            </div>
        </nav>
    );
}
