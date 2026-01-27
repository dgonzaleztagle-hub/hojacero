'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface ClipPathRevealProps {
    children: React.ReactNode;
    /** Dirección de la revelación */
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'diagonal' | 'circle';
    /** Duración en segundos */
    duration?: number;
    /** Delay antes de iniciar */
    delay?: number;
    /** Clase CSS adicional */
    className?: string;
    /** Si animar cuando entra en viewport */
    triggerOnView?: boolean;
    /** Porcentaje de viewport para trigger */
    viewThreshold?: number;
}

/**
 * ClipPathReveal - Revela contenido con animación de máscara clip-path
 * 
 * Uso básico:
 * <ClipPathReveal>
 *   <img src="/hero.jpg" />
 * </ClipPathReveal>
 * 
 * Avanzado:
 * <ClipPathReveal 
 *   direction="diagonal"
 *   duration={1.2}
 *   delay={0.3}
 * >
 *   <div>Contenido Premium</div>
 * </ClipPathReveal>
 */
export function ClipPathReveal({
    children,
    direction = 'left',
    duration = 1,
    delay = 0,
    className = '',
    triggerOnView = true,
    viewThreshold = 0.3,
}: ClipPathRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: true,
        amount: viewThreshold
    });
    const [shouldAnimate, setShouldAnimate] = useState(!triggerOnView);

    useEffect(() => {
        if (triggerOnView && isInView) {
            setShouldAnimate(true);
        }
    }, [isInView, triggerOnView]);

    // Definir clip-paths según dirección
    const clipPaths = {
        left: {
            hidden: 'inset(0 100% 0 0)',
            visible: 'inset(0 0% 0 0)',
        },
        right: {
            hidden: 'inset(0 0 0 100%)',
            visible: 'inset(0 0 0 0%)',
        },
        top: {
            hidden: 'inset(0 0 100% 0)',
            visible: 'inset(0 0 0% 0)',
        },
        bottom: {
            hidden: 'inset(100% 0 0 0)',
            visible: 'inset(0% 0 0 0)',
        },
        diagonal: {
            hidden: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        },
        circle: {
            hidden: 'circle(0% at 50% 50%)',
            visible: 'circle(150% at 50% 50%)',
        },
    };

    const currentPath = clipPaths[direction];

    return (
        <motion.div
            ref={ref}
            className={`overflow-hidden ${className}`}
            initial={false}
            animate={{
                clipPath: shouldAnimate ? currentPath.visible : currentPath.hidden,
                opacity: 1 // Force full opacity to avoid "ghost" images if observer lags
            }}
            transition={{
                duration,
                delay,
                ease: [0.76, 0, 0.24, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

/**
 * ImageReveal - Preset específico para imágenes con overlay
 */
export function ImageReveal({
    src,
    alt,
    direction = 'left',
    duration = 1.2,
    className = '',
}: {
    src: string;
    alt: string;
    direction?: ClipPathRevealProps['direction'];
    duration?: number;
    className?: string;
}) {
    return (
        <ClipPathReveal direction={direction} duration={duration} className={className}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </ClipPathReveal>
    );
}

export default ClipPathReveal;
