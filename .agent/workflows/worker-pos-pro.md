---
description: Inyecta el sistema de Punto de Venta (POS) y Gestión de Salón profesional.
---

# 🖥️ HojaCero POS Pro - Terminal de Salón y ERP

Usa este workflow para implementar el sistema de gestión de mesas y terminal de cobro profesional para restaurantes con atención a público.

// turbo-all

## 🎯 Fase 0: Prerrequisitos
- El motor base `FoodEngine` debe estar configurado.
- El cliente debe tener un esquema de mesas definido (ej: Terraza, Salón, Segundo Piso).

---

## 🏗️ Fase 1: Infraestructura POS
- Crear tabla de mesas: `[cliente]_tables`.
- Insertar el mapeo inicial de mesas.
- Asegurar que los productos tengan precios base configurados en el objeto de inyección.

---

## 💻 Fase 2: Inyección de Terminal
- Crear la ruta `/prospectos/[cliente]/pos/page.tsx`.
- Instanciar el componente `<PosTerminal prefix="[cliente]_" products={...} />`.
- Proteger la ruta (vía middleware o flag de admin) para uso exclusivo del personal.

---

## 📊 Fase 3: Activación Financiera
- Activar el flag `showFinance={true}` en el `AdminTitan.tsx` del cliente.
- Vincular el `CashManager` para que cada cierre de terminal POS se rastree en la caja central.

---

## 🎖️ Fase 4: Protocolo de QA POS
1. **Prueba de Comanda:** Enviar pedido desde POS y verificar que aparezca en la pantalla de cocina.
2. **Prueba de Mesa:** Verificar que la mesa cambie a "Ocupada" automáticamente.
3. **Prueba de Cierre:** Realizar una venta y validar que el monto sume al "Saldo Esperado" en la Caja.

---

> [!IMPORTANT]
> **Venta Modular:** Este workflow se cobra como un "setup fee" adicional + un aumento en el fee mensual por soporte de infraestructura crítica.
