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

### **6. H0 Store Engine** 🛒
**Qué hace:** E-commerce modular inyectable en sitios de clientes

**Archivos clave:**
```
📍 Schema DB:        supabase/h0_store_engine_schema.sql
📍 Migración Pagos:  supabase/migrations/20260210_add_payment_gateway_support.sql
📍 Admin Panel:      app/admin/tienda/
📍 Panel Pagos:      app/admin/tienda/pagos/
📍 Storefront:       app/tienda/
📍 Componentes:      components/store/
📍 Utilidades:       lib/store/
📍 Conversión:       lib/store/badge-styles.ts
📍 Payment SDKs:     lib/store/payment-gateways.ts
📍 API Pagos:        app/api/store/create-payment/
                     app/api/store/webhook/
📍 Guía Cliente:     app/guias/configurar-pagos/
```

**Flujo:**
1. Slash `/worker-store-pro` → Inyecta Store Engine
2. Cliente gestiona productos → `/admin/tienda`
3. Upload de imágenes → Supabase Storage `h0_store_images`
4. Storefront público → `/tienda` (hereda vibelock del sitio)
5. Checkout → WhatsApp o Payment Gateway

**Características:**
- ✅ Carrito en LocalStorage (rápido, sin auth)
- ✅ Técnicas de alta conversión (badges, urgencia, social proof)
- ✅ Presets de estilo: Premium/Direct x Light/Dark
- ✅ Vibe Agnostic (se adapta al diseño del sitio)
- ✅ Payment Gateways: Mercado Pago, Flow, Transbank (módulo separado)

**Tablas DB:**
```
h0_store_categories          # Categorías de productos
h0_store_products            # Productos
h0_store_orders              # Órdenes (+ payment_id, paid_at, delivery_status)
h0_store_conversion_settings # Configuración de conversión
h0_store_payment_config      # Configuración de pasarelas (JSONB protegido por RLS)
```

---

### **7. Fleet System (CMS Multi-Sitio)** 🌐
**Qué hace:** Sistema centralizado para gestionar contenido de múltiples sitios de clientes desde un solo panel.

**Archivos clave:**
```
📍 API Routes:       app/api/fleet/content/
                     app/api/fleet/save/
                     app/api/fleet/sites/
📍 UI Dashboard:     app/dashboard/fleet/
📍 Componentes:      components/fleet/
```

**Flujo:**
1. Admin accede a Fleet Dashboard → `app/dashboard/fleet/`
2. Selecciona sitio cliente → Carga contenido vía API
3. Edita contenido → `app/api/fleet/save/`
4. Deploy automático → Sitio cliente actualizado

**Uso:** Gestión escalable de múltiples sitios sin acceder a cada uno individualmente.

---

### **8. Sales Agent (Chatbot de Diagnóstico IA)** 🤖
**Qué hace:** Agente conversacional que diagnostica necesidades de leads y genera scoring automático.

**Archivos clave:**
```
📍 API Routes:       app/api/sales-agent/
📍 UI Cliente:       app/diagnostico/
📍 Componentes:      components/sales-agent/
📍 Utilidades:       utils/sales-agent/
📍 DB:               Supabase tablas `sales_agent_sessions`, `sales_agent_messages`
```

**Flujo:**
1. Lead inicia conversación → `app/diagnostico/`
2. IA diagnostica necesidades → `app/api/sales-agent/`
3. Genera scoring y recomendaciones → Guardado en DB
4. Dashboard muestra insights → `app/dashboard/`

**Uso:** Calificación automática de leads mediante conversación IA.

---

### **9. Kimi Forensics (Lead Intelligence)** 🔍
**Qué hace:** Análisis forense de "muerte digital", shadowing de competencia B2B, y scoring de oportunidad.

**Archivos clave:**
```
📍 Lógica Core:      utils/kimi-forensics.ts
📍 Forensics:        utils/forensic-logic.ts
📍 B2B Shadowing:    utils/b2b-shadowing.ts
📍 DB:               Supabase tablas `social_necropsy`, `b2b_identities`
```

**Flujo:**
1. Lead ingresado → Análisis de presencia digital
2. Detección de "muerte digital" (redes inactivas, última publicación)
3. Shadowing de competencia B2B (LinkedIn, perfiles corporativos)
4. Scoring de oportunidad → Dashboard

**Uso:** Inteligencia competitiva y análisis de viabilidad de leads.

---

### **10. Growth Automation (Mantenimiento y Tareas)** ⚙️
**Qué hace:** Sistema de automatización de mantenimiento, tareas recurrentes y optimización de sitios en producción.

**Archivos clave:**
```
📍 API Routes:       app/api/growth/
📍 UI Dashboard:     app/dashboard/growth/
📍 Componentes:      components/growth/
📍 Utilidades:       utils/growth-automation.ts
📍 DB:               Supabase tablas `growth_clients`, `growth_tasks`, `growth_task_library`
📍 Scripts:          scripts/setup_growth.js
                     scripts/upgrade_growth_v2.js
                     scripts/debug_growth.js
📍 Workflows:        .agent/workflows/worker-maintain.md
                     .agent/workflows/worker-mensual.md
```

**Flujo:**
1. Sistema genera tareas automáticas → `growth_task_library`
2. Asignación a clientes → `growth_tasks`
3. Ejecución de mantenimiento → `/worker-maintain`
4. Reporte enviado → `maintenance_logs`

**Uso:** Automatización de mantenimiento mensual y optimización continua.

---

### **11. Aplicaciones Interactivas** 🎮
**Qué hace:** Juegos y aplicaciones interactivas para engagement de clientes (Match-3, etc.).

**Archivos clave:**
```
📍 UI:               app/aplicaciones/
📍 Componentes:      components/aplicaciones/
📍 Lógica:           lib/aplicaciones/
```

**Uso:** Productos interactivos para aumentar engagement en sitios de clientes.

---

### **12. Agenda & CRM** 📅
**Qué hace:** Sistema de gestión de reuniones, seguimiento de leads y calendario integrado.

**Archivos clave:**
```
📍 API Routes:       app/api/agenda/
📍 UI Dashboard:     app/dashboard/agenda/
📍 Componentes:      components/agenda/
📍 DB:               Supabase tabla `agenda_events`
```

**Flujo:**
1. Crear evento → `app/dashboard/agenda/`
2. Asociar a lead → `agenda_events.lead_id`
3. Notificaciones → Email automático
4. Seguimiento → Dashboard

**Uso:** CRM interno para gestión de reuniones y seguimiento de leads.

---

### **13. Inbox (Email Management)** 📧
**Qué hace:** Sistema de gestión de correos internos, plantillas dinámicas y firmas corporativas.

**Archivos clave:**
```
📍 UI Dashboard:     app/dashboard/inbox/
📍 Componentes:      components/inbox/
📍 DB:               Supabase tablas `email_inbox`, `email_plantillas`, `email_signatures`
```

**Flujo:**
1. Recepción de correos → `email_inbox`
2. Uso de plantillas → `email_plantillas`
3. Firma automática → `email_signatures`
4. Envío → Dashboard

**Uso:** Centro de comunicación interna y gestión de correos.

---

### **14. Ads Factory** 📢
**Qué hace:** Generador de landings para pauta publicitaria

**Archivos clave:**
```
📍 Workflow:         .agent/workflows/worker-ads-factory.md
📍 Templates:        (generados dinámicamente)
```

**Uso:** `/worker-ads-factory` → Landing optimizada para conversión

---

### **15. Vault (Gestión de Clientes)** 💼
**Qué hace:** CRM interno para clientes y proyectos

**Archivos clave:**
```
📍 UI:               app/vault/
📍 API:              app/api/vault/
📍 DB:               Supabase tabla `clients`
```

---

### **16. Pipeline (Automatización)** ⚙️
**Qué hace:** Procesamiento masivo de assets/data

**Archivos clave:**
```
📍 Workflow:         .agent/workflows/worker-automate.md
📍 Scripts:          (generados según necesidad)
```

---

## 📊 Secciones del Dashboard

El dashboard principal (`/dashboard`) contiene múltiples secciones especializadas:

### **Dashboard Principal**
```
📍 Ruta:             app/dashboard/page.tsx
📍 Componentes:      components/radar/
📍 Contexto:         app/dashboard/DashboardContext.tsx
```
**Función:** Vista principal con Radar de leads y métricas generales.

### **Territorial**
```
📍 Ruta:             app/dashboard/territorial/
```
**Función:** Gestión de análisis territoriales y reportes de geomarketing.

### **Fleet**
```
📍 Ruta:             app/dashboard/fleet/
```
**Función:** Gestión centralizada de múltiples sitios de clientes.

### **Growth**
```
📍 Ruta:             app/dashboard/growth/
```
**Función:** Tareas de mantenimiento, optimización y seguimiento de clientes.

### **Vault**
```
📍 Ruta:             app/dashboard/vault/
```
**Función:** CRM interno, gestión de clientes y proyectos.

### **Agenda**
```
📍 Ruta:             app/dashboard/agenda/
```
**Función:** Calendario, reuniones y seguimiento de eventos.

### **Inbox**
```
📍 Ruta:             app/dashboard/inbox/
```
**Función:** Gestión de correos internos y comunicación.

### **Academy**
```
📍 Ruta:             app/dashboard/academy/
📍 Contenido:        lib/academy-content.ts
📍 DB:               Supabase tabla `academy_progress`
```
**Función:** Plataforma de cursos y capacitación H0.

### **Ads Factory**
```
📍 Ruta:             app/dashboard/ads-factory/
```
**Función:** Generador de landings para pauta publicitaria.

### **Lab (Laboratorio)**
```
📍 Ruta:             app/dashboard/lab/
```
**Función:** Espacio de experimentación y pruebas de nuevas funcionalidades.

### **Metrics**
```
📍 Ruta:             app/dashboard/metrics/
```
**Función:** Métricas globales y analytics del sistema.

### **Pulse**
```
📍 Ruta:             app/dashboard/pulse/
```
**Función:** Monitoreo en tiempo real de sitios y servicios.

### **Pipeline**
```
📍 Ruta:             app/dashboard/pipeline/
```
**Función:** Gestión de automatizaciones y procesamiento de datos.

### **Radar**
```
📍 Ruta:             app/dashboard/radar/
```
**Función:** Vista especializada del sistema de análisis de leads.

### **Ayuda**
```
📍 Ruta:             app/dashboard/ayuda/
```
**Función:** Centro de ayuda y documentación interna.

---

## 🔌 APIs Adicionales

Además de las APIs principales documentadas en cada módulo, existen estas rutas:

### **Demos**
```
📍 Ruta:             app/api/demos/
```
**Función:** Gestión de demos de prospectos y tracking de visitas.

### **Tracking**
```
📍 Ruta:             app/api/tracking/
```
**Función:** Analytics y seguimiento de eventos en sitios de clientes.

### **Send Email**
```
📍 Ruta:             app/api/send-email/
```
**Función:** Envío de correos transaccionales y notificaciones.

### **Pipeline**
```
📍 Ruta:             app/api/pipeline/
```
**Función:** Procesamiento de automatizaciones y tareas en background.

---

## 🛠️ Utilidades y Herramientas

### **Hooks Personalizados** (`/hooks/`)
```
📍 useRadar.ts           # Lógica completa de Radar (20KB)
📍 useIsMobile.tsx       # Detección de dispositivo móvil
📍 useDisableInspect.ts  # Protección anti-inspect
📍 hooks/factory/        # Hooks específicos de Factory
📍 hooks/food-engine/    # Hooks del Food Engine
```

### **Utils Globales** (`/utils/`)
```
📍 ai-client.ts          # Cliente de IA (OpenAI, Groq, Gemini)
📍 radar.ts              # Lógica core de Radar (20KB)
📍 kimi-forensics.ts     # Análisis forense de leads (12KB)
📍 forensic-logic.ts     # Lógica de forensics
📍 b2b-shadowing.ts      # Shadowing de competencia B2B
📍 tech-analysis.ts      # Análisis técnico de sitios
📍 scraper-engine.ts     # Motor de scraping
📍 groq-territorial.ts   # IA para análisis territorial
📍 radar-helpers.ts      # Helpers de Radar
📍 growth-automation.ts  # Automatización de mantenimiento
📍 utils/supabase/       # Clientes de Supabase (client, server, admin)
📍 utils/sales-agent/    # Utilidades del Sales Agent
📍 utils/food-engine/    # Utilidades del Food Engine
```

### **Scripts de Desarrollo** (`/scripts/`)

**Testing:**
```
📍 test-serper.ts            # Test de Serper API
📍 test-foursquare.ts        # Test de Foursquare API
📍 test-territorial-api.ts   # Test de API Territorial
📍 test-tomtom.ts            # Test de TomTom API
📍 test-delivery-scraper.ts  # Test de scraper de delivery
📍 test-gaston-style.ts      # Test de estilos Donde Germain
📍 test-openai.ts            # Test de OpenAI
```

**Debugging:**
```
📍 debug-gaston.ts           # Debug de Donde Germain
📍 debug_growth.js           # Debug de Growth Automation
📍 debug_vault_insert.js     # Debug de inserts en Vault
```

**Deployment y Exportación:**
```
📍 export-helper-v3.js       # Exportador de sitios V3 (24KB)
📍 export-helper.js          # Exportador legacy
📍 inject-store-engine.js    # Inyector de Store Engine
📍 register-client-killswitch.js  # Registro de kill switch
```

**Database:**
```
📍 run_migration.js          # Ejecutor de migraciones
📍 restore_direccion.sql     # Restauración de direcciones
📍 setup_growth.js           # Setup de Growth Automation
📍 upgrade_growth_v2.js      # Upgrade de Growth V2
```

**Optimización:**
```
📍 resize-pwa-images.js      # Redimensionador de imágenes PWA
📍 clear-cache.ts            # Limpiador de caché
📍 clean-mocks.ts            # Limpiador de mocks
```

**Verificación:**
```
📍 check_killswitch.js       # Verificador de kill switch
📍 verify-org.js / .ts       # Verificador de organización
📍 verify_lampa.js           # Verificador de Lampa
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

### **"Necesito modificar el análisis forense de leads"**
→ `utils/kimi-forensics.ts`

### **"Necesito cambiar la lógica del Sales Agent"**
→ `app/api/sales-agent/` + `utils/sales-agent/`

### **"Necesito gestionar contenido de múltiples sitios"**
→ `app/dashboard/fleet/` + `app/api/fleet/`

### **"Necesito agregar una tarea de mantenimiento automática"**
→ `app/dashboard/growth/` + `growth_task_library` (DB)

### **"Necesito modificar el scraping de competencia"**
→ `lib/scrapers/` (serper, foursquare, tomtom, ubereats)

### **"Necesito cambiar estilos de badges de conversión"**
→ `lib/store/badge-styles.ts`

### **"Necesito agregar nueva pasarela de pago"**
→ `lib/store/payment-gateways.ts`

### **"Necesito debuggear un problema en producción"**
→ `scripts/debug-*.js` o `scripts/test-*.ts`

### **"Necesito exportar un sitio para cliente"**
→ `scripts/export-helper-v3.js`

### **"Necesito agregar un hook personalizado"**
→ `hooks/` (ver `useRadar.ts` como ejemplo)

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

## 🕷️ Scrapers Disponibles

El proyecto cuenta con múltiples scrapers especializados en `lib/scrapers/`:

### **Serper Scraper**
```
📍 Archivo:          lib/scrapers/serper-scraper.ts (23KB)
📍 Función:          Scraping de Google Search vía Serper API
📍 Uso:              Análisis de presencia digital, competencia, SEO
```

### **Portal Inmobiliario Scraper**
```
📍 Archivo:          lib/scrapers/portal-inmobiliario-scraper.ts (14KB)
📍 Caché:            lib/scrapers/portal-inmobiliario-cached.ts
📍 Función:          Scraping de precios de mercado inmobiliario
📍 Uso:              Análisis territorial, valorización de propiedades
```

### **Foursquare Scraper**
```
📍 Archivo:          lib/scrapers/foursquare-scraper.ts (8KB)
📍 Función:          Scraping de POIs y lugares de interés
📍 Uso:              Análisis de competencia, anchors comerciales
```

### **TomTom Scraper**
```
📍 Archivo:          lib/scrapers/tomtom-scraper.ts (6KB)
📍 Función:          Scraping de datos de tráfico y POIs
📍 Uso:              Análisis de flujo peatonal y vehicular
```

### **UberEats Scraper**
```
📍 Archivo:          lib/scrapers/ubereats-scraper.ts (13KB)
📍 Función:          Scraping de restaurantes y delivery
📍 Uso:              Análisis de competencia gastronómica
```

---

## 🎨 Componentes Visuales y Primitivas

### **Componentes Premium** (`components/premium/`)
```
📍 21 componentes de alta calidad visual
📍 Uso:              Elementos premium para sitios de clientes
```

### **Efectos Visuales** (`components/fx/`)
```
📍 7 efectos y animaciones
📍 Uso:              Micro-interacciones y efectos WOW
```

### **Design Lab** (`app/design-lab/`)
```
📍 Laboratorio de diseño
📍 Uso:              Experimentación y pruebas visuales
```

**Referencia:** Ver `ADN_VISUAL_PRIMITIVES.md` para filosofía de diseño.

---

---

## 🗄️ Base de Datos (SSOT - Single Source of Truth)

> [!NOTE]
> Estas tablas representan la estructura real en Supabase (Auditoría Feb 2026).

### **Batch 1: Gestión y Operaciones (A-E)**

| Tabla | Propósito | Columnas Clave |
| :--- | :--- | :--- |
| `academy_progress` | Seguimiento de cursos H0 | `user_id`, `module_id`, `status`, `quiz_score` |
| `agenda_events` | Gestión de reuniones y CRM | `title`, `start_time`, `lead_id`, `attendee_email` |
| `alertas_enviadas` | Log de notificaciones de mantenimiento | `site_id`, `tipo`, `resend_id`, `abierto` |
| `b2b_identities` | Inteligencia de perfiles (LinkedIn) | `lead_id`, `full_name`, `role`, `confidence_score` |
| `bitacora_clientes` | Notas internas de seguimiento | `client_id`, `author`, `message`, `is_internal` |
| `demo_industries` | Clasificación de industrias para Factory | `name`, `slug` |
| `demo_prompts` | Librería de prompts por industria | `industry_id`, `category`, `content` |
| `demo_visits` | Analytics de prospección (Vistas Demo) | `prospecto`, `city`, `visitor_ip`, `user_agent` |
| `email_plantillas` | Templates dinámicos para el CRM | `nombre`, `asunto`, `contenido` |
| `email_inbox` | Sistema de recepción de correos interno | `sender`, `subject`, `body_text`, `is_read` |
| `email_signatures` | Firmas corporativas inyectables | `label`, `content`, `is_default` |

### **Batch 2: Food Engine & Growth (G)**

| Tabla | Propósito | Columnas Clave |
| :--- | :--- | :--- |
| `germain_orders` | Pedidos del Food Engine | `client_name`, `total_amount`, `status`, `order_code` |
| `germain_products` | Menú digital de Donde Germain | `category_id`, `name`, `price`, `is_active` |
| `germain_sessions` | Control de apertura/cierre de caja POS | `opening_cash`, `total_sales`, `orders_count`, `status` |
| `growth_clients` | Gestión de clientes en plan de crecimiento | `plan_tier`, `health_score`, `active_modules` |
| `growth_tasks` | Tareas operativas de mantenimiento/SEO | `client_id`, `title`, `status`, `due_datetime` |
| `growth_task_library` | Repositorio de tareas estándar para planes | `category`, `default_recurrence` |

### **Batch 3: Leads, Mantenimiento y Real Estate (L-P)**

| Tabla | Propósito | Columnas Clave |
| :--- | :--- | :--- |
| `leads` | Corazón del Radar (Prospectos) | `nombre`, `estado`, `puntaje_oportunidad`, `pipeline_stage` |
| `lead_activity_log` | Historial de cambios en leads | `lead_id`, `accion`, `estado_nuevo` |
| `monitored_sites` | El Vault (Sitios en producción) | `client_name`, `site_url`, `plan_type`, `monto_mensual` |
| `maintenance_logs` | Registro de optimizaciones técnicas | `site_id`, `changes` (JSONB), `report_sent` |
| `pagos` | Control de cobros y facturación | `site_id`, `monto`, `periodo_mes`, `metodo` |
| `portal_inmobiliario_cache` | Datos de mercado para Territorial | `comuna`, `tipo`, `precio_uf_m2`, `expires_at` |

### **Batch 4: IA de Ventas, Status y Territorial (R-Z)**

| Tabla | Propósito | Columnas Clave |
| :--- | :--- | :--- |
| `sales_agent_sessions` | Sesiones del chatbot de diagnóstico | `lead_id`, `diagnosis_score`, `conversion_type`, `status` |
| `sales_agent_messages` | Historial de chat del agente de IA | `session_id`, `role`, `content`, `tool_result` |
| `site_status` | Control de Kill Switch (Activación de sitios) | `id` (uuid del sitio), `is_active`, `reason` |
| `social_necropsy` | Análisis de "muerte" digital / redes sociales | `lead_id`, `platform`, `status` (active/dead), `last_post_date` |
| `territorial_reports` | El Producto (Informes de Geomarketing) | `address`, `business_type`, `dimensiones` (JSONB), `analysis` |
| `territorial_cache` | Caché de puntos de interés y competencia | `quadrant_key`, `competitors`, `anchors`, `expires_at` |
| `territorial_workers` | Monitor de salud de los nodos de scraping | `hostname`, `status` (ONLINE/OFFLINE), `last_heartbeat` |

### **Batch 5: H0 Store Engine (PRO) 🛒**

| Tabla | Propósito | Columnas Clave |
| :--- | :--- | :--- |
| `h0_store_categories` | Moldes (Blueprints) de categorías dinámicas | `name`, `attribute_blueprint` (JSONB), `icon` |
| `h0_store_products` | Base maestra de artículos marca blanca | `category_id`, `price`, `attributes` (JSONB), `images` |
| `h0_store_product_variants` | Variantes de stock por combinación (Talla/Color) | `product_id`, `combination` (JSONB), `stock`, `price_override` |
| `h0_store_orders` | Flujo de checkout y estados de pago | `client_data`, `items`, `payment_status`, `payment_provider` |
| `h0_store_order_items` | Items individuales de cada orden | `order_id`, `product_id`, `quantity`, `price_snapshot` |
| `h0_store_conversion_settings` | Técnicas de alta conversión configurables | `badge_style_preset`, `show_bestseller`, `exit_popup_enabled` |
| `h0_store_config` | Configuración global y Vibe de la tienda | `store_name`, `currency`, `tax_pct`, `payment_methods` |

**Storage Bucket:**
- `h0_store_images` - Bucket público para imágenes de productos (compresión automática, máx 5MB)

---

**Última actualización:** 2026-02-10 (Expansión completa: +7 módulos, +15 secciones dashboard, +utilidades y herramientas)
