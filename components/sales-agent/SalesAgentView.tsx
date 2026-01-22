'use client';

import React from 'react';
import { ChatInterface } from './ChatInterface';
import { Target } from 'lucide-react';

export function SalesAgentView() {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-black overflow-hidden border border-white/5 rounded-3xl m-4 shadow-2xl">
            {/* Header */}
            <header className="p-4 border-b border-white/5 flex items-center gap-4 bg-zinc-900/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-medium text-white">Asesor H0</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Online</span>
                    </div>
                </div>
            </header>

            {/* Chat */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <ChatInterface />
            </main>
        </div>
    );
}
