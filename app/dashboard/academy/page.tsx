'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Trophy, Shield, HelpCircle, PlayCircle, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { ACADEMY_CONTENT, Module } from '@/lib/academy-content';

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

    if (loading) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black text-white font-sans selection:bg-purple-500/30">
            <Sidebar />

            <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
                {/* Header */}
                <header className="px-8 py-8 border-b border-white/5 flex justify-between items-end bg-gradient-to-b from-purple-900/10 to-transparent">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Hojacero Academy</h1>
                        </div>
                        <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
                            Programa de Certificación para Operadores de Growth.
                            Completa los módulos para obtener el rango de <span className="text-purple-400 font-bold">Growth Engineer Level 1</span>.
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Tu Progreso</div>
                        <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                            {globalProgress}%
                            <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${globalProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                        {/* Modules */}
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => handleModuleClick(module)}
                                className={`
                                    group relative overflow-hidden rounded-2xl border bg-zinc-900/50 p-6 transition-all cursor-pointer
                                    ${module.locked
                                        ? 'border-white/5 opacity-50 grayscale cursor-not-allowed'
                                        : 'border-white/10 hover:border-purple-500/30 hover:bg-zinc-900 shadow-lg hover:shadow-purple-900/10'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${module.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        module.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-zinc-800 text-zinc-500'
                                        }`}>
                                        {module.status === 'completed' ? 'Completado' :
                                            module.status === 'in_progress' ? 'En Curso' : 'Bloqueado'}
                                    </span>
                                    {module.locked ? <Lock className="w-5 h-5 text-zinc-600" /> : <Trophy className="w-5 h-5 text-zinc-600 group-hover:text-purple-500 transition-colors" />}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between text-xs text-zinc-500">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {module.lessons.length} Lecciones</span>
                                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Quiz Final</span>
                                    </div>
                                    <span className="font-mono">15 min</span>
                                </div>

                                {/* Progress Bar for In Progress */}
                                {module.status === 'in_progress' && !module.locked && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                                        <div className="h-full bg-amber-500 w-1/3" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Certification Badge Placeholders */}
                    <div className="mt-12 border-t border-white/5 pt-8">
                        <h2 className="text-xl font-bold text-white mb-6">Tus Certificaciones</h2>
                        <div className="flex gap-4">
                            <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${globalProgress >= 50 ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-zinc-800 border-white/5 grayscale opacity-50'}`} title="Growth Engineer Lvl 1">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${globalProgress === 100 ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' : 'bg-zinc-800 border-white/5 grayscale opacity-50'}`} title="Master Operator">
                                <Trophy className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
