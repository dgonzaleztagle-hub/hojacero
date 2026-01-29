---
description: Genera un sitio web multi-página completo para un prospecto de alto valor
---

# 🏗️ HojaCero Factory FINAL - Sitio Completo

Este workflow genera un **sitio web multi-página completo** para prospectos de alto valor.
Usa esto cuando el lead amerita más que una landing: le entregas el sitio hecho.

// turbo-all

## Fase 0: Validar Prerequisitos y Bloquear Estilo (CRÍTICO)

### 0.1 Verificar Demo Aprobado
Antes de crear NADA, verifica si existe un demo previo:
```
SI existe /prospectos/[cliente]/page.tsx:
  → Este archivo es SAGRADO. NO SE MODIFICA.
  → El cliente ya aprobó este diseño.

### 0.2 Leer Manifest (Memory Persistence)
Busca los archivos de ADN del proyecto:
1.  `d:\proyectos\hojacero\app\prospectos\[cliente]\style_lock.md` (Prioridad 1)
2.  `d:\proyectos\hojacero\app\prospectos\[cliente]\discovery_notes.md` (Contexto V4.0)

*   **SI EXISTE style_lock.md:** Úsalo como biblia. No cambies colores ni componentes declarados ahí.
*   **SI NO EXISTE (Legacy):** Créalo manualmente extrayendo la información del `page.tsx` existente (Ingeniería Inversa).

```markdown
# Style Lock: [Nombre Cliente] (RECUPERADO)
...
```

```markdown
# Style Lock: [Nombre Cliente] (APROBADO)

## Estado
- [x] Demo aprobado por cliente (V4.0 Skill-Driven)
- [ ] Factory Final en progreso
- [ ] SEO inyectado
- [ ] Exportado para entrega

## Creative Director DNA (V4.0)
(Si disponible en discovery_notes)
- Layout Strategy: [ej. Asimetría Radical]
- Motion Personality: [ej. Liquid Flow]

## Componentes Autorizados
(Lista los componentes importados en el demo)
- ComponenteA
- ComponenteB

## Paleta de Colores
(Extrae del demo)
- Primary: bg-[color]
- Secondary: bg-[color]
- Text: text-[color]
- Background: bg-[color]

## Tipografía
- Headings: [clases de tailwind]
- Body: [clases de tailwind]

## Estilo de CTAs
- [clases completas del botón principal]

## Notas del Cliente
- (Cualquier feedback específico)
```

**REGLA DE ORO:** Todas las páginas nuevas DEBEN seguir este style_lock.md.

---

## Fase 0.5: The Architect (Consistency Guard)

**ANTES DE COPIAR CÓDIGO, ASEGURA LA CONSISTENCIA.**

1.  **INVOCA AL ARQUITECTO:** `view_file .agent/skills/factory_lead/SKILL.md`
2.  **AUDIT PROACTIVO:**
    *   Revisa `style_lock.md` vs el plan de las nuevas páginas.
    *   Asegura que no estemos reinventando la rueda (Header, Footer, Botones).
3.  **VALIDACIÓN:**
    *   Si el plan incluyó "Nuevo Header para Servicios", el Arquitecto debe aprobarlo o rechazarlo por inconsistencia.

---

## Fase 0.6: Content Handshake (Anti-Agujero Negro)

**ANTES** de construir componentes, valida el contenido real.
1. Crea/Actualiza `content_map.md` con los textos extraídos para cada sección.
2. **DETENTE** y pregunta al usuario: *"¿Este es el texto definitivo para Nosotros/Servicios? Confirma para no romper el diseño después."*
3. Solo procede cuando el usuario diga "CORRECTO".

---

## Fase 1: Definir Arquitectura del Sitio

Basado en el `discovery_notes.md`, decide qué páginas crear:

### Estructura Mínima (3 páginas)
```
/prospectos/[nombre]/
├── layout.tsx       (Navbar + Footer compartidos)
├── page.tsx         (Home - EL DEMO APROBADO, NO TOCAR)
├── servicios/
│   └── page.tsx     (Listado de servicios)
└── contacto/
    └── page.tsx     (Formulario + Mapa)
```

### Estructura Completa (5-7 páginas)
```
/prospectos/[nombre]/
├── layout.tsx       
├── page.tsx         (Home - INTOCABLE)
├── nosotros/
│   └── page.tsx     (Historia + Equipo)
├── servicios/
│   ├── page.tsx     (Overview)
│   └── [servicio]/
│       └── page.tsx (Detalle por servicio)
├── casos/
│   └── page.tsx     (Portfolio/Testimonios)
└── contacto/
    └── page.tsx
```

---

## Fase 2: Crear Layout Centralizado

Crea `layout.tsx` siguiendo el style_lock.md:

1. **Navbar Premium:**
   - Logo del cliente
   - Menú con links a las secciones
   - CTA destacado
   - USAR los mismos colores del demo aprobado

2. **Footer Profesional:**
   - Datos de contacto reales
   - Links a redes sociales
   - Copyright con año actual
   - MANTENER coherencia con el demo

---

## Fase 3: Generar Páginas Adicionales

### REGLA: Cada página debe verse como "hermana" del demo aprobado.

### 3.1 Servicios (servicios/page.tsx)
- Usa los mismos componentes que el demo (revisa style_lock.md)
- Misma paleta de colores
- Contenido del discovery_notes.md

### 3.2 Nosotros (nosotros/page.tsx)
- Historia de la empresa
- Misma tipografía y espaciado
- Fotos del equipo si existen

### 3.3 Contacto (contacto/page.tsx)
- Formulario con el estilo del demo
- Mapa embebido si aplica
- Múltiples canales de contacto

---

## 🎖️ Fase 3.5: GOLD MASTER PROTOCOL (APLICAR EN CADA PÁGINA)

Aunque el estilo ya está bloqueado por style_lock.md, cada página nueva debe pasar este filtro:

### Cuestionamiento Obligatorio (Por Página)
```
ANTES de dar por terminada cada página, pregunta:

1. "¿Esto se ve de ALTO COSTO?" → Solo SÍ definitivo = continúa
2. "¿Screenshotearía esta página?" → Debe ser SÍ
3. "¿Es coherente hermana del demo aprobado?" → Debe ser SÍ
4. "¿Tiene al menos UN elemento WOW propio?" → Debe ser SÍ
```

### Componentes Premium Disponibles
Usa los mismos del demo aprobado, pero puedes agregar si mejora:
- `BentoGrid` → Para servicios múltiples
- `AnimatedCounter` → Para estadísticas en "Nosotros"
- `InfiniteMovingCards` → Para testimonios
- `TextGenerateEffect` → Para statement de misión

### Animaciones Consistentes
Usa las MISMAS curvas que el demo:
```javascript
// Curva premium estándar
ease: [0.16, 1, 0.3, 1] // easeOutExpo
```

### Assets
- Mismo ratio de compresión que el demo
- Preferir .webp
- Mantener coherencia visual con imágenes existentes

---

## Fase 4: Verificación de Consistencia

Antes de entregar, verifica:
- [ ] Todas las páginas usan la misma paleta de colores
- [ ] Los CTAs tienen el mismo estilo en todas las páginas
- [ ] La tipografía es consistente
- [ ] El Navbar y Footer son idénticos en todas las páginas
- [ ] La página Home (demo original) NO fue modificada

---

## Fase 5: Actualizar style_lock.md

Marca el progreso:
```markdown
## Estado
- [x] Demo aprobado por cliente
- [x] Factory Final completado
- [ ] SEO inyectado
- [ ] Exportado para entrega
```

---

## Fase 6: Verificar en Browser

Navega por TODAS las páginas y verifica:
- [ ] Navegación funciona correctamente
- [ ] No hay links rotos
- [ ] Responsive en todas las páginas
- [ ] El demo original sigue intacto

---

## Siguiente Paso

Una vez completado, indica al usuario que puede ejecutar:
- `/factory-seo` para inyectar SEO técnico
- `/factory-export` para empaquetar y entregar al cliente

---

## Ejemplo de Uso

```
Usuario: /factory-final para Biocrom

AI:
1. FASE 0: Verifico que existe demo aprobado en /prospectos/biocrom/page.tsx
2. Creo style_lock.md extrayendo colores, tipografía y componentes del demo
3. FASE 1: Defino estructura (Home, Servicios, Nosotros, Contacto)
4. FASE 2: Creo layout.tsx siguiendo style_lock.md
5. FASE 3: Genero páginas adicionales SIN tocar el demo
6. FASE 4-6: Verifico consistencia y entrego
```
