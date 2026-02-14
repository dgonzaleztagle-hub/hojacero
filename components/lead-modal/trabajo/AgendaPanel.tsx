import React from 'react';
import { Calendar, Loader2, Save } from 'lucide-react';

interface AgendaPanelProps {
    selectedLead: {
        next_action_date?: string | null;
        next_action_note?: string;
        [key: string]: unknown;
    };
    isDark: boolean;
    dateInput: string;
    setDateInput: (val: string) => void;
    timeInput: string;
    setTimeInput: (val: string) => void;
    nextActionNote: string;
    setNextActionNote: (val: string) => void;
    handleSaveAction: () => Promise<void> | void;
    isSavingAction: boolean;
}

export const AgendaPanel = ({
    selectedLead,
    isDark,
    dateInput,
    setDateInput,
    timeInput,
    setTimeInput,
    nextActionNote,
    setNextActionNote,
    handleSaveAction,
    isSavingAction
}: AgendaPanelProps) => {

    return (
        <div className={`mt-6 p-5 rounded-xl border ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Agenda de Seguimiento</h3>
                </div>
                {dateInput && (
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${new Date(dateInput + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0))
                        ? 'bg-red-500/20 text-red-500' // Vencido
                        : dateInput === new Date().toLocaleDateString('sv').split('T')[0] // 'sv' locale matches YYYY-MM-DD usually, or better use manual ISO
                            ? 'bg-amber-500/20 text-amber-500' // Hoy
                            : 'bg-green-500/20 text-green-500' // Futuro
                        }`}>
                        {new Date(dateInput + 'T12:00:00').toLocaleDateString()}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    {/* Quick Dates & Inputs Row */}
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar shrink-0">
                            {[
                                { label: 'Para Hoy', days: 0 },
                                { label: 'Mañana', days: 1 },
                                { label: 'Próx. Lunes', days: (1 + 7 - new Date().getDay()) % 7 || 7 } // Next Monday
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + opt.days);
                                        setDateInput(d.toISOString().split('T')[0]);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors whitespace-nowrap ${isDark
                                        ? 'bg-zinc-900 border-white/10 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400'
                                        : 'bg-gray-50 border-gray-200 hover:border-amber-500 hover:text-amber-600 text-gray-600'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 flex-1">
                            <input
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className={`flex-1 px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-1 focus:ring-amber-500/50 min-w-0 ${isDark
                                    ? 'bg-zinc-900 border-white/10 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                            <input
                                type="time"
                                value={timeInput}
                                onChange={(e) => setTimeInput(e.target.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-1 focus:ring-amber-500/50 w-[80px] shrink-0 ${isDark
                                    ? 'bg-zinc-900 border-white/10 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        value={nextActionNote}
                        onChange={(e) => setNextActionNote(e.target.value)}
                        placeholder="Nota para la acción (ej. Llamar para cerrar)"
                        className={`flex-1 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-1 focus:ring-amber-500/50 ${isDark
                            ? 'bg-black/20 border-white/10 text-white placeholder:text-zinc-600'
                            : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                    <button
                        onClick={handleSaveAction}
                        disabled={isSavingAction}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all ${isDark
                            ? 'bg-amber-500 hover:bg-amber-400 text-black'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                            } disabled:opacity-50`}
                    >
                        {isSavingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar
                    </button>
                </div>
            </div>

            {/* CURRENT AGENDA SUMMARY (PREMIUM CALENDAR CARD) */}
            {selectedLead.next_action_date && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <div className={`p-0 rounded-2xl border overflow-hidden relative group ${isDark ? 'bg-zinc-900/40 border-amber-500/20' : 'bg-white border-amber-200'}`}>
                        {/* Accent Bar */}
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500"></div>

                        <div className="p-4 pl-5 flex items-center justify-between gap-4">
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                        Próximo Evento
                                    </div>
                                </div>

                                <h3 className={`text-sm font-bold leading-tight truncate pr-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {selectedLead.next_action_note || "Sin nota descriptiva"}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                    <span className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                        {new Date(selectedLead.next_action_date).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            <div className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center min-w-[70px] border ${isDark ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    {new Date(selectedLead.next_action_date).toLocaleDateString('es-CL', { month: 'short' }).replace('.', '')}
                                </span>
                                <span className={`text-2xl font-bold leading-none my-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {new Date(selectedLead.next_action_date).getDate()}
                                </span>
                                <span className={`text-[9px] uppercase ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                    {new Date(selectedLead.next_action_date).getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
