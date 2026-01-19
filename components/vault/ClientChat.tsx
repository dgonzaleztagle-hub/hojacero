'use client';

import { Cliente } from './types';
import { MessageSquare } from 'lucide-react';

interface ClientChatProps {
    cliente: Cliente;
}

export default function ClientChat({ cliente }: ClientChatProps) {
    return (
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 mt-4">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-100">
                <MessageSquare className="w-4 h-4 text-green-400" />
                Bitácora
            </h3>
            <div className="h-40 flex items-center justify-center text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-lg">
                Historial de chat aquí...
            </div>
        </div>
    );
}
