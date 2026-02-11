import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, UploadCloud, X, CheckCircle2 } from 'lucide-react';

interface Attribute {
    id: string;
    label: string;
    type: 'text' | 'select' | 'color' | 'number';
}

interface ProductStepProps {
    categoryName: string;
    attributes: Attribute[];
    onFinish: (product: any) => void;
    onBack: () => void;
}

export const ProductStep: React.FC<ProductStepProps> = ({
    categoryName,
    attributes,
    onFinish
}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dynamicAttrs, setDynamicAttrs] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            // Simulación de carga al "Contenedor Base" (Bucket Supabase)
            const reader = new FileReader();
            reader.onloadend = () => {
                setTimeout(() => {
                    setImage(reader.result as string);
                    setIsUploading(false);
                }, 800);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFinish = () => {
        onFinish({
            id: Math.random().toString(),
            name,
            description: `Entrada Profesional - ${categoryName}`,
            price: parseInt(price) || 0,
            images: [image || 'https://via.placeholder.com/400'],
            attributes: dynamicAttrs
        });
        setName('');
        setPrice('');
        setImage(null);
        setDynamicAttrs({});
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="bg-[#161920] border border-white/5 rounded-2xl p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Nombre del Producto</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Obsidian IX Chrono..."
                            className="w-full bg-[#0f1115] border border-white/10 rounded-xl h-14 px-6 text-sm text-white focus:border-emerald-500/50 focus:ring-0 transition-all placeholder:text-white/10 font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Precio Base ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-[#0f1115] border border-white/10 rounded-xl h-14 px-6 text-sm text-white focus:border-emerald-500/50 transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">Contenedor de Imagen</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative group h-14 border border-dashed rounded-xl flex items-center px-4 cursor-pointer transition-all ${image
                                        ? 'bg-emerald-500/5 border-emerald-500/30'
                                        : 'bg-[#0f1115] border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />

                                {isUploading ? (
                                    <div className="flex items-center gap-3 text-emerald-400 animate-pulse">
                                        <UploadCloud className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Inyectando...</span>
                                    </div>
                                ) : image ? (
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md overflow-hidden border border-white/10">
                                                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> En Contenedor
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setImage(null); }}
                                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/20 hover:text-red-400 transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-white/20 group-hover:text-emerald-400 transition-colors">
                                        <UploadCloud className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Cargar Media local</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Campos Dinámicos de ADN */}
                    {attributes.length > 0 && (
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <label className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8] italic">Especificaciones de ADN ({categoryName})</label>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {attributes.map(attr => (
                                    <div key={attr.id} className="space-y-2">
                                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">{attr.label}</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setDynamicAttrs({ ...dynamicAttrs, [attr.label]: e.target.value })}
                                            placeholder={attr.label}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs text-white focus:border-emerald-500/50 transition-all tracking-tight"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        disabled={!name || !price || !image || isUploading}
                        onClick={handleFinish}
                        className="w-full h-16 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all group disabled:opacity-20 shadow-xl shadow-white/5"
                    >
                        Inyectar a Tienda <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
