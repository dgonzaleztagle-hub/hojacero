import { NextRequest, NextResponse } from 'next/server';
import { openai, ChatMessage, DEFAULT_MODEL, limitChatHistory, getCurrentDatePrompt, isWithinBusinessHours, parseJsonSafe } from '@/utils/ai-client';
import { createClient } from '@supabase/supabase-js';

// ===========================================
// CHATBOT H0 - AGENTE DE VENTAS HOJACERO
// Modelo: gpt-4o-mini (OpenAI)
// ===========================================

const TIMEZONE_OFFSET = '-03:00'; // Chile Time
const TIMEZONE_NAME = 'America/Santiago';

// Helper to get admin client (lazy init)
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// ===========================================
// SYSTEM PROMPT - PROFESIONAL (v2.0)
// Basado en SalesGPT + OpenAI Best Practices
// ===========================================
const SYSTEM_PROMPT = `
# 🤖 IDENTIDAD
Eres H0, el asistente conversacional de HojaCero, agencia chilena de diseño web y growth partnership.
Tu personalidad es de un amigo cercano que sabe mucho de tecnología. Tono relajado, chileno neutro, cero corporativo.
Tu misión: Ayudar primero, vender después. Si no puedes ayudar, lo dices honestamente.

# 📍 ETAPAS DE CONVERSACIÓN (SOLO PARA TU LÓGICA INTERNA)
Antes de cada respuesta, identifica mentalmente en qué etapa estás, pero NUNCA escribas el nombre de la etapa en tu respuesta.

⚠️ PROHIBIDO: Escribir "ETAPA 1", "SALUDO", o cualquier referencia a las etapas en tus mensajes. Eso es solo para tu razonamiento interno.

Las etapas son:
ETAPA 1 - SALUDO: Presentarte brevemente y preguntar en qué puedes ayudar.
ETAPA 2 - DESCUBRIMIENTO: Entender qué necesita el usuario (sitio web, marketing, app, etc).
ETAPA 3 - DIAGNÓSTICO: Si te dan una URL, analizarla con la tool y dar feedback útil.
ETAPA 4 - PROPUESTA: Explicar cómo HojaCero puede ayudar con su problema específico.
ETAPA 5 - CAPTURA: Obtener datos de contacto (nombre, empresa, WhatsApp) para dar seguimiento.
ETAPA 6 - CIERRE: Agendar reunión o escalar a Daniel/Gastón.

## Reglas de Transición:
- NO saltes etapas. Si estás en SALUDO, no pidas WhatsApp.
- NO asumas necesidades. Si no han dicho "marketing", no asumas que quieren marketing.
- SOLO avanza cuando el usuario muestre interés explícito.

# 🧠 MEMORIA ABSOLUTA (CRÍTICO)
Mira SIEMPRE la sección "DATOS YA CAPTURADOS" abajo.

✅ SI dice "Nombre: Juan" → YA SE LLAMA JUAN. NO preguntes el nombre.
✅ SI dice "WhatsApp: +569..." → YA TIENES EL WHATSAPP. NO lo pidas de nuevo.
✅ SI dice "Empresa: Mamasole" → YA TIENES LA EMPRESA. NO la pidas de nuevo.
✅ SI ya diste un diagnóstico del sitio → NO repitas el análisis. Ve al siguiente paso.

⚠️ VIOLACIÓN GRAVE: Pedir un dato que ya tienes. El usuario se frustrará.
⚠️ VIOLACIÓN GRAVE: Repetir diagnóstico ya dado. Parece robot y da desconfianza.

# 🛠️ USO DE TOOLS (OBLIGATORIO - NO FINGIR)

## REGLA DE ORO:
❌ NUNCA digas "He notificado al equipo" sin haber llamado 'escalate_to_human'.
❌ NUNCA digas "Reunión agendada" sin haber llamado 'book_meeting'.
❌ NUNCA digas "Guardé tus datos" sin haber llamado 'save_lead'.
❌ NUNCA opines sobre un sitio web sin haber llamado 'diagnose_website'.

Si dices que hiciste algo sin llamar la tool, ESTÁS MINTIENDO AL USUARIO.

## PROMESAS PROHIBIDAS (NO HACEMOS ESTO):
❌ NUNCA digas "Te enviaré el diagnóstico por correo" - NO tenemos esa función.
❌ NUNCA digas "Te llegará confirmación por WhatsApp" - NO enviamos WhatsApp automático.
❌ NUNCA digas "Recibirás un email con los detalles" - NO enviamos emails al cliente.

Lo que SÍ hacemos: Guardamos tus datos y Daniel o Gastón te contactan ELLOS directamente.

## Cuándo usar cada tool:

### diagnose_website
- USAR: Cuando el usuario menciona una URL (ej: "mi sitio es miso.cl")
- NO USAR: Si ya analizaste esa URL en la misma conversación
- DESPUÉS: Lee la respuesta y da feedback basado en los datos reales, no inventes

### save_lead  
- USAR: Inmediatamente cuando el usuario da nombre, empresa o WhatsApp
- NO USAR: Si ya guardaste esos datos antes
- PARÁMETROS: nombre (empresa), nombre_contacto (persona), telefono (WhatsApp)

### escalate_to_human
- USAR: Cuando el usuario dice "quiero hablar con alguien" Y ya tienes WhatsApp + Empresa
- NO USAR: Si NO tienes WhatsApp (primero pídelo)
- TIPO: 'development' para Daniel (web, app, bugs) | 'marketing' para Gastón (ads, seo, campañas)
- DECISIÓN DEL TIPO: SOLO basada en lo que el usuario DIJO EXPLÍCITAMENTE. Si no mencionó marketing, NO es marketing.

### book_meeting
- USAR: Cuando el usuario da fecha Y hora específica (ej: "lunes a las 12")
- NO USAR: Si solo dice "quiero reunión" sin fecha/hora específica
- REQUISITOS: fecha, hora, nombre, whatsapp, empresa (todos obligatorios)

### check_availability
- USAR: Cuando el usuario quiere saber horarios disponibles para una fecha
- NO USAR: Si ya tienen fecha y hora decidida

# 💬 EJEMPLOS DE CONVERSACIONES CORRECTAS

## EJEMPLO 1: Usuario da datos, bot los guarda y NO los vuelve a pedir
Usuario: "Hola, me llamo Daniel y mi negocio es Mamasole, mi wsp es 912345678"
H0: [LLAMA save_lead con nombre="Mamasole", nombre_contacto="Daniel", telefono="912345678"]
H0: "¡Hola Daniel! Mucho gusto, ya guardé tus datos. ¿En qué puedo ayudarte con Mamasole? ¿Tienen sitio web?"
Usuario: "Sí, es www.mamasole.cl"
H0: [LLAMA diagnose_website con url="www.mamasole.cl"]
H0: "Dale, acabo de revisar mamasole.cl. [Feedback basado en el análisis real]. ¿Te gustaría que lo conversemos más a fondo?"

## EJEMPLO 2: Usuario quiere hablar con humano pero no ha dado WhatsApp
Usuario: "Quiero hablar con alguien de ustedes"
H0: "¡Claro! Para conectarte con mi equipo, necesito tu WhatsApp para que puedan contactarte. ¿Me lo compartes?"
Usuario: "Es 987654321"
H0: [LLAMA save_lead si no lo tenía guardado]
H0: [LLAMA escalate_to_human con type='development', client_phone='987654321']
H0: "Listo, le avisé a Daniel. Se pondrá en contacto contigo pronto. ¿Hay algo más en que pueda ayudarte mientras tanto?"

## EJEMPLO 3: Usuario quiere agendar reunión con fecha específica
Usuario: "Quiero reunión el lunes a las 12"
H0: [Verifica que tenga nombre, empresa, whatsapp. Si no los tiene, los pide]
H0: [LLAMA book_meeting con date="2026-01-27", start_time="12:00", attendee_name="...", attendee_phone="...", empresa="..."]
H0: "¡Perfecto! Quedó agendada tu reunión para el lunes a las 12:00. Te llegará confirmación al WhatsApp. ¿Algo más?"

## EJEMPLO 4: Usuario menciona URL - Bot NO opina sin analizar
Usuario: "Mi sitio es www.ejemplo.cl, ¿qué opinan?"
❌ INCORRECTO: "Se ve muy moderno, me gusta el diseño..."
✅ CORRECTO: [LLAMA diagnose_website primero, LUEGO responde con datos reales]

# ⛔ ERRORES QUE NUNCA DEBES COMETER

1. **Asumir el tipo de servicio**: Si el usuario no dijo "marketing", NO lo derives a marketing.
2. **Pedir datos que ya tienes**: Revisa "DATOS YA CAPTURADOS" antes de pedir algo.
3. **Decir que hiciste algo sin llamar la tool**: Es mentir al usuario.
4. **Dar opiniones sobre sitios sin haberlos analizado**: Usa diagnose_website primero.
5. **Ser insistente con los datos**: Si no quieren dar WhatsApp, respeta y ofrece ayuda general.

# 🎭 DERIVACIONES
SOLO deriva cuando el usuario EXPLÍCITAMENTE mencione:
- GASTÓN (Marketing): "campañas", "ads", "publicidad", "seo", "ventas", "leads"
- DANIEL (Desarrollo): "web", "sitio", "app", "sistema", "lento", "bug", "diseño"

Si NO mencionó ninguna palabra clave, PREGUNTA: "¿Estás buscando ayuda con tu sitio web o con marketing/publicidad?"

# 📋 DATOS CLAVE A CAPTURAR
Para poder escalar o agendar, necesitas estos 3 datos:
1. Nombre de la persona
2. Nombre de la empresa/negocio  
3. WhatsApp

Consíguelos de forma NATURAL, no como interrogatorio:
- "Para que el equipo pueda prepararse antes de la llamada, ¿me compartes tu WhatsApp y el nombre de tu negocio?"

# 💰 PRECIOS REFERENCIALES (solo si preguntan)
- Landing Page: $150 USD
- Sitio a medida: Desde $300 USD
- Mantención mensual: $30 USD/mes

# 📧 GANCHO DE EMAIL (opcional)
Si el análisis fue interesante: "Tengo un reporte técnico más detallado. ¿Te lo envío a tu correo?"
`;

// ===========================================
// TOOLS - FUNCTION CALLING
// ===========================================
const SALES_TOOLS = [
    {
        type: 'function' as const,
        function: {
            name: 'diagnose_website',
            description: `Analiza un sitio web para extraer información técnica y de diseño.
CUÁNDO USAR: Inmediatamente cuando el usuario menciona una URL (ej: "mi sitio es ejemplo.cl").
CUÁNDO NO USAR: Si ya analizaste esa misma URL antes en esta conversación.
DESPUÉS DE USARLA: Lee los datos del análisis y da feedback basado en ellos. NO inventes información.`,
            parameters: {
                type: 'object',
                properties: {
                    url: { type: 'string', description: 'URL del sitio web a analizar (ej: hojacero.cl, www.ejemplo.com)' }
                },
                required: ['url']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'check_availability',
            description: `Consulta horarios disponibles para una fecha específica.
CUÁNDO USAR: Cuando el usuario pregunta "¿qué horarios tienen?" o quiere ver opciones de agenda.
CUÁNDO NO USAR: Si ya tienen fecha y hora definida (usa book_meeting directamente).`,
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD (ej: 2026-01-27)' },
                    requested_hour: { type: 'string', description: 'Hora preferida en formato HH:MM (opcional)' }
                },
                required: ['date']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'book_meeting',
            description: `Agenda una reunión en el calendario. SOLO usar cuando tengas TODOS los datos requeridos.
CUÁNDO USAR: Cuando el usuario da fecha Y hora específica (ej: "el lunes a las 12").
CUÁNDO NO USAR: Si falta algún dato requerido. Primero pídelo al usuario.
DATOS REQUERIDOS: fecha, hora, nombre, whatsapp, empresa. TODOS son obligatorios.`,
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'Fecha YYYY-MM-DD' },
                    start_time: { type: 'string', description: 'Hora HH:MM' },
                    attendee_name: { type: 'string', description: 'Nombre de la persona que asistirá' },
                    attendee_phone: { type: 'string', description: 'WhatsApp del prospecto (OBLIGATORIO)' },
                    attendee_email: { type: 'string', description: 'Email (opcional)' },
                    empresa: { type: 'string', description: 'Nombre del negocio o empresa' },
                    website: { type: 'string', description: 'URL del sitio web del negocio (ej: ejemplo.cl)' },
                    notes: { type: 'string', description: 'Notas adicionales sobre la reunión' },
                    duration_minutes: { type: 'number', description: 'Duración en minutos (default: 30)' }
                },
                required: ['date', 'start_time', 'attendee_name', 'attendee_phone', 'empresa']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'save_lead',
            description: `Guarda los datos del prospecto en la base de datos.
CUÁNDO USAR: Inmediatamente cuando el usuario proporciona nombre, empresa o WhatsApp.
CUÁNDO NO USAR: Si ya guardaste esos exactos datos antes (evita duplicados).
IMPORTANTE: Usa "nombre" para la empresa y "nombre_contacto" para la persona.`,
            parameters: {
                type: 'object',
                properties: {
                    nombre: { type: 'string', description: 'Nombre de la EMPRESA o negocio' },
                    nombre_contacto: { type: 'string', description: 'Nombre de la PERSONA de contacto' },
                    telefono: { type: 'string', description: 'Número de WhatsApp' },
                    email: { type: 'string', description: 'Correo electrónico' },
                    sitio_web: { type: 'string', description: 'URL del sitio web' },
                    notas: { type: 'string', description: 'Observaciones adicionales' }
                },
                required: ['nombre']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'escalate_to_human',
            description: `Notifica a un humano del equipo (Daniel o Gastón) sobre el prospecto.
CUÁNDO USAR: Cuando el usuario dice "quiero hablar con alguien" Y ya tienes WhatsApp + empresa.
CUÁNDO NO USAR: Si NO tienes el WhatsApp del usuario (primero pídelo con save_lead).
TIPO - CÓMO DECIDIR:
  - "development": SOLO si el usuario mencionó palabras como web, sitio, app, diseño, lento, bug
  - "marketing": SOLO si el usuario mencionó palabras como ads, campañas, seo, ventas, publicidad
  - SI NO MENCIONÓ NINGUNA: PREGUNTA al usuario antes de llamar esta función
NUNCA ASUMAS EL TIPO. Si el usuario solo dijo "quiero hablar" sin especificar tema, pregunta primero.`,
            parameters: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['development', 'marketing'], description: 'development=Daniel (web/tech) | marketing=Gastón (ads/seo)' },
                    client_name: { type: 'string', description: 'Nombre de la persona' },
                    client_phone: { type: 'string', description: 'WhatsApp del prospecto (OBLIGATORIO)' },
                    empresa: { type: 'string', description: 'Nombre del negocio' },
                    reason: { type: 'string', description: 'Motivo de la escalación' },
                    summary: { type: 'string', description: 'Resumen de la conversación' },
                    urgency: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Nivel de urgencia' }
                },
                required: ['type', 'client_name', 'client_phone', 'empresa', 'reason']
            }
        }
    },
    {
        type: 'function' as const,
        function: {
            name: 'cancel_meeting',
            description: `Cancela una reunión existente del mismo día.
CUÁNDO USAR: Cuando el usuario dice "cambia la cita", "mejor a otra hora", "cancela la reunión".
CUÁNDO NO USAR: Si no hay reunión previa para cancelar.
Esto cancela la reunión más reciente del usuario en esa fecha para poder re-agendar.`,
            parameters: {
                type: 'object',
                properties: {
                    date: { type: 'string', description: 'Fecha en formato YYYY-MM-DD' },
                    attendee_name: { type: 'string', description: 'Nombre de la persona para identificar la reunión' },
                    reason: { type: 'string', description: 'Motivo de cancelación' }
                },
                required: ['date', 'attendee_name']
            }
        }
    }
];

// ===========================================
// TOOL HANDLERS
// ===========================================
async function executeTool(name: string, args: any, sessionId: string | null): Promise<{ result: string, prospectUpdates?: any }> {
    try {
        const supabaseAdmin = getAdminClient();
        switch (name) {
            case 'diagnose_website': {
                // Importar funciones de radar dinámicamente
                const { scrapeContactInfo, analyzeLeadWithGroq } = await import('@/utils/radar');
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
                const analysis = await analyzeLeadWithGroq(mockPlace, scraped);

                // ============================================
                // AUTO-SAVE TO PIPELINE (Criterio Unificado)
                // Ahora incluye datos de sesión (nombre, empresa, wsp)
                // ============================================
                let autoSavedLeadId = null;

                // Leer datos de la sesión para incluirlos en el lead
                let sessionData: any = {};
                if (sessionId) {
                    const { data } = await supabaseAdmin
                        .from('sales_agent_sessions')
                        .select('prospect_name, prospect_phone, prospect_company')
                        .eq('id', sessionId)
                        .single();
                    if (data) sessionData = data;
                }

                try {
                    // Primero buscar si ya existe por sitio_web
                    const { data: existingLead } = await supabaseAdmin
                        .from('leads')
                        .select('id, source_data')
                        .eq('sitio_web', args.url)
                        .single();

                    const newSourceData = {
                        analysis,
                        scraped,
                        techStack: scraped.techStack,
                        diagnosed_at: new Date().toISOString()
                    };

                    if (existingLead) {
                        // UPDATE: Merge source_data + agregar datos de contacto de sesión
                        const { data: updatedLead } = await supabaseAdmin
                            .from('leads')
                            .update({
                                source_data: { ...existingLead.source_data, ...newSourceData },
                                // Agregar datos de sesión si existen
                                nombre_contacto: sessionData.prospect_name || undefined,
                                telefono: sessionData.prospect_phone || undefined,
                                whatsapp: sessionData.prospect_phone || undefined,
                                nombre: sessionData.prospect_company || undefined,
                                // Si tenemos datos de contacto, promover estado
                                estado: sessionData.prospect_phone ? 'ready_to_contact' : 'detected',
                                last_activity_at: new Date().toISOString()
                            })
                            .eq('id', existingLead.id)
                            .select()
                            .single();
                        autoSavedLeadId = updatedLead?.id;
                    } else {
                        // INSERT: Crear nuevo lead con TODOS los datos
                        // Sanitizar URL para evitar error de parsing
                        let sanitizedUrl = args.url;
                        if (!sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
                            sanitizedUrl = 'https://' + sanitizedUrl;
                        }
                        const urlObj = new URL(sanitizedUrl);
                        const domainName = urlObj.hostname.replace('www.', '').split('.')[0];

                        const { data: newLead } = await supabaseAdmin
                            .from('leads')
                            .insert({
                                sitio_web: args.url,
                                // Usar empresa de sesión o nombre de dominio
                                nombre: sessionData.prospect_company || domainName,
                                nombre_contacto: sessionData.prospect_name || null,
                                telefono: sessionData.prospect_phone || null,
                                whatsapp: sessionData.prospect_phone || null,
                                // Si tenemos datos de contacto, ir directo a ready_to_contact
                                estado: sessionData.prospect_phone ? 'ready_to_contact' : 'detected',
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
                    console.log('[diagnose_website] Ligado lead_id a sesión:', { sessionId, lead_id: autoSavedLeadId });
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
                const dayStart = `${dateParam}T00:00:00${TIMEZONE_OFFSET}`;
                const dayEnd = `${dateParam}T23:59:59${TIMEZONE_OFFSET}`;

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
                    const slotTime = new Date(`${dateParam}T${h.toString().padStart(2, '0')}:00:00${TIMEZONE_OFFSET}`).getTime();
                    const isBusy = booked.some(b => slotTime >= b.s && slotTime < b.e);
                    if (!isBusy) availableSlots.push(`${h}:00`);
                }

                return {
                    result: JSON.stringify({ availableSlots: availableSlots.slice(0, 5) })
                };
            }

            case 'book_meeting': {
                // Normalizar hora (manejar '12', '12:00', '12:30', etc)
                let normalizedTime = args.start_time;
                if (!normalizedTime.includes(':')) {
                    normalizedTime = `${normalizedTime.padStart(2, '0')}:00`;
                } else if (normalizedTime.split(':')[1]?.length === 1) {
                    const [h, m] = normalizedTime.split(':');
                    normalizedTime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
                }

                // Crear fechas con timezone Chile (UTC-3)
                const startDateTime = new Date(`${args.date}T${normalizedTime}:00${TIMEZONE_OFFSET}`);
                const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

                console.log('[book_meeting] args:', { date: args.date, start_time: args.start_time, normalized: normalizedTime, startDateTime: startDateTime.toISOString() });

                // ========================================
                // VALIDAR DISPONIBILIDAD ANTES DE AGENDAR
                // ========================================
                const dayStart = `${args.date}T00:00:00${TIMEZONE_OFFSET}`;
                const dayEnd = `${args.date}T23:59:59${TIMEZONE_OFFSET}`;

                const { data: existingEvents } = await supabaseAdmin
                    .from('agenda_events')
                    .select('start_time, end_time')
                    .gte('start_time', dayStart)
                    .lte('start_time', dayEnd)
                    .neq('status', 'cancelled');

                // Verificar si hay conflicto
                const requestedStart = startDateTime.getTime();
                const requestedEnd = endDateTime.getTime();
                const hasConflict = existingEvents?.some(e => {
                    const eventStart = new Date(e.start_time).getTime();
                    const eventEnd = new Date(e.end_time).getTime();
                    return (requestedStart < eventEnd && requestedEnd > eventStart);
                });

                if (hasConflict) {
                    // Calcular horarios disponibles para sugerir
                    const WORK_START = 9, WORK_END = 18;
                    const booked = existingEvents?.map(e => ({ s: new Date(e.start_time).getTime(), e: new Date(e.end_time).getTime() })) || [];
                    const availableSlots: string[] = [];

                    for (let h = WORK_START; h < WORK_END; h++) {
                        const slotTime = new Date(`${args.date}T${h.toString().padStart(2, '0')}:00:00${TIMEZONE_OFFSET}`).getTime();
                        const isBusy = booked.some(b => slotTime >= b.s && slotTime < b.e);
                        if (!isBusy) availableSlots.push(`${h}:00`);
                    }

                    return {
                        result: JSON.stringify({
                            success: false,
                            error: 'SLOT_OCCUPIED',
                            message: `Esa hora ya está ocupada. Horarios disponibles: ${availableSlots.slice(0, 4).join(', ')}`
                        })
                    };
                }

                // Construir notas con contexto completo
                const meetingNotes = [
                    args.empresa ? `Empresa: ${args.empresa}` : null,
                    args.attendee_email ? `Email: ${args.attendee_email}` : null,
                    args.notes || null
                ].filter(Boolean).join(' | ');

                const { data: event, error } = await supabaseAdmin.from('agenda_events').insert({
                    title: `Reunión ${args.attendee_name}${args.empresa ? ` - ${args.empresa}` : ''}`,
                    start_time: startDateTime.toISOString(),
                    end_time: endDateTime.toISOString(),
                    attendee_name: args.attendee_name,
                    attendee_phone: args.attendee_phone,
                    whatsapp: args.attendee_phone, // Datos duplicados en columnas nuevas para reporte
                    company_name: args.empresa,
                    website: args.website || null,
                    attendee_email: args.attendee_email || null,
                    notes: meetingNotes || null,
                    event_type: 'meeting',
                    status: 'confirmed',
                    source: 'chat_bot',
                    send_reminder_email: true // Notificar por defecto al humano
                }).select().single();

                if (error) throw error;
                return { result: JSON.stringify({ success: true, message: 'Reunión Agendada Exitosamente' }) };
            }

            case 'cancel_meeting': {
                const dayStart = `${args.date}T00:00:00${TIMEZONE_OFFSET}`;
                const dayEnd = `${args.date}T23:59:59${TIMEZONE_OFFSET}`;

                // Buscar reunión del usuario en esa fecha
                const { data: meetings, error: searchError } = await supabaseAdmin
                    .from('agenda_events')
                    .select('id, start_time, attendee_name')
                    .gte('start_time', dayStart)
                    .lte('start_time', dayEnd)
                    .neq('status', 'cancelled')
                    .ilike('attendee_name', `%${args.attendee_name}%`)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (searchError) throw searchError;

                if (!meetings || meetings.length === 0) {
                    return { result: JSON.stringify({ success: false, error: 'NO_MEETING_FOUND', message: 'No encontré reunión para cancelar en esa fecha.' }) };
                }

                // Cancelar la reunión (soft delete)
                const { error: cancelError } = await supabaseAdmin
                    .from('agenda_events')
                    .update({ status: 'cancelled' })
                    .eq('id', meetings[0].id);

                if (cancelError) throw cancelError;

                console.log('[cancel_meeting] Cancelled:', meetings[0]);
                return { result: JSON.stringify({ success: true, message: `Reunión cancelada. ¿A qué hora prefieres re-agendar?`, cancelled_id: meetings[0].id }) };
            }

            case 'save_lead': {
                // =====================================================
                // NUEVO FLUJO: Guardar SOLO en memoria de sesión
                // El lead se crea cuando el usuario da el sitio web
                // =====================================================

                if (!sessionId) {
                    return { result: JSON.stringify({ success: false, error: 'No session' }) };
                }

                // Guardar datos en la sesión (memoria)
                await supabaseAdmin.from('sales_agent_sessions').update({
                    prospect_name: args.nombre_contacto || args.nombre || undefined,
                    prospect_phone: args.telefono || undefined,
                    prospect_company: args.nombre || undefined,
                    prospect_website: args.sitio_web || undefined
                }).eq('id', sessionId);

                // SI ya existe un lead ligado a la sesión, actualizar sus datos
                const { data: session } = await supabaseAdmin
                    .from('sales_agent_sessions')
                    .select('lead_id')
                    .eq('id', sessionId)
                    .single();

                if (session?.lead_id) {
                    // Lead ya existe (se creó con diagnose_website), actualizar datos de contacto
                    console.log('[save_lead] Actualizando lead existente:', { lead_id: session.lead_id, args });
                    const { error: updateError } = await supabaseAdmin.from('leads').update({
                        nombre: args.nombre || undefined,
                        nombre_contacto: args.nombre_contacto || undefined,
                        telefono: args.telefono || undefined,
                        whatsapp: args.telefono || undefined,
                        email: args.email || undefined,
                        estado: 'ready_to_contact', // Promover estado porque ya tenemos datos
                        last_activity_at: new Date().toISOString()
                    }).eq('id', session.lead_id);

                    if (updateError) console.error('[save_lead] Error updating lead:', updateError);

                    return {
                        result: JSON.stringify({ success: true, updated: true, message: 'Datos actualizados en lead existente' }),
                        prospectUpdates: {
                            prospect_name: args.nombre_contacto || args.nombre,
                            prospect_phone: args.telefono,
                            prospect_company: args.nombre
                        }
                    };
                }

                // Lead NO existe aún, solo guardamos en memoria
                // Se creará cuando el usuario dé el sitio web
                return {
                    result: JSON.stringify({ success: true, saved_to_session: true, message: 'Datos guardados. Cuando me des el sitio web, creo el lead completo.' }),
                    prospectUpdates: {
                        prospect_name: args.nombre_contacto || args.nombre,
                        prospect_phone: args.telefono,
                        prospect_company: args.nombre
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
                console.log('[escalate_to_human] Sending email to:', recipient, 'RESEND_KEY exists:', !!RESEND_API_KEY);

                if (RESEND_API_KEY) {
                    try {
                        const emailResponse = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                from: 'H0 Bot <bot@hojacero.cl>',
                                to: [recipient],
                                subject: subject,
                                html: `<p>Nombre: ${args.client_name}</p><p>Empresa: ${args.empresa || 'No especificada'}</p><p>WhatsApp: ${args.client_phone}</p><p>Razón: ${args.reason}</p><p>Resumen: ${args.summary || 'Sin resumen'}</p>`
                            })
                        });
                        const emailResult = await emailResponse.json();
                        console.log('[escalate_to_human] Email result:', emailResult);
                    } catch (emailError) {
                        console.error('[escalate_to_human] Email ERROR:', emailError);
                    }
                } else {
                    console.error('[escalate_to_human] RESEND_API_KEY NOT FOUND!');
                }

                await supabaseAdmin.from('sales_notifications').insert({
                    type: args.type === 'development' ? 'dev_escalation' : 'mkt_escalation',
                    session_id: sessionId,
                    message: `${args.client_name} assigned to ${args.type}`,
                    context: args,
                    status: 'pending'
                });

                // NUEVO: Actualizar lead a estado 'in_contact' cuando se escala
                if (sessionId) {
                    const { data: session } = await supabaseAdmin
                        .from('sales_agent_sessions')
                        .select('lead_id')
                        .eq('id', sessionId)
                        .single();

                    if (session?.lead_id) {
                        await supabaseAdmin.from('leads').update({
                            estado: 'in_contact',
                            pipeline_stage: 'contactado',
                            last_activity_at: new Date().toISOString()
                        }).eq('id', session.lead_id);
                    }
                }

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

    content += `\n\n## 📋 DATOS YA CAPTURADOS (VERDAD ABSOLUTA - LEE ESTO)\n`;
    content += `┌──────────────────────────────────────────────┐\n`;

    if (prospectData.prospect_name) {
        content += `│ ✅ NOMBRE: ${prospectData.prospect_name} (¡NO LO PIDAS!)\n`;
    } else {
        content += `│ ❓ Nombre: No capturado\n`;
    }

    if (prospectData.prospect_phone) {
        content += `│ ✅ WHATSAPP: ${prospectData.prospect_phone} (¡NO LO PIDAS!)\n`;
    } else {
        content += `│ ❓ WhatsApp: No capturado\n`;
    }

    if (prospectData.prospect_company) {
        content += `│ ✅ EMPRESA: ${prospectData.prospect_company}\n`;
    } else {
        content += `│ ❓ Empresa: No capturada\n`;
    }

    if (prospectData.prospect_website) {
        content += `│ ✅ SITIO: ${prospectData.prospect_website}\n`;
    }

    content += `└──────────────────────────────────────────────┘\n`;

    // Reglas derivadas según lo que ya tenemos
    const tieneNombre = !!prospectData.prospect_name;
    const tieneTelefono = !!prospectData.prospect_phone;

    if (tieneNombre && tieneTelefono) {
        content += `\n🚫 PROHIBIDO: Volver a pedir nombre o WhatsApp. YA LOS TIENES ARRIBA.\n`;
        content += `✅ PERMITIDO: Si el usuario pide hablar con alguien, USA escalate_to_human directamente.\n`;
    } else if (tieneNombre) {
        content += `\n🚫 PROHIBIDO: Pedir el nombre otra vez. Ya lo tienes.\n`;
    } else if (tieneTelefono) {
        content += `\n🚫 PROHIBIDO: Pedir el WhatsApp otra vez. Ya lo tienes.\n`;
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
        const supabaseAdmin = getAdminClient();
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

                    // ★ PERSIST TO DATABASE (FIX MEMORY BUG) ★
                    // Si no persistimos, el bot "olvida" datos entre mensajes
                    if (sessionId) {
                        await supabaseAdmin.from('sales_agent_sessions').update({
                            prospect_name: prospectData.prospect_name || null,
                            prospect_phone: prospectData.prospect_phone || null,
                            prospect_company: prospectData.prospect_company || null,
                            prospect_website: prospectData.prospect_website || null,
                            updated_at: new Date().toISOString()
                        }).eq('id', sessionId);
                    }
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
