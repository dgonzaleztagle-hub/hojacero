"use client";

import React from 'react';
import { useFood } from './FoodEngineProvider';
import { motion } from 'framer-motion';

interface SessionStatusProps {
    openText?: string;
    closedText?: string;
    className?: string;
}

export default function SessionStatus({
    openText = "Abierto Ahora",
    closedText = "Modo Catálogo",
    className = ""
}: SessionStatusProps) {
    const { isLocalOpen } = useFood();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-1 rounded-sm text-xs font-black uppercase italic tracking-widest ${className}`}
        >
            <span className={isLocalOpen ? "text-green-500" : "text-gray-400"}>
                {isLocalOpen ? "●" : "○"}
            </span>
            {isLocalOpen ? openText : closedText}
        </motion.div>
    );
}
