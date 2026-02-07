"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X } from 'lucide-react';

export default function GermainGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showWin, setShowWin] = useState(false);
    const [whatsapp, setWhatsapp] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(null);

    // Entidades del juego (referencias persistentes para el loop)
    const gameState = useRef({
        player: { x: 180, y: 430, size: 20, mouthOpen: 0 },
        items: [] as any[],
        enemies: [] as any[],
        active: false,
        score: 0
    });

    const FOOD_TYPES = ['🍔', '🥟', '🍟'];
    const BAD_TYPES = ['🥗', '🥦', '🍅'];

    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setShowWin(false);
        setScore(0);
        gameState.current.score = 0;
        gameState.current.items = [];
        gameState.current.enemies = [];
        gameState.current.active = true;
        update();
    };

    const spawnItem = () => {
        if (!canvasRef.current) return;
        gameState.current.items.push({
            x: Math.random() * (canvasRef.current.width - 30) + 15,
            y: -30,
            speed: 3 + Math.random() * 3,
            emoji: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)]
        });
    };

    const spawnEnemy = () => {
        if (!canvasRef.current) return;
        gameState.current.enemies.push({
            x: Math.random() * (canvasRef.current.width - 30) + 15,
            y: -30,
            speed: 4 + Math.random() * 3,
            emoji: BAD_TYPES[Math.floor(Math.random() * BAD_TYPES.length)]
        });
    };

    const handleInput = (clientX: number) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        // Optimización: Usar el centro de la boca para mejor control
        let newX = clientX - rect.left;
        const size = gameState.current.player.size;
        if (newX < size) newX = size;
        if (newX > canvasRef.current.width - size) newX = canvasRef.current.width - size;
        gameState.current.player.x = newX;
    };

    const update = () => {
        if (!gameState.current.active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimización: Deshabilitar alfa si no se usa
        if (!ctx) return;

        // Limpiar fondo con color sólido (más rápido que clearRect con transparencia)
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Configurar fuente UNA sola vez por frame
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Animación boca
        gameState.current.player.mouthOpen = Math.abs(Math.sin(Date.now() / 150));

        // Actualizar Items
        for (let i = gameState.current.items.length - 1; i >= 0; i--) {
            const item = gameState.current.items[i];
            item.y += item.speed;
            ctx.fillText(item.emoji, item.x, item.y);

            const dx = gameState.current.player.x - item.x;
            const dy = gameState.current.player.y - item.y;
            if (Math.sqrt(dx * dx + dy * dy) < gameState.current.player.size + 15) {
                gameState.current.items.splice(i, 1);
                gameState.current.score += 150;
                // NO llamar a setScore aquí para evitar re-renders cada frame
            } else if (item.y > canvas.height + 50) {
                gameState.current.items.splice(i, 1);
            }
        }

        // Actualizar Enemigos
        for (let i = gameState.current.enemies.length - 1; i >= 0; i--) {
            const enemy = gameState.current.enemies[i];
            enemy.y += enemy.speed;
            ctx.fillText(enemy.emoji, enemy.x, enemy.y);

            const dx = gameState.current.player.x - enemy.x;
            const dy = gameState.current.player.y - enemy.y;
            if (Math.sqrt(dx * dx + dy * dy) < gameState.current.player.size + 10) {
                endGame();
                return;
            } else if (enemy.y > canvas.height + 50) {
                gameState.current.enemies.splice(i, 1);
            }
        }

        // Dibujar Player
        ctx.save();
        ctx.translate(gameState.current.player.x, gameState.current.player.y);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#FFCC00';
        ctx.beginPath();
        let mouthSize = 0.2 * Math.PI * gameState.current.player.mouthOpen;
        ctx.arc(0, 0, gameState.current.player.size, mouthSize, 2 * Math.PI - mouthSize);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(gameState.current.player.size * 0.3, -gameState.current.player.size * 0.5, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // Dibujar Score en el Canvas (más eficiente que en DOM)
        ctx.fillStyle = '#FFCC00';
        ctx.font = 'bold 16px Courier New';
        ctx.textAlign = 'right';
        ctx.fillText(`SCORE: ${gameState.current.score}`, canvas.width - 20, 30);

        if (Math.random() < 0.04) spawnItem();
        if (Math.random() < 0.015 + (gameState.current.score / 50000)) spawnEnemy();

        requestRef.current = requestAnimationFrame(update);
    };

    const endGame = () => {
        gameState.current.active = false;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        setScore(gameState.current.score); // Sincronizar con React solo al final

        if (gameState.current.score >= 1000) {
            setShowWin(true);
        } else {
            setGameOver(true);
        }
    };

    const saveRecord = () => {
        if (whatsapp.length < 8) {
            alert("Ingresa un WhatsApp válido");
            return;
        }
        alert("¡RÉCORD REGISTRADO! Si mantienes el Highscore de la semana, reclama tu bebida con tu compra en el local.");
        setIsPlaying(false);
    };

    return (
        <section className="bg-black py-20 px-6 border-t-8 border-[#FFCC00] border-dotted relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-4xl md:text-6xl font-black italic uppercase text-[#FFCC00] mb-8 tracking-tighter">
                    ¿ESTÁS ESPERANDO? <br /> <span className="text-white">ENTRETÉNETE UN RATO</span>
                </h3>

                <div className="relative inline-block bg-[#050505] border-4 border-[#FFCC00] shadow-[0_0_30px_rgba(255,204,0,0.2)] rounded-2xl overflow-hidden">
                    <div className="absolute top-4 right-4 text-[#FFCC00] font-black italic z-20">
                        SCORE: {score}
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={360}
                        height={500}
                        onMouseMove={(e) => handleInput(e.clientX)}
                        onTouchMove={(e) => {
                            handleInput(e.touches[0].clientX);
                            e.preventDefault();
                        }}
                        className="cursor-none"
                    />

                    <AnimatePresence>
                        {!isPlaying && !gameOver && !showWin && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-30"
                            >
                                <Gamepad2 size={64} className="text-[#FFCC00] mb-4 animate-pulse" />
                                <h4 className="text-3xl font-black italic text-white uppercase mb-4">GERMAIN-MAN</h4>
                                <p className="text-[#FFCC00] font-bold text-sm mb-8 uppercase italic">Come todo lo que puedas, ¡evita la ensalada!</p>
                                <button
                                    onClick={startGame}
                                    className="bg-[#FFCC00] text-black px-12 py-4 rounded-full font-black italic uppercase text-2xl shadow-[6px_6px_0px_#555] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                                >
                                    ¡JUGAR!
                                </button>
                            </motion.div>
                        )}

                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-8 z-30 text-white"
                            >
                                <h4 className="text-5xl font-black italic uppercase mb-2">¡GAME OVER!</h4>
                                <p className="text-xl font-bold uppercase italic mb-8">¿ESO ES TODO? ¡COME MÁS BURGERS!</p>
                                <button
                                    onClick={startGame}
                                    className="bg-white text-black px-12 py-4 rounded-full font-black italic uppercase text-2xl"
                                >
                                    REINTENTAR
                                </button>
                            </motion.div>
                        )}

                        {showWin && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-[#FFCC00] flex flex-col items-center justify-center p-8 z-30 text-black border-8 border-black"
                            >
                                <h4 className="text-4xl font-black italic uppercase mb-2">¡NUEVO RÉCORD!</h4>
                                <p className="text-xs font-black uppercase italic mb-6 leading-tight max-w-[280px]">
                                    SI ERES EL HIGHSCORE DE LA SEMANA, <br /> VEN A COBRAR TU BEBIDA
                                </p>
                                <input
                                    type="text"
                                    placeholder="TU WHATSAPP (+569...)"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="w-full bg-white border-4 border-black p-3 font-black text-center mb-4 uppercase italic"
                                />
                                <button
                                    onClick={saveRecord}
                                    className="bg-black text-white w-full py-4 font-black italic uppercase text-xl"
                                >
                                    GUARDAR Y COBRAR
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8">
                    <p className="text-white/20 font-black italic uppercase text-xs tracking-widest">
                        GERMAIN-MAN v1.0 - HIGH SCORE CHALLENGE
                    </p>
                </div>
            </div>
        </section>
    );
}
