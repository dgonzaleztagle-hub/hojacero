
import React, { useState } from 'react';
import { X, Save, Loader2, Building, Globe, Phone, User } from 'lucide-react';
import { useRadar } from '@/hooks/useRadar';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (lead: any) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSuccess }: ManualEntryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        sitio_web: '',
        telefono: '',
        nombre_contacto: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/radar/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                if (onSuccess) onSuccess(data.lead);
                onClose();
                // Reset form
                setFormData({ nombre: '', sitio_web: '', telefono: '', nombre_contacto: '' });
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
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-cyan-400" />
                        Ingreso Manual
                    </h3>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                placeholder="Ej. Restaurante El Paso"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
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
                                    placeholder="Ej. Pedro González"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
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
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-all"
                        >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Crear Lead
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
