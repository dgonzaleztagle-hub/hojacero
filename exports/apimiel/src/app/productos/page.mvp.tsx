"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const products = [
    {
        id: "avellano",
        name: "Avellano & Guindo Santo",
        price: "$12.990",
        image: "/prospectos/apimiel/assets/products/avellano.jpg",
        tag: "Limitada"
    },
    {
        id: "quillay",
        name: "Quillay Endémico",
        price: "$10.990",
        image: "/prospectos/apimiel/assets/products/quillay.jpg",
        tag: "Best Seller"
    },
    {
        id: "multifloral",
        name: "Multiflora de Montaña",
        price: "$8.990",
        image: "/prospectos/apimiel/assets/products/multifloral.jpg",
        tag: "Esencial"
    },
    {
        id: "ulmo",
        name: "Ulmo Valdiviano",
        price: "$11.990",
        image: "/prospectos/apimiel/assets/products/quillay.jpg", // Placeholder
        tag: "Premium"
    },
    {
        id: "raps",
        name: "Crema de Raps",
        price: "$9.990",
        image: "/prospectos/apimiel/assets/products/quillay.jpg", // Placeholder
        tag: null
    },
    {
        id: "hierba_azul",
        name: "Hierba Azul",
        price: "$13.990",
        image: "/prospectos/apimiel/assets/products/quillay.jpg", // Placeholder
        tag: "Exclusiva"
    }
];

export default function ProductosPage() {
    return (
        <main className="min-h-screen pt-32 bg-[#0A0A0A] text-[#FDF5E6] flex flex-col items-center">

            {/* Contenedor Contenido para evitar expansión */}
            <section className="w-full max-w-5xl px-6">

                {/* Header Compacto */}
                <div className="flex items-center justify-between mb-8 border-b border-[#D4AF37]/20 pb-4">
                    <h1 className="text-xl md:text-2xl font-serif">Colección 2025</h1>
                    <span className="text-[9px] uppercase tracking-[0.3em] opacity-40">6 Variedades • Quick View</span>
                </div>

                {/* Grid: 3 cols en móvil, 6 cols en tablet/desktop */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className="group flex flex-col"
                        >
                            {/* Card Cuadrada Pequeña (~150px) */}
                            <div className="relative aspect-square w-full overflow-hidden bg-[#151515] mb-2 rounded-lg border border-[#D4AF37]/10 group-hover:border-[#D4AF37]/50 transition-all duration-300 cursor-pointer">
                                {product.tag && (
                                    <div className="absolute top-1 right-1 z-20">
                                        <span className="text-[5px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#0A0A0A] px-1 py-0.5 rounded-sm">
                                            {product.tag}
                                        </span>
                                    </div>
                                )}
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 33vw, 16vw"
                                />
                                {/* Overlay sutil */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>

                            {/* Info Nano */}
                            <div className="text-left px-1">
                                <h3 className="text-[10px] md:text-xs font-bold text-[#FDF5E6] leading-tight mb-0.5 group-hover:text-[#D4AF37] transition-colors truncate">
                                    {product.name}
                                </h3>
                                <div className="text-[9px] font-light opacity-60">
                                    {product.price}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
