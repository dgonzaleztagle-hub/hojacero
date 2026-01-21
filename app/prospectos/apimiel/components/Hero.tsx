"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
            {/* Background Image / Overlay */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/prospectos/apimiel/assets/hero_honey.png"
                    alt="Miel de Apimiel"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <span className="mb-6 inline-block text-[10px] font-black tracking-[0.5em] text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-6 py-2 border border-[#D4AF37]/30">
                        Santa Bárbara • Capital Nacional de la Miel
                    </span>
                    <h1 className="max-w-5xl text-6xl md:text-8xl font-serif text-[#FDF5E6] leading-[1.05] tracking-tight">
                        La Pureza de lo <br /> <span className="italic font-light opacity-90">Endémico</span>
                    </h1>
                    <p className="mt-8 max-w-xl mx-auto text-lg md:text-xl text-[#FDF5E6]/80 font-light leading-relaxed tracking-wide">
                        Custodiamos el alma de la colmena en los bosques vírgenes del Biobío.
                        Miel cruda, arquitectura líquida y precisión ancestral en cada gota.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-12"
                >
                    <Link href="/productos" className="inline-block group relative px-8 py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] overflow-hidden transition-colors hover:text-[#1A1A1A]">
                        <span className="relative z-10 font-medium tracking-widest uppercase text-xs">Explorar Colección</span>
                        <div className="absolute inset-0 z-0 translate-y-full bg-[#D4AF37] transition-transform duration-300 group-hover:translate-y-0" />
                    </Link>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="h-12 w-[1px] bg-[#D4AF37]/30" />
            </motion.div>
        </section>
    );
}
