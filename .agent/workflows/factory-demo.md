---
description: Genera un demo landing premium para un prospecto usando HojaCero Factory
---

# 🏭 HojaCero Factory - Generación de Demo

Este workflow genera una landing page premium para un prospecto aplicando los protocolos de diseño V3.2.

// turbo-all

## Paso 1: Recopilar Información del Prospecto

Antes de comenzar, necesitas:
- **URL del sitio actual** del prospecto (para scrapear contenido real)
- **Logo** del cliente (imagen)
- **Industria** del negocio (gastronomía, legal, salud, etc.)

## Paso 2: Scrapear Contenido Real (Editorial Curation)

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

## Paso 3: Pre-filter de Contexto (CRÍTICO)

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

## Paso 4: Selección de Estilo (Ruleta Filtrada)

1. Identifica la industria del prospecto
2. Aplica los filtros del Paso 3
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

## Paso 5: Generar Assets (Asset Generation Protocol)

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

## Paso 6: Crear Directorio y Copiar Assets

```bash
mkdir "d:\proyectos\hojacero\public\prospectos\[nombre-prospecto]"
mkdir "d:\proyectos\hojacero\app\prospectos\[nombre-prospecto]"
# Copiar logo e imágenes generadas
```

## Paso 7: Generar Código de Landing

Crear `d:\proyectos\hojacero\app\prospectos\[nombre-prospecto]\page.tsx` siguiendo:

1. **Aplicar prompt V3.2** del estilo seleccionado
2. **Usar contenido real** extraído en Paso 2
3. **Referenciar imágenes** del Paso 5-6
4. **Verificar Design Judgment:**
   - ❌ No layouts centrados simétricos
   - ❌ No grids uniformes
   - ❌ No colores genéricos
   - ✅ Layout asimétrico
   - ✅ Un elemento memorable
   - ✅ Typography mixing

## Paso 8: Verificar en Browser

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

## Paso 9: Self-Check Final

Antes de entregar, responde:
1. "¿El cliente reconocería su negocio en esta landing?" → Debe ser SÍ
2. "¿El estilo visual matchea con su horario/contexto?" → Debe ser SÍ
3. "¿Screenshotearía esto para inspiración?" → Debe ser SÍ
4. "¿Podría existir en 1000 sitios genéricos?" → Debe ser NO

---

## Ejemplo de Uso

```
Usuario: Genera un demo para https://ejemplo.com, es un restaurante

AI:
1. Scrapea https://ejemplo.com → Extrae horarios, menú, ubicación
2. Analiza: cierra 21:00, es familiar, zona rural → Excluye Midnight Theatre
3. Estilos compatibles: Tuscan Warmth, Avant-Garde Lab
4. Selecciona: Tuscan Warmth
5. Genera imágenes cálidas, luz natural
6. Crea landing en /prospectos/ejemplo
7. Verifica en browser
8. Entrega
```
