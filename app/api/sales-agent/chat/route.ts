import { NextRequest, NextResponse } from 'next/server';
import { openai, DEFAULT_MODEL, limitChatHistory, getCurrentDatePrompt, isWithinBusinessHours, parseJsonSafe } from '@/utils/ai-client';
import { createClient } from '@supabase/supabase-js';

// ===========================================
// CHATBOT H0 - AGENTE DE VENTAS HOJACERO
// Modelo: gpt-4o-mini (OpenAI)
// ===========================================

// Cliente Supabase admin
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ===========================================
// SYSTEM PROMPT - IDENTIDAD DEL BOT
// ===========================================
const SYSTEM_PROMPT = `
Eres el asistente de ventas de HojaCero, una agencia de diseño web y marketing digital chilena.

## TU PERSONALIDAD
- Tono: Semiformal, seguro, con actitud de "nosotros lo resolvemos"
- Idioma: Solo español (Chile)
- Estilo: Joven pero profesional, nunca desesperado ni vendedor agresivo

## SERVICIOS Y PRECIOS
- Sitio web estático/landing: $150 USD
- Mantención: Variable según el proyecto (no detallar, solo mencionar que existe)
- Objetivo: Cerrar clientes con recurrencia mensual

## HORARIO DE ATENCIÓN
- Lunes a Viernes: 11:00 - 19:00 (Chile)
- Fuera de horario: Ofrecer agendar para el día siguiente
- Madrugada: Agendar para mañana

## DERIVACIONES
- Temas de DESARROLLO/WEB → Derivar a Daniel
- Temas de MARKETING/ADS → Derivar a Gastón
- SIEMPRE pedir antes: Nombre, Empresa, WhatsApp (NO teléfono fijo)

## RESPUESTAS ESPECÍFICAS
- Si preguntan por la competencia: "Nos consideramos tope de línea en diseño e implementación. Nuestros proyectos funcionando nos avalan."
- Si piden precios detallados de proyectos complejos: Sugerir agendar una llamada
- Si la web del prospecto es buena: Felicitarlos genuinamente, buscar otras oportunidades (SEO, Ads, App)

## CAPACIDADES
1. Puedes diagnosticar sitios web de prospectos
2. Puedes verificar disponibilidad en la agenda
3. Puedes agendar reuniones
4. Puedes guardar leads en el CRM
5. Puedes escalar a Daniel (dev) o Gastón (mkt) cuando sea necesario

## FLUJO IDEAL
1. Saludo cálido → Preguntar en qué podemos ayudar
2. Entender necesidad → ¿Necesitan web nueva? ¿Mejorar la actual? ¿Marketing?
3. Si tienen URL → Ofrecer diagnóstico gratuito
4. Presentar valor → Hook basado en sus pain points
5. Cerrar → Agendar llamada o derivar según corresponda

## IMPORTANTE
- NUNCA inventes información técnica que no tengas
- Si no sabes algo, ofrece conectar con el equipo humano
- Sé conciso, la gente no lee párrafos largos en chat
`;

// ===========================================
// TOOLS - FUNCTION CALLING
// ===========================================
const SALES_TOOLS = [
    {
        type: 'function' as const,
        function: {
            name: 'diagnose_website',
            description: 'Analiza un sitio web y devuelve un diagnóstico técnico y de diseño. Usar cuando el prospecto comparta su URL.',
            parameters: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        description: 'URL del sitio web a analizar (ej: https://ejemplo.cl)'
                    }
                },
                required: ['url']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'check_availability',
            description: 'Verifica disponibilidad en la agenda para agendar una reunión.',
            parameters: {
                type: 'object',
                properties: {
                    date: {
                        type: 'string',
                        description: 'Fecha en formato YYYY-MM-DD'
                    },
                    requested_hour: {
                        type: 'string',
                        description: 'Hora preferida en formato HH:MM (opcional)'
                    }
                },
                required: ['date']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'book_meeting',
            description: 'Agenda una reunión con el prospecto. REQUIERE que el prospecto haya dado: nombre, empresa y WhatsApp.',
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'Fecha YYYY-MM-DD' },
                    start_time: { type: 'string', description: 'Hora HH:MM' },
                    attendee_name: { type: 'string', description: 'Nombre del prospecto' },
                    attendee_phone: { type: 'string', description: 'WhatsApp del prospecto' },
                    attendee_email: { type: 'string', description: 'Email del prospecto (opcional)' },
                    empresa: { type: 'string', description: 'Nombre de la empresa' },
                    notes: { type: 'string', description: 'Notas sobre la reunión' },
                    duration_minutes: { type: 'number', description: 'Duración en minutos (default 30)' }
                },
                required: ['date', 'start_time', 'attendee_name', 'attendee_phone', 'empresa']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'save_lead',
            description: 'Guarda un lead en el CRM. Usar cuando se tiene info valiosa del prospecto.',
            parameters: {
                type: 'object',
                properties: {
                    nombre: { type: 'string', description: 'Nombre de la empresa o negocio' },
                    nombre_contacto: { type: 'string', description: 'Nombre de la persona de contacto' },
                    telefono: { type: 'string', description: 'WhatsApp de contacto' },
                    email: { type: 'string', description: 'Email de contacto' },
                    sitio_web: { type: 'string', description: 'URL del sitio web' },
                    notas: { type: 'string', description: 'Contexto de la conversación' }
                },
                required: ['nombre']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'escalate_to_human',
            description: 'Escala la conversación a un humano. Usar para: consultas complejas, urgencias, o cuando el prospecto lo pida.',
            parameters: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        enum: ['development', 'marketing'],
                        description: 'development = Daniel, marketing = Gastón'
                    },
                    client_name: { type: 'string', description: 'Nombre del prospecto' },
                    client_phone: { type: 'string', description: 'WhatsApp del prospecto' },
                    empresa: { type: 'string', description: 'Empresa del prospecto' },
                    reason: { type: 'string', description: 'Razón del escalamiento' },
                    summary: { type: 'string', description: 'Resumen de la conversación' },
                    urgency: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Nivel de urgencia' }
                },
                required: ['type', 'client_name', 'client_phone', 'empresa', 'reason']
            }
        }
    }
];

// ===========================================
// TOOL HANDLERS
// ===========================================
async function executeTool(name: string, args: any, sessionId: string | null): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    switch (name) {
        case 'diagnose_website': {
            try {
                // Importar funciones de radar dinámicamente
                const { scrapeContactInfo, analyzeLeadWithOpenAI } = await import('@/utils/radar');

                const scraped = await scrapeContactInfo(args.url);
                const mockPlace = { title: 'Sitio Analizado', website: args.url, category: 'General' };
                const analysis = await analyzeLeadWithOpenAI(mockPlace, scraped);

                const painPoints = analysis.salesStrategy?.painPoints || analysis.painPoints || [];
                const hook = analysis.salesStrategy?.hook || '';

                return JSON.stringify({
                    success: true,
                    url: args.url,
                    score: analysis.score,
                    verdict: analysis.verdict || (analysis.score > 60 ? 'CONTACTAR' : 'REVISAR'),
                    hasSSL: scraped.hasSSL,
                    painPoints: painPoints.slice(0, 3),
                    hook: hook,
                    recommendation: analysis.salesStrategy?.proposedSolution || analysis.suggestedSolution
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: 'No pude analizar el sitio. ¿La URL está correcta?' });
            }
        }

        case 'check_availability': {
            try {
                const url = new URL('/api/agenda/availability', baseUrl);
                url.searchParams.set('date', args.date);
                if (args.requested_hour) url.searchParams.set('hour', args.requested_hour);

                const res = await fetch(url.toString());
                const data = await res.json();

                if (!data.success) {
                    return JSON.stringify({ success: false, error: data.error });
                }

                const slots = data.slots?.slice(0, 6).map((s: any) =>
                    new Date(s.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                ) || [];

                return JSON.stringify({
                    success: true,
                    date: args.date,
                    availableSlots: slots,
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

                const res = await fetch(`${baseUrl}/api/agenda/events`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: `Reunión con ${args.attendee_name} (${args.empresa})`,
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

                return JSON.stringify({
                    success: true,
                    message: `¡Reunión agendada! ${args.date} a las ${args.start_time}`,
                    eventId: data.event?.id
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'save_lead': {
            try {
                const { data: lead, error } = await supabaseAdmin.from('leads').insert({
                    nombre: args.nombre,
                    nombre_contacto: args.nombre_contacto || null,
                    email: args.email || null,
                    telefono: args.telefono || null,
                    sitio_web: args.sitio_web || null,
                    estado: 'ready_to_contact',
                    fuente: 'chat_bot',
                    zona_busqueda: 'Chat H0',
                    source_data: { notas: args.notas, chat_origin: true, session_id: sessionId }
                }).select().single();

                if (error) throw error;

                return JSON.stringify({ success: true, message: 'Lead guardado', leadId: lead.id });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'escalate_to_human': {
            try {
                const recipient = args.type === 'development' ? 'daniel' : 'gaston';

                // Enviar notificación por email
                await fetch(`${baseUrl}/api/sales-agent/notify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: args.type === 'development' ? 'dev_escalation' : 'mkt_escalation',
                        sessionId,
                        recipient,
                        message: `🔥 Escalamiento ${args.type.toUpperCase()}: ${args.client_name} (${args.empresa}) - ${args.client_phone}. Razón: ${args.reason}`,
                        context: {
                            summary: args.summary,
                            reason: args.reason,
                            urgency: args.urgency,
                            empresa: args.empresa
                        }
                    })
                });

                const contactName = args.type === 'development' ? 'Daniel' : 'Gastón';

                return JSON.stringify({
                    success: true,
                    message: `Perfecto, ${contactName} ha sido notificado y te contactará pronto por WhatsApp.`
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        default:
            return JSON.stringify({ error: 'Herramienta no reconocida' });
    }
}

// ===========================================
// MAIN HANDLER
// ===========================================
export async function POST(req: NextRequest) {
    try {
        const { messages, sessionId: clientSessionId } = await req.json();

        // Verificar horario de atención
        const { inHours, message: outOfHoursMessage } = isWithinBusinessHours();

        // Crear o recuperar sesión
        let sessionId: string | null = clientSessionId || null;
        if (!sessionId) {
            try {
                const { data: newSession } = await supabaseAdmin.from('sales_agent_sessions').insert({
                    session_key: `session-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                    first_message_at: new Date().toISOString(),
                    last_message_at: new Date().toISOString(),
                    messages_count: messages.length
                }).select().single();
                sessionId = newSession?.id;
            } catch {
                // Continuar sin persistencia
            }
        }

        // Guardar mensaje del usuario
        if (sessionId && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'user') {
                try {
                    await supabaseAdmin.from('sales_agent_messages').insert({
                        session_id: sessionId,
                        role: 'user',
                        content: lastMsg.content
                    });
                } catch { }
            }
        }

        // Construir conversación con límite de historial (6 mensajes max)
        const limitedMessages = limitChatHistory(messages, 6);

        // System prompt con fecha y estado de horario
        let systemContent = SYSTEM_PROMPT + '\n\n' + getCurrentDatePrompt();
        if (!inHours) {
            systemContent += `\n\n⚠️ FUERA DE HORARIO: ${outOfHoursMessage} Si el prospecto quiere agendar, ofrece horarios para el próximo día hábil.`;
        }

        const conversation = [
            { role: 'system' as const, content: systemContent },
            ...limitedMessages
        ];

        // Llamar a OpenAI
        const response = await openai.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: conversation as any,
            tools: SALES_TOOLS,
            tool_choice: 'auto',
            max_tokens: 800,
            temperature: 0.7
        });

        const assistantMessage = response.choices[0].message;
        let finalContent = assistantMessage.content || '';
        let toolsUsed: string[] = [];

        // Procesar tool calls si existen
        if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
            const toolResults: any[] = [];

            for (const toolCall of assistantMessage.tool_calls as any[]) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);

                toolsUsed.push(toolName);
                const result = await executeTool(toolName, toolArgs, sessionId);

                toolResults.push({
                    role: 'tool' as const,
                    tool_call_id: toolCall.id,
                    content: result
                });

                // Guardar resultado de tool
                if (sessionId) {
                    try {
                        await supabaseAdmin.from('sales_agent_messages').insert({
                            session_id: sessionId,
                            role: 'tool',
                            content: result,
                            tool_name: toolName,
                            tool_result: parseJsonSafe(result, {})
                        });
                    } catch { }
                }
            }

            // Segunda llamada para obtener respuesta final
            const finalResponse = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: [
                    ...conversation,
                    { role: 'assistant', content: assistantMessage.content || '', tool_calls: assistantMessage.tool_calls },
                    ...toolResults
                ],
                max_tokens: 600,
                temperature: 0.7
            });

            finalContent = finalResponse.choices[0].message.content || '';
        }

        // Guardar respuesta del asistente
        if (sessionId) {
            try {
                await supabaseAdmin.from('sales_agent_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: finalContent
                });

                await supabaseAdmin.from('sales_agent_sessions').update({
                    last_message_at: new Date().toISOString(),
                    messages_count: messages.length + 1
                }).eq('id', sessionId);
            } catch { }
        }

        return NextResponse.json({
            success: true,
            message: finalContent,
            sessionId,
            toolsUsed
        });

    } catch (error: any) {
        console.error('Sales Agent Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Error interno del servidor'
        }, { status: 500 });
    }
}
