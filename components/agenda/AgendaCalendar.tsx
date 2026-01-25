'use client';

import { useMemo } from 'react';

interface AgendaEvent {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    event_type: string;
    status: string;
    source: string;
    attendee_name?: string;
    company_name?: string;
}

interface AgendaCalendarProps {
    events: AgendaEvent[];
    currentDate: Date;
    onEventClick: (event: AgendaEvent) => void;
    isDark: boolean;
}

export function AgendaCalendar({ events, currentDate, onEventClick, isDark }: AgendaCalendarProps) {
    const calendar = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startPadding = firstDay.getDay(); // 0 = Sunday

        const days: { date: Date; isCurrentMonth: boolean }[] = [];

        // Días del mes anterior (padding)
        for (let i = startPadding - 1; i >= 0; i--) {
            const date = new Date(year, month, -i);
            days.push({ date, isCurrentMonth: false });
        }

        // Días del mes actual
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Días del mes siguiente (para completar grid)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    }, [currentDate]);

    const getEventsForDay = (date: Date) => {
        return events.filter(e => {
            const eventDate = new Date(e.start_time);
            return eventDate.toDateString() === date.toDateString();
        });
    };

    const today = new Date().toDateString();
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    const getEventColor = (type: string) => {
        switch (type) {
            case 'meeting': return isDark ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-blue-100 border-blue-300 text-blue-700';
            case 'task': return isDark ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-purple-100 border-purple-300 text-purple-700';
            case 'block': return isDark ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-red-100 border-red-300 text-red-700';
            default: return isDark ? 'bg-zinc-500/20 border-zinc-500/50 text-zinc-400' : 'bg-gray-100 border-gray-300 text-gray-700';
        }
    };

    return (
        <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-gray-200'}`}>
            {/* Header con días de la semana */}
            <div className="grid grid-cols-7">
                {dayNames.map(day => (
                    <div
                        key={day}
                        className={`py-3 text-center text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500 bg-black/40' : 'text-gray-500 bg-gray-50'
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7">
                {calendar.map(({ date, isCurrentMonth }, idx) => {
                    const isToday = date.toDateString() === today;
                    const dayEvents = getEventsForDay(date);

                    return (
                        <div
                            key={idx}
                            className={`min-h-[100px] p-2 border-t border-l first:border-l-0 ${isDark
                                ? 'border-white/5'
                                : 'border-gray-100'
                                } ${!isCurrentMonth ? (isDark ? 'bg-black/20' : 'bg-gray-50') : ''}`}
                        >
                            <div className={`text-xs font-medium mb-1 ${isToday
                                ? 'w-6 h-6 flex items-center justify-center rounded-full bg-cyan-500 text-white'
                                : isCurrentMonth
                                    ? isDark ? 'text-zinc-400' : 'text-gray-700'
                                    : isDark ? 'text-zinc-700' : 'text-gray-300'
                                }`}>
                                {date.getDate()}
                            </div>

                            {/* Eventos del día */}
                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map(event => (
                                    <div
                                        key={event.id}
                                        onClick={() => onEventClick(event)}
                                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-1.5 ${getEventColor(event.event_type)}`}
                                        title={`${event.title}${event.attendee_name ? ` - ${event.attendee_name}` : ''}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.status === 'completed' ? 'bg-green-500' :
                                            event.status === 'missed' ? 'bg-orange-500' :
                                                event.status === 'cancelled' ? 'bg-red-500' :
                                                    'bg-blue-400'
                                            }`} />
                                        <span className="truncate">
                                            {new Date(event.start_time).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} {event.title}
                                        </span>
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                        +{dayEvents.length - 3} más
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
