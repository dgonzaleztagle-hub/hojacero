'use client';

import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Circle, ListTodo, Sparkles, Mail, Instagram, ArrowRight, BookOpen, Copy, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalTabEstrategiaProps {
    selectedLead: any;
    isDark: boolean;
}

export const ModalTabEstrategia = ({ selectedLead, isDark }: ModalTabEstrategiaProps) => {
    const deepAnalysis = selectedLead.source_data?.deep_analysis;
    const tasks = deepAnalysis?.actionable_tasks || [];

    // Local state for checking off tasks (gamification)
    const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

    const toggleTask = (index: number) => {
        const newChecked = new Set(checkedTasks);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedTasks(newChecked);
    };

    const calculateProgress = () => {
        if (tasks.length === 0) return 0;
        return Math.round((checkedTasks.size / tasks.length) * 100);
    };

    if (!deepAnalysis) {
        return (
            <div className={`rounded-3xl p-12 border text-center ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                    <ListTodo className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>
                    Plan de Estrategia Pendiente
                </h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                    Ejecuta una <strong>Auditoría Profunda</strong> primero para que nuestra IA genere un plan de acción y estrategia de contenido personalizada.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* HERO: Progress & Motivation */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border-white/5' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'}`}>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-300 to-purple-300' : 'from-indigo-600 to-purple-600'}`}>
                            Tu Plan de Crecimiento
                        </h2>
                        <p className={`text-sm mt-1 ${isDark ? 'text-indigo-200/70' : 'text-indigo-600/80'}`}>
                            Completa estas tareas para mejorar tu puntaje y visibilidad.
                        </p>
                    </div>

                    {/* Progress Circle or Bar */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{calculateProgress()}%</span>
                            <div className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Completado</div>
                        </div>
                        <div className="w-16 h-16 relative">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className={isDark ? "text-white/10" : "text-gray-200"} />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                                    className="text-indigo-500 transition-all duration-1000 ease-out"
                                    strokeDasharray={175.9}
                                    strokeDashoffset={175.9 - (175.9 * calculateProgress() / 100)}
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 1: Actionable Tasks (The Coach) */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                    <ListTodo className="w-4 h-4" /> Checklist de Acciones
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {tasks.map((task: any, idx: number) => {
                        const isChecked = checkedTasks.has(idx);
                        return (
                            <motion.div
                                key={idx}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => toggleTask(idx)}
                                className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden
                                    ${isChecked
                                        ? (isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100')
                                        : (isDark ? 'bg-zinc-800/40 border-white/5 hover:border-indigo-500/30' : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm')}
                                `}
                            >
                                <div className="flex items-start gap-4 relatuve z-10">
                                    <div className={`mt-0.5 transition-colors duration-300 ${isChecked ? 'text-green-500' : 'text-zinc-400 group-hover:text-indigo-400'}`}>
                                        {isChecked ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-base font-medium transition-all duration-300 ${isChecked ? (isDark ? 'text-green-200 line-through' : 'text-green-800 line-through') : (isDark ? 'text-zinc-200' : 'text-gray-800')}`}>
                                            {task.title}
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${task.difficulty === 'Easy' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                task.difficulty === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/10 border-red-500/20 text-red-400'
                                                }`}>
                                                {task.difficulty === 'Easy' ? 'Fácil' : task.difficulty === 'Medium' ? 'Medio' : 'Difícil'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-zinc-500/10 border-zinc-500/20 text-zinc-400`}>
                                                {task.category || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
