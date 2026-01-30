"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const AnalyticalPulse = () => {
    // Configuración del Cromatograma para que sea consistente
    const width = 1400;
    const height = 200;

    const pathData = useMemo(() => {
        let d = "M 0 100 ";
        const points = 120;

        for (let i = 1; i <= points; i++) {
            const x = (i / points) * width;
            let y = 100;

            // Picos estratégicos (Rigor Analítico)
            if (i > 15 && i < 25) y = 100 - Math.sin((i - 15) * 0.3) * 60; // Pico 1
            if (i > 40 && i < 55) y = 100 - Math.sin((i - 40) * 0.2) * 40; // Pico 2
            if (i > 65 && i < 85) y = 100 - Math.sin((i - 65) * 0.15) * 85; // Pico principal WOW
            if (i > 95 && i < 110) y = 100 - Math.sin((i - 95) * 0.25) * 30; // Pico final

            const noise = Math.sin(i * 0.5) * 2;
            d += `L ${x} ${y + noise} `;
        }
        return d;
    }, []);

    return (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 h-[400px] pointer-events-none overflow-hidden flex items-center">

            {/* --- EL GLOW AMBIENTAL (Sigue al scanner) --- */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(195,0,29,0.1) 0%, transparent 70%)",
                    filter: "blur(60px)",
                    top: "50%",
                    left: "-300px",
                    y: "-50%"
                }}
                animate={{
                    x: [0, width + 600],
                    opacity: [0, 1, 1, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5
                }}
            />

            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full opacity-60 scale-y-125"
                preserveAspectRatio="none"
            >
                {/* Capa 1: El resplandor difuminado (Glow profundo) */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#C3001D"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    style={{ filter: "blur(20px)" }}
                />

                {/* Capa 2: La energía secundaria */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#C3001D"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    style={{ filter: "blur(4px)" }}
                />

                {/* Capa 3: El Núcleo Blanco Láser (Pura precisión) */}
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                />

                {/* EL CABEZAL DE ESCANEO (Energy Head) */}
                <motion.g
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                    style={{ offsetPath: `path('${pathData}')` }}
                >
                    {/* Destello central */}
                    <circle r="4" fill="#fff" className="shadow-[0_0_15px_#fff]" />
                    <circle r="12" fill="rgba(195,0,29,0.3)" />

                    {/* Partículas de rastro sutiles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.circle
                            key={i}
                            r={Math.random() * 2}
                            fill="#C3001D"
                            animate={{
                                x: [0, (Math.random() - 0.5) * 40],
                                y: [0, (Math.random() - 0.5) * 40],
                                opacity: [1, 0],
                                scale: [1, 0]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1
                            }}
                        />
                    ))}
                </motion.g>
            </svg>

            {/* GRID DE DATOS REACCIONANDO AL FONDO */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#C3001D_1px,transparent_1px),linear-gradient(to_bottom,#C3001D_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Gradientes laterales para suavizar el corte del video */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0B1F3A] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0B1F3A] to-transparent z-10" />
        </div>
    );
};
