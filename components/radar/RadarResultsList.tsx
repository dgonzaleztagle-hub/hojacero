import React from 'react';
import { MapPin, Mail, MessageCircle, Instagram, Phone, ChevronRight } from 'lucide-react';
import { ScoreIndicator } from './shared';
import { getAnalysis } from '@/utils/radar-helpers';

interface RadarResultsListProps {
    leads: any[];
    onSelectLead: (lead: any) => void;
}

export function RadarResultsList({ leads, onSelectLead }: RadarResultsListProps) {
    if (!leads.length) return null;

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-12 gap-4 px-6 text-[10px] uppercase tracking-wider font-bold text-zinc-500 pb-2 border-b border-white/5">
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
                        className="group grid grid-cols-12 gap-4 p-4 items-center bg-black border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-white/[0.02] cursor-pointer transition-all"
                    >
                        {/* NAME & ADDRESS */}
                        <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-white truncate text-sm group-hover:text-cyan-400 transition-colors">
                                    {lead.title || lead.nombre}
                                </h3>
                                {!(lead.website || lead.sitio_web) && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 text-[9px] font-bold flex-shrink-0">NO WEB</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-zinc-600 text-xs mt-0.5 truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{lead.address || lead.direccion}</span>
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
                                <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
                                    <Phone className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        {/* OPPORTUNITY */}
                        <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-medium">{analysis.opportunity || 'Pendiente'}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                                {analysis.salesStrategy?.hook || analysis.analysisReport?.slice(0, 50) || '...'}
                            </p>
                        </div>

                        {/* TECH STACK */}
                        <div className="col-span-2 flex items-center gap-1 flex-wrap">
                            {(lead.techStack || lead.source_data?.techStack || []).slice(0, 2).map((tech: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]">{tech}</span>
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
                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
