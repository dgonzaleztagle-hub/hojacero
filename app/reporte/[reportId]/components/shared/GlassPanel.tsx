'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
    gradient?: string;
}

export function GlassPanel({ children, className = '', gradient }: GlassPanelProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`
                relative overflow-hidden
                bg-white/5 backdrop-blur-xl
                border border-white/10
                rounded-2xl p-8
                hover:bg-white/10 hover:border-white/20
                hover:shadow-2xl hover:shadow-blue-500/10
                transition-all duration-500
                ${className}
            `}
        >
            {/* Gradient overlay */}
            {gradient && (
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 pointer-events-none`}
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
