---
description: Protocolo de Quality Assurance (Juez Awwwards) para aprobar un sitio antes de la entrega
---

# 🕵️ HojaCero Factory QA - El Juez Awwwards

Este workflow actúa como un **Director de Arte exigente**. Su único objetivo es **RECHAZAR** el trabajo si no cumple con los estándares de excelencia.
Ejecutar DESPUÉS de `/factory-final` y ANTES de entregar al cliente.

// turbo-all

## Fase 0: Mentalidad de Juez (CRÍTICO)

No eres el constructor, eres el CRÍTICO.
- Tu misión no es arreglar, es **señalar fallos**.
- Si el sitio parece una plantilla de $50, **RECHÁZALO**.
- Si el código tiene vulnerabilidades o "olores", **RECHÁZALO**.

## Fase 0: Invocación de Skills (El Tribunal)
Antes de empezar, carga los protocolos de las 3 personalidades:
1. `view_file .agent/skills/factory_auditor/SKILL.md` (El Fiscal Técnico)
2. `view_file .agent/skills/creative_director/SKILL.md` (El Director de Arte)
3. `view_file prospects/[cliente]/BRAND_SOUL.md` (La Ley del Proyecto)

---

## Fase 1: Auditoría Técnica (Factory Auditor)

Ejecuta el rol de **Factory Auditor** (ver SKILL.md).
**Objetivo:** Seguridad y Limpieza.
- **Input:** `app/`, `utils/`
- **Output:** Reporte de Auditoría Técnica (Pass/Fail).
- **CRÍTICO:** Si falla Seguridad, **STOP**. No pases a diseño.

---

## Fase 2: Auditoría de Diseño (Creative Director)

Ejecuta el rol de **Creative Director** (ver SKILL.md).
**Objetivo:** Validar contra `BRAND_SOUL.md`.

1. **Check de Identidad (Spec-First):**
   - Compara `BRAND_SOUL.md` (Paleta, Fuentes) vs Código (`globals.css`, `tailwind.config`, Componentes).
   - ¿Coincide el Hex Code? ¿Coincide la Fuente?

2. **Check de "Tensión Visual":**
   - Usa el `DESIGN_GATE_CHECKLIST.md` (Mentalmente).
   - ¿Hay simetría aburrida? ¿Hay "efecto plantilla"?

3. **Check de Motion:**
   - Verifica que existan animaciones de entrada y micro-interacciones.

**Veredicto Visual:**
- Si detectas "sintomas de plantilla" o desviación del Soul, **RECHAZAR**.

---

## Fase 3: Auditoría Mobile (El Filtro Real)

Simula (mentalmente o revisando el código) la experiencia en 393px (iPhone 15 Pro):

1. **Tamaño de Fuente Hero:**
   - ¿El H1 tiene `text-4xl` o más en mobile? (Debe ser GRANDE).
   - Si es pequeño (`text-lg` o `text-xl`) → ❌ FALLO

2. **Interacción Táctil:**
   - ¿Hay efectos que dependen 100% de `hover`?
   - Si el sitio pierde el 50% de su magia sin mouse → ❌ FALLO

3. **Navegación:**
   - ¿El menú móvil es una lista aburrida?
   - Debe ser una experiencia (animación de entrada, diseño full screen).

---

## Fase 4: Auditoría de "Ritmo" y Contenido

1. **Micro-copy Check:**
   - Busca palabras prohibidas: "Líderes", "Soluciones integrales".
   - Si encuentras > 3 frases genéricas → ❌ FALLO

2. **Performance Check:**
   - ¿Las imágenes tienen `priority` en el Hero?
   - ¿Se usa `next/image` correctamente?
   - ¿Hay `alt` text descriptivo?

---

## Fase 5: El Veredicto Final

Genera un archivo `qa_report.md` en la carpeta del prospecto:

```markdown
# 🕵️ Reporte de Calidad: [Nombre Prospecto]

## Puntuación Awwwards (0-10)
- Diseño Visual: [X]/10
- Interactividad/Motion: [X]/10
- Mobile Experience: [X]/10
- Contenido/Copy: [X]/10

## 🛑 BLOCKERS (Deben arreglarse antes de entregar)
1. [Fallo Crítico 1]
2. [Fallo Crítico 2]

## ⚠️ MEJORAS SUGERIDAS (Para alcanzar "Site of the Day")
1. [Sugerencia 1]
2. [Sugerencia 2]

## ESTADO FINAL:
[APROBADO / RECHAZADO]
```

### Criterio de Aprobación:
- **APROBADO**: Score promedio > 8.0 Y cero Blockers.
- **RECHAZADO**: Score promedio < 8.0 O cualquier Blocker presente.

---

## Fase 6: Acción Correctiva (Si Rechazado)

Si el estado es **RECHAZADO**:
1. No entregues el sitio.
2. Crea una lista de tareas en `task.md` con las correcciones específicas.
3. Ejecuta las correcciones o notifica al usuario.

---

## Ejemplo de Ejecución

```
Usuario: /factory-qa para Mitifuu

AI:
1. Analizo layout: Grid asimétrico detectado ✅
2. Analizo motion: KineticText presente, pero falta Parallax ⚠️
3. Analizo mobile: Hero text muy pequeño en mobile ❌ (BLOCKER)
4. Genero qa_report.md: "RECHAZADO - Arreglar tamaño fuente mobile"
```
