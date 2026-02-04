---
description: Genera una APK (TWA) desde cualquier PWA de HojaCero
---

# 🤖 Worker TWA: De PWA a APK en 3 Pasos

Este workflow convierte cualquier PWA de HojaCero en una APK instalable para Android usando **Trusted Web Activities (TWA)**.

---

## ✅ Pre-requisitos (Auto-Check)

Antes de generar la APK, verifica que el sitio tenga:

1. **manifest.json** en `/public/` con:
   - `name`, `short_name`, `description`
   - `start_url` (ruta del prospecto)
   - `display: "standalone"`
   - `icons` con tamaños 192x192 y 512x512
   - `theme_color` y `background_color`

2. **Service Worker** (`sw.js`) en `/public/`

3. **Metadata PWA** en el `layout.tsx`:
   ```tsx
   manifest: "/manifest.json",
   themeColor: "#000000",
   appleWebApp: { capable: true }
   ```

---

## 🛠️ Método 1: PWA Builder (Recomendado - Sin instalación)

### Paso 1: Validar el PWA
```bash
# Abrir el sitio en producción
https://hojacero.cl/prospectos/[nombre-proyecto]
```

### Paso 2: Generar APK
1. Ir a: https://www.pwabuilder.com/
2. Pegar la URL del prospecto
3. Click en "Package for Stores" → Android
4. Descargar el `.apk` generado

**Ventajas:**
- ✅ No requiere JDK ni Android Studio
- ✅ Genera APK firmada lista para Play Store
- ✅ Incluye asset links automáticos

---

## 🛠️ Método 2: Bubblewrap CLI (Avanzado - Requiere JDK 17)

// turbo
```bash
# Solo si tienes JDK 17 instalado
npx @bubblewrap/cli init --manifest https://hojacero.cl/manifest.json
npx @bubblewrap/cli build
```

**Nota:** Este método requiere configuración manual de JDK. Usar solo si PWA Builder no funciona.

---

## 📦 Entregables

Al finalizar, tendrás:
- ✅ `app-release-signed.apk` (listo para instalar en Android)
- ✅ `assetlinks.json` (para verificación de dominio)
- ✅ Instrucciones para subir a Play Store (si aplica)

---

## 🎯 Casos de Uso

- **Donde Germain:** App de pedidos offline-first
- **Reparpads:** Catálogo instalable para técnicos
- **Cualquier prospecto:** Convertir landing en app nativa

---

> [!TIP]
> **Para automatizar:** Podríamos crear un endpoint `/api/generate-twa` que llame a PWA Builder API y devuelva la APK directamente desde el Dashboard.
