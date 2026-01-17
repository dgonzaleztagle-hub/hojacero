---
description: Inyecta SEO técnico profesional en un sitio de prospecto aprobado
---

# 🔍 HojaCero Factory SEO - Optimización Técnica

Este workflow inyecta todo el SEO técnico necesario en un sitio de prospecto.
Ejecutar DESPUÉS de que el cliente apruebe el sitio final.

// turbo-all

## Prerequisitos

Antes de ejecutar, asegúrate de tener:
- [ ] Sitio completado en `/prospectos/[cliente]/`
- [ ] `discovery_notes.md` con datos del negocio
- [ ] `style_lock.md` marcado como Factory Final completado

---

## Fase 1: Recopilar Datos para SEO

Lee los siguientes archivos:
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
- URL de la imagen hero (para og:image)
- Lista de todas las páginas
```

---

## Fase 2: Crear/Verificar Componente SEOHead

Si no existe, crea `d:\proyectos\hojacero\components\seo\SEOHead.tsx`:

```tsx
import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  // LocalBusiness
  businessName?: string;
  address?: string;
  phone?: string;
  openingHours?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  businessName,
  address,
  phone,
  openingHours,
}: SEOHeadProps) {
  const jsonLd = businessName ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "description": description,
    "address": address,
    "telephone": phone,
    "openingHours": openingHours,
  } : null;

  return (
    <Head>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
      
      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
}
```

---

## Fase 3: Inyectar SEOHead en el Layout

Modifica el `layout.tsx` del prospecto para incluir SEOHead:

```tsx
import { SEOHead } from '@/components/seo/SEOHead';

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

```
✅ SEO INYECTADO EXITOSAMENTE

📊 Resumen:
- Meta tags: ✅ Configurados
- Open Graph: ✅ Configurado
- Twitter Cards: ✅ Configurado
- JSON-LD LocalBusiness: ✅ Generado
- Sitemap.xml: ✅ Creado
- Robots.txt: ✅ Creado
- Imágenes auditadas: X de Y con alt text

⚠️ Pendientes (si aplica):
- [Lista de issues menores]

🚀 Siguiente paso: Ejecutar /factory-export cuando el cliente pague.
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
