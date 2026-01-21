'use client';

import { createClient } from '@/utils/supabase/client';
import { Mail, RefreshCw, Send, Trash2, Reply, Search, User, Paperclip } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/inbox/RichTextEditor';

interface Email {
    id: string;
    sender: string;
    recipient: string;
    subject: string;
    body_text: string;
    created_at: string;
    is_read: boolean;
}

export default function InboxPage() {
    const supabase = createClient();
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState(true);
    const [replying, setReplying] = useState(false);
    const [replyBody, setReplyBody] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchEmails();

        // Realtime Subscription
        const channel = supabase
            .channel('inbox_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'email_inbox' }, (payload) => {
                toast.success('¡Nuevo correo recibido!');
                fetchEmails();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchEmails = async () => {
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
    };

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
        } catch (error) {
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
        } catch (error) {
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

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-zinc-950 text-white rounded-2xl overflow-hidden border border-zinc-800 relative">
            {/* Sidebar List */}
            <div className={`flex-col bg-zinc-900/50 border-r border-zinc-800 md:flex w-full md:w-1/3 ${selectedEmail ? 'hidden' : 'flex'}`}>
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-400" />
                        Buzón
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setComposing(true)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
                            title="Redactar nuevo"
                        >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Redactar</span>
                        </button>
                        <button onClick={fetchEmails} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                            <RefreshCw className={`w-4 h-4 text-zinc-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {emails.length === 0 && !loading && (
                        <div className="p-8 text-center text-zinc-500">
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
                            className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-all hover:bg-zinc-800/50 ${selectedEmail?.id === email.id ? 'bg-zinc-800 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium ${!email.is_read ? 'text-white' : 'text-zinc-400'}`}>
                                    {email.sender}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {new Date(email.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className={`text-sm mb-1 truncate ${!email.is_read ? 'font-semibold text-indigo-200' : 'text-zinc-300'}`}>
                                {email.subject}
                            </h3>
                            <p className="text-xs text-zinc-500 line-clamp-2">
                                {getCleanBody(email.body_text)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email Detail View */}
            <div className={`flex-col bg-zinc-950 md:flex flex-1 ${selectedEmail ? 'flex' : 'hidden'}`}>
                {selectedEmail ? (
                    <>
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-zinc-800 bg-zinc-900/30">
                            <div className="flex flex-col gap-4">
                                {/* Mobile Back Button */}
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="md:hidden flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-2"
                                >
                                    ← Volver a la lista
                                </button>

                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h1 className="text-lg md:text-xl font-bold text-white break-words">{selectedEmail.subject}</h1>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">Inbox</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-white font-medium truncate">{selectedEmail.sender}</span>
                                                <span className="text-zinc-500 text-xs">{new Date(selectedEmail.created_at).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 transition-colors" title="Borrar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-4 md:p-8 overflow-y-auto font-sans text-zinc-300 leading-relaxed">
                            <div className="whitespace-pre-wrap word-break-break-word">
                                {getCleanBody(selectedEmail.body_text)}
                            </div>
                        </div>

                        {/* Reply Area */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                            {replying ? (
                                <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-5">
                                    <div className="p-3 bg-zinc-800/50 border-b border-zinc-700 flex justify-between items-center">
                                        <span className="text-sm font-medium text-zinc-300">Respondiendo a {selectedEmail.sender}</span>
                                        <button onClick={() => setReplying(false)} className="text-xs text-zinc-500 hover:text-white">Cancelar</button>
                                    </div>
                                    <div className="p-4 bg-zinc-950">
                                        <RichTextEditor
                                            value={replyBody}
                                            onChange={setReplyBody}
                                            placeholder="Escribe tu respuesta aquí..."
                                        />
                                    </div>
                                    <div className="p-3 bg-zinc-800/50 border-t border-zinc-700 flex justify-end gap-3">
                                        <button
                                            onClick={handleSendReply}
                                            disabled={sending || !replyBody.trim()}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {sending ? 'Enviando...' : 'Enviar Respuesta'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setReplying(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-semibold transition-colors w-full md:w-auto justify-center"
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
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-zinc-900 border border-zinc-700 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-full h-[90vh] animate-in zoom-in-95">
                        <div className="p-4 border-b border-zinc-700 flex justify-between items-center bg-zinc-900 rounded-t-xl">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-indigo-400" />
                                Nuevo Mensaje
                            </h3>
                            <button onClick={() => setComposing(false)} className="text-zinc-500 hover:text-white">
                                ✕
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Para</label>
                                <input
                                    type="email"
                                    value={composeTo}
                                    onChange={(e) => setComposeTo(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="ejemplo@cliente.com"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Asunto</label>
                                <input
                                    type="text"
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="Asunto del correo"
                                />
                            </div>
                            <div className="flex-1 flex flex-col">
                                <label className="block text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">Mensaje</label>
                                <div className="flex-1 min-h-[300px]">
                                    <RichTextEditor
                                        value={composeBody}
                                        onChange={setComposeBody}
                                        placeholder="Escribe tu mensaje..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-zinc-700 bg-zinc-900/50 rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setComposing(false)}
                                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSendNewEmail}
                                disabled={sending}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
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
