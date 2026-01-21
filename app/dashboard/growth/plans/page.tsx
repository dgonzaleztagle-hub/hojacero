'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Check, X, BookOpen, Zap, Search, Share2, Mail, Layout, BarChart3, Code, Users, Edit2, Trash2, Save, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// --- Types ---
interface LibraryTask {
    id: string;
    title: string;
    category: string;
    description: string;
    default_recurrence: { type: string; day?: number; hour?: number };
}

interface PlanTemplate {
    id: string;
    name: string;
    description: string;
    included_tasks: string[];
    monthly_price: number | null;
    sort_order: number;
}

// --- Icons Map ---
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    setup: <Code className="w-4 h-4 text-zinc-400" />,
    ads: <Zap className="w-4 h-4 text-amber-500" />,
    seo: <Search className="w-4 h-4 text-blue-500" />,
    social: <Share2 className="w-4 h-4 text-pink-500" />,
    email: <Mail className="w-4 h-4 text-purple-500" />,
    strategy: <Layout className="w-4 h-4 text-emerald-500" />,
    content: <BookOpen className="w-4 h-4 text-orange-500" />,
    reporting: <BarChart3 className="w-4 h-4 text-cyan-500" />,
    dev: <Code className="w-4 h-4 text-red-500" />,
    crm: <Users className="w-4 h-4 text-indigo-500" />,
};

const CATEGORY_LABELS: Record<string, string> = {
    setup: 'Setup',
    ads: 'Ads',
    seo: 'SEO',
    social: 'Social',
    email: 'Email',
    strategy: 'Estrategia',
    content: 'Contenido',
    reporting: 'Reportes',
    dev: 'Desarrollo',
    crm: 'CRM',
};

export default function PlansPage() {
    const [plans, setPlans] = useState<PlanTemplate[]>([]);
    const [tasks, setTasks] = useState<LibraryTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<PlanTemplate | null>(null);
    const [saving, setSaving] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['setup', 'seo', 'ads']));

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [{ data: plansData }, { data: tasksData }] = await Promise.all([
                supabase.from('growth_plan_templates').select('*').order('sort_order'),
                supabase.from('growth_task_library').select('*').order('category, title'),
            ]);

            if (plansData) setPlans(plansData);
            if (tasksData) setTasks(tasksData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleTaskInPlan = (taskId: string) => {
        if (!selectedPlan) return;

        const currentTasks = selectedPlan.included_tasks || [];
        const newTasks = currentTasks.includes(taskId)
            ? currentTasks.filter(id => id !== taskId)
            : [...currentTasks, taskId];

        setSelectedPlan({ ...selectedPlan, included_tasks: newTasks });
    };

    const savePlan = async () => {
        if (!selectedPlan) return;
        setSaving(true);

        try {
            const { error } = await supabase
                .from('growth_plan_templates')
                .update({ included_tasks: selectedPlan.included_tasks })
                .eq('id', selectedPlan.id);

            if (error) throw error;

            // Update local state
            setPlans(prev => prev.map(p => p.id === selectedPlan.id ? selectedPlan : p));
        } catch (err) {
            console.error('Error saving plan:', err);
        } finally {
            setSaving(false);
        }
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    // Group tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = [];
        acc[task.category].push(task);
        return acc;
    }, {} as Record<string, LibraryTask[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* Left: Plan List */}
            <div className="w-80 border-r border-white/5 p-6">
                <h2 className="text-lg font-bold text-white mb-4">Planes</h2>
                <div className="space-y-2">
                    {plans.map(plan => (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedPlan?.id === plan.id
                                    ? 'bg-purple-900/20 border-purple-500/50 text-white'
                                    : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                                }`}
                        >
                            <div className="font-bold">{plan.name}</div>
                            <div className="text-xs mt-1 opacity-60">{plan.description}</div>
                            <div className="text-xs mt-2 font-mono text-purple-400">
                                {(plan.included_tasks || []).length} tareas
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Task Selector */}
            <div className="flex-1 p-6 overflow-y-auto">
                {selectedPlan ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedPlan.name}</h2>
                                <p className="text-sm text-zinc-400 mt-1">Selecciona las tareas incluidas en este plan</p>
                            </div>
                            <button
                                onClick={savePlan}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Guardar Cambios
                            </button>
                        </div>

                        {/* Task Categories */}
                        <div className="space-y-4">
                            {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                                <div key={category} className="border border-white/5 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left"
                                    >
                                        {expandedCategories.has(category)
                                            ? <ChevronDown className="w-4 h-4 text-zinc-500" />
                                            : <ChevronRight className="w-4 h-4 text-zinc-500" />
                                        }
                                        {CATEGORY_ICONS[category]}
                                        <span className="font-bold text-white">{CATEGORY_LABELS[category] || category}</span>
                                        <span className="text-xs text-zinc-500 ml-auto">
                                            {categoryTasks.filter(t => (selectedPlan.included_tasks || []).includes(t.id)).length}/{categoryTasks.length}
                                        </span>
                                    </button>

                                    {expandedCategories.has(category) && (
                                        <div className="divide-y divide-white/5">
                                            {categoryTasks.map(task => {
                                                const isIncluded = (selectedPlan.included_tasks || []).includes(task.id);
                                                return (
                                                    <div
                                                        key={task.id}
                                                        onClick={() => toggleTaskInPlan(task.id)}
                                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-all ${isIncluded
                                                                ? 'bg-purple-900/10'
                                                                : 'hover:bg-zinc-800/30'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isIncluded
                                                                ? 'bg-purple-600 border-purple-600 text-white'
                                                                : 'border-zinc-600'
                                                            }`}>
                                                            {isIncluded && <Check className="w-3 h-3" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`font-medium ${isIncluded ? 'text-white' : 'text-zinc-400'}`}>
                                                                {task.title}
                                                            </div>
                                                            {task.description && (
                                                                <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                                                                    {task.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-600 font-mono uppercase">
                                                            {task.default_recurrence.type === 'once' ? 'Una vez' :
                                                                task.default_recurrence.type === 'weekly' ? 'Semanal' :
                                                                    task.default_recurrence.type === 'monthly' ? 'Mensual' : ''}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <BookOpen className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg">Selecciona un plan para editar sus tareas</p>
                    </div>
                )}
            </div>
        </div>
    );
}
