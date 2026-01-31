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
        // FIX: Use 100dvh for proper mobile height
        <div className="fixed inset-0 z-[60] bg-[#FFF5F7] flex flex-col p-4 touch-none select-none overflow-hidden h-[100dvh]">

            {/* HUD HEADER - COMPACT MODE */}
            <div className="flex-none max-w-md mx-auto w-full flex flex-col gap-2 mb-2 px-1">
                <div className="flex justify-between items-center">
                    {/* Target */}
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black opacity-40">Meta</span>
                        <span className="text-lg font-black text-[#D81B60]">{TARGET_SCORE}</span>
                    </div>

                    {/* CLOSE Button - More Accessible */}
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#D81B60] active:bg-gray-100"
                    >
                        <Home className="w-5 h-5" />
                    </button>

                    {/* Moves */}
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] uppercase font-black opacity-40">Turnos</span>
                        <span className={`text-2xl font-black leading-none ${moves < 5 ? 'text-red-500 animate-pulse' : 'text-[#D81B60]'}`}>
                            {moves}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white rounded-full shadow-inner overflow-hidden border border-white relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((score / TARGET_SCORE) * 100, 100)}%` }}
                        className="h-full bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] rounded-full relative"
                    >
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                    </motion.div>
                </div>
            </div>

            {/* GAME AREA - FLEXIBLE & CONTAINED */}
            <main className="flex-1 flex flex-col items-center justify-center relative min-h-0">
                <motion.div
                    animate={shouldShake ? { x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] } : {}}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white/40 p-2 md:p-4 rounded-[2rem] shadow-xl border-x-4 border-b-4 border-white/80 backdrop-blur-sm max-h-full aspect-square flex items-center justify-center"
                >
                    {/* THE GRID CONTAINER */}
                    <div
                        className="grid gap-1 p-1 relative w-full h-full"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            maxWidth: "100%",
                            maxHeight: "100%",
                            aspectRatio: "1/1"
                        }}
                    >
                        {/* Particles Overlay */}
                        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden rounded-xl">
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

                        {/* Combo Text Overlay */}
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
                                        transition={{
                                            duration: 0.4,
                                            scale: { duration: 0.4, ease: "backOut" },
                                            opacity: { duration: 0.2 },
                                            rotate: { type: "spring", stiffness: 300 }
                                        }}
                                        className="text-4xl md:text-5xl font-black text-[#FF1493] drop-shadow-[0_0_20px_rgba(255,105,180,0.8)] text-center px-4 py-2 bg-white/40 backdrop-blur-sm rounded-3xl border-4 border-white whitespace-nowrap"
                                    >
                                        {comboText}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Grid Items */}
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
                                    className={`relative w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center cursor-pointer shadow-sm ${selected?.r === r && selected?.c === c ? 'shadow-xl z-20' : ''}`}
                                >
                                    {item.type !== 'empty' && (
                                        <>
                                            <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/60 to-transparent opacity-40 pointer-events-none" />

                                            <motion.div
                                                animate={selected?.r === r && selected?.c === c ? { rotate: [0, -10, 10, 0] } : {}}
                                                transition={{ repeat: Infinity, duration: 0.5 }}
                                                className="w-[85%] h-[85%] relative flex items-center justify-center"
                                            >
                                                {/* SUPER ITEM */}
                                                {item.powerUp === 'super' ? (
                                                    <div className="w-full h-full relative flex items-center justify-center z-20">
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 rounded-full animate-spin opacity-80 blur-sm" />
                                                        <Zap className="w-[80%] h-[80%] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] stroke-[3] relative z-20" />
                                                    </div>
                                                ) : (
                                                    /* NORMAL ITEM */
                                                    <>
                                                        <item.icon
                                                            className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                                                            style={{
                                                                color: item.color,
                                                                fill: item.color,
                                                                filter: "contrast(1.2) brightness(1.1) drop-shadow(0 0 3px " + item.color + "44)"
                                                            }}
                                                        />

                                                        {/* BOMB BADGE - Scaled down for mobile */}
                                                        {item.powerUp === 'bomb' && (
                                                            <div className="absolute -bottom-1 -right-1 z-20 scale-75 md:scale-100">
                                                                <div className="bg-black text-white rounded-full p-1 shadow-md border border-white/50 animate-bounce">
                                                                    <Bomb className="w-2.5 h-2.5" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </motion.div>

                                            {selected?.r === r && selected?.c === c && (
                                                <motion.div
                                                    layoutId="selection-ring"
                                                    className="absolute inset-0 border-[3px] border-[#FF69B4] rounded-xl"
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
            </main>

            {/* FOOTER HINT */}
            <div className="flex-none text-center mt-2 mb-safe text-[#D81B60]/40 text-[10px] font-medium">
                <Sparkles className="w-3 h-3 inline-block mr-1" /> COMBINA 3
                <span className="hidden md:inline"> PARA RELAJARTE</span> <Sparkles className="w-3 h-3 inline-block ml-1" />
            </div>

            {/* RESULT MODAL */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-[#C2185B]/60 backdrop-blur-md z-[70] flex items-center justify-center p-6"
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

                            <p className="text-sm text-[#AD1457] mb-6 font-medium">
                                {gameWon
                                    ? "¡Eres increíble mi amor! ❤️"
                                    : `Te faltaron ${TARGET_SCORE - score} puntitos.`
                                }
                            </p>

                            <button
                                onClick={initGrid}
                                className={`w-full py-3 text-white rounded-xl text-lg font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all ${gameWon ? 'bg-gradient-to-r from-[#FF69B4] to-[#F06292]' : 'bg-gray-400'
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
