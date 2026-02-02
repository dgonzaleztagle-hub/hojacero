---
description: Inyecta el motor de control de caja manual y flujo de efectivo.
---

# 💵 HojaCero Cash Pro - Control de Flujo Vivo

Usa este workflow para inyectar solo el módulo de caja en un proyecto que requiere control de dinero en efectivo y gastos manuales.

// turbo-all

## 🏗️ Fase 1: DB Inyección
- Crear tablas `[cliente]_cash_register` y `[cliente]_cash_movements`.
- Configurar RLS si el cliente requiere que solo el "Admin" vea los montos.

---

## 🎨 Fase 2: UI Inyección
- Integrar `<CashManager prefix="[cliente]_" userId="..." />` en el dashboard del cliente.
- Si no existe dashboard, crear uno minimalista en `/admin/caja`.

---

## 🎖️ Fase 3: Verificación
1. **Apertura:** Confirmar que se puede abrir caja con fondo inicial.
2. **Gastos:** Registrar un gasto de prueba (ej: "Propina repartidor") y verificar resta en saldo esperado.
3. **Cierre:** Validar que el cierre guarde la diferencia (faltante/sobrante).

---

> [!TIP]
> Ideal para clientes que ya tienen su web pero su problema es que "la plata se les pierde" al final del día.
