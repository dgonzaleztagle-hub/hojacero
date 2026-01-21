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
    const estado = getEstado(cliente.ultimo_pago, cliente.dia_cobro, cliente.contract_start);

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
            {/* Status Indicator Line */}
            <div className={`
                absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300
                ${estado.prioridad <= 2 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                    estado.prioridad === 3 ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' :
                        'bg-emerald-500/50'
                }
            `} />

            <div className="flex flex-col gap-4 pl-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    {/* Header: Name + Badge */}
                    <div className="flex items-center gap-3">
                        <h3 className={`font-bold text-xl truncate transition-colors ${isSelected ? 'text-blue-200' : 'text-zinc-100 group-hover:text-white'}`}>
                            {cliente.client_name}
                        </h3>
                        {cliente.alertas_count > 0 && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3" />
                                {cliente.alertas_count}
                            </span>
                        )}
                    </div>

                    {/* Meta Info: Plan | Price | URL */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <span className="uppercase tracking-wider font-bold text-zinc-400 text-xs bg-white/5 px-2 py-0.5 rounded">{cliente.plan_type}</span>
                            <span className="font-mono text-zinc-300 group-hover:text-white transition-colors">
                                ${(cliente.monto_mensual || 0).toLocaleString()} <span className="text-zinc-600 text-xs">/mes</span>
                            </span>
                        </div>

                        {/* Desktop URL Link */}
                        <a
                            href={`https://${cliente.site_url}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="hidden md:flex items-center gap-1.5 text-xs text-blue-500/60 hover:text-blue-400 transition-colors hover:underline"
                        >
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[200px]">{cliente.site_url}</span>
                        </a>
                    </div>
                </div>

                {/* Right Side: Status & Badges & Mobile Arrow */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:gap-1">
                    <div className={`
                        px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-lg backdrop-blur-sm
                        ${estado.color.replace('text-', 'text-').replace('bg-', 'bg-').replace('/20', '/10')} 
                        border-white/5
                    `}>
                        {estado.estado}
                    </div>

                    <div className={`text-sm font-mono font-bold ${estado.prioridad <= 2 ? 'text-red-400' : 'text-zinc-500'}`}>
                        {estado.diasVencido > 0
                            ? `Hace ${estado.diasVencido} días`
                            : estado.diasVencido === 0 ? 'Vence HOY' : `Faltan ${Math.abs(estado.diasVencido)} días`
                        }
                    </div>
                </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hidden md:block">
                    <ChevronRight className="w-6 h-6" />
                </div>
            )}
        </div>
    );
}
