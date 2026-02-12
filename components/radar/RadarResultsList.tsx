import React from 'react';
import { MapPin, Mail, MessageCircle, Instagram, Phone, ChevronRight } from 'lucide-react';
import { ScoreIndicator } from './shared';
import { getAnalysis } from '@/utils/radar-helpers';
import { useDashboard } from '@/app/dashboard/DashboardContext';

interface RadarResultsListProps {
    leads: any[];
    onSelectLead: (lead: any) => void;
    isLoading?: boolean;
    activeTab?: string;
}

export function RadarResultsList({ leads, onSelectLead, isLoading, activeTab }: RadarResultsListProps) {
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    if (isLoading) return null;

    if (!leads.length) {
        return (
            <div className={`flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl text-center animate-in fade-in duration-500 ${isDark ? 'border-white/5 bg-black/20' : 'border-gray-200 bg-gray-50'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <span className="text-xl">📭</span>
                </div>
                <h3 className={`font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>No hay registros aquí</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                    {activeTab === 'closed' ? 'Tus leads archivados aparecerán aquí.' :
                        activeTab === 'history' ? 'Aquí verás los leads que descartes.' :
                            'Inicia un escaneo para encontrar oportunidades.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`grid grid-cols-12 gap-4 px-6 text-[10px] uppercase tracking-wider font-bold pb-2 border-b ${isDark ? 'text-zinc-500 border-white/5' : 'text-gray-400 border-gray-200'}`}>
                <div className="col-span-3">Negocio</div>
                <div className="col-span-2">Contacto</div>
                <div className="col-span-3">Oportunidad</div>
                <div className="col-span-2">Tech</div>
                <div className="col-span-1 text-center">Score</div>
                <div className="col-span-1"></div>
            </div>

            {leads.map((lead, idx) => {
                const analysis = getAnalysis(lead);
                return (
                    <div
                        key={lead.id || idx}
                        onClick={() => onSelectLead(lead)}
                        className={`group grid grid-cols-12 gap-4 p-4 items-center border rounded-xl cursor-pointer transition-all ${isDark
                            ? 'bg-black border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.02]'
                            : 'bg-white border-gray-100 hover:border-cyan-500/50 hover:bg-gray-50 shadow-sm'
                            }`}
                    >
                        {/* NAME & ADDRESS */}
                        <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className={`font-medium truncate text-sm transition-colors ${isDark ? 'text-white group-hover:text-cyan-400' : 'text-gray-900 group-hover:text-cyan-600'}`}>
                                    {lead.title || lead.nombre}
                                </h3>
                                {!(lead.website || lead.sitio_web) && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-bold flex-shrink-0">NO WEB</span>
                                )}
                            </div>
                            <div className={`flex items-center gap-1 text-xs mt-0.5 truncate ${isDark ? 'text-zinc-600' : 'text-gray-500'}`}>
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{lead.address || lead.direccion}</span>
                                {(lead.revisado_por) && (
                                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] border ${isDark ? 'bg-zinc-800 text-zinc-400 border-white/5' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        🔍 {lead.revisado_por}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CONTACT ICONS */}
                        <div className="col-span-2 flex items-center gap-2">
                            {(lead.emails?.length > 0 || lead.email) && (
                                <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400" title={lead.emails?.[0] || lead.email}>
                                    <Mail className="w-3 h-3" />
                                </div>
                            )}
                            {(lead.whatsapp || lead.source_data?.whatsapp) && (
                                <div className="p-1.5 rounded bg-green-500/10 text-green-400" title="WhatsApp disponible">
                                    <MessageCircle className="w-3 h-3" />
                                </div>
                            )}
                            {(lead.instagram || lead.source_data?.instagram) && (
                                <div className="p-1.5 rounded bg-pink-500/10 text-pink-400">
                                    <Instagram className="w-3 h-3" />
                                </div>
                            )}
                            {lead.telefono && (
                                <div className={`p-1.5 rounded ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                    <Phone className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        {/* OPPORTUNITY */}
                        <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{analysis.opportunity || 'Pendiente'}</span>
                            </div>
                            <p className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                {analysis.salesStrategy?.hook || analysis.analysisReport?.slice(0, 50) || '...'}
                            </p>
                        </div>

                        {/* TECH STACK */}
                        <div className="col-span-2 flex items-center gap-1 flex-wrap">
                            {(lead.techStack || lead.source_data?.techStack || []).slice(0, 2).map((tech: string, i: number) => (
                                <span key={i} className={`px-1.5 py-0.5 rounded text-[9px] ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>{tech}</span>
                            ))}
                            {(lead.hasSSL === false || lead.source_data?.hasSSL === false) && (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px]">No SSL</span>
                            )}
                        </div>

                        {/* SCORE */}
                        <div className="col-span-1 flex justify-center">
                            <ScoreIndicator score={analysis.score || 0} />
                        </div>

                        {/* ARROW */}
                        <div className="col-span-1 flex justify-end">
                            <ChevronRight className={`w-4 h-4 transition-colors ${isDark ? 'text-zinc-700 group-hover:text-cyan-400' : 'text-gray-300 group-hover:text-cyan-600'}`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
