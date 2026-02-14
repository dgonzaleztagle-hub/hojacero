import React from 'react';

interface ActivityListProps {
    leadActivities: Array<{
        id?: string;
        created_at?: string;
        accion?: string;
        nota?: string;
        usuario?: string;
        estado_anterior?: string;
        estado_nuevo?: string;
        [key: string]: unknown;
    }>;
    isDark: boolean;
}

export const ActivityList = ({ leadActivities, isDark }: ActivityListProps) => {
    return (
        <div className={`border-t pt-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Historial de Actividad</h3>

            <div className="space-y-4 pl-2 border-l border-zinc-700/50 ml-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                {leadActivities.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic pl-3">Sin actividad registrada</p>
                ) : (
                    leadActivities.map((log, idx) => {
                        const createdAt = log.created_at || new Date().toISOString();
                        const eventDate = new Date(createdAt);
                        const eventLabel = log.accion || 'actividad';
                        const itemKey = log.id || `${createdAt}-${idx}`;
                        return (
                        <div key={itemKey} className="relative pl-5 pb-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${isDark ? 'bg-zinc-900 border-zinc-600' : 'bg-white border-gray-300'}`}></div>
                            <div className="flex flex-col">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                        {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <span className={`text-sm mt-0.5 font-medium ${isDark ? 'text-zinc-300' : 'text-gray-800'}`}>
                                    {eventLabel === 'contacted' ? '💬 Contactado' :
                                        eventLabel === 'proposal_sent' ? '📄 Propuesta Enviada' :
                                            eventLabel === 'qualified' ? '✅ Calificado' :
                                                eventLabel === 'discarded' ? '🗑️ Descartado' :
                                                    eventLabel === 'closed_won' ? '🎉 Ganado' :
                                                        eventLabel === 'closed_lost' ? '❌ Perdido' : eventLabel}
                                </span>
                                {log.nota && (
                                    <p className="text-xs text-zinc-400 mt-1.5 italic bg-white/5 p-2 rounded-lg leading-relaxed">
                                        &quot;{log.nota}&quot;
                                    </p>
                                )}
                                <span className="text-[10px] text-zinc-600 mt-1">
                                    por {log.usuario} • {log.estado_anterior} → {log.estado_nuevo}
                                </span>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};
