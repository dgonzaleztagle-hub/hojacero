import React, { useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface ChatMessage {
    id: string;
    author: 'Yo' | 'Gaston' | 'Sistema';
    message: string;
    created_at: string;
}

interface ChatSystemProps {
    chatMessages: ChatMessage[];
    newChatMessage: string;
    setNewChatMessage: (val: string) => void;
    chatAuthor: 'Yo' | 'Gaston';
    setChatAuthor: (val: 'Yo' | 'Gaston') => void;
    onSendChatMessage: (e?: React.FormEvent) => Promise<void> | void;
    isDark: boolean;
}

export const ChatSystem = ({
    chatMessages,
    newChatMessage,
    setNewChatMessage,
    chatAuthor,
    setChatAuthor,
    onSendChatMessage,
    isDark
}: ChatSystemProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    return (
        <div className={`mt-6 p-5 rounded-xl border flex flex-col h-[400px] ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                    <MessageSquare className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Bitácora / Chat Interno</h3>
                </div>
                <div className={`text-[10px] px-2 py-0.5 rounded border ${isDark ? 'bg-black/40 border-white/10 text-zinc-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                    {chatMessages.length} mensajes
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar flex flex-col">
                {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.author === 'Yo' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.author === 'Yo' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {msg.author !== 'Yo' && (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 shadow-lg ${msg.author === 'Sistema' ? 'bg-zinc-800 border-zinc-700 text-zinc-400' :
                                    'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-500/30 text-white' // Gaston/Others
                                    }`}>
                                    {msg.author.charAt(0)}
                                </div>
                            )}
                            {msg.author === 'Yo' && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-500/30 text-white">
                                    Yo
                                </div>
                            )}

                            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-md ${msg.author === 'Yo'
                                ? (isDark ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 rounded-tr-none' : 'bg-blue-600 text-white rounded-tr-none')
                                : msg.author === 'Sistema'
                                    ? (isDark ? 'bg-zinc-900/50 border border-white/5 text-zinc-400 text-xs italic' : 'bg-gray-100 text-gray-500 text-xs italic')
                                    : (isDark ? 'bg-zinc-800 border border-white/10 text-white rounded-tl-none' : 'bg-white border-gray-200 text-gray-800 rounded-tl-none')
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                        <span className={`text-[9px] mt-1 px-1 opacity-50 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={scrollRef}></div>

                {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-2 opacity-50">
                        <MessageSquare className="w-8 h-8" />
                        <p className="text-xs">No hay mensajes en la bitácora</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={onSendChatMessage} className="shrink-0 pt-3 border-t border-white/5">
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={() => setChatAuthor('Yo')}
                            className={`h-8 px-2 rounded-lg text-[10px] font-bold border transition-all ${chatAuthor === 'Yo' ? (isDark ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-blue-100 border-blue-300 text-blue-600') : (isDark ? 'bg-white/5 border-transparent text-zinc-500 hover:text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-500')}`}
                        >
                            YO
                        </button>
                        <button
                            type="button"
                            onClick={() => setChatAuthor('Gaston')}
                            className={`h-8 px-2 rounded-lg text-[10px] font-bold border transition-all ${chatAuthor === 'Gaston' ? (isDark ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-purple-100 border-purple-300 text-purple-600') : (isDark ? 'bg-white/5 border-transparent text-zinc-500 hover:text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-500')}`}
                        >
                            GS
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            placeholder="Escribe un mensaje..."
                            className={`w-full h-full rounded-xl pl-4 pr-12 text-sm outline-none border transition-all ${isDark ? 'bg-black/40 border-white/10 text-white focus:border-white/30 placeholder:text-zinc-600' : 'bg-white border-gray-200 text-gray-900 focus:border-blue-400 placeholder:text-gray-400'}`}
                        />
                        <button
                            type="submit"
                            disabled={!newChatMessage.trim()}
                            className={`absolute right-1 top-1 bottom-1 aspect-square rounded-lg flex items-center justify-center transition-all ${newChatMessage.trim() ? (isDark ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-blue-600 text-white hover:bg-blue-500') : (isDark ? 'bg-white/5 text-zinc-600' : 'bg-gray-100 text-gray-400')}`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
