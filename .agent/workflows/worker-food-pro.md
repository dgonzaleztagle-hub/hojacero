---
description: Inyecta el motor de pedidos interactivo (Food Engine) en un demo de gastronomía aprobado.
---

# 🛵 HojaCero Food Engine - Inyección de IA y Pedidos

Usa este workflow para convertir una landing estática de comida en una plataforma interactiva de pedidos (Estilo "Donde Germain").

// turbo-all

## 🎯 Fase 0: Prerrequisitos
Un demo espectacular ya debe existir en `/prospectos/[cliente]/page.tsx`.
No inyectes lógica sin que el cliente haya aprobado primero el diseño visual.

---

## 🧠 Fase 1: Inyección del Cerebro (Lógica Core)

### 1.1 Configuración de Base de Datos
- Crear tablas en Supabase con el prefijo del cliente:
  - `[cliente]_orders`
  - `[cliente]_order_items`
  - `[cliente]_sessions`
  - `[cliente]_cash_register` (Pro)
  - `[cliente]_cash_movements` (Pro)
  - `[cliente]_inventory` (Pro)
  - `[cliente]_inventory_movements` (Pro)
  - `[cliente]_tables` (Pro POS)

### 1.2 Configuración del Motor (`food-config.ts`)
Crear un archivo de configuración en la carpeta del prospecto:
```typescript
export const FOOD_CONFIG = {
  dbPrefix: '[cliente]_',
  whatsapp: '[whatsapp_cliente]',
  categories: ['burger', 'empanada'], // Extraer del menú aprobado
  adminPath: '/prospectos/[cliente]/admin'
}
```

---

## 🎨 Fase 2: Inyección de la Interfaz Interactiva

### 2.1 Hooks y Contexto
- Copiar los hooks nucleares de `@/hooks/food-engine/` al proyecto.
- Envolver el `layout.tsx` del cliente con el `FoodEngineProvider`.

### 2.2 Reemplazo de Botones (The Hook)
- Localizar los botones estáticos de "Añadir al carrito" o "Pedir" en el `page.tsx`.
- Reemplazarlos por el componente interactivo `AddToCart` conectado al motor.

---

## 📊 Fase 3: Activación de Germain Control (Admin)

### 3.1 Creación del Dashboard Admin
- Crear `/prospectos/[cliente]/admin/page.tsx`.
- Usar el template **Admin Titan** con:
  - Alertas sonoras en tiempo real.
  - Monitor de pedidos (Realtime).
  - **Métricas Titan:** Ventas del Mes, Ticket Promedio y Venta Viva.

### 3.2 Lógica de Modo Catálogo
- Asegurar que la Landing detecte el estado del local desde la tabla `[cliente]_sessions`.
- Si el local está cerrado: ocultar CTAs de compra y carrito (Modo Catálogo).

---

## ⚙️ Fase 4: PWA Ready

### 4.1 Activos PWA
- Generar manifiesto específico en `/prospectos/[cliente]/manifest.json`.
- Registrar Service Worker para notificaciones.

---

## 💎 Fase 6: Add-ons Pro (Optional Upsell)

Si el cliente contrató módulos avanzados, ejecutar la inyección específica:

### 6.1 Cash & Inventory Engine
- Activar flags en `AdminTitan`: `showCash={true}`, `showInventory={true}`.
- Asegurar que el `userId` esté configurado para el rastreo de movimientos.

### 6.2 POS & Financial Experience
- Crear la instancia de `PosTerminal.tsx` en una ruta protegida (ej: `/prospectos/[cliente]/pos`).
- Configurar el dashboard financiero en el Admin: `showFinance={true}`.

---

## 🎖️ Fase 7: Protocolo de Entrega HojaCero
1. **Auditoría Daniel (Arquitectura):** Verificar que la lógica no rompió el diseño.
2. **Auditoría Gastón (Marketing):** Verificar que las métricas rastrean cada dólar.
3. **Deploy:** `git add . && git commit -m "feat([cliente]): food engine interactive injection" && git push`

---

> [!TIP]
> **Jarvis Rule:** Al ejecutar este comando, siempre usa el prefijo de base de datos del cliente para mantener los datos aislados y organizados.
