---
description: Inyecta el motor de autogestión autónomo (Zero Connection) vía GitHub API en sitios aprobados.
---

# 🕊️ HojaCero CMS Standalone - Inyección de Autonomía Pro

Usa este workflow para convertir un sitio estático de Hoja Cero en una unidad autogestionable 100% independiente.

// turbo-all

## 🎯 Fase 0: Prerrequisitos
Un sitio Next.js (Factory Final o Export) ya debe estar inicializado y vinculado a su propio repositorio de GitHub.
No inyectes este motor si el sitio aún es un Demo volátil en `/prospectos`.

---

## 🧠 Fase 1: Inyección del Núcleo (Core Engine)

### 1.1 Persistencia GitHub (`lib/cms/github.ts`)
- Inyectar el motor Octokit para manejo de commits automáticos.
- El motor debe usar las variables `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_BRANCH`.

### 1.2 Malla de Seguridad (`app/api/cms/`)
- Inyectar los endpoints de API:
  - `/api/cms/content`: Lectura segura del JSON base.
  - `/api/cms/config`: Lectura del mapa de campos del panel.
  - `/api/cms/save`: Persistencia atómica con validación de `CMS_ACCESS_KEY`.

---

## 🎨 Fase 2: Inyección de la Interfaz (Admin Panel)

### 2.1 Dashboard Premium (`app/cms/admin/page.tsx`)
- Desplegar el Dashboard con estética **"Awwwards Grade"** (Glassmorphism + Framer Motion).
- Asegurar que el muro de acceso (Login Standalone) esté activo y verificado contra `CMS_ACCESS_KEY`.

### 2.2 Sockets Inteligentes (`components/cms/Editable.tsx`)
- Instalar el componente `<Editable />` y el `CMSProvider`.
- Envolver el `layout.tsx` principal con el provider para habilitar el modo edición global.

---

## 🔧 Fase 3: Configuración del "Cerebro" JSON

### 3.1 Estructura de Datos (`data/`)
- Crear `data/cms-content.json` con los valores iniciales extraídos del código estático.
- Crear `data/cms-config.json` definiendo las categorías y campos que el cliente podrá editar.

---

## 🎖️ Fase 4: Protocolo de Blindaje (QA)

1. **Test de Conexión**: Verificar que el Token de GitHub tiene permisos de escritura en el repo del cliente.
2. **Test de Seguridad**: Intentar un guardado sin la `CMS_ACCESS_KEY` y confirmar el rechazo.
3. **Prueba de Fuego**: Realizar un cambio en el panel y verificar el commit automático en GitHub.
4. **Resistencia de Fallback**: Borrar el JSON de contenido y verificar que el sitio sigue vivo usando los fallbacks estáticos.

---

## 🔑 Entrega de Llaves (Manual Técnico)
Generar un archivo `CMS_GUIDE.md` para el cliente con:
1. URL de acceso (ej: `misitio.cl/cms/admin`).
2. Instrucciones para obtener o resetear la `CMS_ACCESS_KEY` en Vercel.
3. El aviso de "Propiedad Total": El cliente es dueño de su data y su motor.

---

> [!IMPORTANT]
> **REGLA DE ORO HOJACERO:** Prohibido el uso de Supabase Auth o Database en esta inyección. La autonomía total es el valor diferencial de este producto.

