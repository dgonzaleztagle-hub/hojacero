"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Carousel3D from "../components/Carousel3D";

// Data de productos (Reutilizada)
const products = [
    {
        id: "avellano",
        name: "Avellano & Guindo Santo",
        price: "$12.990",
        image: "/prospectos/apimiel/assets/products/avellano_natural.png",
        tag: "Limitada"
    },
    {
        id: "quillay",
        name: "Quillay Endémico",
        price: "$10.990",
        image: "/prospectos/apimiel/assets/products/quillay_natural.png",
        tag: "Best Seller"
    },
    {
        id: "multifloral",
        name: "Multiflora de Montaña",
        price: "$8.990",
        image: "/prospectos/apimiel/assets/products/multifloral_natural.png",
        tag: "Esencial"
    },
    {
        id: "ulmo",
        name: "Ulmo Valdiviano",
        price: "$11.990",
        image: "/prospectos/apimiel/assets/products/ulmo_natural.png",
        tag: "Premium"
    },
    {
        id: "raps",
        name: "Crema de Raps",
        price: "$9.990",
        image: "/prospectos/apimiel/assets/products/raps_natural.png",
        tag: null
    },
    {
        id: "hierba_azul",
        name: "Hierba Azul",
        price: "$13.990",
        image: "/prospectos/apimiel/assets/products/hierba_azul_natural.png",
        tag: "Exclusiva"
    }
];

export default function ProductosPage() {
    const [view, setView] = useState<'3d' | 'grid'>('3d');

    return (
        <main className="min-h-screen pt-32 bg-[#0A0A0A] text-[#FDF5E6] flex flex-col items-center overflow-x-hidden">

            <section className="w-full max-w-[1400px] px-4 flex flex-col items-center">

                {/* Header & Controls */}
                <div className="w-full flex flex-col md:flex-row items-end justify-between mb-8 border-b border-[#D4AF37]/30 pb-4">
                    <div className="mb-4 md:mb-0">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-2 block font-medium">Boutique</span>
                        <h1 className="text-3xl md:text-5xl font-serif">La Colección</h1>
                    </div>

                    {/* Switcher Controls */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setView('3d')}
                            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300 ${view === '3d'
                                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10Shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                    : 'border-[#D4AF37]/20 text-[#D4AF37]/50 hover:border-[#D4AF37]/50'
                                }`}
                        >
                            Vista Inmersiva 3D
                        </button>
                        <button
                            onClick={() => setView('grid')}
                            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300 ${view === 'grid'
                                    ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                    : 'border-[#D4AF37]/20 text-[#D4AF37]/50 hover:border-[#D4AF37]/50'
                                }`}
                        >
                            Catálogo
                        </button>
                    </div>
                </div>

                {/* Content Switching */}
                <div className="w-full min-h-[600px] relative">
                    <AnimatePresence mode="wait">

                        {view === '3d' ? (
                            <motion.div
                                key="3d"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                            >
                                <Carousel3D />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full"
                            >
                                {/* Grid Aprobado (Hard Cap 220px) */}
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-32 justify-items-center mt-12">
                                    {products.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1, duration: 0.4 }}
                                            className="group flex flex-col w-full max-w-[220px]"
                                        >
                                            {/* Card Imagen */}
                                            <div className="relative aspect-square w-full mb-5 rounded-lg overflow-hidden border border-[#D4AF37]/10 group-hover:border-[#D4AF37]/40 transition-all duration-500 shadow-md">
                                                {product.tag && (
                                                    <div className="absolute top-2 right-2 z-20">
                                                        <span className="text-[7px] font-bold uppercase tracking-wider bg-[#0A0A0A]/80 backdrop-blur-sm text-[#D4AF37] border border-[#D4AF37]/50 px-2 py-0.5 rounded-sm">
                                                            {product.tag}
                                                        </span>
                                                    </div>
                                                )}
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
                                                    sizes="220px"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="text-center px-1">
                                                <h3 className="text-xs font-bold text-[#FDF5E6] leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors min-h-[2.5em] flex items-center justify-center">
                                                    {product.name}
                                                </h3>
                                                <div className="text-xs font-serif text-[#D4AF37] opacity-80">
                                                    {product.price}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}
