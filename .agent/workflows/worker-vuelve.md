---
description: Inyecta el módulo de Fidelización (powered by Vuelve+) en el panel de administración de un cliente H0, de forma invisible y sin revelar la plataforma subyacente.
---

# 🪄 Worker — Fidelización Injector (Powered by Vuelve+)

// turbo-all

## 🎯 OBJETIVO
Agregar una pestaña "Fidelización" al panel de administración del cliente actual.
El cliente ve y gestiona su programa de puntos como si fuera nativo de su plataforma.
Internally usa el SSO White Label de Vuelve+ (vuelve.vip).

> [!IMPORTANT]
> **Pre-requisito:** El cliente debe tener un tenant creado en vuelve.vip.
> Si no tiene uno, registrarlo primero en `https://vuelve.vip` antes de ejecutar este worker.

---

## 🛠️ FASE 0 — OBTENER DATOS DEL TENANT

1. Preguntar a Daniel:
   - ¿Cuál es el `tenant_id` del cliente en Vuelve+? (UUID visible en el panel admin de vuelve.vip)
   - ¿En qué ruta está el layout del admin del cliente? (ej: `app/admin/layout.tsx`)

---

## 🔐 FASE 1 — SECRETS & ENVIRONMENT

1. Abrir `.env.local` del proyecto cliente
2. Agregar estas variables:
   ```env
   # FIDELIZACIÓN (powered by Vuelve+)
   VUELVE_TENANT_ID="[el tenant_id del cliente en Vuelve+]"
   VUELVE_SSO_SECRET="d7b891f620cb37711da67915d7c0b5ac78fb0ff54e31b414f2384f833437e70e"
   ```
3. Agregar también en Vercel → Environment Variables del proyecto cliente

---

## 🖥️ FASE 2 — CREAR LA PÁGINA DE FIDELIZACIÓN

1. Crear `app/admin/fidelizacion/page.tsx` en el proyecto cliente:

```tsx
// app/admin/fidelizacion/page.tsx
// Server Component — llama al SSO de Vuelve+ server-side y renderiza el iframe

export const dynamic = 'force-dynamic'

async function getSSOUrl(): Promise<string | null> {
    try {
        const res = await fetch('https://vuelve.vip/api/sso/exchange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tenant_id: process.env.VUELVE_TENANT_ID,
                secret: process.env.VUELVE_SSO_SECRET
            }),
            cache: 'no-store'
        })
        if (!res.ok) return null
        const data = await res.json()
        return `https://vuelve.vip/cliente?sso_token=${data.sso_token}&iframe=true&slug=${data.tenant_slug}`
    } catch {
        return null
    }
}

export default async function FidelizacionPage() {
    const iframeUrl = await getSSOUrl()

    if (!iframeUrl) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'gray' }}>
                <p>⚠️ No se pudo conectar con el módulo de Fidelización. Contacta soporte.</p>
            </div>
        )
    }

    return (
        <iframe
            src={iframeUrl}
            style={{ width: '100%', height: '100vh', border: 'none' }}
            title="Fidelización"
            allow="camera"
        />
    )
}
```

---

## 🧭 FASE 3 — AGREGAR ENTRADA AL MENÚ LATERAL

1. Localizar el sidebar/navbar del admin del cliente
2. Agregar entrada de navegación:
   - **Icono:** Gift, Star o Heart (según estilo del cliente)
   - **Label:** "Fidelización"
   - **Href:** `/admin/fidelizacion`

---

## 🛡️ FASE 4 — VERIFICACIÓN FINAL

1. Correr `npm run dev` en el proyecto cliente
2. Navegar a `/admin/fidelizacion`
3. Verificar que el iframe carga el dashboard de Vuelve+ sin pantalla de login
4. Verificar que la URL del iframe no muestra credenciales
5. Hacer commit: `feat(admin): inyecta módulo de fidelización white-label`

---

> *"El cliente gestiona su fidelización. No sabe qué hay detrás. Solo ve resultados."*
