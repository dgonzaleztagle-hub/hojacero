'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticCursorProps {
    children: React.ReactNode;
    className?: string;
    magneticStrength?: number; // 0.1 to 1, default 0.3
}

/**
 * MagneticCursor - Envuelve elementos para darles efecto magnético al cursor
 * 
 * Uso:
 * <MagneticCursor>
 *   <button>Hover me</button>
 * </MagneticCursor>
 * 
 * Props:
 * - magneticStrength: Fuerza del efecto (0.1 = sutil, 1 = fuerte)
 */
export function MagneticCursor({
    children,
    className = '',
    magneticStrength = 0.3
}: MagneticCursorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * magneticStrength;
        const distanceY = (e.clientY - centerY) * magneticStrength;

        x.set(distanceX);
        y.set(distanceY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            className={`inline-block ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                x: springX,
                y: springY,
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Cursor visual mejorado que reacciona a elementos magnéticos
 * Usar junto con MagneticCursor para efecto completo
 */
export function MagneticCursorDot() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorOuterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current && cursorOuterRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;

                // Outer follows with delay (handled by CSS transition)
                cursorOuterRef.current.style.left = `${e.clientX}px`;
                cursorOuterRef.current.style.top = `${e.clientY}px`;
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-magnetic]') || target.closest('a') || target.closest('button')) {
                cursorRef.current?.classList.add('cursor-hover');
                cursorOuterRef.current?.classList.add('cursor-hover');
            }
        };

        const handleMouseOut = () => {
            cursorRef.current?.classList.remove('cursor-hover');
            cursorOuterRef.current?.classList.remove('cursor-hover');
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <>
            {/* Inner dot */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[9999] w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference transition-transform duration-100 [&.cursor-hover]:scale-[4]"
            />
            {/* Outer ring */}
            <div
                ref={cursorOuterRef}
                className="fixed pointer-events-none z-[9998] w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 mix-blend-difference transition-all duration-300 ease-out [&.cursor-hover]:scale-150 [&.cursor-hover]:border-white/50"
            />
        </>
    );
}

export default MagneticCursor;
