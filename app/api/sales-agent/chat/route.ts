import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { SALES_AGENT_SYSTEM_PROMPT, SALES_TOOLS } from '@/utils/sales-agent/system-prompt';
import { createClient } from '@/utils/supabase/server';
import { scrapeContactInfo, analyzeLeadWithGroq } from '@/utils/radar';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: any[];
}

// Helper: Track conversion event
async function trackEvent(supabase: any, sessionId: string, eventType: string, eventData?: any) {
    if (!sessionId) return;
    await supabase.from('sales_agent_conversions').insert({
        session_id: sessionId,
        event_type: eventType,
        event_data: eventData
    }); // Removed .catch() - Supabase v2 doesn't have it
}

// Helper: Detect enterprise signals in lead data
function detectEnterpriseSignals(args: any): boolean {
    const textToCheck = `${args.nombre || ''} ${args.notas || ''} ${args.nombre_contacto || ''}`.toLowerCase();

    // Enterprise keywords
    const enterpriseKeywords = [
        'empresa', 'corporación', 'corporativo', 's.a.', 'ltda', 'spa',
        'empleados', 'facturamos', 'sucursales', 'oficinas',
        'gerente', 'director', 'ceo', 'cto', 'jefe',
        'departamento', 'área', 'división'
    ];

    // Known large companies/brands
    const knownEnterprises = [
        'falabella', 'cencosud', 'walmart', 'ripley', 'bci', 'santander',
        'copec', 'entel', 'movistar', 'claro', 'latam', 'jumbo', 'lider'
    ];

    // Check for keywords
    const hasEnterpriseKeyword = enterpriseKeywords.some(k => textToCheck.includes(k));
    const isKnownEnterprise = knownEnterprises.some(k => textToCheck.includes(k));

    // Check for employee count mentions (e.g., "50 empleados")
    const hasEmployeeCount = /\d{2,}\s*(empleados|personas|trabajadores)/i.test(textToCheck);

    return hasEnterpriseKeyword || isKnownEnterprise || hasEmployeeCount;
}

// Tool execution handlers
async function executeTool(name: string, args: any, sessionId: string | null): Promise<string> {
    const supabase = await createClient();

    switch (name) {
        case 'diagnose_website': {
            try {
                if (sessionId) await trackEvent(supabase, sessionId, 'url_submitted', { url: args.url });

                const scraped = await scrapeContactInfo(args.url);
                const mockPlace = { title: 'Sitio Analizado', website: args.url, category: 'General' };
                const analysis = await analyzeLeadWithGroq(mockPlace, scraped);

                // Update session with diagnosis info
                if (sessionId) {
                    const { data: session } = await supabase.from('sales_agent_sessions').update({
                        diagnosed_url: args.url,
                        diagnosis_score: analysis.score
                    }).eq('id', sessionId).select('lead_id').single();

                    // IF there is a lead linked to this session, UPDATE the lead with FULL analysis results!
                    if (session?.lead_id) {
                        console.log(`🔗 SALES AGENT: Linking full diagnosis to lead ${session.lead_id}`);

                        // Merge analysis into existing source_data
                        const { data: currentLead } = await supabase.from('leads').select('source_data').eq('id', session.lead_id).single();
                        const updatedSourceData = {
                            ...(currentLead?.source_data || {}),
                            analysis: analysis,
                            scraped: scraped,
                            deep_analysis: {
                                seoScore: analysis.score,
                                painPoints: analysis.salesStrategy?.painPoints || [],
                                salesAngles: analysis.sales_angles || [],
                                hook: analysis.salesStrategy?.hook,
                                techIssues: analysis.technicalIssues || []
                            },
                            last_audit_date: new Date().toISOString()
                        };

                        await supabase.from('leads').update({
                            sitio_web: args.url,
                            puntaje_oportunidad: analysis.score,
                            razon_ia: analysis.analysisReport || analysis.salesStrategy?.hook || undefined,
                            source_data: updatedSourceData
                        }).eq('id', session.lead_id);
                    }

                    await trackEvent(supabase, sessionId, 'diagnosis_complete', { score: analysis.score });
                }

                // Build human-friendly response for the bot
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

                // 1. Pre-fetch existing lead if phone or email is provided
                let existingLeadId: string | null = null;
                if (telefono || email) {
                    let query = supabase.from('leads').select('id');
                    if (telefono) query = query.eq('telefono', telefono);
                    else if (email) query = query.eq('email', email);

                    const { data: found } = await query.maybeSingle();
                    if (found) existingLeadId = found.id;
                }

                let leadId: string;

                if (existingLeadId) {
                    // 2. UPDATE existing lead (Upsert logic)
                    console.log(`♻️ SALES AGENT: Updating existing lead ${existingLeadId}...`);

                    const { data: currentLead } = await supabase.from('leads').select('source_data').eq('id', existingLeadId).single();
                    const updatedSourceData = {
                        ...(currentLead?.source_data || {}),
                        last_chat_update: new Date().toISOString(),
                        chat_session: sessionId,
                        notas: args.notas || (currentLead?.source_data as any)?.notas
                    };

                    const { data: updated, error } = await supabase.from('leads').update({
                        nombre: args.nombre,
                        nombre_contacto: args.nombre_contacto || undefined,
                        email: args.email || undefined,
                        telefono: args.telefono || undefined,
                        sitio_web: args.sitio_web || undefined,
                        source_data: updatedSourceData
                    }).eq('id', existingLeadId).select().single();

                    if (error) throw error;
                    leadId = updated.id;
                } else {
                    // 3. INSERT new lead
                    console.log(`✨ SALES AGENT: Creating new lead for "${args.nombre}"...`);

                    // Check if we have analysis in session to pre-populate
                    let initialSourceData: any = { notas: args.notas, chat_origin: true, session_id: sessionId };
                    let initialScore = null;
                    let initialUrl = args.sitio_web || null;

                    if (sessionId) {
                        const { data: sess } = await supabase.from('sales_agent_sessions').select('diagnosed_url, diagnosis_score').eq('id', sessionId).single();
                        if (sess?.diagnosed_url) {
                            initialUrl = initialUrl || sess.diagnosed_url;
                            initialScore = sess.diagnosis_score;
                        }
                    }

                    const { data: lead, error } = await supabase.from('leads').insert({
                        nombre: args.nombre,
                        nombre_contacto: args.nombre_contacto || null,
                        email: email,
                        telefono: telefono,
                        sitio_web: initialUrl,
                        puntaje_oportunidad: initialScore,
                        estado: 'ready_to_contact',
                        fuente: 'chat_bot',
                        zona_busqueda: 'Chat H0',
                        source_data: initialSourceData
                    }).select().single();

                    if (error) throw error;
                    leadId = lead.id;
                }

                // Link lead to session
                if (sessionId) {
                    await supabase.from('sales_agent_sessions').update({
                        lead_id: leadId,
                        status: 'converted',
                        conversion_type: 'lead_captured'
                    }).eq('id', sessionId);

                    await trackEvent(supabase, sessionId, 'lead_saved', { lead_id: leadId, is_update: !!existingLeadId });
                }

                // Detect enterprise lead and notify Daniel
                const isEnterprise = detectEnterpriseSignals(args);
                if (isEnterprise && !existingLeadId) {
                    // New enterprise lead - notify immediately
                    console.log(`🏢 ENTERPRISE LEAD DETECTED: ${args.nombre}`);
                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sales-agent/notify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'enterprise_lead',
                                leadId,
                                sessionId,
                                message: `Lead Enterprise detectado: ${args.nombre}. Contacto: ${args.nombre_contacto || 'N/A'}. Teléfono: ${args.telefono || 'N/A'}`,
                                context: { nombre: args.nombre, notas: args.notas }
                            })
                        });
                    } catch (notifyErr) {
                        console.error('Failed to notify:', notifyErr);
                    }
                }

                return JSON.stringify({
                    success: true,
                    message: existingLeadId ? 'Información actualizada' : 'Lead guardado',
                    leadId,
                    isEnterprise
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'check_availability': {
            try {
                // Llamar a la API de disponibilidad
                const url = new URL('/api/agenda/availability', 'http://localhost:3000');
                url.searchParams.set('date', args.date);
                if (args.requested_hour) {
                    url.searchParams.set('hour', args.requested_hour);
                }

                const res = await fetch(url.toString());
                const data = await res.json();

                if (!data.success) {
                    return JSON.stringify({ success: false, error: data.error });
                }

                // Si hay lógica fake busy, devolver mensaje especial
                if (data.fakeBusy) {
                    return JSON.stringify({
                        success: true,
                        message: data.fakeBusy.message,
                        suggestedSlot: data.fakeBusy.suggested,
                        availableSlots: data.slots.slice(0, 4).map((s: any) =>
                            new Date(s.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                        )
                    });
                }

                // Devolver slots disponibles
                return JSON.stringify({
                    success: true,
                    date: args.date,
                    availableSlots: data.slots.slice(0, 6).map((s: any) =>
                        new Date(s.start).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
                    ),
                    totalAvailable: data.totalAvailable
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

                const res = await fetch('/api/agenda/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: args.title,
                        start_time: startDateTime.toISOString(),
                        end_time: endDateTime.toISOString(),
                        attendee_name: args.attendee_name,
                        attendee_phone: args.attendee_phone,
                        attendee_email: args.attendee_email,
                        notes: args.notes,
                        source: 'bot',
                        event_type: 'meeting'
                    })
                });

                const data = await res.json();

                if (!data.success) {
                    return JSON.stringify({ success: false, error: data.error });
                }

                // Track conversion
                if (sessionId) {
                    await supabase.from('sales_agent_sessions').update({
                        status: 'converted',
                        conversion_type: 'meeting'
                    }).eq('id', sessionId);

                    await trackEvent(supabase, sessionId, 'meeting_booked', {
                        event_id: data.event.id,
                        date: args.date,
                        time: args.start_time
                    });
                }

                return JSON.stringify({
                    success: true,
                    message: `¡Reunión agendada! ${args.date} a las ${args.start_time}`,
                    eventId: data.event.id
                });
            } catch (err: any) {
                return JSON.stringify({ success: false, error: err.message });
            }
        }

        case 'escalate_to_human': {
            try {
                const DANIEL_WHATSAPP = process.env.DANIEL_WHATSAPP || '+56912345678';
                const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
                const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
                const TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP_NUMBER;

                // Build the message for Daniel
                const urgencyEmoji = args.urgency === 'high' ? '🔴' : args.urgency === 'medium' ? '🟡' : '🟢';
                const reasonMap: Record<string, string> = {
                    'technical_question': 'Pregunta técnica',
                    'client_request': 'Cliente pidió hablar con humano',
                    'frustration_detected': 'Frustración detectada',
                    'enterprise_lead': 'Lead Enterprise',
                    'complex_project': 'Proyecto complejo'
                };
                const reasonText = reasonMap[args.reason] || args.reason;

                const message = `${urgencyEmoji} *ESCALAMIENTO BOT H0*

👤 *Cliente:* ${args.client_name}
📱 *WhatsApp:* ${args.client_phone || 'No proporcionado'}
📋 *Razón:* ${reasonText}

💬 *Resumen:*
${args.summary}

---
Respóndele por WhatsApp lo antes posible.`;

                // Try sending via Twilio WhatsApp
                let whatsappSent = false;
                if (TWILIO_SID && TWILIO_TOKEN && TWILIO_WHATSAPP) {
                    try {
                        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
                        const twilioRes = await fetch(twilioUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Basic ${Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64')}`,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({
                                From: `whatsapp:${TWILIO_WHATSAPP}`,
                                To: `whatsapp:${DANIEL_WHATSAPP}`,
                                Body: message
                            })
                        });
                        whatsappSent = twilioRes.ok;
                        console.log(`📲 ESCALATE: WhatsApp ${whatsappSent ? 'sent' : 'failed'}`);
                    } catch (twilioErr) {
                        console.error('Twilio error:', twilioErr);
                    }
                }

                // Fallback: Send email notification
                if (!whatsappSent) {
                    try {
                        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sales-agent/notify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'hot_lead',
                                leadId: null,
                                sessionId,
                                message: `Escalamiento: ${args.client_name} (${args.client_phone || 'sin tel'}). Razón: ${reasonText}. Urgencia: ${args.urgency || 'medium'}`,
                                context: { summary: args.summary, reason: args.reason }
                            })
                        });
                    } catch (emailErr) {
                        console.error('Email fallback error:', emailErr);
                    }
                }

                // Log escalation
                await supabase.from('sales_notifications').insert({
                    type: 'escalation',
                    session_id: sessionId,
                    message: `Escalado: ${args.client_name}`,
                    context: { ...args, whatsapp_sent: whatsappSent },
                    status: whatsappSent ? 'sent' : 'pending'
                });

                // Update session status
                if (sessionId) {
                    await supabase.from('sales_agent_sessions').update({
                        status: 'escalated',
                        escalation_reason: args.reason
                    }).eq('id', sessionId);
                }

                return JSON.stringify({
                    success: true,
                    message: 'Daniel ha sido notificado y te contactará por WhatsApp pronto.',
                    whatsappSent
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
    const supabase = await createClient();

    try {
        const { messages, sessionId: clientSessionId } = await req.json();

        // Get or create session (gracefully handle if table doesn't exist yet)
        let sessionId: string | null = null;
        try {
            if (!clientSessionId) {
                const { data: newSession } = await supabase.from('sales_agent_sessions').insert({
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
            // Table might not exist yet, continue without persistence
        }

        // Save incoming user message
        if (sessionId && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'user') {
                await supabase.from('sales_agent_messages').insert({
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

        // Call Groq with tools
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
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
                    await supabase.from('sales_agent_messages').insert({
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

            const finalResponse = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: finalConversation as any[],
                max_tokens: 1024,
                temperature: 0.7
            });

            finalContent = finalResponse.choices[0].message.content || '';
        }

        // Save assistant response
        if (sessionId) {
            await supabase.from('sales_agent_messages').insert({
                session_id: sessionId,
                role: 'assistant',
                content: finalContent
            });

            // Update session stats
            await supabase.from('sales_agent_sessions').update({
                last_message_at: new Date().toISOString(),
                messages_count: messages.length + 1
            }).eq('id', sessionId);
        }

        // 4. CLEANUP: Final safety filter to remove technical leaks (tags like <function>...</function>)
        // Some models tend to "think out loud" and write their tool calls in the message body.
        finalContent = finalContent.replace(/<function=.*?\/function>/gi, '').trim();

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
