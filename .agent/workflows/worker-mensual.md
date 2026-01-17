---
description: Lista los sitios que necesitan mantención hoy/esta semana
---

# 📅 Worker Mensual - Lista de Mantenciones Pendientes

Este workflow consulta Supabase y lista los sitios que necesitan mantención.
Ejecutar al inicio del día o cuando necesites ver el estado de la "flota".

// turbo-all

---

## Uso

```
Usuario: /worker-mensual

AI: Consultando Supabase... 
    Hoy es día 17. Encontré 3 sitios pendientes:
    
    1. RestauranteLaMesa - Día 17 - Última mantención: 17 Dic
    2. AbogadosSilva - Día 17 - Última mantención: 17 Dic
    3. ClínicaDental - Día 15 - ⚠️ ATRASADO 2 días
```

---

## Paso 1: Obtener Fecha Actual

```javascript
const hoy = new Date();
const diaDelMes = hoy.getDate(); // 1-28
const mesActual = hoy.getMonth() + 1;
```

---

## Paso 2: Consultar Sitios Pendientes

Usa MCP de Supabase para ejecutar:

```sql
-- Sitios que toca mantener HOY
SELECT 
  ms.id,
  ms.client_name,
  ms.site_url,
  ms.maintenance_day,
  ms.plan_type,
  ss.is_active,
  (SELECT MAX(performed_at) FROM maintenance_logs WHERE site_id = ms.id) as ultima_mantencion
FROM monitored_sites ms
LEFT JOIN site_status ss ON ms.id = ss.id
WHERE ms.status = 'active'
  AND ms.maintenance_day = [DIA_HOY]
ORDER BY ms.client_name;
```

---

## Paso 3: Consultar Atrasados

```sql
-- Sitios ATRASADOS (día ya pasó este mes y no tienen log del mes actual)
SELECT 
  ms.id,
  ms.client_name,
  ms.maintenance_day,
  ms.plan_type,
  (SELECT MAX(performed_at) FROM maintenance_logs WHERE site_id = ms.id) as ultima_mantencion
FROM monitored_sites ms
WHERE ms.status = 'active'
  AND ms.maintenance_day < [DIA_HOY]
  AND NOT EXISTS (
    SELECT 1 FROM maintenance_logs ml 
    WHERE ml.site_id = ms.id 
      AND EXTRACT(MONTH FROM ml.performed_at) = [MES_ACTUAL]
      AND EXTRACT(YEAR FROM ml.performed_at) = [AÑO_ACTUAL]
  )
ORDER BY ms.maintenance_day;
```

---

## Paso 4: Generar Reporte

Presenta los resultados así:

```
📅 MANTENCIONES - [Fecha de hoy]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 HOY (Día [X]):
┌─────────────────────────────────────┐
│ 1. [Nombre Cliente]                 │
│    URL: [url]                       │
│    Plan: [basic/pro/enterprise]     │
│    Última: [fecha]                  │
│    [PROCESAR]: /worker-maintain [nombre] │
├─────────────────────────────────────┤
│ 2. [Otro Cliente]                   │
│    ...                              │
└─────────────────────────────────────┘

🔴 ATRASADOS:
┌─────────────────────────────────────┐
│ ⚠️ [Nombre] - Día [X] (hace [N] días) │
│    [URGENTE]: /worker-maintain [nombre] │
└─────────────────────────────────────┘

✅ PRÓXIMOS 7 DÍAS:
- Día 18: ClienteA
- Día 20: ClienteB, ClienteC
- Día 22: ClienteD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Resumen:
- Total clientes activos: [N]
- Pendientes hoy: [N]
- Atrasados: [N]
- Completados este mes: [N]
```

---

## Paso 5: Acciones Rápidas

Ofrece al usuario:

1. **Procesar uno**: `/worker-maintain [nombre-cliente]`
2. **Procesar todos los de hoy**: Loop por cada uno
3. **Ver morosos**: Lista de clientes con `is_active = false`
4. **Ver próxima semana**: Muestra calendario de 7 días

---

## Ejemplo Completo

```
Usuario: /worker-mensual

AI: 📅 MANTENCIONES - 17 de Enero 2026

🔵 HOY (Día 17):
┌─────────────────────────────────────┐
│ 1. Restaurante La Mesa              │
│    URL: lamesa.cl                   │
│    Plan: basic                      │
│    Última: 17 Dic 2025              │
└─────────────────────────────────────┘

🔴 ATRASADOS:
│ ⚠️ Clínica Dental - Día 15 (hace 2 días) │

✅ PRÓXIMOS 7 DÍAS:
- Día 18: ninguno
- Día 20: AbogadosSilva
- Día 22: TiendaRopa

¿Qué deseas hacer?
1. Procesar "Restaurante La Mesa"
2. Procesar atrasados primero
3. Ver detalles de un cliente
```
