
'use client';

import { useState } from 'react';
import { useAdsFactory } from '@/hooks/factory/useAdsFactory';
import { LandingConfig } from '@/types/factory';
import { Save, Eye, ArrowLeft, Layout, Type, Image as ImageIcon, MessageCircle, Star, MoveUp, MoveDown, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import SectionRenderer from './SectionRenderer';
import { useDashboard } from '@/app/dashboard/DashboardContext';

export default function AdsFactoryEditor({ initialData }: { initialData?: LandingConfig }) {
    const { config, updateSection, updateContent, reorderSections } = useAdsFactory(initialData);
    const { theme } = useDashboard();
    const isDark = theme === 'dark';
    const [view, setView] = useState<'edit' | 'preview'>('edit');
    const [selectedId, setSelectedId] = useState<string | null>(config.sections[0]?.id || null);

    const selectedSection = config.sections.find(s => s.id === selectedId);

    const handleSave = () => {
        alert('Configuración guardada (Simulado). \nSlug: ' + config.slug);
    };

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-gray-100 text-gray-900'}`}>
            {/* Top Bar */}
            <div className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-md shrink-0 ${isDark ? 'border-white/10 bg-black/50' : 'border-gray-200 bg-white/80'}`}>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/ads-factory" className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className={`h-4 w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                    <input
                        className={`bg-transparent border-none focus:ring-0 text-lg font-black tracking-tighter uppercase italic w-64 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        value={config.title || 'SIN TÍTULO'}
                        onChange={(e) => {/* update title */ }}
                        placeholder="Nombre de la Campaña"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex p-1 rounded-xl border mr-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                        <button
                            onClick={() => setView('edit')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'edit' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            EDITOR
                        </button>
                        <button
                            onClick={() => setView('preview')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'preview' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            VISTA PREVIA
                        </button>
                    </div>

                    <button
                        onClick={handleSave}
                        className={`h-10 px-6 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        <Save className="w-4 h-4" />
                        GUARDAR CAMBIOS
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {view === 'edit' ? (
                    <>
                        {/* Sidebar: Layer List */}
                        <div className={`w-80 border-r flex flex-col shrink-0 ${isDark ? 'border-white/10 bg-black' : 'border-gray-200 bg-white'}`}>
                            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Estructura de la Landing</h3>
                                <div className="space-y-2">
                                    {config.sections.map((section, idx) => (
                                        <div
                                            key={section.id}
                                            onClick={() => setSelectedId(section.id)}
                                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedId === section.id
                                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                                    : isDark
                                                        ? 'bg-white/5 border-white/5 hover:border-white/10 text-gray-400'
                                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-500'
                                                }`}
                                        >
                                            <div className="shrink-0">
                                                {section.type === 'hero' && <Layout className="w-4 h-4" />}
                                                {section.type === 'proof' && <Star className="w-4 h-4" />}
                                                {section.type === 'cta' && <MessageCircle className="w-4 h-4" />}
                                            </div>
                                            <span className="text-xs font-bold uppercase flex-1">{section.type}</span>
                                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:text-white"><MoveUp className="w-3 h-3" /></button>
                                                <button className="p-1 hover:text-white"><MoveDown className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full mt-6 py-3 border border-dashed rounded-xl text-gray-500 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'border-white/20 hover:text-white hover:border-white/40' : 'border-gray-300 hover:text-gray-900 hover:border-gray-400'
                                    }`}>
                                    <Plus className="w-4 h-4" />
                                    Añadir Bloque
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Ajustes Globales</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-widest">Slug de la Campaña</label>
                                        <input
                                            className={`w-full border rounded-xl px-4 py-2 text-sm font-mono text-cyan-500 focus:outline-none focus:border-cyan-500/50 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                                                }`}
                                            value={config.slug}
                                            onChange={(e) => {/* update slug */ }}
                                            placeholder="ej: promo-invierno"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2 tracking-widest">Color de Acento</label>
                                        <div className="flex gap-3">
                                            <input type="color" className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" value={config.primary_color} />
                                            <input className={`flex-1 border rounded-xl px-4 text-xs font-mono ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
                                                }`} value={config.primary_color} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inspector: Properties */}
                        <div className={`w-96 border-l flex flex-col shrink-0 order-last ${isDark ? 'border-white/10 bg-black' : 'border-gray-200 bg-white'}`}>
                            <div className="p-6 h-full overflow-y-auto">
                                {!selectedSection ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                                        <p className="text-xs uppercase font-bold tracking-widest">Selecciona un bloque para editar sus propiedades</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className={`text-sm font-black uppercase tracking-tighter mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>EDITANDO: {selectedSection.type}</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {selectedSection.id}</p>
                                        </div>

                                        <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} />

                                        {/* Dynamic Controls based on type */}
                                        {selectedSection.type === 'hero' && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Título Principal</label>
                                                    <textarea
                                                        className={`w-full border rounded-xl p-4 text-sm focus:outline-none focus:border-cyan-500/50 min-h-[100px] ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
                                                            }`}
                                                        value={selectedSection.content.title}
                                                        onChange={(e) => updateContent(selectedSection.id, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Subtítulo / Bajada</label>
                                                    <textarea
                                                        className={`w-full border rounded-xl p-4 text-xs focus:outline-none focus:border-cyan-500/50 min-h-[80px] ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
                                                            }`}
                                                        value={selectedSection.content.subtitle}
                                                        onChange={(e) => updateContent(selectedSection.id, 'subtitle', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Etiqueta Botón</label>
                                                    <input
                                                        className={`w-full border rounded-xl px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:border-cyan-500/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'
                                                            }`}
                                                        value={selectedSection.content.cta_text}
                                                        onChange={(e) => updateContent(selectedSection.id, 'cta_text', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {selectedSection.type === 'cta' && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">WhatsApp (incluye código país)</label>
                                                    <input
                                                        className={`w-full border rounded-xl px-4 py-3 text-xs font-mono text-green-400 focus:outline-none focus:border-green-500/50 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
                                                            }`}
                                                        value={selectedSection.content.whatsapp_number}
                                                        onChange={(e) => updateContent(selectedSection.id, 'whatsapp_number', e.target.value)}
                                                        placeholder="ej: 56912345678"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-10">
                                            <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                                Eliminar Bloque
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Center: Live Canvas Preview */}
                        <div className={`flex-1 overflow-y-auto p-12 flex justify-center ${isDark ? 'bg-zinc-900 border-x border-white/10' : 'bg-gray-200 border-x border-gray-300'}`}>
                            <div className={`w-[100%] max-w-4xl bg-black rounded-[40px] shadow-2xl overflow-hidden border h-fit scale-[0.8] origin-top ${isDark ? 'border-white/10' : 'border-gray-100'
                                }`}>
                                {config.sections.map((section) => (
                                    <div
                                        key={section.id}
                                        onClick={() => setSelectedId(section.id)}
                                        className={`relative group cursor-pointer ${selectedId === section.id ? 'ring-2 ring-cyan-500' : 'hover:ring-1 hover:ring-white/20'}`}
                                    >
                                        <SectionRenderer section={section} primaryColor={config.primary_color} />
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            BLOQUE: {section.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Full Preview Mode */
                    <div className="flex-1 bg-black overflow-y-auto h-full w-full">
                        {config.sections.map((section) => (
                            <SectionRenderer
                                key={section.id}
                                section={section}
                                primaryColor={config.primary_color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
