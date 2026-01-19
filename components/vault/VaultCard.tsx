'use client';

import { ChevronRight, AlertTriangle, Globe } from 'lucide-react';
import { Cliente } from './types';
import { getEstado } from './utils';

interface VaultCardProps {
    cliente: Cliente;
    isSelected: boolean;
    onClick: () => void;
}

export default function VaultCard({ cliente, isSelected, onClick }: VaultCardProps) {
    const estado = getEstado(cliente.ultimo_pago, cliente.dia_cobro);

    return (
        <div
            onClick={onClick}
            className={`
                group relative overflow-hidden rounded-xl border p-5 cursor-pointer transition-all duration-300
                hover:shadow-lg hover:scale-[1.01]
                ${isSelected
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-blue-900/20'
                    : 'bg-zinc-900/50 border-white/5 hover:border-white/10 hover:bg-zinc-900'
                }
            `}
        >
            {/* Status Indicator Line (Left Border substitute) */}
            <div className={`
                absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
                ${estado.prioridad <= 2 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                    estado.prioridad === 3 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                        'bg-emerald-500/50'
                }
            `} />

            <div className="flex items-start justify-between pl-3">
                <div className="flex flex-col gap-1 min-w-0">
                    {/* Header: Name + Badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg truncate transition-colors ${isSelected ? 'text-blue-200' : 'text-zinc-100 group-hover:text-white'}`}>
                            {cliente.client_name}
                        </h3>
                        {cliente.alertas_count > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                {cliente.alertas_count}
                            </span>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        <span className="uppercase tracking-wider font-medium">{cliente.plan_type}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span className="font-mono text-zinc-400 group-hover:text-zinc-300">
                            ${(cliente.monto_mensual || 0).toLocaleString()}
                        </span>
                    </div>

                    {/* URL */}
                    <a
                        href={`https://${cliente.site_url}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs text-blue-500/60 hover:text-blue-400 transition-colors mt-2"
                    >
                        <Globe className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{cliente.site_url}</span>
                    </a>
                </div>

                {/* Right Side: Status Pill */}
                <div className="flex flex-col items-end gap-3">
                    <div className={`
                        px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                        ${estado.color.replace('text-', 'text-').replace('bg-', 'bg-').replace('/20', '/10')} 
                        border-white/5
                    `}>
                        {estado.estado}
                    </div>

                    <div className={`text-xs font-mono font-medium ${estado.prioridad <= 2 ? 'text-red-400' : 'text-zinc-500'}`}>
                        {estado.diasVencido > 0
                            ? `-${estado.diasVencido}d`
                            : estado.diasVencido === 0 ? 'HOY' : `${Math.abs(estado.diasVencido)}d`
                        }
                    </div>
                </div>
            </div>

            {/* Hover Action */}
            <div className={`
                absolute right-4 bottom-4 transition-all duration-300 transform
                ${isSelected ? 'translate-x-0 opacity-100 text-blue-400' : 'translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-zinc-400'}
            `}>
                <ChevronRight className="w-5 h-5" />
            </div>
        </div>
    );
}
