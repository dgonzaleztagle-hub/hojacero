# 🚛 Acargoo+ — Definiciones Pendientes del Cliente
> **Documento interno HojaCero** | Preparado para reunión de kick-off
> **Fecha:** 13 de Febrero 2026
> **Objetivo:** Recopilar las respuestas del cliente que son NECESARIAS antes de comenzar el desarrollo real.

---

## 📋 Resumen Ejecutivo

La estrategia de Acargoo+ v1.0 está validada técnicamente: **todo lo prometido se puede construir**. Sin embargo, hay decisiones de negocio que solo el cliente puede tomar y que impactan directamente la arquitectura del sistema. Este documento lista cada una.

**Instrucción:** Cada pregunta tiene un ícono de impacto:
- 🔴 **Bloqueante** — Sin esta respuesta no se puede construir el módulo
- 🟡 **Importante** — Afecta el diseño pero se puede asumir un default
- 🟢 **Deseable** — Mejora la experiencia pero se puede agregar después

---

## 1. 💰 Modelo de Precios y Cobro

### 1.1 🔴 ¿Cómo se calcula el precio de un servicio?

**Opciones posibles:**
| Modelo | Ventaja | Desventaja |
|--------|---------|------------|
| **Precio fijo por tipo de servicio** | Simple de implementar | No refleja distancias reales |
| **Precio por km recorrido** | Justo para el cliente | No considera tipo de carga |
| **Base + km + tipo de carga** | El más preciso | Más complejo de configurar |
| **Cotización manual del admin** | Máxima flexibilidad | Lento, no escala |

**Pregunta directa:** *"¿Hoy cómo calculan el precio cuando un cliente les pide un servicio?"*

**Subpreguntas:**
- ¿Hay precio mínimo? (ej: "ningún servicio baja de $20.000")
- ¿Hay recargo por horario? (nocturno, fin de semana, feriado)
- ¿Hay recargo por tipo de carga? (refrigerado, peligrosa, frágil)
- ¿El IVA va incluido o se suma aparte?

---

### 1.2 🔴 ¿Cuándo se cobra al cliente?

| Momento | Implicación técnica |
|---------|---------------------|
| **Al reservar (prepago)** | El cliente paga antes. Se necesita póliza de cancelación/reembolso |
| **Al finalizar (postpago)** | Riesgo de no pago. Se necesita sistema de cobro pendiente |
| **50/50 (anticipo + saldo)** | Más complejo pero equilibrado |

**Pregunta directa:** *"¿El cliente paga todo al momento de reservar, o hay un sistema de crédito/postpago?"*

---

### 1.3 🟡 Póliza de cancelación

Si el cobro es al reservar:
- ¿Se devuelve el 100% si cancela con anticipación? ¿Cuántas horas antes?
- ¿Se cobra un porcentaje por cancelación tardía?
- ¿Qué pasa si el chofer ya está en camino y el cliente cancela?

**Pregunta directa:** *"Si un cliente paga y luego cancela, ¿qué hacen hoy? ¿Le devuelven la plata?"*

---

## 2. 🚚 Flota y Vehículos

### 2.1 🔴 ¿Cuántos tipos de vehículo manejan?

Necesitamos saber la flota para cruzarla con los tipos de servicio.

**Pregunta directa:** *"Háganos una lista de todos los vehículos que tienen. Para cada uno: marca, modelo, capacidad (m³ o kg), y patente."*

**Ejemplo de lo que necesitamos:**
| Vehículo | Capacidad | Tipo de servicio compatible |
|----------|-----------|----------------------------|
| Chevrolet NPR 2024 | 15m³ | Mudanza pequeña, Carga general |
| Ford F-150 | 5m³ | Express, TV |
| Mercedes Sprinter | 10m³ | Carga general |

---

### 2.2 🟡 ¿Hay restricciones de zona?

- ¿Operan solo en Santiago o también regiones?
- ¿Hay comunas donde NO llegan?
- ¿Hay restricción vehicular que afecte a sus camiones?

**Pregunta directa:** *"¿Cuál es el radio máximo de operación? ¿Solo RM o llegan a regiones cercanas?"*

---

### 2.3 🟢 ¿Manejan mantenimiento de vehículos?

- ¿Llevan control de cambios de aceite, revisiones técnicas, seguros?
- ¿Quieren que el sistema les avise cuando un vehículo necesita mantenimiento?

---

## 3. 👷 Conductores

### 3.1 🔴 ¿Cuántos choferes tienen activos?

**Pregunta directa:** *"¿Cuántos conductores trabajan con ustedes hoy?"*

Esto define la escala del sistema. No es lo mismo 5 que 50.

---

### 3.2 🟡 ¿Son empleados fijos o freelance?

| Modelo | Implicación |
|--------|-------------|
| **Empleados fijos** | Horarios definidos, asignación por turno |
| **Freelance/por demanda** | Necesitan aceptar o rechazar asignaciones |
| **Mixto** | Algunos fijos + refuerzos por demanda |

**Pregunta directa:** *"¿Sus choferes son de planta o trabajan por servicio?"*

---

### 3.3 🟡 ¿Cómo se asignan los servicios hoy?

- ¿El admin decide quién va?
- ¿Se basan en cercanía? ¿En disponibilidad? ¿En tipo de vehículo?
- ¿Un chofer puede tener 2 servicios simultáneos?

**Pregunta directa:** *"Cuando llega un pedido hoy, ¿cómo deciden qué chofer lo hace?"*

---

## 4. 📦 Tipos de Servicio

### 4.1 🔴 ¿Cuáles son los servicios reales que ofrecen?

El demo tiene 4 (TV, Mudanza Pequeña, Carga General, Express). ¿Son estos o hay otros?

**Pregunta directa:** *"Díganme exactamente qué servicios ofrecen hoy, con el nombre que ustedes usan internamente."*

**Subpreguntas por servicio:**
- ¿Tiempo estimado de ejecución?
- ¿Requiere algún tipo de vehículo específico?
- ¿Hay servicios que necesiten más de un chofer? (ej: mudanza con 2 auxiliares)
- ¿Hay servicios que hagan múltiples paradas? (ej: repartir mercadería a 5 direcciones)

---

### 4.2 🟡 ¿Manejan carga peligrosa o especial?

- ¿Transportan material refrigerado?
- ¿Transportan carga peligrosa (IMO)?
- ¿Necesitan certificaciones especiales?

Esto impacta los formularios y las validaciones del sistema.

---

## 5. 👤 Los Clientes de Acargoo

### 5.1 🟡 ¿Quiénes son sus clientes típicos?

| Tipo | Implicación |
|------|-------------|
| **Personas naturales** (mudanzas, envíos puntuales) | Flujo simple, pago inmediato |
| **Empresas** (logística recurrente) | Necesitan cuenta, historial, facturación mensual |
| **Mixto** | Dos flujos diferentes |

**Pregunta directa:** *"¿Sus clientes son más personas o empresas? ¿Hay clientes que les pidan servicios todas las semanas?"*

---

### 5.2 🟡 ¿El cliente necesita crear cuenta?

- ¿O puede reservar como "invitado" (solo nombre + teléfono + email)?
- ¿Quieren que los clientes recurrentes vean su historial de servicios?

---

## 6. ⚠️ Escenarios Problemáticos

Estas son situaciones que PASAN en logística real. Necesitamos saber cómo las manejan hoy:

### 6.1 🟡 El chofer llega y el cliente no está

**Pregunta directa:** *"¿Qué hacen hoy cuando el chofer llega y nadie lo recibe?"*
- ¿Espera? ¿Cuánto tiempo máximo?
- ¿Se cobra igual?
- ¿Se reprograma automáticamente?

---

### 6.2 🟡 El cliente reclama que la carga llegó dañada

**Pregunta directa:** *"¿Les ha pasado que un cliente reclame daño? ¿Cómo lo resuelven?"*
- La foto de entrega (POD) ayuda, pero ¿necesitan foto de CARGA también? (estado al recoger)

---

### 6.3 🟡 El cliente se niega a firmar la entrega

**Pregunta directa:** *"¿Qué debería hacer el chofer si el receptor no quiere firmar?"*
- ¿Se entrega igual y se marca "Sin firma"?
- ¿Se devuelve la carga al origen?

---

## 7. 📊 Reportes y Administración

### 7.1 🟢 ¿Qué reportes necesitan para su contador/administración?

- ¿Facturación mensual por cliente?
- ¿Resumen de servicios por chofer (para calcular sueldos/comisiones)?
- ¿Reporte de gastos de combustible?
- ¿Formato específico? (PDF, Excel)

**Pregunta directa:** *"¿Qué información le entregan hoy al contador a fin de mes?"*

---

### 7.2 🟢 ¿Quién más además del dueño usa el panel de admin?

- ¿Hay un despachador/operador que asigna servicios?
- ¿Necesitan diferentes niveles de acceso? (ej: el despachador ve todo pero no puede ver las finanzas)

---

## 8. 📱 Comunicación con el Cliente Final

### 8.1 🟡 ¿Tienen número de WhatsApp Business?

Para las notificaciones automáticas ("Tu chofer está a 10 min") necesitamos:
- Un número dedicado de WhatsApp Business
- O un proveedor como Evolution API / Waapi

**Pregunta directa:** *"¿Tienen un número de WhatsApp dedicado para la empresa?"*

---

### 8.2 🟢 ¿Qué mensajes quieren que lleguen automáticamente?

**Sugerencia de flujo de notificaciones:**
1. ✅ "Tu servicio ha sido confirmado. Código: AG-XXXX"
2. 🚛 "Tu chofer [Nombre] está en camino. Sigue tu carga aquí: [link]"
3. 📍 "Tu chofer está a 10 minutos de llegar"
4. ✅ "Entrega completada. Descarga tu certificado: [link PDF]"

**Pregunta directa:** *"¿Hay algún otro momento donde quieran que le llegue un mensaje al cliente?"*

---

## 🎯 Resumen: Las 10 Preguntas Clave

Si el tiempo es limitado, estas son las **imprescindibles**:

| # | Pregunta | Módulo que impacta |
|---|----------|-------------------|
| 1 | ¿Cómo calculan precios hoy? | Inteligencia de Rutas |
| 2 | ¿El cliente paga antes o después? | Pasarela de Pagos |
| 3 | ¿Cuántos vehículos tienen y de qué tipo? | Asignación de servicios |
| 4 | ¿Cuántos choferes tienen? ¿Fijos o freelance? | App del Chofer |
| 5 | ¿Cuáles son los servicios reales que ofrecen? | Portal del Cliente |
| 6 | ¿Sus clientes son personas o empresas? | Facturación y cuentas |
| 7 | ¿Qué pasa hoy cuando el cliente no está? | Flujo de incidencias |
| 8 | ¿Qué le pasan al contador a fin de mes? | Reportes |
| 9 | ¿Tienen WhatsApp Business? | Notificaciones |
| 10 | ¿Operan solo en Santiago o llegan a regiones? | Configuración de zonas |

---

> **Nota para Daniel:** Con estas respuestas, podemos diseñar la base de datos completa, definir todos los estados de una orden, y comenzar a construir la versión real. Sin estas respuestas, cualquier cosa que hagamos sería otro cascarón — y eso no es lo nuestro.
>
> *— Documento preparado por el equipo técnico HojaCero*
