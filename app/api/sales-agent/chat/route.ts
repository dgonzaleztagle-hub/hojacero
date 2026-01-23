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
# IDENTIDAD
Eres H0, el asistente de HojaCero, agencia de diseño web premium en Chile.
Hablas como un amigo que sabe de tecnología, no como vendedor agresivo.

# REGLAS DE ORO
1. **NUNCA pidas datos que ya tienes** - Revisa los DATOS CAPTURADOS antes de preguntar
2. **Respuestas cortas** - Máximo 3 oraciones por mensaje
3. **No uses jerga técnica** - "Tu sitio carga lento" en vez de "TTFB de 2s"
4. **Sé honesto** - Si el sitio está bien, dilo. No inventes problemas.
5. **NUNCA menciones herramientas, funciones, JSON o errores técnicos** - Eres un humano
6. **NUNCA confirmes reunión sin que book_meeting retorne éxito**

# FLUJO DE CONVERSACIÓN

## SI ES CLIENTE HOJACERO (diagnose_website responde con isHojaCeroClient: true)
- Di: "¡Hola! Veo que ya eres cliente de HojaCero, me da gusto 👋 ¿En qué te puedo ayudar?"
- NO ofrezcas rediseño
- Si necesitan algo, pide WhatsApp y deriva a Daniel

## SI TIENE TIENDA ONLINE (opportunityType: 'ecommerce')
- Di: "Veo que tienes tienda online. Proyectos de e-commerce requieren un enfoque personalizado."
- Ofrece agendar llamada con Daniel (proyectos custom)
- NO ofrezcas landing de $150

## SI TIENE WEBAPP/BACKEND (opportunityType: 'webapp')  
- Di: "Tu sitio tiene funcionalidades avanzadas. Esto requiere un análisis más profundo."
- Ofrece agendar llamada con Daniel
- NO ofrezcas landing de $150

## SI ES SITIO MODERNO (opportunityType: 'modern')
- Di: "Tu sitio se ve muy bien, moderno y profesional. ¿Hay algo específico que quieras mejorar?"
- NO empujes si no hay necesidad real
- Si quieren algo, ofrece mantención ($30 USD/mes)

## SI ES SITIO SIMPLE/ANTICUADO (opportunityType: 'landing')
- Menciona 1-2 observaciones específicas (no técnicas)
- Ofrece diagnóstico o rediseño desde $300 USD

## SI NO TIENE SITIO
- Pregunta: "¿Es un negocio nuevo o ya tienen presencia en otro lado (Instagram, etc)?"
- Ofrece landing $150 USD como primera opción

# DERIVACIONES DIRECTAS
- **Quiere campaña de Instagram/Facebook/Ads/Marketing** → Deriva a GASTÓN
- **Quiere SEO, posicionamiento, publicidad** → Deriva a GASTÓN
- **Quiere desarrollo, web, app, sistema** → Deriva a DANIEL
- SIEMPRE captura WhatsApp ANTES de derivar
- Usa escalate_to_human con type: 'marketing' para Gastón, 'development' para Daniel

# SERVICIOS Y PRECIOS (usa cuando pregunten)
- Landing simple: $150 USD (todo incluido)
- Rediseño: desde $300 USD
- E-commerce: Consultar (proyecto custom)
- Mantención: $30 USD/mes

# HERRAMIENTAS
- diagnose_website: Analiza una URL. SIEMPRE di "Dame un momento, déjame revisar tu sitio..." ANTES de usarla.
- save_lead: Guarda contacto (usar cuando tengas nombre + WhatsApp)
- check_availability: Ver horarios disponibles para una fecha
- book_meeting: Agendar reunión (solo si check_availability funcionó)
- escalate_to_human: Derivar a Daniel (development) o Gastón (marketing)

# IMPORTANTE
- Si algo falla, di: "Déjame tus datos y te contactamos directamente"
- NUNCA digas "la herramienta falló" o similar
- Si el usuario se resiste a dar WhatsApp después de 2 intentos, no insistas más
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

                // Si es cliente HojaCero, retornar inmediatamente sin análisis
                if (scraped.isHojaCeroClient) {
                    // Actualizar sesión con el sitio web
                    if (sessionId) {
                        await supabaseAdmin.from('sales_agent_sessions').update({
                            prospect_website: args.url,
                            diagnosed_url: args.url
                        }).eq('id', sessionId);
                    }

                    return JSON.stringify({
                        success: true,
                        url: args.url,
                        isHojaCeroClient: true,
                        message: 'Este sitio fue creado por HojaCero. Es un cliente existente.',
                        suggestion: 'Pregunta amablemente en qué puedes ayudarle hoy.'
                    });
                }

                // Determinar tipo de oportunidad
                let opportunityType = 'landing'; // default
                if (scraped.hasStore) opportunityType = 'ecommerce';
                else if (scraped.hasBackend) opportunityType = 'webapp';
                else if (scraped.techStack.includes('Next.js') || scraped.techStack.includes('React')) opportunityType = 'modern';

                const mockPlace = { title: 'Sitio Analizado', website: args.url, category: 'General' };
                const analysis = await analyzeLeadWithOpenAI(mockPlace, scraped);

                const painPoints = analysis.salesStrategy?.painPoints || analysis.painPoints || [];

                // Actualizar sesión con el sitio web analizado
                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        prospect_website: args.url,
                        diagnosed_url: args.url,
                        diagnosis_score: analysis.score
                    }).eq('id', sessionId);
                }

                return JSON.stringify({
                    success: true,
                    url: args.url,
                    isHojaCeroClient: false,
                    opportunityType, // 'landing' | 'ecommerce' | 'webapp' | 'modern'
                    hasStore: scraped.hasStore,
                    hasBackend: scraped.hasBackend,
                    hasSSL: scraped.hasSSL,
                    techStack: scraped.techStack,
                    painPoints: painPoints.slice(0, 2),
                    observation: analysis.salesStrategy?.hook || analysis.analysisReport || '',
                    vibe: analysis.vibe || 'Desconocido',
                    // Para el bot: sugerencias de cómo hablarle
                    conversationHints: {
                        isModern: opportunityType === 'modern',
                        needsCustomProject: opportunityType === 'ecommerce' || opportunityType === 'webapp',
                        canOfferLanding: opportunityType === 'landing'
                    }
                });
            } catch (err: any) {
                console.error('diagnose_website error:', err);
                return JSON.stringify({ success: false, error: 'No pude analizar el sitio. ¿La URL está correcta?' });
            }
        }

        case 'check_availability': {
            try {
                // Usar Supabase directamente en vez de fetch HTTP (evita error en producción)
                const dateParam = args.date; // YYYY-MM-DD
                const dayStart = `${dateParam}T00:00:00`;
                const dayEnd = `${dateParam}T23:59:59`;

                const { data: events, error } = await supabaseAdmin
                    .from('agenda_events')
                    .select('start_time, end_time')
                    .gte('start_time', dayStart)
                    .lte('start_time', dayEnd)
                    .neq('status', 'cancelled');

                if (error) {
                    return JSON.stringify({ success: false, error: error.message });
                }

                // Generar slots disponibles (9 AM - 6 PM, cada 30 min)
                const WORK_START = 9, WORK_END = 18, SLOT_DURATION = 30;
                const bookedRanges = events?.map(e => ({
                    start: new Date(e.start_time).getTime(),
                    end: new Date(e.end_time).getTime()
                })) || [];

                const availableSlots: string[] = [];
                for (let hour = WORK_START; hour < WORK_END; hour++) {
                    for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
                        const slotStart = new Date(`${dateParam}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
                        const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60 * 1000);

                        const isBooked = bookedRanges.some(range =>
                            (slotStart.getTime() >= range.start && slotStart.getTime() < range.end) ||
                            (slotEnd.getTime() > range.start && slotEnd.getTime() <= range.end)
                        );
                        const isPast = slotStart.getTime() < Date.now();

                        if (!isBooked && !isPast) {
                            availableSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
                        }
                    }
                }

                return JSON.stringify({
                    success: true,
                    date: args.date,
                    availableSlots: availableSlots.slice(0, 6),
                    totalAvailable: availableSlots.length
                });
            } catch (err: any) {
                console.error('check_availability error:', err);
                return JSON.stringify({
                    success: false,
                    error: err.message,
                    fallbackMessage: 'Déjame tu WhatsApp y te confirmo el horario manualmente'
                });
            }
        }

        case 'book_meeting': {
            try {
                const duration = args.duration_minutes || 30;
                const startDateTime = new Date(`${args.date}T${args.start_time}:00`);
                const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);

                // Usar Supabase directamente en vez de fetch HTTP
                const { data: newEvent, error } = await supabaseAdmin.from('agenda_events').insert({
                    title: `Reunión con ${args.attendee_name} (${args.empresa})`,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    attendee_name: args.attendee_name,
                    attendee_phone: args.attendee_phone,
                    attendee_email: args.attendee_email || null,
                    notes: args.notes || null,
                    source: 'chat_bot',
                    event_type: 'meeting',
                    status: 'confirmed'
                }).select().single();

                if (error) {
                    console.error('book_meeting error:', error);
                    return JSON.stringify({
                        success: false,
                        error: error.message,
                        fallbackMessage: 'No pude agendar automáticamente. Déjame tus datos y te confirmamos'
                    });
                }

                return JSON.stringify({
                    success: true,
                    message: `¡Reunión agendada! ${args.date} a las ${args.start_time}`,
                    eventId: newEvent?.id
                });
            } catch (err: any) {
                console.error('book_meeting exception:', err);
                return JSON.stringify({
                    success: false,
                    error: err.message,
                    fallbackMessage: 'Hubo un problema técnico. Te contactamos para confirmar'
                });
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
                    pipeline_stage: 'radar',
                    fuente: 'chat_bot',
                    zona_busqueda: 'Chat H0',
                    source_data: { notas: args.notas, chat_origin: true, session_id: sessionId }
                }).select().single();

                if (error) throw error;

                // Actualizar la sesión con los datos del prospecto para memoria persistente
                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        lead_id: lead.id,
                        prospect_name: args.nombre_contacto || args.nombre,
                        prospect_phone: args.telefono,
                        prospect_company: args.nombre,
                        prospect_website: args.sitio_web
                    }).eq('id', sessionId);
                }

                return JSON.stringify({ success: true, message: 'Lead guardado', leadId: lead.id });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'escalate_to_human': {
            try {
                // Validar que tenga WhatsApp antes de escalar
                const phone = args.client_phone?.replace(/\D/g, '');
                if (!phone || phone.length < 9) {
                    return JSON.stringify({
                        success: false,
                        error: 'NEED_WHATSAPP',
                        message: 'Para contactarte necesito tu número de WhatsApp. ¿Me lo pasas?'
                    });
                }

                const recipient = args.type === 'development' ? 'daniel' : 'gaston';
                const contactName = args.type === 'development' ? 'Daniel' : 'Gastón';
                const recipientEmail = args.type === 'development'
                    ? 'dgonzalez.tagle@gmail.com'
                    : 'gaston.jofre@gmail.com';

                const whatsappLink = `https://wa.me/${phone.startsWith('56') ? phone : '56' + phone}`;

                const context = {
                    client_name: args.client_name,
                    client_phone: phone,
                    empresa: args.empresa,
                    summary: args.summary,
                    reason: args.reason,
                    urgency: args.urgency,
                    whatsapp_link: whatsappLink
                };

                // 1. Guardar notificación en DB
                await supabaseAdmin.from('sales_notifications').insert({
                    type: args.type === 'development' ? 'dev_escalation' : 'mkt_escalation',
                    session_id: sessionId,
                    message: `🔥 ${args.client_name} (${args.empresa}) necesita ayuda`,
                    context,
                    status: 'pending'
                });

                // 2. Enviar email directo via Resend
                const RESEND_API_KEY = process.env.RESEND_API_KEY;
                if (RESEND_API_KEY) {
                    const emailSubject = args.type === 'development'
                        ? '💻 Escalamiento DEV - Prospecto Esperando'
                        : '📢 Escalamiento MKT - Prospecto Esperando';

                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${RESEND_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from: 'H0 Bot <bot@hojacero.cl>',
                            to: [recipientEmail],
                            subject: emailSubject,
                            html: `
                            <div style="font-family: sans-serif; padding: 20px;">
                                <h2 style="color: #0891b2;">🔥 Prospecto necesita atención</h2>
                                <p><strong>Cliente:</strong> ${args.client_name}</p>
                                <p><strong>Empresa:</strong> ${args.empresa || 'No especificada'}</p>
                                <p><strong>WhatsApp:</strong> ${phone}</p>
                                <p><strong>Razón:</strong> ${args.reason || 'Solicitud de contacto'}</p>
                                ${args.summary ? `<p><strong>Resumen:</strong> ${args.summary}</p>` : ''}
                                <br/>
                                <a href="${whatsappLink}" style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                                    📱 Contactar por WhatsApp
                                </a>
                            </div>
                            `
                        })
                    });
                }

                return JSON.stringify({
                    success: true,
                    message: `Perfecto, ${contactName} ha sido notificado y te contactará por WhatsApp en breve.`
                });
            } catch (err: any) {
                console.error('escalate_to_human error:', err);
                return JSON.stringify({
                    success: false,
                    error: err.message,
                    fallbackMessage: 'Hubo un problema al notificar. Déjame tus datos y te contactamos'
                });
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

        // ============================================
        // MEMORIA PERSISTENTE: Recuperar datos del prospecto
        // ============================================
        let prospectData: {
            prospect_name?: string;
            prospect_phone?: string;
            prospect_company?: string;
            prospect_website?: string;
        } = {};

        if (sessionId) {
            try {
                const { data: sessionData } = await supabaseAdmin
                    .from('sales_agent_sessions')
                    .select('prospect_name, prospect_phone, prospect_company, prospect_website')
                    .eq('id', sessionId)
                    .single();
                if (sessionData) prospectData = sessionData;
            } catch { }
        }

        // Construir conversación con límite de historial (6 mensajes max)
        const limitedMessages = limitChatHistory(messages, 6);

        // System prompt con fecha y estado de horario
        let systemContent = SYSTEM_PROMPT + '\n\n' + getCurrentDatePrompt();

        // Inyectar datos del prospecto si ya los tenemos
        if (prospectData.prospect_name || prospectData.prospect_phone || prospectData.prospect_company || prospectData.prospect_website) {
            systemContent += `

## 📋 DATOS YA CAPTURADOS DEL PROSPECTO (NO VOLVER A PEDIR)
${prospectData.prospect_name ? `- Nombre: ${prospectData.prospect_name}` : '- Nombre: NO CAPTURADO AÚN'}
${prospectData.prospect_phone ? `- WhatsApp: ${prospectData.prospect_phone}` : '- WhatsApp: NO CAPTURADO AÚN (IMPORTANTE: pídelo si aún no lo tienes)'}
${prospectData.prospect_company ? `- Empresa: ${prospectData.prospect_company}` : '- Empresa: NO CAPTURADA AÚN'}
${prospectData.prospect_website ? `- Sitio Web: ${prospectData.prospect_website}` : '- Sitio Web: NO CAPTURADO AÚN'}

⚠️ REGLA CRÍTICA: Si algún dato ya está capturado, NO lo vuelvas a pedir. Usa los datos que ya tienes.
`;
        }

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
