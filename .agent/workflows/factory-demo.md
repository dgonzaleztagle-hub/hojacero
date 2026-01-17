---
description: Genera un demo landing premium para un prospecto usando HojaCero Factory
---

# 🏭 HojaCero Factory - Generación de Demo Landing

Este workflow genera una **landing page premium** para un prospecto aplicando los protocolos de diseño V3.2.
Para generar un **sitio multi-página completo**, usa el workflow `/factory-final`.

// turbo-all

## Fase 0: Deep Discovery (CRÍTICO)

Antes de cualquier diseño, el agente DEBE conocer el alma del negocio. No intentes construir si no has entendido el nicho a fondo.

### 0.1 Deep Crawling (Más allá de la Home)
No te quedes en la primera página. Identifica las sub-páginas críticas del prospecto y léelas todas:
- **Página de Servicios/Productos:** Para extraer catálogos técnicos, especialidades y terminología del nicho (ej. Células de carga, cromatografía, etc.).
- **Página 'Sobre Nosotros' / Historia:** Para captar la voz, los años de experiencia y la autoridad de marca.
- **FAQs o Recursos:** Para entender qué problemas resuelven a sus clientes.

### 0.2 Reputation & Sentiment Research
Usa `search_web` para investigar qué dice el mundo real:
- **Reviews de Google:** Busca "[Nombre Negocio] opiniones". Rescata frases reales de clientes contentos (para el social proof) y quejosos (para resolver ese dolor en la landing).
- **Redes Sociales:** Verifica tono en Instagram/LinkedIn.
- **Noticias/Premios:** Busca hitos que den autoridad "blindada".

### 0.3 Competition Benchmarking
Busca **"Mejores [Industria] en [Ubicación]"** para ver qué están haciendo bien los competidores Pro. Tu demo debe ser MEJOR que lo mejor que tengan ellos.

### 0.4 Documentar Hallazgos (OUTPUT OBLIGATORIO)
**ANTES de continuar**, crea un archivo `discovery_notes.md` en la carpeta del prospecto con:
```markdown
# Discovery Notes: [Nombre Prospecto]

## Datos Clave
- Nombre: ...
- Industria: ...
- Servicios principales: ...
- Años de experiencia: ...

## Voz y Tono
- Palabras clave que usan: ...
- Filosofía/valores: ...

## Reputación
- Puntos fuertes (de reviews): ...
- Puntos de dolor (de reviews): ...

## Competencia
- Competidor 1: [URL] - Qué hacen bien: ...
- Competidor 2: [URL] - Qué hacen bien: ...

## Decisiones para el Diseño
- Estilo recomendado: ...
- Colores a evitar: ...
- Mensaje principal: ...
```
**USA ESTE ARCHIVO** en las siguientes fases para no perder el contexto.

---

## Fase 1: Recopilar Información del Prospecto

Antes de comenzar, necesitas:
- **URL del sitio actual** del prospecto (para el Deep Crawl)
- **Logo** del cliente (imagen)
- **Industria** del negocio

## Fase 2: Scrapear Contenido Real (Editorial Curation)

Usa `read_url_content` para extraer del sitio del prospecto:

```
EXTRAER:
- Nombre del negocio
- Servicios/productos con precios exactos
- Horarios de atención
- Ubicación/dirección
- Nombres del equipo/dueños
- Filosofía/valores
- Información de contacto
- Keywords importantes (pet-friendly, familiar, premium, etc.)
```

**IMPORTANTE:** No inventes datos. Si no encuentras algo crítico, marca como "A CONFIRMAR".

## Fase 3: Pre-filter de Contexto (CRÍTICO)

Antes de seleccionar estilo, analiza el contexto:

### 3.1 Análisis de Horarios
```
IF horario cierra antes de 21:00 → EXCLUIR estilos "nocturnos/dark"
IF abre temprano (antes de 10am) → FAVORECER estilos "frescos/light"
IF solo fines de semana → Adaptar messaging
```

### 3.2 Análisis de Keywords
```
IF "familiar" OR "niños" OR "pet-friendly" → EXCLUIR estilos "exclusivo/adultos"
IF "premium" OR "exclusivo" OR "boutique" → EXCLUIR estilos "casual/económico"
IF "rural" OR "campo" OR "jardín" → FAVORECER estilos "cálidos/naturales"
IF "urbano" OR "centro" OR "moderno" → FAVORECER estilos "contemporáneos"
```

### 3.3 Análisis de Industria
```
GASTRONOMÍA:
- Familiar + rural → Tuscan Warmth
- Fine dining + nocturno → Midnight Theatre
- Experimental + conceptual → Avant-Garde Lab

LEGAL:
- Corporativo + tradicional → Swiss Authority
- Litigación + dramático → Legal Drama
- Tech/startups → TechLaw

(Similar para otras industrias)
```

## Fase 4: Selección de Estilo (Ruleta Filtrada)

1. Identifica la industria del prospecto
2. Aplica los filtros de la Fase 3
3. De los estilos COMPATIBLES, selecciona uno
4. Consulta el prompt correspondiente en `seed_batch_X_v3.2.sql`

### Estilos por Industria:

| Industria | Style 1 | Style 2 | Style 3 |
|-----------|---------|---------|---------|
| Gastronomía | Midnight Theatre | Tuscan Warmth | Avant-Garde Lab |
| Turismo | Wanderlust Cinema | Local Insider | Luxury Escape |
| Moda | Runway Editorial | Lifestyle Brand | Streetwear Drop |
| Automotriz | Performance Theatre | Trusted Dealer | Collector Gallery |
| Legal | Swiss Authority | Legal Drama | TechLaw |
| Real Estate | Architectural Luxury | Interactive Map | Investment Dashboard |
| Tech | Product-Led Growth | Developer First | Enterprise Trust |
| Consultoría | Transformation Story | Workshop Energy | Thought Leader |
| Salud | Future Clinical | Holistic Wellness | Smile Gallery |
| Educación | Future Learning | Career Accelerator | Learning Platform |
| Construcción | Master Builder | TechBuild | Heritage Craftsman |
| Fitness | Transformation Energy | Wellness Sanctuary | Performance Lab |

## Fase 5: Generar Assets (Asset Generation Protocol)

Usa `generate_image` para crear imágenes específicas:

### 5.1 Hero Image (REQUERIDO)
```
Descripción específica según estilo:
- Incluir contexto de la industria
- Matching con la paleta de colores del estilo
- NO stock photos genéricas
```

### 5.2 Supporting Images (4-8)
```
- Producto/servicio principal
- Interior/ambiente
- Equipo (si aplica)
- Detalles de calidad
```

### 5.3 Self-check de Imágenes
Antes de usar, pregunta:
- "¿Esta imagen aparecería en un sitio de stock?"
- "¿Comunica el nivel de precio correcto?"
- "¿Match con el estilo seleccionado?"

## Fase 6: Crear Directorio y Copiar Assets

```bash
mkdir "d:\proyectos\hojacero\public\prospectos\[nombre-prospecto]"
mkdir "d:\proyectos\hojacero\app\prospectos\[nombre-prospecto]"
# Copiar logo e imágenes generadas
```

---

## 🎖️ Fase 6.5: GOLD MASTER PROTOCOL v4.0 (OBLIGATORIO)

**ANTES de escribir código, internaliza estos mandamientos universales.**

### 🧠 FILOSOFÍA ANTI-PLANTILLA

```
PREGUNTA CONSTANTE: "¿Esto se ve de ALTO COSTO?"

SI la respuesta es NO → REDESIGNA
SI la respuesta es "más o menos" → REDESIGNA
SI la respuesta es "sí, pero..." → REDESIGNA
SOLO si la respuesta es "SÍ, definitivamente" → CONTINÚA
```

**JAMÁS:**
- Usar layouts que "funcionan" pero no impresionan
- Copiar estructuras de templates predeterminados
- Conformarse con "se ve bien"
- Usar colores default de frameworks

**SIEMPRE:**
- Buscar el elemento WOW único por sección
- Preguntar "¿Screenshotearía esto?"
- Contextualizar al rubro específico
- Pensar "¿Qué haría una agencia de $50k por proyecto?"

---

### ✍️ CURADOR DE MICRO-COPY (No Lorem Ipsum Mental)

**Cuando falte contenido, NO uses frases genéricas. Usa estructuras de copywriting.**

```
FRASES PROHIBIDAS (Lorem Ipsum Mental):
❌ "Somos líderes en..."
❌ "Ofrecemos soluciones..."
❌ "Nuestro compromiso..."
❌ "Calidad y experiencia..."
❌ "Tu satisfacción es nuestra prioridad"

ESTRUCTURAS DE COPYWRITING PERMITIDAS:
✅ PROBLEMA → AGITACIÓN → SOLUCIÓN
✅ ANTES → DESPUÉS → PUENTE
✅ PRUEBA SOCIAL → BENEFICIO → CTA
✅ PREGUNTA RETÓRICA → RESPUESTA INESPERADA
```

**EJEMPLOS POR SECCIÓN:**

```
HERO HEADLINE (2-4 palabras):
- Gastronomía: "TASTE THE NIGHT" (no "Bienvenidos a nuestro restaurante")
- Legal: "YOUR FIGHT. OUR FIRE." (no "Abogados con experiencia")
- Tech: "SHIP FASTER." (no "Soluciones tecnológicas innovadoras")

SUBHEADLINE (1-2 oraciones):
- Usa NÚMEROS concretos: "12 años. 847 casos. 0 derrotas."
- Usa CONTRASTE: "Otros prometen. Nosotros demostramos."
- Usa TENSIÓN: "El mercado no espera. ¿Y tú?"

CTA (Verbos de acción):
- "Reservar experiencia" > "Contactar"
- "Ver el caso" > "Más información"  
- "Comenzar ahora" > "Solicitar demo"
```

---

### 🏗️ CSS GRID AREAS (No Flex-Wrap Básico)

**Para layouts asimétricos, usa Grid Areas nombradas. NUNCA flex-wrap genérico.**

```css
/* ❌ MAL: Flex-wrap sin control */
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* ✅ BIEN: Grid Areas con control total */
.bento-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-areas:
    "hero hero hero hero hero hero hero . sidebar sidebar sidebar sidebar"
    "card1 card1 card1 card1 card2 card2 card2 card2 sidebar sidebar sidebar sidebar"
    "card3 card3 card3 card3 card3 card3 card4 card4 card4 card4 card4 card4";
  gap: 1.5rem;
}

/* Asignación de áreas */
.hero { grid-area: hero; }
.sidebar { grid-area: sidebar; }
.card-1 { grid-area: card1; }
/* ... */
```

**REGLA DE ASIMETRÍA:**
```
NUNCA uses columnas iguales:
❌ grid-template-columns: repeat(3, 1fr)     /* 4/4/4 = boring */
❌ grid-template-columns: repeat(2, 1fr)     /* 6/6 = boring */

SIEMPRE usa proporciones con tensión:
✅ grid-template-columns: 7fr 5fr            /* 7/5 tensión */
✅ grid-template-columns: 2fr 1fr 1fr        /* 6/3/3 variado */
✅ grid-template-columns: 5fr 4fr 3fr        /* Progresión */
```

---

### 🎬 MOTION BRANDING (Cada Asset se Mueve)

**En Awwwards, NADA es estático. Cada imagen/elemento tiene un comportamiento de scroll.**

```
ASIGNAR A CADA ASSET UN MOTION TYPE:

IMÁGENES HERO:
- data-scroll-speed="-0.3" (parallax inverso, flota hacia arriba)
- O ClipPathReveal direction="diagonal"

IMÁGENES SECUNDARIAS:
- data-scroll-speed="0.2" (parallax normal, se hunde)
- O scale on scroll (0.9 → 1.0)

TEXTO GRANDE:
- KineticText animation="fade-up"
- O VelocityScroll para frases de impacto

CARDS/ELEMENTOS:
- Stagger en entrada (delay incremental)
- Hover con MagneticCursor si es clickeable
```

**CÓDIGO DE REFERENCIA (GSAP):**
```javascript
// Parallax básico
gsap.to("[data-scroll-speed]", {
  y: (i, el) => parseFloat(el.dataset.scrollSpeed) * 100,
  ease: "none",
  scrollTrigger: {
    trigger: el,
    scrub: true,
  }
});

// Reveal on scroll
gsap.from(".reveal-element", {
  y: 100,
  opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".reveal-element",
    start: "top 80%",
  }
});
```

**PREGUNTA OBLIGATORIA:** "¿Qué hace este elemento cuando hago scroll?"
- Si la respuesta es "nada" → AGREGAR MOVIMIENTO

---

### 📱 MOBILE-FIRST WOW (CRÍTICO)

**El lead abre el email en su CELULAR.** Si el demo no impresiona ahí, perdiste.

#### 🧠 DECISIÓN INICIAL: ¿Responsive o Diferenciado?

```
EVALÚA ANTES DE CONSTRUIR:

SI el prospecto es de ALTO VALOR (facturación grande, marca conocida)
  O el rubro es ULTRA-VISUAL (moda, automotriz, arquitectura, tech premium)
  O el demo competirá contra agencias grandes:
  
  → MODO: EXPERIENCIA DIFERENCIADA
  → Crear componentes específicos para mobile
  → Usar DeviceSwitch para alternar
  
SINO:
  → MODO: RESPONSIVE PREMIUM (default)
  → Un solo código, mobile-first con Tailwind
  → Componentes que se adaptan automáticamente
```

#### Herramientas para Experiencia Diferenciada

```javascript
// Hook para detectar mobile
import { useIsMobile, DeviceSwitch } from '@/hooks/useIsMobile';

// Opción 1: Con hook
const isMobile = useIsMobile();
return isMobile ? <MobileHero /> : <DesktopHero />;

// Opción 2: Con componente
<DeviceSwitch
  mobile={<MobileHero />}
  desktop={<DesktopHero />}
/>
```

#### Dispositivo de Referencia: iPhone 17 Pro Max (430px)

```
REGLA DE ORO MOBILE:
- El Hero DEBE verse espectacular en 430px de ancho
- No dependas de efectos que solo funcionan con mouse (hover)
- Las animaciones deben ser más sutiles en mobile
- Touch targets mínimo 44x44px
```

**CHECKLIST MOBILE OBLIGATORIO:**
- [ ] Hero text legible sin hacer zoom (mínimo 32px para headlines)
- [ ] Imágenes no cortadas ni distorsionadas
- [ ] CTAs prominentes con padding generoso
- [ ] Scroll vertical limpio (NO horizontal accidental)
- [ ] Tipografía body mínimo 16px (evita zoom en iOS)
- [ ] Espaciado touch-friendly entre elementos

**ADAPTACIONES POR COMPONENTE:**
```
BentoGrid → En mobile: stack vertical, 1 columna máximo 2
3DCard → Reducir intensidad del efecto 3D (rotación ±5° vs ±15°)
VelocityScroll → Funciona igual, considerar más lento
InfiniteMovingCards → Max 2-3 cards visibles
MagneticCursor → DESACTIVAR en touch (usar useIsTouchDevice)
AnimatedGradient → Reducir blur a 60px y opacity a 0.3 (performance)
TextGenerate → Velocidad más rápida en mobile
```

**BREAKPOINTS TAILWIND:**
```css
/* Mobile first - iPhone 14/15 Pro = 393px */
default: 0px+      (mobile)
sm: 640px+         (mobile landscape)
md: 768px+         (tablet)
lg: 1024px+        (laptop)
xl: 1280px+        (desktop)
2xl: 1536px+       (large desktop)
```

**PREGUNTA FINAL:** "Si el CEO lo abre en su iPhone mientras camina, ¿dice WOW?"

---

### 🎨 ARSENAL DE COMPONENTES PREMIUM

Tienes acceso a estos componentes. **ÚSALOS con criterio según contexto:**

| Componente | Import | Cuándo usar |
|------------|--------|-------------|
| **BentoGrid** | `@/components/premium/BentoGrid` | Showcase de 4-8 items con jerarquía visual (uno destacado) |
| **3DCard** | `@/components/premium/3DCard` | Highlight de producto/servicio estrella con hover 3D |
| **TextGenerateEffect** | `@/components/premium/TextGenerate` | Manifestos, filosofía, frases de impacto |
| **VelocityScroll** | `@/components/premium/VelocityScroll` | Marquee infinito de keywords, logos, o phrases |
| **InfiniteMovingCards** | `@/components/premium/InfiniteMovingCards` | Testimonios, logos de clientes, prensa |
| **AnimatedCounter** | `@/components/premium/AnimatedCounter` | Estadísticas que impresionan (años, clientes, etc) |
| **TextScramble** | `@/components/ui/TextScramble` | Textos que mutan, efecto hacker/tech |
| **MagneticCursor** | `@/components/premium/MagneticCursor` | Envolver botones/links para efecto magnético premium |
| **AnimatedGradient** | `@/components/premium/AnimatedGradient` | Fondos que "respiran" estilo Stripe/Linear |
| **KineticText** | `@/components/premium/KineticText` | Tipografía cinética letra por letra (Splitting.js) |
| **ClipPathReveal** | `@/components/premium/ClipPathReveal` | Revelar imágenes/contenido con máscara animada |
| **GrainTexture** | `@/components/premium/GrainTexture` | Overlay de textura film/premium anti-plantilla |

**LÓGICA DE SELECCIÓN:**
```
IF testimonio destacado único → 3DCard
IF múltiples testimonios → InfiniteMovingCards
IF frase de impacto corta → TextGenerateEffect
IF keywords repetitivas → VelocityScroll
IF logros numéricos → AnimatedCounter
IF productos variados → BentoGrid con UNO más grande
IF botones/CTAs importantes → Envolver con MagneticCursor
IF rubro tech/moderno → AnimatedGradient con preset 'tech'
IF rubro lujo → AnimatedGradient con preset 'luxury'
IF headline de impacto GRANDE → KineticText con animation 'wave' o 'blur'
IF imágenes hero/galería → ClipPathReveal con direction según layout
```

**USO DE KINETIC TEXT:**
```javascript
import { KineticText } from '@/components/premium/KineticText';

// Headlines dramáticos
<KineticText 
  text="PREMIUM DESIGN" 
  as="h1"
  splitBy="chars"
  animation="fade-up"  // fade-up, fade-in, scale, blur, wave
  stagger={0.03}
/>
```

**USO DE CLIP-PATH REVEAL:**
```javascript
import { ClipPathReveal, ImageReveal } from '@/components/premium/ClipPathReveal';

// Revelar imagen con cortina desde la izquierda
<ClipPathReveal direction="left" duration={1.2}>
  <img src="/hero.jpg" />
</ClipPathReveal>

// Direcciones: left, right, top, bottom, diagonal, circle
```

**VARIABLE FONTS (Tip Premium):**
```css
/* Usar fuentes variables para animar peso/slant */
font-family: 'Inter', sans-serif;
font-variation-settings: 'wght' 400;
transition: font-variation-settings 0.3s;

/* En hover o scroll, animar a bold */
font-variation-settings: 'wght' 700;
```

**USO DE GRAIN TEXTURE:**
```javascript
import { GrainTexture } from '@/components/premium/GrainTexture';

// Overlay global sutil
<GrainTexture opacity={0.08} />

// Animado para efecto "cine"
<GrainTexture animated={true} blendMode="overlay" />

// Solo en una sección
<section className="relative">
  <GrainTexture opacity={0.15} />
  <div className="relative z-10">...</div>
</section>
```

---

### 🔥 TENSIÓN VISUAL (Anti-Plantilla)

**El secreto de Awwwards: romper la simetría perfecta.**

```
SEÑALES DE PLANTILLA (EVITAR):
- Todo perfectamente centrado
- Grids uniformes de 3x3 o 4x4
- Tipografía que no "respira"
- Espaciado igual en todos lados
- Elementos que no se cortan en bordes

TÉCNICAS DE TENSIÓN:
→ Hacer UN elemento desproporcionadamente grande
→ Tipografía que se CORTA en el borde de la pantalla
→ Grids asimétricos (7/5, 8/4, no 6/6)
→ Un elemento que "invade" la sección de abajo
→ Espaciado generoso en un lado, apretado en otro
```

**FUENTES PREMIUM (No uses las de siempre):**
```
RECOMENDADAS PARA HEADLINES:
- Clash Display (gratis en fontshare.com)
- Satoshi (gratis en fontshare.com)
- Cabinet Grotesk (gratis)
- General Sans

RECOMENDADAS PARA BODY:
- Inter (variable font)
- Plus Jakarta Sans
- Outfit

EVITAR (overused):
- Montserrat
- Poppins
- Open Sans (a menos que sea intencional)
```

---

### 🎵 RITMO VISUAL (Scroll Intelligence)

**El scroll no es solo desplazamiento, es un instrumento narrativo.**

```
ANÁLISIS DE RITMO:
- ¿Cuánta información hay en esta sección?
- ¿El usuario necesita tiempo para absorberla?

REGLAS:
IF sección tiene mucho texto/datos → Scroll más lento o "pinning"
IF sección es visual (imagen, video) → Scroll normal
IF sección es CTA → Debe "respirar" con espacio blanco

TÉCNICA DE PINNING (GSAP):
- Fijar sección mientras el usuario "lee"
- Animar elementos dentro de la sección fija
- Liberar cuando el contenido termine
```

```javascript
// Ejemplo de pinning para secciones densas
gsap.to(".content-dense", {
  scrollTrigger: {
    trigger: ".content-dense",
    pin: true,
    start: "top top",
    end: "+=1000", // 1000px de scroll mientras está fijo
    scrub: true,
  }
});
```

---

### 🎯 MICRO-UX FEEDBACK (Todo Responde)

**Si algo se puede interactuar, debe dar feedback visual.**

```
CHECKLIST DE MICRO-UX:
- [ ] Hover en botones → Cambio de escala/color
- [ ] Hover en links → Underline animado o color shift  
- [ ] Hover en imágenes → Zoom sutil o overlay
- [ ] Hover en cards → Elevación (sombra) o borde
- [ ] Scroll → Algo cambia (parallax, opacidad, escala)
- [ ] Click/Tap → Feedback inmediato (ripple, scale)

SEÑALES DE SITIO "MUERTO" (EVITAR):
- Elementos sin hover state
- Transiciones instantáneas (sin ease)
- Scroll plano sin movimiento
- CTAs que solo cambian cursor
```

**REGLA DE ORO:** Si el usuario hace algo, la UI responde en < 100ms.

---

### 📐 SISTEMA DE DISEÑO ALGORÍTMICO

**No improvises tamaños. Usa matemáticas.**

#### Escala Tipográfica (Proporción Áurea: 1.618)
```css
/* Base: 16px, ratio: 1.618 (golden ratio) */
--text-xs:   10px;   /* 16 / 1.618 */
--text-sm:   12px;   
--text-base: 16px;   /* Base */
--text-lg:   26px;   /* 16 * 1.618 */
--text-xl:   42px;   /* 26 * 1.618 */
--text-2xl:  68px;   /* 42 * 1.618 */
--text-3xl:  110px;  /* 68 * 1.618 */

/* O usa ratio menor para menos contraste: 1.25 (Major Third) */
```

#### Espaciado Consistente (8px Grid)
```css
/* Todo múltiplo de 8 */
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-6: 48px;
--space-8: 64px;
--space-12: 96px;
--space-16: 128px;
```

#### Contraste de Colores (WCAG AA mínimo)
```
REGLAS:
- Texto sobre fondo: ratio mínimo 4.5:1
- Texto grande (>24px): ratio mínimo 3:1
- Elementos interactivos: ratio mínimo 3:1

HERRAMIENTAS:
- Usa contrast-ratio.com para verificar
- O la extensión WAVE
```

#### Paleta Algorítmica
```
MÉTODO:
1. Elige UN color primario del rubro/marca
2. Genera variantes con HSL:
   - Lighter: aumentar L (luminosidad)
   - Darker: disminuir L
3. Complementario: H + 180°
4. Análogos: H ± 30°

EJEMPLO:
Primary: hsl(220, 70%, 50%)  // Azul
Light:   hsl(220, 70%, 80%)
Dark:    hsl(220, 70%, 30%)
Accent:  hsl(40, 70%, 50%)   // Complementario (dorado)
```

---

### ⚡ GSAP FLIP (Transiciones Mágicas)

GSAP Flip permite transiciones de estado fluidas (ej: una imagen de galería que se convierte en hero).

```javascript
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

// Guardar estado inicial
const state = Flip.getState(".my-element");

// Cambiar el DOM (mover elemento, cambiar clases, etc)
element.classList.add("new-position");

// Animar la transición
Flip.from(state, {
  duration: 1,
  ease: "power2.inOut",
  absolute: true,
});
```

**CUÁNDO USAR FLIP:**
- Galería → Hero transition
- Lista → Grid transition
- Card expanding to modal
- Navigation morphs

---

**PRESETS DE GRADIENTE DISPONIBLES:**
```javascript
import { gradientPresets } from '@/components/premium/AnimatedGradient';

// Opciones: tech, luxury, nature, sunset, ocean, minimal, dark
<AnimatedGradient colors={gradientPresets.tech} />
```

---

### 🎬 TOKENS DE ANIMACIÓN (Curvas Personalizadas)

**NO uses ease-in-out por defecto.** Aplica estas curvas para cada tipo de movimiento:

```javascript
// ENTRADAS DRAMÁTICAS (elementos que aparecen)
const ENTRANCE = [0.16, 1, 0.3, 1]; // "easeOutExpo" - rápido al inicio, desacelera suave

// SALIDAS ELEGANTES (elementos que desaparecen)  
const EXIT = [0.7, 0, 0.84, 0]; // "easeInExpo" - acelera hacia el final

// REBOTE SUTIL (botones, hover states)
const BOUNCE = [0.68, -0.55, 0.265, 1.55]; // Ligero overshoot

// PREMIUM SMOOTH (scroll-linked)
const PREMIUM = [0.76, 0, 0.24, 1]; // Suave y profesional

// EN FRAMER MOTION:
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}

// EN GSAP:
gsap.to(element, { duration: 0.8, ease: "expo.out" });
```

---

### 🚀 STACK TÉCNICO DISPONIBLE

Recuerda que tienes instalado:
- **GSAP + ScrollTrigger** → Para animaciones complejas y scroll-based
- **Framer Motion** → Para gestos y layout animations en React
- **Three.js + R3F** → Para 3D si el rubro lo amerita (tech, automotriz, lujo)
- **Lenis** → Smooth scroll ya integrado en SmoothScroll wrapper
- **Lottie React** → Para animaciones vectoriales ligeras (logos animados, iconos, micro-interactions)

**CUÁNDO USAR LOTTIE:**
```javascript
import Lottie from 'lottie-react';
import animationData from './animation.json';

// Ideal para:
// - Logos animados del cliente
// - Iconos que se animan en hover
// - Loading states premium
// - Ilustraciones que respiran

<Lottie animationData={animationData} loop={true} />
```

**USA Three.js/R3F solo si:**
- El rubro es tech, automotriz, arquitectura, o lujo extremo
- El cliente tiene productos físicos que mostrar en 3D
- NO para "añadir 3D porque sí"

---

### 🖼️ OPTIMIZACIÓN DE ASSETS

```
FORMATOS OBLIGATORIOS:
- Imágenes: Prefiere .webp (mejor compresión, soportado everywhere)
- Videos: .webm con transparencia si aplica, .mp4 como fallback
- Iconos: SVG siempre que sea posible and logos también
- Lotties: Para micro-animaciones si las usas

TAMAÑOS MÁXIMOS:
- Hero images: max 500KB
- Supporting images: max 200KB
- Videos de fondo: max 5MB, loop corto (5-15s)
```

---

### 🎯 CHECKLIST PRE-CÓDIGO

Antes de escribir la primera línea, responde:

1. **¿Cuál es el elemento WOW de este sitio?** 
   - Si no puedes nombrarlo → Piensa más
   
2. **¿El rubro tiene algo único que explotar visualmente?**
   - Gastronomía → Texturas de comida, vapor, fuego
   - Legal → Autoridad, contraste dramático
   - Tech → Líneas, gradientes sutiles, código
   - Salud → Limpieza, confianza, sonrisas
   
3. **¿Qué emoción debe sentir el visitante?**
   - Define: Curiosidad → Deseo → Acción
   
4. **¿Los competidores tienen algo así?**
   - Si SÍ → Hazlo MEJOR
   - Si NO → Hazlo PRIMERO

---

## Fase 7: Generar Código de Landing

Crea `d:\proyectos\hojacero\app\prospectos\[nombre-prospecto]\page.tsx` siguiendo:
1. **Aplicar prompt V3.2** del estilo seleccionado.
2. **Usar contenido real** extraído en la Fase 0 y 2 (revisa `discovery_notes.md`).
3. **Inyectar Reputación:** Usa testimonios reales filtrados en Fase 0.2.
4. **Design Judgment:**
   - ❌ No layouts centrados simétricos.
   - ❌ No grids uniformes.
   - ✅ Layout asimétrico.
   - ✅ Tipografía mezclada (Display + Serif/Sans).

## Fase 8: Verificar en Browser

```
Navegar a http://localhost:3000/prospectos/[nombre-prospecto]
```

Verificar:
- [ ] Hero renderiza correctamente
- [ ] Imágenes cargan
- [ ] Contenido es real (no placeholder)
- [ ] Estilo matchea con contexto del negocio
- [ ] Links de CTA funcionan
- [ ] Responsive (si aplica)

## Fase 9: Self-Check Final

Antes de entregar, responde:
1. "¿El cliente reconocería su negocio en esta landing?" → Debe ser SÍ
2. "¿El estilo visual matchea con su horario/contexto?" → Debe ser SÍ
3. "¿Screenshotearía esto para inspiración?" → Debe ser SÍ
4. "¿Podría existir en 1000 sitios genéricos?" → Debe ser NO

---

## Ejemplo de Uso

```
Usuario: /factory-demo para https://biocrom.cl

AI:
1. FASE 0: Deep Discovery
   - Scrapea Home, Servicios, Nosotros de biocrom.cl
   - Busca "Biocrom opiniones" en Google
   - Crea discovery_notes.md con hallazgos
2. FASE 1-2: Recopila datos estructurados
3. FASE 3: Analiza contexto (industria técnica, B2B)
4. FASE 4: Selecciona estilo "Enterprise Trust" o "Future Clinical"
5. FASE 5: Genera imágenes de laboratorio premium
6. FASE 6-7: Crea landing en /prospectos/biocrom
7. FASE 8-9: Verifica y entrega
```
