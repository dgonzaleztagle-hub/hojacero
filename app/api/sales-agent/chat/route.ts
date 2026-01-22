import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { SALES_AGENT_SYSTEM_PROMPT, SALES_TOOLS } from '@/utils/sales-agent/system-prompt';
import { createClient } from '@supabase/supabase-js';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

// Groq with Llama 3.1 8B (Massive limit: 14,400 requests/day)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: any[];
}

// Create a Supabase client for public chat operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper: Track conversion event
async function trackEvent(supabase: any, sessionId: string, eventType: string, eventData?: any) {
    if (!sessionId) return;
    try {
        await supabase.from('sales_agent_conversions').insert({
            session_id: sessionId,
            event_type: eventType,
            event_data: eventData
        });
    } catch (e) { console.error('Error tracking event:', e); }
}

// Tool execution handlers
async function executeTool(name: string, args: any, sessionId: string | null): Promise<string> {
    const supabase = supabaseAdmin;

    switch (name) {
        case 'diagnose_website': {
            try {
                if (!args.url) return JSON.stringify({ error: 'URL requerida' });
                const contactInfo = await scrapeContactInfo(args.url);
                const analysis = await analyzeLeadWithGroq(args.url, contactInfo);

                if (sessionId) {
                    await supabase.from('sales_agent_sessions').update({
                        detected_url: args.url,
                        detected_tech: analysis.techStack
                    }).eq('id', sessionId);
                }

                return JSON.stringify({
                    summary: analysis.summary,
                    recommendations: analysis.recommendations,
                    urgency: analysis.urgency,
                    techStack: analysis.techStack
                });
            } catch (error: any) {
                return JSON.stringify({ error: `Error analizando sitio: ${error.message}` });
            }
        }

        case 'save_lead': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });
                const { error } = await supabase.from('sales_agent_sessions').update({
                    customer_name: args.nombre,
                    customer_whatsapp: args.whatsapp,
                    customer_notes: args.notas,
                    last_active_at: new Date().toISOString()
                }).eq('id', sessionId);

                if (error) throw error;
                await trackEvent(supabase, sessionId, 'lead_captured', { name: args.nombre });
                return JSON.stringify({ success: true, message: 'Lead guardado correctamente' });
            } catch (error: any) {
                return JSON.stringify({ error: `Error guardando lead: ${error.message}` });
            }
        }

        case 'check_availability': {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/agenda/availability`);
                const data = await res.json();
                return JSON.stringify(data);
            } catch (error: any) {
                return JSON.stringify({ error: 'Error consultando disponibilidad' });
            }
        }

        case 'book_meeting': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });
                const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/agenda/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: `Reunión: ${args.nombre}`,
                        start: args.fecha_hora,
                        end: new Date(new Date(args.fecha_hora).getTime() + 20 * 60000).toISOString(),
                        description: `Agendado por Bot H0. Notas: ${args.notas || 'Sin notas'}`,
                        customer_name: args.nombre,
                        customer_email: args.email
                    })
                });
                const data = await res.json();
                if (data.success) {
                    await trackEvent(supabase, sessionId, 'meeting_booked', { date: args.fecha_hora });
                }
                return JSON.stringify(data);
            } catch (error: any) {
                return JSON.stringify({ error: 'Error agendando reunión' });
            }
        }

        case 'escalate_to_human': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });
                await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sales-agent/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'hot_lead',
                        sessionId,
                        message: `🔥 Cliente solicita hablar con humano: ${args.motivo || 'No especificado'}`,
                        context: args
                    })
                });
                await trackEvent(supabase, sessionId, 'human_escalation', { reason: args.motivo });
                return JSON.stringify({ success: true, message: 'Daniel ha sido notificado y te contactará pronto.' });
            } catch (error: any) {
                return JSON.stringify({ error: 'Error notificando al equipo' });
            }
        }

        default:
            return JSON.stringify({ error: 'Herramienta no reconocida' });
    }
}

export async function POST(req: NextRequest) {
    const supabase = supabaseAdmin;

    try {
        const { messages, sessionId: clientSessionId } = await req.json();

        // Get or create session
        let sessionId: string | null = clientSessionId;
        if (!sessionId) {
            const { data: newSession } = await supabase.from('sales_agent_sessions').insert({
                session_key: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                status: 'active'
            }).select().single();
            sessionId = newSession?.id || null;
        }

        // Save user message
        const lastMsg = messages[messages.length - 1];
        if (sessionId && lastMsg && lastMsg.role === 'user') {
            await supabase.from('sales_agent_messages').insert({
                session_id: sessionId,
                role: 'user',
                content: lastMsg.content
            });
        }

        // Build conversation with system prompt
        const conversation = [
            { role: 'system', content: SALES_AGENT_SYSTEM_PROMPT },
            ...messages
        ];

        // Call Groq with high-limit model
        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant', // High request limit: 14,400/day
            messages: conversation as any[],
            tools: SALES_TOOLS,
            tool_choice: 'auto',
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

                const toolMsg: ChatMessage = {
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: result
                };
                toolResults.push(toolMsg);

                // Save tool result
                if (sessionId) {
                    await supabase.from('sales_agent_messages').insert({
                        session_id: sessionId,
                        role: 'tool',
                        content: result,
                        tool_name: toolCall.function.name,
                        tool_result: JSON.parse(result)
                    });
                }
            }

            // Get final response
            const finalResponse = await groq.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [
                    ...conversation,
                    assistantMessage,
                    ...toolResults
                ] as any[],
                temperature: 0.7
            });
            finalContent = finalResponse.choices[0].message.content || '';
        }

        // Save assistant response
        if (sessionId && finalContent) {
            await supabase.from('sales_agent_messages').insert({
                session_id: sessionId,
                role: 'assistant',
                content: finalContent
            });

            await supabase.from('sales_agent_sessions').update({
                last_message_at: new Date().toISOString()
            }).eq('id', sessionId);
        }

        return NextResponse.json({
            success: true,
            message: finalContent.replace(/<function=.*?\/function>/gi, '').trim(),
            sessionId,
            toolsUsed,
            newMessages: toolResults.length > 0 ? [
                { role: 'assistant', content: assistantMessage.content || '', tool_calls: assistantMessage.tool_calls },
                ...toolResults
            ] : []
        });

    } catch (error: any) {
        console.error('Sales Agent Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            message: 'Tuvimos un problema técnico, pero Daniel ya fue avisado. ¿Podemos intentar de nuevo?'
        }, { status: 500 });
    }
}
