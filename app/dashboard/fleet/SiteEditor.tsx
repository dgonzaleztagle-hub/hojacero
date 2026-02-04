'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, CheckCircle2, AlertCircle, Type, ImageIcon, DollarSign, Layout, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CMSConfig, CMSContent, Site } from '@/types/cms';

interface SiteEditorProps {
    site: Site;
    onClose: () => void;
    onSaved: () => void;
}

export function SiteEditor({ site, onClose, onSaved }: SiteEditorProps) {
    const [config, setConfig] = useState<CMSConfig | null>(null);
    const [data, setData] = useState<CMSContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Carga de Config y Contenido vía Fleet API
    useEffect(() => {
        async function loadSiteData() {
            try {
                const res = await fetch('/api/fleet/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ siteId: site.id })
                });

                const { results } = await res.json();

                if (results['data/cms-config.json']) setConfig(results['data/cms-config.json'].data);
                if (results['data/cms-content.json']) setData(results['data/cms-content.json'].data);

            } catch (error) {
                toast.error('Error al cargar datos del sitio');
                onClose();
            } finally {
                setLoading(false);
            }
        }
        loadSiteData();
    }, [site.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/fleet/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId: site.id,
                    data: data,
                    message: `Actualización centralizada vía Portaaviones H0`
                })
            });

            const result = await res.json();
            if (result.success) {
                toast.success('Cambios publicados en la armada');
                onSaved();
                onClose();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast.error(`Fallo: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null; // El loading se maneja con el overlay del padre

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 z-[100] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
        >
            {/* Header del Editor */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <Terminal className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                            Modificando: {site.client_name}
                        </h2>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                            <Github size={10} /> {site.github_owner}/{site.github_repo}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Selector de Categorías (Tabs) */}
            <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar bg-[#080808] px-4">
                {config?.categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={cn(
                            "px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap",
                            activeTab === i
                                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                                : "border-transparent text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Área de Edición */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                {config?.categories[activeTab]?.fields.map((field) => (
                    <div key={field.id} className="space-y-4 group">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-white/5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
                                {field.type === 'text' && <Type size={14} />}
                                {field.type === 'image' && <ImageIcon size={14} />}
                                {field.type === 'price' && <DollarSign size={14} />}
                                {field.type === 'rich-text' && <Layout size={14} />}
                            </div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
                                {field.label}
                            </label>
                            <span className="text-[8px] font-mono text-zinc-700 ml-auto">REF: {field.id}</span>
                        </div>

                        {field.type === 'rich-text' || field.type === 'text' ? (
                            <textarea
                                value={data?.[field.id] || ''}
                                onChange={(e) => setData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="w-full bg-[#111] border border-white/5 rounded-2xl p-6 text-sm text-zinc-300 focus:border-cyan-500/50 outline-none transition-all min-h-[120px] resize-none font-medium leading-relaxed"
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <input
                                type="text"
                                value={data?.[field.id] || ''}
                                onChange={(e) => setData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 px-6 text-sm text-zinc-300 focus:border-cyan-500/50 outline-none transition-all font-medium"
                                placeholder={field.placeholder}
                            />
                        )}

                        {field.description && (
                            <p className="text-[9px] text-zinc-600 italic pl-2">{field.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer con Acción Maestro */}
            <div className="p-8 border-t border-white/5 bg-[#0d0d0d] flex items-center justify-between">
                <div className="flex items-center gap-3 text-zinc-600">
                    <AlertCircle size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Cambios pendientes de Deploy</span>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-4 bg-cyan-500 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                    {saving ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Sincronizando...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Publicar en Producción
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

import { Github, Edit3 } from 'lucide-react';
