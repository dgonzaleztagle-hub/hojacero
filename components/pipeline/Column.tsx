'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Ticket, TicketProps } from './Ticket';

import { useDashboard } from '@/app/dashboard/DashboardContext';

type ColumnProps = {
    // ... (rest)
    id: string;
    title: string;
    count: number;
    items: TicketProps[];
};

export const Column = ({ id, title, count, items }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });
    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    return (
        <div className="flex flex-col min-w-[300px] flex-1 h-full flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className={`text-xs font-black uppercase tracking-[0.15em] flex items-center gap-3 transition-colors ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {title}
                    <span className={`text-[10px] py-0.5 px-2.5 rounded-full font-mono transition-colors ${isDark ? 'bg-white/5 text-zinc-500 border border-white/5' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                        {count}
                    </span>
                </h2>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className={`flex-1 rounded-[24px] p-2 border min-h-[150px] scrollbar-thin transition-all overflow-y-auto ${isDark ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-gray-50/50 border-gray-100 shadow-inner'}`}
            >
                <SortableContext
                    id={id}
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((item) => (
                        <Ticket key={item.id} {...item} />
                    ))}

                    {items.length === 0 && (
                        <div className={`h-full flex items-center justify-center border-2 border-dashed rounded-xl m-2 transition-colors ${isDark ? 'border-[#222]' : 'border-gray-200'}`}>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>Vacío</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};
