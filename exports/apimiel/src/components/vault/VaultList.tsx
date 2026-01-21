'use client';

import { Cliente } from './types';
import VaultCard from './VaultCard';

interface VaultListProps {
    clientes: Cliente[];
    selectedId: string | null;
    onSelect: (cliente: Cliente) => void;
    isLoading: boolean;
}

export default function VaultList({ clientes, selectedId, onSelect, isLoading }: VaultListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-zinc-900/50 rounded-xl border border-white/5"></div>
                ))}
            </div>
        );
    }

    if (clientes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <p>No se encontraron clientes</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 pb-24 md:pb-0">
            {clientes.map((cliente) => (
                <VaultCard
                    key={cliente.id}
                    cliente={cliente}
                    isSelected={selectedId === cliente.id}
                    onClick={() => onSelect(cliente)}
                />
            ))}
        </div>
    );
}
