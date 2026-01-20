# ⚡ HOJACERO BIBLIA v2.1: El Manifiesto del Agente Estratégico

## 🎯 VISIÓN CORE: WOW POR DEFECTO
HojaCero no entrega "páginas web", entrega **autoridad visual blindada**. Los sitios deben parecer piezas de colección, no herramientas genéricas.

---

## 🔍 FASE ZERO: INTELIGENCIA ESTRATÉGICA (Obligatoria)
Antes de construir, el agente realiza un **Deep Research** que anula cualquier "sesgo de prompt" genérico.

1. **El Grano de Verdad (Lección Apimiel):** El agente DEBE encontrar el "activo técnico" (ej: una flor específica, una patente, una viscosidad). No diseñes "miel", diseña "arquitectura líquida de Quillay". La v1 debe ser el WOW definitivo.
2. **Protocolo Mirror (Navegación & Identidad):** Para sitios Full, el agente debe:
    - Mapear la estructura de menús original del cliente. Rediseñamos la *estética*, pero respetamos la *jerarquía*.
    - Extraer el logo original (SVG o PNG de alta calidad) para asegurar que el lead reconozca su marca en el nuevo diseño premium.
3. **Investigación de Reputación:** Extraer frases reales de clientes para el copy.
4. **Benchmarking Top 3:** Ver qué hace el #1 de Google y superarlo técnicamente.
5. **Curaduría de Activos HD:** Generar variaciones de imágenes macro y auto-seleccionarlas.

---

## 🤖 PROTOCOLO DE AUTOMATIZACIÓN (Hands-Off)
El agente es responsable de la infraestructura y la calidad sin molestar al usuario con "ruido de motor".

1. **Ley de Puerto Cero:** Antes de iniciar `npm run dev`, el agente limpia proactivamente los puertos (3000/3001).
2. **QA Técnico (No Visual):** El agente puede usar terminales para verificar builds, pero **NUNCA** debe usar herramientas de navegador para "mirar" la estética. Son lentas y no tienen "ojo".
3. **Ley de la Ventana Fantasma:** El usuario siempre tiene el preview abierto. No le preguntes "qué ves", asume que lo ve. Pide feedback directo.

---

## 🎨 COMANDAMIENTOS TÉCNICOS
1. **Asimetría y Tensión:** Evitar el orden de "plantilla de Word". Jerarquías claras y layouts disruptivos.
2. **Aesthetic Tech-Luxury:** Paletas de bajo contraste (Dark modes, Carbono, Glassmorphism) con acentos vibrantes.
3. **Framer Motion & GSAP:** La animación es la "textura" del sitio. Fluida y sutil.
4. **Mobile-First WOW:** El sitio debe impactar en móvil tanto como en desktop.

---

## 🐝 PROTOCOLO DE NICHOS DISRUPTIVOS
Cuando un negocio no encaja en los prompts predefinidos:
- **Modo Síntesis:** Mezclar conceptos para crear un ADN visual único.
- **Grano de Verdad:** Basar el diseño en la especificidad técnica encontrada.

---

## 🔄 PROTOCOLO DE REFINAMIENTO (Semi-Manual)
Este protocolo reemplaza el QA automatizado intrusivo por un ciclo de iteración visual directa con el usuario.

1.  **Blindaje Estructural (Shield):** Una vez que un Landing o sección es aprobado, se considera "Cerrado". No se rediseña ni se cambia a menos que haya una instrucción explícita ("cambia imagen X por Y").
2.  **Construcción Incremental (Factory Final):** Las sub-páginas y elementos adicionales se construyen *sobre* el landing aprobado, manteniendo el ADN visual intacto sin recurrir a regeneraciones completas.
3.  **Ciclo de Feedback Visual:** 
    - El agente codifica cambios.
    - Notifica al usuario para revisión.
    - El usuario sube capturas/feedback.
    - El agente aplica el "Ojo H0" (aprender de cada crítica para no repetir errores estéticos).
4.  **Hands-Off Total:** El agente instala, corre y configura TODO de forma automática. Solo pide intervención para API keys o datos sensibles.

---

- **2026-01-19 (v2.3):** Integración del "Protocolo Factory Final" (Hard Caps, Grid Defensivo, Proxy Physics) post-análisis Apimiel.
- **2026-01-19 (v2.2):** Sustitución de QA automatizado por Ciclo de Iteración Semimanual y Blindaje Estructural.
- **2026-01-19 (v2.1):** Integración de Grano de Verdad, Protocolo Mirror y Leyes de Automatización.

---

## 🏭 PROTOCOLO FACTORY FINAL (Anti-Iteración)
Este protocolo se activa INMEDIATAMENTE después de aprobar el Landing Demo. Su objetivo es evitar las "10 horas de refinamiento" aplicando restricciones preventivas estricas.

### 🛡️ Regla #1: Hard Cap (Ley Anti-Monstruo)
*   **Axioma:** "El navegador siempre intentará llenar el espacio. No lo dejes."
*   **Mandato:**
    *   **NUNCA** dejar una etiqueta `<Image />` o `<img>` sin un contenedor con `max-w` explícito (ej: `max-w-[300px]`, `max-w-sm`).
    *   Prohibido usar `w-full` en imágenes de producto o detalles verticales sin restricción.
    *   *Objetivo:* Evitar que una foto ocupe toda la pantalla por error.

### 🛡️ Regla #2: Grid Defensivo (Cinturón de Seguridad)
*   **Axioma:** "Los breakpoints de Tailwind no son suficientes para densidades altas."
*   **Mandato:**
    *   Establecer siempre un **Suelo de Columnas**. Ej: `grid-cols-3 md:grid-cols-6`.
    *   Nunca confiar en que el grid colapsará "graciosamente" a 1 columna. Forzar la densidad mínima para evitar el "Layout de lista kilométrica".

### 🛡️ Regla #3: Physics Proxy (Ley de Interacción 3D)
*   **Axioma:** "Lo que se toca no es lo que se ve."
*   **Mandato:**
    *   Al crear componentes interactivos (Diales, Carruseles, Objetos 3D):
        1.  Crear una capa **Invisible** (`z-50`, `opacity-0`) que capture los eventos (`drag`, `click`).
        2.  El componente **Visual** debe ser `pointer-events-none` y solo reaccionar a cambios de estado.
    *   *Objetivo:* Evitar drift, traslaciones accidentales y conflictos de gestos.

### 🛡️ Regla #4: Content-First Injection
*   **Axioma:** "El Lorem Ipsum es una mentira peligrosa."
*   **Mandato:**
    *   Antes de diseñar una página secundaria (Sustentabilidad, Nosotros), EXIGIR o EXTRAER el texto real.
    *   Si Texto > 300 caracteres -> Diseño Split o Bento OBLIGATORIO.
    *   Si Texto < 300 caracteres -> Diseño Hero Centrado permitido.

---

## 📏 DESIGN PHYSICS & RULES (Anti-Iteración)
Para evitar el "tira y afloja" estético, estas reglas son ley marcial a menos que el usuario pida lo contrario.

### 1. The "Compactness" Standard (Ley del Footer)
- **Definición**: Los elementos estructurales (Footers, Navbars secundarios) NO son protagonistas.
- **Regla**: Padding vertical máximo de `py-8` para footers simples. `py-4` es el ideal "Hojo".
- **Densidad**: El espacio negro "gratuito" está prohibido. El contenedor debe abrazar el contenido.

### 2. The "Bento Narrative" (Contenido)
- **Definición**: Nunca muros de texto.
- **Regla**: Si hay más de 2 párrafos, se convierte en Grid/Bento.
- **Uso**: Manifiestos, Misiones, Visiones se descomponen en tarjetas visuales (Icono + Título + Bajada).

### 3. Hojo Grid System
- **Desktop**: Siempre pensar en 12 columnas. Nunca dejar elementos "huérfanos" flotando en un grid de 2 o 3 si pueden justificar el ancho completo.
- **Equilibrio**: Evitar la carga izquierda (L-Bias). Usar `justify-between` para ocupar el lienzo.

### 5. The Mirror-First Law (Fidelidad de Contenido + Elevación Visual)
- **Concepto**: "Nunca de menos, siempre de más".
- **Contenido (El QUÉ)**: Es sagrado. No se resume, no se corta. Si es largo, es largo.
- **Forma (El CÓMO)**: Es arte. Tomamos ese contenido crudo y lo "reimaginamos" visualmente (Bento, Editorial, Interactivo).
- **Regla**: Copiamos el 100% de la información del cliente, pero la presentamos como si fuera un premio Awwwards.
