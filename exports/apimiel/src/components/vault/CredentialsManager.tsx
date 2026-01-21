'use client';

import { Cliente, CredentialGroup, CredentialField } from './types';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Lock, Eye, EyeOff, Copy, Plus, Trash2, Save, ChevronDown, ChevronRight, Key, Server, Database, Globe, X } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface CredentialsManagerProps {
    cliente: Cliente;
}

export default function CredentialsManager({ cliente }: CredentialsManagerProps) {
    const parseCredentials = (): CredentialGroup[] => {
        if (Array.isArray(cliente.credentials)) {
            return cliente.credentials as CredentialGroup[];
        }
        return [];
    };

    const [groups, setGroups] = useState<CredentialGroup[]>(parseCredentials());
    const [isSaving, setIsSaving] = useState(false);

    // State Lifting for UX Flow (Auto-Open/Edit)
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Group State
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [newGroupTitle, setNewGroupTitle] = useState('');

    const supabase = createClient();

    const handleAddGroup = () => {
        if (!newGroupTitle.trim()) return;

        const newId = uuidv4();
        const newGroup: CredentialGroup = {
            id: newId,
            name: newGroupTitle,
            fields: [
                { id: uuidv4(), label: '', value: '', isSecret: false } // Start with 1 default field
            ]
        };

        const updatedGroups = [...groups, newGroup];
        setGroups(updatedGroups);

        // UX Magic: Auto-Open and Auto-Edit immediately
        setExpandedId(newId);
        setEditingId(newId);

        setNewGroupTitle('');
        setIsAddingGroup(false);
    };

    const handleDeleteGroup = (groupId: string) => {
        if (!confirm('¿Borrar este grupo de credenciales?')) return;
        const updatedGroups = groups.filter(g => g.id !== groupId);
        setGroups(updatedGroups);
        if (expandedId === groupId) setExpandedId(null);
        if (editingId === groupId) setEditingId(null);
        saveToDb(updatedGroups);
    };

    const updateField = (groupId: string, fieldId: string, updates: Partial<CredentialField>) => {
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    fields: g.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
                };
            }
            return g;
        });
        setGroups(updatedGroups);
    };

    // Helper to add a new empty field
    const handleAddField = (groupId: string) => {
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    fields: [...g.fields, { id: uuidv4(), label: '', value: '', isSecret: false }]
                };
            }
            return g;
        });
        setGroups(updatedGroups);
    };

    // Helper to remove a field
    const handleRemoveField = (groupId: string, fieldId: string) => {
        const updatedGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    fields: g.fields.filter(f => f.id !== fieldId)
                };
            }
            return g;
        });
        setGroups(updatedGroups);
    };

    const saveToDb = async (dataToSave: CredentialGroup[]) => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('monitored_sites')
                .update({ credentials: dataToSave })
                .eq('id', cliente.id);

            if (error) throw error;
            toast.success('Credenciales guardadas');
        } catch (error) {
            console.error('Error saving credentials:', error);
            toast.error('Error al guardar credenciales');
        } finally {
            setIsSaving(false);
        }
    };

    const getIconForTitle = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('ftp') || t.includes('ssh') || t.includes('server')) return <Server className="w-4 h-4 text-purple-400" />;
        if (t.includes('db') || t.includes('base') || t.includes('sql')) return <Database className="w-4 h-4 text-blue-400" />;
        if (t.includes('web') || t.includes('cms') || t.includes('admin')) return <Globe className="w-4 h-4 text-cyan-400" />;
        return <Key className="w-4 h-4 text-zinc-400" />;
    };

    const [status, setStatus] = useState(cliente.status || (cliente.is_active ? 'active' : 'suspended'));

    const toggleStatus = async () => {
        const newStatus = status === 'active' ? 'suspended' : 'active';
        // Optimistic update
        setStatus(newStatus);

        try {
            const { error } = await supabase
                .from('monitored_sites')
                .update({ status: newStatus })
                .eq('id', cliente.id);

            if (error) throw error;
            toast.success(`Sitio ${newStatus === 'active' ? 'ACTIVADO' : 'SUSPENDIDO'}`);
        } catch (error) {
            console.error('Error toggling status:', error);
            setStatus(status); // Revert
            toast.error('Error al cambiar estado');
        }
    };

    return (
        <div className="space-y-4">
            {/* STATUS KILLSWITCH */}
            <div className={`flex items-center justify-between p-4 rounded-xl border mb-4 transition-colors ${status === 'active'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${status === 'active' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                        <Key className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className={`font-bold text-sm ${status === 'active' ? 'text-green-400' : 'text-red-500'}`}>
                            {status === 'active' ? 'Sitio Activo' : 'Sitio Suspendido'}
                        </h4>
                        <p className="text-xs text-zinc-500">
                            {status === 'active' ? 'El servicio está operando normalmente.' : 'ACCESO BLOQUEADO (Killswitch)'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleStatus}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${status === 'active'
                            ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500 hover:text-white'
                            : 'bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500 hover:text-black'
                        }`}
                >
                    {status === 'active' ? 'SUSPENDER' : 'ACTIVAR'}
                </button>
            </div>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold flex items-center gap-2 text-zinc-100 text-sm">
                    <Lock className="w-4 h-4 text-blue-400" />
                    Credenciales
                </h3>
                {!isAddingGroup && (
                    <button
                        onClick={() => setIsAddingGroup(true)}
                        className="text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300 flex items-center gap-1 transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Agregar
                    </button>
                )}
            </div>

            {/* ADD GROUP FORM */}
            {isAddingGroup && (
                <div className="p-3 bg-zinc-900/80 border border-blue-500/30 rounded-lg animate-in fade-in slide-in-from-top-2 mb-4">
                    <label className="text-[10px] uppercase font-bold text-blue-400 mb-1 block">Título del Acceso</label>
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            value={newGroupTitle}
                            onChange={(e) => setNewGroupTitle(e.target.value)}
                            placeholder="Ej: Hosting DonWeb..."
                            className="flex-1 bg-black/50 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                        />
                        <button
                            onClick={handleAddGroup}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded shrink-0"
                        >
                            Crear y Editar
                        </button>
                        <button
                            onClick={() => setIsAddingGroup(false)}
                            className="text-zinc-500 hover:text-zinc-300 px-2 shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* CREDENTIALS LIST */}
            {groups.length === 0 && !isAddingGroup && (
                <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-xs">No hay credenciales guardadas.</p>
                </div>
            )}

            <div className="space-y-3">
                {groups.map((group) => {
                    const isOpen = expandedId === group.id;
                    const isEditingCallback = editingId === group.id;

                    return (
                        <div key={group.id} className={`border rounded-xl transition-all ${isOpen ? 'bg-zinc-900/80 border-zinc-700 shadow-xl' : 'bg-zinc-900/30 border-white/5 hover:border-white/10'}`}>
                            {/* Card Header */}
                            <div
                                className="flex items-center justify-between p-3 cursor-pointer select-none"
                                onClick={() => setExpandedId(isOpen ? null : group.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg bg-zinc-800 ${isOpen ? 'text-white' : 'text-zinc-500'}`}>
                                        {getIconForTitle(group.name)}
                                    </div>
                                    <span className={`text-sm font-medium ${isOpen ? 'text-white' : 'text-zinc-400'}`}>
                                        {group.name}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded-full text-zinc-500">
                                        {group.fields.length} datos
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isOpen && (
                                <div className="p-3 pt-0 border-t border-dashed border-zinc-800/50 mt-1 animate-in slide-in-from-top-2">
                                    {/* Edit Toggle (Only show if not already editing) */}
                                    {!isEditingCallback && (
                                        <div className="flex justify-end gap-2 py-2 mb-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingId(group.id); }}
                                                className="text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider transition-colors text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-800"
                                            >
                                                Editar Campos
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-2 mt-2">
                                        {group.fields.map((field) => (
                                            <div key={field.id} className="flex items-center gap-2 group/field">
                                                {/* Label */}
                                                {isEditingCallback ? (
                                                    <input
                                                        value={field.label}
                                                        onChange={(e) => updateField(group.id, field.id, { label: e.target.value })}
                                                        className="w-1/3 bg-black/30 text-xs text-zinc-400 px-2 py-1.5 rounded border border-zinc-800 focus:border-indigo-500 outline-none"
                                                        placeholder="Etiqueta"
                                                    />
                                                ) : (
                                                    <div className="w-1/3 text-xs text-zinc-500 font-medium truncate py-1.5 px-2" title={field.label}>
                                                        {field.label || 'Sin etiqueta'}
                                                    </div>
                                                )}

                                                {/* Value */}
                                                <div className="flex-1 relative">
                                                    {isEditingCallback ? (
                                                        <div className="flex gap-1">
                                                            <input
                                                                value={field.value}
                                                                onChange={(e) => updateField(group.id, field.id, { value: e.target.value })}
                                                                className="flex-1 bg-black/30 text-xs text-zinc-200 px-2 py-1.5 rounded border border-zinc-800 focus:border-indigo-500 outline-none font-mono"
                                                                placeholder="Valor"
                                                                type={field.isSecret ? "password" : "text"}
                                                            />
                                                            <button
                                                                onClick={() => updateField(group.id, field.id, { isSecret: !field.isSecret })}
                                                                className={`p-1.5 rounded ${field.isSecret ? 'text-amber-500 bg-amber-500/10' : 'text-zinc-600 bg-zinc-800'} hover:bg-zinc-700`}
                                                                title="Alternar Secreto"
                                                            >
                                                                {field.isSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between bg-zinc-950/50 rounded px-3 py-1.5 border border-zinc-800/50 group-hover/field:border-zinc-700 transition-colors">
                                                            <span className={`text-xs font-mono truncate ${field.isSecret ? 'text-zinc-600 tracking-widest' : 'text-zinc-300'}`}>
                                                                {field.isSecret ? '••••••••••••' : (field.value || 'Vacío')}
                                                            </span>
                                                            <div className="flex gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity">
                                                                {field.isSecret && (
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(field.value);
                                                                            toast.success('Copiado');
                                                                        }}
                                                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white"
                                                                        title="Copiar (Secreto)"
                                                                    >
                                                                        <Copy className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                                {!field.isSecret && (
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(field.value);
                                                                            toast.success('Copiado');
                                                                        }}
                                                                        className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white"
                                                                        title="Copiar"
                                                                    >
                                                                        <Copy className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delete Field Button */}
                                                {isEditingCallback && (
                                                    <button
                                                        onClick={() => handleRemoveField(group.id, field.id)}
                                                        className="p-1.5 text-red-900 hover:text-red-500 bg-red-900/10 hover:bg-red-900/20 rounded transition-colors"
                                                        title="Eliminar campo"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isEditingCallback && (
                                            <button
                                                onClick={() => handleAddField(group.id)}
                                                className="w-full py-1.5 mt-2 text-[10px] text-zinc-500 hover:text-blue-400 border border-dashed border-zinc-800 hover:border-blue-500/30 rounded flex items-center justify-center gap-1 transition-all"
                                            >
                                                <Plus className="w-3 h-3" /> Agregar Campo
                                            </button>
                                        )}
                                    </div>

                                    {/* Actions Footer */}
                                    {isEditingCallback && (
                                        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center animate-in fade-in">
                                            <button
                                                onClick={() => handleDeleteGroup(group.id)}
                                                className="text-[10px] text-red-500 hover:text-red-400 px-2 py-1.5 rounded hover:bg-red-900/20 font-bold uppercase transition-colors"
                                            >
                                                Eliminar Grupo
                                            </button>
                                            <button
                                                onClick={() => {
                                                    saveToDb(groups);
                                                    setEditingId(null);
                                                }}
                                                className="text-[10px] bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded font-bold uppercase flex items-center gap-1 shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <Save className="w-3 h-3" /> Guardar Cambios
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
