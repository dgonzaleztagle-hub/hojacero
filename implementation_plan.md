# Implementation Plan - Biocrom V3 (Strict Mode)

This plan enforces the "Factory V4.0 Strict Mode" protocols to generate the Biocrom demo V3.

## Goal
Create a "High Cost" feeling landing page for Biocrom that respected Content Integrity (Sitemap) and follows the Creative Director's "Liquid Flow" brief without resorting to lazy defaults.

## User Review Required
> [!IMPORTANT]
> **Component Ban:** `VelocityScroll` is strictly banned.
> **Content Rule:** All 8 menu items from the original site must be present (4 visible + More menu).
> **CSS Rule:** No initial `opacity: 0` in CSS. JS handles entry animations.

## Proposed Changes

### Assets
#### [NEW] `public/prospectos/biocrom/`
- Generate new "Liquid Flow" assets (Refraction, Fluids) complying with FullHD limit.
- Manually create/fetch a "Authority Bar" asset (Logos of brands).

### Code Components
#### [NEW] `app/prospectos/biocrom/layout.tsx`
- Contain `DemoTracker`.
- Set Metadata.

#### [NEW] `app/prospectos/biocrom/page.tsx`
- **Structure:**
    - **Nav:** Logo (SVG/Text styled) + Links: Inicio, Quiénes, Asesorías, Ventas, Servicios, Capacitación, Catálogo, Contacto.
    - **Hero:** "Liquid Transition". `KineticText` (Slow) + `ClipPathReveal` (Diagonal).
    - **Authority Bar:** Static grid of gray-scale logos (DataApex, Knauer, Scion, etc).
    - **Value Prop:** Big typography "Marcas No Tradicionales".
    - **Services Grid:** Custom CSS Grid (7/5 split), NO generic Bento.
    - **Footer:** Full contact info mirroring `biocrom.cl`.

## Verification Plan

### Automated Tests
1. **Build Check:** `npm run dev` must pass without errors.
2. **500 Check:** Access `http://localhost:3000/prospectos/biocrom`.

### Manual Verification
1. **Sitemap Audit:** Verify all 8 original links are representend.
2. **Motion Check:** Verify "Liquid" feel (no strobe).
3. **Lazy Check:** Confirm NO `VelocityScroll` is present.
4. **Mobile Check:** Open on mobile view (390px) and check font sizes > 32px.
