"use client";

import { motion } from "framer-motion";

export default function Productos() {
    const products = [
        {
            name: "Miel de Quillay",
            origin: "Santa Bárbara, Biobío",
            properties: "Alta viscosidad, aroma floral profundo.",
            image: "/prospectos/apimiel/assets/hero_honey.png",
            technical: "Recolección: Noviembre - Diciembre"
        },
        {
            name: "Miel de Avellano",
            origin: "Bosques de Quillaileo",
            properties: "Sabor intenso, notas maderosas, color ámbar oscuro.",
            image: "/prospectos/apimiel/assets/flora_detail.png",
            technical: "Grado de Pureza: 100% Cruda"
        },
        {
            name: "Miel Multifloral Bosque Nativo",
            origin: "Región del Biobío",
            properties: "Mezcla estacional de Arrayán, Corcolen y Litre.",
            image: "/prospectos/apimiel/assets/beehives_landscape.png",
            technical: "Certificación: 100% Orgánica"
        }
    ];

    return (
        <main className="pt-32 pb-24 bg-[#1A1A1A] text-[#FDF5E6]">
            {/* Header Catálogo */}
            <section className="px-6 md:px-24 mb-24">
                <div className="max-w-4xl">
                    <span className="text-xs uppercase tracking-[0.4em] text-[#D4AF37] mb-6 block">Nuestra Cosecha</span>
                    <h1 className="text-6xl md:text-8xl font-serif leading-tight">Colección <br />Atemporal.</h1>
                </div>
            </section>

            {/* Listado de Productos Técnico-Lujo */}
            <section className="px-6 md:px-24 space-y-32">
                {products.map((product, index) => (
                    <div key={product.name} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
                        <div className="flex-1 w-full aspect-[4/5] relative bg-[#2A2A2A] overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-70"
                            />
                        </div>
                        <div className="flex-1 space-y-8">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-[#D4AF37] opacity-60">{product.origin}</span>
                                <h2 className="text-5xl font-serif mt-2 mb-6">{product.name}</h2>
                                <p className="text-lg font-light text-[#FDF5E6]/70 leading-relaxed mb-8">
                                    {product.properties}
                                </p>
                                <div className="p-6 border border-[#FDF5E6]/10 bg-[#2A2A2A]/50">
                                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block mb-2">Especificación Técnica</span>
                                    <p className="text-sm font-mono">{product.technical}</p>
                                </div>
                            </div>
                            <button className="px-8 py-4 bg-[#D4AF37] text-[#1A1A1A] text-xs uppercase tracking-widest font-bold">
                                Ver en Tienda Real
                            </button>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
