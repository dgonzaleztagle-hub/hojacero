"use client";

import { motion, MotionProps } from "framer-motion";
import React from "react";

interface StaggerProps extends MotionProps {
    children: React.ReactNode;
    delay?: number;
    staggerBase?: number;
    className?: string;
}

// 1. El Contenedor: Orquesta el tiempo
export function StaggerContainer({
    children,
    delay = 0,
    staggerBase = 0.08,
    className = "",
    ...props
}: StaggerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: staggerBase,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
            style={{ perspective: "1000px" }} // Add depth for 3D children
            {...props}
        >
            {children}
        </motion.div>
    );
}

// 2. El Item: Obedece al contenedor
export function StaggerItem({
    children,
    className = "",
    yOffset = 50,
    duration = 0.8
}: {
    children: React.ReactNode,
    className?: string,
    yOffset?: number,
    duration?: number
}) {
    return (
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    y: yOffset,
                    rotateX: 15, // Tilt back
                    scale: 0.95,
                    filter: "blur(8px)"
                },
                show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                        type: "spring",
                        bounce: 0.3,
                        duration: 1.2
                    }
                },
            }}
            className={`will-change-transform ${className}`} // Performance hint
        >
            {children}
        </motion.div>
    );
}
