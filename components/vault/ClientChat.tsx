import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Cliente } from './types';
import { MessageSquare, RefreshCcw } from 'lucide-react';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface ActivityLog {
    id: string;
    created_at: string;
    accion: string;
    estado_nuevo: string;
    nota: string;
    usuario: string;
}

interface ClientChatProps {
    cliente: Cliente;
}

export default function ClientChat({ cliente }: ClientChatProps) {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const supabase = createClient();

    const fetchActivities = async () => {
        if (!cliente.lead_id) return;
        setLoading(true);
        const { data } = await supabase
            .from('lead_activity_log')
            .select('*')
            .eq('lead_id', cliente.lead_id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) setActivities(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchActivities();
    }, [cliente.lead_id]);

    return (
        <div className={`p-4 rounded-xl border mt-4 ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-gray-50 border-gray-200 shadow-inner'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    Bitácora Viva
                </h3>
                <button onClick={fetchActivities} className={`${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'} transition-colors`}>
                    <RefreshCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="h-60 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {!cliente.lead_id && (
                    <div className="text-center py-8 text-zinc-600 text-xs italic">
                        Este cliente es anterior a la Bitácora (Sin Lead ID).
                    </div>
                )}

                {cliente.lead_id && activities.length === 0 && !loading && (
                    <div className="text-center py-8 text-zinc-600 text-xs text-zinc-500">
                        No hay actividad registrada aún.
                    </div>
                )}

                {activities.map((log) => (
                    <div key={log.id} className="flex gap-3 text-xs">
                        <div className="mt-1 min-w-[30px] flex flex-col items-center">
                            <div className={`w-1.5 h-1.5 rounded-full mb-1 ${isDark ? 'bg-zinc-700' : 'bg-gray-300'}`} />
                            <div className={`w-px h-full ${isDark ? 'bg-zinc-800/50' : 'bg-gray-200'}`} />
                        </div>
                        <div className={`p-2 rounded border flex-1 ${isDark ? 'bg-zinc-800/20 border-white/5' : 'bg-white border-gray-200 shadow-sm'
                            }`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold uppercase text-[10px] tracking-wider ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>{log.accion.replace(/_/g, ' ')}</span>
                                <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                    {new Date(log.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className={`leading-relaxed mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-700'}`}>
                                {log.nota || 'Sin detalles'}
                            </p>
                            <div className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                                Base: <span className={isDark ? 'text-zinc-500' : 'text-gray-600'}>{log.estado_nuevo}</span> • por {log.usuario || 'Sistema'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
