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
