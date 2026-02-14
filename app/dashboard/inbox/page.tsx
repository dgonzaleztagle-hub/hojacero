'use client';

import { createClient } from '@/utils/supabase/client';
import { Mail, RefreshCw, Send, Trash2, Reply, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/inbox/RichTextEditor';

import { useDashboard } from '@/app/dashboard/DashboardContext';

interface Email {
    // ... (rest should be fine)
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    body_text: string;
    created_at: string;
    is_read: boolean;
}

interface OutboxEntry {
    id: string;
    recipient: string;
    subject: string;
    status: 'pending' | 'sent' | 'failed' | string;
    error_message: string | null;
    created_at: string;
}

export default function InboxPage() {
    const supabase = useMemo(() => createClient(), []);
    const [emails, setEmails] = useState<Email[]>([]);
    const [outbox, setOutbox] = useState<OutboxEntry[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingOutbox, setLoadingOutbox] = useState(true);
    const [replying, setReplying] = useState(false);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);

    const fetchEmails = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('email_inbox')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error(`Error: ${error.message}`);
        } else {
            setEmails(data || []);
        }
        setLoading(false);
    }, [supabase]);

    const fetchOutbox = useCallback(async () => {
        setLoadingOutbox(true);
        const { data, error } = await supabase
            .from('email_outbox')
            .select('id, recipient, subject, status, error_message, created_at')
            .order('created_at', { ascending: false })
            .limit(8);

        if (error) {
            toast.error(`Error historial salida: ${error.message}`);
        } else {
            setOutbox((data || []) as OutboxEntry[]);
        }
        setLoadingOutbox(false);
    }, [supabase]);

    useEffect(() => {
        fetchEmails();
        fetchOutbox();

        // Realtime Subscription
        const channel = supabase
            .channel('inbox_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'email_inbox' }, () => {
                toast.success('¡Nuevo correo recibido!');
                fetchEmails();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetchEmails, fetchOutbox, supabase]);

    // Helper to decode Quoted-Printable with proper UTF-8 support
    const decodeQuotedPrintable = (str: string) => {
        // 1. Remove soft line breaks (= followed by newline)
        const cleanStr = str.replace(/=\r\n/g, '').replace(/=\n/g, '');

        // 2. Convert to byte array
        const bytes: number[] = [];
        for (let i = 0; i < cleanStr.length; i++) {
            if (cleanStr[i] === '=') {
                // Parse hex code
                const hex = cleanStr.substr(i + 1, 2);
                if (/^[0-9A-F]{2}$/i.test(hex)) {
                    bytes.push(parseInt(hex, 16));
                    i += 2; // Skip the 2 hex chars
                } else {
                    bytes.push(cleanStr.charCodeAt(i));
                }
            } else {
                bytes.push(cleanStr.charCodeAt(i));
            }
        }

        // 3. Decode bytes as UTF-8
        try {
            return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
        } catch (e) {
            console.error("Error decoding UTF-8:", e);
            return str; // Fallback
        }
    };

    const getCleanBody = (rawText: string) => {
        if (!rawText) return "";

        try {
            // Helper to check for encoding and decode if needed
            const decodeContent = (text: string, headers: string) => {
                if (/content-transfer-encoding:\s*quoted-printable/i.test(headers)) {
                    return decodeQuotedPrintable(text);
                }
                return text;
            };

            // 1. If it doesn't look like a multipart message (no boundaries), try simple header stripping
            if (!rawText.includes("Content-Type: multipart")) {
                if (rawText.includes('Content-Type: text/plain') || rawText.includes('Received:')) {
                    const parts = rawText.split(/\r\n\r\n|\n\n/);
                    if (parts.length > 1) {
                        // Ensure we assume the body part is the one after headers
                        return decodeContent(parts.slice(1).join("\n\n").trim(), parts[0]);
                    }
                }
                return rawText;
            }

            // 2. Identify Boundary
            // Iterate lines to find the first likely boundary (starting with --)
            const lines = rawText.split(/\r\n|\n/);
            let boundary = "";
            for (const line of lines) {
                // Boundary must start with --, not be the end boundary (--...--), and be reasonably long
                if (line.trim().startsWith("--") && !line.trim().endsWith("--") && line.trim().length > 5) {
                    boundary = line.trim();
                    break;
                }
            }

            if (!boundary) return rawText; // Failed to find boundary

            // 3. Split by boundary
            const parts = rawText.split(boundary);

            // 4. Find text/plain part
            for (const part of parts) {
                const cleanPart = part.trim();
                if (!cleanPart || cleanPart === "--") continue; // Skip empty or end boundary

                // Find separation between headers and body of this part
                // We look for double newline
                const match = cleanPart.match(/\r\n\r\n|\n\n/);
                if (!match || match.index === undefined) continue;

                const headers = cleanPart.substring(0, match.index);
                const body = cleanPart.substring(match.index + match[0].length).trim();

                if (headers.toLowerCase().includes("content-type: text/plain")) {
                    return decodeContent(body, headers);
                }
            }

            return rawText;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'unknown';
            console.error("Email parsing FAILED:", {
                error: message,
                textLength: rawText.length,
                preview: rawText.substring(0, 200)
            });
            return `[Error de decodificacion: ${message}]\n\n${rawText.substring(0, 500)}...`;
        }
    };

    const handleSendReply = async () => {
        if (!selectedEmail || !replyBody.trim()) return;
        setSending(true);

        const cleanText = replyBody.replace(/<[^>]+>/g, ' ').trim();

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedEmail.sender,
                    subject: `RE: ${selectedEmail.subject}`,
                    text: cleanText, // Fallback plain text
                    html: replyBody  // Rich HTML content
                })
            });

            if (!res.ok) throw new Error('Error enviando correo');

            toast.success('Respuesta enviada correctamente');
            setReplyBody('');
            setReplying(false);
            fetchOutbox();
        } catch {
            toast.error('No se pudo enviar el correo');
        } finally {
            setSending(false);
        }
    };

    const [composing, setComposing] = useState(false);
    const [composeTo, setComposeTo] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');

    const handleSendNewEmail = async () => {
        if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
            toast.error('Completa todos los campos');
            return;
        }
        setSending(true);

        const cleanText = composeBody.replace(/<[^>]+>/g, ' ').trim();

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: composeTo,
                    subject: composeSubject,
                    text: cleanText,
                    html: composeBody
                })
            });

            if (!res.ok) throw new Error('Error enviando correo');

            toast.success('Correo enviado correctamente');
            setComposeTo('');
            setComposeSubject('');
            setComposeBody('');
            setComposing(false);
            fetchOutbox();
        } catch {
            toast.error('No se pudo enviar el correo');
        } finally {
            setSending(false);
        }
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setEmails(prev => prev.map(e => e.id === id ? { ...e, is_read: true } : e));

        const { error } = await supabase
            .from('email_inbox')
            .update({ is_read: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking as read:', error);
            // Revert on error if needed, but for 'read' status it's usually fine
        }
    };

    const { theme } = useDashboard();
    const isDark = theme === 'dark';

    return (
        <div className={`flex h-[calc(100vh-6rem)] rounded-2xl overflow-hidden border relative transition-colors ${isDark ? 'bg-zinc-950 text-white border-zinc-800' : 'bg-white text-gray-900 border-gray-200 shadow-sm'}`}>
            {/* Sidebar List */}
            <div className={`flex-col border-r md:flex w-full md:w-1/3 transition-colors ${selectedEmail ? 'hidden' : 'flex'} ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`p-4 border-b flex justify-between items-center transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Mail className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        Buzón
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setComposing(true)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold shadow-lg shadow-indigo-500/20"
                            title="Redactar nuevo"
                        >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Redactar</span>
                        </button>
                        <button onClick={fetchEmails} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                            <RefreshCw className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'} ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={fetchOutbox} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`} title="Refrescar historial de salida">
                            <RefreshCw className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'} ${loadingOutbox ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {emails.length === 0 && !loading && (
                        <div className={`p-8 text-center ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            No hay correos aún.
                        </div>
                    )}

                    {emails.map(email => (
                        <div
                            key={email.id}
                            onClick={() => {
                                setSelectedEmail(email);
                                if (!email.is_read) markAsRead(email.id);
                            }}
                            className={`p-4 border-b cursor-pointer transition-all ${isDark
                                ? selectedEmail?.id === email.id ? 'bg-zinc-800 border-l-4 border-l-indigo-500 border-zinc-800/50' : 'hover:bg-zinc-800/50 border-zinc-800/50 border-l-4 border-l-transparent'
                                : selectedEmail?.id === email.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600 border-gray-100 shadow-sm' : 'hover:bg-gray-100 border-gray-100 border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium ${!email.is_read ? isDark ? 'text-white' : 'text-gray-900' : isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    {email.sender}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    {new Date(email.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className={`text-sm mb-1 truncate ${!email.is_read ? isDark ? 'font-semibold text-indigo-200' : 'font-bold text-indigo-700' : isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                                {email.subject}
                            </h3>
                            <p className={`text-xs line-clamp-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                {getCleanBody(email.body_text)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className={`border-t p-3 ${isDark ? 'border-zinc-800 bg-zinc-900/70' : 'border-gray-200 bg-gray-100/80'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                            Salida reciente
                        </p>
                        <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            {outbox.length} registros
                        </span>
                    </div>

                    <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1.5">
                        {loadingOutbox && (
                            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Cargando...</p>
                        )}

                        {!loadingOutbox && outbox.length === 0 && (
                            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>Sin envios registrados.</p>
                        )}

                        {!loadingOutbox && outbox.map(item => (
                            <div key={item.id} className={`rounded-md p-2 border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[11px] truncate ${isDark ? 'text-zinc-200' : 'text-gray-800'}`}>{item.recipient}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.status === 'sent'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : item.status === 'failed'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className={`text-[10px] truncate ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{item.subject}</p>
                                {item.status === 'failed' && item.error_message && (
                                    <p className="text-[10px] text-red-400 truncate">{item.error_message}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Email Detail View */}
            <div className={`flex-col md:flex flex-1 transition-colors ${selectedEmail ? 'flex' : 'hidden'} ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-gray-900'}`}>
                {selectedEmail ? (
                    <>
                        {/* Header */}
                        <div className={`p-4 md:p-6 border-b transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex flex-col gap-4">
                                {/* Mobile Back Button */}
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className={`md:hidden flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    ← Volver a la lista
                                </button>

                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h1 className={`text-lg md:text-xl font-bold break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEmail.subject}</h1>
                                            <span className={`px-2 py-0.5 rounded text-[10px] border shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>Inbox</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedEmail.sender}</span>
                                                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{new Date(selectedEmail.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'}`} title="Borrar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className={`flex-1 p-4 md:p-8 overflow-y-auto font-sans leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>
                            <div className="whitespace-pre-wrap word-break-break-word">
                                {getCleanBody(selectedEmail.body_text)}
                            </div>
                        </div>

                        {/* Reply Area */}
                        <div className={`p-4 border-t transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
                            {replying ? (
                                <div className={`border rounded-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-5 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-300'}`}>
                                    <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-100 border-gray-200'}`}>
                                        <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-gray-700'}`}>Respondiendo a {selectedEmail.sender}</span>
                                        <button onClick={() => setReplying(false)} className={`text-xs ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>Cancelar</button>
                                    </div>
                                    <div className={`p-4 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                                        <RichTextEditor
                                            value={replyBody}
                                            onChange={setReplyBody}
                                            placeholder="Escribe tu respuesta aquí..."
                                        />
                                    </div>
                                    <div className={`p-3 border-t flex justify-end gap-3 ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={sending || !replyBody.trim()}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/10"
                                        >
                                            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {sending ? 'Enviando...' : 'Enviar Respuesta'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setReplying(true)}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all w-full md:w-auto justify-center shadow-md ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}
                                >
                                    <Reply className="w-4 h-4" />
                                    Responder
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4 p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center">
                            <Mail className="w-8 h-8 text-zinc-700" />
                        </div>
                        <p>Selecciona un correo para leerlo</p>
                    </div>
                )}
            </div>

            {/* Compose Modal */}
            {composing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className={`w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-full h-[90vh] animate-in zoom-in-95 border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
                        <div className={`p-4 border-b flex justify-between items-center rounded-t-2xl ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-100'}`}>
                            <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Send className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                Nuevo Mensaje
                            </h3>
                            <button onClick={() => setComposing(false)} className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
                            <div>
                                <label className={`block text-[10px] font-bold mb-1 uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Para</label>
                                <input
                                    type="email"
                                    value={composeTo}
                                    onChange={(e) => setComposeTo(e.target.value)}
                                    className={`w-full rounded-xl px-4 py-3 outline-none transition-all border ${isDark ? 'bg-zinc-950 border-zinc-800 text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-600 focus:bg-white'}`}
                                    placeholder="ejemplo@cliente.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className={`block text-[10px] font-bold mb-1 uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Asunto</label>
                                <input
                                    type="text"
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                    className={`w-full rounded-xl px-4 py-3 outline-none transition-all border ${isDark ? 'bg-zinc-950 border-zinc-800 text-white focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-600 focus:bg-white'}`}
                                    placeholder="Asunto del correo"
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className={`block text-[10px] font-bold mb-1 uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Mensaje</label>
                                <div className="flex-1 min-h-[300px]">
                                    <RichTextEditor
                                        value={composeBody}
                                        onChange={setComposeBody}
                                        placeholder="Escribe tu mensaje..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`p-4 border-t flex justify-end gap-3 rounded-b-2xl ${isDark ? 'bg-zinc-900/50 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}>
                            <button
                                onClick={() => setComposing(false)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSendNewEmail}
                                disabled={sending}
                                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                                {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {sending ? 'Enviando...' : 'Enviar Correo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
