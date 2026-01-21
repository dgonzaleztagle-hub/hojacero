"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function NosotrosPage() {
    return (
        <main className="min-h-screen pt-40 bg-[#0A0A0A] text-[#FDF5E6] pb-24">
            {/* Introducción Hero (Texto Sagrado: Historia Completa) */}
            <section className="px-6 md:px-24 max-w-7xl mx-auto mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl"
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block font-bold">El Origen</span>
                    <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8">
                        Desde Quillaileo,<br />
                        <span className="opacity-50 italic font-light">Capital Nacional de la Miel.</span>
                    </h1>
                    <div className="h-[1px] w-24 bg-[#D4AF37] mb-12" />

                    {/* Texto Fundacional Íntegro */}
                    <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed text-[#FDF5E6]/80 text-justify">
                        <p>
                            Apimiel es una empresa familiar que, desde principios del 2000, se ha dedicado a la producción y venta de productos orgánicos derivados de la colmena. Ubicados en los bosques endémicos de la localidad precordillerana de Quillaileo, en la comuna de Santa Bárbara, conocida como la “Capital Nacional de la Miel”, en la Región del Biobío, Chile, nuestra apicultura es totalmente sustentable y en armonía con la naturaleza.
                        </p>
                        <p>
                            Nos enorgullece ofrecer miel 100% natural y sin aditivos, obtenida de manera responsable en un entorno donde las abejas polinizan flora nativa libre de químicos. Trabajamos de la mano con productores locales, beneficiando tanto a la comunidad como al ecosistema que nos rodea.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Manifiesto Bento Grid (Simetría 2x2 - Texto Sagrado) */}
            <section className="px-6 md:px-24 max-w-7xl mx-auto relative z-10 w-full">
                <div className="flex items-end justify-between mb-12 border-b border-[#D4AF37]/20 pb-4">
                    <h2 className="text-3xl font-serif">4 Pilares de Precisión</h2>
                    <span className="text-[10px] tracking-widest uppercase opacity-40 hidden md:block">Sistema Operativo H0</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    {/* Pilar 1: Apicultura Sustentable */}
                    <div className="group bg-[#151515] p-8 rounded-[2rem] border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                        <div className="mb-6">
                            <span className="text-6xl font-serif text-[#D4AF37]/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">01</span>
                            <h3 className="text-2xl font-serif text-[#D4AF37] mb-4 relative z-10">Apicultura Sustentable</h3>
                        </div>
                        <p className="text-base font-light leading-relaxed opacity-70 relative z-10 text-justify flex-grow">
                            Actividad en la cual se involucra el valor compartido entre la comunidad y productores locales (apicultores del sector) y que ambos se benefician de la práctica en sí. Donde las abejitas pueden polinizar flora melifera nativa endemica libre de fertilizantes químicos, por lo cual el producto final, nuestra miel, es 100% natural, orgánica y sin aditivos.
                        </p>
                    </div>

                    {/* Pilar 2: Polinización */}
                    <div className="group bg-[#151515] p-8 rounded-[2rem] border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                        <div className="mb-6">
                            <span className="text-6xl font-serif text-[#D4AF37]/10 absolute top-4 right-6 group-hover:scale-110 transition-transform">02</span>
                            <h3 className="text-2xl font-serif text-[#D4AF37] mb-4 relative z-10">Polinización</h3>
                        </div>
                        <p className="text-base font-light leading-relaxed opacity-70 relative z-10 text-justify flex-grow">
                            La polinización es el proceso de transferencia de polen de la parte masculina de la flor a la parte femenina de la flor. Después de que se ha transferido el polen, sucede la fertilización de la parte femenina y esto permite el desarrollo de semillas viable y consecuentemente el desarrollo de los frutos de nuestros bosques.
                        </p>
                    </div>

                    {/* Pilar 3: La Sustentabilidad (Acento Beige) */}
                    <div className="group bg-[#FDF5E6] text-[#0A0A0A] p-8 rounded-[2rem] relative overflow-hidden flex flex-col h-full">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply pointer-events-none" />
                        <div className="relative z-10 mb-6">
                            <span className="text-xs tracking-[0.3em] uppercase font-bold text-[#A67B5B] mb-2 block">Ética de Cosecha</span>
                            <h3 className="text-3xl font-serif mb-4">Solo el Excedente.</h3>
                            <div className="h-[1px] w-12 bg-[#0A0A0A] mb-6" />
                        </div>
                        <p className="text-base font-light leading-relaxed opacity-80 relative z-10 text-justify flex-grow">
                            La Sustentabilidad en la apicultura tiene relación con en nivel de explotación que se le da a ésta, por lo que en este caso, la cosecha es netamente el excedente de la miel de las abejas; es decir, se les deja una parte considerable con la cual ellas pueden alimentarse durante los meses que no producen alimento para sus crías. De este modo las abejitas pueden hibernar y sus núcleos se mantienen intactos hasta la próxima temporada donde pueden salir a polinizar nuevamente.
                        </p>
                    </div>

                    {/* Pilar 4: Ciclo Eterno */}
                    <div className="group bg-[#151515] p-8 rounded-[2rem] border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                        <div className="mb-6">
                            <span className="text-6xl font-serif text-[#D4AF37]/20 block mb-2">∞</span>
                            <h3 className="text-xl font-serif text-[#D4AF37]">Economía Circular</h3>
                        </div>
                        <p className="text-base font-light leading-relaxed opacity-70 relative z-10 text-justify flex-grow">
                            Esto es cíclico, tanto en la práctica de la Apicultura, como en la conservación del medio natural y sus recursos (social, ambiental y económico). Así la polinización se mantiene, se preserva y conserva la biodiversidad de los ecosistemas, la economía se vuelve circular y local, y finalmente se logra un producto de calidad para que todos podamos disfrutar sus múltiples beneficios.
                        </p>
                    </div>

                </div>
            </section>
        </main>
    );
}
