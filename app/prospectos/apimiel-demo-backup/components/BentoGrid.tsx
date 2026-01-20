"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const products = [
    {
        title: "Miel de Quillay",
        description: "Cosechada en primavera. Notas florales intensas con propiedades antisépticas.",
        image: "/prospectos/apimiel/assets/flora_detail.png",
        origin: "Santa Bárbara, Chile",
        size: "col-span-1 row-span-2",
    },
    {
        title: "Multifloral Premium",
        description: "Arquitectura líquida de mil flores endémicas.",
        image: "/prospectos/apimiel/assets/hero_honey.png",
        origin: "Bosque Endémico",
        size: "col-span-1 row-span-1",
    },
    {
        title: "Origen Santa Bárbara",
        description: "Ubicados en la Capital Nacional de la Miel.",
        image: "/prospectos/apimiel/assets/beehives_landscape.png",
        origin: "Biobío",
        size: "col-span-2 row-span-1",
    },
];

export default function BentoGrid() {
    return (
        <section className="py-24 bg-[#1A1A1A] px-6 md:px-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <h2 className="text-[#D4AF37] font-serif text-4xl md:text-5xl mb-4">Colección de Origen</h2>
                <p className="text-[#FDF5E6]/60 font-light max-w-2xl">
                    Cada variedad es una huella dactilar del ecosistema de Quillaileo.
                    Pureza técnica certificada por la naturaleza.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
                {products.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative overflow-hidden border border-[#D4AF37]/10 bg-[#252525] ${p.size}`}
                    >
                        <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent" />

                        <div className="absolute bottom-0 p-8 w-full">
                            <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase mb-2 block">{p.origin}</span>
                            <h3 className="text-[#FDF5E6] text-2xl font-serif mb-2">{p.title}</h3>
                            <p className="text-xs text-[#FDF5E6]/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {p.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
