"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface EditorialRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    mode?: "lines" | "words"; // Future proofing
}

export function EditorialReveal({
    children,
    className = "",
    delay = 0
}: EditorialRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                variants={{
                    hidden: { y: "110%", rotateZ: 2 },
                    visible: {
                        y: "0%",
                        rotateZ: 0,
                        transition: {
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1], // "Expo Out"ish - muy elegante
                            delay: delay
                        }
                    }
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="origin-top-left will-change-transform"
            >
                {children}
            </motion.div>
        </div>
    );
}

// Wrapper para orquestar múltiples líneas
export function EditorialFlow({ children, gap = 0.1, className = "" }: { children: React.ReactNode[], gap?: number, className?: string }) {
    return (
        <div className={className}>
            {React.Children.map(children, (child, i) => (
                <EditorialReveal delay={i * gap}>
                    {child}
                </EditorialReveal>
            ))}
        </div>
    );
}
