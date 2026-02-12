"use client";

import { motion } from "framer-motion";

interface LogoAcargooProps {
    variant?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    showTagline?: boolean;
}

export default function LogoAcargoo({
    variant = 'dark',
    size = 'md',
    showTagline = true
}: LogoAcargooProps) {
    const isDark = variant === 'dark';

    const sizes = {
        sm: { svg: 30, text: 'text-xl', tagline: 'text-[7px]' },
        md: { svg: 45, text: 'text-3xl', tagline: 'text-[9px]' },
        lg: { svg: 60, text: 'text-5xl', tagline: 'text-sm' }
    };

    const currentSize = sizes[size];
    const principalColor = isDark ? '#ffffff' : '#1e3a5f';
    const accentColor = '#ff9900';

    return (
        <div className="flex items-center gap-3">
            <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative shrink-0"
            >
                {/* A estilizada */}
                <svg width={currentSize.svg} height={currentSize.svg} viewBox="0 0 100 100" fill="none">
                    <path
                        d="M50 10L80 90H65L60 75H40L35 90H20L50 10Z M45 60H55L50 40L45 60Z"
                        fill={principalColor}
                    />
                    <motion.path
                        d="M85 85 Q 90 80, 95 85"
                        stroke={accentColor}
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    />
                </svg>
            </motion.div>
            <div>
                <h1 className={`${currentSize.text} font-bold tracking-tight mb-0 leading-none`} style={{ color: principalColor }}>
                    carg<span style={{ color: accentColor }}>oo+</span>
                </h1>
                {showTagline && (
                    <p className={`${currentSize.tagline} font-black uppercase tracking-[0.3em] mt-1 opacity-50`} style={{ color: principalColor }}>
                        Logistics Solutions
                    </p>
                )}
            </div>
        </div>
    );
}
