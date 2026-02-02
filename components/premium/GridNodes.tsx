'use client';

import React, { useEffect, useRef } from 'react';

/**
 * GridNodes - Estilo Industrial/Arquitectura
 * Líneas ortogonales con nodos que se iluminan al pasar el cursor.
 */
export const GridNodes = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const size = 40;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 0.5;

            for (let x = 0; x < canvas.width; x += size) {
                for (let y = 0; y < canvas.height; y += size) {
                    // Dibujar Grid
                    ctx.beginPath();
                    ctx.strokeRect(x, y, size, size);

                    // Lógica de Nodos
                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.fillStyle = `rgba(201, 162, 39, ${1 - dist / 150})`;
                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fill();

                        // Brillo líneas
                        ctx.strokeStyle = `rgba(201, 162, 39, ${(1 - dist / 150) * 0.2})`;
                        ctx.strokeRect(x, y, size, size);
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full bg-black/40 rounded-xl" />;
};
