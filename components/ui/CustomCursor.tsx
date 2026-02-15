'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ============================================================================
// CUSTOM CURSOR — COMET TRAIL (CANVAS)
// Cola gruesa que nace del cursor y termina en punta
// ============================================================================

const TRAIL_MAX = 18;
const CURSOR_SIZE = 20; // px — diámetro del cursor DOM (w-5 h-5 = 20px)

interface TrailPoint {
    x: number;
    y: number;
}

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trail = useRef<TrailPoint[]>([]);
    const rafId = useRef<number>(0);

    useEffect(() => {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

        const cursor = cursorRef.current;
        const canvas = canvasRef.current;
        if (!cursor || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // --- Mouse Move ---
        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.12,
                ease: 'power2.out',
            });

            trail.current.unshift({ x: e.clientX, y: e.clientY });
            if (trail.current.length > TRAIL_MAX) {
                trail.current.pop();
            }
        };

        // --- Render ---
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const points = trail.current;
            if (points.length < 3) {
                rafId.current = requestAnimationFrame(render);
                return;
            }

            // Dibujar cola como segmentos gruesos que se adelgazan
            for (let i = 1; i < points.length; i++) {
                const prev = points[i - 1];
                const curr = points[i];
                const progress = i / points.length; // 0 = cabeza, 1 = punta

                // Grosor: arranca como el cursor y termina en 0
                const width = CURSOR_SIZE * (1 - progress);
                // Opacidad: arranca fuerte y muere
                const alpha = (1 - progress) * 0.5;

                if (width < 0.3 || alpha <= 0) continue;

                ctx.beginPath();
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(curr.x, curr.y);
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                ctx.lineWidth = width;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }

            // Glow difuso en la cabeza
            const head = points[0];
            const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, CURSOR_SIZE * 1.2);
            glow.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            glow.addColorStop(0.4, 'rgba(0, 240, 255, 0.08)');
            glow.addColorStop(1, 'rgba(0, 240, 255, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(head.x, head.y, CURSOR_SIZE * 1.2, 0, Math.PI * 2);
            ctx.fill();

            rafId.current = requestAnimationFrame(render);
        };
        rafId.current = requestAnimationFrame(render);

        // --- Hover states ---
        const navLinks = document.querySelectorAll('a, button, .hover-trigger');

        const onMouseEnter = () => {
            gsap.to(cursor, {
                scale: 2,
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderColor: 'transparent',
                duration: 0.3,
            });
        };

        const onMouseLeave = () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#00f0ff',
                duration: 0.3,
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        navLinks.forEach((link) => {
            link.addEventListener('mouseenter', onMouseEnter);
            link.addEventListener('mouseleave', onMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId.current);
            navLinks.forEach((link) => {
                link.removeEventListener('mouseenter', onMouseEnter);
                link.removeEventListener('mouseleave', onMouseLeave);
            });
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-[9998]"
                style={{ mixBlendMode: 'screen' }}
            />
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-5 h-5 rounded-full border border-accent pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />
        </>
    );
}
