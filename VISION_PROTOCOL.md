# Protocolo Operativo: HojaCero Vision Gallery

## Concepto: The Hybrid Hojo Layout
La Galería Vision no es un simple slider de "Antes y Después". Es una narrativa de transformación diseñada para evitar la disonancia visual y maximizar el impacto.

Utilizamos una estrategia híbrida:
1.  **The Hook (El Gancho):** Un slider superior de altura fija que compara estrictamente **Hero vs Hero**. Alineación perfecta, impacto inmediato.
2.  **The Deep Dive (La Inmersión):** Un scroll vertical que revela la **experiencia completa** (Full Page) del nuevo diseño.

---

## Requisitos de Activos (La Regla de los 3 Artefactos)
Para integrar un nuevo prospecto en la galería, se requieren **exclusivamente** estos 3 activos gráficos. No improvisar con otros formatos.

### 1. The Reality (Before Hero)
*   **Qué es:** Captura del "Above the Fold" (parte superior) del sitio antiguo/original.
*   **Formato:** PNG, 1920x1080px (aprox).
*   **Propósito:** Lado izquierdo del slider. Representa el status quo aburrido.
*   **Nomenclatura:** `[cliente]_before.png`

### 2. The Vision (After Hero - Clean)
*   **Qué es:** Captura del "Above the Fold" del nuevo diseño HojaCero.
*   **Crucial:** Debe estar alineada visualmente con la captura 'Before'. Sin bordes de navegador, sin scrollbars. Limpia.
*   **Propósito:** Lado derecho del slider Y portada del Bento Grid (color real).
*   **Nomenclatura:** `[cliente]_hero_clean.png`

### 3. The Protocol (After Full - Deep Dive)
*   **Qué es:** Captura de página completa (Full Page Screenshot) del nuevo diseño.
*   **Propósito:** Se muestra debajo del slider para permitir la exploración libre de la "Arquitectura Líquida".
*   **Nomenclatura:** `[cliente]_after_full.png`

---

## Checklist de Implementación (`data.ts`)
Al recibir los activos, actualizar `app/vision/data.ts` con la siguiente estructura:

```typescript
{
    id: 'cliente-id',
    // ... metadata ...
    imageBefore: '/prospectos/cliente/cliente_before.png',       // Activo 1
    imageAfter: '/prospectos/cliente/cliente_after_full.png',    // Activo 3
    coverImage: '/prospectos/cliente/cliente_hero_clean.png',    // Activo 2
    imageBeforeHero: '/prospectos/cliente/cliente_before.png',   // Activo 1
    imageAfterHero: '/prospectos/cliente/cliente_hero_clean.png',// Activo 2
    // ...
}
```

## Estándar de Calidad
*   **Nunca** usar filtros artificiales (B/N) en la grilla; dejar que los colores del diseño hablen.
*   **Nunca** usar capturas "cortadas" que prometan scroll y no lo den.
*   Si no hay "Antes" (concepto puro), usar placeholders neutros o saltar el slider y mostrar solo el Deep Dive.
