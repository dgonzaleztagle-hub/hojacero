'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Trophy, Shield, HelpCircle, PlayCircle, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { ACADEMY_CONTENT, Module } from '@/lib/academy-content';

import { useDashboard } from '@/app/dashboard/DashboardContext';

type ModuleProgress = {
    module_id: string;
    status: 'locked' | 'in_progress' | 'completed';
    quiz_score: number;
};

// Extend the static module with dynamic status
type ModuleWithStatus = Module & {
    locked: boolean;
    status: 'locked' | 'in_progress' | 'completed';
    progress?: number; // For visualization, could be derived from lessons viewed
};

export default function AcademyPage() {
    const [modules, setModules] = useState<ModuleWithStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalProgress, setGlobalProgress] = useState(0);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: progressData, error } = await supabase
                .from('academy_progress')
                .select('*')
                .eq('user_id', user.id);

            if (error) throw error;

            // Map static content to dynamic status
            const progressMap = new Map(progressData?.map((p: ModuleProgress) => [p.module_id, p]));

            // Convert object to array and sort if needed
            const modulesList = Object.values(ACADEMY_CONTENT).map((module, index) => {
                const progress = progressMap.get(module.id);

                // Logic for locking:
                // Module 1 is always unlocked.
                // Subsequent modules are unlocked if the previous one is completed.
                let isLocked = index > 0;
                let status: 'locked' | 'in_progress' | 'completed' = 'locked';

                if (index === 0) {
                    isLocked = false;
                    status = progress?.status || 'in_progress'; // Default to in_progress for first module if no record
                } else {
                    const prevModuleId = Object.values(ACADEMY_CONTENT)[index - 1].id;
                    const prevProgress = progressMap.get(prevModuleId);
                    if (prevProgress?.status === 'completed') {
                        isLocked = false;
                        status = progress?.status || 'in_progress'; // Default to in_progress if unlocked but no record
                    }
                }

                // Override status if record exists
                if (progress) {
                    status = progress.status;
                }

                return {
                    ...module,
                    locked: isLocked,
                    status: status,
                    progress: 0 // TODO: Calculate granular lesson progress
                };
            });

            setModules(modulesList);

            // Calculate global progress
            const totalModules = modulesList.length;
            const completedModules = modulesList.filter(m => m.status === 'completed').length;
            setGlobalProgress(Math.round((completedModules / totalModules) * 100));

        } catch (error) {
            console.error('Error fetching academy progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModuleClick = (module: ModuleWithStatus) => {
        if (module.locked) return;
        router.push(`/dashboard/academy/${module.id}`);
    };

    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    if (loading) {
        return (
            <div className={`flex h-[50vh] items-center justify-center`}>
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-[calc(100vh-2rem)] space-y-4 animate-in fade-in duration-500 max-w-full mx-auto pb-0 px-4`}>
            {/* Header */}
            <header className={`px-4 py-8 border-b flex flex-col md:flex-row justify-between items-end gap-4 ${isDark ? 'border-white/5 bg-gradient-to-b from-purple-900/10 to-transparent' : 'border-gray-200 bg-gradient-to-b from-purple-50 to-transparent'}`}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Hojacero Academy</h1>
                    </div>
                    <p className={`max-w-xl text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        Programa de Certificación para Operadores de Growth.
                        Completa los módulos para obtener el rango de <span className="text-purple-500 font-bold">Growth Engineer Level 1</span>.
                    </p>
                </div>

                <div className="text-right">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Tu Progreso</div>
                    <div className={`text-2xl font-bold flex items-center justify-end gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {globalProgress}%
                        <div className={`w-32 h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${globalProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                    {/* Modules */}
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => handleModuleClick(module)}
                            className={`
                                group relative overflow-hidden rounded-2xl border p-6 transition-all cursor-pointer shadow-sm
                                ${module.locked
                                    ? isDark ? 'border-white/5 opacity-50 grayscale cursor-not-allowed' : 'border-gray-100 opacity-50 grayscale cursor-not-allowed'
                                    : isDark
                                        ? 'border-white/10 bg-zinc-900/50 hover:border-purple-500/30 hover:bg-zinc-900'
                                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/30'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${module.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                    module.status === 'in_progress' ? (isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600') :
                                        isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {module.status === 'completed' ? 'Completado' :
                                        module.status === 'in_progress' ? 'En Curso' : 'Bloqueado'}
                                </span>
                                {module.locked ? <Lock className={`w-5 h-5 ${isDark ? 'text-zinc-600' : 'text-gray-300'}`} /> : <Trophy className={`w-5 h-5 transition-colors ${isDark ? 'text-zinc-600 group-hover:text-purple-500' : 'text-gray-300 group-hover:text-purple-600'}`} />}
                            </div>

                            <h3 className={`text-lg font-bold mb-2 transition-colors ${isDark ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-purple-700'}`}>
                                {module.title}
                            </h3>
                            <p className={`text-sm mb-6 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                {module.description}
                            </p>

                            <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {module.lessons.length} Lecciones</span>
                                    <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Quiz Final</span>
                                </div>
                                <span className="font-mono">15 min</span>
                            </div>

                            {/* Progress Bar for In Progress */}
                            {module.status === 'in_progress' && !module.locked && (
                                <div className={`absolute bottom-0 left-0 w-full h-1 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                    <div className="h-full bg-amber-500 w-1/3" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Certification Badge Placeholders */}
                <div className={`mt-12 border-t pt-8 ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Tus Certificaciones</h2>
                    <div className="flex gap-4">
                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${globalProgress >= 50
                            ? isDark ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-purple-100 border-purple-300 text-purple-600'
                            : isDark ? 'bg-zinc-800 border-white/5 grayscale opacity-50' : 'bg-gray-50 border-gray-100 grayscale opacity-50'
                            }`} title="Growth Engineer Lvl 1">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${globalProgress === 100
                            ? isDark ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' : 'bg-yellow-100 border-yellow-300 text-yellow-600'
                            : isDark ? 'bg-zinc-800 border-white/5 grayscale opacity-50' : 'bg-gray-50 border-gray-100 grayscale opacity-50'
                            }`} title="Master Operator">
                            <Trophy className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
