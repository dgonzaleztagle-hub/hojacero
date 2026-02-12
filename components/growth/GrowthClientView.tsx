'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft, CheckCircle2, Circle, Clock, MoreVertical, Layout, PlayCircle,
    Loader2, Rocket, Shield, Zap, Crown, X, Calendar as CalendarIcon,
    Settings, BarChart3, Mail, Share2, Search, Filter, ChevronRight, AlertTriangle, Plus
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { TaskDetailModal } from './TaskDetailModal';
import { AddCustomTaskModal } from './AddCustomTaskModal';
import { GrowthClient, GrowthTask } from './types';
import { generatePlanTasks } from '@/utils/growth-automation';

import { useDashboard } from '@/app/dashboard/DashboardContext';

// --- Icons Map ---
// ... (rest)
const MODULE_ICONS: Record<string, React.ReactNode> = {
    ads: <Zap className="w-4 h-4 text-amber-500" />,
    seo: <Search className="w-4 h-4 text-blue-500" />,
    social: <Share2 className="w-4 h-4 text-pink-500" />,
    email: <Mail className="w-4 h-4 text-purple-500" />,
    strategy: <Layout className="w-4 h-4 text-emerald-500" />,
    reporting: <BarChart3 className="w-4 h-4 text-zinc-400" />
};

export function GrowthClientView({ clientId, onBack }: { clientId: string, onBack: () => void }) {
    const [client, setClient] = useState<GrowthClient | null>(null);
    const [tasks, setTasks] = useState<GrowthTask[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<GrowthTask | null>(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    // Module Configurator State
    // ...
    const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});
    const [showPlanSelector, setShowPlanSelector] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [activities, setActivities] = useState<any[]>([]);

    const supabase = createClient();

    const fetchData = async () => {
        // ... (fetch logic fine)
        try {
            const { data: clientData, error: clientError } = await supabase
                .from('growth_clients')
                .select('*')
                .eq('id', clientId)
                .single();

            if (clientError) throw clientError;
            setClient(clientData);
            setActiveModules(clientData.active_modules || {});

            const { data: tasksData, error: tasksError } = await supabase
                .from('growth_tasks')
                .select('*')
                .eq('client_id', clientId)
                .order('due_datetime', { ascending: true });

            if (tasksError) throw tasksError;
            setTasks(tasksData || []);

            // 3. Fetch Activities
            const { data: actsData } = await supabase
                .from('growth_activity_log')
                .select('*')
                .eq('client_id', clientId)
                .order('created_at', { ascending: false })
                .limit(20);

            setActivities(actsData || []);

        } catch (err) {
            console.error('Error fetching growth data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientId) fetchData();
    }, [clientId]);

    const toggleModule = async (moduleKey: string) => {
        const newState = !activeModules[moduleKey];
        const newModules = { ...activeModules, [moduleKey]: newState };
        setActiveModules(newModules);
        await supabase.from('growth_clients').update({ active_modules: newModules }).eq('id', clientId);
    };

    const handleGeneratePlan = async (tier: 'foundation' | 'velocity' | 'dominance') => {
        setIsGeneratingPlan(true);
        try {
            await generatePlanTasks(clientId, tier);
            await fetchData();
            setShowPlanSelector(false);
        } catch (err) {
            console.error('Error generating plan:', err);
            alert('Error al generar el plan.');
        } finally {
            setIsGeneratingPlan(false);
        }
    };

    const handleTaskToggle = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'done' ? 'pending' : 'done';
        const now = new Date().toISOString();
        const task = tasks.find(t => t.id === taskId);

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

        await supabase.from('growth_tasks').update({
            status: newStatus,
            completed_at: newStatus === 'done' ? now : null
        }).eq('id', taskId);

        await supabase.from('growth_activity_log').insert({
            client_id: clientId,
            activity_type: newStatus === 'done' ? 'task_completed' : 'note_added',
            description: `${newStatus === 'done' ? 'completó' : 'reabrió'} la tarea: ${task?.title}`,
            metadata: { task_id: taskId, status: newStatus }
        });

        fetchData();
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>;
    if (!client) return <div>Error</div>;

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <div className={`flex flex-col h-full transition-colors ${isDark ? 'bg-zinc-950/50' : 'bg-white'}`}>
            {/* --- Top Bar: Command Center --- */}
            <header className={`px-6 py-4 border-b flex justify-between items-start transition-colors ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl border overflow-hidden flex-shrink-0 flex items-center justify-center p-2 transition-colors ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${client.website}&sz=64`}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.client_name)}&background=8b5cf6&color=fff&bold=true`;
                            }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-gray-200 text-gray-500'}`}><ArrowLeft className="w-4 h-4" /></button>
                            <h1 className={`text-xl font-bold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.client_name}</h1>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border transition-colors ${isDark ? 'bg-white/5 text-zinc-400 border-white/5' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{client.plan_tier}</span>
                            <button
                                onClick={() => setShowPlanSelector(true)}
                                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-zinc-500 hover:text-purple-400 hover:bg-white/10' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-200'}`}
                                title="Configurar Plan Growth"
                            >
                                <Settings className="w-4 h-4" />
                            </button>

                            {/* Health Trend */}
                            <div className={`flex items-center gap-2 ml-2 px-3 py-1 rounded-full border transition-colors ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <div className={`w-2 h-2 rounded-full ${client.health_score >= 80 ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-amber-500 shadow-[0_0_5px_#f59e0b]'}`} />
                                <span className={`text-xs font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{client.health_score}</span>
                                {client.previous_health_score !== undefined && (
                                    <span className={`text-[10px] font-bold ${client.health_score > client.previous_health_score ? 'text-green-500' : client.health_score < client.previous_health_score ? 'text-red-500' : 'text-zinc-500'}`}>
                                        {client.health_score > client.previous_health_score ? '↑' : client.health_score < client.previous_health_score ? '↓' : '—'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Upsell Trigger */}
                        {client.health_score >= 100 && client.plan_tier !== 'dominance' && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg animate-in slide-in-from-top duration-500">
                                <Rocket className="w-3 h-3 text-purple-400" />
                                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Oportunidad: Sugerir Upgrade a {client.plan_tier === 'foundation' ? 'Velocity' : 'Dominance'}</span>
                            </div>
                        )}

                        {/* Control Panel / Module Switcher */}
                        <div className="flex gap-2 mt-4">
                            {['strategy', 'ads', 'seo', 'social', 'email'].map(mod => (
                                <button
                                    key={mod}
                                    onClick={() => toggleModule(mod)}
                                    className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all
                                    ${activeModules[mod]
                                            ? (isDark ? 'bg-zinc-800 border-zinc-600 text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-200')
                                            : (isDark ? 'bg-transparent border-dashed border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500' : 'bg-transparent border-dashed border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500')
                                        }
                                `}
                                >
                                    <span className={activeModules[mod] ? 'opacity-100' : 'opacity-50 grayscale'}>{MODULE_ICONS[mod]}</span>
                                    {mod.toUpperCase()}
                                    <div className={`w-1.5 h-1.5 rounded-full ml-1 ${activeModules[mod] ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-transparent border transition-colors ' + (isDark ? 'border-zinc-700' : 'border-gray-200')}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddTask(true)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                        >
                            <Plus className="w-3 h-3" />
                            Tarea
                        </button>
                        <div className={`flex rounded-lg p-0.5 border transition-colors ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Layout className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-indigo-600 shadow-sm') : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className={`text-[10px] transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Health Score: <span className={client.health_score > 80 ? 'text-green-500' : 'text-amber-500'}>{client.health_score}</span>
                    </div>
                </div>
            </header>

            {/* --- Main Content Area --- */}
            <main className="flex-1 overflow-hidden flex">
                {/* Left: Detail / Calendar */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800">

                    {/* High Priority Alert - kept compact */}
                    {tasks.some(t => t.priority === 'high' && t.status !== 'done') && (
                        <div className="mb-4 flex items-center gap-2 text-xs text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{tasks.filter(t => t.priority === 'high' && t.status !== 'done').length} tareas de alta prioridad</span>
                        </div>
                    )}

                    {viewMode === 'list' ? (
                        <ListView tasks={tasks} onToggle={handleTaskToggle} onSelectTask={setSelectedTask} activeModules={activeModules} isDark={isDark} />
                    ) : (
                        <CalendarView tasks={tasks} isDark={isDark} />
                    )}
                </div>

                {/* Right: Activity Feed */}
                <ActivityFeed activities={activities} isDark={isDark} />
            </main>

            {/* Task Detail Modal */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => { fetchData(); setSelectedTask(null); }}
                />
            )}

            {/* Add Custom Task Modal */}
            {showAddTask && client && (
                <AddCustomTaskModal
                    clientId={client.id}
                    onClose={() => setShowAddTask(false)}
                    onAdded={fetchData}
                />
            )}

            {/* Plan Selector Modal */}
            {showPlanSelector && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className={`border rounded-2xl w-full max-w-lg shadow-2xl transition-colors ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`p-6 border-b flex justify-between items-center transition-colors ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                            <div>
                                <h2 className={`text-xl font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Configurar Plan Growth</h2>
                                <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Selecciona un protocolo para cargar las tareas automáticas.</p>
                            </div>
                            <button onClick={() => setShowPlanSelector(false)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-4">
                            {[
                                { id: 'foundation', name: 'Foundation Protocol', desc: 'Setup inicial de analíticas, SEO básico y píxeles.', color: isDark ? 'border-blue-500/30' : 'border-blue-200' },
                                { id: 'velocity', name: 'Velocity Engine', desc: 'Enfocado en optimización de Ads, CRO y email marketing.', color: isDark ? 'border-purple-500/30' : 'border-purple-200' },
                                { id: 'dominance', name: 'Dominance Matrix', desc: 'Estrategia avanzada, contenido premium y optimización CRM.', color: isDark ? 'border-amber-500/30' : 'border-amber-200' }
                            ].map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleGeneratePlan(p.id as any)}
                                    disabled={isGeneratingPlan}
                                    className={`text-left p-4 rounded-xl border transition-all group ${p.color} ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-white hover:shadow-md'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className={`font-bold transition-colors uppercase text-sm tracking-wider group-hover:text-purple-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
                                        <ChevronRight className={`w-4 h-4 transition-colors ${isDark ? 'text-zinc-600 group-hover:text-white' : 'text-gray-300 group-hover:text-purple-600'}`} />
                                    </div>
                                    <p className={`text-xs leading-relaxed transition-colors ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{p.desc}</p>
                                </button>
                            ))}
                        </div>
                        {isGeneratingPlan && (
                            <div className="px-6 pb-6 flex items-center justify-center gap-3 text-sm text-purple-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generando tareas del protocolo...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Sub-Components ---

function ActivityFeed({ activities, isDark }: { activities: any[], isDark: boolean }) {
    return (
        <div className={`w-85 border-l flex flex-col hidden xl:flex transition-colors ${isDark ? 'border-white/5 bg-zinc-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className={`p-4 border-b transition-colors ${isDark ? 'border-white/5 bg-zinc-900/40' : 'border-gray-100 bg-gray-100'}`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Centro de Comando</h3>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>Historial de Actividad Reciente</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activities.length > 0 ? (
                    activities.map((act) => (
                        <ActivityItem key={act.id} activity={act} isDark={isDark} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Clock className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-zinc-800' : 'text-gray-200'}`} />
                        <p className={`text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>No hay actividad reciente</p>
                    </div>
                )}
            </div>

            <div className={`p-4 border-t transition-colors ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-gray-100'}`}>
                <textarea
                    className={`w-full border rounded-xl p-3 text-xs resize-none outline-none focus:border-purple-500/50 transition-all ${isDark ? 'bg-black/30 border-white/10 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-900 shadow-sm'}`}
                    placeholder="Escribe una nota rápida aquí..."
                />
            </div>
        </div>
    );
}

function ActivityItem({ activity, isDark }: { activity: any, isDark: boolean }) {
    return (
        <div className="flex gap-3 relative group">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isDark ? 'bg-zinc-800 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                {activity.activity_type === 'task_completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {activity.activity_type === 'plan_changed' && <Rocket className="w-4 h-4 text-purple-500" />}
                {activity.activity_type === 'evidence_uploaded' && <Share2 className="w-4 h-4 text-cyan-500" />}
                {activity.activity_type === 'note_added' && <BarChart3 className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Gastón</span> {activity.description}
                </p>
                {activity.metadata?.impact_notes && (
                    <div className={`mt-1 px-2 py-1 border rounded text-[10px] italic ${isDark ? 'bg-purple-500/5 border-purple-500/10 text-purple-300' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                        "{activity.metadata.impact_notes}"
                    </div>
                )}
                <span className={`text-[9px] mt-1 block ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                    {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}

function ListView({ tasks, onToggle, onSelectTask, activeModules, isDark }: { tasks: GrowthTask[], onToggle: any, onSelectTask: (task: GrowthTask) => void, activeModules: Record<string, boolean>, isDark: boolean }) {
    // Filter tasks by active modules
    const visibleTasks = tasks.filter(t => {
        if (t.category === 'setup') return true;
        // Strict filtering: Module must be ON to see tasks.
        return activeModules[t.category] === true;
    });

    if (visibleTasks.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl transition-colors ${isDark ? 'opacity-50 border-white/10 bg-zinc-900/20' : 'bg-gray-50 border-gray-200 shadow-inner'}`}>
                <Filter className={`w-12 h-12 mb-4 ${isDark ? 'text-zinc-600' : 'text-gray-300'}`} />
                <p className={`font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Sin Módulos Activos</p>
                <p className={`text-xs mt-2 max-w-xs text-center ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Activa un módulo (Ads, SEO, etc.) en el panel superior para visualizar y gestionar sus tareas.</p>
            </div>
        );
    }

    const groups = {
        backlog: visibleTasks.filter(t => t.status === 'pending'),
        inProgress: visibleTasks.filter(t => t.status === 'in_progress'),
        done: visibleTasks.filter(t => t.status === 'done')
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <TaskGroup title="En Progreso" color={isDark ? "text-cyan-400" : "text-cyan-600"} tasks={groups.inProgress} onToggle={onToggle} onSelectTask={onSelectTask} isDark={isDark} />
            <TaskGroup title="Backlog" color={isDark ? "text-zinc-500" : "text-gray-400"} tasks={groups.backlog} onToggle={onToggle} onSelectTask={onSelectTask} isDark={isDark} />
            <TaskGroup title="Completado" color={isDark ? "text-green-500" : "text-green-600"} tasks={groups.done} onToggle={onToggle} onSelectTask={onSelectTask} isDark={isDark} />
        </div>
    );
}

function TaskGroup({ title, color, tasks, onToggle, onSelectTask, isDark }: { title: string, color: string, tasks: GrowthTask[], onToggle: any, onSelectTask: (task: GrowthTask) => void, isDark: boolean }) {
    if (tasks.length === 0) return null;
    return (
        <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${color}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {title}
            </h3>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} onClick={() => onSelectTask(task)} className={`group border p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 ${isDark
                        ? 'bg-zinc-900/40 border-white/5 hover:border-purple-500/30'
                        : 'bg-white border-gray-100 hover:border-purple-500/50 shadow-sm hover:shadow-md'
                        }`}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggle(task.id, task.status); }}
                            className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500 text-black' : isDark ? 'border-zinc-600 hover:border-purple-400' : 'border-gray-200 hover:border-purple-600'}`}
                        >
                            {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-medium transition-colors ${task.status === 'done' ? (isDark ? 'text-zinc-500 line-through' : 'text-gray-300 line-through') : (isDark ? 'text-zinc-200' : 'text-gray-900')}`}>{task.title}</span>
                                {task.priority === 'high' && <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold transition-colors ${isDark ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100'}`}>High</span>}
                                {task.evidence_url && <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold transition-colors ${isDark ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-100'}`}>📎</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] uppercase flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${isDark ? 'text-zinc-500 bg-white/5' : 'text-gray-500 bg-gray-50 border border-gray-100 shadow-sm'}`}>
                                    {MODULE_ICONS[task.category] || <Circle className="w-2 h-2" />}
                                    {task.category}
                                </span>
                                <span className={`text-[10px] font-mono transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    {task.due_datetime ? new Date(task.due_datetime).toLocaleDateString() : 'Sin fecha'}
                                </span>
                            </div>
                        </div>

                        {/* Urgency Badge on the right */}
                        {(() => {
                            if (task.status === 'done' || !task.due_datetime) return null;
                            const now = new Date();
                            const due = new Date(task.due_datetime);
                            const diffMs = due.getTime() - now.getTime();
                            const diffMins = Math.round(diffMs / 60000);

                            // 1. VENCIDO: If now is past due date (diffMins < 0)
                            if (diffMins < 0) {
                                return (
                                    <div className={`px-2 py-1 rounded flex items-center gap-1.5 border shadow-sm transition-colors ${isDark ? 'border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-red-200 bg-red-50 text-red-600 shadow-red-100'}`}>
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span className="text-xs font-black uppercase whitespace-nowrap tracking-tighter">Vencido</span>
                                    </div>
                                );
                            }

                            // 2. PRÓXIMO: If due within next 2 hours
                            if (diffMins <= 120) {
                                const timeLeft = diffMins < 60 ? `${diffMins}m` : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
                                return (
                                    <div className={`px-2 py-1 rounded flex items-center gap-1.5 border animate-pulse self-center transition-colors ${diffMins < 30 ? (isDark ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-100 text-red-600') : (isDark ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600')}`}>
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold font-mono whitespace-nowrap">{timeLeft}</span>
                                    </div>
                                );
                            }

                            return null;
                        })()}

                        <ChevronRight className={`w-4 h-4 transition-colors self-center ${isDark ? 'text-zinc-600 group-hover:text-purple-400' : 'text-gray-300 group-hover:text-purple-600'}`} />
                    </div>
                ))}
            </div>
        </div >
    );
}

function CalendarView({ tasks, isDark }: { tasks: GrowthTask[], isDark: boolean }) {
    // Mock Calendar Grid for Visual Effect
    // In a real app, use 'date-fns' to generate grid
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i); // Next 7 days
        return d;
    });

    return (
        <div className="max-w-5xl mx-auto">
            <h3 className={`text-xl font-bold mb-6 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Próxima Semana</h3>
            <div className={`grid grid-cols-7 gap-px rounded-2xl overflow-hidden border transition-colors ${isDark ? 'bg-zinc-800 border-zinc-800' : 'bg-gray-200 border-gray-200 shadow-sm'}`}>
                {days.map((date, i) => {
                    const dayTasks = tasks.filter(t => t.due_datetime && new Date(t.due_datetime).toDateString() === date.toDateString());
                    return (
                        <div key={i} className={`min-h-[200px] p-3 transition-colors ${isDark ? 'bg-zinc-950 hover:bg-zinc-900/80 shadow-inner' : 'bg-white hover:bg-gray-50'}`}>
                            <div className="text-center mb-4">
                                <div className={`text-[10px] uppercase transition-colors ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div className={`text-lg font-bold transition-colors ${i === 0 ? 'text-purple-400' : isDark ? 'text-zinc-300' : 'text-gray-900'}`}>{date.getDate()}</div>
                            </div>
                            <div className="space-y-1.5">
                                {dayTasks.map(t => (
                                    <div key={t.id} className={`p-1.5 rounded-md text-[10px] font-medium border truncate transition-all ${t.status === 'done'
                                        ? (isDark ? 'bg-zinc-900 text-zinc-600 border-zinc-800' : 'bg-gray-100 text-gray-400 border-gray-200')
                                        : t.priority === 'high'
                                            ? (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100')
                                            : (isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-white text-gray-700 border-gray-100 shadow-sm')
                                        }`}>
                                        {t.title}
                                    </div>
                                ))}
                                {dayTasks.length === 0 && i !== 5 && i !== 6 && (
                                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <button className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-zinc-800 text-zinc-500 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-indigo-600 hover:text-white shadow-sm'}`}>+</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
