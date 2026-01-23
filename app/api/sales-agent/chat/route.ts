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
    tool_name?: string;
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
                // Validación estricta de URL para evitar cuellos de botella por alucinación
                const url = args.url?.trim();
                if (!url || !url.includes('.') || url.length < 4) {
                    return JSON.stringify({ error: 'URL inválida o no proporcionada. Por favor, pide la URL al usuario.' });
                }

                const contactInfo = await scrapeContactInfo(url, true); // true = fastMode para el bot

                // Si el scraper falla (no encuentra nada de nada), avisar para no procesar con IA
                if (!contactInfo.scrapedPages.length) {
                    return JSON.stringify({ error: 'No pude acceder a ese sitio. Verifica que la URL sea correcta y accesible.' });
                }

                const mockPlace = {
                    title: url.replace(/^https?:\/\//, '').split('/')[0],
                    website: url
                };

                const analysis = await analyzeLeadWithGroq(mockPlace, contactInfo);

                if (sessionId) {
                    await supabase.from('sales_agent_sessions').update({
                        detected_url: args.url,
                        detected_tech: contactInfo.techStack
                    }).eq('id', sessionId);
                }

                // Retornamos el objeto completo de la IA + tech stack
                return JSON.stringify({
                    ...analysis,
                    techStack: contactInfo.techStack,
                    hasSSL: contactInfo.hasSSL,
                    url: args.url
                });
            } catch (error: any) {
                return JSON.stringify({ error: `Error analizando sitio: ${error.message}` });
            }
        }

        case 'save_lead': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });

                // Mapeo flexible de parámetros para evitar errores de alucinación del modelo
                const nombre = args.nombre || args.client_name || args.nombre_contacto || 'Cliente Interesado';
                const telefono = args.telefono || args.whatsapp || args.client_phone || '';

                const { error } = await supabase.from('sales_agent_sessions').update({
                    customer_name: nombre,
                    customer_whatsapp: telefono,
                    customer_email: args.email || args.client_email,
                    customer_notes: args.notas || args.summary,
                    last_active_at: new Date().toISOString()
                }).eq('id', sessionId);

                if (error) {
                    console.error("Save Lead DB Error:", error);
                    return JSON.stringify({ error: "Error de base de datos" });
                }

                await trackEvent(supabase, sessionId, 'lead_captured', { name: nombre });
                return JSON.stringify({ success: true, message: 'Lead guardado con éxito' });
            } catch (error: any) {
                console.error("Save Lead Exception:", error);
                return JSON.stringify({ error: 'Error procesando solicitud' });
            }
        }

        case 'check_availability': {
            try {
                const queryParams = new URLSearchParams();
                if (args.date) queryParams.append('date', args.date);
                if (args.requested_hour) queryParams.append('hour', args.requested_hour);

                const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/agenda/availability?${queryParams.toString()}`);
                const data = await res.json();
                return JSON.stringify(data);
            } catch (error: any) {
                return JSON.stringify({ error: 'Error consultando disponibilidad' });
            }
        }

        case 'book_meeting': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });

                // Construir las fechas de inicio y fin
                const startTime = `${args.date}T${args.start_time}:00`;
                const startTimeDate = new Date(startTime);
                const endTimeDate = new Date(startTimeDate.getTime() + (args.duration_minutes || 30) * 60000);

                const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/agenda/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: args.title || `Reunión con ${args.attendee_name}`,
                        start_time: startTimeDate.toISOString(),
                        end_time: endTimeDate.toISOString(),
                        description: args.notes || 'Agendado por el bot H0',
                        attendee_name: args.attendee_name,
                        attendee_email: args.attendee_email,
                        attendee_phone: args.attendee_phone,
                        source: 'chat_bot',
                        status: 'confirmed'
                    })
                });
                const data = await res.json();
                if (data.success) {
                    await trackEvent(supabase, sessionId, 'meeting_booked', { date: args.date, time: args.start_time });
                }
                return JSON.stringify(data);
            } catch (error: any) {
                console.error("Book Meeting Error:", error);
                return JSON.stringify({ error: 'Error agendando reunión' });
            }
        }

        case 'escalate_to_human': {
            try {
                if (!sessionId) return JSON.stringify({ error: 'No session id' });

                // Filtro de Calidad: Notificar si es medium/high O si el cliente pidió explícitamente hablar con humano
                const isUrgent = args.urgency === 'medium' || args.urgency === 'high' || args.urgency === 'low';

                if (isUrgent) {
                    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sales-agent/notify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'hot_lead',
                            sessionId,
                            message: `🔥 Cliente solicita hablar con humano: ${args.reason || 'No especificado'}`,
                            context: args
                        })
                    });
                }

                await trackEvent(supabase, sessionId, 'human_escalation', { reason: args.reason, urgency: args.urgency, notified: isUrgent });
                return JSON.stringify({ success: true, message: 'Daniel ha sido notificado y revisará tu caso pronto.' });
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
            const { data: newSession, error: sErr } = await supabase.from('sales_agent_sessions').insert({
                session_key: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                status: 'active'
            }).select().single();
            if (sErr) console.error("Session Create Error:", sErr);
            sessionId = newSession?.id || null;
        }

        // --- INICIO: Guardián de Bienvenida ---
        // Si no hay mensajes o el primer mensaje es vacío, devolvemos saludo directo
        // Esto evita que la IA intente llamar a herramientas "altiro" al cargar/refrescar
        if (!messages || messages.length === 0 || (messages.length === 1 && !messages[0].content)) {
            const greeting = "¡Hola! 👋 Bienvenido a HojaCero. Soy tu asistente virtual. ¿En qué te puedo ayudar hoy? Si quieres, puedo analizar tu sitio web o agendar una cita con Daniel.";

            if (sessionId) {
                await supabase.from('sales_agent_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: greeting
                });
            }

            return NextResponse.json({
                success: true,
                message: greeting,
                sessionId,
                toolsUsed: [],
                newMessages: []
            });
        }
        // --- FIN: Guardián de Bienvenida ---

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
            const toolPromises = assistantMessage.tool_calls.map(async (toolCall) => {
                toolsUsed.push(toolCall.function.name);
                const result = await executeTool(
                    toolCall.function.name,
                    JSON.parse(toolCall.function.arguments),
                    sessionId
                );

                const toolMsg: ChatMessage = {
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: result,
                    tool_name: toolCall.function.name
                };

                // Save tool result to DB
                if (sessionId) {
                    await supabase.from('sales_agent_messages').insert({
                        session_id: sessionId,
                        role: 'tool',
                        content: result,
                        tool_name: toolCall.function.name,
                        tool_result: JSON.parse(result)
                    });
                }

                return toolMsg;
            });

            toolResults = await Promise.all(toolPromises);

            // Get final response - filter out custom properties like tool_name for Groq API
            const finalResponse = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile', // Upgrade model for better reasoning after tools
                messages: [
                    ...conversation,
                    assistantMessage,
                    ...toolResults.map(tr => ({
                        role: 'tool',
                        tool_call_id: tr.tool_call_id,
                        content: tr.content
                    }))
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

        // Limpieza de respuesta final - capturar TODOS los formatos de función
        let cleanedMessage = finalContent
            .replace(/<function=[^>]*>/gi, '')                    // <function=xxx> sin cierre
            .replace(/<function=.*?\/function>/gi, '')            // <function=xxx/function> con cierre
            .replace(/<\/function>/gi, '')                        // </function> suelto
            .replace(/\{"attendee_name":[^}]+\}/gi, '')            // JSON de book_meeting
            .replace(/\{"url":[^}]+\}/gi, '')                      // JSON de diagnose
            .replace(/\{"nombre":[^}]+\}/gi, '')                   // JSON de save_lead
            .replace(/\{"success":true[^}]*\}/gi, '')              // Confirmaciones JSON
            .replace(/\(Fue escalado[^)]*\)/gi, '')                // (Fue escalado a Daniel)
            .replace(/```json[\s\S]*?```/gi, '')                   // Bloques de código JSON
            .replace(/tool_name>\{.*?\}/gi, '')                    // Fugas de tool_name
            .trim();

        // Fallback de seguridad: Si la limpieza borró todo, devolver un mensaje genérico en lugar de nada
        if (!cleanedMessage && toolsUsed.length > 0) {
            cleanedMessage = "He analizado tu sitio. ¿Te gustaría ver los detalles o agendar una llamada?";
        } else if (!cleanedMessage) {
            cleanedMessage = "Disculpa, tuve un lapsus. ¿Me podrías repetir eso?";
        }

        return NextResponse.json({
            success: true,
            message: cleanedMessage,
            sessionId,
            toolsUsed,
            newMessages: toolResults.length > 0 ? [
                ...toolResults.map(tr => ({ role: 'tool', content: tr.content, tool_name: tr.tool_name })),
                { role: 'assistant', content: cleanedMessage }
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
