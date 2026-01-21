import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Cliente } from './types';
import { MessageSquare, RefreshCcw } from 'lucide-react';

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
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2 text-zinc-100">
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    Bitácora Viva
                </h3>
                <button onClick={fetchActivities} className="text-zinc-500 hover:text-white transition-colors">
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
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mb-1" />
                            <div className="w-px h-full bg-zinc-800/50" />
                        </div>
                        <div className="bg-zinc-800/20 p-2 rounded border border-white/5 flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-zinc-300 uppercase text-[10px] tracking-wider">{log.accion.replace(/_/g, ' ')}</span>
                                <span className="text-[10px] text-zinc-600 font-mono">
                                    {new Date(log.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-zinc-400 leading-relaxed mb-1">
                                {log.nota || 'Sin detalles'}
                            </p>
                            <div className="text-[10px] text-zinc-600 flex items-center gap-1">
                                Base: <span className="text-zinc-500">{log.estado_nuevo}</span> • por {log.usuario || 'Sistema'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
