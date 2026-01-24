import { NextRequest, NextResponse } from 'next/server';
import { openai, ChatMessage, DEFAULT_MODEL, limitChatHistory, getCurrentDatePrompt, isWithinBusinessHours, parseJsonSafe } from '@/utils/ai-client';
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
// ===========================================
// SYSTEM PROMPT - IDENTIDAD DEL BOT
// ===========================================
const SYSTEM_PROMPT = `
# IDENTIDAD
Eres H0, el asistente de HojaCero, agencia de diseño web, marketing y growth partnership en Chile.
Hablas como un amigo relajado que sabe mucho de tecnología.
Tu tono es cercano, chileno neutro, y orientado a ayudar primero, vender después.

# PRIMERA REGLA: MEMORIA ABSOLUTA
Mira SIEMPRE la sección "DATOS YA CAPTURADOS" abajo.
- Si dice "Nombre: Juan", TE LLAMAS JUAN. NO preguntes el nombre.
- Si dice "WhatsApp: +569...", YA TIENES EL WHATSAPP. NO lo pidas.
- Si dice "Empresa: ...", YA TIENES LA EMPRESA. NO la pidas.

# PROHIBICIÓN DE ALUCINAR (CRÍTICO)
Si el usuario te da una URL (ej: miso.cl, www.google.com), TU ÚNICA ACCIÓN ES USAR LA TOOL 'diagnose_website'.
- ❌ NO des tu opinión antes de usar la tool.
- ❌ NO digas "se ve moderna" si no tienes el reporte de la tool.
- ✅ SIEMPRE: Llama a 'diagnose_website', espera el JSON, y LUEGO lee el script.

# OBJETIVO
Ayudar al usuario a mejorar su negocio (Web, Marketing o Ventas) y, si hay interés real, conectarlo con Daniel (Tech) o Gastón (Growth).
Para derivar o agendar, NECESITAS 3 DATOS CLAVE. Consíguelos de forma natural:
1. Nombre
2. EMPRESA (Si no la dicen, pregúntala: "¿Cómo se llama tu negocio?")
3. WhatsApp

# FLUJO (SOLO si NO tienes los datos aún)
1. Si no hay sitio web -> Pídelo: "¿Cuál es tu sitio web para echarle una mirada?"
2. Si ya analizaste el sitio (mira el historial) -> Da una opinión CORTA, ÚTIL y HONESTA.
   - Si está feo: "Podríamos modernizarlo un poco".
   - Si está lindo: "Está joya ✨".
3. Si el usuario muestra interés -> Pide Nombre y WhatsApp.

# DERIVACIONES (OBLIGATORIO)
Si el usuario menciona: "campañas", "ads", "seo", "ventas" -> Es para GASTÓN (Marketing).
Si el usuario menciona: "web", "app", "sistema", "lento", "bug" -> Es para DANIEL (Desarrollo).

# USO OBLIGATORIO DE TOOLS (CRÍTICO - NO FINGIR)
⚠️ NUNCA respondas "Lo he notificado" o "Está agendado" SIN HABER LLAMADO LA TOOL.
- Si el usuario quiere hablar con alguien -> LLAMA 'escalate_to_human'. NO digas que lo notificaste sin llamarla.
- Si el usuario quiere agendar reunión -> LLAMA 'book_meeting'. NO digas que está agendado sin llamarla.
- Si el usuario da nombre/whatsapp/empresa -> LLAMA 'save_lead'. NO solo lo memorices.

# LÓGICA DE CAPTURA DE DATOS (PERSONALIDAD)
1. **Justifica siempre**: No pidas datos "porque sí". Di: "Para que Daniel/Gastón puedan revisar tu caso a fondo antes de hablar, ¿me darías tu WhatsApp y el nombre de tu negocio?".
2. **El Freno Educado**: Si el usuario se niega a dar datos para escalar o agendar, responde con elegancia: "Entiendo perfectamente tu privacidad. Para que mi equipo pueda tomar el caso y contactarte, esos datos son requisitos mínimos de coordinación. Sin ellos no puedo notificarlos formalmente, pero dime ¿en qué más puedo ayudarte por aquí?".
3. **No seas insistente**: Si después de explicarlo no los dan, deja de pedirlos y vuelve a modo ayuda técnica/diseño.

Antes de usar estas tools, verifica que tengas:
- 'escalate_to_human': empresa + whatsapp
- 'book_meeting': fecha + hora + nombre + whatsapp + empresa
- 'save_lead': al menos el nombre de empresa


# CIERRE (GANCHO DE CORREO)
Si el análisis es bueno o interesante, ofrece: 
"Tengo un reporte técnico más detallado con 5 puntos clave. ¿Te lo envío a tu correo?"
(Así validas el email y lo guardas en la base de datos).

# PRECIOS REFERENCIALES
- Landing Page: $150 USD
- Sitios a medida: Desde $300 USD
- Mantención: $30 USD/mes
`;

// ===========================================
// TOOLS - FUNCTION CALLING
// ===========================================
const SALES_TOOLS = [
    {
        type: 'function' as const,
        function: {
            name: 'diagnose_website',
            description: 'Analiza un sitio web. Úsala cuando te den una URL.',
            parameters: {
                type: 'object',
                properties: {
                    url: { type: 'string', description: 'URL del sitio (ej: hojacero.cl)' }
                },
                required: ['url']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'check_availability',
            description: 'Verifica disponibilidad de agenda.',
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'YYYY-MM-DD' },
                    requested_hour: { type: 'string', description: 'HH:MM (opcional)' }
                },
                required: ['date']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'book_meeting',
            description: 'Agenda reunión. REQUIERE: nombre, empresa y whatsapp.',
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'YYYY-MM-DD' },
                    start_time: { type: 'string', description: 'HH:MM' },
                    attendee_name: { type: 'string', description: 'Nombre prospecto' },
                    attendee_phone: { type: 'string', description: 'WhatsApp (OBLIGATORIO)' },
                    attendee_email: { type: 'string', description: 'Email' },
                    empresa: { type: 'string', description: 'Empresa' },
                    notes: { type: 'string' },
                    duration_minutes: { type: 'number' }
                },
                required: ['date', 'start_time', 'attendee_name', 'attendee_phone', 'empresa']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'save_lead',
            description: 'Guarda datos del prospecto (Nombre, WhatsApp, Email). Úsala APENAS te den estos datos.',
            parameters: {
                type: 'object',
                properties: {
                    nombre: { type: 'string', description: 'Nombre empresa' },
                    nombre_contacto: { type: 'string', description: 'Nombre persona' },
                    telefono: { type: 'string', description: 'WhatsApp' },
                    email: { type: 'string', description: 'Email' },
                    sitio_web: { type: 'string', description: 'URL' },
                    notas: { type: 'string', description: 'Notas' }
                },
                required: ['nombre']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'escalate_to_human',
            description: 'OBLIGATORIO: Notifica a Daniel (Dev) o Gastón (Mkt). Úsala SIEMPRE que pidan hablar con alguien y ya tengas el WhatsApp.',
            parameters: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['development', 'marketing'] },
                    client_name: { type: 'string' },
                    client_phone: { type: 'string', description: 'WhatsApp (OBLIGATORIO)' },
                    empresa: { type: 'string' },
                    reason: { type: 'string' },
                    summary: { type: 'string' },
                    urgency: { type: 'string', enum: ['low', 'medium', 'high'] }
                },
                required: ['type', 'client_name', 'client_phone', 'empresa', 'reason']
            }
        }
    }
];

// ===========================================
// TOOL HANDLERS
// ===========================================
async function executeTool(name: string, args: any, sessionId: string | null): Promise<{ result: string, prospectUpdates?: any }> {
    try {
        switch (name) {
            case 'diagnose_website': {
                // Importar funciones de radar dinámicamente
                const { scrapeContactInfo, analyzeLeadWithOpenAI } = await import('@/utils/radar');
                const scraped = await scrapeContactInfo(args.url);

                // Si es cliente HojaCero
                if (scraped.isHojaCeroClient) {
                    if (sessionId) {
                        await supabaseAdmin.from('sales_agent_sessions').update({
                            prospect_website: args.url,
                            diagnosed_url: args.url
                        }).eq('id', sessionId);
                    }
                    return {
                        result: JSON.stringify({
                            success: true,
                            isHojaCeroClient: true,
                            message: 'CLIENTE EXISTENTE DETECTADO. Saluda a tu cliente. No vendas, solo ayuda.'
                        }),
                        prospectUpdates: { prospect_website: args.url }
                    };
                }

                const mockPlace = { title: 'Sitio Analizado', website: args.url };
                const analysis = await analyzeLeadWithOpenAI(mockPlace, scraped);

                // ============================================
                // AUTO-SAVE TO PIPELINE (Criterio Unificado)
                // ============================================
                // Guardamos inmediatamente como cliente frío en Radar
                let autoSavedLeadId = null;
                try {
                    // Primero buscar si ya existe
                    const { data: existingLead } = await supabaseAdmin
                        .from('leads')
                        .select('id, source_data')
                        .eq('sitio_web', args.url)
                        .single();

                    const newSourceData = {
                        analysis,
                        scraped,
                        technologies: scraped.techStack,
                        diagnosed_at: new Date().toISOString()
                    };

                    if (existingLead) {
                        // UPDATE: Merge source_data para no perder datos previos
                        const { data: updatedLead } = await supabaseAdmin
                            .from('leads')
                            .update({
                                source_data: { ...existingLead.source_data, ...newSourceData },
                                last_activity_at: new Date().toISOString()
                            })
                            .eq('id', existingLead.id)
                            .select()
                            .single();
                        autoSavedLeadId = updatedLead?.id;
                    } else {
                        // INSERT: Crear nuevo lead
                        const urlObj = new URL(args.url);
                        const domainName = urlObj.hostname.replace('www.', '').split('.')[0];

                        const { data: newLead } = await supabaseAdmin
                            .from('leads')
                            .insert({
                                sitio_web: args.url,
                                nombre: domainName, // Nombre limpio del dominio
                                estado: 'cold',
                                pipeline_stage: 'radar',
                                fuente: 'chat_bot_diagnosis',
                                zona_busqueda: 'Chat H0',
                                source_data: newSourceData
                            })
                            .select()
                            .single();
                        autoSavedLeadId = newLead?.id;
                    }
                } catch (err) {
                    console.error('Auto-save lead failed:', err);
                }

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        prospect_website: args.url,
                        diagnosed_url: args.url,
                        diagnosis_score: analysis.score,
                        lead_id: autoSavedLeadId // Ligar sesión al lead creado
                    }).eq('id', sessionId);
                }

                return {
                    result: JSON.stringify({
                        success: true,
                        analysis: analysis,
                        scraped: {
                            store: scraped.hasStore,
                            backend: scraped.hasBackend,
                            stack: scraped.techStack
                        },
                        instruction: "IMPORTANTE: Tu rol es de SECRETARIA. Lee EXACTAMENTE lo que dice 'analysis.conversation': 1) Usa el 'opener'. 2) Menciona la 'observation'. NO inventes análisis nuevo."
                    }),
                    prospectUpdates: { prospect_website: args.url }
                };
            }

            case 'check_availability': {
                const dateParam = args.date;
                const dayStart = `${dateParam}T00:00:00`;
                const dayEnd = `${dateParam}T23:59:59`;

                const { data: events } = await supabaseAdmin
                    .from('agenda_events')
                    .select('start_time, end_time')
                    .gte('start_time', dayStart)
                    .lte('start_time', dayEnd)
                    .neq('status', 'cancelled');

                // Lógica simplificada de slots
                const availableSlots: string[] = [];
                const WORK_START = 9, WORK_END = 18;
                const booked = events?.map(e => ({ s: new Date(e.start_time).getTime(), e: new Date(e.end_time).getTime() })) || [];

                for (let h = WORK_START; h < WORK_END; h++) {
                    const slotTime = new Date(`${dateParam}T${h.toString().padStart(2, '0')}:00:00`).getTime();
                    const isBusy = booked.some(b => slotTime >= b.s && slotTime < b.e);
                    if (!isBusy) availableSlots.push(`${h}:00`);
                }

                return {
                    result: JSON.stringify({ availableSlots: availableSlots.slice(0, 5) })
                };
            }

            case 'book_meeting': {
                const startDateTime = new Date(`${args.date}T${args.start_time}:00`);
                const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

                const { data: event, error } = await supabaseAdmin.from('agenda_events').insert({
                    title: `Reunión ${args.attendee_name}`,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    attendee_name: args.attendee_name,
                    attendee_phone: args.attendee_phone,
                    event_type: 'meeting',
                    status: 'confirmed'
                }).select().single();

                if (error) throw error;
                return { result: JSON.stringify({ success: true, message: 'Reunión Agendada Exitosamente' }) };
            }

            case 'save_lead': {
                // Buscar lead existente: primero por sesión, luego por sitio_web
                let existingLeadId = null;

                if (sessionId) {
                    const { data: session } = await supabaseAdmin
                        .from('sales_agent_sessions')
                        .select('lead_id, prospect_website')
                        .eq('id', sessionId)
                        .single();

                    if (session?.lead_id) {
                        existingLeadId = session.lead_id;
                    } else if (session?.prospect_website || args.sitio_web) {
                        // Buscar por sitio_web
                        const { data: leadByUrl } = await supabaseAdmin
                            .from('leads')
                            .select('id')
                            .eq('sitio_web', session?.prospect_website || args.sitio_web)
                            .single();
                        existingLeadId = leadByUrl?.id;
                    }
                }

                let lead;
                if (existingLeadId) {
                    // UPDATE lead existente (conectar datos de contacto con diagnóstico previo)
                    const { data, error } = await supabaseAdmin.from('leads').update({
                        nombre: args.nombre || undefined,
                        nombre_contacto: args.nombre_contacto || undefined,
                        telefono: args.telefono || undefined,
                        whatsapp: args.telefono || undefined, // Guardamos también en campo whatsapp
                        email: args.email || undefined,
                        estado: 'ready_to_contact',
                        last_activity_at: new Date().toISOString()
                    }).eq('id', existingLeadId).select().single();

                    if (error) throw error;
                    lead = data;
                } else {
                    // INSERT nuevo lead (sin diagnóstico previo)
                    const { data, error } = await supabaseAdmin.from('leads').insert({
                        nombre: args.nombre,
                        nombre_contacto: args.nombre_contacto,
                        telefono: args.telefono,
                        whatsapp: args.telefono,
                        email: args.email,
                        sitio_web: args.sitio_web,
                        estado: 'ready_to_contact',
                        fuente: 'chat_bot',
                        pipeline_stage: 'radar'
                    }).select().single();

                    if (error) throw error;
                    lead = data;
                }

                if (sessionId) {
                    await supabaseAdmin.from('sales_agent_sessions').update({
                        lead_id: lead.id,
                        prospect_name: args.nombre_contacto || args.nombre,
                        prospect_phone: args.telefono,
                        prospect_company: args.nombre,
                        prospect_website: args.sitio_web
                    }).eq('id', sessionId);
                }

                return {
                    result: JSON.stringify({ success: true, leadId: lead.id, updated: !!existingLeadId }),
                    prospectUpdates: {
                        prospect_name: args.nombre_contacto || args.nombre,
                        prospect_phone: args.telefono,
                        prospect_company: args.nombre,
                        prospect_website: args.sitio_web
                    }
                };
            }

            case 'escalate_to_human': {
                // Hard validation
                if (!args.client_phone || args.client_phone.length < 8) {
                    return { result: JSON.stringify({ success: false, error: 'NEED_PHONE', message: 'Falta WhatsApp válido.' }) };
                }

                const recipient = args.type === 'development' ? 'dgonzalez.tagle@gmail.com' : 'gaston.jofre@gmail.com';
                const subject = `🔥 LEADS: ${args.client_name} quiere hablar con ${args.type}`;

                const RESEND_API_KEY = process.env.RESEND_API_KEY;
                if (RESEND_API_KEY) {
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            from: 'H0 Bot <bot@hojacero.cl>',
                            to: [recipient],
                            subject: subject,
                            html: `<p>Nombre: ${args.client_name}</p><p>WhatsApp: ${args.client_phone}</p><p>Razón: ${args.reason}</p>`
                        })
                    });
                }

                await supabaseAdmin.from('sales_notifications').insert({
                    type: args.type === 'development' ? 'dev_escalation' : 'mkt_escalation',
                    session_id: sessionId,
                    message: `${args.client_name} assigned to ${args.type}`,
                    context: args,
                    status: 'pending'
                });

                return { result: JSON.stringify({ success: true, message: 'Notificación enviada a humano.' }) };
            }

            default:
                return { result: JSON.stringify({ error: 'Tool not found' }) };
        }
    } catch (e: any) {
        console.error('Tool Error:', e);
        return { result: JSON.stringify({ success: false, error: e.message }) };
    }
}

// ===========================================
// MAIN HANDLER
// ===========================================
function buildSystemMessage(prospectData: any) {
    let content = SYSTEM_PROMPT + '\n\n' + getCurrentDatePrompt();

    content += `\n\n## 📋 DATOS YA CAPTURADOS (VERDAD ABSOLUTA)\n`;
    content += `Nombre: ${prospectData.prospect_name || 'NO CAPTURADO (Preguntalo)'}\n`;
    content += `WhatsApp: ${prospectData.prospect_phone || 'NO CAPTURADO (Preguntalo)'}\n`;
    content += `Empresa: ${prospectData.prospect_company || 'NO CAPTURADO'}\n`;
    content += `Sitio Web: ${prospectData.prospect_website || 'NO CAPTURADO'}\n`;

    // Reglas derivadas
    if (prospectData.prospect_phone && prospectData.prospect_name) {
        content += `\n✅ TIENES LOS DATOS CLAVE. Si el usuario pide hablar con alguien, USA escalate_to_human. NO LO DUDES.`;
    }

    return content;
}

// ===========================================
// HELPER: AI WRAPPER WITH GROQ FALLBACK
// ===========================================
// ===========================================
// HELPER: OPENAI ONLY (NO LOW-QUALITY FALLBACK)
// ===========================================
async function callAIWithFallback(params: any) {
    try {
        // 1. Try OpenAI Primary
        return await openai.chat.completions.create(params);
    } catch (e: any) {
        console.error('OpenAI API Error:', e);

        // Critical Error - Fail Gracefully to Manual Channel
        // We DO NOT want a dumb bot pretending to work.
        throw new Error("SERVICE_OVERLOAD_MANUAL_CONTACT");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { messages, sessionId: clientSessionId } = await req.json();
        let sessionId = clientSessionId;

        // 1. Init Session if needed
        if (!sessionId) {
            const { data: s } = await supabaseAdmin.from('sales_agent_sessions')
                .insert({ session_key: `sess-${Date.now()}` }).select().single();
            sessionId = s?.id;
        }

        // 2. Load Prospect Data (Mutable)
        let prospectData: any = {};
        if (sessionId) {
            const { data } = await supabaseAdmin.from('sales_agent_sessions')
                .select('prospect_name, prospect_phone, prospect_company, prospect_website')
                .eq('id', sessionId).single();
            if (data) prospectData = data;
        }

        // 3. First OpenAI Call
        const limitedMessages = limitChatHistory(messages, 6);
        const tools = SALES_TOOLS; // alias

        // Initial System Message
        let systemMessage = buildSystemMessage(prospectData);

        // ★ USE WRAPPER INSTEAD OF DIRECT CALL ★
        const response1 = await callAIWithFallback({
            model: DEFAULT_MODEL,
            messages: [{ role: 'system', content: systemMessage }, ...limitedMessages] as any,
            tools,
            tool_choice: 'auto',
            temperature: 0.7
        });

        const msg1 = response1.choices[0].message;
        let finalContent = msg1.content || '';
        // 4. Tool Execution Loop
        const toolsUsed: string[] = [];
        const toolResults: ChatMessage[] = [];
        let response2: any = null; // Declare for scope access

        // Track usage
        let totalUsage = {
            prompt_tokens: (response1 as any).usage?.prompt_tokens || 0,
            completion_tokens: (response1 as any).usage?.completion_tokens || 0,
            total_tokens: (response1 as any).usage?.total_tokens || 0
        };

        if (msg1.tool_calls?.length) {
            // ... (Tool execution logic kept same, just add usage tracking to 2nd call)
            for (const toolCall of msg1.tool_calls) {
                // (Existing tool execution logic...)
                const fnName = (toolCall as any).function.name;
                const toolName = fnName; // alias
                const argsString = (toolCall as any).function.arguments;
                const toolArgs = JSON.parse(argsString); // Simple parse

                // Execute
                const outcome = await executeTool(toolName, toolArgs, sessionId);
                toolsUsed.push(toolName);

                // ★ SAFETY: TRUNCATE RESULT FOR CONTEXT ★
                let safeContent = outcome.result;
                if (safeContent.length > 2000) {
                    safeContent = safeContent.substring(0, 2000) + '... [TRUNCATED_TO_SAVE_TOKENS]';
                }

                toolResults.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: safeContent
                });

                // ★ UPDATE MEMORY IMMEDIATELY ★
                if (outcome.prospectUpdates) {
                    prospectData = { ...prospectData, ...outcome.prospectUpdates };
                }
            }

            // Second Call with Tool Results
            // We use the UPDATED prospectData for the system prompt if needed, 
            // but usually we just append the tool results.

            // Re-build system message? No, usually keep same context.

            response2 = await callAIWithFallback({
                model: DEFAULT_MODEL,
                messages: [
                    { role: 'system', content: systemMessage },
                    ...limitedMessages,
                    msg1,
                    ...toolResults
                ] as any,
                tools,
                tool_choice: 'auto', // Allow more tools or text
                temperature: 0.7
            });

            const msg2 = response2.choices[0].message;
            finalContent = msg2.content || '';

            // Add second call usage
            const u2 = (response2 as any).usage;
            if (u2) {
                totalUsage.prompt_tokens += u2.prompt_tokens;
                totalUsage.completion_tokens += u2.completion_tokens;
                totalUsage.total_tokens += u2.total_tokens;
            }
        }

        // Detect Model Used (Prioritize final response model)
        const modelUsed = (response2 as any)?.model || (response1 as any)?.model || 'unknown-model';

        // 5. Save Assistant Message
        if (finalContent) {
            try {
                await supabaseAdmin.from('sales_agent_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: finalContent,
                    metadata: {
                        model: modelUsed,
                        usage: totalUsage
                    }
                });
            } catch (err) {
                // Fallback for old schema
                await supabaseAdmin.from('sales_agent_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: finalContent
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: finalContent,
            sessionId,
            toolsUsed, // For debugging/agenda trigger
            tokenUsage: {
                ...totalUsage,
                model_name: modelUsed
            }
        });

    } catch (error: any) {
        console.error('Chat API Fatal Error:', error);

        if (error.message === "SERVICE_OVERLOAD_MANUAL_CONTACT") {
            return NextResponse.json({
                success: true,
                message: "¡Ups! Estamos con una demanda altísima en este momento y nuestro sistema inteligente está a tope. 🤯\n\nPara no hacerte perder tiempo, escríbenos directamente a **contacto@hojacero.cl** y te daremos atención prioritaria humana. ¡Disculpa la molestia!",
                sessionId: null, // No session updates
                tokenUsage: null
            });
        }

        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
