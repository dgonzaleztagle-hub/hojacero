---
description: Inyecta el sistema de pasarelas de pago en un Store Engine existente
---

# 💳 Worker: Store Payments

## Objetivo
Inyectar el **sistema de pasarelas de pago** (Mercado Pago, Flow, Transbank) en un Store Engine ya instalado.

---

## Pre-requisitos

✅ Store Engine ya instalado (`/worker-store-pro` ejecutado)  
✅ Proyecto con Next.js y Supabase configurados  
✅ Acceso a Supabase Dashboard

---

## Ejecución Automática

// turbo-all
```bash
cd scripts
npm install
node inject-payment-gateways.js
```

**El script hará:**
1. ✅ Ejecutar migración SQL en Supabase
2. ✅ Copiar archivos de SDKs y utilidades
3. ✅ Copiar API routes (create-payment + webhook)
4. ✅ Copiar componentes (CheckoutButton, página de éxito)
5. ✅ Copiar panel de configuración de pagos
6. ✅ Generar PAYMENT_ENCRYPTION_KEY
7. ✅ Actualizar .env.local
8. ✅ Mensaje de confirmación con URL de guía

---

## Paso 1: Ejecutar Migración SQL

Aplicar migración de payment gateways:

```bash
# Opción A: CLI de Supabase
supabase db push --file supabase/migrations/20260210_add_payment_gateway_support.sql

# Opción B: Manual en Dashboard
# Copiar contenido de 20260210_add_payment_gateway_support.sql
# Pegar en SQL Editor → Run
```

**Tablas creadas:**
- `h0_store_payment_config` - Configuración de pasarelas
- Campos adicionales en `h0_store_orders`:
  - `payment_id` - ID del pago en la pasarela
  - `paid_at` - Timestamp de confirmación
  - `delivery_status` - Estado de entrega

---

## Paso 2: Generar Clave de Encriptación

Generar clave para encriptar credenciales:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Resultado:** Clave de 64 caracteres hexadecimales

---

## Paso 3: Actualizar Variables de Entorno

Agregar a `.env.local`:

```bash
# Encriptación de credenciales de pasarelas
PAYMENT_ENCRYPTION_KEY=tu_clave_generada_de_64_caracteres

# URL del sitio (para webhooks)
NEXT_PUBLIC_SITE_URL=https://tutienda.cl
```

---

## Paso 4: Inyectar Archivos

### 4.1 SDKs y Utilidades

Copiar archivos de integración con pasarelas:

```bash
cp lib/store/payment-gateways.ts [PROYECTO_CLIENTE]/lib/store/
cp lib/store/encryption.ts [PROYECTO_CLIENTE]/lib/store/
```

**Archivos:**
- `payment-gateways.ts` - SDKs de Mercado Pago, Flow, Transbank
- `encryption.ts` - Encriptación AES-256-GCM

### 4.2 API Routes

Copiar rutas de API:

```bash
cp -r app/api/store/create-payment [PROYECTO_CLIENTE]/app/api/store/
cp -r app/api/store/webhook [PROYECTO_CLIENTE]/app/api/store/
```

**Routes:**
- `create-payment/route.ts` - Crear pago con gateway
- `webhook/route.ts` - Recibir confirmaciones de pago

### 4.3 Componentes

Copiar componentes de pago:

```bash
cp components/store/CheckoutButton.tsx [PROYECTO_CLIENTE]/components/store/
cp -r app/tienda/pago-exitoso [PROYECTO_CLIENTE]/app/tienda/
```

**Componentes:**
- `CheckoutButton.tsx` - Botón de pago dinámico
- `pago-exitoso/page.tsx` - Página de confirmación

### 4.4 Panel de Configuración

Copiar panel de admin:

```bash
cp -r app/admin/tienda/pagos [PROYECTO_CLIENTE]/app/admin/tienda/
```

**Panel:**
- `pagos/page.tsx` - Configuración de pasarelas

### 4.5 Página de Ayuda Pública

Copiar guía para clientes:

```bash
cp -r app/guias/configurar-pagos [PROYECTO_CLIENTE]/app/guias/
```

**Guía:**
- `configurar-pagos/page.tsx` - Manual paso a paso

---

## Paso 5: Actualizar Storefront (Opcional)

Si quieres reemplazar el botón de WhatsApp por el de pago con tarjeta:

```tsx
// En app/tienda/page.tsx
import CheckoutButton from '@/components/store/CheckoutButton';

// Reemplazar handleCheckout con:
<CheckoutButton cart={cart} total={total} />
```

---

## Paso 6: Mensaje de Confirmación

Mostrar al usuario:

```
✅ Sistema de Pasarelas de Pago inyectado exitosamente!

📍 Panel de Configuración: http://localhost:3000/admin/tienda/pagos
📍 Guía para Cliente: http://localhost:3000/guias/configurar-pagos

🔐 PAYMENT_ENCRYPTION_KEY generada y agregada a .env.local

💳 Pasarelas soportadas:
- Mercado Pago (Recomendado)
- Flow (Chile)
- Transbank (Webpay Plus)

🚀 Próximos pasos:
1. Configurar pasarela en /admin/tienda/pagos
2. Compartir guía con cliente: [URL]/guias/configurar-pagos
3. Cliente configura sus credenciales
4. Probar pago en modo test
5. Activar modo producción

📖 Documentación completa:
- Ver PAYMENT_PRODUCTION_GUIDE.md
- Ver STORE_ENGINE_README.md (sección Payment Gateways)
```

---

## Checklist de Verificación

Antes de dar por terminada la inyección, verificar:

- [ ] Migración SQL ejecutada sin errores
- [ ] PAYMENT_ENCRYPTION_KEY generada
- [ ] Variables de entorno agregadas a .env.local
- [ ] Archivos de SDKs copiados
- [ ] API routes copiados
- [ ] Componentes copiados
- [ ] Panel de configuración copiado
- [ ] Guía pública copiada
- [ ] Panel admin accesible en /admin/tienda/pagos
- [ ] Guía accesible en /guias/configurar-pagos

---

## Troubleshooting

### Error: "Cannot find module '@/lib/store/payment-gateways'"
**Solución:** Verificar que `payment-gateways.ts` esté en `lib/store/`

### Error: "PAYMENT_ENCRYPTION_KEY is not defined"
**Solución:** Agregar clave a `.env.local` y reiniciar servidor

### Error: "Table h0_store_payment_config does not exist"
**Solución:** Ejecutar migración SQL en Supabase

### Panel de pagos no aparece
**Solución:** Verificar que `/admin/tienda/pagos/page.tsx` esté copiado correctamente

---

## Notas Técnicas

### Arquitectura de Seguridad

- **Credenciales encriptadas:** AES-256-GCM con clave única
- **Webhooks validados:** Firmas HMAC verificadas
- **RLS habilitado:** Solo usuarios autenticados acceden a config

### Flujo de Pago Completo

```
1. Cliente → Carrito → CheckoutButton
2. API crea orden en BD (status: pending)
3. SDK llama a gateway (MP/Flow/TB)
4. Gateway retorna checkout URL
5. Cliente redirigido a checkout
6. Cliente paga con tarjeta
7. Gateway envía webhook
8. Sistema actualiza orden (status: completed)
9. Gateway redirige a /pago-exitoso
10. Página verifica pago
11. Muestra botón wa.me con #pedido
```

### SDKs Implementados

**Mercado Pago:**
- Checkout Preferences API
- Sandbox + Production modes
- Webhook con external_reference

**Flow:**
- Payment Create API
- Firma HMAC SHA-256
- Webhook con commerceOrder

**Transbank:**
- Webpay Plus v1.2
- Integration + Production environments
- Token-based authentication

---

## URL de Guía para Compartir

**Después de la inyección, compartir con el cliente:**

```
🔗 https://[DOMINIO_CLIENTE]/guias/configurar-pagos
```

Esta guía incluye:
- Paso a paso para configurar cada pasarela
- Generación de claves de encriptación
- Configuración de webhooks
- Modo test vs producción
- Troubleshooting común

---

**Última actualización:** 2026-02-10  
**Versión:** 1.0.0
