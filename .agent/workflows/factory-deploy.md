---
description: Sube el sitio exportado y validado a producción (Vercel) de forma segura.
---

# 🚀 HojaCero Factory DEPLOY - El Lanzamiento

Este workflow gestiona la subida final a GitHub y Vercel.
Elimina el error humano de "hacer git init donde no se debe".

// turbo-all

## Prerequisitos

Antes de ejecutar:
- [ ] `/factory-export` ejecutado exitosamente (existe `EXPORT_MANIFEST.json`)
- [ ] Cliente registrado en Supabase (`/factory-seo`)

---

## Fase 1: Verificación de Integridad

1.  **Leer Manifest:**
    Verifica que `exports/[cliente]/EXPORT_MANIFEST.json` exista.
    ```powershell
    $CLIENT = "[nombre-cliente]"
    if (-not (Test-Path "exports\$CLIENT\EXPORT_MANIFEST.json")) {
        Write-Error "❌ NO SE ENCUENTRA EXPORT_MANIFEST.json. Ejecuta /factory-export primero."
        exit 1
    }
    ```

2.  **Git Health Check:**
    Verifica que no estemos cometiendo el error de Apimiel (subir repo sin assets).
    ```powershell
    cd exports\$CLIENT
    # Listar archivos ignorados críticos
    git check-ignore public/prospectos/$CLIENT/assets/logo_original.png
    # Si retorna ruta, ESTÁ IGNORADO -> ERROR.
    ```

---

## Fase 2: Conexión al Repositorio

1.  **Inicialización Atomica:**
    ```powershell
    git init
    git branch -M main
    ```

2.  **Configuración de Identidad (Bot):**
    ```powershell
    git config user.email "bot@hojacero.cl"
    git config user.name "Hojacero Factory Bot"
    ```

3.  **Vinculación Remota:**
    ```powershell
    # Si ya existe remote, actualizar URL
    if (git remote get-url origin) {
        git remote set-url origin https://github.com/dgonzaleztagle-hub/$CLIENT.git
    } else {
        git remote add origin https://github.com/dgonzaleztagle-hub/$CLIENT.git
    }
    ```

---

## Fase 3: El Push Blindado

1.  **Add & Commit:**
    *   **IMPORTANTE:** `git add -f` para assets si es necesario (el script helper ya debió arreglarlo, pero doble seguridad).
    ```powershell
    git add .
    git commit -m "🚀 Factory Deploy: $CLIENT (v2.1)"
    ```

2.  **Push:**
    ```powershell
    git push -u origin main --force
    # Force es aceptable aquí porque el export es la fuente de verdad.
    # ADVERTENCIA: Solo si estamos seguros que export > remote.
    ```

---

## Fase 4: Verificación de Despliegue

1.  Notificar al usuario:
    *"Sitio subido a GitHub. Vercel iniciará el build."*
    *"URL Esperada: https://$CLIENT.vercel.app"*

2.  **Monitoreo (Opcional):**
    Si tienes Vercel CLI, puedes ejecutar `vercel list $CLIENT`.

---

## Ejemplo:
Usuario: `/factory-deploy` para Apimiel
AI:
1. Verifica manifest en `exports/apimiel/`
2. Verifica assets en git
3. Inicializa git, conecta remote
4. Sube a github
