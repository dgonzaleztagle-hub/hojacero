"use client";

import { motion } from "framer-motion";

export default function GaleriaPage() {
    return (
        <main className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover opacity-50"
                >
                    <source src="/apimiel.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/90" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="mb-8 inline-block text-[10px] font-black tracking-[0.5em] text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-6 py-2 border border-[#D4AF37]/30 backdrop-blur-sm">
                        Próximamente
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif text-[#FDF5E6] mb-8">
                        Galería Visual
                    </h1>
                    <p className="max-w-md mx-auto text-[#FDF5E6]/60 font-light text-sm tracking-widest uppercase">
                        Capturando el alma de Quillaileo
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
