---
description: Motor SEO/AEO/GEO Premium — Auditoría completa, auto-fix y checklist para cualquier sitio
---

# 🏆 HojaCero SEO Premium Engine v2.0

Motor unificado de posicionamiento digital. Cubre **TODO el ciclo SEO** en un solo flujo:
investigación → auditoría → creación → verificación → entrega.

Aplicable a **sitios propios** y **sitios de clientes**.

> Este workflow reemplaza el anterior `/seo-premium` v1.
> Ahora incluye deep research, análisis competitivo, creación de contenido AEO,
> y cuestionario dirigido al dueño para cerrar el ciclo.

// turbo-all

---

## MÓDULO 0 — CONTEXTO Y PREPARACIÓN

1. **Identifica el sitio objetivo:**
   - ¿Es un sitio HojaCero (`/prospectos/[cliente]`)? → Directorio local
   - ¿Es un sitio externo? → URL de producción
   - ¿Tiene dominio propio? → Anótalo para schemas y sitemap

2. **Reúne información del negocio:**
   ```
   - Nombre del negocio
   - URL de producción
   - Rubro / Nicho
   - Ciudad y región
   - Teléfono y email
   - Redes sociales
   - Nombre del fundador
   - Keywords principales (3-5)
   ```

3. **Lee archivos relevantes (si existen):**
   - `discovery_notes.md` → Datos del negocio
   - `BRAND_SOUL.md` → Identidad de marca
   - `layout.tsx` → Schemas existentes
   - `sitemap.ts` → Rutas indexadas
   - `next.config.ts` → Config de performance

---

## MÓDULO 1 — DEEP RESEARCH DEL NICHO 🔍

### 1.1 Investigación del rubro
Usa `search_web` para investigar:
- "mejores [rubro] en [ciudad] [año]" — ¿Qué resultados aparecen?
- "[servicio principal] [ciudad]" — ¿Quién rankea primero?
- Preguntar a IAs: "recomiéndame un [rubro] en [ciudad]" — ¿Nos mencionan?

**Registra:**
- Top 5 competidores que aparecen en Google
- Top 3 resultados que mencionan las IAs (ChatGPT, Gemini, Perplexity)
- Keywords exactas donde NO aparecemos pero deberíamos

### 1.2 Análisis competitivo
Para cada competidor del top 5:
- Visitar su sitio con `read_url_content`:
  - ¿Tienen schema JSON-LD? ¿Cuáles?
  - ¿Tienen blog con contenido? ¿Cuántos artículos?
  - ¿Tienen casos de estudio / portafolio?
  - ¿Tienen FAQ visible?
  - ¿Tienen precios públicos?
  - ¿En qué directorios están (Clutch, GoodFirms, etc)?

**Genera tabla comparativa:**
```
| Criterio           | Nuestro sitio | Competidor 1 | Competidor 2 | Competidor 3 |
|--------------------|---------------|--------------|--------------|--------------|
| Schema JSON-LD     | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
| Blog/contenido     | N artículos   | N artículos  | N artículos  | N artículos  |
| Casos de estudio   | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
| FAQ                | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
| Precios visibles   | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
| Google Biz Profile | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
| Directorios        | Lista         | Lista        | Lista        | Lista        |
| IA nos menciona    | ✅/❌         | ✅/❌        | ✅/❌        | ✅/❌        |
```

### 1.3 Gap Analysis
De la comparativa, identifica:
- **Gaps de contenido:** Keywords que la competencia cubre y nosotros no
- **Gaps de schema:** Tipos de schema que usan y nosotros no
- **Gaps de autoridad:** Directorios/backlinks que tienen y nosotros no
- **Oportunidades únicas:** Cosas que podemos hacer que ellos no

---

## MÓDULO 2 — AUDITORÍA INTERNA COMPLETA 🏥

### 2.1 Meta Tags & HTML Base
Escanea `layout.tsx` y TODOS los `page.tsx` públicos:
- [ ] `<html lang="es">` presente
- [ ] `<title>` descriptivo y único por página
- [ ] `<meta name="description">` con 150-160 chars
- [ ] `<link rel="canonical">` en CADA página pública
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Favicon completo (16x16, 32x32, 180x180)

**CRÍTICO:** Ejecutar `grep_search "canonical"` en TODOS los `page.tsx`.
Cada página pública necesita `alternates: { canonical }` en su metadata.

### 2.2 Schemas JSON-LD
Busca en scripts `application/ld+json`:
- [ ] **Organization** → nombre, logo, url, email, teléfono, sameAs, knowsAbout
- [ ] **Person** (fundador) → nombre, jobTitle, worksFor, sameAs, knowsAbout
- [ ] **WebSite** → url, name, publisher, SearchAction
- [ ] **ProfessionalService** → serviceType, priceRange, hasOfferCatalog
- [ ] **FAQPage** → mínimo 4 preguntas con respuestas 200+ palabras
- [ ] **BreadcrumbList** → en TODAS las páginas internas
- [ ] **Article/BlogPosting** → en artículos del blog
- [ ] **Review** → testimonios con rating
- [ ] **HowTo** → en guías paso a paso
- [ ] **LocalBusiness** → si tiene ubicación física

### 2.3 Contenido & E-E-A-T
- [ ] Página /about → ¿Bio del fundador? ¿Experiencia real?
- [ ] Blog → ¿Artículos 1000+ palabras? ¿Keywords transaccionales?
- [ ] Casos de estudio → ¿Proyectos verificables?
- [ ] Heading Hierarchy → H1 único, H2-H3 en orden
- [ ] Alt text → Imágenes con alt descriptivo
- [ ] Internal linking → Páginas enlazadas entre sí

### 2.4 Sitemap & Indexación
- [ ] `sitemap.ts` incluye TODAS las rutas públicas
- [ ] `robots.txt` permite crawling + referencia sitemap
- [ ] `robots.txt` permite bots IA (GPTBot, ClaudeBot, PerplexityBot, etc.)
- [ ] Canonical URLs en cada página

### 2.5 Performance
- [ ] `next/image` en vez de `<img>`
- [ ] Hero image con `priority={true}`
- [ ] Formatos AVIF/WebP en next.config
- [ ] Cache headers para assets estáticos
- [ ] `optimizePackageImports` configurado
- [ ] Lazy loading en componentes below-the-fold
- [ ] GSAP importado dinámicamente

### 2.6 Accesibilidad
- [ ] `aria-label` en links de iconos
- [ ] `aria-hidden="true"` en SVGs decorativos
- [ ] `role="navigation"` en navs
- [ ] Contraste mínimo 4.5:1
- [ ] Focus indicators visibles

### 2.7 Genera Reporte "LO QUE ES vs LO QUE DEBERÍA SER"
Crea un artifact `seo_audit_report.md` con tabla:
```
| Área              | Estado actual        | Estado ideal         | Gap    |
|-------------------|----------------------|----------------------|--------|
| Schemas           | Organization, FAQ    | +Person, Review, etc | ⚠️     |
| Landing pages     | 0                    | 4 por servicio       | ❌     |
| Blog              | 0 artículos          | 4+ artículos AEO     | ❌     |
| Casos de estudio  | 0                    | 3-4 casos reales     | ❌     |
| Directorios       | 0                    | Clutch, GoodFirms    | ❌     |
```

---

## MÓDULO 3 — AUTO-FIX + AUTO-GROWTH + AUTO-CONTENT 🚀

### 3.1 Auto-Fix (lo que ya existe pero está mal)
Para cada item que falló en Módulo 2:
- **Schemas faltantes** → Genera e inyecta JSON-LD en layout.tsx
- **Campos incompletos** → Agrega address, image, telephone, priceRange
- **Meta tags** → Genera title + description optimizados para CTR
- **Canonicals** → Agrega a cada page.tsx público
- **Performance** → AVIF/WebP, cache headers, optimizePackageImports
- **Accesibilidad** → aria-labels, roles, contraste
- **Sitemap** → Actualiza con todas las rutas

### 3.2 Auto-Growth (crear lo que falta — estructura)

#### Landing Pages Satélite
Si el sitio no tiene landing pages por servicio:
- Crear layout compartido (`/servicios/layout.tsx`) con:
  - Navbar mínimo (logo + CTA WhatsApp)
  - Sticky WhatsApp en móvil
  - Footer ligero
- Crear 1 landing page por servicio principal (máximo 4)
- Cada landing con schema Service + FAQPage + BreadcrumbList
- Todas indexadas pero NO en la navbar principal
- CTAs → WhatsApp con mensaje pre-llenado por servicio

#### Casos de Estudio
Si el sitio tiene proyectos/clientes verificables:
- Crear layout compartido (`/casos/layout.tsx`)
- Crear 1 página por caso/proyecto real (máximo 4)
- Estructura: Desafío → Solución → Stack → Resultado → CTA
- Schema Article + SoftwareApplication + BreadcrumbList por caso

### 3.3 Auto-Content (crear contenido AEO)

#### Blog Transaccional
Si el sitio no tiene blog optimizado:
- Crear layout (`/blog/layout.tsx`) + hub (`/blog/page.tsx`)
- Crear 4 artículos AEO basados en los gaps del Módulo 1:
  - 1 artículo tipo "Mejores [rubro] en [ciudad] [año]" — para captar tráfico comparativo
  - 1 artículo tipo "[Alternativa A] vs [Alternativa B]: qué conviene" — comparativa
  - 1 artículo tipo "Cómo elegir [servicio] en [ciudad]" — guía de compra
  - 1 artículo tipo "Guía para [problema del cliente]" — tutorial con schema HowTo
- Cada artículo con schema BlogPosting + FAQPage + BreadcrumbList
- Contenido mínimo 1500 palabras por artículo
- CTAs contextuales a WhatsApp

**IMPORTANTE:** Los artículos deben incluir datos específicos del negocio,
precios reales, y referencias a proyectos/casos de estudio propios.
El contenido no debe ser genérico — debe posicionar al negocio como autoridad.

#### Actualizar Sitemap
Agregar TODAS las rutas nuevas al sitemap con prioridades correctas:
- Landing pages: prioridad 0.9, weekly
- Casos de estudio: prioridad 0.8, monthly
- Blog hub: prioridad 0.8, weekly
- Artículos de blog: prioridad 0.7, weekly

---

## MÓDULO 4 — DOUBLE CHECK Y VERIFICACIÓN ✅

### 4.1 Build Test
```bash
npx next build
```
- Exit code debe ser 0
- Verificar que TODAS las páginas nuevas aparecen como static (○ o ●)
- Registrar cualquier warning

### 4.2 Schema Validation
Para 2-3 páginas clave, verificar con Rich Results Test:
- `https://search.google.com/test/rich-results`
- Registrar elementos válidos, warnings y errores

### 4.3 PageSpeed Check
Si el sitio está en producción, testear:
- `https://pagespeed.web.dev/`
- Targets: Performance >80 (mobile), Accesibilidad >90, SEO 100

### 4.4 Inventario de Schemas por Página
Genera tabla final de schemas implementados:
```
| Página                 | Schemas                                |
|------------------------|----------------------------------------|
| / (home)               | Organization, Person, WebSite, FAQ...  |
| /servicios/[servicio]  | Service, FAQPage, BreadcrumbList       |
| /casos/[caso]          | Article, SoftwareApplication, Breadc.  |
| /blog/[articulo]       | BlogPosting, FAQPage, BreadcrumbList   |
```

---

## MÓDULO 5 — CUESTIONARIO PARA EL DUEÑO 📋

Genera un cuestionario dirigido al dueño/marketing del sitio.
El objetivo es obtener información que solo el humano puede dar,
y que es NECESARIA para completar el ciclo SEO.

### Cuestionario SEO — Para el dueño del sitio

```markdown
# 📋 Cuestionario SEO — [Nombre del Negocio]

Necesitamos esta información para completar el posicionamiento de tu sitio.
Por favor responde lo más detallado posible.

## 1. Autoridad y credenciales
- ¿Tienes certificaciones o premios relevantes?
- ¿Has dado charlas, talleres o participado en eventos?
- ¿Tienes publicaciones en medios, entrevistas o menciones de prensa?
- ¿Tu LinkedIn personal está actualizado con tu rol actual?

## 2. Testimonios y reseñas
- ¿Puedes pedir a 3 clientes que dejen una reseña en Google/Clutch?
  (Podemos redactar un mensaje plantilla para que les envíes)
- ¿Tienes testimonios escritos que podamos usar con nombre y empresa?

## 3. Google Business Profile
- ¿Ya tienes perfil de Google My Business? (Sí/No)
- Si no: ¿cuál es la dirección exacta del negocio?
- ¿Horarios de atención?

## 4. Directorios del rubro
- ¿Estás registrado en algún directorio de tu industria?
- ¿Hay asociaciones gremiales a las que pertenezcas?

## 5. Contenido adicional
- ¿Hay proyectos o clientes que NO hemos incluido y deberíamos?
- ¿Hay datos específicos que quieras destacar? (años de experiencia,
  cantidad de clientes, facturación, etc.)
- ¿Hay preguntas que tus clientes siempre hacen y podemos responder
  en el sitio?

## 6. Competencia
- ¿Quiénes consideras tus competidores principales?
- ¿Hay algo específico que ellos hacen bien y quieres igualar o superar?
```

**Este cuestionario se entrega al dueño/marketing.**
Las respuestas alimentan una segunda iteración de:
- Actualización de schemas (Review con testimonios reales)
- Creación de Google Business Profile
- Registro en directorios del rubro
- Contenido adicional en el blog

---

## MÓDULO 6 — REPORTE FINAL Y ENTREGABLES 📊

### 6.1 Reporte técnico (para el equipo)
Genera `seo_premium_report.md`:

```markdown
# 🏆 Reporte SEO Premium — [Nombre del Sitio]

**Fecha:** [fecha]
**URL:** [url]
**Motor:** HojaCero SEO Premium v2.0

## Estado Antes vs Después

| Métrica              | Antes | Después |
|----------------------|-------|---------|
| Páginas indexadas    | N     | N       |
| Schemas activos      | N     | N       |
| Landing pages        | N     | N       |
| Blog artículos       | N     | N       |
| Casos de estudio     | N     | N       |
| FAQ implementadas    | N     | N       |

## Acciones Ejecutadas Automáticamente
- [x] [Lista de todo lo que se hizo]

## Acciones Pendientes (Manual)
- [ ] [Lista con responsable y deadline sugerido]

## Cuestionario Enviado
- [ ] Esperando respuestas del dueño/marketing

## Estado Final: [APROBADO ✅ / NECESITA TRABAJO ⚠️]
```

### 6.2 Reporte para el dueño (no técnico)
Genera un resumen ejecutivo simple:

```markdown
# Tu Sitio Web ahora tiene SEO Premium 🚀

Hicimos [N] mejoras en tu sitio para que aparezcas en Google
y en las IAs (ChatGPT, Gemini, etc.) cuando busquen [tu servicio].

## Lo que logramos:
- Tu sitio ahora tiene [N] páginas optimizadas para Google
- Creamos [N] artículos que responden las preguntas más comunes
- Tu sitio ahora le "habla" a Google y a las IAs en su idioma

## Lo que necesitamos de ti:
(Adjunto el cuestionario SEO)

## Próximos pasos:
1. Responde el cuestionario (10 min)
2. Nosotros aplicamos las mejoras finales
3. En 3-6 meses empezarás a ver resultados orgánicos
```

---

## MÓDULO 7 — COMMIT & PUSH

Si se hicieron cambios al código:
```bash
git add -A
git commit -m "seo-premium-v2: ciclo completo [nombre sitio]"
git push origin main
```

---

## Flujo Resumido

```
MÓDULO 0 → Contexto
MÓDULO 1 → Deep Research + Competencia (¿cómo está el mercado?)
MÓDULO 2 → Auditoría interna (¿cómo estamos nosotros?)
         → Reporte: "lo que es" vs "lo que debería ser"
MÓDULO 3 → Auto-Fix + Auto-Growth + Auto-Content (arreglar + crear)
MÓDULO 4 → Double Check (build + schemas + PageSpeed)
MÓDULO 5 → Cuestionario al dueño (info que solo el humano tiene)
MÓDULO 6 → Reporte final (técnico + ejecutivo para el dueño)
MÓDULO 7 → Deploy
```

---

## Notas Estratégicas

> **AEO (AI Engine Optimization):** Los schemas JSON-LD son el lenguaje que entienden
> ChatGPT, Gemini, Perplexity y Claude para citar tu sitio como fuente autoritativa.

> **GEO (Generative Engine Optimization):** Contenido largo (1500+ palabras)
> con estructura clara y datos originales es lo que las IAs usan para generar respuestas.

> **E-E-A-T:** Google evalúa Experience, Expertise, Authoritativeness, Trustworthiness.
> La página /about, el schema Person, y los testimonios reales son la base.

> **Precio sugerido como servicio:**
> - SEO Premium v2 (ciclo completo): $200.000 CLP
> - Mantención SEO mensual: $30.000 CLP
> - Solo auditoría (sin creación): $100.000 CLP
