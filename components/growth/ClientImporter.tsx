'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Check, X, UserPlus, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Lead {
    id: string;
    nombre: string;
    sitio_web: string;
    pipeline_stage: string;
}

interface Plan {
    id: string;
    name: string;
    description: string;
}

interface ClientImporterProps {
    onImported: () => void;
    onClose: () => void;
}

export function ClientImporter({ onImported, onClose }: ClientImporterProps) {
    const [search, setSearch] = useState('');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const supabase = createClient();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPlans();

        // Close dropdown on outside click
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPlans = async () => {
        const { data } = await supabase.from('growth_plan_templates').select('*').order('sort_order');
        if (data) setPlans(data);
    };

    const searchLeads = async (query: string) => {
        if (query.length < 2) {
            setLeads([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('id, nombre, sitio_web, pipeline_stage')
                .or(`nombre.ilike.%${query}%,sitio_web.ilike.%${query}%`)
                .limit(10);

            console.log('Search query:', query);
            console.log('Search results:', data);
            console.log('Search error:', error);

            if (error) {
                console.error('Supabase search error:', error);
            }
            if (data) setLeads(data);
        } catch (err) {
            console.error('Error searching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setShowDropdown(true);
        searchLeads(value);
    };

    const selectLead = (lead: Lead) => {
        setSelectedLead(lead);
        setSearch(lead.nombre);
        setShowDropdown(false);
    };

    const handleImport = async () => {
        if (!selectedLead || !selectedPlan) return;

        setImporting(true);
        try {
            // Check if already imported
            const { data: existing } = await supabase
                .from('growth_clients')
                .select('id')
                .eq('pipeline_lead_id', selectedLead.id)
                .single();

            if (existing) {
                alert('Este lead ya está en Growth');
                return;
            }

            // Get plan tasks
            const { data: planData, error: planError } = await supabase
                .from('growth_plan_templates')
                .select('included_tasks')
                .eq('id', selectedPlan.id)
                .single();

            console.log('📋 Plan data:', planData);
            console.log('📋 Plan error:', planError);
            console.log('📋 included_tasks:', planData?.included_tasks);

            // Create growth client
            const { data: newClient, error: clientError } = await supabase
                .from('growth_clients')
                .insert({
                    client_name: selectedLead.nombre,
                    website: selectedLead.sitio_web,
                    pipeline_lead_id: selectedLead.id,
                    plan_id: selectedPlan.id,
                    plan_tier: selectedPlan.name.toLowerCase(),
                    health_score: 100,
                    status: 'active',
                    next_audit_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                    active_modules: { strategy: true }
                })
                .select()
                .single();

            if (clientError) throw clientError;
            console.log('✅ Client created:', newClient);

            // Create task instances from plan
            console.log('🔍 Checking tasks - included_tasks:', planData?.included_tasks, 'length:', planData?.included_tasks?.length);

            if (planData?.included_tasks && planData.included_tasks.length > 0 && newClient) {
                console.log('📝 Fetching library tasks for IDs:', planData.included_tasks);

                // Get task details from library
                const { data: libraryTasks, error: libraryError } = await supabase
                    .from('growth_task_library')
                    .select('*')
                    .in('id', planData.included_tasks);

                console.log('📚 Library tasks found:', libraryTasks);
                console.log('📚 Library error:', libraryError);

                if (libraryTasks && libraryTasks.length > 0) {
                    const taskInserts = libraryTasks.map(lt => ({
                        client_id: newClient.id,
                        library_task_id: lt.id,
                        title: lt.title,
                        category: lt.category,
                        status: 'pending',
                        priority: 'normal',
                        due_datetime: calculateNextDueDate(lt.default_recurrence),
                        recurrence: lt.default_recurrence,
                        is_enabled: true
                    }));

                    console.log('📝 Inserting tasks:', taskInserts);
                    const { error: insertError } = await supabase.from('growth_tasks').insert(taskInserts);
                    console.log('📝 Insert error:', insertError);

                    // Auto-enable modules based on task categories
                    const uniqueCategories = [...new Set(libraryTasks.map(lt => lt.category))];
                    const activeModules: Record<string, boolean> = {};
                    uniqueCategories.forEach(cat => { activeModules[cat] = true; });

                    console.log('🔧 Auto-enabling modules:', activeModules);
                    await supabase
                        .from('growth_clients')
                        .update({ active_modules: activeModules })
                        .eq('id', newClient.id);
                } else {
                    console.log('⚠️ No library tasks found or empty array');
                }
            } else {
                console.log('⚠️ Skipping task creation:', {
                    hasIncludedTasks: !!planData?.included_tasks,
                    tasksLength: planData?.included_tasks?.length,
                    hasNewClient: !!newClient
                });
            }

            onImported();
        } catch (err) {
            console.error('Error importing client:', err);
            alert('Error al importar cliente');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <UserPlus className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Importar Cliente desde Pipeline</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Lead Search */}
                    <div ref={searchRef} className="relative">
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Buscar Lead</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Nombre de empresa o sitio web..."
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none transition-colors"
                            />
                            {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-purple-500" />}
                        </div>

                        {/* Dropdown */}
                        {showDropdown && leads.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-white/10 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
                                {leads.map(lead => (
                                    <button
                                        key={lead.id}
                                        onClick={() => selectLead(lead)}
                                        className="w-full text-left px-4 py-3 hover:bg-purple-900/20 flex items-center justify-between border-b border-white/5 last:border-0"
                                    >
                                        <div>
                                            <div className="text-white font-medium">{lead.nombre}</div>
                                            <div className="text-xs text-zinc-500">{lead.sitio_web}</div>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${lead.pipeline_stage === 'produccion' ? 'bg-green-500/10 text-green-500' :
                                            lead.pipeline_stage === 'negociacion' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-zinc-700 text-zinc-400'
                                            }`}>
                                            {lead.pipeline_stage}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Lead */}
                    {selectedLead && (
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4 flex items-center gap-3">
                            <Check className="w-5 h-5 text-purple-400" />
                            <div>
                                <div className="text-white font-bold">{selectedLead.nombre}</div>
                                <div className="text-xs text-zinc-400">{selectedLead.sitio_web}</div>
                            </div>
                        </div>
                    )}

                    {/* Plan Selection */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Asignar Plan</label>
                        <div className="grid grid-cols-2 gap-2">
                            {plans.map(plan => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`p-4 rounded-xl border text-left transition-all ${selectedPlan?.id === plan.id
                                        ? 'bg-purple-900/20 border-purple-500/50 text-white'
                                        : 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <div className="font-bold">{plan.name}</div>
                                    <div className="text-xs mt-1 opacity-60 line-clamp-1">{plan.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={!selectedLead || !selectedPlan || importing}
                        className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl font-bold transition-colors"
                    >
                        {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        Importar a Growth
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper to calculate next due date based on recurrence
function calculateNextDueDate(recurrence: { type: string; day?: number; hour?: number }): string {
    const now = new Date();

    if (recurrence.type === 'once') {
        // Due in 7 days
        now.setDate(now.getDate() + 7);
        now.setHours(10, 0, 0, 0);
        return now.toISOString();
    }

    if (recurrence.type === 'weekly') {
        // Next occurrence of the specified day
        const targetDay = recurrence.day || 1; // 1 = Monday
        const currentDay = now.getDay();
        const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
        now.setDate(now.getDate() + daysUntilTarget);
        now.setHours(recurrence.hour || 10, 0, 0, 0);
        return now.toISOString();
    }

    if (recurrence.type === 'monthly') {
        // Next occurrence of the specified day of month
        const targetDay = recurrence.day || 1;
        if (now.getDate() >= targetDay) {
            now.setMonth(now.getMonth() + 1);
        }
        now.setDate(targetDay);
        now.setHours(recurrence.hour || 10, 0, 0, 0);
        return now.toISOString();
    }

    return now.toISOString();
}
