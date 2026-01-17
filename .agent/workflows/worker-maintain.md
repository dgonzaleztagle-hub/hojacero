---
description: Ejecuta mantención automática en un sitio de cliente
---

# 🔧 Worker Maintain - Mantención Automática de Sitio

Este workflow ejecuta tareas de optimización en un sitio de cliente.
Trabaja sobre la carpeta local y prepara cambios para deploy.

// turbo-all

---

## Uso

```
Usuario: /worker-maintain Restaurante La Mesa

AI: Procesando mantención para "Restaurante La Mesa"...
    
    ✅ 8 imágenes optimizadas (-45% tamaño)
    ✅ 2 links rotos corregidos
    ✅ Dependencias actualizadas
    ✅ SEO auditado: meta descriptions OK
    
    ¿Aprobar cambios y marcar como completado?
```

---

## Paso 1: Identificar Cliente

Busca el cliente en Supabase:

```sql
SELECT 
  id,
  client_name,
  site_url,
  local_path,
  plan_type
FROM monitored_sites
WHERE client_name ILIKE '%[NOMBRE]%'
  AND status = 'active'
LIMIT 1;
```

Si no encuentra, pide aclaración.

---

## Paso 2: Verificar Carpeta Local

Confirma que existe la carpeta del cliente:

```
d:/clientes/[nombre-slug]/
├── site/          ← Código del sitio
├── reports/       ← PDFs
├── backups/       ← Backups
└── metadata.json  ← Info del sitio
```

Si no existe, crea la estructura y pide que copien el sitio.

---

## Paso 3: Crear Backup

Antes de cualquier cambio, crea backup:

```bash
# Crear copia con timestamp
cp -r d:/clientes/[nombre]/site d:/clientes/[nombre]/backups/[YYYY-MM-DD]
```

---

## Paso 4: Tareas de Optimización

### 4.1 Optimizar Imágenes

Busca imágenes pesadas y optimízalas:

```bash
# Listar imágenes > 500KB
find d:/clientes/[nombre]/site -name "*.jpg" -o -name "*.png" -size +500k

# Para cada imagen, usa sharp o squoosh para comprimir
# Reporta: "imagen.jpg: 1.2MB → 450KB (-62%)"
```

### 4.2 Verificar Links Rotos

Escanea todos los links internos:

```javascript
// Pseudocódigo
const links = findAllLinks('d:/clientes/[nombre]/site');
for (const link of links) {
  if (!fileExists(link.href) && !isExternalUrl(link.href)) {
    reportBrokenLink(link);
  }
}
```

### 4.3 Actualizar Dependencias

Si es proyecto Node.js:

```bash
cd d:/clientes/[nombre]/site
npm outdated
npm update --save
```

⚠️ Solo actualizar PATCH y MINOR, no MAJOR.

### 4.4 Auditoría SEO Rápida

Verifica:
- [ ] Todas las páginas tienen `<title>` único
- [ ] Todas las imágenes tienen `alt`
- [ ] Meta descriptions presentes
- [ ] No hay H1 duplicados

---

## Paso 5: Generar Reporte de Cambios

Presenta los cambios al usuario:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 MANTENCIÓN: [Nombre Cliente]
   Fecha: [Hoy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 OPTIMIZACIÓN DE IMÁGENES:
┌─────────────────────────────────────┐
│ hero.jpg      1.8MB → 420KB  (-77%) │
│ team.jpg      950KB → 280KB  (-70%) │
│ gallery-1.jpg 2.1MB → 510KB  (-76%) │
│ ...                                 │
│ TOTAL: 12.5MB → 3.2MB (-74%)        │
└─────────────────────────────────────┘

🔗 LINKS CORREGIDOS:
┌─────────────────────────────────────┐
│ /menu-viejo → /carta                │
│ /contacto#form → /contacto          │
└─────────────────────────────────────┘

📦 DEPENDENCIAS:
┌─────────────────────────────────────┐
│ next: 14.2.3 → 14.2.8               │
│ framer-motion: 11.0.0 → 11.0.5      │
└─────────────────────────────────────┘

🔍 SEO:
┌─────────────────────────────────────┐
│ ✅ Titles únicos: 5/5               │
│ ✅ Alt text: 12/12                  │
│ ✅ Meta descriptions: 5/5           │
└─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Paso 6: Esperar Aprobación

Pregunta:

```
¿Aprobar estos cambios?

1. ✅ Sí, aprobar y marcar como completado
2. 🔄 Hacer más cambios
3. ❌ Revertir (restaurar backup)
```

---

## Paso 7: Registrar en Supabase

Si el usuario aprueba:

```sql
INSERT INTO maintenance_logs (
  site_id,
  performed_at,
  changes,
  deployed,
  notes
) VALUES (
  '[site_id]',
  NOW(),
  '{"images_optimized": 8, "size_reduced_mb": 9.3, "links_fixed": 2, "deps_updated": true}',
  false,
  'Mantención mensual completada. Pendiente deploy.'
);
```

---

## Paso 8: Siguiente Paso

```
✅ MANTENCIÓN COMPLETADA

Cambios guardados en: d:/clientes/[nombre]/site/
Backup en: d:/clientes/[nombre]/backups/[fecha]/

📋 SIGUIENTE PASO:
1. Revisar cambios localmente
2. Subir al hosting del cliente
3. Marcar como "deployed" en Supabase
4. Generar y enviar reporte PDF

¿Deseas generar el reporte PDF ahora?
```

---

## Tareas por Tipo de Plan

| Plan | Tareas Incluidas |
|------|------------------|
| **basic** | Imágenes, Links, Deps, SEO básico |
| **pro** | + Análisis competencia, + 5 cambios |
| **enterprise** | + Soporte prioritario, + Cambios ilimitados |
