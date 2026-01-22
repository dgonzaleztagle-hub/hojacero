'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, User, MapPin, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useDashboard } from '../DashboardContext';
import { EventModal } from '@/components/agenda/EventModal';
import { AgendaCalendar } from '@/components/agenda/AgendaCalendar';

interface AgendaEvent {
    id: string;
    title: string;
    description?: string;
    event_type: string;
    start_time: string;
    end_time: string;
    attendee_name?: string;
    attendee_email?: string;
    status: string;
    source: string;
    leads?: { nombre: string; sitio_web?: string };
}

export default function AgendaPage() {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
    const [view, setView] = useState<'month' | 'week'>('week');

    const fetchEvents = async () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

        const res = await fetch(`/api/agenda/events?start=${startOfMonth.toISOString()}&end=${endOfMonth.toISOString()}`);
        const data = await res.json();
        if (data.success) {
            setEvents(data.events);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setShowModal(true);
    };

    const handleEditEvent = (event: AgendaEvent) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleSaveEvent = async (eventData: any) => {
        const method = selectedEvent ? 'PATCH' : 'POST';
        const body = selectedEvent ? { id: selectedEvent.id, ...eventData } : eventData;

        await fetch('/api/agenda/events', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        setShowModal(false);
        fetchEvents();
    };

    const handleDeleteEvent = async (id: string) => {
        await fetch(`/api/agenda/events?id=${id}`, { method: 'DELETE' });
        fetchEvents();
    };

    // Próximos eventos (sidebar)
    const upcomingEvents = events
        .filter(e => new Date(e.start_time) >= new Date() && e.status !== 'cancelled')
        .slice(0, 5);

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className="flex h-full">
            {/* Main Calendar Area */}
            <div className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Agenda
                        </h1>
                        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Gestiona tus reuniones y eventos
                        </p>
                    </div>
                    <button
                        onClick={handleCreateEvent}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Reunión
                    </button>
                </div>

                {/* Calendar Navigation */}
                <div className={`flex items-center justify-between mb-4 p-4 rounded-xl ${isDark ? 'bg-zinc-900/50 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
                    <button onClick={handlePrevMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                        <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`} />
                    </button>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={handleNextMonth} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`} />
                    </button>
                </div>

                {/* Calendar Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                    </div>
                ) : (
                    <AgendaCalendar
                        events={events}
                        currentDate={currentDate}
                        onEventClick={handleEditEvent}
                        isDark={isDark}
                    />
                )}
            </div>

            {/* Sidebar - Próximos Eventos */}
            <div className={`w-80 border-l p-6 ${isDark ? 'bg-zinc-950 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                    Próximos Eventos
                </h3>

                {upcomingEvents.length === 0 ? (
                    <p className={`text-sm ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                        No hay eventos próximos
                    </p>
                ) : (
                    <div className="space-y-3">
                        {upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={() => handleEditEvent(event)}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${isDark
                                    ? 'bg-zinc-900 border border-white/10 hover:border-cyan-500/50'
                                    : 'bg-white border border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {event.title}
                                        </p>
                                        <div className={`flex items-center gap-2 text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                            <Clock className="w-3 h-3" />
                                            {new Date(event.start_time).toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            {' • '}
                                            {new Date(event.start_time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {event.attendee_name && (
                                            <div className={`flex items-center gap-1 text-xs mt-1 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                                <User className="w-3 h-3" />
                                                {event.attendee_name}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${event.source === 'bot'
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'bg-zinc-500/20 text-zinc-400'
                                        }`}>
                                        {event.source}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <EventModal
                    event={selectedEvent}
                    onSave={handleSaveEvent}
                    onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
                    onClose={() => setShowModal(false)}
                    isDark={isDark}
                />
            )}
        </div>
    );
}
