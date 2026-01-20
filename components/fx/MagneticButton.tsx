"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    strength?: number; // How much it moves (distance factor)
    onClick?: () => void;
}

export function MagneticButton({
    children,
    className = "",
    strength = 0.5, // 0.5 means it moves half the distance of the cursor from center
    onClick
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for the movement
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            className={`cursor-pointer inline-block ${className}`}
            whileTap={{ scale: 0.9 }}
        >
            {children}
        </motion.div>
    );
}
