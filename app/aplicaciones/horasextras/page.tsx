"use client";

import { useHoursExtra } from "@/lib/aplicaciones/horasextras/useHoursExtra";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar as CalendarIcon, Clock, CheckCircle2, Gamepad2, Home } from "lucide-react";

import LoveMatch from "@/components/aplicaciones/horasextras/LoveMatch";

export default function HorasExtrasPage() {
    const { entries, addEntry, getCycleStats, markAsPaid } = useHoursExtra();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [hours, setHours] = useState<number>(0);
    const [showLoveMessage, setShowLoveMessage] = useState(false);
    const [showGamePrompt, setShowGamePrompt] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const { pendingHours, totalHistory } = getCycleStats();

    const handleSave = () => {
        if (hours <= 0) return;
        addEntry({ date: selectedDate, hours, paid: false });
        setShowLoveMessage(true);
        setTimeout(() => {
            setShowLoveMessage(false);
            setShowGamePrompt(true);
        }, 3000);
    };

    if (isPlaying) {
        return <LoveMatch onClose={() => setIsPlaying(false)} />;
    }

    return (
        <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-[#FFF5F7] text-[#D81B60] font-sans selection:bg-[#FFB7C5] selection:text-white p-4 md:p-8 touch-pan-y">
            {/* Header */}
            <header className="max-w-md mx-auto text-center mb-6 relative">
                {/* DEV SHORTCUT: Play Button */}
                <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute right-0 top-0 p-2 bg-white/50 rounded-full hover:bg-white text-[#FF69B4] active:scale-95 transition-all"
                    title="Modo Juego Rápido"
                >
                    <Gamepad2 className="w-5 h-5" />
                </button>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block p-3 bg-white rounded-full shadow-lg mb-2"
                >
                    <Heart className="w-8 h-8 text-[#FF69B4] fill-[#FF69B4]" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-[#880E4F]">Mis Horitas Extras</h1>
                <p className="text-[#AD1457] mt-1 opacity-80 text-sm">Juntos construimos nuestro futuro ❤️</p>
            </header>

            <main className="max-w-md mx-auto space-y-4 pb-12">
                {/* Stats Card - Compacted */}
                <section className="bg-white rounded-[2rem] p-5 shadow-xl border-4 border-[#FFB7C5] relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 opacity-5">
                        <Clock className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-40">Pendientes por cobrar</h2>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-[#C2185B] leading-none">{pendingHours}</span>
                            <span className="text-xl font-bold opacity-60">horas</span>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-2 bg-[#FFF5F7] py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF69B4] animate-pulse" />
                            Ciclo: 15 al 15
                        </div>
                    </div>
                </section>

                <AnimatePresence mode="wait">
                    {!showGamePrompt ? (
                        <motion.section
                            key="input-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-lg space-y-6"
                        >
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" /> Día de trabajo
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-[#FFF5F7] border-2 border-transparent focus:border-[#FFB7C5] outline-none transition-all text-xl font-bold"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Horas Extra
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={hours}
                                    onChange={(e) => setHours(Number(e.target.value))}
                                    placeholder="0.0"
                                    className="w-full p-5 rounded-2xl bg-[#FFF5F7] border-2 border-transparent focus:border-[#FFB7C5] outline-none transition-all text-4xl font-black text-center text-[#C2185B]"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-5 bg-gradient-to-r from-[#FF69B4] to-[#F06292] text-white rounded-[1.5rem] text-xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                            >
                                Anotar con Amor <Heart className="w-6 h-6 fill-current" />
                            </button>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="game-prompt"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="bg-[#E91E63] text-white p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6"
                        >
                            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Gamepad2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic tracking-tight">¿DESCANSO MERECIDO?</h3>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    Ya terminaste por hoy. ¿Quieres relajarte un ratito con un juego antes de ir a descansar?
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setShowGamePrompt(false);
                                        setIsPlaying(true);
                                    }}
                                    className="w-full py-4 bg-white text-[#E91E63] rounded-2xl text-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                >
                                    <Gamepad2 className="w-5 h-5 fill-current" /> ¡Sí, quiero jugar!
                                </button>
                                <button
                                    onClick={() => {
                                        setShowGamePrompt(false);
                                        setHours(0);
                                    }}
                                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                >
                                    <Home className="w-4 h-4" /> No, prefiero descansar
                                </button>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
                {/* Love Overlay */}
                <AnimatePresence>
                    {showLoveMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#C2185B]/20 backdrop-blur-sm"
                        >
                            <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-center border-8 border-[#FFB7C5] max-w-sm">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <Heart className="w-20 h-20 text-[#FF69B4] fill-[#FF69B4] mx-auto mb-4" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#880E4F] mb-4">¡Guardado!</h2>
                                <p className="text-lg leading-relaxed text-[#AD1457]">
                                    Gracias por tu esfuerzo amor de mi vida. ❤️✨
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="max-w-md mx-auto mt-12 text-center opacity-40 text-xs">
                Hecho con ❤️ por Daniel para su persona favorita
            </footer>
        </div>
    );
}
