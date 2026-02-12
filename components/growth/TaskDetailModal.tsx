'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Upload, Link as LinkIcon, Save, Loader2, Repeat, CheckCircle2, Trash2, Image as ImageIcon, Rocket } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { GrowthTask } from './types';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface TaskDetailModalProps {
    task: GrowthTask;
    onClose: () => void;
    onUpdate: () => void;
}

const RECURRENCE_OPTIONS = [
    { value: 'once', label: 'Una sola vez' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
];

const DAYS_OF_WEEK = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
];

export function TaskDetailModal({ task, onClose, onUpdate }: TaskDetailModalProps) {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('10:00');
    const [recurrenceType, setRecurrenceType] = useState('once');
    const [recurrenceDay, setRecurrenceDay] = useState(1);
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [evidenceNotes, setEvidenceNotes] = useState('');
    const [isEnabled, setIsEnabled] = useState(true);
    const [impactNotes, setImpactNotes] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const supabase = createClient();

    useEffect(() => {
        // Initialize form with task data
        if (task.due_datetime) {
            const dt = new Date(task.due_datetime);
            setDueDate(dt.toISOString().split('T')[0]);
            setDueTime(dt.toTimeString().slice(0, 5));
        }
        if (task.recurrence) {
            setRecurrenceType(task.recurrence.type || 'once');
            setRecurrenceDay(task.recurrence.day || 1);
        }
        setEvidenceUrl(task.evidence_url || '');
        setEvidenceNotes(task.evidence_notes || '');
        setImpactNotes(task.impact_notes || '');
        setIsEnabled(task.is_enabled);
    }, [task]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Build datetime
            let dueDatetime = null;
            if (dueDate) {
                dueDatetime = new Date(`${dueDate}T${dueTime}:00`).toISOString();
            }

            // Build recurrence
            const recurrence = {
                type: recurrenceType,
                ...(recurrenceType === 'weekly' && { day: recurrenceDay }),
                ...(recurrenceType === 'monthly' && { day: recurrenceDay }),
                hour: parseInt(dueTime.split(':')[0]),
            };

            const { error } = await supabase
                .from('growth_tasks')
                .update({
                    due_datetime: dueDatetime,
                    recurrence,
                    evidence_url: evidenceUrl || null,
                    evidence_notes: evidenceNotes || null,
                    impact_notes: impactNotes || null,
                    is_enabled: isEnabled,
                })
                .eq('id', task.id);

            if (error) throw error;
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error saving task:', err);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            const newStatus = task.status === 'done' ? 'pending' : 'done';
            const { error } = await supabase
                .from('growth_tasks')
                .update({
                    status: newStatus,
                    completed_at: newStatus === 'done' ? new Date().toISOString() : null,
                    evidence_url: evidenceUrl || null,
                    evidence_notes: evidenceNotes || null,
                    impact_notes: impactNotes || null,
                })
                .eq('id', task.id);

            if (error) throw error;

            // Track Activity in Command Center
            await supabase.from('growth_activity_log').insert({
                client_id: task.client_id,
                activity_type: newStatus === 'done' ? 'task_completed' : 'note_added',
                description: `${newStatus === 'done' ? 'completó' : 'reabrió'} la tarea: ${task.title}`,
                metadata: {
                    task_id: task.id,
                    status: newStatus,
                    impact_notes: newStatus === 'done' ? impactNotes : null
                }
            });

            // Engine Logic: If recurring and completed, generate next task
            // --- Auto-Recurrence Engine (Fixed Day Logic) ---
            if (newStatus === 'done' && task.recurrence && task.recurrence.type !== 'once') {
                const recurrence = task.recurrence;
                let nextDue = new Date(); // Use today as base to snap to the NEXT occurrence

                if (recurrence.type === 'weekly') {
                    const targetDay = recurrence.day || 1; // 1 = Lunes
                    const currentDay = nextDue.getDay();
                    const diff = (targetDay - currentDay + 7) % 7 || 7;
                    nextDue.setDate(nextDue.getDate() + diff);
                } else if (recurrence.type === 'monthly') {
                    const targetDay = recurrence.day || 1;
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    nextDue.setDate(targetDay);
                }

                // Set fixed hour to avoid random times
                nextDue.setHours(recurrence.hour || 10, 0, 0, 0);

                await supabase.from('growth_tasks').insert({
                    client_id: task.client_id,
                    plan_id: task.plan_id,
                    title: task.title,
                    category: task.category,
                    due_datetime: nextDue.toISOString(),
                    recurrence: task.recurrence,
                    priority: task.priority,
                    is_enabled: true,
                    status: 'pending'
                });
            }

            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error completing task:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        setDeleting(true);
        try {
            const { error } = await supabase
                .from('growth_tasks')
                .delete()
                .eq('id', task.id);

            if (error) throw error;
            onUpdate();
            onClose();
        } catch (err) {
            console.error('Error deleting task:', err);
        } finally {
            setDeleting(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${task.id}-${Date.now()}.${fileExt}`;
            const filePath = `evidence/${fileName}`;

            const { data, error } = await supabase.storage
                .from('growth-evidence')
                .upload(filePath, file, { upsert: true });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('growth-evidence')
                .getPublicUrl(filePath);

            setEvidenceUrl(urlData.publicUrl);
        } catch (err) {
            console.error('Error uploading file:', err);
            alert('Error al subir archivo. Verifica que el bucket "growth-evidence" existe en Supabase Storage.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className={`border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto transition-colors ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b sticky top-0 z-10 transition-colors ${isDark ? 'border-white/5 bg-zinc-900' : 'border-gray-100 bg-white'}`}>
                    <div>
                        <h2 className={`text-lg font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{task.title}</h2>
                        <span className="text-xs text-purple-600 uppercase font-bold">{task.category}</span>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className={`flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'bg-zinc-800/50' : 'bg-gray-50 border border-gray-100'}`}>
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>Tarea Activa</span>
                        <button
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isEnabled ? 'bg-green-500' : isDark ? 'bg-zinc-700' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${isEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Calendar className="w-4 h-4 inline mr-1" /> Fecha y Hora
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

                    {/* Recurrence */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Repeat className="w-4 h-4 inline mr-1" /> Recurrencia
                        </label>
                        <div className="space-y-3">
                            <select
                                value={recurrenceType}
                                onChange={(e) => setRecurrenceType(e.target.value)}
                                className={`w-full border rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}
                            >
                                {RECURRENCE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {recurrenceType === 'weekly' && (
                                <select
                                    value={recurrenceDay}
                                    onChange={(e) => setRecurrenceDay(parseInt(e.target.value))}
                                    className={`w-full border rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}
                                >
                                    {DAYS_OF_WEEK.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            )}

                            {recurrenceType === 'monthly' && (
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Día del mes:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="28"
                                        value={recurrenceDay}
                                        onChange={(e) => setRecurrenceDay(parseInt(e.target.value))}
                                        className={`w-20 border rounded-xl py-2 px-3 text-center outline-none focus:border-purple-500 transition-all ${isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Value Evaluation / ROI Section */}
                    <div className={`p-5 rounded-2xl space-y-3 transition-colors ${isDark ? 'bg-purple-600/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-100'}`}>
                        <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                            <Rocket className="w-4 h-4" /> Impacto y Evaluación de Valor
                        </label>
                        <textarea
                            className={`w-full border rounded-xl p-4 text-sm h-28 resize-none outline-none focus:border-purple-500/50 transition-all ${isDark ? 'bg-black/40 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm'}`}
                            placeholder="Ej: Bajamos el CPL en 20% o corregimos un error que bloqueaba ventas..."
                            value={impactNotes}
                            onChange={(e) => setImpactNotes(e.target.value)}
                        />
                        <p className={`text-[10px] leading-tight ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            Este reporte es la base de la demostración de valor mensual para el cliente. Sé específico y tangible.
                        </p>
                    </div>

                    {/* Evidence */}
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Upload className="w-4 h-4 inline mr-1" /> Evidencia de Trabajo
                        </label>
                        <div className="space-y-3">
                            {/* Upload Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploading
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : isDark
                                            ? 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5'
                                            : 'border-gray-200 bg-gray-50 hover:border-purple-500/50 hover:bg-purple-50/50'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                    className="hidden"
                                />
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                                        <span className="text-sm text-purple-400 font-bold">Subiendo...</span>
                                    </div>
                                ) : evidenceUrl ? (
                                    <div className="space-y-2">
                                        {evidenceUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img src={evidenceUrl} alt="Evidencia" className="max-h-32 mx-auto rounded-lg shadow-lg" />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-green-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="text-sm font-bold">Archivo subido</span>
                                            </div>
                                        )}
                                        <p className={`text-xs truncate max-w-[300px] mx-auto ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{evidenceUrl}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setEvidenceUrl(''); }}
                                            className="text-xs text-red-500 hover:text-red-400 font-bold"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className={`w-8 h-8 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
                                        <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Arrastra una imagen o haz click para subir</span>
                                        <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>PNG, JPG, WEBP, PDF (max 5MB)</span>
                                    </div>
                                )}
                            </div>

                            {/* URL Fallback */}
                            <div className="relative">
                                <LinkIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                <input
                                    type="url"
                                    value={evidenceUrl}
                                    onChange={(e) => setEvidenceUrl(e.target.value)}
                                    placeholder="O pega una URL externa..."
                                    className={`w-full border rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500 transition-all text-sm ${isDark ? 'bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm'}`}
                                />
                            </div>

                            {/* Notes */}
                            <textarea
                                value={evidenceNotes}
                                onChange={(e) => setEvidenceNotes(e.target.value)}
                                placeholder="Notas sobre el trabajo realizado..."
                                rows={3}
                                className={`w-full border rounded-xl py-3 px-4 outline-none focus:border-purple-500 transition-all resize-none ${isDark ? 'bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 shadow-sm'}`}
                            />
                        </div>
                    </div>

                    {/* Status Info */}
                    {task.status === 'done' && task.completed_at && (
                        <div className={`border rounded-xl p-4 transition-colors ${isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Completada</span>
                            </div>
                            <p className="text-xs text-green-600/70 mt-1">
                                {new Date(task.completed_at).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`p-6 border-t flex justify-between transition-colors ${isDark ? 'border-white/5 bg-zinc-900/50' : 'border-gray-100 bg-gray-50'}`}>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className={`flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Eliminar
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleComplete}
                            disabled={saving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 ${task.status === 'done'
                                ? (isDark ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
                                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                                }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {task.status === 'done' ? 'Reabrir' : 'Completar'}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 active:scale-95"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
