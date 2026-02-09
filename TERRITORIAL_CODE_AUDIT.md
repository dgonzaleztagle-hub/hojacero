# Auditoría de Código Territorial - HojaCero
**Fecha:** 2026-02-09  
**Estado:** Post-Fase 2 (Fixes de Data Corrupta)

---

## 📊 **Métricas Actuales**

### **Archivo Principal: `route.ts`**
- **Líneas:** ~1,238 líneas
- **Tamaño:** ~48 KB
- **Funciones:** ~15+ funciones en un solo archivo
- **Responsabilidades:** Múltiples (orquestación, caché, prompts, síntesis)

### **Estructura Actual:**
```
app/api/territorial/analyze/
└── route.ts (1,238 líneas) ⚠️ MONOLITO

lib/territorial/
├── prompts/
│   ├── plan1-prompt.ts ✅
│   ├── plan2-prompt.ts ✅
│   └── plan3-prompt.ts ✅
├── estimators/
│   ├── flow-ticket-estimators.ts ✅
│   ├── financial-projections.ts ✅
│   └── investment-metrics.ts ✅
├── utils/
│   ├── geocoding.ts ✅
│   ├── distance.ts ✅
│   └── digital-presence.ts ✅
└── data/
    ├── gse-data.ts ✅
    └── metro-stations.ts ✅
```

---

## 🚨 **Problemas Identificados**

### **1. Monolito en `route.ts` (CRÍTICO)**
**Problema:**
- 1,238 líneas en un solo archivo
- Mezcla de responsabilidades:
  - Caché
  - Geocodificación
  - Obtención de competidores
  - Generación de mapas
  - Síntesis con IA
  - Guardado en DB
  - Prompts inline (getPromptPlan1, getPromptPlan2, getPromptPlan3)

**Impacto:**
- Difícil de mantener
- Difícil de testear
- Cambios en una parte pueden romper otras
- Onboarding lento para nuevos devs

**Solución Sugerida:**
Refactorizar en servicios modulares:
```
lib/territorial/services/
├── cache.service.ts          # Lógica de caché
├── geocoding.service.ts       # Geocodificación
├── competitors.service.ts     # Obtención de competidores
├── map.service.ts             # Generación de mapas
├── synthesis.service.ts       # Síntesis con IA
└── report.service.ts          # Guardado en DB
```

---

### **2. Prompts Duplicados (MEDIO)**
**Problema:**
- `getPromptPlan1()`, `getPromptPlan2()`, `getPromptPlan3()` en `route.ts`
- Pero también existen módulos en `lib/territorial/prompts/`
- `getPromptPlan2()` ahora usa el módulo, pero `getPromptPlan1()` y `getPromptPlan3()` siguen inline

**Impacto:**
- Confusión sobre cuál es la fuente de verdad
- Riesgo de divergencia

**Solución Sugerida:**
- Eliminar funciones inline de `route.ts`
- Usar SOLO los módulos de `lib/territorial/prompts/`

---

### **3. Lógica de Negocio en Route Handler (MEDIO)**
**Problema:**
- El route handler (`POST()`) tiene lógica de negocio compleja
- Debería ser un orquestador delgado que llama a servicios

**Impacto:**
- Difícil de testear sin levantar servidor
- No se puede reutilizar la lógica fuera del contexto HTTP

**Solución Sugerida:**
```typescript
// route.ts (delgado)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const report = await TerritorialService.generateReport(body);
  return NextResponse.json(report);
}

// lib/territorial/services/territorial.service.ts
export class TerritorialService {
  static async generateReport(params) {
    // Toda la lógica aquí
  }
}
```

---

### **4. Falta de Validación de Entrada (MEDIO)**
**Problema:**
- No hay validación de tipos en el request body
- Se asume que `plan_type`, `address`, etc. vienen correctos

**Impacto:**
- Errores crípticos si el frontend envía datos mal formados
- Posibles vulnerabilidades

**Solución Sugerida:**
- Usar Zod para validación:
```typescript
import { z } from 'zod';

const TerritorialRequestSchema = z.object({
  address: z.string().min(5),
  plan_type: z.number().int().min(1).max(3),
  business_type: z.string(),
  business_name: z.string().optional(),
});
```

---

### **5. Manejo de Errores Inconsistente (BAJO)**
**Problema:**
- Algunos errores se loggean, otros no
- No hay estructura consistente de error response

**Impacto:**
- Debugging difícil
- Frontend recibe errores inconsistentes

**Solución Sugerida:**
- Crear un error handler centralizado
- Estructura de error consistente:
```typescript
{
  success: false,
  error: {
    code: 'GEOCODING_FAILED',
    message: 'No se pudo geocodificar la dirección',
    details: { ... }
  }
}
```

---

### **6. Comentarios Desactualizados (BAJO)**
**Problema:**
- Línea 1068: "Portal Inmobiliario (solo Plan 3)" → Ahora también Plan 2
- Comentarios que dicen "Plan 600k" cuando ahora es "Plan 2 Premium"

**Impacto:**
- Confusión para futuros devs

**Solución Sugerida:**
- Actualizar comentarios en próximo refactor

---

## ✅ **Cosas que Están Bien**

1. **✅ Módulos de Prompts**
   - `plan1-prompt.ts`, `plan2-prompt.ts`, `plan3-prompt.ts` bien separados
   - Interfaces tipadas

2. **✅ Estimadores Separados**
   - `financial-projections.ts`, `investment-metrics.ts` bien modularizados
   - Funciones puras, fáciles de testear

3. **✅ Utilidades Reutilizables**
   - `geocoding.ts`, `distance.ts`, `digital-presence.ts` bien encapsulados

4. **✅ Datos Estáticos Separados**
   - `gse-data.ts`, `metro-stations.ts` bien organizados

5. **✅ Caché Implementado**
   - Sistema de caché por cuadrante funcional
   - Reduce llamadas a APIs externas

---

## 🎯 **Plan de Refactorización Sugerido**

### **Fase 1: Servicios (Prioridad ALTA)**
**Objetivo:** Extraer lógica de `route.ts` a servicios modulares

**Archivos a crear:**
1. `lib/territorial/services/cache.service.ts`
2. `lib/territorial/services/geocoding.service.ts`
3. `lib/territorial/services/competitors.service.ts`
4. `lib/territorial/services/map.service.ts`
5. `lib/territorial/services/synthesis.service.ts`
6. `lib/territorial/services/report.service.ts`
7. `lib/territorial/services/territorial.service.ts` (orquestador)

**Resultado esperado:**
- `route.ts` pasa de 1,238 líneas a ~50 líneas
- Cada servicio tiene una responsabilidad única
- Fácil de testear y mantener

---

### **Fase 2: Validación (Prioridad MEDIA)**
**Objetivo:** Agregar validación de entrada con Zod

**Archivos a crear:**
1. `lib/territorial/schemas/request.schema.ts`

**Resultado esperado:**
- Errores claros cuando el frontend envía datos inválidos
- Type safety mejorado

---

### **Fase 3: Error Handling (Prioridad MEDIA)**
**Objetivo:** Centralizar manejo de errores

**Archivos a crear:**
1. `lib/territorial/errors/territorial.errors.ts`
2. `lib/territorial/middleware/error-handler.ts`

**Resultado esperado:**
- Errores consistentes
- Mejor debugging

---

### **Fase 4: Testing (Prioridad BAJA - Post Refactor)**
**Objetivo:** Agregar tests unitarios

**Archivos a crear:**
1. `__tests__/territorial/services/*.test.ts`

**Resultado esperado:**
- Confianza en cambios futuros
- Regression testing

---

## 📝 **Recomendación Inmediata**

**NO refactorizar ahora.** Razones:

1. ✅ **El código funciona** y Gastón necesita testearlo
2. ⚠️ **Refactor grande = riesgo de bugs** justo antes de testing
3. 📊 **Mejor esperar feedback** de Gastón para saber qué necesita ajustes

**Cuándo refactorizar:**
- ✅ Después del testing de Gastón
- ✅ Cuando tengamos casos de uso reales
- ✅ Cuando sepamos qué partes cambian más frecuentemente

**Mientras tanto:**
- ✅ Documentar decisiones de diseño
- ✅ Agregar comentarios donde sea confuso
- ✅ Crear este documento de auditoría para referencia futura

---

## 🔄 **Deuda Técnica Actual**

| Categoría | Severidad | Esfuerzo | Prioridad |
|-----------|-----------|----------|-----------|
| Monolito en route.ts | 🔴 Alta | 3-5 días | Post-Testing |
| Prompts duplicados | 🟡 Media | 1 hora | Post-Testing |
| Falta validación | 🟡 Media | 2 horas | Post-Testing |
| Error handling | 🟢 Baja | 1 día | Futuro |
| Comentarios desactualizados | 🟢 Baja | 30 min | Cuando toque el archivo |

---

## 💡 **Conclusión**

**El código territorial funciona correctamente** pero tiene deuda técnica acumulada por iteraciones rápidas.

**Estrategia recomendada:**
1. ✅ **Ahora:** Dejar como está, esperar testing de Gastón
2. ✅ **Después del testing:** Refactorizar según feedback
3. ✅ **Futuro:** Implementar testing y validación

**No es urgente refactorizar ahora**, pero sí es importante tenerlo en el roadmap para cuando el sistema esté estabilizado.
