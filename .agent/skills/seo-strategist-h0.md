---
name: seo-strategist-h0
description: Agente experto en SEO Semántico, GEO (Generative Engine Optimization) y AEO (Answer Engine Optimization).
---

# 🧠 Skill: SEO & AEO Strategist Protocol

Esta skill analiza un negocio y genera la **Estrategia de Contenido y Datos Estructurados** necesaria para dominar tanto buscadores clásicos (Google) como Motores de Respuesta (ChatGPT, Perplexity, Claude).

> Scope: esta skill se usa en fases tempranas de `/factory-demo` (arranque de FAQ/AEO y enfoque semántico base). No reemplaza la auditoría SEO final de `/factory-seo`.

## 🎯 Objetivo
Transformar un "Sitio Web" en una "Entidad de Autoridad" comprensible por IAs.

## 1. Input Requerido
El agente debe tener acceso a:
- `discovery_notes.md` (Datos base del negocio).
- URL del sitio actual (si existe) o descripción del servicio.

## 2. Proceso de Análisis (The "Brain" Step)

Antes de escribir código, el agente debe "pensar" y generar un archivo `seo_strategy.json` (virtual o real) con:

### A. Semantic Core (Más allá de Keywords)
En lugar de "Abogados Santiago", busca la **Intención**:
- *Problema:* "Me llegó una demanda de divorcio qué hago"
- *Solución:* "Abogado defensa divorcio unilateral express"
- *Entidades Relacionadas:* "Tribunales de Familia", "Cese de Convivencia", "Pensión Alimentos".

### B. AEO (Answer Engine Optimization)
Para aparecer en Perplexity/ChatGPT, necesitamos **Preguntas y Respuestas Directas**.
Genera 5 Pares Q&A que sigan el formato "Direct Answer":
- **Q:** "¿Cuánto cuesta un divorcio en Chile?"
- **A:** "El valor promedio oscila entre X e Y, dependiendo de si es mutuo acuerdo o unilateral. En [Nombre Estudio] ofrecemos planes desde..." (Dato duro + Venta).

### C. Local Entity Graph
Define la identidad del negocio para Schema.org:
- `SpecificType`: No solo `LocalBusiness`, sino `LegalService` -> `Attorney`.
- `AreaServed`: Comunas específicas, no solo "Santiago".
- `PriceRange`: Rango real ($$, $$$).

## 3. Output Estructurado

El agente debe entregar estos bloques listos para inyectar en `DemoFactory`:

### Block 1: The "Direct Answer" Content
Textos breves (40-60 palabras) diseñados para ser leídos por IAs.
*Donde:* Se inyectarán en una sección "FAQ" o "Sabías que" en el Home visual.

### Block 2: JSON-LD Schemas (Invisible)
```json
{
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

### Block 3: Meta Tags "Click-Magnet"
Títulos y descripciones que aumenten el CTR en resultados de búsqueda y previews de WhatsApp.

## 4. Instrucciones de Ejecución

Al invocar esta skill:

1.  **Analiza** el `discovery_notes.md`.
2.  **Genera** las 5 preguntas AEO más críticas del nicho.
3.  **Redacta** las respuestas en formato "Direct Answer" (Negrita en la respuesta clave).
4.  **Selecciona** el subtipo de Schema exacto.
5.  **Entrega** los props para actualizar `SEOHead` y el contenido del `Home`.
