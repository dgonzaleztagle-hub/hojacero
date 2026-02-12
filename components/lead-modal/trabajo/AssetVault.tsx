
import React, { useState, useRef } from 'react';
import { Upload, File, Link as LinkIcon, Trash2, Loader2, Plus, Image as ImageIcon, FileText } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface AssetVaultProps {
    leadId: string;
    isDark: boolean;
    initialAssets?: any[];
}

export function AssetVault({ leadId, isDark, initialAssets = [] }: AssetVaultProps) {
    const [assets, setAssets] = useState<any[]>(initialAssets);
    const [uploading, setUploading] = useState(false);
    const [showAddLink, setShowAddLink] = useState(false);
    const [newLink, setNewLink] = useState({ label: '', url: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${leadId}-${Date.now()}.${fileExt}`;
            const filePath = `leads/${leadId}/assets/${fileName}`;

            const { data, error } = await supabase.storage
                .from('lead-assets')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('lead-assets')
                .getPublicUrl(filePath);

            const newAsset = {
                id: Date.now().toString(),
                type: 'file',
                label: file.name,
                url: publicUrl,
                mimeType: file.type,
                created_at: new Date().toISOString()
            };

            const updatedAssets = [...assets, newAsset];
            await saveAssets(updatedAssets);
            setAssets(updatedAssets);
            toast.success('Archivo subido correctamente');
        } catch (err) {
            console.error(err);
            toast.error('Error al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleAddLink = async () => {
        if (!newLink.label || !newLink.url) return;
        const newAsset = {
            id: Date.now().toString(),
            type: 'link',
            label: newLink.label,
            url: newLink.url,
            created_at: new Date().toISOString()
        };
        const updatedAssets = [...assets, newAsset];
        await saveAssets(updatedAssets);
        setAssets(updatedAssets);
        setNewLink({ label: '', url: '' });
        setShowAddLink(false);
        toast.success('Link agregado');
    };

    const saveAssets = async (newAssets: any[]) => {
        // We store assets in the source_data of the lead for simplicity or a separate table if preferred
        // For now, let's use the leads table and update the source_data path 'assets'
        const { data: lead } = await supabase.from('leads').select('source_data').eq('id', leadId).single();
        const updatedSourceData = {
            ...(lead?.source_data || {}),
            assets: newAssets
        };
        await supabase.from('leads').update({ source_data: updatedSourceData }).eq('id', leadId);
    };

    const deleteAsset = async (id: string) => {
        const updatedAssets = assets.filter(a => a.id !== id);
        await saveAssets(updatedAssets);
        setAssets(updatedAssets);
        toast.info('Asset eliminado');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>Bóveda de Activos</h4>
                    <p className="text-[10px] text-zinc-500">Logos, manuales, accesos y documentos del cliente</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddLink(!showAddLink)}
                        className={`p-2 rounded-lg border transition-all ${isDark ? 'border-white/10 hover:bg-white/5 text-zinc-400' : 'border-gray-200 hover:bg-gray-50 text-gray-500'}`}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-bold uppercase rounded-lg flex items-center gap-2 transition-all"
                    >
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Subir Asset
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                </div>
            </div>

            {showAddLink && (
                <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                            type="text"
                            placeholder="Etiqueta (ej: Drive de logos)"
                            value={newLink.label}
                            onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                            className={`px-3 py-2 rounded-lg text-xs outline-none border transition-all ${isDark ? 'bg-zinc-900 border-white/5 text-white focus:border-cyan-500/50' : 'bg-white border-gray-200 focus:border-cyan-500/50'}`}
                        />
                        <input
                            type="url"
                            placeholder="https://..."
                            value={newLink.url}
                            onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                            className={`px-3 py-2 rounded-lg text-xs outline-none border transition-all ${isDark ? 'bg-zinc-900 border-white/5 text-white focus:border-cyan-500/50' : 'bg-white border-gray-200 focus:border-cyan-500/50'}`}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAddLink(false)} className="px-3 py-1.5 text-[10px] text-zinc-500 uppercase font-bold">Cancelar</button>
                        <button onClick={handleAddLink} className="px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase rounded-lg">Guardar Link</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assets.length === 0 && !uploading && (
                    <div className={`col-span-full py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 ${isDark ? 'border-white/5 text-zinc-700' : 'border-gray-100 text-gray-300'}`}>
                        <File className="w-8 h-8" />
                        <span className="text-xs font-medium uppercase tracking-widest">Sin activos registrados</span>
                    </div>
                )}

                {assets.map((asset) => (
                    <div
                        key={asset.id}
                        className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-900/50 border-white/5 hover:border-white/10' : 'bg-white border-gray-100 hover:shadow-sm'}`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                                {asset.type === 'link' ? <LinkIcon className="w-4 h-4 text-cyan-500" /> :
                                    asset.mimeType?.includes('image') ? <ImageIcon className="w-4 h-4 text-purple-500" /> :
                                        <FileText className="w-4 h-4 text-zinc-400" />}
                            </div>
                            <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{asset.label}</p>
                                <a
                                    href={asset.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-cyan-500 hover:underline truncate block"
                                >
                                    {asset.type === 'link' ? asset.url : 'Ver Archivo'}
                                </a>
                            </div>
                        </div>
                        <button
                            onClick={() => deleteAsset(asset.id)}
                            className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {uploading && (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/5 animate-pulse`}>
                        <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                        <span className="text-xs text-cyan-500 font-bold uppercase">Subiendo activo...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
