'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file, if not I'll define cn inline or use basic template literals

interface BeforeAfterSliderProps {
    imageBefore: string;
    imageAfter: string;
    labelBefore?: string;
    labelAfter?: string;
    altBefore?: string;
    altAfter?: string;
    className?: string;
    initialProgress?: number; // 0 to 100
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    imageBefore,
    imageAfter,
    labelBefore = "BEFORE",
    labelAfter = "HOJACERO VISION",
    altBefore = "Before design",
    altAfter = "After design",
    className,
    initialProgress = 50
}) => {
    const [sliderPosition, setSliderPosition] = useState(initialProgress);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
        }
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
        if (isDragging) {
            handleMove(e.clientX);
        }
    }, [isDragging, handleMove]);

    const onTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
        if (isDragging) {
            handleMove(e.touches[0].clientX);
        }
    }, [isDragging, handleMove]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove);
            window.addEventListener('touchend', onMouseUp);
        } // Removed return cleanup here because we want to remove listeners even if isDragging changes to false? No, wait. 
        // If isDragging is true, we add. If it becomes false, we need to remove.
        // So return cleanup IS needed but should reference the SAME functions.

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onMouseUp);
        };
    }, [isDragging, onMouseMove, onTouchMove, onMouseUp]);

    const handleClick = (e: React.MouseEvent) => {
        handleMove(e.clientX);
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden select-none group cursor-col-resize", className)}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            onClick={handleClick}
        >
            {/* Background Image (BEFORE) */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={imageBefore}
                    alt={altBefore}
                    fill
                    className="object-cover object-top filter grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                {/* Label Before */}
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                        {labelBefore}
                    </span>
                </div>
            </div>

            {/* Foreground Image (AFTER) - Clipped */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={imageAfter}
                    alt={altAfter}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                {/* Label After */}
                <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-cyan-950/50 backdrop-blur-md rounded-full border border-cyan-500/20">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase glow-text">
                        {labelAfter}
                    </span>
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-col-resize z-20 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-black border border-cyan-400 shadow-lg transition-transform hover:scale-110 active:scale-95">
                    <MoveHorizontal className="w-4 h-4 text-cyan-400" />
                </div>
            </div>
        </div>
    );
};
