"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] border-t border-[#D4AF37]/10 py-4 px-6 md:px-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4">
                    <h2 className="text-[#FDF5E6] font-serif text-3xl mb-2">Apimiel</h2>
                    <p className="text-[#FDF5E6]/60 font-light text-sm leading-relaxed max-w-sm">
                        Desde el año 2000, custodiando la biodiversidad melífera de Santa Bárbara.
                        Calidad nacional con estándares internacionales.
                    </p>
                </div>

                <div className="md:col-span-8 flex flex-wrap md:flex-nowrap justify-between gap-8 text-[#FDF5E6] mt-4 md:mt-0">
                    <div className="min-w-[120px]">
                        <span className="text-xs tracking-widest text-[#D4AF37] uppercase mb-1 block font-bold">Ubicación</span>
                        <p className="text-sm font-light opacity-60 leading-relaxed">Quillaileo, Santa Bárbara<br />Región del Biobío, Chile</p>
                    </div>
                    <div className="min-w-[120px]">
                        <span className="text-xs tracking-widest text-[#D4AF37] uppercase mb-1 block font-bold">Contacto</span>
                        <p className="text-sm font-light opacity-60 leading-relaxed">hola@apimiel.cl<br />+56 9 1234 5678</p>
                    </div>
                    <div className="min-w-[100px]">
                        <span className="text-xs tracking-widest text-[#D4AF37] uppercase mb-1 block font-bold">Redes</span>
                        <div className="flex gap-4">
                            <a href="#" className="text-sm font-light opacity-60 hover:text-[#D4AF37] transition-colors">Instagram</a>
                            <a href="#" className="text-sm font-light opacity-60 hover:text-[#D4AF37] transition-colors">Facebook</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#D4AF37]/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase opacity-30 text-[#FDF5E6] gap-2">
                <span>© 2026 Apimiel</span>
                <span className="hidden md:block">•</span>
                <a
                    href="https://hojacero.cl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 group"
                    aria-label="Desarrollado por HojaCero - Estudio de ingeniería web y estrategia digital en Santiago de Chile"
                    title="HojaCero.cl | Soluciones Digitales a Medida"
                >
                    Designed by <span className="font-bold group-hover:text-white transition-colors">HOJACERO.CL</span>
                </a>
            </div>
        </footer>
    );
}
