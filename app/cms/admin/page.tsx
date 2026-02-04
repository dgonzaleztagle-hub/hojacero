'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    Type,
    DollarSign,
    Layout,
    ChevronRight,
    Loader2,
    Eye,
    ShieldCheck
} from 'lucide-react';
import { CMSConfig, CMSContent } from '@/types/cms';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * HOJACERO CMS - ADMIN DASHBOARD (Espejo de Campos)
 * Interfaz premium para autogestión standalone.
 */

export default function CMSAdminPage() {
    const [config, setConfig] = useState<CMSConfig | null>(null);
    const [data, setData] = useState<CMSContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeCategory, setActiveCategory] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessKey, setAccessKey] = useState('');

    // Verificar sesión previa
    useEffect(() => {
        const savedKey = localStorage.getItem('h0_cms_key');
        if (savedKey) {
            setAccessKey(savedKey);
            setIsAuthenticated(true);
        }
    }, []);

    // Carga inicial de Config y Contenido
    useEffect(() => {
        if (!isAuthenticated) return;
        async function init() {
            try {
                const [configRes, dataRes] = await Promise.all([
                    fetch('/api/cms/config'),
                    fetch('/api/cms/content')
                ]);
                setConfig(await configRes.json());
                setData(await dataRes.json());
            } catch (e) {
                toast.error('Error cargando la configuración del sitio');
            } finally {
                setLoading(false);
            }
        }
        init();
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessKey.length > 3) {
            localStorage.setItem('h0_cms_key', accessKey);
            setIsAuthenticated(true);
        } else {
            toast.error('Llave maestra inválida');
        }
    };

    const handleUpdate = (id: string, value: any) => {
        if (!data) return;
        const newData = { ...data };
        const keys = id.split('.');
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/cms/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-cms-secret': accessKey
                },
                body: JSON.stringify({ data })
            });
            if (!res.ok) throw new Error();
            toast.success('Cambios sincronizados con GitHub');
        } catch (e) {
            toast.error('Error al guardar cambios. Verifica tu llave maestra.');
        } finally {
            setSaving(false);
        }
    };

    // Muro de Acceso (Rigor H0 Aesthetics)
    if (!isAuthenticated) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl text-center"
            >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 mx-auto mb-8">
                    <ShieldCheck className="text-primary" size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2">Llave Maestra</h1>
                <p className="text-zinc-500 text-sm mb-8 uppercase tracking-widest font-medium">Factory CMS Standalone</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        placeholder="Ingresa tu secreto de acceso..."
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-center text-lg focus:outline-none focus:border-primary transition-all font-mono"
                    />
                    <button className="w-full bg-primary text-black font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all">
                        Desbloquear Panel
                    </button>
                </form>
            </motion.div>
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-primary/30">
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                            <ShieldCheck className="text-primary" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Factory <span className="text-primary">CMS Pro</span></h1>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Standalone Engine / v1.0</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.open('/', '_blank')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors text-sm"
                        >
                            <Eye size={16} />
                            <span>Ver Sitio</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            <span>{saving ? 'Sincronizando...' : 'Publicar Cambios'}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-12 gap-12">
                <aside className="col-span-3 space-y-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Categorías</p>
                    {config?.categories.map((cat, idx) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(idx)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                activeCategory === idx
                                    ? "bg-primary/10 border border-primary/20 text-white"
                                    : "hover:bg-white/5 border border-transparent text-zinc-500"
                            )}
                        >
                            <span className="text-sm font-medium">{cat.name}</span>
                            <ChevronRight size={14} className={cn("transition-transform", activeCategory === idx ? "rotate-90 text-primary" : "group-hover:translate-x-1")} />
                        </button>
                    ))}
                </aside>

                <section className="col-span-9 space-y-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold">{config?.categories[activeCategory].name}</h2>
                        <p className="text-zinc-500 mt-2">Gestiona el contenido dinámico de esta sección.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {config?.categories[activeCategory].fields.map((field) => (
                                    <div
                                        key={field.id}
                                        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                                                {field.type === 'text' && <Type size={18} className="text-zinc-400" />}
                                                {field.type === 'price' && <DollarSign size={18} className="text-zinc-400" />}
                                                {field.type === 'image' && <ImageIcon size={18} className="text-zinc-400" />}
                                                {field.type === 'rich-text' && <Layout size={18} className="text-zinc-400" />}
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-sm font-bold text-zinc-300 block mb-1">{field.label}</label>
                                                <p className="text-xs text-zinc-500 uppercase tracking-tighter">{field.id}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            {field.type === 'image' ? (
                                                <div className="flex gap-6 items-center">
                                                    <img
                                                        src={data && idToValue(data, field.id)}
                                                        className="w-32 h-32 rounded-2xl object-cover border border-white/5"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data ? idToValue(data, field.id) : ''}
                                                        onChange={(e) => handleUpdate(field.id, e.target.value)}
                                                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                                                        placeholder="URL de la imagen..."
                                                    />
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={data ? idToValue(data, field.id) : ''}
                                                    onChange={(e) => handleUpdate(field.id, e.target.value)}
                                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-lg font-medium focus:outline-none focus:border-primary transition-colors"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            </main>
        </div>
    );
}

function idToValue(data: any, id: string) {
    const keys = id.split('.');
    let val = data;
    for (const key of keys) {
        val = val?.[key];
    }
    return val;
}
