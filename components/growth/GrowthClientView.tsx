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

// --- Types ---
interface GrowthClient {
    id: string;
    client_name: string;
    plan_tier: string;
    health_score: number;
    next_audit_date: string;
    active_modules: Record<string, boolean>; // e.g. { ads: true, seo: false }
}

interface GrowthTask {
    id: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    due_datetime: string | null;
    recurrence: { type: string; day?: number; hour?: number } | null;
    evidence_url: string | null;
    evidence_notes: string | null;
    is_enabled: boolean;
    completed_at: string | null;
}

// --- Icons Map ---
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

    // Module Configurator State
    const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});

    const supabase = createClient();

    const fetchData = async () => {
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

        } catch (err) {
            console.error('Error fetching growth data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientId) fetchData();
    }, [clientId]);

    // Handle Module Toggle
    const toggleModule = async (moduleKey: string) => {
        const newState = !activeModules[moduleKey];
        const newModules = { ...activeModules, [moduleKey]: newState };

        setActiveModules(newModules);

        // Persist to DB
        await supabase.from('growth_clients').update({ active_modules: newModules }).eq('id', clientId);

        // TODO: Logic to auto-generate tasks if turning ON
    };

    const handleTaskToggle = async (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'done' ? 'pending' : 'done';
        const now = new Date().toISOString();
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        await supabase.from('growth_tasks').update({ status: newStatus, completed_at: newStatus === 'done' ? now : null }).eq('id', taskId);
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>;
    if (!client) return <div>Error</div>;

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <div className="flex flex-col h-full bg-zinc-950/50">
            {/* --- Top Bar: Command Center --- */}
            <header className="px-6 py-4 border-b border-white/5 bg-black/40 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><ArrowLeft className="w-4 h-4 text-zinc-400" /></button>
                        <h1 className="text-xl font-bold text-white tracking-tight">{client.client_name}</h1>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/5 text-zinc-400 border border-white/5">{client.plan_tier}</span>
                    </div>
                    {/* Control Panel / Module Switcher */}
                    <div className="flex gap-2 mt-4">
                        {['strategy', 'ads', 'seo', 'social', 'email'].map(mod => (
                            <button
                                key={mod}
                                onClick={() => toggleModule(mod)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all
                                    ${activeModules[mod]
                                        ? 'bg-zinc-800 border-zinc-600 text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                                        : 'bg-transparent border-dashed border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-500'
                                    }
                                `}
                            >
                                <span className={activeModules[mod] ? 'opacity-100' : 'opacity-50 grayscale'}>{MODULE_ICONS[mod]}</span>
                                {mod.toUpperCase()}
                                <div className={`w-1.5 h-1.5 rounded-full ml-1 ${activeModules[mod] ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-transparent border border-zinc-700'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddTask(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                            Tarea
                        </button>
                        <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-white/5">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <Layout className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-1.5 rounded-md transition-all ${viewMode === 'calendar' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="text-[10px] text-zinc-500">
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
                        <ListView tasks={tasks} onToggle={handleTaskToggle} onSelectTask={setSelectedTask} activeModules={activeModules} />
                    ) : (
                        <CalendarView tasks={tasks} />
                    )}
                </div>

                {/* Right: Context / Notes (Placeholder for next iteration) */}
                <div className="w-80 border-l border-white/5 bg-zinc-900/30 p-4 hidden xl:block">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Notas & Contexto</h3>
                    <textarea
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg p-3 text-sm text-zinc-300 h-32 resize-none focus:outline-none focus:border-purple-500/50"
                        placeholder="Escribe notas rápidas para Gastón aquí..."
                    />
                    <div className="mt-4 p-4 rounded-lg border border-dashed border-white/10 text-center">
                        <p className="text-xs text-zinc-600">Arrastra archivos o evidencia aquí</p>
                    </div>
                </div>
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
        </div>
    );
}

// --- Sub-Components ---

function ListView({ tasks, onToggle, onSelectTask, activeModules }: { tasks: GrowthTask[], onToggle: any, onSelectTask: (task: GrowthTask) => void, activeModules: Record<string, boolean> }) {
    // Filter tasks by active modules
    const visibleTasks = tasks.filter(t => {
        if (t.category === 'setup') return true;
        // Strict filtering: Module must be ON to see tasks.
        return activeModules[t.category] === true;
    });

    if (visibleTasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 border border-dashed border-white/10 rounded-2xl bg-zinc-900/20">
                <Filter className="w-12 h-12 mb-4 text-zinc-600" />
                <p className="text-zinc-400 font-medium">Sin Módulos Activos</p>
                <p className="text-xs text-zinc-500 mt-2 max-w-xs text-center">Activa un módulo (Ads, SEO, etc.) en el panel superior para visualizar y gestionar sus tareas.</p>
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
            <TaskGroup title="En Progreso" color="text-cyan-400" tasks={groups.inProgress} onToggle={onToggle} onSelectTask={onSelectTask} />
            <TaskGroup title="Backlog" color="text-zinc-500" tasks={groups.backlog} onToggle={onToggle} onSelectTask={onSelectTask} />
            <TaskGroup title="Completado" color="text-green-500" tasks={groups.done} onToggle={onToggle} onSelectTask={onSelectTask} />
        </div>
    );
}

function TaskGroup({ title, color, tasks, onToggle, onSelectTask }: { title: string, color: string, tasks: GrowthTask[], onToggle: any, onSelectTask: (task: GrowthTask) => void }) {
    if (tasks.length === 0) return null;
    return (
        <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${color}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                {title}
            </h3>
            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} onClick={() => onSelectTask(task)} className="group bg-zinc-900/40 border border-white/5 hover:border-purple-500/30 p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggle(task.id, task.status); }}
                            className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-green-500 border-green-500 text-black' : 'border-zinc-600 hover:border-purple-400'}`}
                        >
                            {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-sm font-medium ${task.status === 'done' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{task.title}</span>
                                {task.priority === 'high' && <span className="bg-red-500/10 text-red-500 text-[9px] px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold text-xs">High</span>}
                                {task.evidence_url && <span className="bg-cyan-500/10 text-cyan-500 text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase font-bold">📎</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
                                    {MODULE_ICONS[task.category] || <Circle className="w-2 h-2" />}
                                    {task.category}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono">
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
                                    <div className="px-2 py-1 rounded flex items-center gap-1.5 border border-red-500 bg-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span className="text-xs font-black uppercase whitespace-nowrap tracking-tighter">Vencido</span>
                                    </div>
                                );
                            }

                            // 2. PRÓXIMO: If due within next 2 hours
                            if (diffMins <= 120) {
                                const timeLeft = diffMins < 60 ? `${diffMins}m` : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
                                return (
                                    <div className={`px-2 py-1 rounded flex items-center gap-1.5 border animate-pulse self-center ${diffMins < 30 ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'}`}>
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-xs font-bold font-mono whitespace-nowrap">{timeLeft}</span>
                                    </div>
                                );
                            }

                            return null;
                        })()}

                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors self-center" />
                    </div>
                ))}
            </div>
        </div >
    );
}

function CalendarView({ tasks }: { tasks: GrowthTask[] }) {
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
            <h3 className="text-xl font-bold text-white mb-6">Próxima Semana</h3>
            <div className="grid grid-cols-7 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
                {days.map((date, i) => {
                    const dayTasks = tasks.filter(t => t.due_datetime && new Date(t.due_datetime).toDateString() === date.toDateString());
                    return (
                        <div key={i} className="min-h-[200px] bg-zinc-950 p-3 hover:bg-zinc-900/80 transition-colors">
                            <div className="text-center mb-4">
                                <div className="text-[10px] text-zinc-500 uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div className={`text-lg font-bold ${i === 0 ? 'text-purple-400' : 'text-zinc-300'}`}>{date.getDate()}</div>
                            </div>
                            <div className="space-y-1.5">
                                {dayTasks.map(t => (
                                    <div key={t.id} className={`p-1.5 rounded-md text-[10px] font-medium border truncate ${t.status === 'done' ? 'bg-zinc-900 text-zinc-600 border-zinc-800' :
                                        t.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-zinc-800 text-zinc-300 border-zinc-700'
                                        }`}>
                                        {t.title}
                                    </div>
                                ))}
                                {dayTasks.length === 0 && i !== 5 && i !== 6 && (
                                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100">
                                        <button className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center">+</button>
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
