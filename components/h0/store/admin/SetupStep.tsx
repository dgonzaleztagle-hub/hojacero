import React from 'react';
import { ArrowRight, Sparkles, Database } from 'lucide-react';

interface SetupStepProps {
    shopName: string;
    setShopName: (name: string) => void;
    categoryCount: number;
    setCategoryCount: (count: number) => void;
    onNext: () => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({
    shopName,
    setShopName,
    categoryCount,
    setCategoryCount,
    onNext
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0b]">
            <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-2xl shadow-blue-500/20 mb-6 font-bold text-white text-2xl">
                        H0
                    </div>
                    <h2 className="text-5xl font-bold tracking-tight text-white mb-2">
                        Arquitectura <span className="text-blue-500">Studio</span>
                    </h2>
                    <p className="text-[#94a3b8] text-xs uppercase tracking-[0.4em] font-bold">
                        Capa de Autoría para E-commerce Chileno
                    </p>
                </div>

                <div className="bg-[#161920] border border-white/5 p-16 rounded-[2.5rem] shadow-2xl space-y-10">
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Nombre Oficial del Proyecto</label>
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="Ej: Obsidian E-commerce Lab"
                                className="w-full bg-[#0f1115] border border-white/10 rounded-2xl h-16 px-8 text-2xl text-white focus:border-blue-500 focus:ring-0 transition-all placeholder:text-white/5 font-semibold tracking-tight"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Escala Estructural (Secciones)</label>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={categoryCount}
                                    onChange={(e) => setCategoryCount(parseInt(e.target.value) || 1)}
                                    className="w-32 bg-[#0f1115] border border-white/10 rounded-2xl h-16 px-8 text-2xl text-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-center"
                                />
                                <div className="flex-1 bg-[#12141c] border border-white/5 rounded-2xl flex items-center px-6 gap-3">
                                    <Database className="w-5 h-5 text-blue-500/40" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Categorías Registradas</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-[#475569] font-medium leading-relaxed">La grilla dinámica se inicializará basada en esta escala. Sugerido: Máx 20.</p>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={!shopName || categoryCount < 1}
                                onClick={onNext}
                                className="w-full h-18 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-20 shadow-xl shadow-blue-900/40 group"
                            >
                                Inicializar Workspace
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex items-center gap-3 justify-center text-[11px] text-[#475569] font-bold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-blue-500/50" />
                    <span>Modo Prototipado Industrial</span>
                </div>
            </div>
        </div>
    );
};
