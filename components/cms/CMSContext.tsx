'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CMSState, CMSContent, CMSConfig } from '@/types/cms';
import { toast } from 'sonner';

/**
 * HOJACERO CMS - CONTEXT
 * Gestiona el estado de edición y la sincronización de datos.
 */

interface CMSContextType extends CMSState {
    toggleEdit: () => void;
    updateContent: (id: string, value: any) => void;
    saveChanges: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({
    children,
    initialData = {},
    config = null
}: {
    children: React.ReactNode;
    initialData?: CMSContent;
    config?: CMSConfig | null;
}) {
    const [state, setState] = useState<CMSState>({
        isEditing: false,
        data: initialData,
        config,
        isLoading: false,
    });

    // Habilitar modo edición vía tecla secreta o URL (Rigor H0)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                toggleEdit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleEdit = () => {
        setState(prev => ({ ...prev, isEditing: !prev.isEditing }));
        toast(state.isEditing ? 'Modo edición desactivado' : 'Modo edición activado');
    };

    const updateContent = (id: string, value: any) => {
        setState(prev => ({
            ...prev,
            data: { ...prev.data, [id]: value }
        }));
    };

    const saveChanges = async () => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const response = await fetch('/api/cms/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: state.data }),
            });

            if (!response.ok) throw new Error('Error al guardar');

            toast.success('Cambios publicados con éxito (Vercel reconstruyendo)');
        } catch (error) {
            toast.error('Error al sincronizar con GitHub');
            console.error(error);
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <CMSContext.Provider value={{ ...state, toggleEdit, updateContent, saveChanges }}>
            {children}
        </CMSContext.Provider>
    );
}

export function useCMS() {
    const context = useContext(CMSContext);
    if (!context) throw new Error('useCMS debe usarse dentro de un CMSProvider');
    return context;
}
