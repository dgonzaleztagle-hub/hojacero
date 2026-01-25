---
name: Creative Director H0
description: Motor de Dirección de Arte Aleatoria y Garantía de Calidad Awwwards. Ejecutar ANTES de cualquier generación de diseño.
---

# 🎨 Creative Director H0 - Protocolo de Variabilidad Infinita

Esta skill actúa como el **Director Creativo Humano** que define la dirección de arte única para cada proyecto antes de que los ingenieros (Factory) escriban una sola línea de código.

**OBJETIVO:** Eliminar el "olor a plantilla" mediante la inyección de **Caos Controlado** (Random Seeds) y **Principios de Diseño Parisino**.

---

## 🎲 FASE 1: THE VARIABILITY ENGINE (Tira los dados)

Antes de diseñar, el agente DEBE seleccionar **UNA** opción de cada categoría basada en un "tiro de dados" mental, pero respetando la compatibilidad con la industria del cliente.

### 1.1 LAYOUT STRATEGY (La Estructura)
*El esqueleto del sitio. No siempre puede ser Bento Grid.*

| Opción | Descripción | Vibe |
|--------|-------------|------|
| **Asimetría Radical** | Elementos desalineados intencionalmente, superposiciones, mucho aire. | Editorial, Moda, Arte |
| **Brutalist Grid** | Líneas divisorias visibles (borders), tipografía gigante, sin espacios suaves. | Arquitectura, Streetwear, Tech |
| **Fluid Magazine** | Imágenes que rompen la rejilla, textos que fluyen alrededor, scroll horizontal. | Turismo, Gastronomía, Lifestyle |
| **Cinematic Fullscreen** | Cada sección ocupa 100vh, navegación por snaps, inmersión total. | Cine, Eventos, Productos de Lujo |
| **Swiss Minimal** | Grilla matemática perfecta, mucho espacio negativo, tipografía pequeña y precisa. | Clínica, Legal, Consultoría |
| **Chaos Collage** | Elementos rotados, texturas de papel, superposiciones "scrapbook". | Creativos, Tiendas Locales, Comida Rápida |

### 1.2 TYPOGRAPHY PAIRING (La Voz)
*La tipografía es el 80% del diseño. Elige la voz correcta.*

| Opción | Header Font Style | Body Font Style | Vibe |
|--------|-------------------|-----------------|------|
| **The Diplomat** | Serif Clásica (Playfair) | Sans Geométrica (Inter) | Autoridad, Lujo, Tradición |
| **The Disruptor** | Display Experimental (Clash) | Mono-spaced (JetBrains) | Tech, Startups, Moderno |
| **The Friendly Neighbor** | Rounded Sans (Outfit) | Humanist Sans (DM Sans) | Guarderías, Mascotas, Panaderías |
| **The Editorial** | Condensed Sans (Bebas) | Serif Elegante (Lora) | Moda, Noticias, Blogs |
| **The Industrial** | Grotesk Wide (Space Grot) | Grotesk Standard (Public) | Construcción, Mecánica, Gym |

### 1.3 MOTION PERSONALITY (El Alma)
*¿Cómo se mueve el sitio?*

| Opción | Descripción Técnica | Sensación |
|--------|---------------------|-----------|
| **Liquid Flow** | Easing suave (0.76, 0, 0.24, 1), elementos que "flotan", parallax lento. | Lujo, Spa, Calma |
| **Snap & Punch** | Easing agresivo (Elastic), entradas rápidas, textos que golpean. | Deportes, Acción, Ofertas |
| **Tech Glitch** | Textos que se encriptan (TextScramble), cortes rápidos, sin fade-ins suaves. | Ciberseguridad, Gaming, Dev |
| **Theater Curtain** | Elementos que se revelan con máscaras (ClipPath), telones que suben. | Restaurantes, Teatro, Cine |
| **Solid Ground** | Movimiento mínimo y muy pesado. Solo lo esencial. Sin adornos. | Institucional, Legal, Banco |

### 1.4 COLOR ACIDITY (El Sabor)
*Define qué tan "picante" será la paleta cromática.*

| Opción | Descripción |
|--------|-------------|
| **Monocromo Puro** | Solo B/N + 1 color de acento minúsculo. (Elegancia extrema). |
| **Neón Tóxico** | Fondos oscuros con acentos saturados al 100% (Cian, Magenta, Lime). |
| **Pastel Suave** | Colores deslavados, bajo contraste, sensación de nube. |
| **Deep Earth** | Tonos oscuros pero cálidos (Café, Terracota, Verde Bosque). No usar negro puro. |
| **Corporate Cold** | Azules profundos, Grises acero, Blancos fríos. |

---

## 🧠 FASE 2: COMPATIBILITY CHECK (El Filtro Humano)

No todas las combinaciones funcionan. El agente debe aplicar **SENTIDO COMÚN**:

*   ❌ **Chaos Collage** + **Hospital** = Pánico (Parece desordenado/sucio).
*   ❌ **Tech Glitch** + **Abogado** = Desconfianza (Parece hackeado).
*   ❌ **Pastel Suave** + **Gimnasio Hardcore** = Debilidad.

**REGLA DE ORO:** Si el dado arroja una combinación incompatible, **VUELVE A TIRAR** esa categoría específica hasta que encaje.

---

## 📜 FASE 3: BIBLIA INTEGRATION (La Ley Suprema)

Una vez seleccionada la Dirección Creativa (ej: *Layout Brutalista + The Diplomat + Color Monocromo*), se debe aplicar la **BIBLIA.md** para ejecutarlo con calidad.

1.  **Si elegiste Brutalista:** Usa los componentes de la Biblia pero con bordes gruesos (`border-2 border-black`).
2.  **Si elegiste Asimetría:** Usa el Grid Area asimétrico definido en la Biblia.
3.  **Si elegiste Liquid Flow:** Aplica el `data-scroll-speed` a todas las imágenes.

La Dirección Creativa define el **QUÉ**. La Biblia define el **CÓMO**.

---

## 📝 OUTPUT REQUERIDO: EL "DESIGN BRIEF"

Antes de escribir código, el agente debe generar internamente (o en un archivo markdown temporal) este resumen:

```markdown
# 🎨 DESIGN BRIEF: [Nombre Proyecto]

## 🎲 Random Seeds Selected:
- **Layout:** [Opción Seleccionada] (ej. Asimetría Radical)
- **Typo:** [Opción Seleccionada] (ej. The Disruptor)
- **Motion:** [Opción Seleccionada] (ej. Liquid Flow)
- **Color Strategy:** [Opción Seleccionada] (ej. Deep Earth)

## 🎯 Rationale:
"Elegí Asimetría Radical para [Cliente] porque su competencia usa grids aburridos. 
Combinado con Typography 'The Disruptor' para darle un toque moderno..."

## 🛠️ Execution Plan (Biblia):
- Hero Component: [BentoGrid modificado / Parallax Scroll / etc]
- Main Feature: [3DCard / Velocity Scroll / etc]
- Palette: [Hex codes definidos]
```

---

## 🚀 MODO DE USO EN FACTORY

Cuando el usuario pide `/factory-demo`, el agente debe:
1.  Leer `creative-director-h0.md`.
2.  Ejecutar la Fase 1 (Dados).
3.  Ejecutar la Fase 2 (Filtro).
4.  Generar el Design Brief.
5.  **RECIÉN AHÍ** consultar el Prompt SQL de la industria para obtener textos y estructura de contenido, pero **IGNORANDO** cualquier instrucción de diseño visual que contradiga el Design Brief generado aquí.

**JERARQUÍA DE MANDO:**
1.  **Creative Director (Esta Skill):** Manda sobre el Estilo Visual.
2.  **Biblia:** Manda sobre la Ejecución Técnica.
3.  **Prompt SQL:** Manda solo sobre el Contenido (Textos, Secciones).
