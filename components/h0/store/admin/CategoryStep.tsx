import React from 'react';
import { Plus, Trash2, GripVertical, Info } from 'lucide-react';

interface Attribute {
    id: string;
    label: string;
    type: 'text' | 'select' | 'color' | 'number';
}

interface CategoryStepProps {
    categoryName: string;
    setCategoryName: (name: string) => void;
    attributes: Attribute[];
    setAttributes: (attrs: Attribute[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
    categoryName,
    setCategoryName,
    attributes,
    setAttributes
}) => {
    const addAttribute = () => {
        setAttributes([...attributes, {
            id: Math.random().toString(),
            label: 'Nueva Propiedad',
            type: 'text'
        }]);
    };

    const removeAttribute = (id: string) => {
        setAttributes(attributes.filter(a => a.id !== id));
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-[#161920] border border-white/5 rounded-2xl p-8 shadow-sm space-y-8">
                <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Identidad de la Sección</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Ej: Relojería, Muebles, Menú..."
                        className="w-full bg-[#0f1115] border border-white/10 rounded-xl h-14 px-6 text-lg text-white focus:border-blue-500/50 focus:ring-0 transition-all placeholder:text-white/10 font-semibold tracking-tight"
                    />
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Propiedades de ADN</label>
                            <Info className="w-3.5 h-3.5 text-white/10" />
                        </div>
                        <button
                            onClick={addAttribute}
                            className="text-[11px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Añadir Propiedad
                        </button>
                    </div>

                    <div className="space-y-4">
                        {attributes.map((attr) => (
                            <div key={attr.id} className="flex items-center gap-4 bg-[#0f1115] border border-white/5 p-4 rounded-xl group hover:border-white/20 transition-all">
                                <GripVertical className="w-4 h-4 text-white/10 cursor-grab" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest ml-1">Etiqueta</p>
                                    <input
                                        type="text"
                                        value={attr.label}
                                        onChange={(e) => {
                                            const newAttrs = [...attributes];
                                            const idx = newAttrs.findIndex(a => a.id === attr.id);
                                            newAttrs[idx].label = e.target.value;
                                            setAttributes(newAttrs);
                                        }}
                                        className="w-full bg-transparent border-none text-sm text-white focus:ring-0 p-0 font-semibold"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-px bg-white/5" />
                                    <div className="space-y-1">
                                        <p className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Tipo</p>
                                        <select
                                            value={attr.type}
                                            onChange={(e) => {
                                                const newAttrs = [...attributes];
                                                const idx = newAttrs.findIndex(a => a.id === attr.id);
                                                newAttrs[idx].type = e.target.value as any;
                                                setAttributes(newAttrs);
                                            }}
                                            className="bg-transparent border-none text-[11px] text-blue-400 focus:ring-0 p-0 font-bold uppercase tracking-wider cursor-pointer"
                                        >
                                            <option value="text">Texto Libre</option>
                                            <option value="select">Lista de Opciones</option>
                                            <option value="color">Muestra de Color</option>
                                            <option value="number">Valor Numérico</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => removeAttribute(attr.id)}
                                        className="p-2 text-white/10 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {attributes.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/10 mb-6 font-sans">Sin propiedades definidas</p>
                                <button
                                    onClick={addAttribute}
                                    className="px-6 py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-900/10"
                                >
                                    + Inicializar ADN
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
