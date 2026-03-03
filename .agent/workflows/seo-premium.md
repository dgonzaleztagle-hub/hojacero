---
description: Motor SEO/AEO/GEO Premium — Auditoría completa, auto-fix y checklist para cualquier sitio
---

# 🏆 HojaCero SEO Premium Engine — Auditoría + Auto-Fix + Reporte

Este workflow ejecuta una auditoría **SEO/AEO/GEO completa** sobre cualquier sitio,
arregla automáticamente lo que puede, y genera un checklist con lo que queda pendiente.

Aplicable a **sitios propios de HojaCero** y **sitios de clientes**.
Es el servicio premium que ninguna agencia chilena ofrece.

> **Diferencia con `/factory-seo`:** Factory-SEO inyecta SEO básico + kill switch en prospectos.
> SEO Premium es una auditoría **de nivel enterprise** con AEO, GEO, schemas avanzados,
> performance, accesibilidad y checklist de backlinks.

// turbo-all

---

## Fase 0: Contexto y Preparación

1. **Identifica el sitio objetivo:**
   - ¿Es un sitio HojaCero (Next.js en `/prospectos/[cliente]`)? → Trabaja en el directorio local
   - ¿Es un sitio externo? → Trabaja con la URL de producción
   - ¿Tiene dominio propio? → Anótalo para schemas y sitemap

2. **Reúne información del negocio:**
   ```
   - Nombre del negocio
   - URL de producción
   - Rubro / Nicho
   - Dirección (ciudad mínimo)
   - Teléfono
   - Email de contacto
   - Redes sociales (Instagram, LinkedIn, Facebook)
   - Nombre del fundador / dueño
   - Keywords principales (3-5)
   ```

3. **Lee archivos relevantes (si existen):**
   - `discovery_notes.md` → Datos del negocio
   - `BRAND_SOUL.md` → Identidad de marca
   - `layout.tsx` → Schemas existentes, meta tags
   - `sitemap.ts` → Rutas indexadas
   - `next.config.ts` → Configuración de performance

---

## Fase 1: DIAGNÓSTICO TÉCNICO (Scan Automático)

### 1.1 Meta Tags & HTML Base
Escanea el `layout.tsx` o `<head>` buscando:
- [ ] `<html lang="es">` → ¿Está presente?
- [ ] `<title>` → ¿Es descriptivo y único por página?
- [ ] `<meta name="description">` → ¿Tiene 150-160 chars?
- [ ] `<link rel="canonical">` → ¿Apunta a la URL correcta?
- [ ] Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card tags
- [ ] Google Search Console verification
- [ ] Favicon completo (16x16, 32x32, 180x180 apple-touch)

### 1.2 Schemas JSON-LD (El Corazón del AEO/GEO)
Busca en el `@graph` o scripts `application/ld+json`:
- [ ] **Organization** → nombre, logo, url, email, teléfono, sameAs, address, image, knowsAbout
- [ ] **Person** (fundador) → nombre, jobTitle, worksFor, sameAs (LinkedIn), knowsAbout
- [ ] **WebSite** → url, name, publisher, SearchAction (sitelinks)
- [ ] **ProfessionalService** → serviceType, priceRange, telephone, address, image, hasOfferCatalog
- [ ] **FAQPage** → mínimo 4 preguntas, respuestas de 200+ palabras
- [ ] **BreadcrumbList** → en páginas internas (blog, artículos, subpáginas)
- [ ] **Article** → en artículos del blog/lab (author, datePublished, dateModified)
- [ ] **LocalBusiness** → si aplica (restaurantes, tiendas físicas)

### 1.3 Contenido & E-E-A-T
- [ ] **Página /about** → ¿Existe? ¿Tiene bio del fundador? ¿Menciona experiencia real?
- [ ] **Blog/Lab** → ¿Tiene artículos? ¿Más de 1000 palabras por artículo?
- [ ] **Heading Hierarchy** → H1 único por página, H2-H3 en orden
- [ ] **Alt text** → Todas las imágenes con alt descriptivo
- [ ] **Internal linking** → ¿Las páginas se enlazan entre sí?

### 1.4 Sitemap & Indexación
- [ ] `sitemap.ts` o `sitemap.xml` → ¿Existe? ¿Incluye todas las rutas?
- [ ] `robots.txt` → ¿Permite crawling? ¿Referencia el sitemap?
- [ ] Canonical URLs → ¿Cada página tiene su canonical correcto?

### 1.5 Performance (Core Web Vitals)
- [ ] `next/image` → ¿Se usa en vez de `<img>` crudo?
- [ ] `priority` → ¿El hero image tiene priority={true}?
- [ ] Formatos modernos → ¿AVIF/WebP configurados en next.config?
- [ ] Cache headers → ¿Assets estáticos con cache inmutable?
- [ ] `optimizePackageImports` → ¿framer-motion, gsap, three optimizados?
- [ ] Lazy loading → ¿Componentes below-the-fold con `dynamic()`?
- [ ] GSAP → ¿Importado lazy (dynamic import) o estático?

### 1.6 Accesibilidad
- [ ] `aria-label` → ¿Links de iconos tienen label descriptivo?
- [ ] `aria-hidden` → ¿SVGs decorativos marcados como hidden?
- [ ] `role="navigation"` → ¿Navs y social docks tienen role?
- [ ] `title` → ¿Iframes tienen title?
- [ ] Contraste → ¿Texto legible sobre fondo? (ratio mínimo 4.5:1)
- [ ] Focus indicators → ¿Elementos interactivos tienen :focus visible?

---

## Fase 2: AUTO-FIX (Corrección Automática)

Para cada item que falló en Fase 1, intenta corregir automáticamente:

### 2.1 Schemas Faltantes
Si falta Organization, Person, WebSite, FAQ, etc:
- **Genera el JSON-LD** con los datos del negocio (Fase 0)
- **Inyecta en layout.tsx** dentro de un `<script type="application/ld+json">`
- Usa `@graph` para combinar múltiples schemas en un solo bloque
- Cada schema debe tener `@id` para referencias cruzadas

### 2.2 Campos Opcionales de Schemas
Si los schemas existen pero les faltan campos (address, image, telephone, priceRange):
- **Agrega los campos** directamente al JSON-LD existente
- Para `address`: usar PostalAddress con ciudad + región + país
- Para `image`: usar la URL del logo
- Para `priceRange`: usar formato "$X - $Y CLP"

### 2.3 Meta Tags
- Genera `<title>` y `<meta description>` optimizados para CTR
- Agrega Open Graph si falta
- Agrega canonical si falta

### 2.4 Performance Config
- Agrega `formats: ['image/avif', 'image/webp']` a next.config
- Agrega `optimizePackageImports` si aplica
- Agrega cache headers para assets estáticos
- Convierte imports GSAP estáticos a lazy imports en componentes Hero

### 2.5 Accesibilidad
- Agrega `aria-label` a links de iconos/redes sociales
- Agrega `aria-hidden="true"` a SVGs decorativos
- Agrega `role="navigation"` a contenedores de nav
- Agrega `title` a iframes (GTM, etc)

### 2.6 Sitemap & Robots
- Genera/actualiza `sitemap.ts` con todas las rutas del sitio
- Genera `robots.txt` si no existe
- Agrega página `/about` al sitemap si existe

---

## Fase 3: VALIDACIÓN EXTERNA

### 3.1 PageSpeed Insights
Navega a `https://pagespeed.web.dev/` y testea la URL de producción.
Registra los 4 scores:
- Rendimiento (target: >80 mobile, >90 desktop)
- Accesibilidad (target: >90)
- Recomendaciones (target: 100)
- SEO (target: 100)

### 3.2 Rich Results Test
Navega a `https://search.google.com/test/rich-results` y testea la URL.
Registra:
- Elementos válidos detectados
- Warnings/problemas no críticos
- Errores (si hay)

### 3.3 AEO Check (Manual)
Pregunta a ChatGPT/Gemini/Perplexity:
- "¿Qué es [nombre del negocio]?"
- "¿Quién es [nombre del fundador]?"
- Si las IAs devuelven info correcta → ✅
- Si no saben → Falta autoridad externa (backlinks)

---

## Fase 4: REPORTE FINAL

Genera un artifact `seo_premium_report.md` con el siguiente formato:

```markdown
# 🏆 Reporte SEO Premium — [Nombre del Sitio]

**Fecha:** [fecha]
**URL:** [url de producción]
**Ejecutado por:** HojaCero SEO Premium Engine

---

## 📊 Scores PageSpeed

| Métrica | Móvil | Escritorio |
|---------|-------|------------|
| Rendimiento | [X] | [X] |
| Accesibilidad | [X] | [X] |
| Recomendaciones | [X] | [X] |
| SEO | [X] | [X] |

## ✅ Rich Results Test
- Elementos válidos: [N]
- Warnings: [N]
- Errores: [N]

---

## ✅ Resuelto Automáticamente
- [x] [Descripción de cada fix aplicado]

## ❌ Requiere Acción Manual
- [ ] **Backlinks:** Registrar en [N] directorios del rubro
- [ ] **Google Business Profile:** Crear/actualizar perfil
- [ ] **LinkedIn del fundador:** Actualizar headline y "Acerca de"
- [ ] **Contenido:** Agregar [N] artículos de autoridad al blog/lab
- [ ] [Cualquier otro pendiente]

## ⚠️ Mejoras Opcionales (Para Score Perfecto)
- [ ] [Mejoras de contraste de accesibilidad]
- [ ] [Optimización de imágenes específicas]
- [ ] [hreflang si aplica LATAM]

---

## 📋 Checklist de Backlinks Recomendados
1. [ ] Directorio [nombre] — [URL de registro]
2. [ ] Publicar artículo en Medium/Dev.to con link de vuelta
3. [ ] Solicitar link desde sitio de cliente [nombre]
4. [ ] Perfil en Google Business Profile

---

## Estado Final: [APROBADO ✅ / NECESITA TRABAJO ⚠️]

Criterio:
- APROBADO: SEO ≥ 95, Rendimiento ≥ 80, Accesibilidad ≥ 90, Rich Results sin errores
- NECESITA TRABAJO: Cualquier métrica bajo el umbral
```

---

## Fase 5: Commit & Push

Si se hicieron cambios al código:
```
git add -A
git commit -m "seo-premium: auditoría completa + auto-fix [nombre sitio]"
git push origin main
```

---

## Ejemplo de Ejecución

```
Usuario: /seo-premium para hojacero.cl

AI:
1. FASE 0: Contexto — HojaCero, Next.js, hojacero.cl, Santiago
2. FASE 1: Diagnóstico — 42 checks ejecutados
   - 35 ✅ pasaron
   - 4 ⚠️ auto-fixeables
   - 3 ❌ requieren acción manual
3. FASE 2: Auto-Fix — Aplicados 4 fixes (schemas, aria, cache, AVIF)
4. FASE 3: Validación — PageSpeed 99/92/100/100, Rich Results 5 válidos
5. FASE 4: Reporte generado → seo_premium_report.md
6. FASE 5: Push → Commit a8f88b3
```

```
Usuario: /seo-premium para caprex.cl

AI:
1. FASE 0: Contexto — Caprex (contabilidad), Next.js, caprex.cl, Santiago
2. FASE 1: Diagnóstico — 42 checks
   - Falta schema Person, FAQ, ProfessionalService
   - Falta página /about
   - Sin aria-labels en redes sociales
3. FASE 2: Auto-Fix — Inyecta schemas, agrega aria-labels, optimiza config
4. FASE 3: Validación — Corre PageSpeed + Rich Results
5. FASE 4: Reporte con pendientes manuales
6. FASE 5: Push
```

---

## Notas Estratégicas

> **AEO (AI Engine Optimization):** Los schemas JSON-LD son el lenguaje que entienden
> ChatGPT, Gemini, Perplexity y Claude para citar tu sitio como fuente autoritativa.
> Sin schemas, las IAs no saben qué eres. Con schemas, te citan textualmente.

> **GEO (Generative Engine Optimization):** El contenido largo (artículos 1500+ palabras)
> con estructura clara (H2/H3) y datos originales es lo que las IAs usan para generar
> respuestas. Sin contenido propio, dependes de que otros hablen de ti.

> **E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):**
> Google evalúa si el autor tiene experiencia real, si el sitio demuestra expertise,
> si hay señales de autoridad (backlinks, menciones) y si es confiable (SSL, reviews).
> La página /about y el schema Person son la base de E-E-A-T.

> **Precio sugerido como servicio:**
> - Auditoría SEO Premium (una vez): $100.000 CLP
> - Mantención SEO mensual: $30.000 CLP
> - SEO Premium + AEO/GEO completo: $200.000 CLP
