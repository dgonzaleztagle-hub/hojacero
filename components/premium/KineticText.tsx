'use client';

import { useEffect, useRef } from 'react';
// @ts-expect-error - splitting no tiene tipos
import Splitting from 'splitting';

interface KineticTextProps {
    /** Texto a animar */
    text: string;
    /** Clase CSS adicional */
    className?: string;
    /** Tag HTML a usar */
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
    /** Tipo de split: chars, words, o lines */
    splitBy?: 'chars' | 'words' | 'lines';
    /** Delay entre cada elemento (en segundos) */
    stagger?: number;
    /** Duración de la animación (en segundos) */
    duration?: number;
    /** Estilo de animación */
    animation?: 'fade-up' | 'fade-in' | 'scale' | 'blur' | 'wave';
}

/**
 * KineticText - Tipografía cinética con Splitting.js
 * 
 * Uso básico:
 * <KineticText text="Hello World" />
 * 
 * Avanzado:
 * <KineticText 
 *   text="Premium Design" 
 *   as="h1"
 *   splitBy="chars"
 *   animation="wave"
 *   stagger={0.05}
 * />
 */
export function KineticText({
    text,
    className = '',
    as: Tag = 'div',
    splitBy = 'chars',
    stagger = 0.03,
    duration = 0.6,
    animation = 'fade-up',
}: KineticTextProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        // Aplicar Splitting
        const result = Splitting({
            target: ref.current,
            by: splitBy,
        });

        // Aplicar animación con CSS custom properties
        const elements = ref.current.querySelectorAll(`[data-${splitBy.slice(0, -1)}]`);

        elements.forEach((el, i) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.setProperty('--char-index', String(i));
            htmlEl.style.setProperty('--stagger', `${i * stagger}s`);
            htmlEl.style.setProperty('--duration', `${duration}s`);
            htmlEl.classList.add(`kinetic-${animation}`);
        });

        return () => {
            // Cleanup
            if (ref.current) {
                ref.current.innerHTML = text;
            }
        };
    }, [text, splitBy, stagger, duration, animation]);

    return (
        <>
            <style jsx global>{`
        .kinetic-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: kineticFadeUp var(--duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--stagger);
        }
        
        .kinetic-fade-in {
          opacity: 0;
          animation: kineticFadeIn var(--duration) ease-out forwards;
          animation-delay: var(--stagger);
        }
        
        .kinetic-scale {
          opacity: 0;
          transform: scale(0.5);
          animation: kineticScale var(--duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: var(--stagger);
        }
        
        .kinetic-blur {
          opacity: 0;
          filter: blur(10px);
          animation: kineticBlur var(--duration) ease-out forwards;
          animation-delay: var(--stagger);
        }
        
        .kinetic-wave {
          animation: kineticWave 2s ease-in-out infinite;
          animation-delay: calc(var(--char-index) * 0.1s);
        }
        
        @keyframes kineticFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes kineticFadeIn {
          to { opacity: 1; }
        }
        
        @keyframes kineticScale {
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes kineticBlur {
          to { opacity: 1; filter: blur(0); }
        }
        
        @keyframes kineticWave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
            <Tag
                ref={ref as any}
                className={`splitting ${className}`}
                data-splitting
            >
                {text}
            </Tag>
        </>
    );
}

export default KineticText;
