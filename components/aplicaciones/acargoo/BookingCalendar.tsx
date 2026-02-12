"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface BookingCalendarProps {
    selectedService?: {
        id: string;
        name: string;
        icon: string;
    };
    onSelectSlot: (date: string, time: string) => void;
    onBack: () => void;
}

// Generar próximos 7 días
const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }
    return days;
};

// Slots de tiempo disponibles
const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00",
];

// Simular disponibilidad (algunos slots ocupados)
const isSlotAvailable = (date: Date, time: string): boolean => {
    const random = Math.random();
    // 80% de disponibilidad
    return random > 0.2;
};

export default function BookingCalendar({
    selectedService,
    onSelectSlot,
    onBack,
}: BookingCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const days = generateDays();

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            const dateStr = selectedDate.toISOString().split("T")[0];
            onSelectSlot(dateStr, selectedTime);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Header */}
            <div className="w-full max-w-5xl mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#1e3a5f] transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Cambiar servicio
                </button>
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-8 h-8 text-[#ff9900]" />
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f]">
                        Selecciona fecha y hora
                    </h2>
                </div>
                <p className="text-slate-600">
                    Servicio: <span className="font-semibold">{selectedService?.name}</span>
                </p>
            </div>

            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                {/* Selector de Día */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Día
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                        {days.map((day, index) => {
                            const isSelected = selectedDate?.toDateString() === day.toDateString();
                            const dayName = day.toLocaleDateString("es-CL", { weekday: "short" });
                            const dayNumber = day.getDate();
                            const monthName = day.toLocaleDateString("es-CL", { month: "short" });

                            return (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedDate(day);
                                        setSelectedTime(null);
                                    }}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all duration-300
                                        ${isSelected
                                            ? "border-[#ff9900] bg-gradient-to-br from-[#ff9900] to-[#ff7700] text-white shadow-lg"
                                            : "border-slate-200 hover:border-[#1e3a5f] bg-white text-slate-700"
                                        }
                                    `}
                                >
                                    <div className="text-xs uppercase font-semibold opacity-80 mb-1">
                                        {dayName}
                                    </div>
                                    <div className="text-2xl font-bold">{dayNumber}</div>
                                    <div className="text-xs opacity-80 capitalize">{monthName}</div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Selector de Hora */}
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Hora disponible
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {TIME_SLOTS.map((time) => {
                                const available = isSlotAvailable(selectedDate, time);
                                const isSelected = selectedTime === time;

                                return (
                                    <motion.button
                                        key={time}
                                        whileHover={available ? { scale: 1.05 } : {}}
                                        whileTap={available ? { scale: 0.95 } : {}}
                                        onClick={() => available && setSelectedTime(time)}
                                        disabled={!available}
                                        className={`
                                            p-3 rounded-lg border-2 font-semibold transition-all duration-300
                                            ${isSelected
                                                ? "border-[#ff9900] bg-[#ff9900] text-white shadow-lg"
                                                : available
                                                    ? "border-slate-200 hover:border-[#1e3a5f] bg-white text-slate-700"
                                                    : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                                            }
                                        `}
                                    >
                                        {time}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Botón Confirmar */}
                {selectedDate && selectedTime && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-8 pt-8 border-t border-slate-200"
                    >
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            Continuar con los detalles
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Info */}
            <p className="text-sm text-slate-500 mt-6 text-center">
                Los horarios mostrados están en hora local de Chile
            </p>
        </div>
    );
}
