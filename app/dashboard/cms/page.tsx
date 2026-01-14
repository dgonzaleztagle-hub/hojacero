'use client';

import { useState } from 'react';
import { Database, Edit2, Lock, Save, Link as LinkIcon, FileText } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

// Mock Data Structure for CMS Content
const MOCK_CMS_DATA = [
    { id: 1, type: 'seo', key: 'Meta Title', value: 'Cafetería X | El Mejor Café de Especialidad en Santiago', status: 'published' },
    { id: 2, type: 'seo', key: 'Meta Desc', value: 'Disfruta de granos seleccionados y ambiente único en el corazón de Providencia.', status: 'published' },
    { id: 3, type: 'content', key: 'Hero Headline', value: 'Despierta tus Sentidos', status: 'draft' },
    { id: 4, type: 'content', key: 'Hero Subtext', value: 'Tostaduría artesanal y pastelería francesa.', status: 'published' },
    { id: 5, type: 'link', key: 'Instagram URL', value: 'https://instagram.com/cafeteriax', status: 'published' },
];

export default function CMSPage() {
    const { userRole, currentClient } = useDashboard();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [data, setData] = useState(MOCK_CMS_DATA);

    const handleEdit = (id: number) => setEditingId(id);
    const handleSave = (id: number, newValue: string) => {
        setData(data.map(item => item.id === id ? { ...item, value: newValue } : item));
        setEditingId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Gestor de Contenidos (CMS)</h1>
                    <p className="text-zinc-500 mt-1">Conectado a: <span className="text-green-500 font-mono">Google Sheets API v4</span></p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border ${userRole === 'ADMIN' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                    {userRole === 'ADMIN' ? (
                        <><Edit2 className="w-3 h-3" /> MODO EDICIÓN ACTIVO</>
                    ) : (
                        <><Lock className="w-3 h-3" /> MODO LECTURA (CLIENTE)</>
                    )}
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 bg-white/5 p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    <div className="col-span-1">Tipo</div>
                    <div className="col-span-3">Campo (Key)</div>
                    <div className="col-span-7">Contenido (Value)</div>
                    <div className="col-span-1 text-right">Acción</div>
                </div>

                <div className="divide-y divide-white/5">
                    {data.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 p-4 items-center hover:bg-white/[0.02] transition-colors">

                            {/* Type Icon */}
                            <div className="col-span-1 flex items-center">
                                {item.type === 'seo' && <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400"><Database className="w-4 h-4" /></div>}
                                {item.type === 'content' && <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400"><FileText className="w-4 h-4" /></div>}
                                {item.type === 'link' && <div className="w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-400"><LinkIcon className="w-4 h-4" /></div>}
                            </div>

                            {/* Key */}
                            <div className="col-span-3 text-sm font-mono text-zinc-400">
                                {item.key}
                            </div>

                            {/* Value (Editable) */}
                            <div className="col-span-7 pr-4">
                                {editingId === item.id ? (
                                    <input
                                        type="text"
                                        defaultValue={item.value}
                                        autoFocus
                                        onBlur={(e) => handleSave(item.id, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave(item.id, e.currentTarget.value)}
                                        className="w-full bg-black border border-cyan-500/50 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                    />
                                ) : (
                                    <p className="text-sm text-white truncate cursor-text" onClick={() => userRole === 'ADMIN' && handleEdit(item.id)}>
                                        {item.value}
                                    </p>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className="col-span-1 flex justify-end">
                                {userRole === 'ADMIN' ? (
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-cyan-400 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <Lock className="w-4 h-4 text-zinc-700" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <p className="text-xs text-zinc-600 font-mono">
                    HojaCero CMS v1.0 • Synced with {currentClient.name} Spreadsheet
                </p>
            </div>
        </div>
    );
}
