'use client';

import { useEffect, useState } from 'react';

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
                <div className="w-8 h-8 rounded-full border border-current animate-spin-slow"></div>
                <span className="font-display font-bold tracking-widest text-sm text-white">HOJA CERO</span>
            </div>
            <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-white">
                <a
                    href="#portfolio"
                    onClick={(e) => scrollToSection(e, 'portfolio')}
                    className="hover-trigger relative group cursor-none"
                >
                    Work
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                    href="#services"
                    onClick={(e) => scrollToSection(e, 'services')}
                    className="hover-trigger relative group cursor-none"
                >
                    Studio
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                </a>
                <a
                    href="#cta"
                    onClick={(e) => scrollToSection(e, 'cta')}
                    className="hover-trigger relative group cursor-none"
                >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full"></span>
                </a>
            </div>
        </nav>
    );
}
