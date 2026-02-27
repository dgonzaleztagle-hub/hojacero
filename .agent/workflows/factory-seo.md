---
description: Inyecta SEO técnico + registra cliente + kill switch en sitio aprobado
---

# 🔍 HojaCero Factory SEO - Optimización Técnica + Sistema Retención

Este workflow inyecta SEO técnico Y activa el Sistema de Retención.
Ejecutar SOLO cuando el cliente ya PAGÓ o APROBÓ el sitio final.

> ⚠️ **IMPORTANTE:** Este workflow registra al cliente en Supabase e inyecta el
> kill switch de protección. Solo ejecutar para clientes CONFIRMADOS.

// turbo-all

## Prerequisitos

Antes de ejecutar, asegúrate de tener:
- [ ] Sitio completado en `/prospectos/[cliente]/`
- [ ] `discovery_notes.md` con datos del negocio
- [ ] `style_lock.md` marcado como Factory Final completado
- [ ] **CLIENTE CONFIRMADO (pago o contrato firmado)**

---

## Fase 0: Registro de Retención (Hybrid Protocol)

### 0.1 Ejecutar Script Local (Automatización)
Este script usa tus credenciales locales (`.env.local`) para registrar el sitio.
Si falla la conexión automática, generará un archivo SQL para que lo corras manualmente.

```powershell
node scripts/register-client-killswitch.js "[Nombre Cliente]" "[URL Final]"
```

### 0.2 Manejo de Resultados

**CASO A: ÉXITO (✅ Client Registered)**
El script te dará un **UUID** (ej: `d8a2...`).
*   **Copialo**. Lo necesitarás para la Fase 3.5.

**CASO B: FALLBACK (⚠️ MANUAL FALLBACK)**
El script generó un archivo en `d:\proyectos\hojacero\sql\manual_register_[cliente].sql`.
1.  Ve al Dashboard de Supabase -> SQL Editor.
2.  Copia y pega el contenido de ese archivo.
3.  Ejecuta el script.
4.  Copia el **ID** que retorna la base de datos.

### 0.3 Crear Carpeta Local
Crea la estructura de carpeta para el cliente:
```powershell
New-Item -ItemType Directory -Force -Path "d:\clientes\[nombre-slug]\site"
New-Item -ItemType Directory -Force -Path "d:\clientes\[nombre-slug]\reports"
New-Item -ItemType Directory -Force -Path "d:\clientes\[nombre-slug]\backups"
```

---

## Fase 1: The Oracle (Authority Strategy)

**No adivines las keywords. Investígalas.**
**MANDO SEO:** En este workflow usar `seo_strategist/SKILL.md` (cierre productivo), no `seo-strategist-h0.md` (arranque en demo).

1.  **INVOCA AL ORÁCULO:** `view_file .agent/skills/seo_strategist/SKILL.md`
2.  **EJECUTA DEEP RESEARCH:**
    *   Usa `search_web` para encontrar "Preguntas Frecuentes Reales" sobre el nicho en la ubicación del cliente.
    *   Identifica competidores locales en Google Maps.
3.  **DEFINE SCHEMAN & META (DLA - Double Layer Authority):**
    *   Genera la estrategia de JSON-LD combinando `LocalBusiness` (cliente) y `SoftwareApplication` (HojaCero).
    *   Inyecta el esquema de HojaCero como `SoftwareApplication` para marcar la autoría técnica.
    *   Redacta Meta Titles/Descriptions optimizados para CTR y AEO.

Lee los siguientes archivos para contexto:
- `discovery_notes.md` → Nombre, descripción, keywords, dirección, teléfono
- `style_lock.md` → Para verificar estado
- Todas las páginas existentes → Para generar sitemap

Extrae:
```
- Nombre del negocio
- Descripción corta (para meta description)
- Keywords principales (del deep_analysis)
- Dirección física (para LocalBusiness schema)
- Teléfono
- Horarios de atención
export default function Layout({ children }) {
  return (
    <html lang="es">
      <SEOHead 
        title="[Nombre] | [Servicio Principal]"
        description="[Hook del discovery_notes]"
        keywords="[Keywords del análisis]"
        image="/prospectos/[cliente]/hero.jpg"
        businessName="[Nombre]"
        address="[Dirección]"
        phone="[Teléfono]"
      />
      <body>{children}</body>
    </html>
  );
}
```

---

## Fase 3.5: Inyectar Kill Switch

Añade el script de protección en el `<head>` del layout:

```tsx
{/* Kill Switch - Sistema de Retención HojaCero */}
<script dangerouslySetInnerHTML={{ __html: `
(async function() {
  const SITE_ID = '[ID-DEL-PASO-0.2]';
  const API = 'https://vcxfdihsyehomqfdzzjf.supabase.co/rest/v1/site_status';
  try {
    const res = await fetch(API + '?id=eq.' + SITE_ID + '&select=is_active', {
      headers: { 'apikey': '[ANON-KEY]' }
    });
    const data = await res.json();
    if (data[0] && !data[0].is_active) {
      document.body.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;background:#111;color:#fff;font-family:system-ui;text-align:center;padding:2rem;"><div><h1>🔧 Sitio en Mantenimiento</h1><p>Estamos realizando mejoras. Vuelve pronto.</p></div></div>';
    }
  } catch (e) { /* fail-safe */ }
})();
`}} />
```

**IMPORTANTE:** Reemplaza `[ID-DEL-PASO-0.2]` con el UUID real del cliente.

> 🚨 Este script consulta Supabase en cada carga. Si `is_active = false`,
> el sitio muestra "Mantenimiento" y bloquea todo el contenido.

---

## Fase 4: Auditoría de Imágenes (Alt Text)

Revisa TODAS las imágenes en el proyecto:

1. Busca todos los `<img>` y `<Image>` en los archivos.
2. Verifica que tengan `alt=""` con contenido descriptivo.
3. Si falta alt text, GENERA uno basado en:
   - El contexto de la página
   - El nombre del archivo
   - El discovery_notes.md

Reporta:
```
🔍 Auditoría de Imágenes:
- hero.jpg → alt="[descripción generada]" ✅
- team.jpg → alt="Equipo de [Nombre]" ✅
- service1.jpg → ⚠️ SIN ALT TEXT - Sugerencia: "[descripción]"
```

Ofrece corregir automáticamente los que faltan.

---

## Fase 5: Verificar Heading Hierarchy

Revisa la estructura de headings en cada página:
- Debe haber UN solo H1 por página
- H2 para secciones principales
- H3 para subsecciones
- No saltar niveles (H1 → H3 sin H2)

Reporta cualquier problema:
```
📋 Auditoría de Headings:
- page.tsx: H1 ✅, H2 x3 ✅
- servicios/page.tsx: ⚠️ 2 H1 detectados (debe ser solo 1)
```

---

## Fase 6: Generar sitemap.xml

Crea `d:\proyectos\hojacero\public\prospectos\[cliente]\sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[dominio-cliente]/</loc>
    <lastmod>[fecha actual]</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://[dominio-cliente]/servicios</loc>
    <lastmod>[fecha actual]</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Repetir para cada página -->
</urlset>
```

**Nota:** Usar placeholder `[dominio-cliente]` que se reemplazará en export.

---

## Fase 7: Generar robots.txt

Crea `d:\proyectos\hojacero\public\prospectos\[cliente]\robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://[dominio-cliente]/sitemap.xml
```

---

## Fase 8: Actualizar style_lock.md

Marca el progreso:
```markdown
## Estado
- [x] Demo aprobado por cliente
- [x] Factory Final completado
- [x] SEO inyectado
- [ ] Exportado para entrega
```

---

## Fase 9: Reporte Final

Genera un resumen:


✅ SEO + RETENCIÓN INYECTADOS EXITOSAMENTE

📊 Resumen SEO:
- Meta tags: ✅ Configurados (Metadatos multinivel)
- Open Graph: ✅ Configurado
- JSON-LD Omni-Inyección: ✅ Generado (LocalBusiness + SoftwareApplication)
- Sitemap.xml: ✅ Creado
- Robots.txt: ✅ Creado
- Imágenes auditadas: X de Y con alt text

🛡️ Sistema de Retención:
- Cliente registrado en Supabase: ✅ ID: [uuid]
- Kill switch inyectado: ✅
- Carpeta local creada: ✅ d:/clientes/[nombre]/
- Plan: [basic/pro/enterprise]
- Día de mantención: [día] de cada mes

⚠️ Pendientes (si aplica):
- [Lista de issues menores]

🚀 Siguiente paso: Copiar sitio a d:/clientes/[nombre]/site/ y hacer deploy.
```

---

## Ejemplo de Uso

```
Usuario: /factory-seo para Biocrom

AI:
1. FASE 1: Leo discovery_notes.md de Biocrom
2. FASE 2: Verifico que existe SEOHead.tsx (o lo creo)
3. FASE 3: Inyecto SEOHead en layout.tsx con datos de Biocrom
4. FASE 4: Audito 8 imágenes, 2 sin alt text, las corrijo
5. FASE 5: Verifico headings, todo OK
6. FASE 6-7: Genero sitemap.xml y robots.txt
7. FASE 8-9: Actualizo style_lock.md y reporto
```
