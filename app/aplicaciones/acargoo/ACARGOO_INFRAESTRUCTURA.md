# 🧱 Acargoo+ — Stack de Infraestructura y Costos Reales
> **Documento interno HojaCero** | Febrero 2026
> **Objetivo:** Mapa completo de servicios externos necesarios, con costos reales y alternativas.
> **Estado:** ✅ DECISIONES CONFIRMADAS

---

## 📊 Resumen Rápido (TL;DR)

| Servicio | Proveedor | Costo Mes 1 | Costo cuando escale | Estado |
|----------|-----------|-------------|---------------------|--------|
| Base de datos + Auth + Storage + Realtime | Supabase (proyecto independiente) | **$0 USD** | $25 USD/mes (Pro) | ✅ Confirmado |
| Archivado de archivos (fotos, firmas, PDFs) | Cloudflare R2 | **$0 USD** | $0.015/GB sobre 10GB | ✅ Confirmado |
| Email transaccional | Brevo | **$0 USD** | $0 (hasta 300/día) | ✅ Confirmado |
| WhatsApp automático | Evolution API (cloud managed) | **~$19 USD** | ~$19 USD | ✅ Confirmado |
| Mapas, rutas, autocomplete | Google Maps Platform | **$0 USD** | $0 (hasta 10K req/SKU) | ✅ Confirmado |
| Hosting + Deploy | Vercel | **$0 USD** | $0 (dentro del plan actual) | ✅ Confirmado |
| Push Notifications (chofer) | Web Push (nativo) | **$0 USD** | $0 | ✅ Confirmado |
| Generación de PDFs (POD) | React-pdf (server-side) | **$0 USD** | $0 | ✅ Confirmado |
| Dominio acargoo.cl | NIC Chile + Cloudflare DNS | **~$10 USD/año** | $10 USD/año | ✅ Disponible, comprar |
| **TOTAL MES 1** | | **~$20 USD** | |

---

## 1. 🗄️ Supabase (Base de Datos + Auth + Storage + Realtime)

### ¿Por qué Supabase?
Ya lo usamos en todo H0. Es la decisión natural y evita aprender otra herramienta.

### ¿Proyecto nuevo o compartido?
**✅ DECISIÓN: PROYECTO NUEVO independiente.** Razones:
- Datos del cliente no se mezclan con H0
- Si el cliente se va, se desconecta limpio
- Tiene sus propias tablas, auth, y storage

### Plan Free (suficiente para arrancar):
| Recurso | Límite Free | ¿Alcanza? |
|---------|-------------|-----------|
| Base de datos | 500 MB | ✅ Sí, para los primeros meses |
| Storage (fotos, firmas) | 1 GB | ⚠️ Ajustado — ~500 fotos de entregas |
| Ancho de banda | 5 GB/mes | ✅ Sí |
| Realtime (tracking) | 200 conexiones simultáneas | ✅ De sobra para empezar |
| Auth users | 50,000 MAU | ✅ Más que suficiente |
| Edge Functions | 500K invocaciones | ✅ Sí |

### ¿Cuándo escalar a Pro ($25 USD/mes)?
- Cuando el storage pase de 1GB (muchas fotos de entrega)
- Cuando necesiten backups automáticos diarios
- Cuando el tráfico de Realtime suba (muchos choferes + clientes trackeando)

### Tablas que vamos a necesitar (preview):
```
acargoo_orders          → Órdenes de servicio
acargoo_drivers         → Conductores
acargoo_vehicles        → Vehículos (patente, tipo, capacidad)
acargoo_clients         → Clientes que reservan
acargoo_services        → Catálogo de servicios
acargoo_tracking        → Posiciones GPS en tiempo real
acargoo_pods            → Pruebas de entrega (firma + foto + PDF)
acargoo_incidents       → Incidencias reportadas
acargoo_payments        → Registro de pagos
acargoo_notifications   → Log de notificaciones enviadas
```

---

## 2. 📧 Email Transaccional — Brevo (ex Sendinblue)

### ¿Por qué Brevo y no Resend?
| | Brevo | Resend |
|---|-------|--------|
| **Free/mes** | **9,000 emails** (300/día) | 3,000 emails |
| **API + SMTP** | ✅ Ambos | ✅ Ambos |
| **Webhooks** | ✅ | ✅ |
| **Logo en emails** | ⚠️ Incluye logo Brevo en free | ❌ No |
| **Contactos** | 100,000 | Ilimitados |

### ¿300 emails al día alcanzan?
Hagamos la cuenta para un día típico de Acargoo:
```
Por cada servicio se envían ~4 emails:
  1. Confirmación de reserva al cliente
  2. Notificación al admin
  3. Asignación al chofer
  4. Certificado POD al cliente

300 ÷ 4 = 75 servicios por día

→ Para una empresa que está partiendo, 75 servicios/día es MÁS que suficiente.
```

### Configuración necesaria:
- Crear cuenta en Brevo
- Configurar dominio de envío (ej: notificaciones@acargoo.cl)
- API Key para integrar con Next.js

### Costo: **$0 USD**

---

## 3. 💬 WhatsApp Automático — Evolution API Cloud

### ✅ DECISIÓN: Evolution API (cloud managed) — ~$19 USD/mes

Mensajes ilimitados, sin costo por mensaje adicional. Simple de configurar.
El costo es del cliente, no de H0.

> **Nota:** Meta cambió a cobro por mensaje (julio 2025) para su API oficial.
> Evolution API usa protocolo directo, por lo que para 20-30 servicios/día
> de puras alertas transaccionales, el riesgo de bloqueo es bajo.
> Si algún día necesitan migrar a la API oficial de Meta: ~$144 USD/mes
> para 30 servicios/día. Pero hoy, $19/mes vs $144/mes no tiene discusión.

### Lo que necesita el cliente:
- ❗ Un **número de teléfono dedicado** para WhatsApp Business
- El proveedor cloud de Evolution maneja el resto

### Mensajes que enviaría el sistema:
```
1. "✅ Servicio AG-XXXX confirmado. Chofer: [Nombre]. Fecha: [Fecha]"
2. "🚛 Tu chofer [Nombre] está en camino. Sigue tu carga: [link]"
3. "📍 Tu chofer llegará en aproximadamente 10 minutos"
4. "✅ Entrega completada. Certificado: [link PDF]"
```

---

## 4. 🗺️ Google Maps Platform

### ⚠️ CAMBIO IMPORTANTE (Marzo 2025):
Google eliminó el crédito único de $200/mes y lo reemplazó por **cuotas gratuitas por SKU**. Esto es MEJOR para nosotros:

### Lo que necesitamos y cuánto cuesta:

| API | Categoría | Free/mes | ¿Para qué? |
|-----|-----------|----------|-------------|
| **Places Autocomplete** | Essentials | 10,000 requests | Autocompletar direcciones en formularios |
| **Directions API** | Essentials | 10,000 requests | Calcular ruta, distancia, tiempo |
| **Distance Matrix** | Essentials | 10,000 requests | Calcular distancia para pricing |
| **Geocoding** | Essentials | 10,000 requests | Convertir dirección a coordenadas |
| **Maps JavaScript** | Essentials | Ilimitado (embed) | Mostrar mapas en el panel y tracking |

### ¿10,000 requests/mes alcanzan?
```
Por cada servicio se usan ~5 API calls:
  1. Autocomplete origen (Places)
  2. Autocomplete destino (Places)
  3. Calcular ruta (Directions)
  4. Calcular distancia para precio (Distance Matrix)
  5. Geocoding para el mapa

10,000 ÷ 5 = 2,000 servicios por mes

→ Para una empresa que está arrancando, 2,000 servicios/mes es ENORME.
   Incluso con 50 servicios/día (muy alto) = 1,500/mes. Sobra.
```

### Configuración necesaria:
- Crear proyecto en Google Cloud Console
- Habilitar las 5 APIs mencionadas
- Generar API Key con restricción de dominio
- Configurar billing (necesita tarjeta pero no cobra si está dentro del free)

### Costo: **$0 USD** (dentro del free tier)

---

## 5. 🌐 Hosting — Vercel

### Situación actual:
Acargoo vive dentro del monorepo de HojaCero, deployado en Vercel.

### Opciones:
| Opción | Ventaja | Desventaja |
|--------|---------|------------|
| **Mantener en H0** | Deploy inmediato, sin costo extra | Acoplado al proyecto principal |
| **Proyecto Vercel separado** | Independencia total | Necesita su propio repo y deploy |

### Recomendación:
**Empezar dentro de H0** (ruta `/aplicaciones/acargoo`) y migrar a proyecto independiente cuando el cliente firme y crezca.

### Costo: **$0 USD** (dentro del plan actual de Vercel)

---

## 6. 🔔 Push Notifications (App del Chofer)

### Tecnología: Web Push API (gratis, nativo del navegador)
- No necesita Firebase ni servicio externo
- Funciona en PWA/TWA
- Requiere Service Worker + VAPID keys (generamos nosotros)

### Flujo:
```
Admin asigna servicio → Backend envía push → 
Service Worker del chofer recibe → Notificación con sonido en el teléfono
```

### Costo: **$0 USD**

---

## 7. 📄 Generación de PDFs (Certificado POD)

### Opciones:
| Librería | Dónde corre | Calidad |
|----------|-------------|---------|
| **jsPDF** | Client-side | 🟡 Básica pero funcional |
| **Puppeteer** | Server-side (API Route) | 🟢 Alta — renderiza HTML a PDF |
| **React-pdf** | Server o Client | 🟢 Alta — diseño con componentes |

### Recomendación:
**React-pdf** server-side. Diseñamos el certificado como un componente React y lo convertimos a PDF. Permite un diseño premium con el branding de Acargoo+.

### Costo: **$0 USD** (librerías open source)

---

## 8. 🌍 Dominio — acargoo.cl

### ✅ DECISIÓN: Comprar acargoo.cl (DISPONIBLE, verificado)
- Tracking: `track.acargoo.cl/AG-XXXX` → profesional
- Emails: `notificaciones@acargoo.cl` → confianza
- Portal: `app.acargoo.cl` → identidad propia

### Costo:
- Dominio `.cl`: ~$10.000 CLP/año (~$10 USD)
- DNS: Cloudflare gratis

---

## 9. 🔐 Autenticación

### Supabase Auth (incluido en el proyecto):
- Login para Admin → Email + Password
- Login para Chofer → Email + Password (o magic link por simplicidad)
- Cliente → NO necesita login (reserva como invitado o con email simple)

### Roles necesarios:
```
admin     → Ve todo, asigna, factura
driver    → Solo ve sus asignaciones, reporta
client    → No tiene cuenta (accede por link único)
```

### Costo: **$0 USD** (incluido en Supabase)

---

## 📋 Checklist de Cuentas a Crear

Antes de empezar a construir, necesitamos:

| # | Cuenta/Servicio | ¿Quién la crea? | Datos necesarios |
|---|----------------|-----------------|------------------|
| 1 | Proyecto Supabase nuevo | HojaCero | Solo crear |
| 2 | Cuenta Brevo | HojaCero | Email de la empresa |
| 3 | Google Cloud Console | HojaCero | Tarjeta (no cobra) |
| 4 | Número WhatsApp Business | **El cliente** | Número de teléfono dedicado |
| 5 | Facebook Business (si API oficial) | **El cliente** | Datos de la empresa |
| 6 | Dominio acargoo.cl (opcional) | **El cliente** | Datos de la empresa |
| 7 | VPS para Evolution API (si esa ruta) | HojaCero | ~$18 USD/mes |

---

---

## 10. 🔄 Worker de Archivado Semanal (Supabase → R2)

### Objetivo:
Mantener Supabase Storage por debajo de 1 GB moviendo archivos antiguos a Cloudflare R2.

### Cloudflare R2 — Límites:
| Recurso | Free | Excedente |
|---------|------|-----------|
| Storage | **10 GB** | $0.015/GB/mes |
| Escrituras | 1M ops/mes | $4.50/M ops |
| Lecturas | 10M ops/mes | $0.36/M ops |
| Descargas (egress) | **$0 SIEMPRE** | $0 (esto es la gran ventaja vs S3) |

10 GB = ~3,000 servicios archivados. Si llegan a 100 GB = **$1.35 USD/mes**.

### Arquitectura del Worker:
```
CRON: Cada domingo a las 3:00 AM Chile (o trigger manual desde admin)

1. Consultar tabla acargoo_pods:
   → WHERE status = 'completed'
   → AND completed_at < (hoy - 7 días)
   → AND archived = false

2. Para cada orden encontrada:
   a. Descargar foto_entrega, firma, certificado.pdf desde Supabase Storage
   b. Subir a R2 en estructura:
      r2://acargoo-vault/2026/semana-07/AG-0421/entrega.jpg
      r2://acargoo-vault/2026/semana-07/AG-0421/firma.png
      r2://acargoo-vault/2026/semana-07/AG-0421/certificado.pdf
   c. Actualizar registro en DB:
      → archive_url = URL del R2
      → archived = true
   d. Borrar archivos de Supabase Storage

3. Al finalizar:
   → Log: "Archivado semanal: 45 servicios, 153 MB liberados"
   → Notificación al admin (opcional)
```

### Estructura en R2:
```
acargoo-vault/
├── 2026/
│   ├── semana-07/
│   │   ├── manifest.json       ← índice con metadata
│   │   ├── AG-0421/
│   │   │   ├── entrega.jpg
│   │   │   ├── firma.png
│   │   │   └── certificado.pdf
│   │   └── AG-0422/
│   │       └── ...
│   └── semana-08/
│       └── ...
```

### Recuperación de archivos:
Si el admin necesita un archivo archivado (ej: reclamo legal):
- Desde el panel: botón "Recuperar archivos" en la vista de la orden
- El sistema consulta la `archive_url` y la sirve desde R2
- **Sin costo de descarga** (R2 no cobra egress)

### Implementación:
- **Opción A:** Supabase Edge Function con pg_cron (todo dentro de Supabase)
- **Opción B:** Vercel Cron Job (API Route con schedule)
- Ambas usan el SDK de Cloudflare (`@aws-sdk/client-s3` — R2 es S3-compatible)

### Cuentas necesarias:
- Cuenta Cloudflare (gratuita)
- Crear bucket R2 "acargoo-vault"
- Generar API keys de R2

---

## ⚠️ Servicios que podrían necesitar después

| Servicio | Para qué | Cuándo |
|----------|----------|--------|
| **Sentry** | Monitoreo de errores en producción | Cuando esté en producción |
| **Analytics** (Plausible/Umami) | Ver uso del portal del cliente | Post-lanzamiento |
| **Backup externo** | Respaldo adicional de la DB | Cuando manejen datos sensibles |

---

## 📋 Checklist Final — Cuentas a Crear

| # | Cuenta/Servicio | ¿Quién? | Costo | Estado |
|---|----------------|---------|-------|--------|
| 1 | Proyecto Supabase independiente | H0 | $0 | 🔲 Pendiente |
| 2 | Cuenta Brevo + dominio de envío | H0 | $0 | 🔲 Pendiente |
| 3 | Google Cloud Console + APIs Maps | H0 | $0 | 🔲 Pendiente |
| 4 | Cloudflare R2 bucket "acargoo-vault" | H0 | $0 | 🔲 Pendiente |
| 5 | Evolution API (cloud managed) | H0 (costo cliente) | ~$19/mes | 🔲 Pendiente |
| 6 | Dominio acargoo.cl | **Cliente** | ~$10/año | 🔲 Disponible |
| 7 | Número WhatsApp Business dedicado | **Cliente** | $0 | 🔲 Pendiente |

---

> **Conclusión:** El stack completo de Acargoo+ arranca con **~$20 USD/mes para el cliente**
> (Evolution API cloud $19 + R2 centavos). **Costo para HojaCero: $0.**
> El worker de archivado R2 mantiene a Supabase en plan gratuito indefinidamente.
> El dominio acargoo.cl ($10 USD/año) lo paga el cliente por separado.
>
> **Desglose de costos operativos mensuales (los paga el cliente):**
> - Evolution API (WhatsApp): $19 USD/mes
> - Cloudflare R2: $0 (10 GB gratis, luego centavos)
> - Supabase: $0 (free tier con archivado semanal)
> - Google Maps: $0 (10K requests/SKU/mes gratis)
> - Brevo (emails): $0 (300/día gratis)
> - Vercel, Push, PDFs: $0
>
> *— Stack validado por el equipo técnico HojaCero, Feb 2026*
