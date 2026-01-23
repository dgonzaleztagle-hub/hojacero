# 🤖 Plan de Refactorización - Bot de Ventas H0

**Fecha:** 2026-01-23
**Estado:** PENDIENTE
**Autor:** Sistema + Daniel

---

## 📋 Resumen de Problemas Detectados

| # | Problema | Impacto | Prioridad |
|---|----------|---------|-----------|
| 1 | No detecta clientes HojaCero existentes | Ofrece rediseño a nuestros propios clientes | 🔴 CRÍTICO |
| 2 | Memoria de pez - pierde datos ya capturados | Pide WhatsApp/nombre múltiples veces | 🔴 CRÍTICO |
| 3 | Score numérico sin contexto | Usuario no entiende "tienes un 20" | 🟠 ALTO |
| 4 | No diferencia tipos de sitio | No sabe si es tienda, webapp, estático | 🟠 ALTO |
| 5 | No crea lead automáticamente | Requiere llamar save_lead manualmente | 🟡 MEDIO |
| 6 | Agendamiento falla silenciosamente | Promete reuniones sin confirmar | 🟠 ALTO |
| 7 | No busca en pipeline existente | No detecta leads duplicados | 🟡 MEDIO |
| 8 | Dos análisis separados (diagnóstico + auditoría) | Inconsistente, confuso | 🟡 MEDIO |

---

## 🎯 Objetivo Final

El bot debe comportarse así:

```
Usuario: "Tengo un sitio apimiel.cl"
    ↓
[Sistema detecta que es cliente HojaCero]
Bot: "¡Hola! Veo que ya eres cliente de HojaCero 👋 ¿En qué te puedo ayudar hoy?"
    ↓
Usuario: "Quiero mejorar algo del sitio"
Bot: "Perfecto, ¿me pasas tu nombre y WhatsApp para que Daniel te contacte directamente?"
```

```
Usuario: "Mi sitio es zapateriajuan.cl"
    ↓
[Sistema detecta: sitio estático, WordPress viejo, NO es cliente]
Bot: "Vi tu sitio. Se ve que funciona, pero carga un poco lento y el diseño podría modernizarse para atraer más clientes. ¿Te cuento cómo podemos ayudarte?"
```

```
Usuario: "Tengo tienda online mitienda.cl"
    ↓
[Sistema detecta: e-commerce con WooCommerce]
Bot: "Veo que tienes una tienda online. Proyectos de e-commerce son más complejos y vale la pena hablar en detalle. ¿Te parece si agendamos 15 min con nuestro equipo?"
```

---

## 🔧 CAMBIOS A IMPLEMENTAR

### FASE 1: Datos Persistentes (Memoria del Bot)
**Archivos:** `app/api/sales-agent/chat/route.ts`

1. **Al inicio del handler**, si existe sesión:
   ```typescript
   // Recuperar datos capturados previamente
   const { data: sessionData } = await supabaseAdmin
     .from('sales_agent_sessions')
     .select('prospect_name, prospect_phone, prospect_company, prospect_website, lead_id')
     .eq('id', sessionId)
     .single();
   ```

2. **Inyectar en el system prompt**:
   ```typescript
   if (sessionData?.prospect_name) {
     systemContent += `
     
   ## DATOS YA CAPTURADOS (NO VOLVER A PEDIR)
   - Nombre: ${sessionData.prospect_name}
   - WhatsApp: ${sessionData.prospect_phone || 'NO CAPTURADO AÚN'}
   - Empresa: ${sessionData.prospect_company || 'NO CAPTURADO AÚN'}
   - Sitio Web: ${sessionData.prospect_website || 'NO CAPTURADO AÚN'}
   `;
   }
   ```

3. **Actualizar `save_lead` para también actualizar la sesión**:
   ```typescript
   // Después de guardar el lead, actualizar la sesión
   await supabaseAdmin.from('sales_agent_sessions').update({
     prospect_name: args.nombre_contacto || args.nombre,
     prospect_phone: args.telefono,
     prospect_company: args.nombre,
     prospect_website: args.sitio_web,
     lead_id: lead.id
   }).eq('id', sessionId);
   ```

4. **Agregar columnas a `sales_agent_sessions`**:
   ```sql
   ALTER TABLE sales_agent_sessions ADD COLUMN IF NOT EXISTS prospect_name TEXT;
   ALTER TABLE sales_agent_sessions ADD COLUMN IF NOT EXISTS prospect_phone TEXT;
   ALTER TABLE sales_agent_sessions ADD COLUMN IF NOT EXISTS prospect_company TEXT;
   ALTER TABLE sales_agent_sessions ADD COLUMN IF NOT EXISTS prospect_website TEXT;
   ALTER TABLE sales_agent_sessions ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id);
   ```

---

### FASE 2: Análisis Unificado de Sitios
**Archivos:** `utils/radar.ts`, `app/api/sales-agent/chat/route.ts`

1. **Nueva función: `unifiedSiteAnalysis`**
   
   ```typescript
   interface UnifiedAnalysis {
     // Clasificación técnica
     siteType: 'static' | 'dynamic' | 'ecommerce' | 'webapp' | 'none';
     complexity: 'simple' | 'medium' | 'complex';
     
     // Detección especial
     isHojaCeroClient: boolean;
     hasStore: boolean;
     hasBackend: boolean;
     hasLogin: boolean;
     
     // Stack detectado
     techStack: string[];
     hasSSL: boolean;
     
     // Oportunidad de negocio
     opportunity: {
       type: 'landing' | 'redesign' | 'custom' | 'maintenance' | 'none';
       confidence: 'high' | 'medium' | 'low';
       reason: string;
     };
     
     // Para el bot
     conversation: {
       opener: string;
       observation: string;
       softOffer: string;
     };
     
     // Contactos encontrados
     contacts: {
       emails: string[];
       whatsapp: string | null;
       instagram: string | null;
     };
   }
   ```

2. **Detectar cliente HojaCero en el scraper**:
   ```typescript
   // En extractDataFromHtml()
   const htmlLower = html.toLowerCase();
   const isHojaCeroClient = 
     htmlLower.includes('hojacero') || 
     htmlLower.includes('designed by hojacero') ||
     htmlLower.includes('hoja cero') ||
     htmlLower.includes('<!-- h0 -->');
   ```

3. **Detectar tipo de sitio**:
   ```typescript
   // Detección de e-commerce
   const hasStore = 
     htmlLower.includes('add-to-cart') ||
     htmlLower.includes('añadir al carrito') ||
     htmlLower.includes('woocommerce') ||
     htmlLower.includes('shopify') ||
     htmlLower.includes('/cart') ||
     htmlLower.includes('precio') && htmlLower.includes('comprar');
   
   // Detección de backend/webapp
   const hasBackend =
     htmlLower.includes('login') ||
     htmlLower.includes('iniciar sesión') ||
     htmlLower.includes('dashboard') ||
     htmlLower.includes('admin') ||
     htmlLower.includes('my-account');
   
   // Clasificación final
   let siteType: 'static' | 'dynamic' | 'ecommerce' | 'webapp' = 'static';
   if (hasStore) siteType = 'ecommerce';
   else if (hasBackend) siteType = 'webapp';
   else if (techStack.includes('Next.js') || techStack.includes('React')) siteType = 'dynamic';
   ```

4. **Generar oportunidad y conversación con IA**:
   - Simplificar el prompt de IA para que genere SOLO:
     - `opportunity.type`
     - `opportunity.reason`
     - `conversation` (opener, observation, softOffer)
   - Eliminar el concepto de "score numérico"

---

### FASE 3: Mejora del Prompt del Bot
**Archivo:** `app/api/sales-agent/chat/route.ts`

**Nuevo System Prompt:**

```typescript
const SYSTEM_PROMPT = `
# IDENTIDAD
Eres H0, el asistente de HojaCero, agencia de diseño web premium en Chile.
Hablas como un amigo que sabe de tecnología, no como vendedor.

# REGLAS DE ORO
1. **NUNCA pidas datos que ya tienes** - Revisa los DATOS CAPTURADOS antes de preguntar
2. **Respuestas cortas** - Máximo 3 oraciones por mensaje
3. **No uses jerga técnica** - "Tu sitio carga lento" en vez de "TTFB de 2s"
4. **Sé honesto** - Si el sitio está bien, dilo. No inventes problemas.

# FLUJO DE CONVERSACIÓN

## Si es CLIENTE HOJACERO
→ "¡Hola! Veo que ya eres cliente nuestro 👋 ¿En qué te puedo ayudar?"
→ Si necesita algo → pedir WhatsApp y derivar a Daniel

## Si tiene TIENDA ONLINE (e-commerce)
→ "Veo que tienes tienda online. Estos proyectos son más complejos, ¿te parece si agendamos 15 min para ver opciones?"
→ Derivar a Daniel (proyectos custom)

## Si tiene SITIO ESTÁTICO con problemas
→ Mencionar 1-2 observaciones específicas (no técnicas)
→ Ofrecer diagnóstico gratuito o llamada

## Si tiene SITIO MODERNO funcionando bien
→ "Tu sitio se ve muy bien. ¿Hay algo específico que quieras mejorar?"
→ No empujar si no hay necesidad real

## Si NO tiene sitio
→ "¿Es un negocio nuevo o ya tienen presencia en otro lado (Instagram, etc)?"
→ Ofrecer landing $150 USD como primera opción

# DERIVACIONES
- **Proyectos Web/Técnicos** → Daniel
- **Marketing/Publicidad** → Gastón
- SIEMPRE capturar WhatsApp ANTES de derivar

# SERVICIOS (usa cuando pregunten precio)
- Landing simple: $150 USD (todo incluido)
- Rediseño: desde $300 USD
- E-commerce: Consultar (proyecto custom)
- Mantención: $30 USD/mes

# HERRAMIENTAS
- diagnose_website: Analiza una URL (espera el resultado antes de responder)
- save_lead: Guarda contacto (usar cuando tengas nombre + WhatsApp)
- check_availability: Ver horarios disponibles
- book_meeting: Agendar reunión (solo si check_availability funcionó)
- escalate_to_human: Derivar a Daniel o Gastón

# IMPORTANTE
- NUNCA confirmes reunión sin que book_meeting sea exitoso
- NUNCA menciones herramientas o errores técnicos al usuario
- Si algo falla, di: "Déjame tus datos y te contactamos directamente"
`;
```

---

### FASE 4: Fix del Agendamiento
**Archivos:** `app/api/agenda/availability/route.ts`, `app/api/agenda/events/route.ts`

1. **Revisar permisos de Supabase** para `agenda_events`
2. **Agregar logs** para debuggear fallos
3. **Mejorar respuesta de error** del bot cuando falla:
   ```typescript
   case 'check_availability': {
     try {
       // ... código actual ...
     } catch (err: any) {
       console.error('check_availability failed:', err);
       return JSON.stringify({ 
         success: false, 
         fallback: true,
         message: 'No pude verificar la agenda. ¿Me das tu WhatsApp y te confirmamos el horario?'
       });
     }
   }
   ```

---

### FASE 5: Auto-crear Lead en Pipeline
**Archivo:** `app/api/sales-agent/chat/route.ts`

En `diagnose_website`, después de analizar:

```typescript
// Si encontramos URL + tenemos sesión, crear/actualizar lead automáticamente
if (sessionId) {
  const { data: existingLead } = await supabaseAdmin
    .from('leads')
    .select('id')
    .ilike('sitio_web', `%${baseUrl}%`)
    .single();

  if (!existingLead) {
    // Crear lead nuevo
    const { data: newLead } = await supabaseAdmin.from('leads').insert({
      nombre: extractDomainName(args.url),
      sitio_web: args.url,
      fuente: 'chat_bot',
      pipeline_stage: 'radar',
      source_data: {
        analysis: result,
        chat_session: sessionId
      }
    }).select().single();
    
    // Asociar a la sesión
    if (newLead) {
      await supabaseAdmin.from('sales_agent_sessions')
        .update({ lead_id: newLead.id, prospect_website: args.url })
        .eq('id', sessionId);
    }
  }
}
```

---

## 📊 Checklist de Implementación

- [ ] **FASE 1:** Datos persistentes en sesión
  - [ ] Agregar columnas a `sales_agent_sessions`
  - [ ] Recuperar datos al inicio del handler
  - [ ] Inyectar en system prompt
  - [ ] Actualizar sesión en `save_lead`

- [ ] **FASE 2:** Análisis unificado
  - [ ] Agregar detección HojaCero en scraper
  - [ ] Agregar detección tipo de sitio (static/ecommerce/webapp)
  - [ ] Crear función `unifiedSiteAnalysis`
  - [ ] Eliminar score numérico, usar oportunidades

- [ ] **FASE 3:** Nuevo prompt del bot
  - [ ] Reescribir SYSTEM_PROMPT
  - [ ] Agregar reglas para cada tipo de sitio
  - [ ] Mejorar ejemplos de respuesta

- [ ] **FASE 4:** Fix agendamiento
  - [ ] Agregar logs de debug
  - [ ] Verificar permisos Supabase
  - [ ] Mejorar fallback cuando falla

- [ ] **FASE 5:** Auto-crear lead
  - [ ] Buscar lead existente por URL
  - [ ] Crear si no existe
  - [ ] Asociar a sesión

---

## 🧪 Tests a Realizar

1. **Test: Cliente HojaCero**
   - Input: "Tengo el sitio apimiel.cl"
   - Expected: Bot detecta que es cliente y NO ofrece rediseño

2. **Test: Memoria de datos**
   - Input: "Soy Daniel, mi WhatsApp es 912345678"
   - Input: (siguiente mensaje) "Quiero una página"
   - Expected: Bot NO vuelve a pedir nombre ni WhatsApp

3. **Test: Tienda online**
   - Input: "Mi sitio es mitienda.cl" (con WooCommerce)
   - Expected: Bot detecta e-commerce y ofrece llamada, no landing de $150

4. **Test: Agendamiento**
   - Input: "Quiero agendar una llamada para el lunes a las 11"
   - Expected: Bot confirma horario SOLO si book_meeting fue exitoso

5. **Test: Lead duplicado**
   - Input: Análisis de URL que ya existe en pipeline
   - Expected: No crear lead duplicado, usar el existente

---

## 📁 Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `utils/radar.ts` | Agregar detección HojaCero y tipo de sitio |
| `app/api/sales-agent/chat/route.ts` | Inyectar datos sesión, nuevo prompt, auto-lead |
| `supabase/migrations/NUEVO.sql` | Agregar columnas a sales_agent_sessions |
| `app/api/agenda/availability/route.ts` | Agregar logs de debug |
| `app/api/agenda/events/route.ts` | Agregar logs de debug |

---

## ⏱️ Estimación

| Fase | Tiempo |
|------|--------|
| Fase 1 | 30 min |
| Fase 2 | 45 min |
| Fase 3 | 20 min |
| Fase 4 | 15 min |
| Fase 5 | 20 min |
| Testing | 30 min |
| **TOTAL** | **~2.5 horas** |
