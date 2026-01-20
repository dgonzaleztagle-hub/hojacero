"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-[#1A1A1A] border-t border-[#D4AF37]/10 py-24 px-6 md:px-24">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
                <div className="max-w-sm">
                    <h2 className="text-[#FDF5E6] font-serif text-3xl mb-4">Apimiel</h2>
                    <p className="text-[#FDF5E6]/40 font-light text-sm leading-relaxed">
                        Desde el año 2000, custodiando la biodiversidad melífera de Santa Bárbara.
                        Calidad nacional con estándares internacionales.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[#FDF5E6]">
                    <div>
                        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase mb-4 block">Ubicación</span>
                        <p className="text-sm font-light opacity-60">Quillaileo, Santa Bárbara<br />Región del Biobío, Chile</p>
                    </div>
                    <div>
                        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase mb-4 block">Contacto</span>
                        <p className="text-sm font-light opacity-60">hola@apimiel.cl<br />+56 9 1234 5678</p>
                    </div>
                    <div>
                        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase mb-4 block">Redes</span>
                        <div className="flex gap-4">
                            <a href="#" className="text-sm font-light opacity-60 hover:text-[#D4AF37] transition-colors">IG</a>
                            <a href="#" className="text-sm font-light opacity-60 hover:text-[#D4AF37] transition-colors">FB</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-24 pt-8 border-t border-[#D4AF37]/5 flex justify-between items-center text-[10px] tracking-widest uppercase opacity-30 text-[#FDF5E6]">
                <span>© 2026 HojaCero Factory</span>
                <span>Apimiel • Precisión Orgánica</span>
            </div>
        </footer>
    );
}
