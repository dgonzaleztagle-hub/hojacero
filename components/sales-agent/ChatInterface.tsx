'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Terminal, User, Bot } from 'lucide-react';
import { SalesAgenda } from './SalesAgenda';
import { RadarReport } from './RadarReport';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    tool_calls?: any[];
    tool_call_id?: string;
    tool_name?: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        model_name?: string;
    };
}

// Helper component for progressive messages
function ThinkingStatus() {
    const [step, setStep] = useState(0);
    const messages = [
        "Conectando...",
        "Analizando estructura...",
        "Revisando tecnologías...",
        "Redactando informe...",
        "Finalizando..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(s => (s + 1) % messages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-3">
                <div className="flex gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    <motion.div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
                <span className="text-xs text-zinc-400 font-mono animate-pulse">
                    {messages[step]}
                </span>
            </div>
        </motion.div>
    );
}

export function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAgenda, setShowAgenda] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Initial greeting on mount
    useEffect(() => {
        sendToAgent(''); // Empty message triggers initial greeting
    }, []);

    const sendToAgent = async (userMessage: string) => {
        setIsProcessing(true);

        // Add user message to UI (if not initial)
        const updatedMessages = userMessage
            ? [...messages, { id: Date.now().toString(), role: 'user' as const, content: userMessage }]
            : messages;

        if (userMessage) {
            setMessages(updatedMessages);
        }

        try {
            const res = await fetch('/api/sales-agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content,
                        tool_calls: m.tool_calls,
                        tool_call_id: m.tool_call_id
                    })),
                    sessionId
                })
            });

            const data = await res.json();

            if (data.success) {
                // Save sessionId if returned
                if (data.sessionId && !sessionId) {
                    setSessionId(data.sessionId);
                }

                // Add new messages (can include tool calls and results)
                const apiMessages = data.newMessages || [];
                const mappedApiMessages: ChatMessage[] = apiMessages.map((m: any) => ({
                    id: Math.random().toString(36).slice(2),
                    role: m.role,
                    content: m.content || '',
                    tool_calls: m.tool_calls,
                    tool_call_id: m.tool_call_id,
                    tool_name: m.tool_name
                }));

                // Assistant final content message
                const finalAssistantMsg: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: data.message,
                    usage: data.tokenUsage
                };

                setMessages(prev => [...prev, ...mappedApiMessages, finalAssistantMsg]);

                // Check for agenda trigger
                if (data.toolsUsed?.includes('schedule_meeting')) {
                    setShowAgenda(true);
                }
            } else {
                console.error("Chat API Error:", data.error);
                setMessages(prev => [...prev, {
                    id: `error-${Date.now()}`,
                    role: 'system',
                    content: `Error del sistema: ${data.error || 'Hubo un problema conectando.'}`
                }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
            // Focus the input after processing
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const text = input.trim();
        if (!text || isProcessing) return;
        setInput('');
        sendToAgent(text);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-zinc-950/20">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                    {messages.filter(m => (m.role !== 'tool' && m.content) || (m.role === 'tool' && m.tool_name === 'diagnose_website')).map((m) => {
                        if (m.role === 'tool' && m.tool_name === 'diagnose_website') {
                            try {
                                const data = JSON.parse(m.content);
                                if (data.error) return null;
                                return <RadarReport key={m.id} data={data} />;
                            } catch (e) {
                                return null;
                            }
                        }

                        return (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {m.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-cyan-600 text-white rounded-br-none'
                                    : m.role === 'system'
                                        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        : 'bg-zinc-900 border border-white/10 text-zinc-100 rounded-bl-none'
                                    }`}>
                                    {m.content}
                                    {m.usage && (
                                        <div className="mt-2 text-xs text-zinc-500 font-mono border-t border-white/5 pt-2 flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <span>{m.usage.total_tokens} toks</span>
                                            </div>
                                            <span title="Prompt / Completion">({m.usage.prompt_tokens}/{m.usage.completion_tokens})</span>
                                        </div>
                                    )}
                                </div>
                                {m.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                    {isProcessing && <ThinkingStatus />}
                </AnimatePresence>

                {showAgenda && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-sm">
                        <SalesAgenda />
                    </motion.div>
                )}
            </div>

            <div className="p-4 bg-zinc-900/40 border-t border-white/5">
                <form onSubmit={handleSend} className="relative max-w-3xl mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isProcessing}
                        placeholder="Escribe tu mensaje..."
                        autoFocus
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-14 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                        type="submit"
                        disabled={isProcessing || !input.trim()}
                        className="absolute right-2 top-1.5 bottom-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
