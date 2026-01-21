'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out',
            });
        };

        const navLinks = document.querySelectorAll('a, button, .hover-trigger');

        const onMouseEnter = () => {
            gsap.to(cursor, { scale: 2.5, backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: 'transparent', duration: 0.3 });
            cursor.classList.add('mixing');
        };

        const onMouseLeave = () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', borderColor: '#00f0ff', duration: 0.3 });
            cursor.classList.remove('mixing');
        };

        window.addEventListener('mousemove', onMouseMove);
        navLinks.forEach((link) => {
            link.addEventListener('mouseenter', onMouseEnter);
            link.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            navLinks.forEach((link) => {
                link.removeEventListener('mouseenter', onMouseEnter);
                link.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        />
    );
}
