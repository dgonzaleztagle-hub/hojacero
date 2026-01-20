"use client";

import React, { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import Image from "next/image";

const products = [
    { id: 1, img: "/prospectos/apimiel/assets/products/avellano_natural.png", title: "Avellano" },
    { id: 2, img: "/prospectos/apimiel/assets/products/quillay_natural.png", title: "Quillay" },
    { id: 3, img: "/prospectos/apimiel/assets/products/multifloral_natural.png", title: "Multiflora" },
    { id: 4, img: "/prospectos/apimiel/assets/products/ulmo_natural.png", title: "Ulmo" },
    { id: 5, img: "/prospectos/apimiel/assets/products/raps_natural.png", title: "Raps" },
    { id: 6, img: "/prospectos/apimiel/assets/products/hierba_azul_natural.png", title: "Hierba Azul" },
];

const RADIUS = 380;

export default function Carousel3D() {
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Auto-rotación suave
    useEffect(() => {
        if (!isDragging) {
            const interval = setInterval(() => {
                setRotation((prev) => prev - 0.2);
            }, 16);
            return () => clearInterval(interval);
        }
    }, [isDragging]);

    const handleDrag = (_: any, info: PanInfo) => {
        const delta = info.delta.x * 0.5;
        // Invertimos el delta para que el arrastre se sienta natural (arrastras la superficie)
        setRotation((prev) => prev + delta);
    };

    return (
        <div className="relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden py-20">

            {/* Header Flotante del Componente */}
            <div className="absolute top-10 z-10 text-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] block mb-2 opacity-80">
                    Vista 360°
                </span>
            </div>

            {/* Capa de Interacción (Drag Proxy) - INVISIBLE pero capturable */}
            {/* Esta capa cubre toda la zona del carrusel para capturar el drag sin mover el visual */}
            <motion.div
                className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} // IMPORTANTE: Constraints 0 para que no se mueva el proxy tampoco (o muy poco)
                dragElastic={0} // Sin elasticidad
                dragMomentum={false} // Sin inercia extraña del drag
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onDrag={handleDrag}
                style={{ touchAction: "none" }} // Prevenir scroll en móviles mientras tocas el carrusel
            />

            {/* Escena 3D - VISUAL (Ya no tiene drag props) */}
            <div
                className="relative w-full h-full flex items-center justify-center pointer-events-none" // pointer-events-none para que el drag pase al Proxy si estuvieran solapados
                style={{ perspective: "1500px" }}
            >
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Contenedor Giratorio Visual */}
                    <motion.div
                        className="relative w-[220px] h-[300px]"
                        animate={{ rotateY: rotation }}
                        transition={{ type: "tween", ease: "linear", duration: 0 }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {products.map((product, i) => {
                            const angle = (360 / products.length) * i;

                            return (
                                <div
                                    key={product.id}
                                    className="absolute inset-0 w-full h-full"
                                    style={{
                                        transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                                        transformStyle: "preserve-3d"
                                    }}
                                >
                                    {/* Card 3D */}
                                    <div className="group relative w-full h-full bg-[#111] border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-2xl transition-all duration-500">

                                        {/* Imagen */}
                                        <div className="relative w-full h-[80%]">
                                            <Image
                                                src={product.img}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/10 opacity-50" />
                                        </div>

                                        {/* Footer Card */}
                                        <div className="absolute bottom-0 w-full h-[20%] bg-[#0A0A0A]/90 flex items-center justify-center border-t border-[#D4AF37]/10">
                                            <span className="text-[#FDF5E6] font-serif text-sm tracking-wide transition-colors">
                                                {product.title}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Reflejo Piso */}
                                    <div
                                        className="absolute -bottom-[60px] w-full h-full opacity-30 blur-sm transform scale-y-[-1]"
                                        style={{
                                            background: `linear-gradient(to top, transparent, black)`,
                                            maskImage: `linear-gradient(to bottom, black, transparent)`
                                        }}
                                    >
                                        <Image
                                            src={product.img}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            <p className="text-[#D4AF37]/30 text-[10px] uppercase tracking-widest animate-pulse absolute bottom-10">
                ← Arrastra →
            </p>
        </div>
    );
}
