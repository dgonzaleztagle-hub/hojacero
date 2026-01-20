"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BurningRevealProps {
    children: React.ReactNode;
    trigger?: boolean;
    className?: string;
    duration?: number;
}

export function BurningReveal({
    children,
    trigger = true,
    className = "",
    duration = 1.5,
}: BurningRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const filterId = React.useId(); // Unique ID for the SVG filter
    const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
    const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

    useGSAP(() => {
        if (!trigger || !displacementMapRef.current || !turbulenceRef.current) return;

        // Reset initial state
        gsap.set(displacementMapRef.current, { attr: { scale: 100 } });
        gsap.set(containerRef.current, {
            opacity: 0,
            filter: `url(#${filterId}) brightness(0.5)`,
            clipPath: "inset(0% 0% 100% 0%)" // Start hidden from bottom
        });

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" }
        });

        // 1. Reveal content with clip-path (simulating the burn line moving up)
        tl.to(containerRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: duration,
            filter: `url(#${filterId}) brightness(1)`,
        });

        // 2. Animate the turbulence (fire/smoke distortion)
        tl.to(turbulenceRef.current, {
            attr: { baseFrequency: "0.05 0.05" }, // Calm down chaos
            duration: duration,
        }, "<");

        // 3. Reduce displacement scale effectively "cleaning up" the image
        tl.to(displacementMapRef.current, {
            attr: { scale: 0 },
            duration: duration * 0.8,
        }, ">-1.5");

        // 4. Remove filter at the end for performance
        tl.set(containerRef.current, { filter: "none" });

    }, { dependencies: [trigger], scope: containerRef });

    return (
        <div className={`relative ${className}`}>
            {/* Invisible SVG Filter Definition */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id={filterId}>
                        <feTurbulence
                            ref={turbulenceRef}
                            type="fractalNoise"
                            baseFrequency="0.1 0.1"
                            numOctaves="3"
                            result="noise"
                        />
                        <feDisplacementMap
                            ref={displacementMapRef}
                            in="SourceGraphic"
                            in2="noise"
                            scale="50"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <div ref={containerRef} className="will-change-[filter,clip-path,opacity]">
                {children}
            </div>
        </div>
    );
}
