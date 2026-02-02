'use client';

import React, { useEffect, useRef } from 'react';

interface WaveLinesProps {
    color?: string;
    opacity?: number;
    count?: number;
    speed?: number;
    fixed?: boolean;
}

/**
 * WaveLines - Genera ondas geométricas definidas (Abstract Wave Lines)
 * Basado en la referencia visual de Daniel.
 */
export const WaveLines = ({
    color = 'rgba(201, 162, 39, 0.3)',
    opacity = 0.5,
    count = 5,
    speed = 0.002,
    fixed = false // Added fixed prop with default value
}: WaveLinesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let t = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth || window.innerWidth; // Modified resize logic
            canvas.height = canvas.offsetHeight || window.innerHeight; // Modified resize logic
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < count; i++) {
                ctx.beginPath();

                // Lógica de "Cinta": Las líneas centrales son más fuertes
                const centerDist = Math.abs(i - count / 2) / (count / 2); // 0 en el centro, 1 en los bordes
                const lineOpacity = (1 - centerDist) * opacity;
                const lineWidth = (1.5 - centerDist) * 2;

                ctx.strokeStyle = i % 3 === 0 ? color : 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = lineWidth;
                ctx.shadowBlur = (1 - centerDist) * 10; // Modified shadowBlur
                ctx.shadowColor = color;
                ctx.globalAlpha = lineOpacity;

                // Offset concentrado (no repartido por toda la pantalla)
                const offset = (i - count / 2) * 15;

                for (let x = 0; x <= canvas.width; x += 5) {
                    const amp = canvas.height > 0 ? canvas.height * 0.2 : 60;
                    const freq = 0.002 + (i * 0.0001);

                    const y =
                        canvas.height / 2 +
                        Math.sin(x * freq + t + i * 0.2) * amp +
                        Math.sin(x * 0.001 + t * 0.5) * (amp / 2);

                    if (x === 0) ctx.moveTo(x, y + offset);
                    else ctx.lineTo(x, y + offset);
                }
                ctx.stroke();
            }

            t += speed;
            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [color, opacity, count, speed, fixed]);

    return (
        <canvas
            ref={canvasRef}
            className={`${fixed ? 'fixed inset-0 -z-50' : 'absolute inset-0 w-full h-full z-0'} pointer-events-none`}
        />
    );
};

export default WaveLines;
