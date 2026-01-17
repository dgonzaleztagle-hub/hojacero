'use client';

import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Circle, ListTodo, Sparkles, Mail, Instagram, ArrowRight, BookOpen, Copy, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReportBuilderModal } from '../report/ReportBuilderModal';

interface ModalTabEstrategiaProps {
    selectedLead: any;
    isDark: boolean;
}

export const ModalTabEstrategia = ({ selectedLead, isDark }: ModalTabEstrategiaProps) => {
    const deepAnalysis = selectedLead.source_data?.deep_analysis;
    const tasks = deepAnalysis?.actionable_tasks || [];
    const contentIdeas = deepAnalysis?.content_ideas || { social_posts: [], email_subjects: [] };

    // Local state for checking off tasks (gamification)
    const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());
    // Report Builder Modal State
    const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);

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

            {/* SECTION 2: Creative Studio (Content Ideas) */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Estudio Creativo (Ideas IA)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SOCIAL POSTS */}
                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-4 text-pink-400">
                            <Instagram className="w-5 h-5" />
                            <span className="font-bold text-sm">Posts Sugeridos</span>
                        </div>
                        <ul className="space-y-4">
                            {contentIdeas.social_posts?.map((post: any, i: number) => (
                                <li key={i} className="flex gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                                    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                                        "{post.idea}"
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* EMAILS */}
                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-4 text-amber-400">
                            <Mail className="w-5 h-5" />
                            <span className="font-bold text-sm">Asuntos de Email</span>
                        </div>
                        <ul className="space-y-3">
                            {contentIdeas.email_subjects?.map((subj: string, i: number) => (
                                <li key={i} className={`p-3 rounded-lg text-sm border flex items-center justify-between group cursor-pointer ${isDark ? 'bg-zinc-800/50 border-white/5 hover:border-amber-500/30' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                                    <span className={isDark ? 'text-zinc-300' : 'text-gray-700'}>{subj}</span>
                                    <ArrowRight className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* INTERNAL TOOLS & ACTIONS - Updated for Internal Team Usage */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-lg">
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <Zap className="w-5 h-5 text-cyan-400" />
                            Herramientas Comerciales
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Usa esta estrategia generada por IA para armar tu propuesta o contactar al cliente.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                // Generate a text summary of the strategy
                                const text = `
Estrategia para ${selectedLead.title || 'Cliente'}:
--------------------------------
${tasks.length > 0 ? `✅ Avance: ${checkedTasks.size}/${tasks.length} tareas completadas.` : ''}

🎯 Foco: ${deepAnalysis.salesStrategy?.hook || 'Mejorar presencia digital'}

🛠️ Acciones Recomendadas:
${tasks.slice(0, 5).map((t: any) => `- ${t.title}`).join('\n')}

💡 Ideas de Contenido:
${contentIdeas?.social_posts?.slice(0, 3).map((p: any) => `- ${p.idea}`).join('\n') || 'Pendientes'}
                                `.trim();
                                navigator.clipboard.writeText(text);
                                alert('Estrategia copiada al portapapeles');
                            }}
                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${isDark
                                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-white/5 hover:border-white/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <Copy className="w-4 h-4" />
                            Copiar Resumen
                        </button>

                        <button
                            onClick={() => setIsReportBuilderOpen(true)}
                            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                        >
                            <Download className="w-4 h-4" />
                            Exportar PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* REPORT BUILDER MODAL */}
            <ReportBuilderModal
                isOpen={isReportBuilderOpen}
                onClose={() => setIsReportBuilderOpen(false)}
                lead={selectedLead}
                isDark={isDark}
            />
        </div>
    );
};
