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
            video.onloadeddata = () => setIsVideoLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isVideoLoaded) return;

        const tl = gsap.timeline({
            onComplete: () => {
                if (containerRef.current) {
                    containerRef.current.style.display = 'none';
                }
                onComplete();
            }
        });

        // Play video for a bit, then fade out
        // Assuming video length is short or we cut it. 
        // Let's fade out after 3 seconds or when video ends.

        // Simulating sequence
        tl.to(containerRef.current, {
            opacity: 0,
            duration: 1.5,
            delay: 3.5, // Adjust based on video length
            ease: "power2.inOut"
        });

    }, [isVideoLoaded, onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                src="/logoanimado.mp4"
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    );
}
