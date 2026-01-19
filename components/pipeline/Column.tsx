'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Ticket, TicketProps } from './Ticket';

type ColumnProps = {
    id: string;
    title: string;
    count: number;
    items: TicketProps[];
};

export const Column = ({ id, title, count, items }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col w-full md:w-[260px] h-full flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    {title}
                    <span className="bg-[#222] text-gray-500 text-[10px] py-0.5 px-2 rounded-full">
                        {count}
                    </span>
                </h2>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                className="flex-1 bg-[#0A0A0A] rounded-xl p-1.5 border border-[#1A1A1A] overflow-y-auto min-h-[150px] scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <SortableContext
                    id={id}
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map((item) => (
                        <Ticket key={item.id} {...item} />
                    ))}

                    {items.length === 0 && (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-[#222] rounded-xl m-2">
                            <p className="text-xs text-gray-700 font-medium">Arrastra leads aquí</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};
