'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreHorizontal, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Types (eventually move to a shared type file)
export type TicketProps = {
    id: string;
    title: string;
    company: string;
    tags?: string[];
    vibe?: 'Dev' | 'Mkt' | 'Full';
    lastContact?: string;
    visits?: number;
    isStale?: boolean;
    industry?: string;
    assignedTo?: string;
    onClick?: () => void;
    onAction?: (action: string, id: string) => void;
};

export const Ticket = ({ id, title, company, tags = [], vibe, lastContact, visits = 0, isStale, industry, assignedTo, onClick, onAction }: TicketProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        onAction?.(action, id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`
        group relative p-2.5 mb-2 bg-[#09090b] border rounded-xl 
        ${isStale ? 'border-red-500/50 shadow-[0_0_10px_-3px_rgba(239,68,68,0.3)]' : 'border-white/5 check-border'}
        hover:border-white/10 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200
        cursor-pointer active:cursor-grabbing
      `}
            {...attributes}
            {...listeners}
        >
            {/* Drag Handle */}
            <div className="absolute top-2 right-2 text-[#444] opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
            </div>

            {/* Header / Company */}
            <div className="flex justify-between items-start mb-0.5 pr-4">
                <div className="flex items-center gap-1.5 max-w-[90%]">
                    {isStale && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" title="Sin respuesta > 3 días" />}
                    <h3 className="text-sm font-bold text-gray-200 truncate">{company}</h3>
                </div>
                {visits > 0 && (
                    <div className="flex items-center gap-1 bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-500/30 text-[10px] text-blue-300 font-bold shrink-0 animate-pulse">
                        <span>👁️</span>
                        <span>{visits}</span>
                    </div>
                )}
            </div>
            <p className="text-xs text-zinc-500 truncate mb-2">{title}</p>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {/* Service Type Badge */}
                {vibe === 'Dev' && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">💻 Dev</span>}
                {vibe === 'Mkt' && <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 text-[10px] border border-pink-500/20">📣 Mkt</span>}
                {vibe === 'Full' && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] border border-purple-500/20">🚀 Full</span>}

                {tags.includes('urgente') && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-red-400 bg-red-900/20 border border-red-500/20 rounded">
                        🔥 Urgente
                    </span>
                )}
                {tags.includes('factory') && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-purple-400 bg-purple-900/20 border border-purple-500/20 rounded">
                        ✨ Factory
                    </span>
                )}

                {industry && (
                    <span className="px-1.5 py-0.5 text-[10px] text-zinc-400 bg-zinc-800 border border-white/5 rounded">
                        🏭 {industry}
                    </span>
                )}

                {assignedTo && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 bg-cyan-900/20 border border-cyan-500/20 rounded">
                        👤 {assignedTo}
                    </span>
                )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                <div className={`flex items-center gap-2 text-[10px] ${isStale ? 'text-red-400 font-medium' : 'text-gray-600'}`}>
                    {isStale ? <AlertCircle size={10} /> : <Calendar size={10} />}
                    <span>{lastContact || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Notes Button */}
                    <button
                        onClick={(e) => handleAction(e, 'notes')}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#333] text-gray-400 hover:text-white transition-colors"
                        title="Notas Rápidas"
                    >
                        <MoreHorizontal size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
