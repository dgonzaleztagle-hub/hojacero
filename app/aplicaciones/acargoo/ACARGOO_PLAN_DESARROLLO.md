# 🚀 ACARGOO+ — Plan de Desarrollo (Post-APIs)

**Versión:** 1.0  
**Fecha:** 15 de Febrero 2026  
**Tiempo Total Estimado:** 38-48 horas (~5 días hábiles)  
**Prerequisito:** Credenciales recibidas (Google Maps, Supabase, Brevo)

---

## 📋 PRE-REQUISITOS (Antes de empezar)

### ✅ Checklist de Credenciales

- [ ] **Google Maps API Key** recibida y validada
- [ ] **Supabase Project URL** + **Anon Key** + **Service Role Key**
- [ ] **Brevo API Key** recibida
- [ ] **Dominio acargoo.cl** comprado (opcional para MVP)
- [ ] **Respuestas del cliente** a `ACARGOO_DEFINICIONES_CLIENTE.md` (mínimo preguntas 1-5)

### ✅ Configuración Inicial

```bash
# 1. Crear archivo .env.local en la raíz del proyecto
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
BREVO_API_KEY=xkeysib-...
EVOLUTION_API_URL=https://...
EVOLUTION_API_KEY=...

# 2. Instalar dependencias necesarias
npm install @react-pdf/renderer
npm install @supabase/supabase-js
npm install @googlemaps/google-maps-services-js
```

---

## 🏗️ FASE 1: FUNDACIÓN (Día 1-2)

**Objetivo:** Conectar la base de datos y autenticación  
**Tiempo:** 8-10 horas  
**Bloqueante:** 🔴 SÍ

### 1.1 Crear Schema de Supabase

- [ ] Ejecutar `ACARGOO_SCHEMA_DB.sql` en el proyecto Supabase del cliente
- [ ] Verificar que las 10 tablas se crearon correctamente
- [ ] Verificar que las RLS policies están activas
- [ ] Crear buckets de Storage:
  - `acargoo_driver_photos` (fotos de perfil de choferes)
  - `acargoo_pod_photos` (fotos de entrega)
  - `acargoo_pod_signatures` (firmas digitales)
  - `acargoo_pod_pdfs` (certificados generados)

**Comando de verificación:**
```sql
-- En Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE 'acargoo_%';
```

### 1.2 Configurar Autenticación

- [ ] Habilitar Email Auth en Supabase (Settings → Authentication)
- [ ] Crear middleware de protección de rutas en Next.js:
  - `middleware.ts` para proteger `/aplicaciones/acargoo/admin/*`
  - `middleware.ts` para proteger `/aplicaciones/acargoo/driver/*`
- [ ] Crear páginas de login:
  - `/aplicaciones/acargoo/admin/login`
  - `/aplicaciones/acargoo/driver/login`
- [ ] Implementar logout en ambos paneles

**Archivos a crear:**
```
app/aplicaciones/acargoo/
├── admin/
│   └── login/
│       └── page.tsx
├── driver/
│   └── login/
│       └── page.tsx
└── middleware.ts (protección de rutas)
```

### 1.3 Crear Usuario Admin Inicial

- [ ] Desde Supabase Dashboard → Authentication → Add User
- [ ] Email: (del cliente)
- [ ] Password: (temporal, cambiar en primer login)
- [ ] Insertar en `acargoo_drivers` con `role = 'admin'`

**SQL de inserción:**
```sql
INSERT INTO acargoo_drivers (id, full_name, email, phone, role, is_active)
VALUES (
  'uuid-del-usuario-creado-en-auth',
  'Administrador Principal',
  'admin@acargoo.cl',
  '+56912345678',
  'admin',
  true
);
```

### 1.4 Testing de Autenticación

- [ ] Login como admin funciona
- [ ] Redirect a `/admin` tras login exitoso
- [ ] Logout funciona correctamente
- [ ] Rutas protegidas redirigen a login si no autenticado

---

## ⚙️ FASE 2: BACKEND CORE (Día 2-3)

**Objetivo:** APIs funcionales para flujo básico  
**Tiempo:** 10-12 horas  
**Bloqueante:** 🔴 SÍ

### 2.1 API de Servicios (Catálogo)

**Archivo:** `app/api/acargoo/services/route.ts`

- [ ] `GET /api/acargoo/services` → Listar servicios disponibles
- [ ] `POST /api/acargoo/services` → Crear nuevo servicio (admin only)
- [ ] Seed inicial de servicios (TV, Mudanza Pequeña, Carga General, Express)

**Testing:**
```bash
curl http://localhost:3000/api/acargoo/services
# Debe retornar: [{ id, name, description, base_price, icon }]
```

### 2.2 API de Órdenes

**Archivos:**
```
app/api/acargoo/orders/
├── route.ts                    # GET (listar), POST (crear)
└── [orderId]/
    ├── route.ts                # GET, PATCH, DELETE
    └── assign/route.ts         # POST (asignar chofer)
```

**Endpoints a implementar:**

- [ ] `POST /api/acargoo/orders` → Crear orden desde portal cliente
  - Validar direcciones con Google Geocoding API
  - Calcular distancia con Google Distance Matrix API
  - Calcular precio según modelo definido por el cliente
  - Guardar en `acargoo_orders` con `status = 'pending'`
  - Retornar `order_id` y `tracking_code` (ej: AG-7281)

- [ ] `GET /api/acargoo/orders` → Listar órdenes (con filtros)
  - Query params: `status`, `driver_id`, `date_from`, `date_to`
  - Retornar con datos de cliente, chofer asignado, vehículo

- [ ] `GET /api/acargoo/orders/[orderId]` → Detalle de orden

- [ ] `PATCH /api/acargoo/orders/[orderId]` → Actualizar orden
  - Cambiar status: `pending → assigned → in_transit → completed → cancelled`

- [ ] `POST /api/acargoo/orders/[orderId]/assign` → Asignar chofer
  - Validar que el chofer esté disponible
  - Actualizar `driver_id` y `vehicle_id`
  - Cambiar status a `assigned`
  - Enviar notificación al chofer (email + push)

**Testing:**
```bash
# Crear orden
curl -X POST http://localhost:3000/api/acargoo/orders \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "uuid-del-servicio",
    "pickup_address": "Av. Américo Vespucio 1200, Pudahuel",
    "delivery_address": "Calle Nueva 44, Vitacura",
    "client_name": "BioCrom Lab",
    "client_phone": "+56912345678",
    "client_email": "contacto@biocrom.cl",
    "scheduled_date": "2026-02-20",
    "scheduled_time": "14:00"
  }'

# Debe retornar: { order_id, tracking_code, estimated_price, distance_km }
```

### 2.3 API de Pricing

**Archivo:** `app/api/acargoo/pricing/calculate/route.ts`

- [ ] `POST /api/acargoo/pricing/calculate`
  - Recibir: `pickup_address`, `delivery_address`, `service_id`
  - Llamar a Google Distance Matrix API
  - Aplicar fórmula de pricing definida por el cliente
  - Retornar: `{ distance_km, duration_min, estimated_price }`

**Modelo de pricing a implementar (según respuesta del cliente):**
```typescript
// Ejemplo: Base + km + tipo de servicio
const basePrice = 15000; // CLP
const pricePerKm = 500; // CLP
const serviceMultiplier = service.multiplier; // 1.0, 1.5, 2.0

const totalPrice = (basePrice + (distance_km * pricePerKm)) * serviceMultiplier;
```

### 2.4 API de Onboarding de Choferes 🆕

**Archivo:** `app/api/acargoo/drivers/onboard/route.ts`

- [ ] `POST /api/acargoo/drivers/onboard`
  - Recibir: `full_name`, `rut`, `phone`, `email`, `vehicle_id`, `photo`
  - Crear usuario en Supabase Auth
  - Insertar en `acargoo_drivers` con `role = 'driver'`
  - Subir foto a `acargoo_driver_photos`
  - Enviar email de bienvenida con credenciales temporales
  - Retornar: `{ driver_id, temp_password }`

**UI en Admin Panel:**
- [ ] Modal "Nuevo Chofer" en `/aplicaciones/acargoo/admin` (sección Choferes)
- [ ] Formulario con campos: Nombre, RUT, Teléfono, Email, Vehículo, Foto
- [ ] Botón "Registrar y Enviar Credenciales"

### 2.5 API de Choferes

**Archivos:**
```
app/api/acargoo/drivers/
├── route.ts                    # GET (listar), POST (crear)
└── [driverId]/
    └── route.ts                # GET, PATCH
```

- [ ] `GET /api/acargoo/drivers` → Listar choferes
  - Filtros: `is_active`, `role`
  - Incluir datos del vehículo asignado

- [ ] `PATCH /api/acargoo/drivers/[driverId]` → Actualizar chofer
  - Cambiar `is_active`, `vehicle_id`, etc.

### 2.6 Testing End-to-End (Fase 2)

- [ ] **Flujo completo:**
  1. Cliente crea orden desde portal → Orden guardada en DB
  2. Admin ve orden en panel → Asigna chofer
  3. Chofer ve orden en su app → Acepta
  4. Status actualizado correctamente en cada paso

---

## 📍 FASE 3: TRACKING Y POD (Día 3-4)

**Objetivo:** Tracking en tiempo real y prueba de entrega  
**Tiempo:** 8-10 horas  
**Bloqueante:** 🟡 Parcial

### 3.1 API de Tracking GPS

**Archivo:** `app/api/acargoo/drivers/[driverId]/location/route.ts`

- [ ] `POST /api/acargoo/drivers/[driverId]/location`
  - Recibir: `{ lat, lng, timestamp }`
  - Insertar en `acargoo_tracking`
  - Actualizar `last_location` del chofer en `acargoo_drivers`
  - Broadcast vía Supabase Realtime

**Implementación en App del Chofer:**
- [ ] Solicitar permisos de geolocalización
- [ ] Enviar posición cada 30 segundos cuando `status = 'in_transit'`
- [ ] Detener tracking cuando `status = 'completed'`

### 3.2 Supabase Realtime en Mapa

**Archivo:** `components/aplicaciones/acargoo/AcargooMap.tsx`

- [ ] Suscribirse a cambios en `acargoo_tracking`
- [ ] Actualizar marcadores del mapa en tiempo real
- [ ] Mostrar ruta del chofer (polyline)

**Código de ejemplo:**
```typescript
const channel = supabase
  .channel('tracking')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'acargoo_tracking'
  }, (payload) => {
    // Actualizar mapa con nueva posición
    updateDriverMarker(payload.new);
  })
  .subscribe();
```

### 3.3 Geofencing (Proximidad)

- [ ] Calcular distancia entre chofer y destino
- [ ] Cuando distancia < 500m:
  - Enviar notificación al cliente: "Tu chofer está a 5 minutos"
  - Actualizar UI del tracking con badge "Llegando pronto"

### 3.4 API de POD (Proof of Delivery)

**Archivo:** `app/api/acargoo/pod/[orderId]/route.ts`

- [ ] `POST /api/acargoo/pod/[orderId]`
  - Recibir: `signature_data` (base64), `photo` (opcional)
  - Subir firma a `acargoo_pod_signatures`
  - Subir foto a `acargoo_pod_photos` (si existe)
  - Insertar en `acargoo_pods` con timestamp
  - Actualizar orden: `status = 'completed'`, `completed_at = NOW()`
  - Trigger: Generar PDF del certificado
  - Retornar: `{ pod_id, pdf_url }`

### 3.5 Generación de PDF (Certificado)

**Archivo:** `lib/acargoo/generate-pod-certificate.ts`

- [ ] Diseñar certificado con `@react-pdf/renderer`
  - Logo Acargoo+
  - Datos de la orden (ID, fecha, origen, destino)
  - Firma digital del cliente
  - Foto de entrega (si existe)
  - QR code con link de verificación
- [ ] Generar PDF server-side
- [ ] Subir a `acargoo_pod_pdfs`
- [ ] Retornar URL pública

**Componente de ejemplo:**
```tsx
import { Document, Page, Text, Image, View } from '@react-pdf/renderer';

const PODCertificate = ({ order, signature, photo }) => (
  <Document>
    <Page size="A4">
      <View>
        <Image src="/logo-acargoo.png" />
        <Text>Certificado de Entrega</Text>
        <Text>Orden: {order.tracking_code}</Text>
        <Image src={signature} />
        {photo && <Image src={photo} />}
      </View>
    </Page>
  </Document>
);
```

### 3.6 Testing (Fase 3)

- [ ] Chofer actualiza GPS → Mapa se actualiza en tiempo real
- [ ] Chofer llega a destino → Notificación enviada al cliente
- [ ] Chofer sube firma + foto → PDF generado correctamente
- [ ] PDF descargable desde panel admin y portal cliente

---

## 📧 FASE 4: NOTIFICACIONES (Día 4-5)

**Objetivo:** Emails y WhatsApp automáticos  
**Tiempo:** 6-8 horas  
**Bloqueante:** 🟡 Parcial

### 4.1 Integración con Brevo (Emails)

**Archivo:** `lib/acargoo/email-service.ts`

- [ ] Wrapper para Brevo API
- [ ] Función `sendEmail(to, template, data)`
- [ ] Templates de emails:
  1. **Confirmación de reserva** (al cliente)
  2. **Asignación de servicio** (al chofer)
  3. **Chofer en camino** (al cliente)
  4. **Entrega completada + PDF** (al cliente)
  5. **Bienvenida chofer** (onboarding)

**Ejemplo de template:**
```typescript
const templates = {
  order_confirmed: {
    subject: '✅ Servicio Confirmado - {{tracking_code}}',
    html: `
      <h1>¡Hola {{client_name}}!</h1>
      <p>Tu servicio ha sido confirmado.</p>
      <p><strong>Código de seguimiento:</strong> {{tracking_code}}</p>
      <p><a href="{{tracking_url}}">Seguir mi carga en tiempo real</a></p>
    `
  }
};
```

### 4.2 Integración con Evolution API (WhatsApp)

**Archivo:** `lib/acargoo/whatsapp-service.ts`

- [ ] Wrapper para Evolution API
- [ ] Función `sendWhatsApp(phone, message)`
- [ ] Templates de mensajes:
  1. "✅ Servicio AG-XXXX confirmado. Chofer: [Nombre]. Fecha: [Fecha]"
  2. "🚛 Tu chofer [Nombre] está en camino. Sigue tu carga: [link]"
  3. "📍 Tu chofer llegará en aproximadamente 10 minutos"
  4. "✅ Entrega completada. Certificado: [link PDF]"

### 4.3 Worker de Notificaciones

**Archivo:** `app/api/acargoo/notifications/send/route.ts`

- [ ] `POST /api/acargoo/notifications/send`
  - Recibir: `order_id`, `event_type`, `recipient_type`
  - Determinar template según `event_type`
  - Enviar email + WhatsApp en paralelo
  - Guardar log en `acargoo_notifications`

**Eventos a implementar:**
```typescript
type NotificationEvent = 
  | 'order_created'
  | 'order_assigned'
  | 'driver_on_route'
  | 'driver_near'
  | 'order_completed'
  | 'driver_onboarded';
```

### 4.4 Triggers Automáticos

- [ ] Cuando orden se crea → Enviar `order_created` al cliente
- [ ] Cuando orden se asigna → Enviar `order_assigned` al chofer
- [ ] Cuando chofer inicia ruta → Enviar `driver_on_route` al cliente
- [ ] Cuando chofer está cerca → Enviar `driver_near` al cliente
- [ ] Cuando orden se completa → Enviar `order_completed` al cliente con PDF

### 4.5 Testing (Fase 4)

- [ ] Crear orden → Cliente recibe email + WhatsApp
- [ ] Asignar chofer → Chofer recibe notificación
- [ ] Completar entrega → Cliente recibe PDF por email
- [ ] Verificar logs en `acargoo_notifications`

---

## ✨ FASE 5: POLISH Y EXTRAS (Día 5)

**Objetivo:** Incidencias, reportes, optimizaciones  
**Tiempo:** 6-8 horas  
**Bloqueante:** 🟢 NO

### 5.1 Sistema de Incidencias

**Archivos:**
```
app/api/acargoo/incidents/
├── route.ts                    # POST (crear), GET (listar)
└── [incidentId]/
    └── route.ts                # PATCH (resolver)
```

- [ ] Modal en app del chofer para reportar incidencia
  - Tipo: Cliente no está, Carga dañada, Accidente, Otro
  - Descripción (textarea)
  - Foto (opcional)
- [ ] `POST /api/acargoo/incidents`
  - Guardar en `acargoo_incidents`
  - Enviar notificación urgente al admin
- [ ] Vista de incidencias en panel admin
  - Filtros: Pendientes, Resueltas
  - Botón "Marcar como resuelta"

### 5.2 Exportación de Reportes

**Archivo:** `app/api/acargoo/reports/export/route.ts`

- [ ] `POST /api/acargoo/reports/export`
  - Tipo: `daily`, `weekly`, `monthly`, `driver_performance`
  - Formato: `pdf` o `xlsx`
  - Generar reporte con datos de `acargoo_orders`
  - Retornar archivo descargable

**Reportes a implementar:**
- [ ] Reporte diario de servicios
- [ ] Reporte mensual de facturación
- [ ] Reporte de rendimiento por chofer (servicios, calificación, km)

### 5.3 Optimizaciones de Performance

- [ ] Lazy loading de componentes pesados (Mapa, PDF viewer)
- [ ] Caching de servicios y choferes en localStorage
- [ ] Optimistic updates en UI (actualizar antes de confirmar API)
- [ ] Compresión de imágenes antes de subir (POD photos)

### 5.4 Testing End-to-End Completo

- [ ] **Flujo Cliente:**
  1. Reservar servicio → Confirmación recibida
  2. Tracking en tiempo real → Mapa actualizado
  3. Entrega completada → PDF recibido por email

- [ ] **Flujo Admin:**
  1. Ver órdenes pendientes
  2. Asignar chofer
  3. Ver mapa de flota en tiempo real
  4. Exportar reporte mensual

- [ ] **Flujo Chofer:**
  1. Login → Ver asignación
  2. Navegar a origen
  3. Confirmar carga
  4. Navegar a destino
  5. Capturar firma + foto
  6. Finalizar servicio

### 5.5 Deploy a Producción

- [ ] Configurar variables de entorno en Vercel
- [ ] Deploy a `acargoo.vercel.app` (o dominio del cliente)
- [ ] Configurar DNS de `acargoo.cl` → Vercel
- [ ] Testing en producción con datos reales
- [ ] Capacitación al cliente (admin + choferes)

---

## 📊 CHECKLIST FINAL DE ENTREGA

- [ ] ✅ Todas las APIs funcionan correctamente
- [ ] ✅ Autenticación implementada y segura
- [ ] ✅ Tracking en tiempo real operativo
- [ ] ✅ Notificaciones (email + WhatsApp) enviándose
- [ ] ✅ PDFs generándose correctamente
- [ ] ✅ Onboarding de choferes funcional
- [ ] ✅ Panel admin completo y funcional
- [ ] ✅ App del chofer completa y funcional
- [ ] ✅ Portal del cliente completo y funcional
- [ ] ✅ Testing end-to-end exitoso
- [ ] ✅ Deploy a producción realizado
- [ ] ✅ Documentación de uso entregada al cliente
- [ ] ✅ Capacitación realizada

---

## 🆘 TROUBLESHOOTING

### Problema: Google Maps API retorna error 403
**Solución:** Verificar que la API Key tiene las restricciones correctas (dominio permitido) y que las 5 APIs están habilitadas.

### Problema: Supabase RLS bloquea inserts
**Solución:** Verificar que las policies permiten `INSERT` para el rol correspondiente. Usar Service Role Key para operaciones admin.

### Problema: Emails no llegan
**Solución:** Verificar que el dominio remitente está verificado en Brevo. Revisar logs en Brevo Dashboard.

### Problema: WhatsApp no envía
**Solución:** Verificar que Evolution API está online. Revisar que el número está conectado correctamente.

### Problema: PDF no se genera
**Solución:** Verificar que `@react-pdf/renderer` está instalado. Revisar logs del servidor para errores de renderizado.

---

**FIN DEL PLAN DE DESARROLLO** ✅

*Última actualización: 15 de Febrero 2026, 23:29*
