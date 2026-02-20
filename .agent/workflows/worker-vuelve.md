---
description: Inyecta el sistema de fidelización Vuelve+ (SaaS independiente) de forma automática y Zero-Touch en el panel y frontend del cliente.
---

# 🪄 Worker - Vuelve+ Integrator (The Loyalty Injector)

// turbo-all

## 🎯 OBJETIVO SUPREMO
El comando `/worker-vuelve` convierte cualquier página web o SaaS creado por HojaCero en una máquina de retención de clientes. Inyecta el ecosistema completo de **Vuelve.vip** (Fidelización) de forma invisible, configurando cuentas, variables de entorno, interfaces de administrador vía Iframe, y puntos de captura en el frontend, todo mediante Zero-Touch Onboarding.

**REGLA DE HARVARD:** No existen los "placeholders" en este worker. Si ejecutas este comando, el cliente termina con un sistema 100% funcional conectado a producción `vuelve.vip`.

---

## 🛠️ FASE 0: ZERO-TOUCH ONBOARDING (La Magia Silenciosa)

1. **Recolección de Inteligencia:**
   - Escanea el proyecto actual (e.g., `package.json`, `BRAND_SOUL.md`, o la base de datos de Supabase si existe) para extraer:
     - Nombre del Negocio / Cliente.
     - Email de contacto principal.
     - Rubro y Color Primario del layout.

2. **Ejecución del Registro:**
   - Realiza una petición `POST` oculta a la API de producción de Vuelve+:
     ```http
     POST https://vuelve.vip/api/tenant/register
     Content-Type: application/json

     {
       "nombre": "[Nombre Extraído]",
       "email": "[Email Extraído]",
       "rubro": "[Rubro]",
       "color_primario": "[Color]",
       "puntos_meta": 10,
       "descripcion_premio": "Premio Sorpresa",
       "tipo_premio": "descuento",
       "tipo_programa": "sellos"
     }
     ```
   - **Espera la respuesta:** La API devolverá el `tenant.id` (ID Maestro), `tenant.slug`, y un Token de Administrador generado.

---

## 🔐 FASE 1: SECRETS & ENVIRONMENT

1. Abre (o crea) el archivo `.env` o `.env.local` del proyecto cliente actual.
2. Inyecta estrictamente estas variables usando los datos obtenidos en la Fase 0:
   ```env
   # VUELVE+ LOYALTY ENGINE
   NEXT_PUBLIC_VUELVE_TENANT_ID="[El tenant.id devuelto por la API]"
   VUELVE_SECRET_TOKEN="[El token secreto de auto-login para el Iframe]"
   ```
3. Verifica que Next.js haya recargado las variables de entorno.

---

## 🖥️ FASE 2: INYECCIÓN DE INTERFAZ ADMIN (El Caballo de Troya)

El cliente de HojaCero debe poder administrar sus premios dentro de la página web que le vendimos, sintiendo que Vuelve+ es un módulo nativo.

1. **Búsqueda del Panel:**
   - Localiza el layout del panel administrativo del cliente (por lo general en `app/admin/layout.tsx`, `components/Sidebar.tsx` o similar).
2. **Inyección en el Menú Lateral:**
   - Añade un nuevo botón de navegación con el icono `Gift` o `Star` llamado **"Fidelización"** o **"Mis Puntos"**.
3. **Creación de la Ruta Vista:**
   - Crea un nuevo archivo en el router de la app del cliente: `app/admin/fidelizacion/page.tsx` (o equivalente).
   - Este componente debe renderizar un **Iframe de Seguridad Máxima**.
   - **Arquitectura del Iframe SSO:**
     El iframe NO DEBE apuntar a login. Debe armar un token firmado (ej. usando un JWT en el servidor propio de Next.js u obteniendo una sesión temporal) y pasarlo.
     ```tsx
     <iframe 
       src={`https://vuelve.vip/api/auth/sso?token=${process.env.VUELVE_SECRET_TOKEN}&redirect=/cliente`}
       className="w-full h-screen border-none"
       title="Panel Vuelve+"
     />
     ```

---

## 🤝 FASE 3: FRONTEND CAPTURE POINT (Donde el cliente juega)

Tenemos que darle una forma a los usuarios finales de sumar puntos al interactuar con la web de HojaCero.

### Diagnóstico de Escenario:
- **¿Es un E-commerce (Store Engine)?**
  Ve a la página de "Success" (Checkout completado) e inyecta un componente `<VuelveCheckoutWidget />`.
  Consumo sugerido: Una vez procesado el pago, muestra: *"¡Ganaste un punto! Ingresa tu WhatsApp para sumarlo a tu tarjeta digital"*. Y llama a `POST https://vuelve.vip/api/stamp`.
- **¿Es un Restaurante (Food Pro)? / ¿Reserva de Horas?**
  Inyecta la lógica en la pantalla de "Reserva Confirmada".
- **¿Es Landing Informativa?**
  Añade una sección en el Footer o Contacto: *"Sé parte de nuestro club VIP"* vinculando directamente hacia `https://vuelve.vip/qr/[tenant-slug]`.

---

## 🛡️ FASE 4: AUDITORÍA Y COMPROBACIÓN FINAL (El Cierre del Círculo)

1. Valida que el Iframe de `/admin/fidelizacion` compile sin errores de hydration o de TypeScript.
2. Valida que las llamadas a la API de registro de Vuelve+ funcionen como un *try/catch* seguro (si la cuenta ya existe por email, el worker debe recuperar ese error elegantemente o saltar el onboarding usando un `.env` existente).
3. Escribe en el `CHANGELOG.md` del cliente: `[FECHA] - Módulo de Fidelización Vuelve+ inyectado vía protocolo H0-ZeroTouch.`
4. Notifica a Daniel: *"Inyección Vuelve+ Finalizada con éxito. El SaaS de terceros ahora respira como módulo nativo."*

---
> No construimos webs. Construimos ecosistemas que atraen e hipnotizan a los usuarios de nuestros clientes.
