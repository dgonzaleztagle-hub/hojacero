'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, FileText, Trash2, Save } from 'lucide-react';

interface EventModalProps {
    event?: any;
    onSave: (data: any) => void;
    onDelete?: () => void;
    onClose: () => void;
    isDark: boolean;
}

export function EventModal({ event, onSave, onDelete, onClose, isDark }: EventModalProps) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        event_type: 'meeting',
        start_time: '',
        end_time: '',
        attendee_name: '',
        attendee_email: '',
        attendee_phone: '',
        location: '',
        notes: ''
    });

    useEffect(() => {
        if (event) {
            setForm({
                title: event.title || '',
                description: event.description || '',
                event_type: event.event_type || 'meeting',
                start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
                end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
                attendee_name: event.attendee_name || '',
                attendee_email: event.attendee_email || '',
                attendee_phone: event.attendee_phone || '',
                location: event.location || '',
                notes: event.notes || ''
            });
        } else {
            // Default: ahora + 1 hora
            const now = new Date();
            const start = new Date(now.getTime() + 60 * 60 * 1000);
            const end = new Date(start.getTime() + 30 * 60 * 1000);
            setForm(prev => ({
                ...prev,
                start_time: start.toISOString().slice(0, 16),
                end_time: end.toISOString().slice(0, 16)
            }));
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
            start_time: new Date(form.start_time).toISOString(),
            end_time: new Date(form.end_time).toISOString()
        });
    };

    const inputClass = `w-full px-3 py-2 rounded-lg text-sm ${isDark
        ? 'bg-black/50 border border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50'
        : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-400'
        } focus:outline-none`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-zinc-900 border border-white/10' : 'bg-white border border-gray-200'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {event ? 'Editar Evento' : 'Nueva Reunión'}
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <X className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Título */}
                    <div>
                        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Título *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ej: Sesión Estratégica con Cliente"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Tipo
                        </label>
                        <select name="event_type" value={form.event_type} onChange={handleChange} className={inputClass}>
                            <option value="meeting">🤝 Reunión</option>
                            <option value="task">📋 Tarea</option>
                            <option value="block">🚫 Bloqueo</option>
                            <option value="reminder">⏰ Recordatorio</option>
                        </select>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                Inicio *
                            </label>
                            <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                Fin *
                            </label>
                            <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} required className={inputClass} />
                        </div>
                    </div>

                    {/* Asistente */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                Nombre del Asistente
                            </label>
                            <input type="text" name="attendee_name" value={form.attendee_name} onChange={handleChange} placeholder="Daniel" className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                Email
                            </label>
                            <input type="email" name="attendee_email" value={form.attendee_email} onChange={handleChange} placeholder="cliente@email.com" className={inputClass} />
                        </div>
                    </div>

                    {/* Notas */}
                    <div>
                        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Notas
                        </label>
                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Notas adicionales..."
                            className={inputClass}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        {onDelete ? (
                            <button
                                type="button"
                                onClick={onDelete}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                            <button type="button" onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'text-zinc-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>
                                Cancelar
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all">
                                <Save className="w-4 h-4" />
                                {event ? 'Guardar Cambios' : 'Crear Evento'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
