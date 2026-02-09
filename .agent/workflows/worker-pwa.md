---
description: Optimiza el sitio para cumplir estándares de PWA Builder (Score 40+) y habilitar modo offline real.
---

# 📱 Worker PWA: Protocolo de Performance y Resiliencia

Este workflow inyecta las capacidades de **Progressive Web App** en cualquier sitio de la flota HojaCero.

---

## 🛠️ Paso 1: Generación de Assets (Engine Sharp)
El primer paso es asegurar que todos los iconos cumplan el estándar exacto de PWA Builder.

1. **Iconos Requeridos:**
   - `512x512`: Icono maestro y Splash Screen.
   - `192x192`: Icono de instalación.
   - `maskable.png`: Icono adaptable para Android.

2. **Screenshots:**
   - Desktop: `1280x720`.
   - Mobile: `720x1280`.

---

## 🛡️ Paso 2: Inyección de Service Worker
Inyectamos un Service Worker de alta disponibilidad en `/public/sw.js`.

// turbo
```bash
# Inyectar sw.js resiliente
echo "importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');" > public/sw.js
```

---

## 📦 Paso 3: Configuración de Manifiesto
Configuración del `manifest.json` con isolación de subcarpetas para evitar colisiones entre proyectos en el mismo dominio.

---

## 🎖️ Reglas de Oro
- ✅ **Offline Real:** Debe cargar una página de emergencia si no hay red.
- ✅ **Score 40+:** No se aprueba el worker si el score en PWA Builder es inferior a 40.
- ✅ **Bypass Middleware:** Asegurar que Next.js no intercepte los archivos estáticos de la PWA.

---
> [!TIP]
> Use `/worker-twa` después de este paso si el cliente requiere una App nativa en la Play Store.
