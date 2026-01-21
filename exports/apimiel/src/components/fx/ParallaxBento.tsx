"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BentoItemProps {
    className?: string;
    src: string;
    alt?: string;
    title?: string;
    subtitle?: string;
    parallaxSpeed?: number; // 0 = no movement, 1 = super fast
}

export function ParallaxBentoItem({
    className,
    src,
    alt = "",
    title,
    subtitle,
    parallaxSpeed = 0.1
}: BentoItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Calculate parallax movement based on speed
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxSpeed * 100}%`]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]); // Subtle breathing

    return (
        <div ref={ref} className={cn("relative overflow-hidden rounded-3xl group", className)}>
            <motion.div style={{ y, scale }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
            </motion.div>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                {subtitle && (
                    <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                        {subtitle}
                    </span>
                )}
                {title && (
                    <h3 className="text-white text-2xl font-serif translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {title}
                    </h3>
                )}
            </div>
        </div>
    );
}

export function ParallaxBentoGrid({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-8", className)}>
            {children}
        </div>
    );
}
