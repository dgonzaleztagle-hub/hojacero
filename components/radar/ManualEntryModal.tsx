
import React, { useState } from 'react';
import { X, Save, Loader2, Building, Globe, Phone, User, Construction, ShieldCheck, Upload, Palette } from 'lucide-react';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (lead: any) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSuccess }: ManualEntryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [leadType, setLeadType] = useState<'auditory' | 'construction'>('auditory');
    const [formData, setFormData] = useState({
        nombre: '',
        sitio_web: '',
        telefono: '',
        nombre_contacto: '',
        categoria: '',
        // Extra fields for construction
        concept: '',
        references: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [generateLogo, setGenerateLogo] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre) return;

        setIsLoading(true);
        try {
            // Use FormData for file upload
            const submitData = new FormData();
            submitData.append('nombre', formData.nombre);
            submitData.append('sitio_web', formData.sitio_web);
            submitData.append('telefono', formData.telefono);
            submitData.append('nombre_contacto', formData.nombre_contacto);
            submitData.append('categoria', formData.categoria);
            submitData.append('concept', formData.concept);
            submitData.append('references', formData.references);
            submitData.append('lead_type', leadType);
            submitData.append('generate_logo', generateLogo.toString());

            if (logoFile) {
                submitData.append('logo', logoFile);
            }

            const res = await fetch('/api/radar/manual', {
                method: 'POST',
                body: submitData
            });
            const data = await res.json();

            if (data.success) {
                if (onSuccess) onSuccess(data.lead);
                onClose();
                // Reset form
                setFormData({
                    nombre: '',
                    sitio_web: '',
                    telefono: '',
                    nombre_contacto: '',
                    categoria: '',
                    concept: '',
                    references: ''
                });
                setLogoFile(null);
                setGenerateLogo(false);
                setLeadType('auditory');
            } else {
                alert('Error al crear lead: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header with Lead Type Selector */}
                <div className="px-6 py-4 border-b border-white/10 bg-black/40">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Building className="w-4 h-4 text-cyan-400" />
                            Ingreso de Lead
                        </h3>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                        <button
                            onClick={() => setLeadType('auditory')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${leadType === 'auditory' ? 'bg-cyan-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" /> Auditoría (Con Web)
                        </button>
                        <button
                            onClick={() => setLeadType('construction')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${leadType === 'construction' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Construction className="w-3.5 h-3.5" /> Construcción (Lead Caliente)
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Common Fields */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Nombre del Negocio *</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                required
                                autoFocus
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej. Restaurante El Paso o Cam Solution"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    {leadType === 'auditory' ? (
                        <div className="space-y-2 animate-in slide-in-from-left-2 duration-300">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Sitio Web</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <input
                                    type="url"
                                    value={formData.sitio_web}
                                    onChange={e => setFormData({ ...formData, sitio_web: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-2 duration-300 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
                                    <Construction className="w-3 h-3" /> Concepto / Idea del Proyecto
                                </label>
                                <textarea
                                    value={formData.concept}
                                    onChange={e => setFormData({ ...formData, concept: e.target.value })}
                                    placeholder="Ej. Marketplace B2B para insumos industriales sin presencia previa online..."
                                    rows={2}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-amber-500 uppercase">Referentes / Competencia Conocida</label>
                                <input
                                    type="text"
                                    value={formData.references}
                                    onChange={e => setFormData({ ...formData, references: e.target.value })}
                                    placeholder="Ej. Amazon Business, Mercado Libre..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                />
                            </div>

                            {/* NUEVO: Assets Visuales */}
                            <div className="space-y-3 pt-3 border-t border-amber-500/10">
                                <label className="text-xs font-bold text-amber-500 uppercase flex items-center gap-2">
                                    <Palette className="w-3 h-3" /> Assets Visuales
                                </label>

                                {/* Upload Logo */}
                                <div className="space-y-2">
                                    <label className="text-xs text-zinc-400">Logo del Negocio (opcional)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setLogoFile(file);
                                                    setGenerateLogo(false); // Desactivar generación si sube logo
                                                }
                                            }}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="flex items-center justify-center gap-2 w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-zinc-400 hover:border-amber-500/50 hover:text-amber-400 transition-colors cursor-pointer"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {logoFile ? logoFile.name : 'Subir logo'}
                                        </label>
                                    </div>
                                    {logoFile && (
                                        <div className="flex items-center gap-2 text-xs text-green-400">
                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                            Logo cargado - Usaremos sus colores para la paleta
                                        </div>
                                    )}
                                </div>

                                {/* Checkbox: Generar Logo */}
                                {!logoFile && (
                                    <div className="flex items-center gap-2 p-3 bg-black/20 rounded-lg border border-white/5">
                                        <input
                                            type="checkbox"
                                            id="generate-logo"
                                            checked={generateLogo}
                                            onChange={(e) => setGenerateLogo(e.target.checked)}
                                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                                        />
                                        <label htmlFor="generate-logo" className="text-xs text-zinc-300 cursor-pointer">
                                            No tengo logo, generar opciones con IA
                                        </label>
                                    </div>
                                )}

                                <p className="text-[10px] text-zinc-500 italic">
                                    💡 {logoFile ? 'Extraeremos la paleta de colores de tu logo' : generateLogo ? 'Generaremos logo y paleta según tu rubro' : 'Generaremos paleta de colores según tu rubro'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Rubro / Categoría</label>
                        <input
                            type="text"
                            value={formData.categoria}
                            onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                            placeholder="Ej. Gastronomía, Retail, Servicios..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={formData.telefono}
                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                    placeholder="+56 9..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Nombre de Contacto</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                <input
                                    type="text"
                                    value={formData.nombre_contacto}
                                    onChange={e => setFormData({ ...formData, nombre_contacto: e.target.value })}
                                    placeholder="Pedro González"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-zinc-900 pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-zinc-400 hover:text-white text-xs font-bold uppercase transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase shadow-lg flex items-center gap-2 transition-all ${leadType === 'construction'
                                ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-900/20'
                                : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-900/20'
                                }`}
                        >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Crear {leadType === 'construction' ? 'Proyecto' : 'Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
