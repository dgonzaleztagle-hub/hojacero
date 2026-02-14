# 🚛 Acargoo+ — Guía de Configuración de Servicios
> **Documento para el cliente** | Febrero 2026
> **Objetivo:** Paso a paso para crear las cuentas y obtener las credenciales necesarias para activar la plataforma.
> **Tiempo estimado:** ~30 minutos en total
> **Costo:** $0 USD (todos los servicios tienen plan gratuito)

---

## 📋 Resumen de lo que necesitamos

| # | Servicio | Para qué se usa | Costo | ¿Quién lo hace? |
|---|----------|-----------------|-------|-----------------|
| 1 | **Google Maps Platform** | Autocompletar direcciones, calcular rutas y distancias | $0 USD (10,000 consultas gratis/mes) | El cliente |
| 2 | **Supabase** | Base de datos, autenticación de usuarios, almacenamiento de fotos/firmas | $0 USD (plan gratuito) | El cliente |
| 3 | **Brevo** | Envío automático de correos (confirmaciones, certificados de entrega) | $0 USD (300 emails/día gratis) | El cliente |

> **⚠️ Importante:** Cada servicio requiere que usted registre SU tarjeta de crédito/débito como respaldo.
> Sin embargo, **NO se le cobrará nada** mientras esté dentro de los límites gratuitos, que son más que suficientes para la operación.

---

## 1. 🗺️ Google Maps Platform

### ¿Para qué lo usamos?
- **Autocompletar direcciones** cuando el cliente escribe la dirección de origen y destino
- **Calcular la distancia y tiempo de viaje** entre los dos puntos
- **Mostrar el mapa** con la ubicación de los choferes y las rutas
- **Calcular el precio** del servicio basado en la distancia real

### ¿Cuánto cuesta?
**$0 USD.** Google otorga 10,000 consultas gratuitas por mes para cada servicio. Esto alcanza para aproximadamente **2,000 servicios de logística al mes** sin costo.

### Paso a paso:

#### Paso 1: Crear una cuenta de Google Cloud
1. Ir a → **https://cloud.google.com/**
2. Hacer clic en **"Comenzar gratis"** o **"Get started for free"**
3. Iniciar sesión con una cuenta de Gmail (puede ser la del negocio)
4. Completar los datos solicitados:
   - Nombre de la empresa
   - País: **Chile**
   - Aceptar los Términos de Servicio
5. **Ingresar tarjeta de crédito o débito** (NO se cobra, es solo verificación)

> 💡 **Tip:** Si ya tiene una cuenta de Gmail empresarial, úsela. Si no, puede crear una nueva en gmail.com.

#### Paso 2: Crear un proyecto
1. Una vez dentro de Google Cloud Console, ir a → **https://console.cloud.google.com/**
2. En la barra superior, hacer clic donde dice **"Seleccionar proyecto"** → **"Nuevo proyecto"**
3. Nombre del proyecto: **`Acargoo`**
4. Hacer clic en **"Crear"**

#### Paso 3: Habilitar las APIs necesarias
1. En el menú lateral izquierdo, ir a **"APIs y servicios"** → **"Biblioteca"**
2. Buscar y habilitar **cada una** de las siguientes APIs (hacer clic en cada una y luego en "Habilitar"):

| API | Buscar como | Para qué |
|-----|-------------|----------|
| **Places API (New)** | `Places API` | Autocompletar direcciones |
| **Directions API** | `Directions API` | Calcular rutas |
| **Distance Matrix API** | `Distance Matrix API` | Calcular distancias |
| **Geocoding API** | `Geocoding API` | Convertir direcciones a coordenadas |
| **Maps JavaScript API** | `Maps JavaScript API` | Mostrar mapas en la plataforma |

> ⚠️ **Son 5 APIs.** Asegúrese de habilitar las 5.

#### Paso 4: Crear la API Key
1. Ir a **"APIs y servicios"** → **"Credenciales"**
2. Hacer clic en **"+ Crear credenciales"** → **"Clave de API"**
3. Se generará una clave larga (algo como `AIzaSyC...`). **Copiarla y guardarla en un lugar seguro.**
4. (Recomendado) Hacer clic en **"Restringir clave"** para mayor seguridad:
   - En "Restricciones de aplicación", seleccionar **"Sitios web HTTP"**
   - Agregar el dominio: `*.acargoo.cl/*`
   - En "Restricciones de API", seleccionar **"Restringir clave"** y marcar las 5 APIs habilitadas

#### 📧 Lo que necesitamos que nos envíe:
```
✅ API Key de Google Maps: AIzaSy___________________________
```

---

## 2. 🗄️ Supabase (Base de Datos)

### ¿Para qué lo usamos?
- **Almacenar toda la información** del negocio (órdenes, clientes, choferes, vehículos)
- **Autenticación** (login del admin y los choferes)
- **Almacenamiento de archivos** (fotos de entrega, firmas digitales)
- **Comunicación en tiempo real** (actualización del tracking en vivo)

### ¿Cuánto cuesta?
**$0 USD.** El plan gratuito incluye:
- 500 MB de base de datos
- 1 GB de almacenamiento de archivos
- 50,000 usuarios activos por mes
- Conexiones en tiempo real

### Paso a paso:

#### Paso 1: Crear cuenta en Supabase
1. Ir a → **https://supabase.com/**
2. Hacer clic en **"Start your project"**
3. Iniciar sesión con **GitHub**
   - Si no tiene cuenta de GitHub, crear una primero en → **https://github.com/** (es gratis)
   - Usar el email del negocio para registrarse
4. Autorizar la conexión entre GitHub y Supabase

#### Paso 2: Crear un nuevo proyecto
1. Una vez dentro del Dashboard de Supabase, hacer clic en **"New Project"**
2. Completar:
   - **Organization:** Si no tiene una, crear una nueva con el nombre del negocio
   - **Name:** `acargoo`
   - **Database Password:** Crear una contraseña segura y **guardarla en un lugar seguro**
   - **Region:** Seleccionar **South America (São Paulo)** → es la más cercana a Chile
   - **Pricing Plan:** Seleccionar **Free** ($0/mes)
3. Hacer clic en **"Create new project"**
4. Esperar ~2 minutos mientras se crea el proyecto

#### Paso 3: Obtener las credenciales
1. Una vez creado el proyecto, ir a → **Settings** (ícono de engranaje) → **API**
2. Copiar los siguientes datos:

| Dato | Dónde está | Ejemplo |
|------|-----------|---------|
| **Project URL** | Bajo "Project URL" | `https://xxxxxx.supabase.co` |
| **Anon Key** (public) | Bajo "Project API keys" → `anon` `public` | `eyJhbGci...` (texto largo) |
| **Service Role Key** (secret) | Bajo "Project API keys" → `service_role` `secret` | `eyJhbGci...` (texto largo) |

> ⚠️ **IMPORTANTE:** La **Service Role Key** es SECRETA. No comparta esta clave con nadie más.
> Solo debe enviárnosla a nosotros de forma segura (por ejemplo, por un mensaje directo).

#### 📧 Lo que necesitamos que nos envíe:
```
✅ Project URL: https://__________.supabase.co
✅ Anon Key: eyJhbGci_______________________________
✅ Service Role Key: eyJhbGci_________________________ (SECRETO)
✅ Database Password: ________________________________ (SECRETO)
```

---

## 3. 📧 Brevo (Envío de Correos)

### ¿Para qué lo usamos?
- Enviar **confirmaciones automáticas** cuando un cliente reserva un servicio
- Enviar **notificaciones** al chofer cuando se le asigna un servicio
- Enviar el **certificado de entrega (PDF)** al cliente cuando el servicio finaliza
- Enviar **alertas** al administrador sobre nuevas reservas

### ¿Cuánto cuesta?
**$0 USD.** El plan gratuito permite enviar **300 correos por día** (hasta 9,000 al mes). Esto alcanza para más de 75 servicios diarios.

### Paso a paso:

#### Paso 1: Crear cuenta en Brevo
1. Ir a → **https://www.brevo.com/**
2. Hacer clic en **"Sign Up Free"** (Registrarse gratis)
3. Completar el formulario con:
   - **Email:** El correo del negocio
   - **Contraseña:** Crear una segura
   - **Nombre de la empresa:** Acargoo (o el nombre real del negocio)
4. Verificar el correo haciendo clic en el enlace que llegará al email

#### Paso 2: Completar el perfil
1. Brevo pedirá completar información del negocio:
   - **Nombre de la empresa**
   - **Dirección** (puede ser la dirección comercial)
   - **Teléfono**
   - **Industria:** Seleccionar **"Transportation / Logistics"**
   - **Cantidad de contactos:** Seleccionar la opción más baja
2. Completar todo y continuar

#### Paso 3: Obtener la API Key
1. En el Dashboard de Brevo, ir al menú superior derecho → **nombre de usuario** → **"SMTP & API"**
   - O ir directamente a → **https://app.brevo.com/settings/keys/api**
2. Hacer clic en **"Generate a new API key"**
3. Nombre de la clave: `acargoo-produccion`
4. Hacer clic en **"Generate"**
5. **Copiar la API Key inmediatamente** (solo se muestra una vez)
   - Tiene formato: `xkeysib-xxxxxxxx...`

#### Paso 4: Configurar el remitente
1. Ir a → **"Senders, Domains & Dedicated IPs"** en la configuración
   - O → **https://app.brevo.com/senders/list**
2. Hacer clic en **"Add a sender"**
3. Completar:
   - **From Name:** `Acargoo` (o el nombre que quieran que aparezca)
   - **From Email:** `notificaciones@acargoo.cl` (o el email que prefieran)
4. Brevo enviará un correo de verificación a esa dirección
5. Verificar haciendo clic en el enlace del correo

> 💡 **Nota:** Si aún no tienen configurado el correo `@acargoo.cl`, pueden usar temporalmente cualquier correo que ya tengan (ej: `acargoo.servicios@gmail.com`). Después lo cambiamos al dominio propio.

#### (Opcional) Paso 5: Verificar el dominio
Para mejor entregabilidad de correos (que no caigan en spam):
1. Ir a **"Senders, Domains & Dedicated IPs"** → **"Domains"**
2. Hacer clic en **"Add a domain"**
3. Ingresar: `acargoo.cl`
4. Brevo mostrará **registros DNS** que hay que agregar en el panel del dominio
5. **Esto lo haremos nosotros** — solo necesitamos acceso al panel DNS del dominio

#### 📧 Lo que necesitamos que nos envíe:
```
✅ API Key de Brevo: xkeysib-_______________________________
✅ Email remitente configurado: ____________________________
```

---

## 4. 🌍 Dominio acargoo.cl

### ¿Para qué lo usamos?
- La dirección web oficial de la plataforma (ej: `app.acargoo.cl`)
- Los links de seguimiento en vivo (ej: `track.acargoo.cl/AG-0421`)
- El remitente de correos profesional (ej: `notificaciones@acargoo.cl`)

### Paso a paso:

#### Paso 1: Comprar el dominio
1. Ir a → **https://www.nic.cl/** (el registro oficial de dominios .cl)
2. Verificar disponibilidad de `acargoo.cl`
3. Proceder con la compra (~$10.000 CLP/año + IVA)
4. Completar los datos del titular (nombre, RUT, dirección)

> 💡 **Alternativa:** También se puede comprar a través de proveedores como **Cloudflare Registrar** (https://www.cloudflare.com/products/registrar/) que suele ser más barato.

#### Paso 2: Configurar DNS en Cloudflare (lo hacemos nosotros)
Una vez comprado el dominio, necesitamos apuntar los DNS a Cloudflare para gestionar todo:
1. Crear cuenta gratuita en → **https://www.cloudflare.com/**
2. Agregar el sitio `acargoo.cl`
3. Cloudflare dará **2 nameservers** que hay que configurar en NIC.cl
4. **Esto lo configuramos nosotros** — solo necesitamos acceso temporal al panel de NIC.cl o los nameservers

#### 📧 Lo que necesitamos que nos envíe:
```
✅ Dominio comprado: acargoo.cl
✅ Acceso al panel de NIC.cl (usuario y contraseña) para configurar DNS
   O preferiblemente: crear cuenta Cloudflare y darnos acceso
```

---

## 📦 Resumen Final — Lo que el cliente debe hacer

### Checklist completo:

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1 | Crear cuenta Google Cloud + proyecto + habilitar 5 APIs + crear API Key | ~10 min | ⬜ |
| 2 | Crear cuenta Supabase + proyecto "acargoo" + copiar credenciales | ~5 min | ⬜ |
| 3 | Crear cuenta Brevo + API Key + configurar remitente | ~10 min | ⬜ |
| 4 | Comprar dominio acargoo.cl | ~5 min | ⬜ |
| **Total** | | **~30 min** | |

### Todas las credenciales que necesitamos recibir:

```
═══════════════════════════════════════════════════
  CREDENCIALES ACARGOO+ (enviar de forma segura)
═══════════════════════════════════════════════════

🗺️ GOOGLE MAPS:
   API Key: ________________________________________

🗄️ SUPABASE:
   Project URL:      ________________________________________
   Anon Key:         ________________________________________
   Service Role Key: ________________________________________ (SECRETO)
   DB Password:      ________________________________________ (SECRETO)

📧 BREVO:
   API Key:          ________________________________________
   Email remitente:  ________________________________________

🌍 DOMINIO:
   Dominio:          acargoo.cl
   Acceso DNS:       ________________________________________

═══════════════════════════════════════════════════
```

> **⚠️ SEGURIDAD:** Estas credenciales dan acceso a los servicios de su empresa.
> Envíelas por un canal seguro (mensaje directo, NO por email público).
> Nunca las publique en redes sociales ni las comparta con terceros.

---

> **¿Necesita ayuda?** Si tiene dudas en cualquier paso, contáctenos y lo guiamos en tiempo real.
> Podemos hacer una videollamada de 15 minutos para configurar todo juntos.
>
> *— Equipo HojaCero | Architects of Digital Experiences*
