'use client';

import React, { useEffect, useRef } from 'react';

/**
 * VortexLines - Estilo Velocidad/Logística
 * Líneas que convergen en un punto de fuga central.
 */
export const VortexLines = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lines: any[] = [];
        const count = 40;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            init();
        };

        const init = () => {
            lines = [];
            for (let i = 0; i < count; i++) {
                lines.push({
                    angle: (Math.PI * 2 / count) * i,
                    length: Math.random() * canvas.width,
                    speed: 1 + Math.random() * 2,
                    opacity: Math.random()
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            lines.forEach(l => {
                l.length -= l.speed;
                if (l.length < 0) l.length = canvas.width;

                const x1 = cx + Math.cos(l.angle) * l.length;
                const y1 = cy + Math.sin(l.angle) * l.length;
                const x2 = cx + Math.cos(l.angle) * (l.length + 50);
                const y2 = cy + Math.sin(l.angle) * (l.length + 50);

                ctx.strokeStyle = `rgba(255, 255, 255, ${l.opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });

            requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full bg-[#050505] rounded-xl z-0" />;
};
