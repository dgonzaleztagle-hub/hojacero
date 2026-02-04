import React, { useRef, useEffect, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Utility for Tailwind class merging (HojaCero style) */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface StackingCardsProps {
    children?: ReactNode;
    items?: any[];
    renderItem?: (item: any, index: number) => ReactNode;
    cardHeight?: string;
    stackOffset?: number;
    className?: string;
    cardClassName?: string;
    scaleEffect?: boolean;
    scaleAmount?: number;
    backgroundColor?: string;
    borderRadius?: number;
    shadow?: string;
    onCardEnter?: (index: number) => void;
    baseZIndex?: number;
}

/**
 * STACKING CARDS (Kimi Edition)
 * A premium scroll-triggered stacking effect refined for HojaCero.
 */
export const StackingCards: React.FC<StackingCardsProps> = ({
    children,
    items,
    renderItem,
    cardHeight = '100vh',
    stackOffset = 20,
    className,
    cardClassName,
    scaleEffect = true,
    scaleAmount = 0.05,
    backgroundColor = 'transparent',
    borderRadius = 32,
    shadow = '0 25px 80px rgba(0, 0, 0, 0.15)',
    onCardEnter,
    baseZIndex = 10,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const cardsToRender = items && renderItem
        ? items.map((item, index) => renderItem(item, index))
        : React.Children.toArray(children);

    useEffect(() => {
        if (!containerRef.current) return;

        const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
        if (cards.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = cards.indexOf(entry.target as HTMLDivElement);
                        onCardEnter?.(index);
                    }
                });
            },
            { threshold: 0.5 }
        );

        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, [onCardEnter, cardsToRender.length]);

    return (
        <div
            ref={containerRef}
            className={cn('relative w-full', className)}
            style={{ backgroundColor }}
        >
            {cardsToRender.map((cardContent, index) => {
                const isLast = index === cardsToRender.length - 1;
                // NEW: Z-Index increases with index so NEW cards are ON TOP
                const zIndex = baseZIndex + index;
                // NEW: Each card sticks slightly below the previous one to see the "stack"
                const topOffset = index * stackOffset;

                return (
                    <div
                        key={index}
                        ref={(el) => { cardRefs.current[index] = el; }}
                        className="sticky w-full flex items-center justify-center p-4 sm:p-8"
                        style={{
                            top: `${topOffset}px`,
                            height: `calc(${cardHeight} - ${topOffset}px)`,
                            zIndex,
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true, margin: "-10%" }}
                            className={cn(
                                'w-full max-w-6xl mx-auto overflow-hidden',
                                'transition-all duration-500 ease-out h-full',
                                cardClassName
                            )}
                            style={{
                                borderRadius: `${borderRadius}px`,
                                boxShadow: shadow,
                                // En este modo, la escala es 1 para todos al llegar, o ajustamos para profundidad
                            }}
                        >
                            {cardContent}
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
};

export default StackingCards;
