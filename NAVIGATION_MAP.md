# 🗺️ HojaCero - Mapa de Navegación Rápida

> **Propósito:** Guía para que la IA (y humanos) encuentren código rápidamente sin perderse.

---

## 📂 Estructura de Alto Nivel

```
hojacero/
├── app/                    # Next.js App Router (UI + API Routes)
├── lib/                    # Lógica de negocio (NO UI)
├── components/             # Componentes React compartidos
├── public/                 # Assets estáticos
└── .agent/                 # Workflows y skills de IA
```

---

## 🎯 Módulos Principales (Por Funcionalidad)

### **1. Territorial Intelligence** 🗺️
**Qué hace:** Análisis territorial para negocios (competencia, demografía, viabilidad)

**Archivos clave:**
```
📍 API Route:        app/api/territorial/route.ts
📍 Prompts:          lib/territorial/prompts/
📍 Scrapers:         lib/scrapers/
📍 UI Dashboard:     app/dashboard/territorial/page.tsx
📍 UI Cliente:       app/reporte/[reportId]/
```

**Flujo:**
1. Cliente ingresa dirección → `app/api/territorial/route.ts`
2. Scraping de datos → `lib/scrapers/`
3. Análisis con IA → `lib/territorial/prompts/`
4. Guardado en DB → Supabase `territorial_reports`
5. Visualización → `app/reporte/[reportId]/`

---

### **2. Radar (Lead Intelligence)** 🎯
**Qué hace:** Análisis de leads (presencia digital, competencia, scoring)

**Archivos clave:**
```
📍 API Route:        app/api/radar/route.ts
📍 Lógica:           lib/radar/
📍 UI Dashboard:     app/dashboard/page.tsx
📍 DB:               Supabase tabla `leads`
```

**Flujo:**
1. Lead ingresado → `app/api/radar/route.ts`
2. Scraping → `lib/scrapers/serper-scraper.ts`
3. Análisis → `lib/radar/`
4. Scoring → Dashboard

---

### **3. Food Engine** 🍔
**Qué hace:** Sistema de pedidos para restaurantes (ej: Donde Germain)

**Archivos clave:**
```
📍 Componentes:      components/food-engine/
📍 Lógica:           lib/food-engine/
📍 Ejemplo:          Donde Germain (proyecto separado)
```

**Uso:** Inyectable en proyectos de clientes vía `/worker-food-pro`

---

### **4. Factory (Generador de Sitios)** 🏭
**Qué hace:** Genera sitios multi-página para prospectos

**Archivos clave:**
```
📍 Workflows:        .agent/workflows/factory-*.md
📍 Skills:           .agent/skills/factory_lead/
📍 Templates:        (generados dinámicamente)
```

**Uso:** `/factory-final` → Genera sitio completo

---

### **5. CMS Autónomo** 📝
**Qué hace:** Gestión de contenido sin backend (GitHub API)

**Archivos clave:**
```
📍 API Routes:       app/api/cms/
📍 UI:               app/cms/
📍 Lógica:           lib/cms/
```

**Uso:** Clientes editan contenido → Commits a GitHub → Deploy automático

---

### **6. Ads Factory** 📢
**Qué hace:** Generador de landings para pauta publicitaria

**Archivos clave:**
```
📍 Workflow:         .agent/workflows/worker-ads-factory.md
📍 Templates:        (generados dinámicamente)
```

**Uso:** `/worker-ads-factory` → Landing optimizada para conversión

---

### **7. Vault (Gestión de Clientes)** 💼
**Qué hace:** CRM interno para clientes y proyectos

**Archivos clave:**
```
📍 UI:               app/vault/
📍 API:              app/api/vault/
📍 DB:               Supabase tabla `clients`
```

---

### **8. Pipeline (Automatización)** ⚙️
**Qué hace:** Procesamiento masivo de assets/data

**Archivos clave:**
```
📍 Workflow:         .agent/workflows/worker-automate.md
📍 Scripts:          (generados según necesidad)
```

---

## 🔍 Búsqueda Rápida por Problema

### **"Necesito cambiar cómo se calculan precios inmobiliarios"**
→ `lib/scrapers/portal-inmobiliario-scraper.ts`

### **"Necesito cambiar el prompt de Territorial"**
→ `lib/territorial/prompts/plan2-prompt.ts`

### **"Necesito cambiar la UI del reporte cliente"**
→ `app/reporte/[reportId]/components/`

### **"Necesito agregar nueva API"**
→ `app/api/[nombre]/route.ts`

### **"Necesito crear nuevo workflow"**
→ `.agent/workflows/[nombre].md`

---

## 🚨 Archivos que NO Tocar (Sin Razón)

```
❌ node_modules/          # Dependencias (regenerable)
❌ .next/                 # Build cache (regenerable)
❌ .git/                  # Control de versiones
⚠️ supabase/migrations/  # Solo agregar, nunca modificar existentes
```

---

## 📊 Convenciones de Código

### **Naming:**
- API Routes: `route.ts`
- Componentes: `PascalCase.tsx`
- Utils: `kebab-case.ts`
- Workflows: `kebab-case.md`

### **Estructura de API Route:**
```typescript
export async function POST(req: NextRequest) {
    try {
        // 1. Validar input
        // 2. Lógica de negocio
        // 3. Guardar en DB
        // 4. Return response
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
```

---

## 🎯 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Ver estructura
tree -L 2 -I 'node_modules|.next'
```

---

## 📝 Notas Importantes

1. **Supabase:** Todas las tablas usan RLS (Row Level Security)
2. **IA:** Groq (rápido/barato) para análisis, GPT-4o-mini para conversacional
3. **Deploys:** Automático en Vercel al hacer `git push`
4. **Secrets:** En `.env.local` (nunca commitear)

---

**Última actualización:** 2026-02-09
