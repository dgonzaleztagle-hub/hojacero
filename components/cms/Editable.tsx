'use client';

import React, { useState } from 'react';
import { useCMS } from './CMSContext';
import { EditableProps } from '@/types/cms';
import { Pencil, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * HOJACERO CMS - EDITABLE SOCKET
 * El "Conector" inteligente que vuelve dinámico cualquier nodo estático.
 */

export function Editable({
    id,
    children,
    fallback,
    type = 'text',
    label
}: EditableProps) {
    const { data, isEditing, updateContent, isLoading } = useCMS();
    const [isHovered, setIsHovered] = useState(false);

    const content = data[id] || fallback;

    // Renderizado en modo normal
    if (!isEditing) {
        return <>{children(content)}</>;
    }

    // Renderizado en modo edición (Rigor H0 Aesthetics)
    return (
        <div
            className={cn(
                "relative group transition-all duration-300",
                isHovered ? "outline-1 outline-dashed outline-primary/40 rounded-sm" : ""
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Indicador de Edición Flotante (Premium) */}
            {isHovered && !isLoading && (
                <div className="absolute -top-6 left-0 z-50 flex items-center gap-2 px-2 py-1 bg-black/80 text-white rounded-t-md animate-in fade-in slide-in-from-bottom-1">
                    <Pencil size={10} className="text-primary" />
                    <span className="text-[10px] font-medium tracking-wider uppercase">
                        {label || id.split('.').pop()}
                    </span>
                </div>
            )}

            {/* Renderizado del contenido original */}
            <div className={cn(
                "transition-opacity duration-300",
                isLoading ? "opacity-30 pointer-events-none" : "hover:opacity-90 cursor-pointer"
            )} onClick={() => {
                // En un futuro, aquí abriremos el modal lateral de edición rápida.
            }}>
                {children(content)}
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                    <Loader2 className="animate-spin text-primary" size={20} />
                </div>
            )}
        </div>
    );
}
