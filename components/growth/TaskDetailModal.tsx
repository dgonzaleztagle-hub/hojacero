'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Upload, Link as LinkIcon, Save, Loader2, Repeat, CheckCircle2, Trash2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { GrowthTask } from './types';

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
                })
                .eq('id', task.id);

            if (error) throw error;

            // Engine Logic: If recurring and completed, generate next task
            if (newStatus === 'done' && task.recurrence && task.recurrence.type !== 'once') {
                const nextDue = new Date(task.due_datetime || new Date());
                if (task.recurrence.type === 'weekly') {
                    nextDue.setDate(nextDue.getDate() + 7);
                } else if (task.recurrence.type === 'monthly') {
                    nextDue.setMonth(nextDue.getMonth() + 1);
                }

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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-zinc-900">
                    <div>
                        <h2 className="text-lg font-bold text-white">{task.title}</h2>
                        <span className="text-xs text-purple-400 uppercase font-bold">{task.category}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-xl">
                        <span className="text-sm text-white">Tarea Activa</span>
                        <button
                            onClick={() => setIsEnabled(!isEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isEnabled ? 'bg-green-500' : 'bg-zinc-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" /> Fecha y Hora
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="bg-zinc-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none"
                            />
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recurrence */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            <Repeat className="w-4 h-4 inline mr-1" /> Recurrencia
                        </label>
                        <div className="space-y-3">
                            <select
                                value={recurrenceType}
                                onChange={(e) => setRecurrenceType(e.target.value)}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none"
                            >
                                {RECURRENCE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {recurrenceType === 'weekly' && (
                                <select
                                    value={recurrenceDay}
                                    onChange={(e) => setRecurrenceDay(parseInt(e.target.value))}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none"
                                >
                                    {DAYS_OF_WEEK.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            )}

                            {recurrenceType === 'monthly' && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-zinc-400">Día del mes:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="28"
                                        value={recurrenceDay}
                                        onChange={(e) => setRecurrenceDay(parseInt(e.target.value))}
                                        className="w-20 bg-zinc-800 border border-white/10 rounded-xl py-2 px-3 text-white text-center focus:border-purple-500 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Evidence */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                            <Upload className="w-4 h-4 inline mr-1" /> Evidencia de Trabajo
                        </label>
                        <div className="space-y-3">
                            {/* Upload Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${uploading ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5'
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
                                        <span className="text-sm text-purple-400">Subiendo...</span>
                                    </div>
                                ) : evidenceUrl ? (
                                    <div className="space-y-2">
                                        {evidenceUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img src={evidenceUrl} alt="Evidencia" className="max-h-32 mx-auto rounded-lg" />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 text-green-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="text-sm">Archivo subido</span>
                                            </div>
                                        )}
                                        <p className="text-xs text-zinc-500 truncate max-w-[300px] mx-auto">{evidenceUrl}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setEvidenceUrl(''); }}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-zinc-600" />
                                        <span className="text-sm text-zinc-400">Arrastra una imagen o haz click para subir</span>
                                        <span className="text-xs text-zinc-600">PNG, JPG, WEBP, PDF (max 5MB)</span>
                                    </div>
                                )}
                            </div>

                            {/* URL Fallback */}
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="url"
                                    value={evidenceUrl}
                                    onChange={(e) => setEvidenceUrl(e.target.value)}
                                    placeholder="O pega una URL externa..."
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-purple-500 outline-none text-sm"
                                />
                            </div>

                            {/* Notes */}
                            <textarea
                                value={evidenceNotes}
                                onChange={(e) => setEvidenceNotes(e.target.value)}
                                placeholder="Notas sobre el trabajo realizado..."
                                rows={3}
                                className="w-full bg-zinc-800 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:border-purple-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Status Info */}
                    {task.status === 'done' && task.completed_at && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold">Completada</span>
                            </div>
                            <p className="text-xs text-green-400/70 mt-1">
                                {new Date(task.completed_at).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-between">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Eliminar
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleComplete}
                            disabled={saving}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${task.status === 'done'
                                ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                : 'bg-green-600 hover:bg-green-500 text-white'
                                }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {task.status === 'done' ? 'Reabrir' : 'Completar'}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors"
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
