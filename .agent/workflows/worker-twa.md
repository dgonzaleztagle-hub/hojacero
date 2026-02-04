---
description: Genera una APK (TWA) desde cualquier PWA de HojaCero con Score 40+ garantizado.
---

# 🤖 Worker TWA: Protocolo de Alta Fidelidad (PWA a APK)

Este workflow convierte cualquier prospecto en una App nativa Android de alto rendimiento usando **Trusted Web Activities (TWA)**.

---

## 🛠️ Paso 1: Infraestructura PWA (Isolación)

Para maximizar el score y evitar colisiones, la PWA debe vivir dentro de la carpeta del prospecto:

1.  **Archivos en `/public/prospectos/[nombre]/`:**
    - `manifest.json`: Definición de la App.
    - `sw.js`: Service Worker resiliente.
    - `offline.html`: Landing de emergencia sin internet.

2.  **Imágenes Exactas (Usar `scripts/resize-pwa-images.js`):**
    - Iconos PNG: `512x512`, `192x192`, `96x96`.
    - Screenshots: `1280x720` (Desktop), `720x1280` (Mobile).

3.  **Registro en `layout.tsx`:**
    ```tsx
    manifest: "/prospectos/[nombre]/manifest.json",
    // Inyectar el componente <ServiceWorkerRegistrar />
    ```

---

## 🛡️ Paso 2: Configuración "Immortal" (Middleware & SW)

1.  **Middleware Bypass:** Asegurar que `middleware.ts` no intercepte los archivos `.js` o `.json`:
    ```typescript
    matcher: ['/((?!.*manifest\\.json|.*sw\\.js|...))']
    ```

2.  **Lógica Resiliente en `sw.js`:**
    Usa `Promise.allSettled` en el evento `install` para asegurar que el Service Worker se active aunque falte algún asset menor.

---

## 📦 Paso 3: Generación (PWA Builder)

1.  Envía la URL completa: `https://hojacero.cl/prospectos/[nombre]/`
2.  **Objetivo Score:** 40/44 (Los últimos 4 puntos suelen ser IDs de Apple o Ratings IARC que no afectan el APK core).
3.  Descarga el **Android Package (APK)**.

---

## ⚡ Automatización: Script de Redimensionamiento

// turbo
```bash
# Ejecuta el motor Sharp para preparar las imágenes
node scripts/resize-pwa-images.js
```

---

## 🎖️ Calidad HojaCero
- ✅ **Cero Rojos:** No se permiten errores críticos en PWA Builder.
- ✅ **Offline Real:** La App debe mostrar el menú/contenido incluso en modo avión.
- ✅ **Iconos Maskable:** El logo no debe verse cortado en teléfonos Samsung/Pixel.

---
> [!IMPORTANT]
> Para activar **Push Notifications**, se requiere la inyección del SDK de Firebase Cloud Messaging (FCM) y la configuración del par de llaves VAPID en el centro de control.
