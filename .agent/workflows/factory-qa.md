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
- Si el sitio no te hace decir "WOW" en el móvil, **RECHÁZALO**.

---

## Fase 1: Auditoría de "Tensión Visual"

Analiza el layout de la página principal (`page.tsx`):

1. **¿Hay simetría aburrida?**
   - Si ves un grid de 3 columnas repetido → ❌ FALLO
   - Si todo el texto está centrado → ❌ FALLO
   - Si las secciones tienen la misma altura → ❌ FALLO

2. **¿Hay elementos "fuera de lugar" (intencionalmente)?**
   - Busca elementos con `margin-top` negativo o `absolute` positioning superpuesto.
   - Si todo respeta un grid rígido → ❌ FALLO (Demasiado seguro)

3. **Veredicto Visual:**
   - Si detectas "sintomas de plantilla", genera un reporte de **REDDISEÑO URGENTE**.

---

## Fase 2: Auditoría de "Motion Branding"

Revisa el código en busca de interactividad:

1. **¿Hay `data-scroll-speed`?**
   - Busca parallax en imágenes.
   - Si las imágenes son estáticas → ❌ FALLO

2. **¿Hay `KineticText` o `TextGenerate`?**
   - El H1 debe tener animación de entrada.
   - Si el H1 es texto plano estático → ❌ FALLO

3. **¿Hay `MagneticCursor`?**
   - Verifica si los botones importantes están envueltos.
   - Si los CTAs son simples `divs` con hover de color → ❌ FALLO

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
