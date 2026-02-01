"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Home, Heart, Zap, Bomb } from "lucide-react";
import { useLoveMatchGame, GRID_SIZE, TARGET_SCORE } from "./useLoveMatchGame";

export default function LoveMatch({ onClose }: { onClose: () => void }) {
    const {
        grid,
        selected,
        score,
        moves,
        gameOver,
        gameWon,
        comboText,
        particles,
        shouldShake,
        initGrid,
        handleItemClick
    } = useLoveMatchGame();

    useEffect(() => {
        initGrid();
    }, [initGrid]);

    return (
        // CONTENEDOR PRINCIPAL: Permite scroll si es necesario, Z-Index alto para tapar UI base
        <div className="fixed inset-0 z-[100] bg-[#FFF5F7] flex flex-col overflow-y-auto h-[100dvh] w-screen touch-pan-y">

            {/* HUD HEADER */}
            <div className="flex-none p-4 max-w-md mx-auto w-full flex flex-col gap-2 z-10">
                <div className="flex justify-between items-center">
                    {/* Marcador Meta */}
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black opacity-40">Meta</span>
                        <span className="text-xl font-black text-[#D81B60]">{TARGET_SCORE}</span>
                    </div>

                    {/* CLOSE Button */}
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-[#D81B60] active:scale-95 transition-transform"
                    >
                        <Home className="w-6 h-6" />
                    </button>

                    {/* Turnos */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-black opacity-40">Turnos</span>
                        <span className={`text-2xl font-black leading-none ${moves < 5 ? 'text-red-500 animate-pulse' : 'text-[#D81B60]'}`}>
                            {moves}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-white rounded-full shadow-inner overflow-hidden border-2 border-white relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((score / TARGET_SCORE) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                    </motion.div>
                </div>
            </div>

            {/* ÁREA DE JUEGO */}
            {/* Usamos flex-grow para ocupar espacio vertical disponible, pero JAMÁS colapsamos. */}
            {/* 'my-auto' centra el tablero si sobra espacio. */}
            {/* 'pb-8' da espacio para scrolear al final. */}
            <main className="flex-grow flex flex-col items-center justify-start md:justify-center p-4 min-h-0 w-full">

                {/* TABLERO */}
                <motion.div
                    animate={shouldShake ? { x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white/40 p-3 rounded-[2rem] shadow-xl border-x-4 border-b-4 border-white/80 backdrop-blur-sm w-full max-w-[400px] aspect-square mx-auto touch-none"
                >
                    <div
                        className="grid gap-1 p-1 w-full h-full"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                        }}
                    >
                        {/* Particles Overlay */}
                        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-2xl">
                            <AnimatePresence>
                                {particles.map(p => (
                                    <motion.div
                                        key={p.id}
                                        initial={{
                                            left: `${p.x * (100 / GRID_SIZE) + (50 / GRID_SIZE)}%`,
                                            top: `${p.y * (100 / GRID_SIZE) + (50 / GRID_SIZE)}%`,
                                            x: "-50%",
                                            y: "-50%",
                                            scale: 0.8,
                                            opacity: 1
                                        }}
                                        animate={{
                                            x: `calc(-50% + ${(Math.random() - 0.5) * 120}px)`,
                                            y: `calc(-50% + ${(Math.random() - 0.5) * 120}px)`,
                                            scale: 0,
                                            rotate: Math.random() * 360,
                                            opacity: 0
                                        }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="absolute w-3 h-3 rounded-sm shadow-sm"
                                        style={{ backgroundColor: p.color }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* COMBO TEXT */}
                        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center pointer-events-none">
                            <AnimatePresence>
                                {comboText && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: -15 }}
                                        animate={{
                                            opacity: 1,
                                            scale: [0, 1.8, 1.5],
                                            rotate: 0
                                        }}
                                        exit={{ opacity: 0, scale: 2.5, filter: "blur(10px)" }}
                                        transition={{ textShadow: "0px 0px 8px rgb(255,255,255)" }}
                                        className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-2xl border-4 border-[#FF1493] text-4xl md:text-5xl font-black text-[#FF1493] shadow-2xl whitespace-nowrap z-50"
                                    >
                                        {comboText}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CELLS */}
                        {grid.map((row, r) =>
                            row.map((item, c) => (
                                <motion.div
                                    key={item.id}
                                    onClick={() => handleItemClick(r, c)}
                                    whileTap={{ scale: 0.9 }}
                                    initial={item.id.includes("new-") ? { y: -50, opacity: 0 } : {}}
                                    animate={{
                                        scale: item.type === "empty" ? 0 : 1,
                                        y: 0,
                                        opacity: item.type === "empty" ? 0 : 1,
                                        backgroundColor: selected?.r === r && selected?.c === c ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)",
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className={`relative w-full h-full rounded-lg md:rounded-2xl flex items-center justify-center cursor-pointer shadow-sm ${selected?.r === r && selected?.c === c ? 'shadow-xl z-20' : ''}`}
                                >
                                    {item.type !== 'empty' && (
                                        <>
                                            <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/60 to-transparent opacity-40 pointer-events-none" />

                                            <motion.div
                                                animate={selected?.r === r && selected?.c === c ? { rotate: [0, -10, 10, 0] } : {}}
                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                className="w-[85%] h-[85%] relative flex items-center justify-center"
                                            >
                                                <AnimatePresence mode='wait'>
                                                    {item.powerUp === 'super' ? (
                                                        <motion.div
                                                            key="super"
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                            className="w-full h-full relative flex items-center justify-center z-20"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 rounded-full animate-spin opacity-80 blur-sm" />
                                                            <Zap className="w-[80%] h-[80%] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] stroke-[3] relative z-20" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="normal" className="w-full h-full flex items-center justify-center relative">
                                                            <item.icon
                                                                className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                                                style={{
                                                                    color: item.color,
                                                                    fill: item.color,
                                                                    filter: "contrast(1.2) brightness(1.1) drop-shadow(0 0 3px " + item.color + "44)"
                                                                }}
                                                            />
                                                            {item.powerUp === 'bomb' && (
                                                                <div className="absolute -bottom-1 -right-1 z-20 scale-75">
                                                                    <div className="bg-black text-white rounded-full p-1 shadow-md border border-white/50 animate-bounce">
                                                                        <Bomb className="w-2.5 h-2.5" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {selected?.r === r && selected?.c === c && (
                                                <motion.div
                                                    layoutId="selection-ring"
                                                    className="absolute inset-0 border-[3px] border-[#FF69B4] rounded-lg"
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                                />
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* POWER-UP GUIDE */}
                <div className="mt-6 max-w-[320px] w-full bg-white/40 p-4 rounded-2xl backdrop-blur-sm shadow-sm border border-white/60 mx-auto">
                    <h3 className="text-[10px] font-black uppercase text-[#D81B60]/50 mb-3 text-center tracking-widest">
                        <Sparkles className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                        Guía de Poderes
                        <Sparkles className="w-3 h-3 inline-block ml-1 -mt-0.5" />
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Bomba Legend */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center relative shrink-0">
                                <Heart className="w-5 h-5 text-[#FF6B6B]" fill="#FF6B6B" />
                                <div className="absolute -bottom-1 -right-1 bg-black text-white rounded-full p-0.5 shadow-sm">
                                    <Bomb size={8} />
                                </div>
                            </div>
                            <div className="text-[10px] text-[#C2185B] leading-tight">
                                <strong className="block font-black text-xs mb-0.5">Bomba 3x3</strong>
                                <span className="opacity-70">Junta 4 iguales</span>
                            </div>
                        </div>

                        {/* Super Legend */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-tr from-purple-400 via-pink-400 to-yellow-400 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-white" fill="white" />
                            </div>
                            <div className="text-[10px] text-[#C2185B] leading-tight">
                                <strong className="block font-black text-xs mb-0.5">Super Rayo</strong>
                                <span className="opacity-70">Junta 5 iguales</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#D81B60]/10 text-center">
                        <p className="text-[10px] text-[#AD1457] italic font-medium">
                            💡 Tip: ¡Intenta mezclar dos poderes! 💥
                        </p>
                    </div>
                </div>
            </main>

            {/* RESULT MODAL */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#C2185B]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] shadow-2xl text-center border-8 border-[#FFB7C5] max-w-xs w-full relative overflow-hidden"
                        >
                            {gameWon && (
                                <div className="absolute inset-0 bg-[url('/confetti.png')] opacity-20 animate-pulse pointer-events-none" />
                            )}
                            {gameWon ? (
                                <Trophy className="w-20 h-20 text-[#FFD93D] mx-auto mb-4 drop-shadow-lg animate-bounce" />
                            ) : (
                                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            )}
                            <h2 className={`text-3xl font-black mb-2 ${gameWon ? 'text-[#D81B60]' : 'text-gray-500'}`}>
                                {gameWon ? "¡GANASTE!" : "¡Casi!"}
                            </h2>
                            <button
                                onClick={initGrid}
                                className={`w-full py-3 mt-4 text-white rounded-xl text-lg font-bold shadow-lg active:scale-95 transition-all ${gameWon ? 'bg-gradient-to-r from-[#FF69B4] to-[#F06292]' : 'bg-gray-400'
                                    }`}
                            >
                                {gameWon ? "Jugar Otra Vez" : "Reintentar"}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
