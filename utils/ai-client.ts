import OpenAI from 'openai';

// ===========================================
// CLIENTE CENTRALIZADO DE IA - HOJACERO
// Modelo: gpt-4o-mini (OpenAI)
// ===========================================

// Cliente OpenAI
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Modelo por defecto
export const DEFAULT_MODEL = 'gpt-4o-mini';

// Tipos
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: any[];
}

// ===========================================
// HELPER: Chat Completion con manejo de errores
// ===========================================
export async function chatCompletion(options: {
    messages: ChatMessage[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'json_object' } | { type: 'text' };
    tools?: any[];
    toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}) {
    const {
        messages,
        model = DEFAULT_MODEL,
        temperature = 0.7,
        maxTokens = 1024,
        responseFormat,
        tools,
        toolChoice = 'auto'
    } = options;

    try {
        const response = await openai.chat.completions.create({
            model,
            messages: messages as any,
            temperature,
            max_tokens: maxTokens,
            ...(responseFormat && { response_format: responseFormat }),
            ...(tools && tools.length > 0 && { tools, tool_choice: toolChoice })
        });

        return response;
    } catch (error: any) {
        console.error('[AI Client Error]:', error.message);
        throw error;
    }
}

// ===========================================
// HELPER: Limitar historial de chat (ahorro ~70% tokens)
// ===========================================
export function limitChatHistory(messages: ChatMessage[], maxMessages: number = 6): ChatMessage[] {
    if (messages.length <= maxMessages) return messages;

    // Siempre mantener el primer mensaje (system) si existe
    const systemMessage = messages.find(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    // Tomar los últimos N mensajes
    const recentMessages = nonSystemMessages.slice(-maxMessages);

    return systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
}

// ===========================================
// HELPER: Inyectar fecha actual (Chile)
// ===========================================
export function getCurrentDatePrompt(): string {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Santiago'
    });
    return `FECHA Y HORA ACTUAL: ${fecha} (Chile). Usa esta fecha para calcular "mañana", "próximo lunes", etc.`;
}

// ===========================================
// HELPER: Verificar si estamos en horario de atención
// ===========================================
export function isWithinBusinessHours(): { inHours: boolean; message: string } {
    const now = new Date();
    const chileTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Santiago' }));

    const hour = chileTime.getHours();
    const day = chileTime.getDay(); // 0 = Domingo, 6 = Sábado

    // L-V 11:00 - 19:00
    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHour = hour >= 11 && hour < 19;

    if (isWeekday && isBusinessHour) {
        return { inHours: true, message: '' };
    }

    // Calcular próximo día hábil
    let nextBusinessDay = 'mañana';
    if (day === 5 && hour >= 19) nextBusinessDay = 'el lunes';  // Viernes después de horario
    if (day === 6) nextBusinessDay = 'el lunes';  // Sábado
    if (day === 0) nextBusinessDay = 'mañana';    // Domingo

    const message = hour < 11
        ? `Estamos disponibles a partir de las 11:00. Te contactaremos hoy en cuanto abramos.`
        : `Nuestro horario es de 11:00 a 19:00 (L-V). Te contactaremos ${nextBusinessDay}.`;

    return { inHours: false, message };
}

// ===========================================
// HELPER: Análisis JSON seguro
// ===========================================
export function parseJsonSafe<T>(content: string, fallback: T): T {
    try {
        // Intentar parsear directamente
        return JSON.parse(content);
    } catch {
        // Intentar extraer JSON de markdown
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim());
            } catch {
                return fallback;
            }
        }
        return fallback;
    }
}
