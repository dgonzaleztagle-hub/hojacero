# Plan de Implementación: Biblia H0 - La Autoridad Absoluta

He recibido el feedback fuerte y claro: la versión actual es un "MVP insuficiente" que no refleja la profundidad técnica ni la visión de Hoja Cero. Este plan describe cómo transformaremos la página de Ayuda en el monumento al conocimiento técnico que el proyecto merece.

## User Review Required

> [!IMPORTANT]
> **Densidad de Información**: No habrá resúmenes cortos. Cada módulo tendrá una explicación de "Manual de Ingeniería", detallando impactos en DB, archivos modificados y reglas lógicas.
> **Estética Industrial**: El diseño migrará a un estilo de "Terminal de Misión Crítica", con contrastes altos, tipografía técnica y layouts que permitan leer mucha información sin saturar.

## Proposed Changes

### [Component] Nueva Biblia H0 (`app/dashboard/ayuda/page.tsx`)

Rediseño total del componente para soportar:

- **Data Schema Extendido**:
  - `Contexto Estratégico`: Por qué existe y cómo ayuda a vender.
  - `Pasos Técnicos`: Qué hace exactamente el workflow (archivo por archivo).
  - `Base de Datos`: Qué tablas toca y qué campos son críticos.
  - `Reglas de Oro`: Lo que JAMÁS debe faltar al usar este motor.

#### [MODIFY] [BibliaH0Page](file:///d:/proyectos/hojacero/app/dashboard/ayuda/page.tsx)
- Reemplazo del objeto `sections` por una base de conocimiento completa (más de 15 entradas detalladas).
- Implementación de un `Sub-Header` navegable para entrar en "Dodo Mode" (Detalle técnico profundo).
- Inyección de snippets de código real y ejemplos de sintaxis para todos los slashes.

### [Content] Mapeo de Workflows

Documentaremos exhaustivamente los 15 workflows actuales:
1.  `factory-demo`: El corazón de la venta.
2.  `factory-final`: La arquitectura multi-página.
3.  `factory-brand`: El ADN visual.
4.  `factory-qa`: El filtro de calidad.
5.  `factory-seo`: El blindaje técnico.
6.  `factory-export`: El empaquetado para Vercel.
7.  `factory-deploy`: El despliegue final.
8.  `worker-food-pro`: El ERP de gastronomía.
9.  `worker-pos-pro`: El software de salón.
10. `worker-cash-pro`: El control de caja.
11. `worker-ads-factory`: La fábrica de landings.
12. `worker-mensual`: El motor de cobros y mantención.
13. `worker-maintain`: La IA de soporte técnico.
14. `worker-automate`: El procesador de assets.
15. `factory-alive`: El sistema de monitoreo.

## Verification Plan

### Manual Verification
- Revisión de cada sección con el usuario para asegurar que la "explicación larga" contiene todo el contexto necesario.
- Prueba del buscador para encontrar términos técnicos específicos (ej: "RLS", "Kill Switch", "Next.js").
- Validación de la estética "Wow" esperada para un producto de Hoja Cero.
