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
        whatsapp: '',
        website: '',
        company_name: '',
        status: 'pending',
        location: '',
        notes: '',
        meeting_notes: '',
        assigned_to: 'daniel',
        send_reminder_email: false
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
                whatsapp: event.whatsapp || event.attendee_phone || '',
                website: event.website || '',
                company_name: event.company_name || '',
                status: event.status || 'pending',
                location: event.location || '',
                notes: event.notes || '',
                meeting_notes: event.meeting_notes || '',
                assigned_to: event.assigned_to || 'daniel',
                send_reminder_email: event.send_reminder_email || false
            });
        } else {
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
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...form,
            start_time: new Date(form.start_time).toISOString(),
            end_time: new Date(form.end_time).toISOString()
        });
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
            onClose(); // Arreglar bug: cerrar modal después de eliminar
        }
    };

    const inputClass = `w-full px-3 py-2 rounded-lg text-sm ${isDark
        ? 'bg-black/50 border border-white/10 text-white placeholder:text-zinc-600 focus:border-cyan-500/50'
        : 'bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-400'
        } focus:outline-none`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl ${isDark ? 'bg-zinc-900 border border-white/10' : 'bg-white border border-gray-200'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {event ? 'Editar Evento' : 'Nueva Reunión'}
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                        <X className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Título y Estado */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Título *</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Ej: Sesión Estratégica" required className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Estado</label>
                            <select name="status" value={form.status} onChange={handleChange} className={`${inputClass} font-bold ${form.status === 'completed' ? 'text-green-500' : form.status === 'missed' ? 'text-red-500' : 'text-cyan-500'}`}>
                                <option value="pending">⏳ Pendiente</option>
                                <option value="completed">✅ Realizada</option>
                                <option value="missed">❌ Perdida</option>
                                <option value="cancelled">🚫 Cancelada</option>
                            </select>
                        </div>
                    </div>

                    {/* Tipo, Asignado y Empresa */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Tipo</label>
                            <select name="event_type" value={form.event_type} onChange={handleChange} className={inputClass}>
                                <option value="meeting">🤝 Reunión</option>
                                <option value="task">📋 Tarea</option>
                                <option value="block">🚫 Bloqueo</option>
                                <option value="reminder">⏰ Recordatorio</option>
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Asignado a</label>
                            <select name="assigned_to" value={form.assigned_to} onChange={handleChange} className={inputClass}>
                                <option value="daniel">👤 Daniel</option>
                                <option value="gaston">👤 Gastón</option>
                                <option value="both">👥 Ambos</option>
                            </select>
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Empresa</label>
                            <input type="text" name="company_name" value={form.company_name} onChange={handleChange} placeholder="Nombre del Negocio" className={inputClass} />
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Inicio *</label>
                            <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Fin *</label>
                            <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} required className={inputClass} />
                        </div>
                    </div>

                    {/* Asistente y WhatsApp */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Asistente</label>
                            <input type="text" name="attendee_name" value={form.attendee_name} onChange={handleChange} placeholder="Nombre del cliente" className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>WhatsApp</label>
                            <div className="relative">
                                <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+56 9..." className={inputClass} />
                                {form.whatsapp && (
                                    <a href={`https://wa.me/${form.whatsapp.replace(/\D/g, '')}`} target="_blank" className="absolute right-2 top-1.5 p-1 hover:bg-green-500/20 text-green-500 rounded transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email y Sitio Web */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Email</label>
                            <input type="email" name="attendee_email" value={form.attendee_email} onChange={handleChange} placeholder="cliente@email.com" className={inputClass} />
                        </div>
                        <div>
                            <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Sitio Web</label>
                            <input type="text" name="website" value={form.website} onChange={handleChange} placeholder="www.ejemplo.cl" className={inputClass} />
                        </div>
                    </div>

                    {/* Notas previas */}
                    <div>
                        <label className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Notas Previas</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Contexto antes de la reunión..." className={inputClass} />
                    </div>

                    {/* Notas de Reunión (Post-meeting) - Siempre visible pero destacado cuando es completed */}
                    <div className={`p-4 rounded-xl border ${form.status === 'completed'
                        ? (isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200')
                        : (isDark ? 'bg-zinc-800/50 border-white/5' : 'bg-gray-50 border-gray-200')
                        }`}>
                        <label className={`text-xs font-medium uppercase tracking-wider flex items-center gap-2 mb-2 ${form.status === 'completed'
                                ? (isDark ? 'text-green-400' : 'text-green-600')
                                : (isDark ? 'text-zinc-500' : 'text-gray-500')
                            }`}>
                            📝 Notas de Cierre
                            {form.status === 'completed' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20">Reunión Completada</span>}
                        </label>
                        <textarea
                            name="meeting_notes"
                            value={form.meeting_notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="¿Qué se acordó? ¿Próximos pasos? ¿Resultado de la reunión?..."
                            className={`${inputClass} ${form.status === 'completed' ? (isDark ? 'border-green-500/30' : 'border-green-300') : ''}`}
                        />
                    </div>

                    {/* Reminder Toggle */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                                <Mail className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Notificar al Equipo</p>
                                <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Recibir recordatorio por Email</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="send_reminder_email"
                                checked={form.send_reminder_email}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        {onDelete ? (
                            <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all">
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        ) : <div />}

                        <div className="flex items-center gap-2">
                            <button type="button" onClick={onClose} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'text-zinc-400 hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'}`}>Cancelar</button>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-900/20">
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
