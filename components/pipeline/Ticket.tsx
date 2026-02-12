'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreHorizontal, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useDashboard } from '@/app/dashboard/DashboardContext';

// Types (eventually move to a shared type file)
// ... (rest)
export type TicketProps = {
    id: string;
    title: string;
    company: string;
    tags?: string[];
    vibe?: 'Dev' | 'Mkt' | 'Full';
    leadType?: 'auditory' | 'construction';
    lastContact?: string;
    visits?: number;
    isStale?: boolean;
    industry?: string;
    assignedTo?: string;
    onClick?: () => void;
    onAction?: (action: string, id: string) => void;
};

export const Ticket = ({ id, title, company, tags = [], vibe, leadType, lastContact, visits = 0, isStale, industry, assignedTo, onClick, onAction }: TicketProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const { theme } = useDashboard();
    const isDark = theme === 'dark';

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
        group relative p-2.5 mb-2 border rounded-xl transition-all duration-200 select-none
        ${isDark ? 'bg-[#09090b]' : 'bg-white shadow-sm'}
        ${isStale
                    ? isDark ? 'border-red-500/50 shadow-[0_0_10px_-3px_rgba(239,68,68,0.3)]' : 'border-red-200 shadow-[0_0_10px_-3px_rgba(239,68,68,0.1)]'
                    : isDark ? 'border-white/5' : 'border-gray-100'}
        ${isDark ? 'hover:border-white/10 hover:shadow-cyan-500/5' : 'hover:border-indigo-200 hover:shadow-indigo-500/5'}
        hover:shadow-lg cursor-pointer active:cursor-grabbing
      `}
            {...attributes}
            {...listeners}
        >
            {/* Drag Handle */}
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-zinc-700' : 'text-gray-300'}`}>
                <GripVertical size={14} />
            </div>

            {/* Header / Company */}
            <div className="flex justify-between items-start mb-0.5 pr-4">
                <div className="flex items-center gap-1.5 max-w-[90%]">
                    {isStale && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" title="Sin respuesta > 3 días" />}
                    <h3 className={`text-sm font-bold truncate transition-colors ${isDark ? 'text-gray-200' : 'text-gray-900 group-hover:text-indigo-600'}`}>{company}</h3>
                </div>
                {visits > 0 && (
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-bold shrink-0 animate-pulse transition-colors ${isDark ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                        <span>👁️</span>
                        <span>{visits}</span>
                    </div>
                )}
            </div>
            <p className={`text-xs truncate mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{title}</p>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {/* Service Type Badge */}
                {leadType === 'construction' && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        🏗️ NUEVO BUILD
                    </span>
                )}
                {vibe === 'Dev' && <span className={`px-1.5 py-0.5 rounded text-[10px] border ${isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>💻 Dev</span>}
                {vibe === 'Mkt' && <span className={`px-1.5 py-0.5 rounded text-[10px] border ${isDark ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>📣 Mkt</span>}
                {vibe === 'Full' && <span className={`px-1.5 py-0.5 rounded text-[10px] border ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>🚀 Full</span>}

                {tags.includes('urgente') && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${isDark ? 'text-red-400 bg-red-900/20 border-red-500/20' : 'text-red-600 bg-red-50 border-red-100'}`}>
                        🔥 Urgente
                    </span>
                )}
                {tags.includes('factory') && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${isDark ? 'text-purple-400 bg-purple-900/20 border-purple-500/20' : 'text-purple-600 bg-purple-50 border-purple-100'}`}>
                        ✨ Factory
                    </span>
                )}

                {industry && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded border ${isDark ? 'text-zinc-400 bg-zinc-800 border-white/5' : 'text-gray-500 bg-gray-50 border-gray-100'}`}>
                        🏭 {industry}
                    </span>
                )}

                {assignedTo && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${isDark ? 'text-cyan-400 bg-cyan-900/20 border-cyan-500/20' : 'text-cyan-600 bg-cyan-50 border-cyan-100'}`}>
                        👤 {assignedTo}
                    </span>
                )}
            </div>

            {/* Actions Footer */}
            <div className={`flex items-center justify-between border-t pt-2 mt-2 transition-colors ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                <div className={`flex items-center gap-2 text-[10px] ${isStale ? isDark ? 'text-red-400 font-medium' : 'text-red-500 font-bold' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {isStale ? <AlertCircle size={10} /> : <Calendar size={10} />}
                    <span>{lastContact || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Notes Button */}
                    <button
                        onClick={(e) => handleAction(e, 'notes')}
                        className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-[#333] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'}`}
                        title="Notas Rápidas"
                    >
                        <MoreHorizontal size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};
