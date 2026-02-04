'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Settings, Globe, Github, Box, Activity } from 'lucide-react';
import { Site } from '@/types/cms';


export function FleetGrid({ sites, onEdit }: { sites: Site[], onEdit: (site: Site) => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={site.id}
                    className="group bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden flex flex-col gap-6"
                >
                    {/* Efecto de Fondo */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />

                    {/* Badge de Estatus */}
                    <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                            <Box className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Sync Active</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 relative z-10">
                        <h3 className="text-2xl font-black italic tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase leading-none">
                            {site.client_name}
                        </h3>

                        <div className="space-y-2">
                            <a
                                href={site.site_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                            >
                                <Globe size={14} className="text-zinc-700" />
                                {site.site_url.replace('https://', '')}
                                <ExternalLink size={12} />
                            </a>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
                                    <Github size={12} />
                                    {site.github_owner}/{site.github_repo}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-10">
                        <button
                            onClick={() => onEdit(site)}
                            className="flex-1 py-3.5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                        >
                            <Settings size={14} />
                            Editar Realidad
                        </button>
                    </div>

                    {/* Huella Técnica Minimalista */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-3">
                            <Activity size={12} className="text-cyan-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Health: 100%</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-700 uppercase">Rev. 2026.02</span>
                    </div>
                </motion.div>
            ))}

            {/* Tarjeta de "Add New" (Visual Only for now) */}
            <div className="bg-zinc-900/30 border border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-center group hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-zinc-600 group-hover:text-zinc-400 group-hover:scale-110 transition-all">
                    <Box size={20} />
                </div>
                <div>
                    <div className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Añadir Activo</div>
                    <p className="text-[10px] text-zinc-700 font-medium">Usa /factory-export para certificar un nuevo sitio.</p>
                </div>
            </div>
        </div>
    );
}
