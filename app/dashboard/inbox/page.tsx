'use client';

import { useState, useEffect } from 'react';
import { Search, PenSquare, Mail, Trash2, Printer } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

export default function InboxPage() {
    const { currentClient } = useDashboard();
    const emails = currentClient.emails;
    const [selectedEmail, setSelectedEmail] = useState<typeof emails[0] | null>(null);

    // Reset selection when client changes
    useEffect(() => {
        setSelectedEmail(null);
    }, [currentClient]);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight">Bandeja de Entrada</h1>
                    <p className="text-zinc-500 text-sm mt-1">hojacero-mail-engine <span className="text-green-500 text-xs ml-2">● ONLINE</span></p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-200 transition-colors">
                    <PenSquare className="w-4 h-4" />
                    Redactar
                </button>
            </div>

            {/* Main Interface */}
            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden flex">

                {/* Email List */}
                <div className="w-1/3 border-r border-white/5 flex flex-col">
                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Buscar mensajes..."
                                className="w-full bg-zinc-950 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {emails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmail(email)}
                                className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors 
                                    ${selectedEmail?.id === email.id ? 'bg-white/10 border-l-2 border-cyan-400' : ''}
                                    ${email.unread ? 'bg-white/[0.02]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-medium ${email.unread ? 'text-white' : 'text-zinc-400'}`}>{email.from}</span>
                                    <span className="text-xs text-zinc-600 font-mono">{email.time}</span>
                                </div>
                                <h4 className={`text-sm mb-1 truncate ${email.unread ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>{email.subject}</h4>
                                <p className="text-xs text-zinc-600 truncate">{email.preview}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reading Pane (Preview) */}
                <div className="flex-1 flex flex-col">
                    {selectedEmail ? (
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            {/* Email Header */}
                            <div className="p-8 border-b border-white/5 bg-black/20">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-light text-white">{selectedEmail.subject}</h2>
                                    <div className="flex gap-2">
                                        <button className="text-zinc-400 hover:text-white"><Printer className="w-4 h-4" /></button>
                                        <button className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                                        {selectedEmail.from[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{selectedEmail.from}</p>
                                        <p className="text-xs text-zinc-500">para mí</p>
                                    </div>
                                    <span className="ml-auto text-xs text-zinc-600 font-mono">{selectedEmail.time}</span>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="p-8 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {selectedEmail.body}
                            </div>

                            {/* Reply Box */}
                            <div className="p-8 mt-auto border-t border-white/5 bg-zinc-900/30">
                                <div className="border border-white/10 rounded-lg p-4 bg-black/50 text-zinc-500 text-sm cursor-text hover:border-white/20 transition-colors">
                                    Clic aquí para <span className="text-cyan-400">Responder</span> o <span className="text-cyan-400">Reenviar</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                                <Mail className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-sm">Selecciona un mensaje para leer</p>
                            <p className="text-xs text-zinc-700 mt-2 font-mono">CONEXIÓN SEGURA ESTABLECIDA</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
