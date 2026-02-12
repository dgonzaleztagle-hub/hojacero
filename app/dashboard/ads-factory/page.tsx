
'use client';

import { useState, useEffect } from 'react';
import { Plus, Megaphone, ArrowUpRight, Copy, Trash2, Edit3, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/app/dashboard/DashboardContext';

export default function AdsFactoryPage() {
    const [landings, setLandings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    // Mock data for now
    useEffect(() => {
        setTimeout(() => {
            setLandings([
                { id: '1', slug: 'promo-verano', title: 'Campaña Verano 2026', visits: 1240, conv: 4.2, status: 'active' },
                { id: '2', slug: 'cyber-monday', title: 'Cyber Monday Blitz', visits: 850, conv: 3.1, status: 'active' },
            ]);
            setIsLoading(false);
        }, 800);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                            <Megaphone className="w-5 h-5 text-cyan-500" />
                        </div>
                        <h1 className={`text-3xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-gray-900'}`}>Ads Factory</h1>
                    </div>
                    <p className={`font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Crea máquinas de conversión para tus campañas de pauta.</p>
                </div>

                <Link href="/dashboard/ads-factory/new" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-12 px-8 rounded-xl flex items-center gap-2 transition-all">
                    <Plus className="w-5 h-5" />
                    Nueva Campaña
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-64 rounded-3xl animate-pulse border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {landings.map(lp => (
                        <div key={lp.id} className={`group relative border rounded-[32px] p-8 transition-all ${isDark ? 'bg-zinc-900 border-white/10 hover:border-cyan-500/50' : 'bg-white border-gray-100 hover:border-cyan-500/50 shadow-sm'
                            }`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20' : 'bg-gray-50 border-gray-100 group-hover:bg-cyan-50'
                                    }`}>
                                    <Rocket className={`w-6 h-6 transition-all ${isDark ? 'text-gray-500 group-hover:text-cyan-400' : 'text-gray-400 group-hover:text-cyan-500'}`} />
                                </div>
                                <div className="flex gap-2">
                                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} title="Copiar URL">
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`} title="Eliminar">
                                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{lp.title}</h3>
                            <Link href={`/lp/${lp.slug}`} target="_blank" className="text-xs font-mono text-cyan-500 mb-6 group-hover:underline cursor-pointer">
                                /{lp.slug}
                            </Link>

                            <div className={`grid grid-cols-2 gap-4 pb-6 border-b mb-6 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                <div>
                                    <span className={`block text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Visitas</span>
                                    <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{lp.visits.toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className={`block text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Conv.</span>
                                    <span className="text-xl font-black text-green-500">{lp.conv}%</span>
                                </div>
                            </div>

                            <Link href={`/dashboard/ads-factory/edit/${lp.id}`} className={`w-full h-12 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isDark ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}>
                                <Edit3 className="w-4 h-4" />
                                Editar Landing
                            </Link>

                            <a href={`/lp/${lp.slug}`} target="_blank" className="absolute top-8 right-16 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
