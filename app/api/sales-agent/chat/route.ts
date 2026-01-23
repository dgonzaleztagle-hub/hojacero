import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SALES_AGENT_SYSTEM_PROMPT, SALES_TOOLS } from '@/utils/sales-agent/system-prompt';
import { createClient } from '@supabase/supabase-js';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

// SiliconFlow API (compatible con OpenAI) - DeepSeek-V3.1-Nex-N1 con 1M tokens/min gratis
const siliconflow = new OpenAI({
    apiKey: process.env.SILICONFLOW_API_KEY,
    baseURL: 'https://api.siliconflow.cn/v1'
});

const CHAT_MODEL = 'nex-agi/DeepSeek-V3.1-Nex-N1';

// Cliente admin para operaciones del bot (sin cookies de usuario)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: any[];
}

// Helper: Track conversion event
async function trackEvent(sessionId: string, eventType: string, eventData?: any) {
    if (!sessionId) return;
    try {
        await supabaseAdmin.from('sales_agent_conversions').insert({
            session_id: sessionId,
            event_type: eventType,
            event_data: eventData
        });
    } catch (e) {
        console.error('Track event error:', e);
    }
}

// Tool execution handlers
async function executeTool(name: string, args: any, sessionId: string | null): Promise<string> {
    switch (name) {
        case 'diagnose_website': {
            try {
                if (sessionId) await trackEvent(sessionId, 'url_submitted', { url: args.url });

                const scraped = await scrapeContactInfo(args.url);
                const mockPlace = { title: 'Sitio Analizado', website: args.url, category: 'General' };
                const analysis = await analyzeLeadWithGroq(mockPlace, scraped);

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        diagnosed_url: args.url,
                        diagnosis_score: analysis.score
                    }).eq('id', sessionId);

                    await trackEvent(sessionId, 'diagnosis_complete', { score: analysis.score });
                }

                const painPoints = analysis.salesStrategy?.painPoints || analysis.painPoints || [];
                const hook = analysis.salesStrategy?.hook || '';

                return JSON.stringify({
                    success: true,
                    url: args.url,
                    score: analysis.score,
                    hasSSL: scraped.hasSSL,
                    techStack: scraped.techStack,
                    painPoints: painPoints.slice(0, 3),
                    hook: hook,
                    recommendation: analysis.salesStrategy?.proposedSolution || analysis.suggestedSolution
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'save_lead': {
            try {
                const telefono = args.telefono || null;
                const email = args.email || null;

                const { data: lead, error } = await supabaseAdmin.from('leads').insert({
                    nombre: args.nombre,
                    nombre_contacto: args.nombre_contacto || null,
                    email: email,
                    telefono: telefono,
                    sitio_web: args.sitio_web || null,
                    estado: 'ready_to_contact',
                    fuente: 'chat_bot',
                    zona_busqueda: 'Chat H0',
                    source_data: { notas: args.notas, chat_origin: true, session_id: sessionId }
                }).select().single();

                if (error) throw error;

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        lead_id: lead.id,
                        status: 'converted',
                        conversion_type: 'lead_captured'
                    }).eq('id', sessionId);

                    await trackEvent(sessionId, 'lead_saved', { lead_id: lead.id });
                }

                return JSON.stringify({ success: true, message: 'Lead guardado', leadId: lead.id });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'check_availability': {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const url = new URL('/api/agenda/availability', baseUrl);
                url.searchParams.set('date', args.date);
                if (args.requested_hour) {
                    url.searchParams.set('hour', args.requested_hour);
                }

                const res = await fetch(url.toString());
                const data = await res.json();

                if (!data.success) {
                    return JSON.stringify({ success: false, error: data.error });
                }

                return JSON.stringify({
                    success: true,
                    date: args.date,
                    availableSlots: data.slots?.slice(0, 6).map((s: any) =>
                        new Date(s.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                    ) || [],
                    totalAvailable: data.totalAvailable || 0
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'book_meeting': {
            try {
                const duration = args.duration_minutes || 30;
                const startDateTime = new Date(`${args.date}T${args.start_time}:00`);
                const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const res = await fetch(`${baseUrl}/api/agenda/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: args.title || `Reunión con ${args.attendee_name}`,
                        start_time: startDateTime.toISOString(),
                        end_time: endDateTime.toISOString(),
                        attendee_name: args.attendee_name,
                        attendee_phone: args.attendee_phone,
                        attendee_email: args.attendee_email,
                        notes: args.notes,
                        source: 'chat_bot',
                        event_type: 'meeting'
                    })
                });

                const data = await res.json();

                if (!data.success) {
                    return JSON.stringify({ success: false, error: data.error });
                }

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        status: 'converted',
                        conversion_type: 'meeting'
                    }).eq('id', sessionId);

                    await trackEvent(sessionId, 'meeting_booked', { date: args.date, time: args.start_time });
                }

                return JSON.stringify({
                    success: true,
                    message: `¡Reunión agendada! ${args.date} a las ${args.start_time}`,
                    eventId: data.event?.id
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'escalate_to_human': {
            try {
                // Enviar notificación por email
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                await fetch(`${baseUrl}/api/sales-agent/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'hot_lead',
                        sessionId,
                        message: `🔥 Escalamiento: ${args.client_name} (${args.client_phone || 'sin tel'}). Razón: ${args.reason}`,
                        context: { summary: args.summary, reason: args.reason, urgency: args.urgency }
                    })
                });

                // Log escalation
                await supabaseAdmin.from('sales_notifications').insert({
                    type: 'escalation',
                    session_id: sessionId,
                    message: `Escalado: ${args.client_name}`,
                    context: args,
                    status: 'pending'
                });

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        status: 'escalated',
                        escalation_reason: args.reason
                    }).eq('id', sessionId);
                }

                return JSON.stringify({
                    success: true,
                    message: 'Daniel ha sido notificado y te contactará pronto.'
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        default:
            return JSON.stringify({ error: 'Herramienta no reconocida' });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages, sessionId: clientSessionId } = await req.json();

        // Get or create session
        let sessionId: string | null = null;
        try {
            if (!clientSessionId) {
                const { data: newSession } = await supabaseAdmin.from('sales_agent_sessions').insert({
                    session_key: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    first_message_at: new Date().toISOString(),
                    last_message_at: new Date().toISOString(),
                    messages_count: messages.length
                }).select().single();

                sessionId = newSession?.id;
            } else {
                sessionId = clientSessionId;
            }
        } catch {
            // Continue without persistence
        }

        // Save incoming user message
        if (sessionId && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'user') {
                await supabaseAdmin.from('sales_agent_messages').insert({
                    session_id: sessionId,
                    role: 'user',
                    content: lastMsg.content
                });
            }
        }

        // Build conversation with system prompt
        const conversation: ChatMessage[] = [
            { role: 'system', content: SALES_AGENT_SYSTEM_PROMPT },
            ...messages
        ];

        // SiliconFlow con DeepSeek-V3.1-Nex-N1 (optimizado para agents y tool calling)
        const response = await siliconflow.chat.completions.create({
            model: CHAT_MODEL,
            messages: conversation as any[],
            tools: SALES_TOOLS,
            tool_choice: 'auto',
            max_tokens: 1024,
            temperature: 0.7
        });

        const assistantMessage = response.choices[0].message;
        let finalContent = assistantMessage.content || '';
        let toolsUsed: string[] = [];
        let toolResults: ChatMessage[] = [];

        // Check if tools were called
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            for (const toolCall of assistantMessage.tool_calls) {
                toolsUsed.push(toolCall.function.name);
                const result = await executeTool(
                    toolCall.function.name,
                    JSON.parse(toolCall.function.arguments),
                    sessionId
                );
                toolResults.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: result
                });

                // Save tool call
                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_messages').insert({
                        session_id: sessionId,
                        role: 'tool',
                        content: result,
                        tool_name: toolCall.function.name,
                        tool_result: JSON.parse(result)
                    });
                }
            }

            // Get final response with tool results
            const finalConversation: ChatMessage[] = [
                ...conversation,
                { role: 'assistant', content: assistantMessage.content || '', tool_calls: assistantMessage.tool_calls },
                ...toolResults
            ];

            const finalResponse = await siliconflow.chat.completions.create({
                model: CHAT_MODEL,
                messages: finalConversation as any[],
                max_tokens: 1024,
                temperature: 0.7
            });

            finalContent = finalResponse.choices[0].message.content || '';
        }

        // Save assistant response
        if (sessionId) {
            await supabaseAdmin.from('sales_agent_messages').insert({
                session_id: sessionId,
                role: 'assistant',
                content: finalContent
            });

            await supabaseAdmin.from('sales_agent_sessions').update({
                last_message_at: new Date().toISOString(),
                messages_count: messages.length + 1
            }).eq('id', sessionId);
        }

        return NextResponse.json({
            success: true,
            message: finalContent,
            sessionId,
            toolsUsed,
            newMessages: assistantMessage.tool_calls ? [
                { role: 'assistant', content: assistantMessage.content || '', tool_calls: assistantMessage.tool_calls },
                ...toolResults
            ] : []
        });

    } catch (error: any) {
        console.error('Sales Agent Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
