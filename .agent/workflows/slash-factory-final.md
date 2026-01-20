---
description: Protocolo de Cierre y Refinamiento Final (Golden Master). Transforma un Demo aprobado en un Producto final blindado en 30 minutos.
---

# 🏭 Factory Final: El Protocolo de los 30 Minutos

Este workflow se ejecuta **DESPUÉS** de que el cliente aprueba el look & feel general ("El Demo").
Su objetivo es prevenir la "Iteración Infernal" mediante la aplicación preventiva de leyes físicas de diseño.

## 1. Fase de Auditoría Preventiva (Anti-Monstruos)
Antes de crear nuevas páginas, revisa el código base actual.
- [ ] **Escanear Imágenes:** Buscar cualquier `<img>` o `<Image>` que tenga clases como `w-full` o `h-screen` SIN un contenedor padre restrictivo.
- [ ] **Aplicar Hard Caps:** Envolver dichas imágenes en `<div className="max-w-md mx-auto">` o similar. NUNCA dejar que el navegador decida el ancho final.
- [ ] **Escanear Grids:** Buscar `grid-cols-1` o `grid-cols-2`.
- [ ] **Aplicar Grid Defensivo:** Cambiar a `grid-cols-2 md:grid-cols-4` como mínimo para catálogos. El "Gigantismo" está prohibido.

## 2. Inyección de Contenido Real (Content-First)
- [ ] **Solicitar Texto:** No diseñar páginas de "Nosotros" o "Filosofía" con Lorem Ipsum. Pedir al usuario el texto final o extraerlo de la fuente original.
- [ ] **Evaluar Densidad:**
    - ¿Texto Largo? -> Usar **Split Layout** (Texto lado, Foto lado) o **Bento Grid**.
    - ¿Texto Corto? -> Usar **Hero Centrado**.
- [ ] **Rechazar Muros:** Si el texto es un bloque gigante, dividirlo en al menos 2 párrafos y destacar una cita.

## 3. Física e Interacción (Anti-Drift)
- [ ] **Revisión de Componentes 3D:** Si hay carruseles o elementos arrastrables:
    - Verificar si el `drag` está en el mismo elemento que el `transform`. -> **ERROR.**
    - Separar en:
        1.  `Proxy` (Invisible, Drag Listener).
        2.  `Actor` (Visual, Pointer-events-none).

## 4. El "Hojo Polish" (Toque Final)
- [ ] **Padding Breath:** Verificar que cada sección tenga al menos `py-24` o `py-32` de espacio vertical.
- [ ] **Footer Separation:** Asegurar que el contenido final no choque con el footer (`pb-32` mínimo).
- [ ] **Typography Check:** Verificar que no haya títulos gigantes (`text-9xl`) que rompan en móvil. Bajar a `text-5xl` o `text-6xl`.

## 5. Entrega
Solo cuando estos 4 puntos estén marcados, se muestra el resultado al usuario.
**Meta:** 0 Iteraciones de corrección de tamaño o layout.
