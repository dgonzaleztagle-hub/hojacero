'use client';

import { useEffect, useRef } from 'react';

// ============================================================================
// MESH GRADIENT - Formas orgánicas que mutan lentamente
// Inspirado en Linear, Stripe, y diseños premium modernos
// ============================================================================

export default function MeshGradient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        // Configuración de los blobs
        const blobs = [
            { x: 0.3, y: 0.3, radius: 0.4, color: 'rgba(0, 240, 255, 0.15)', speed: 0.0003, phase: 0 },
            { x: 0.7, y: 0.6, radius: 0.35, color: 'rgba(139, 92, 246, 0.12)', speed: 0.0004, phase: 2 },
            { x: 0.5, y: 0.8, radius: 0.3, color: 'rgba(6, 182, 212, 0.1)', speed: 0.0002, phase: 4 },
            { x: 0.2, y: 0.7, radius: 0.25, color: 'rgba(255, 255, 255, 0.05)', speed: 0.0005, phase: 1 },
            { x: 0.8, y: 0.2, radius: 0.3, color: 'rgba(34, 211, 238, 0.08)', speed: 0.00035, phase: 3 },
        ];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawBlob = (
            x: number,
            y: number,
            radius: number,
            color: string,
            wobble: number
        ) => {
            const centerX = x * canvas.width;
            const centerY = y * canvas.height;
            const r = radius * Math.min(canvas.width, canvas.height);

            // Crear gradiente radial con wobble
            const gradient = ctx.createRadialGradient(
                centerX + Math.sin(wobble) * 50,
                centerY + Math.cos(wobble * 0.7) * 50,
                0,
                centerX,
                centerY,
                r
            );

            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, '0.05)'));
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();

            // Forma orgánica usando curvas de Bezier
            const points = 8;
            const angleStep = (Math.PI * 2) / points;

            for (let i = 0; i <= points; i++) {
                const angle = i * angleStep;
                const wobbleRadius = r * (1 + 0.2 * Math.sin(wobble * 2 + i * 0.5));
                const px = centerX + Math.cos(angle) * wobbleRadius;
                const py = centerY + Math.sin(angle) * wobbleRadius;

                if (i === 0) {
                    ctx.moveTo(px, py);
                } else {
                    const prevAngle = (i - 1) * angleStep;
                    const prevWobbleRadius = r * (1 + 0.2 * Math.sin(wobble * 2 + (i - 1) * 0.5));
                    const cpx = centerX + Math.cos(prevAngle + angleStep / 2) * wobbleRadius * 1.1;
                    const cpy = centerY + Math.sin(prevAngle + angleStep / 2) * wobbleRadius * 1.1;
                    ctx.quadraticCurveTo(cpx, cpy, px, py);
                }
            }

            ctx.closePath();
            ctx.fill();
        };

        const animate = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo base
            ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dibujar cada blob con su animación
            blobs.forEach((blob) => {
                const wobble = time * blob.speed + blob.phase;
                const offsetX = Math.sin(wobble) * 0.1;
                const offsetY = Math.cos(wobble * 0.8) * 0.1;

                drawBlob(
                    blob.x + offsetX,
                    blob.y + offsetY,
                    blob.radius + Math.sin(wobble * 1.5) * 0.05,
                    blob.color,
                    wobble
                );
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
            style={{
                opacity: 0.8,
                filter: 'blur(80px)',
            }}
        />
    );
}
