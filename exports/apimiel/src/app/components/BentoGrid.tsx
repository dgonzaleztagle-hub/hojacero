"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const items = [
    {
        id: "1",
        title: "Pureza Endémica",
        description: "Miel cruda de Quillay extraída mediante procesos de bajo impacto.",
        image: "/prospectos/apimiel/assets/flora_detail.png",
        className: "md:col-span-4", // Estrecho para texto corto
    },
    {
        id: "3",
        title: "Certificación Biobío",
        description: "Origen garantizado.",
        image: "/prospectos/apimiel/assets/beehives_landscape.png",
        className: "md:col-span-8", // Ancho para texto largo
    },
    {
        id: "2",
        title: "Arquitectura Líquida",
        description: "Precisión técnica en cada gota de Santa Bárbara.",
        image: "/prospectos/apimiel/assets/hero_honey.png",
        className: "md:col-span-12", // Vuelve a ancho total para cohesión de bloque
    }
];

export default function BentoGrid() {
    return (
        <section className="py-24 bg-[#0A0A0A] px-6 md:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[280px]">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 1 }}
                            className={`group relative overflow-hidden bg-[#1A1A1A] border border-[#D4AF37]/10 rounded-[2.5rem] ${item.className}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 rounded-[2.5rem]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent opacity-80" />

                            <div className="absolute bottom-0 left-0 p-8 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                                <span className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">Technical Heritage</span>
                                <h3 className="text-[#FDF5E6] font-serif text-2xl md:text-3xl mb-1">{item.title}</h3>
                                <p className="text-[#FDF5E6]/40 font-light text-[11px] leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
