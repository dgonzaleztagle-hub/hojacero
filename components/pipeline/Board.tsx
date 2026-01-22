'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Ticket, TicketProps } from './Ticket';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

// Mock Data Type
type BoardData = {
    [key: string]: TicketProps[];
};

interface PipelineBoardProps {
    leads: any[];
    onTicketClick?: (ticketId: string) => void;
    onLeadMove?: (leadId: string, newState: string) => void;
}

export const PipelineBoard = ({ leads, onTicketClick, onLeadMove }: PipelineBoardProps) => {
    const [items, setItems] = useState<BoardData>({
        radar: [], contactado: [], reunion: [], negociacion: [], produccion: [], perdido: []
    });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [originalContainer, setOriginalContainer] = useState<string | null>(null);

    // Sync Props to State
    useEffect(() => {
        const mappedData: BoardData = {
            radar: [], contactado: [], reunion: [], negociacion: [], produccion: [], perdido: []
        };

        leads.forEach((l: any) => {
            // Determine stage: prefer pipeline_stage, fallback to legacy mapping
            let stage = l.pipeline_stage;
            if (!stage) {
                if (l.estado === 'ready_to_contact') stage = 'radar';
                else if (l.estado === 'in_contact') stage = 'contactado';
                else if (l.estado === 'proposal_sent') stage = 'negociacion';
                else if (l.estado === 'won') stage = 'produccion';
                else if (l.estado === 'lost' || l.estado === 'discarded') stage = 'perdido';
                else stage = 'radar';
            }
            // Normalization if stage format differs
            stage = stage.toLowerCase();
            if (!mappedData[stage] && stage === 'ready_to_contact') stage = 'radar'; // Handle potential mishmash

            if (mappedData[stage]) {
                mappedData[stage].push({
                    id: l.id,
                    title: l.categoria || 'Sin categoría',
                    company: l.nombre,
                    tags: l.tags || [],
                    isStale: (stage === 'contactado' || stage === 'in_contact') && (new Date().getTime() - new Date(l.last_activity_at || l.created_at).getTime() > 3 * 24 * 60 * 60 * 1000),
                    lastContact: new Date(l.last_activity_at || l.created_at).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
                    vibe: l.service_type === 'dev' ? 'Dev' :
                        (l.service_type === 'marketing' ? 'Mkt' :
                            (l.service_type === 'full' ? 'Full' : undefined)),
                    industry: l.categoria || l.rubro || 'Nicho',
                    assignedTo: l.revisado_por || l.scanned_by || 'Sistema',
                    onClick: () => onTicketClick?.(l.id),
                    onAction: (action, id) => {
                        console.log(`Action: ${action} on ticket ${id}`);
                        // Future: Handle Factory Generation or Notes here
                        if (action === 'factory_demo') {
                            alert("Generando Demo Factory... (Próximamente)");
                        }
                    }
                });
            }
        });
        setItems(mappedData);
    }, [leads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id: string) => {
        if (id in items) return id;
        return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
    };

    const updateLeadPosition = async (id: string, newStage: string, newOrder: number) => {
        try {
            const response = await fetch('/api/pipeline', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, pipeline_stage: newStage, pipeline_order: newOrder })
            });
            await response.json();
            // Trigger refresh in parent
            if (onLeadMove) onLeadMove(id, newStage);
        } catch (error) {
            console.error("Failed to save pipeline position", error);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        const container = findContainer(id);
        setActiveId(id);
        setOriginalContainer(container || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const updateColumnOrder = async (items: TicketProps[], stage: string) => {
        try {
            // Prepare batch updates
            const updates = items.map((item, index) => ({
                id: item.id,
                pipeline_stage: stage,
                pipeline_order: index
            }));

            await fetch('/api/pipeline/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates })
            });

            if (stage === 'produccion') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00f0ff', '#10b981', '#ffffff']
                });
                toast.success('¡VENTA CERRADA! 🎉 El cliente ha sido movido a Producción.');
            }

            // Trigger refresh in parent if needed (though local state is optimistic)
            if (onLeadMove) onLeadMove(updates[0].id, stage); // Just to trigger refetch
        } catch (error) {
            console.error("Failed to save batch order", error);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        // Find where the item is NOW (after drag over moved it visually)
        const currentContainer = findContainer(active.id as string);
        // Find the target container (where we dropped)
        const targetContainer = over?.id ? (over.id in items ? over.id as string : findContainer(over.id as string)) : null;

        if (!currentContainer || !targetContainer) {
            setActiveId(null);
            setOriginalContainer(null);
            return;
        }

        // If we have an original container and it's different from current, we moved between containers
        if (originalContainer && originalContainer !== currentContainer) {
            // The visual state 'items' is already updated by handleDragOver for the move?
            // Actually, handleDragOver moves it *visually*. 
            // handleDragEnd commits it.
            // But wait, DndKit's handleDragOver modifies 'items' state directly during the drag.
            // So 'items[currentContainer]' ALREADY contains the item in its new position?
            // Yes, if handleDragOver logic is correct.

            // So we just need to persist the current state of the currentContainer (destination)
            const destItems = items[currentContainer];
            updateColumnOrder(destItems, currentContainer);
        }
        // Same container reordering
        else if (currentContainer === targetContainer) {
            const activeIndex = items[currentContainer].findIndex((item) => item.id === active.id);
            const overIndex = items[currentContainer].findIndex((item) => item.id === over?.id);

            if (activeIndex !== overIndex) {
                const newItems = arrayMove(items[currentContainer], activeIndex, overIndex);
                setItems((prev) => ({
                    ...prev,
                    [currentContainer]: newItems,
                }));
                // Persist the NEW order
                updateColumnOrder(newItems, currentContainer);
            }
        }

        setActiveId(null);
        setOriginalContainer(null);
    };

    const activeItem = activeId ? Object.values(items).flat().find(i => i.id === activeId) : null;

    const isMobile = useIsMobile();


    const columnOrder = ['radar', 'contactado', 'reunion', 'negociacion', 'produccion', 'perdido'];
    const columnTitles: Record<string, string> = {
        radar: 'Radar',
        contactado: 'Contactado',
        reunion: 'Reunión',
        negociacion: 'Negociación',
        produccion: 'Producción',
        perdido: 'Perdido'
    };

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-black/20">
                {/* Swipeable Columns Container */}
                <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 gap-4 px-4 items-start">
                    {columnOrder.map(colId => (
                        <div key={colId} className="min-w-[85vw] h-full snap-center flex flex-col pt-4">
                            {/* Mobile Column Header */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {columnTitles[colId]}
                                </h3>
                                <span className="bg-white/10 text-zinc-400 px-2 py-0.5 rounded text-xs font-mono">
                                    {items[colId]?.length || 0}
                                </span>
                            </div>

                            {/* Column Content */}
                            <div className="flex-1 relative">
                                <Column
                                    id={colId}
                                    title="" // Title rendered above
                                    count={0} // Count rendered above
                                    items={items[colId] || []}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Default Desktop View (Drag & Drop)
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-1 h-full gap-3 overflow-x-auto pb-2 items-stretch select-none scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <Column id="radar" title="Radar" count={items.radar?.length || 0} items={items.radar || []} />
                <Column id="contactado" title="Contactado" count={items.contactado?.length || 0} items={items.contactado || []} />
                <Column id="reunion" title="Reunión" count={items.reunion?.length || 0} items={items.reunion || []} />
                <Column id="negociacion" title="Negociación" count={items.negociacion?.length || 0} items={items.negociacion || []} />
                <Column id="produccion" title="Producción" count={items.produccion?.length || 0} items={items.produccion || []} />
                <Column id="perdido" title="Perdido" count={items.perdido?.length || 0} items={items.perdido || []} />
            </div>

            <DragOverlay>
                {activeItem ? <Ticket {...activeItem} /> : null}
            </DragOverlay>
        </DndContext>
    );
};
