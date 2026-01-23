# 🧠 REESTRUCTURACIÓN COMPLETA DE IA EN HOJACERO

**Fecha:** 2026-01-23
**Estado:** EN PROGRESO
**Modelo Elegido:** `gpt-4o-mini` (OpenAI)
**API Key:** Configurada en `.env.local` como `OPENAI_API_KEY`

---

## 📋 CONTEXTO DEL PROYECTO

### **¿Qué es HojaCero?**
Agencia de diseño web y marketing digital chilena. Tiene un sistema interno con:
- **Radar:** Escanea negocios y analiza su presencia digital
- **Chatbot H0:** Bot de ventas en hojacero.cl
- **Generador de Templates:** Crea emails y WhatsApp personalizados

### **Problema Actual:**
- Todo usaba Groq (tokens agotados) y OpenRouter (límites)
- Modelos 70B innecesariamente pesados y caros
- Sin optimización de historial (explota tokens)
- Análisis imprecisos que no ayudan a tomar decisiones

### **Objetivo:**
Migrar todo a OpenAI `gpt-4o-mini` con optimizaciones para:
- Máxima eficiencia de tokens
- Análisis accionables
- Chatbot que cierre ventas

---

## 💰 PRESUPUESTO

- **Cargado:** $5 USD en OpenAI
- **Uso estimado mensual:** ~$0.80 USD (~$760 CLP)
- **Duración estimada:** ~6 meses

---

## 🏗️ FASE 1: INFRAESTRUCTURA CENTRALIZADA

### **Tarea 1.1: Crear Cliente Centralizado de IA**

**Archivo:** `utils/ai-client.ts`

**Contenido:**
```typescript
import OpenAI from 'openai';

// Cliente OpenAI centralizado
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Modelo por defecto
export const DEFAULT_MODEL = 'gpt-4o-mini';

// Helper para chat con reintentos
export async function chatCompletion(options: {
    messages: any[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: { type: 'json_object' } | { type: 'text' };
    tools?: any[];
}) {
    const { messages, model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 1024, responseFormat, tools } = options;
    
    try {
        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            ...(responseFormat && { response_format: responseFormat }),
            ...(tools && { tools, tool_choice: 'auto' })
        });
        
        return response;
    } catch (error: any) {
        console.error('[AI Client Error]:', error.message);
        throw error;
    }
}

// Helper para limitar historial de chat (ahorro ~70% tokens)
export function limitChatHistory(messages: any[], maxMessages: number = 6): any[] {
    if (messages.length <= maxMessages) return messages;
    
    // Siempre mantener el primer mensaje (system) si existe
    const systemMessage = messages.find(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');
    
    // Tomar los últimos N mensajes
    const recentMessages = nonSystemMessages.slice(-maxMessages);
    
    return systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
}

// Helper para inyectar fecha actual (Chile)
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
```

**Estado:** [ ] Pendiente

---

## 🤖 FASE 2: MIGRAR CHATBOT H0

### **Tarea 2.1: Reescribir Chatbot con OpenAI**

**Archivo:** `app/api/sales-agent/chat/route.ts`

### **Reglas de Negocio del Chatbot:**

#### **Identidad:**
- Es el asistente de ventas de **HojaCero**
- Tono: **Semiformal, seguro, "nosotros lo resolvemos"**
- Idioma: **Solo español (Chile)**
- Joven pero profesional

#### **Servicios y Precios:**
- **Sitio estático/landing:** $150 USD (Factory)
- **Mantención:** Variable según cliente (no detallar en chat)
- **Objetivo:** Cerrar la mayor cantidad de clientes con recurrencia mensual

#### **Horarios:**
- Lunes a Viernes: 11:00 - 19:00 (Chile)
- Fuera de horario: Agendar para día siguiente
- Madrugada: Agendar para mañana siguiente

#### **Derivaciones:**
- **Desarrollo/Web** → Email a Daniel (daniel@hojacero.cl)
- **Marketing/Ads** → Email a Gastón (gaston@hojacero.cl)
- **Datos requeridos antes de derivar:**
  - Nombre del contacto
  - Nombre de la empresa
  - WhatsApp (NO teléfono fijo)

#### **Respuestas Específicas:**
- **Competencia:** "Nos consideramos tope de línea en diseño e implementación. Nuestros proyectos funcionando nos avalan."
- **Precios detallados:** Solo mencionar $150 USD para landing. Para proyectos complejos, agendar llamada.

#### **Tools (Function Calling):**
1. `diagnose_website` - Analizar sitio del prospecto
2. `check_availability` - Ver disponibilidad en agenda
3. `book_meeting` - Agendar reunión
4. `save_lead` - Guardar lead en CRM
5. `escalate_to_human` - Derivar a Daniel o Gastón

#### **Optimizaciones:**
- Limitar historial a **6 mensajes** (ahorro ~70% tokens)
- Inyectar fecha actual en system prompt
- Usar `gpt-4o-mini` con function calling nativo

**Estado:** [ ] Pendiente

---

## 🔍 FASE 3: MIGRAR RADAR DISCOVERY

### **Tarea 3.1: Mejorar Análisis Rápido**

**Archivo:** `utils/radar.ts` → función `analyzeLeadWithGroq` (renombrar a `analyzeLead`)

### **Enfoque del Análisis:**
- Páginas **estáticas o de publicidad**
- Identificar páginas **feas/antiguas** que necesitan modernización
- Output claro de "SÍ vale la pena" o "NO vale la pena"

### **Campos de Output:**
```json
{
    "score": 0-100,
    "verdict": "CONTACTAR" | "DESCARTAR" | "REVISAR",
    "vibe": "Premium | Moderno | Profesional | Local | Desactualizado | Inexistente",
    "buyerPersona": "Descripción del cliente ideal del prospecto",
    "painPoints": ["problema1", "problema2"],
    "opportunity": "Tipo de servicio que podemos vender",
    "hook": "Frase de apertura para contactar",
    "estimatedValue": "Bajo | Medio | Alto | Premium",
    "recommendedChannel": "WhatsApp | Email | Llamada"
}
```

### **Reglas de Scoring:**
- 0-30: Sitio excelente (no necesita nada) → "DESCARTAR"
- 31-60: Sitio mejorable → "REVISAR"
- 61-100: Sitio feo/antiguo/inexistente → "CONTACTAR"

**Estado:** [ ] Pendiente

---

## 🕵️ FASE 4: MIGRAR AUDITORÍA PROFUNDA

### **Tarea 4.1: Reescribir Deep Analysis**

**Archivo:** `app/api/radar/analyze/route.ts`

### **Objetivo:**
Análisis que permita "no hacer nada excepto leer para tomar decisiones"

### **Output Esperado:**
```json
{
    "seoScore": 0-100,
    "verdict": "CONTACTAR URGENTE" | "CONTACTAR" | "REVISAR" | "DESCARTAR",
    "executiveSummary": "Resumen en 2 oraciones de qué pasa con este negocio",
    
    "technicalIssues": [
        { "issue": "Sin SSL", "severity": "Alta", "impact": "Inseguro para clientes" }
    ],
    
    "designAnalysis": {
        "isOutdated": true/false,
        "yearsOld": "Estimado de antigüedad",
        "worstProblems": ["Colores", "Tipografía", "Layout"]
    },
    
    "buyerPersona": "Cliente ideal del prospecto explicado simple",
    
    "salesStrategy": {
        "hook": "Frase de apertura personalizada",
        "painPoints": ["Dolor 1", "Dolor 2", "Dolor 3"],
        "proposedSolution": "Lo que podemos ofrecerles",
        "estimatedValue": "Bajo | Medio | Alto | Premium",
        "closingAngle": "Ángulo de cierre sugerido"
    },
    
    "actionPlan": {
        "priority": "Urgente | Esta semana | Puede esperar",
        "recommendedChannel": "WhatsApp | Email",
        "bestTimeToContact": "Horario sugerido",
        "nextStep": "Qué hacer ahora mismo"
    },
    
    "competitors": ["Competidor 1", "Competidor 2"],
    "missingKeywords": ["keyword1", "keyword2"]
}
```

### **Optimizaciones:**
- Reducir `htmlPreview` de 1000 a 500 chars
- Usar `response_format: { type: "json_object" }`
- Prompt más estructurado y conciso

**Estado:** [ ] Pendiente

---

## 📱 FASE 5: MIGRAR TEMPLATES

### **Tarea 5.1: Reescribir Generador de Templates**

**Archivo:** `app/api/radar/template/route.ts`

### **Tono General:**
- Semiformal
- Seguro y con actitud
- "Nosotros lo resolvemos"
- Joven pero profesional

### **Firma:**
- Siempre del usuario logueado
- Formato completo para marcar autoridad

### **WhatsApp (max 60 palabras):**
- Opener personal
- Hook basado en pain point
- CTA de baja fricción

### **Email (max 150 palabras):**
- Asunto corto e intrigante
- Personalizado al negocio
- Sin palabras de relleno
- CTA claro

### **Optimizaciones:**
- `max_tokens`: WhatsApp = 150, Email = 300
- Usar `gpt-4o-mini`
- Prompts más concisos

**Estado:** [ ] Pendiente

---

## 🚀 FASE 6: DEPLOY Y QA

### **Tarea 6.1: Variables de Entorno en Vercel**
- Agregar `OPENAI_API_KEY` a Vercel

### **Tarea 6.2: Push y Redeploy**
- Commit con mensaje descriptivo
- Push a main
- Verificar deploy en Vercel

### **Tarea 6.3: QA Final**
- [ ] Probar chatbot en hojacero.cl
- [ ] Probar diagnóstico de lead
- [ ] Probar auditoría profunda
- [ ] Probar generación de WhatsApp
- [ ] Probar generación de Email
- [ ] Verificar costos en dashboard de OpenAI

**Estado:** [ ] Pendiente

---

## 📊 PROGRESO GENERAL

| Fase | Estado |
|------|--------|
| 1. Infraestructura | [x] COMPLETADO |
| 2. Chatbot H0 | [x] COMPLETADO |
| 3. Radar Discovery | [x] COMPLETADO |
| 4. Auditoría Profunda | [x] COMPLETADO |
| 5. Templates | [x] COMPLETADO |
| 6. Deploy y QA | [ ] EN PROGRESO |

---

## 📝 NOTAS ADICIONALES

### **Emails de derivación:**
- Daniel (Dev): daniel@hojacero.cl
- Gastón (Marketing): gaston@hojacero.cl

### **Horarios de atención:**
- L-V: 11:00 - 19:00 Chile
- Fuera de horario: Agendar para día siguiente

### ** Precio estándar:**
- Sitio estático/landing: $150 USD

### **Tono de marca:**
- Semiformal
- Seguro, con actitud
- "Nosotros lo resolvemos"
- Joven pero profesional
