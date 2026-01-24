import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Instagram, Facebook, Globe, Zap, Copy, ExternalLink, Save, Loader2 } from 'lucide-react';

interface ContactCardProps {
    selectedLead: any;
    ld: any;
    isDark: boolean;
    isEditingContact: boolean;
    setIsEditingContact: (val: boolean) => void;
    editData: { nombre_contacto: string; email: string; whatsapp: string; telefono: string; demo_url: string };
    setEditData: (val: any) => void;
    onSaveContact: () => Promise<void> | void;
    isSaving: boolean;
    copyToClipboard: (text: string, field: string) => void;
}

export const ContactCard = ({
    selectedLead,
    ld,
    isDark,
    isEditingContact,
    setIsEditingContact,
    editData,
    setEditData,
    onSaveContact,
    isSaving,
    copyToClipboard
}: ContactCardProps) => {
    const [isEditingUrl, setIsEditingUrl] = useState(false);

    return (
        <div className={`rounded-3xl p-6 border relative group/contact transition-colors ${isDark ? 'bg-zinc-900/50 backdrop-blur-xl border-white/5' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex justify-between items-center mb-5">
                <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Canales de Contacto</h4>
                {!isEditingContact && (
                    <button
                        onClick={() => {
                            setEditData({
                                nombre_contacto: selectedLead.nombre_contacto || '',
                                email: ld.email || '',
                                whatsapp: ld.whatsapp || '',
                                telefono: ld.phone || '',
                                demo_url: ld.demo_url || ''
                            });
                            setIsEditingContact(true);
                        }}
                        className={`text-[10px] font-bold transition-colors uppercase px-3 py-1.5 rounded-lg border ${isDark ? 'border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}
                    >
                        Editar Datos
                    </button>
                )}
            </div>

            {isEditingContact ? (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                        <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Nombre Contacto</label>
                        <input
                            value={editData.nombre_contacto}
                            onChange={(e) => setEditData({ ...editData, nombre_contacto: e.target.value })}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
                            placeholder="Juan Pérez"
                        />
                    </div>
                    <div>
                        <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Email</label>
                        <input
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-cyan-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
                            placeholder="correo@empresa.com"
                        />
                    </div>
                    <div>
                        <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>WhatsApp</label>
                        <input
                            value={editData.whatsapp}
                            onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-green-500' : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'}`}
                            placeholder="569..."
                        />
                    </div>
                    <div>
                        <label className={`text-[10px] font-bold uppercase ml-1 block mb-1.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Teléfono</label>
                        <input
                            value={editData.telefono}
                            onChange={(e) => setEditData({ ...editData, telefono: e.target.value })}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-zinc-500' : 'bg-white border-gray-300 text-gray-900 focus:border-gray-500'}`}
                            placeholder="+56 9 ..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            disabled={isSaving}
                            onClick={onSaveContact}
                            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button onClick={() => setIsEditingContact(false)} className="px-5 bg-white/5 hover:bg-white/10 text-zinc-500 text-xs font-medium rounded-xl border border-white/10">
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Demo URL */}
                    <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${isEditingUrl ? (isDark ? 'bg-purple-900/10 border-purple-500/30 ring-1 ring-purple-500/30' : 'bg-purple-50 border-purple-400 ring-1 ring-purple-200') : (isDark ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200')}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                <Zap className="w-3 h-3" /> Landing de Prospecto
                            </span>
                            {!isEditingUrl && !isEditingContact && (
                                <button
                                    onClick={() => {
                                        setEditData({
                                            email: ld.email || '',
                                            whatsapp: ld.whatsapp || '',
                                            telefono: ld.phone || '',
                                            demo_url: ld.demo_url || ''
                                        });
                                        setIsEditingUrl(true);
                                    }}
                                    className={`text-[9px] font-bold uppercase px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors`}
                                >
                                    Editar URL
                                </button>
                            )}
                        </div>

                        {isEditingUrl ? (
                            <div className="animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex gap-2">
                                    <input
                                        value={editData.demo_url}
                                        onChange={(e) => setEditData({ ...editData, demo_url: e.target.value })}
                                        className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none transition-colors font-mono ${isDark ? 'bg-black/50 border-white/10 text-white focus:border-purple-500' : 'bg-white border-purple-300 text-purple-900 focus:border-purple-500'}`}
                                        placeholder="https://hojacero.com/prospectos/ejemplo"
                                        autoFocus
                                    />
                                    <button
                                        disabled={isSaving}
                                        onClick={async () => {
                                            await onSaveContact();
                                            setIsEditingUrl(false);
                                        }}
                                        className="px-3 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => setIsEditingUrl(false)}
                                        className={`px-3 py-2 rounded-xl border transition-colors ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500'}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className={`text-[10px] mt-2 italic ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                    Ingresa la URL completa donde está alojada la landing.
                                </p>
                            </div>
                        ) : (
                            selectedLead.demo_url ? (
                                <div className="flex items-center gap-2">
                                    <div className={`flex-1 p-2 rounded-lg text-xs font-mono truncate border ${isDark ? 'bg-black/30 border-purple-500/30 text-purple-200' : 'bg-white border-purple-200 text-purple-700'}`}>
                                        {selectedLead.demo_url}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(selectedLead.demo_url, 'demo_url')}
                                        className={`p-2 rounded-lg transition-colors border ${isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <a
                                        href={selectedLead.demo_url}
                                        target="_blank"
                                        className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition-colors shadow-lg shadow-purple-500/20 border border-purple-400"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            ) : (
                                <div className={`text-xs italic text-center py-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    Sin URL de prospecto asignada
                                </div>
                            )
                        )}
                    </div>

                    {/* Nombre Contacto */}
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg shrink-0 ${selectedLead.nombre_contacto ? (isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-500') : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}>
                                <Zap className="w-4 h-4" />
                            </div>
                            <span className={`text-sm font-bold truncate select-all ${selectedLead.nombre_contacto ? (isDark ? 'text-zinc-200' : 'text-gray-900') : (isDark ? 'text-zinc-600 italic' : 'text-gray-400 italic')}`}>
                                {selectedLead.nombre_contacto || 'Sin nombre asignado'}
                            </span>
                        </div>
                    </div>

                    {/* Email */}
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg shrink-0 ${selectedLead.email ? (isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-500') : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}>
                                <Mail className="w-4 h-4" />
                            </div>
                            <span className={`text-sm truncate select-all ${selectedLead.email ? (isDark ? 'text-zinc-200' : 'text-gray-900') : (isDark ? 'text-zinc-600 italic' : 'text-gray-400 italic')}`}>
                                {selectedLead.email || 'Sin email'}
                            </span>
                        </div>
                        {selectedLead.email && (
                            <button onClick={() => copyToClipboard(selectedLead.email, 'email')} className={`p-2 ml-2 rounded-lg shrink-0 transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                                <Copy className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* WhatsApp */}
                    <div className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`p-2 rounded-lg shrink-0 ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? 'bg-green-500/10 text-green-500' : (isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}>
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className={`text-sm truncate select-all ${selectedLead.whatsapp || selectedLead.source_data?.whatsapp ? (isDark ? 'text-zinc-200' : 'text-gray-900') : (isDark ? 'text-zinc-600 italic' : 'text-gray-400 italic')}`}>
                                {selectedLead.whatsapp || selectedLead.source_data?.whatsapp || 'Sin WhatsApp'}
                            </span>
                        </div>
                        {(selectedLead.whatsapp || selectedLead.source_data?.whatsapp) && (
                            <button onClick={() => copyToClipboard(selectedLead.whatsapp || selectedLead.source_data?.whatsapp, 'wa')} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}>
                                <Copy className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Social & Meta */}
                    <div className="grid grid-cols-4 gap-3 pt-2">
                        {[
                            { icon: Phone, color: 'zinc', active: !!(selectedLead.telefono || selectedLead.source_data?.phone), link: `tel:${selectedLead.telefono || selectedLead.source_data?.phone}` },
                            { icon: Instagram, color: 'pink', active: !!ld.instagram, link: ld.instagram?.startsWith('http') ? ld.instagram : `https://instagram.com/${ld.instagram}` },
                            { icon: Facebook, color: 'blue', active: !!ld.facebook, link: ld.facebook?.startsWith('http') ? ld.facebook : `https://facebook.com/${ld.facebook}` },
                            { icon: Globe, color: 'cyan', active: !!ld.website, link: ld.website }
                        ].map((item, idx) => (
                            <div key={idx} className={`relative flex items-center justify-center p-3 rounded-xl border transition-all ${item.active ? `bg-${item.color}-500/10 border-${item.color}-500/20 text-${item.color}-400 hover:bg-${item.color}-500/20 cursor-pointer` : 'bg-zinc-900/50 border-white/5 text-zinc-800'}`}>
                                <item.icon className="w-5 h-5" />
                                {item.active && <a href={item.link} target="_blank" className="absolute inset-0"></a>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
