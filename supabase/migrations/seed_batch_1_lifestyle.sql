-- =================================================================================================
-- BATCH 1: LIFESTYLE & EXPERIENCE (Gastronomy, Tourism, Fashion, Automotive)
-- ARCHITECTURE: HIGH DENSITY PREMIUM + AWWWARDS TRENDS 2026
-- =================================================================================================

-- 1. GASTRONOMÍA (Food)
-- Trends: Dark Futurism, Editorial Kinetic, Neo-Minimalism
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: AWWWARDS_DARK_FUTURISM.
1. NAVBAR: Transparent. Centered Logo. Micro-interaction "Book Table" button (Outline).
2. HERO: Cinematic Video Loop (Slow motion flame/chef). Headline: "TASTE THE NIGHT". Font: Inter Display (Thin & Wide).
3. CONTENT: "Midnight Menu" section (Dark Card, Neon Accent text). "The Experience" (Horizontal Scroll of textures).
4. VIBE: Speakeasy, Michelin Star, Dangerous/Sexy.
5. COLOR: #050505 (Bg), #1a1a1a (Cards), #ff4d00 (Accent - Ember).', 'Style 1 - Midnight Chef (Dark Atmosphere)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: KINETIC_TYPOGRAPHY_MENU.
1. NAVBAR: Minimal. Logo Left. "Order Online" Pill Button.
2. HERO: NO IMAGE. Massive Marquee Text scrolling: "FRESH / LOCAL / WILD". Font: OGG or Playfair Display (Italic).
3. CONTENT: The Menu IS the UI. Giant list of dishes with hover-reveal images (Cursor follows mouse with food photo). 
4. VIBE: Modern Bistro, Hipster, Wine Bar.
5. COLOR: #f4f1ea (Bg - Cream), #1a1a1a (Text), #d44d5c (Accent - Wine).', 'Style 2 - The Typographic Menu (Kinetic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ORGANIC_SCANDINAVIAN.
1. NAVBAR: Clean White. Logo Black. 
2. HERO: Split Screen. Left: Macro shot of Ingredient (Texture). Right: Storytelling text "From Soil to Plate".
3. CONTENT: Bento Grid of ingredients/producers. "Reserve" section floating over parallax image.
4. VIBE: Noma style, Farm-to-table, Pure.
5. COLOR: #ffffff (Bg), #2b2b2b (Text), #8a9a5b (Accent - Moss Green).', 'Style 3 - Nordic Pure (Minimal)' FROM ind;

-- 2. TURISMO (Travel)
-- Trends: Immersive Scrollytelling, Organic, Luxury
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: IMMERSIVE_SCROLLYTELLING.
1. NAVBAR: Hidden until scroll up.
2. HERO: Full-screen drone shot (Paradise). Text fades in: "ESCAPE REALITY". Font: Editorial New.
3. CONTENT: Sections overlap with Parallax. "The Villa" (Sticky side text, scrolling images). "Experiences" (Horizontal Drag).
4. VIBE: Luxury Resort, Maldives, Private Island.
5. COLOR: #001f3f (Deep Ocean), #f0f0f0 (Text), #c5a059 (Accent - Gold Sand).', 'Style 1 - The Journey (Scrollytelling)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ORGANIC_ADVENTURE.
1. NAVBAR: Blur glass effect. Logo: Rough/Handwritten style.
2. HERO: Image with "Paper Tear" edge effect. Headline: "WILD HEARTS". Font: Rough Cordilla.
3. CONTENT: Masonry Grid of Polaroid-style photos. Map section with animated path.
4. VIBE: Patagonia, Tulum, Eco-Lodge.
5. COLOR: #2d3e2d (Jungle Green), #e8e4d9 (Paper), #d65a31 (Accent - Clay).', 'Style 2 - Jungle Explorer (Organic/Texture)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: URBAN_LUX_DARK.
1. NAVBAR: Black Glossy Bar. Silver Logo.
2. HERO: Night cityscape time-lapse. Glitch effect on text "THE CITY NEVER SLEEPS".
3. CONTENT: Bento Grid of Rooms and Amenities. "Concierge" Chat bubble fixed.
4. VIBE: New York Penthouse, Tokyo Hotel.
5. COLOR: #000000 (Bg), #ededed (Text), #333333 (Grid Lines), #00ff99 (Accent - Cyber).', 'Style 3 - Urban Luxury (Dark City)' FROM ind;

-- 3. MODA (Fashion)
-- Trends: Editorial, Brutalist, Classic
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: KINETIC_EDITORIAL_VOGUE.
1. NAVBAR: Tiny centered logo. "Shop" on corners.
2. HERO: White void. Model walking towards camera (Video). Huge Title behind model (Z-Index play).
3. CONTENT: Asymmetric image placement. Text flows around images like a magazine layout. "Shop the Look" hotspots.
4. VIBE: High Fashion, Runway, Avant-Garde.
5. COLOR: #ffffff (Bg), #000000 (Text). Pure B&W.', 'Style 1 - Vogue White (Kinetic Editorial)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: NEO_BRUTALIST_FLASH.
1. NAVBAR: Marquee text running constantly. Logo is overlapping content.
2. HERO: Flash photography (Hard light). Noise overlay. Font: Helvetica Bold (Stretched).
3. CONTENT: Product Grid with harsh black borders (4px). "DROP 001" flashing. Glitch hover effects.
4. VIBE: Streetwear, Hypebeast, Underground.
5. COLOR: #ff0000 (Bg - Red Error), #ffffff (Text), #000000 (Borders).', 'Style 2 - Underground Flash (Brutalist)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: HERITAGE_GOLD.
1. NAVBAR: Serif Font. Gold lines.
2. HERO: Oil painting texture overlay. Serif Italic headline "Timeless Elegance".
3. CONTENT: 2-Column Grid (Image + Story). "Craftsmanship" section with video detail.
4. VIBE: Old Money, Italian Leather, Bespoke.
5. COLOR: #121212 (Bg - Rich Black), #d4af37 (Gold Foil), #f5f5f5 (Text).', 'Style 3 - Luxury Heritage (Classic)' FROM ind;

-- 4. AUTOMOTRIZ (Automotive)
-- Trends: Bento/Technical, Raw Speed, Minimal Gallery
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: BENTO_BLUEPRINT_TECH.
1. NAVBAR: Technical data scrolling. Monospace font.
2. HERO: Wireframe 3D model of car rotating. Blueprint grid background.
3. CONTENT: Bento Grid showing "Engine", "Aerodynamics", "Speed". Numbers counting up.
4. VIBE: Engineering, German Precision, F1 Factory.
5. COLOR: #002b5c (Blueprint Blue), #ffffff (Lines), #ff3333 (Accent - Warning).', 'Style 1 - Engineering Blueprints (Technical Bento)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: RAW_SPEED_BLUR.
1. NAVBAR: Slanted/Italic UI. 
2. HERO: Car moving fast (Motion Blur). Camera shake effect on scroll. Font: Wide Extended Sans.
3. CONTENT: "Track Records" section. Video background for "Test Drive" CTA.
4. VIBE: Racing, JDM, Need for Speed.
5. COLOR: #111111 (Asphalt), #e6e6e6 (Smoke), #ccff00 (Accent - Volt).', 'Style 2 - Underground Racing (Raw)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: GALLERY_STUDIO_MINIMAL.
1. NAVBAR: Invisible. 
2. HERO: Car in white cyclorama (Studio Light). Infinite clean floor.
3. CONTENT: Horizontal scroll gallery. Images with ample white space. "Configure" button floating.
4. VIBE: Supercar Dealership, Museum, Art.
5. COLOR: #ffffff (Bg), #eeeeee (Soft Shadows), #000000 (Text Minimal).', 'Style 3 - Gallery Studio (Clean)' FROM ind;

-- IMPORTANT: Ensure Copy and Image prompts exist for these industries to avoid fallback errors.
-- (This part assumes Copy/Image prompts are generic enough or will be refined in Batch 2/3, 
-- but for now we ensure Art Direction is the driver).
