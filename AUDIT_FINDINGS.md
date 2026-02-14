# 🔍 AUDITORÍA CRÍTICA DE HojaCero - HALLAZGOS REALES

**Fecha:** 6 de Febrero de 2026  
**Auditor:** Jarvis (análisis de ingeniería)  
**Conclusión:** Sistema robusto pero con vulnerabilidades operacionales y resiliencia débil ante fallos

---

## ✅ Actualización Ejecutada (14 de Febrero de 2026)

### Cambios aplicados sin romper lógica:
- Modularización territorial en `app/api/territorial/analyze/route.ts` hacia:
  - `lib/territorial/cache.ts`
  - `lib/territorial/poi-sources.ts`
  - `lib/territorial/synthesis.ts`
  - `lib/territorial/query-builder.ts`
  - `lib/territorial/prompts/legacy-plan-prompts.ts`
  - `lib/territorial/types.ts`
- Eliminación de función huérfana `getCompetitorsAllCategories` (no tenía llamadas).
- Tipado mínimo seguro y limpieza de `any`/casts en `app/api/territorial/analyze/route.ts`.
- Remoción de analizador OpenAI huérfano en `utils/radar.ts` para mantener costo cero en scraper/radar.

### Estado validado:
- Lint OK en archivos tocados (sin errores).
- Referencias a OpenAI fuera del chatbot: eliminadas del flujo scraper/radar.
- OpenAI queda únicamente en `utils/ai-client.ts` (usado por `app/api/sales-agent/chat/route.ts`).

---

## 1. 🐛 BUG CRÍTICO: ScraperEngine.scrapeBatch() - Dead Code Path

**Severidad:** MEDIUM (confusión, no data loss)  
**Archivo:** `utils/scraper-engine.ts` (líneas 65-102)

### Problema:
```typescript
// Línea 65-83: Primera intención (nunca se ejecuta)
for (const url of urls) {
    const p = this.fetchHtml(url, 3000).then(res => {
        results.push({ url, html: res.html });
    });
    executing.push(p);
    
    if (executing.length >= concurrency) {
        await Promise.race(executing); // ← Espera a UNO
        // Pero NUNCA elimina la promise del array
        // → executing sigue creciendo
    }
}

// Línea 88-102: Segunda intención (SOBRESCRIBE results)
const finalResults: { url: string, html: string | null }[] = [];
for (let i = 0; i < urls.length; i += concurrency) {
    const chunk = urls.slice(i, i + concurrency);
    const promises = chunk.map(url => this.fetchHtml(url, 3000)...);
    const chunkResults = await Promise.all(promises);
    finalResults.push(...chunkResults);  // ← Ignora "results" del loop anterior
}

return finalResults;  // ← Retorna segunda strategy, no la primera
```

### Impacto:
- El primer loop **se ejecuta pero sus resultados se ignoran**
- `executing[]` nunca se limpia → memory leak potencial en batches grandes
- Código comentado hace confundir al siguiente dev

### Fix Propuesto:
```typescript
static async scrapeBatch(urls: string[], concurrency: number = 3) {
    const results: { url: string, html: string | null }[] = [];
    
    for (let i = 0; i < urls.length; i += concurrency) {
        const chunk = urls.slice(i, i + concurrency);
        const promises = chunk.map(url => 
            this.fetchHtml(url, 3000).then(res => ({ url, html: res.html }))
        );
        const chunkResults = await Promise.all(promises);
        results.push(...chunkResults);
    }
    
    return results;
}
```

---

## 2. 🐛 BUG CRÍTICO: Radar /search - Promise.all() es Too Aggressive

**Severidad:** HIGH (puede fallar scans completos)  
**Archivo:** `app/api/radar/search/route.ts` (líneas 240-290)

### Problema:
```typescript
// Si 1 de 25 leads falla, todo Promise.all() falla
await Promise.all(
    newPlaces.map(async (place: any) => {
        try {
            const scraped = await scrapeContactInfo(place.website);
            const analysis = await fetchGroqAnalysis(...);  // ← Si Groq falla aquí
            // => Toda la búsqueda colapsa
        } catch (err) {
            console.error(`Error processing ${place.title}`, err);
            // ← Catch silencia pero Promise.all aún rechaza
        }
    })
);
```

### Impacto:
- Usuario escanea "restaurante en Santiago" → 25 lugares
- Lead #7 tiene website muerto → timeout → Groq nunca ejecuta
- Promise.all() rechaza → Respuesta 500 al usuario
- Los 24 leads que funcionaron → PERDIDOS, no se guardaron

### Resultado Real:
Usuario vuelve a intentar 3 veces, eventualmente obtiene 0 leads para la búsqueda.

### Fix Propuesto:
```typescript
// Usar Promise.allSettled() para resilencia
const processedLeads: any[] = [];
const results = await Promise.allSettled(
    newPlaces.map(async (place: any) => {
        const scraped = await scrapeContactInfo(place.website);
        const analysis = await fetchGroqAnalysis(...);
        return { scraped, analysis, place };
    })
);

results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
        processedLeads.push(result.value);  // ✅ Guardado
    } else {
        console.error(`Lead ${idx} failed:`, result.reason);  // ❌ Log pero continúa
    }
});

// Retorna los que funcionaron + errores
return NextResponse.json({
    success: true,
    leads: processedLeads,
    failed_count: results.filter(r => r.status === 'rejected').length
});
```

---

## 3. 🐛 BUG MEDIO: API Key Validation - Loose Checking

**Severidad:** MEDIUM (silent failures)  
**Archivo:** `app/api/radar/template/route.ts` (líneas 6-9) & otros

### Problema:
```typescript
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Check incorrecto:
if (!GROQ_API_KEY && !OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Falta configurar API de IA' }, { status: 500 });
}

// Pero qué pasa si GROQ_API_KEY = '' (string vacío)?
// !'' === true, pero en otros lugares:
if (process.env.RESEND_API_KEY === 're_123') {
    console.warn('Using placeholder...');
    return false;
}
```

### Impacto:
- Si env var falla a setear → `undefined` → `!undefined === true` ✅ (OK)
- Si env var es '' vacío → `!'' === true` ✅ (OK)
- Pero si Vercel expone default string como 're_123' → Groq intenta llamar con esa key
- Groq rechaza (invalid key) → Error genérico → Usuario ve "API Error"

### Mejor Práctica:
```typescript
const validateApiKey = (key: string | undefined, name: string): boolean => {
    if (!key || key === 're_123' || key === 'sk_test' || key.startsWith('placeholder')) {
        throw new Error(`Missing or invalid ${name} key`);
    }
    return true;
};

try {
    validateApiKey(process.env.GROQ_API_KEY, 'GROQ_API_KEY');
    // ... use key
} catch (e) {
    return NextResponse.json({
        error: e.message,  // ← Específico, no genérico
        requires: 'GROQ_API_KEY'
    }, { status: 503 });
}
```

---

## 4. 🐛 BUG CRÍTICO: LLM Fallback Chain Missing

**Severidad:** HIGH (no resilencia)  
**Archivo:** `app/api/radar/template/route.ts` (líneas 100-125)

### Problema:
```typescript
const useGroq = !!GROQ_API_KEY;
const apiUrl = useGroq
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

const response = await fetch(apiUrl, {
    // ... request
});

if (!response.ok) {
    throw new Error('Error en la API de IA');  // ← No intenta fallback
}
```

### Impacto:
- Groq cae (Groq es free tier, puede caer) → Error 500
- Código **no intenta OpenAI** como fallback
- Usuario no puede generar templates hasta que Groq se recupere

### Fix Propuesto:
```typescript
const tryLlmChain = async (prompt: string) => {
    const chain = [
        {
            name: 'groq',
            url: 'https://api.groq.com/openai/v1/chat/completions',
            key: process.env.GROQ_API_KEY,
            model: 'llama-3.1-8b-instant'
        },
        {
            name: 'openai',
            url: 'https://api.openai.com/v1/chat/completions',
            key: process.env.OPENAI_API_KEY,
            model: 'gpt-4o-mini'
        }
    ];
    
    for (const llm of chain) {
        try {
            const response = await fetch(llm.url, {
                headers: { 'Authorization': `Bearer ${llm.key}` },
                body: JSON.stringify({ model: llm.model, messages: [...], ... })
            });
            if (response.ok) return await response.json();
        } catch (e) {
            console.warn(`${llm.name} failed, trying next...`);
            continue;
        }
    }
    
    throw new Error('All LLM providers failed');
};
```

---

## 5. 🐛 BUG ALTO: Demo Tracking - No Input Validation

**Severidad:** HIGH (DB pollution)  
**Archivo:** `app/api/tracking/demo/route.ts` (línea 105-120)

### Problema:
```typescript
export async function POST(req: NextRequest) {
    const supabase = getAdminClient();
    const body = await req.json();
    const { prospecto, device_fingerprint, referrer } = body;

    if (!prospecto) {
        return NextResponse.json({ error: 'Prospecto requerido' }, { status: 400 });
    }
    
    // ← No valida si prospecto EXISTE en demos publicados
    // Cualquiera puede hacer:
    // POST /api/tracking/demo 
    // { prospecto: "fake-site-123", device_fingerprint: "..." }
}
```

### Impacto:
- Bot/attacker llena DB con 10k registros fake
- Métricas de tracking se contamina
- Dashboard muestra "1000 visitas falsas" para demo que no existe

### Fix:
```typescript
// Validar que prospecto existe
const { data: demoExists, error: fetchErr } = await supabase
    .from('prospectos')  // O tabla de demos publicadas
    .select('id')
    .eq('slug', prospecto)
    .single();

if (!demoExists) {
    return NextResponse.json({ 
        error: 'Prospecto no válido o no publicado' 
    }, { status: 404 });
}

// ← Recién ahora inserta
```

---

## 6. 🐛 BUG MEDIO: Email Audit Trail - Incomplete

**Severidad:** MEDIUM (compliance/debugging)  
**Archivo:** `app/api/send-email/route.ts`

### Problema:
```typescript
export async function POST(request: Request) {
    const supabase = createClient();  // ← Auth via session cookies
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { to, subject, html } = await request.json();
    
    await resend.emails.send({
        from: 'Hojacero <contacto@hojacero.cl>',
        to: [to],
        bcc: ['dgonzaleztagle@gmail.com', ...],
        subject, html
    });
    
    // ← NO HAY REGISTRO DE QUÉ USUARIO ENVIÓ QUÉ EMAIL
}
```

### Impacto:
- Email sent pero **no se registra quién lo envió ni cuándo**
- Si usuario borra su sesión → No hay audit trail
- Compliance: Si necesitas probar "quién envió email al lead X", imposible

### Fix:
```typescript
// Crear tabla: email_outbox
// {
//   id, user_id, lead_id, to, subject, 
//   sent_at, status, message_id, error
// }

const { data: emailRecord, error: insertErr } = await supabase
    .from('email_outbox')
    .insert([{
        user_id: user.id,
        lead_id: lead_id,  // ← Agregar lead_id si aplica
        to,
        subject,
        sent_at: new Date().toISOString()
    }])
    .select('id')
    .single();

const { id: messageId, error: sendErr } = await resend.emails.send({...});

if (sendErr) {
    await supabase
        .from('email_outbox')
        .update({ status: 'failed', error: sendErr.message })
        .eq('id', emailRecord.id);
} else {
    await supabase
        .from('email_outbox')
        .update({ status: 'sent', message_id: messageId })
        .eq('id', emailRecord.id);
}
```

---

## 7. 🐛 BUG ALTO: Killswitch - No Verification Endpoint

**Severidad:** HIGH (critical feature without healthcheck)  
**Archivo:** Arquitectura (falta un endpoint)

### Problema:
- Tabla `site_status` tiene `is_active = false`
- ¿Pero quién verifica que el sitio **realmente está offline**?
- Si Vercel env var falla a sincronizar, sitio sigue activo pero DB dice offline

### Impacto:
- Cliente no pagó → Aprietas SUSPENDER
- Sitio sigue funcionando porque Vercel no recibió la orden
- Cliente enojado: "Mi sitio sigue activo, ¿por qué lo bloqueaste?"

### Fix:
```typescript
// Crear endpoint: GET /api/vault/killswitch/verify/{clientId}
export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
    const supabase = createClient();
    
    // 1. Verificar DB state
    const { data: siteStatus } = await supabase
        .from('site_status')
        .select('is_active')
        .eq('id', params.clientId)
        .single();
    
    const isActiveDatabaseState = siteStatus?.is_active !== false;
    
    // 2. Verificar sitio REAL (hacer request)
    const { data: site } = await supabase
        .from('monitored_sites')
        .select('site_url')
        .eq('id', params.clientId)
        .single();
    
    const response = await fetch(`https://${site.site_url}`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
    }).catch(() => null);
    
    const isActiveInProduction = response?.ok ?? false;
    
    // 3. Comparar
    if (isActiveDatabaseState !== isActiveInProduction) {
        // ⚠️ ALERTA: Desincronización
        console.error(`KILLSWITCH MISMATCH for ${site.site_url}:
            DB says: ${isActiveDatabaseState}
            Production: ${isActiveInProduction}`);
    }
    
    return NextResponse.json({
        database_state: isActiveDatabaseState,
        production_state: isActiveInProduction,
        synced: isActiveDatabaseState === isActiveInProduction
    });
}

// Ejecutar cada 6 horas via cron
```

---

## 8. 🐛 BUG MEDIO: Email Inbox - Silent Parsing Failures

**Severidad:** MEDIUM (data quality)  
**Archivo:** `app/dashboard/inbox/page.tsx` (línea 65-95)

### Problema:
```typescript
const getCleanBody = (rawText: string) => {
    if (!rawText) return "";

    try {
        const decodeContent = (text: string, headers: string) => {
            if (/content-transfer-encoding:\s*quoted-printable/i.test(headers)) {
                return decodeQuotedPrintable(text);
            }
            return text;
        };
        // ... parsing logic
    } catch (e) {
        console.error("Error parsing email:", e);
        return "";  // ← Retorna string vacío
    }
};
```

### Impacto:
- Email llega con encoding roto → try/catch silencia
- Usuario abre inbox → ve el email pero cuerpo está vacío
- Usuario: "¿Por qué no veo el contenido?" → No hay forma de debuggear

### Fix:
```typescript
const getCleanBody = (rawText: string) => {
    if (!rawText) return "";
    
    try {
        // ... parsing logic
    } catch (e) {
        // Log detallado
        console.error("Email parsing FAILED:", {
            error: e.message,
            textLength: rawText.length,
            preview: rawText.substring(0, 200)
        });
        
        // Retornar con indicador
        return `[⚠️ Error de decodificación]: ${e.message}\n\n---Original (raw)---\n${rawText.substring(0, 500)}...`;
    }
};
```

---

## 9. 🐛 BUG BAJO: Missing env variables - Poor Diagnostics

**Severidad:** LOW (development burden)  
**Archivo:** Múltiples (`template/route.ts`, `tracking/demo`, etc.)

### Problema:
```typescript
if (!GROQ_API_KEY && !OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Falta configurar API de IA' }, { status: 500 });
}
```

**es muy genérico.** Dev no sabe cuál de las dos falta (o ambas).

### Fix:
```typescript
const missingVars = [];
if (!process.env.GROQ_API_KEY) missingVars.push('GROQ_API_KEY');
if (!process.env.OPENAI_API_KEY) missingVars.push('OPENAI_API_KEY');

if (missingVars.length > 0) {
    const suggestion = `Set in .env.local or Vercel dashboard:\n${missingVars.map(v => `  ${v}=your_key`).join('\n')}`;
    return NextResponse.json({
        error: 'Missing API keys',
        missing: missingVars,
        help: suggestion
    }, { status: 503 });
}
```

---

## 📊 RESUMEN DE SEVERIDAD

| # | Bug | Severidad | Impact | Fix Time |
|---|-----|-----------|--------|----------|
| 1 | ScraperEngine dead code | MEDIUM | Confusión mental | 15min |
| 2 | Promise.all() aggressive | **HIGH** | Fallos en scans | 20min |
| 3 | Loose API key checks | MEDIUM | Silent failures | 10min |
| 4 | No LLM fallback | **HIGH** | No resilencia | 30min |
| 5 | No tracking validation | **HIGH** | DB pollution | 15min |
| 6 | Incomplete audit trail | MEDIUM | Compliance | 25min |
| 7 | Killswitch no verify | **HIGH** | Critical feature gap | 45min |
| 8 | Silent email parsing | MEDIUM | UX confusion | 10min |
| 9 | Poor env diagnostics | LOW | Dev friction | 5min |

---

## 🎯 RECOMENDACIONES

### Inmediatas (esta semana):
1. Fix #2 (Promise.allSettled en Radar)
2. Fix #4 (LLM fallback chain)
3. Fix #5 (Tracking validation)

### Próximas (próximas 2 semanas):
1. Fix #7 (Killswitch verification endpoint)
2. Fix #6 (Email audit trail)
3. Fix #1 (Clean ScraperEngine)

### Nice-to-have:
1. Fix #3, #8, #9 (mejora DX/UX)

---

## Conclusión

**HojaCero es un sistema bien arquitectado**, pero tiene **puntos de fallo operacional**:
- Sin resilencia en cadenas críticas (Promise.all, LLM)
- Sin validación en puntos de entrada públicos (tracking)
- Sin visibilidad en features críticos (killswitch verification)

**No son bugs que rompan la app.** Son **goteras que se notan bajo presión** (muchos leads, API lento, attacker).

**3 semanas fue impresionante** pero falta el trabajo de producción: hardening, monitoring, fallbacks.

---

*Auditoría realizada por Jarvis | 6 Febrero 2026*

---

## ✅ Estado de Corrección (14 Febrero 2026)

### Bugs corregidos

1. **ScraperEngine dead code**: Corregido  
   - `utils/scraper-engine.ts` (`scrapeBatch` simplificado sin rama muerta)

2. **Radar search Promise.all agresivo**: Corregido  
   - `app/api/radar/search/route.ts` (migrado a `Promise.allSettled`, agrega `failed_count`)

3. **API key validation loose checking**: Corregido en rutas críticas Radar + Email  
   - `app/api/radar/search/route.ts`  
   - `app/api/radar/template/route.ts`  
   - `app/api/radar/analyze/route.ts`  
   - `app/api/radar/reanalyze/route.ts`  
   - `app/api/send-email/route.ts`

4. **LLM fallback chain missing**: Ajustado por política costo-cero (Groq-only fuera del bot)  
   - `app/api/radar/template/route.ts`  
   - `app/api/radar/analyze/route.ts`

5. **Demo tracking sin validación de input**: Corregido  
   - `app/api/tracking/demo/route.ts` (slug validation + verificación de demo publicado)

6. **Email audit trail incompleto**: Corregido  
   - `app/api/send-email/route.ts` (registro `email_outbox` no bloqueante)  
   - `supabase/migrations/20260214_email_outbox.sql` (tabla + índices + RLS)

7. **Killswitch sin endpoint de verificación**: Corregido  
   - `app/api/vault/killswitch/verify/[clientId]/route.ts`  
   - `app/api/vault/killswitch/verify-all/route.ts` (batch para cron)  
   - `vercel.json` (cron cada 6 horas: `/api/vault/killswitch/verify-all`)

8. **Email parsing con fallos silenciosos**: Corregido  
   - `app/dashboard/inbox/page.tsx` (`getCleanBody` ahora registra error y entrega fallback visible)

9. **Missing env vars con diagnóstico pobre**: Corregido en endpoints auditados  
   - Respuestas con `missing` / `requires` en rutas críticas.

---

## ✅ Cirugía Modal Pipeline (14 Febrero 2026)

### Alcance ejecutado
1. **Territorial removido del modal de leads**
   - Eliminado `components/lead-modal/ModalTabTerritorial.tsx`.
   - Eliminado export en `components/lead-modal/index.ts`.
   - Quitado del tipo de tabs en `hooks/useRadar.ts`.
   - Verificado: sin referencias activas de territorial dentro del modal de pipeline.

2. **Forense desacoplado de Diagnóstico/Auditoría**
   - `components/lead-modal/ModalTabForense.tsx` reescrito para consumir señales forenses reales (`source_data.kimi_forensics` + `source_data.scraped`).
   - Se elimina mezcla de conclusiones ejecutivas ajenas al contexto forense.
   - Añadida señal de desactualización forense cuando hay reanálisis.

3. **Diagnóstico limpiado de métrica absurda**
   - Removida tarjeta de “pérdida mensual” (no aplicaba a todos los modelos de negocio).
   - Reemplazo por snapshot forense operativo.

4. **Trabajo reorganizado por flujo operativo**
   - Nuevo orden: `Datos` → `Contacto` → `Seguimiento` → `Activo/Demo` → `Inteligencia` → `Activos`.
   - Selección inicial automática de subtab según estado y calidad de contacto.
   - Unificación de `leadId` (`id || db_id`) para operaciones de guardado/sync.
   - Reset correcto de estado interno al cambiar lead (plantillas, asunto, adjuntos, subtab).

5. **Consistencia de scoring y stale flags**
   - `utils/radar-helpers.ts` normaliza `scoreBreakdown` entre esquemas legacy y actual.
   - `hooks/useRadar.ts` marca `forensic_needs_refresh`/`deep_analysis_stale` en reanálisis y los limpia tras deep-audit.
   - `components/lead-modal/ModalTabAuditoria.tsx` muestra badge de “análisis desactualizado”.

### Smoke checklist (manual, post-cambio)
- [ ] Abrir lead sin email/teléfono y confirmar que `Trabajo` inicia en `Datos`.
- [ ] Guardar contacto y validar persistencia inmediata en modal y lista pipeline.
- [ ] En `Contacto`, generar plantilla WhatsApp y marcar contacto exitoso.
- [ ] Confirmar transición visual y de estado a `in_contact/contactado`.
- [ ] Crear acción en `Seguimiento` y validar `next_action_date` + `next_action_note`.
- [ ] Ejecutar `Reanalizar` y validar badge de desactualización en Auditoría.
- [ ] Ejecutar `Deep Audit` y validar limpieza de flags stale + refresco forense.
- [ ] En móvil, confirmar labels legibles de tabs (`Diagnóstico`, `Auditoría`, `Estrategia`, `Trabajo`, `Forense`).
