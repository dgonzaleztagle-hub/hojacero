import React, { useState } from 'react';
import { Plus, GripVertical, Trash2, Settings2, Sparkles, Eye, Box } from 'lucide-react';

interface Attribute {
    id: string;
    label: string;
    type: 'text' | 'select' | 'color' | 'number';
    options?: string[];
}

interface AttributeConstructorProps {
    attributes: Attribute[];
    setAttributes: React.Dispatch<React.SetStateAction<Attribute[]>>;
}

export const AttributeConstructor: React.FC<AttributeConstructorProps> = ({ attributes, setAttributes }) => {

    const addAttribute = () => {
        const newAttr: Attribute = {
            id: Math.random().toString(),
            label: 'Nuevo Atributo',
            type: 'text'
        };
        setAttributes([...attributes, newAttr]);
    };

    const removeAttribute = (id: string) => {
        setAttributes(attributes.filter(a => a.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Panel Izquierdo: El Constructor (El Molde) */}
            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-light text-white tracking-tight flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                            Definir Categoría
                        </h3>
                        <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest leading-relaxed">
                            Crea el "Molde" que heredarán <br /> todos los productos de esta sección.
                        </p>
                    </div>
                    <button
                        onClick={addAttribute}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-violet-400 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Añadir Campo
                    </button>
                </div>

                <div className="space-y-4">
                    {attributes.map((attr) => (
                        <div
                            key={attr.id}
                            className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-white/20 transition-all"
                        >
                            <GripVertical className="w-5 h-5 text-white/20 cursor-grab" />

                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={attr.label}
                                    onChange={(e) => {
                                        const newAttrs = [...attributes];
                                        const index = newAttrs.findIndex(a => a.id === attr.id);
                                        newAttrs[index].label = e.target.value;
                                        setAttributes(newAttrs);
                                    }}
                                    className="bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-white/20"
                                    placeholder="Nombre (ej: Tela)"
                                />
                                <select
                                    value={attr.type}
                                    onChange={(e) => {
                                        const newAttrs = [...attributes];
                                        const index = newAttrs.findIndex(a => a.id === attr.id);
                                        newAttrs[index].type = e.target.value as any;
                                        setAttributes(newAttrs);
                                    }}
                                    className="bg-zinc-900 border border-white/10 text-white text-xs rounded-xl focus:ring-violet-500/50"
                                >
                                    <option value="text">Texto Corto</option>
                                    <option value="number">Número</option>
                                    <option value="select">Lista de opciones</option>
                                    <option value="color">Selector de color</option>
                                </select>
                            </div>

                            <button
                                onClick={() => removeAttribute(attr.id)}
                                className="p-2 text-red-400/20 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Panel Derecho: Previsualización (El Resultado) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-3xl sticky top-32">
                <div className="flex items-center gap-3 mb-8 text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Vista Previa: Ingreso de Producto
                </div>

                <div className="space-y-6">
                    {/* Campos Fijos */}
                    <div className="space-y-2 opacity-30">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Nombre General</label>
                        <div className="h-10 bg-white/5 border border-white/5 rounded-xl block w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 opacity-30">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Precio Base</label>
                            <div className="h-10 bg-white/5 border border-white/5 rounded-xl block w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Stock Inicial</label>
                            <div className="h-10 bg-white/5 border border-white/5 rounded-xl block w-full" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">
                            Atributos Dinámicos de Categoría
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            {attributes.map(attr => (
                                <div key={attr.id} className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-500">
                                    <label className="text-xs text-white/80 ml-1 flex items-center gap-2">
                                        <Box className="w-3 h-3 text-white/30" />
                                        {attr.label || 'Campo sin nombre'}
                                    </label>

                                    {attr.type === 'text' && <input type="text" disabled className="bg-white/10 border border-white/10 rounded-xl w-full h-10 px-4 text-xs text-white/20" placeholder={`Ingresa ${attr.label}...`} />}
                                    {attr.type === 'number' && <input type="number" disabled className="bg-white/10 border border-white/10 rounded-xl w-full h-10 px-4 text-xs text-white/20" placeholder="0" />}
                                    {attr.type === 'select' && (
                                        <div className="space-y-4">
                                            <select disabled className="bg-white/10 border border-white/10 rounded-xl w-full h-10 px-4 text-xs text-white/20">
                                                <option>Selecciona una opción...</option>
                                                {attr.options?.map(opt => <option key={opt}>{opt}</option>)}
                                            </select>
                                            <div className="flex flex-wrap gap-2">
                                                {attr.options?.map((opt, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] text-white/40">
                                                        {opt}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {attr.type === 'color' && <div className="w-10 h-10 rounded-full bg-violet-600/50 border border-white/20 cursor-not-allowed" />}
                                </div>
                            ))}
                            {attributes.length === 0 && (
                                <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl text-white/20 text-xs">
                                    Añade campos en el panel izquierdo para <br /> personalizar el catálogo.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
                    <p className="text-[9px] text-cyan-400 text-center leading-relaxed">
                        <strong>MODO AUDITORÍA:</strong> Lo que definas a la izquierda creará <br />
                        automáticamente estos campos para el cliente final.
                    </p>
                </div>
            </div>
        </div>
    );
};
