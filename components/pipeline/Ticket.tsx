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
    onClick?: () => void;
    onAction?: (action: string, id: string) => void;
};

export const Ticket = ({ id, title, company, tags = [], vibe, lastContact, onClick, onAction }: TicketProps) => {
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
        group relative p-3 mb-3 bg-[#111111] border border-[#222] rounded-xl 
        hover:border-[#444] hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-200
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
            <div className="flex justify-between items-start mb-1 pr-4">
                <h3 className="text-sm font-semibold text-white truncate max-w-[85%]">{company}</h3>
            </div>
            <p className="text-[11px] text-gray-500 truncate mb-3">{title}</p>

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
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                    <Calendar size={10} />
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
