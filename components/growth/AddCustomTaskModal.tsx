'use client';

import { useState } from 'react';
import { X, Plus, Loader2, Calendar, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface AddCustomTaskModalProps {
    clientId: string;
    onClose: () => void;
    onAdded: () => void;
}

const CATEGORIES = [
    { value: 'ads', label: 'Ads', color: 'text-amber-500' },
    { value: 'seo', label: 'SEO', color: 'text-blue-500' },
    { value: 'social', label: 'Social', color: 'text-pink-500' },
    { value: 'email', label: 'Email', color: 'text-purple-500' },
    { value: 'content', label: 'Contenido', color: 'text-emerald-500' },
    { value: 'dev', label: 'Desarrollo', color: 'text-cyan-500' },
    { value: 'strategy', label: 'Estrategia', color: 'text-green-500' },
    { value: 'reporting', label: 'Reportes', color: 'text-zinc-400' },
];

export function AddCustomTaskModal({ clientId, onClose, onAdded }: AddCustomTaskModalProps) {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('ads');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('10:00');
    const [saving, setSaving] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        try {
            let dueDatetime = null;
            if (dueDate) {
                dueDatetime = new Date(`${dueDate}T${dueTime}:00`).toISOString();
            }

            const { error } = await supabase
                .from('growth_tasks')
                .insert({
                    client_id: clientId,
                    title: title.trim(),
                    category,
                    status: 'pending',
                    priority: 'normal',
                    due_datetime: dueDatetime,
                    recurrence: { type: 'once' },
                    is_enabled: true
                });

            if (error) throw error;
            onAdded();
            onClose();
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Error al crear tarea');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className={`border rounded-2xl w-full max-w-md shadow-2xl transition-colors ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b transition-colors ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                            <Plus className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h2 className={`text-lg font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Nueva Tarea Custom</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Título de la Tarea
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Revisar métricas de conversión"
                            className={`w-full border rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm'}`}
                            autoFocus
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Categoría
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all border ${category === cat.value
                                        ? `${cat.color} ${isDark ? 'bg-white/10' : 'bg-gray-100'} border-current shadow-sm`
                                        : `${isDark ? 'text-zinc-500 bg-zinc-800 border-white/5 hover:bg-zinc-700' : 'text-gray-400 bg-gray-50 border-gray-100 hover:bg-gray-100'}`
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Calendar className="w-4 h-4 inline mr-1" /> Fecha Límite (opcional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={`border rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}
                            />
                            <div className="relative">
                                <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className={`w-full border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!title.trim() || saving}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${!title.trim() || saving
                                ? (isDark ? 'bg-zinc-700 text-zinc-500' : 'bg-gray-100 text-gray-400')
                                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                            }`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Crear Tarea
                    </button>
                </form>
            </div>
        </div>
    );
}
