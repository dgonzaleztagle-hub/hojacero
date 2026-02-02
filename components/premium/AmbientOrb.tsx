'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * AmbientOrb - Estilo Bienestar/Salud
 * Una sola masa de luz suave que respira en un rincón.
 */
export const AmbientOrb = () => {
    return (
        <div className="w-full h-full bg-[#020617] rounded-xl flex items-center justify-center overflow-hidden relative">
            {/* Capa 1: Bruma Base Expansiva */}
            <motion.div
                className="absolute w-[150%] h-[150%] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Capa 2: El Orbe Principal de Respiración (Más grande y vibrante) */}
            <motion.div
                className="relative w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.1) 50%, transparent 70%)',
                    filter: 'blur(50px)',
                }}
                animate={{
                    scale: [0.7, 1.4, 0.7],
                    opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Capa 3: Destellos de Luz para Profundidad */}
            <motion.div
                className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)]"
                animate={{
                    x: [0, 60, -60, 0],
                    y: [0, -30, 30, 0],
                    opacity: [0, 0.8, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
};
