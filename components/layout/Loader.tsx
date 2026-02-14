'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Force load trigger if event doesn't fire quickly
            const timeout = setTimeout(() => setIsVideoLoaded(true), 1500);

            video.onloadeddata = () => {
                clearTimeout(timeout);
                setIsVideoLoaded(true);
            };
        }
    }, []);

    useEffect(() => {
        if (!isVideoLoaded) return;

        const tl = gsap.timeline({
            onComplete: () => {
                if (containerRef.current) containerRef.current.style.display = 'none';
                onComplete();
            }
        });

        // Use a fixed duration for consistency, don't rely solely on video duration
        // as some browsers might report it incorrectly or allow looping.
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 1.0,
            delay: 3.5,
            ease: "power2.inOut"
        });

        // Safety net: Force complete after 5 seconds max
        const safetyTimeout = setTimeout(() => onComplete(), 5000);

        return () => clearTimeout(safetyTimeout);
    }, [isVideoLoaded, onComplete]);

    // Click to skip functionality
    const handleSkip = () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
        onComplete();
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] bg-black flex items-center justify-center cursor-pointer"
            onClick={handleSkip}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain md:object-cover pointer-events-none"
            >
                <source src="/logoanimado.webm" type="video/webm" />
                <source src="/logoanimado_opt.mp4" type="video/mp4" />
                {/* Fallback to original if others fail, though they shouldn't */}
                <source src="/logoanimado.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
