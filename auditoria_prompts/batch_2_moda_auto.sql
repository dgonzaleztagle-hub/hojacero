-- =============================================================================
-- BATCH 2: MODA & AUTOMOTRIZ (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================

-- 7. Runway Editorial (Moda - High Fashion/Minimal)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Asimetría Radical" or "Fluid Magazine" fit perfectly.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Runway Editorial"
KEYWORDS: Vogue, Space, Attitude, Fabric, Detail.
LIGHTING: High-key studio or Avant-garde shadows.
COLOR STRATEGY: Neutral canvas (White/Stone/Black) to let clothes pop.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Cool, Distant, Knowing.
AVOID: "Shop now", "Best quality".
USE: "Collection", "Drop", "Concept".

-- HERO CONTENT:
HEADLINE: Season or Concept. "FW25.", "NOIR."
SUBHEADLINE: Minimal description.

-- SECTIONS:
1. **The Look:** Hero video/image full heigth.
2. **The Pieces:** Curated selection (not a grid of products).
3. **The Mood:** Lifestyle/editorial shots.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Models looking away, detail of fabrics, motion blur.
'
WHERE description LIKE '%Runway Editorial%';

-- 8. Lifestyle Brand (Moda - Access/Commercial)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Lifestyle Brand"
KEYWORDS: Life, Sun, Friends, Movement, Authenticity.
LIGHTING: Natural, Golden hour, Candid.
COLOR STRATEGY: Warm, vibrant, happy.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Friendly, Inspiratonal, Inclusive.
AVOID: Cold fashion terms.
USE: "Live", "Experience", "Together".

-- HERO CONTENT:
HEADLINE: Verb or Feeling. "LIVE LOUD.", "MOVE FREELY."
SUBHEADLINE: Value proposition for daily life.

-- SECTIONS:
1. **The Life:** People using the product.
2. **The Essentials:** Best sellers.
3. **The Community:** User generated content style.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Groups of people laughing, product in real messy life scenarios.
'
WHERE description LIKE '%Lifestyle Brand%';

-- 9. Streetwear Drop (Moda - Urban/Hype)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Brutalist Grid" or "Chaos Collage" highly recommended.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Streetwear Drop"
KEYWORDS: Concrete, Hype, Limited, Raw, Underground.
LIGHTING: Flash photography, night street, harsh.
COLOR STRATEGY: Black, White, Red, Neon Green. High contrast.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Aggressive, Short, Slang (optional).
AVOID: Polished corporate language.
USE: "DROP 001", "SOLD OUT", "LIMITED".

-- HERO CONTENT:
HEADLINE: Impact. "CHAOS.", "SYSTEM FAILURE."
SUBHEADLINE: Date or countdown.

-- SECTIONS:
1. **The Drop:** Countdown/Timer.
2. **The Gear:** Product shots on raw backgrounds (concrete).
3. **The Lookbook:** Street style.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Fish-eye lens, grain, disposable camera aesthetic.
'
WHERE description LIKE '%Streetwear Drop%';

-- 10. Performance Theatre (Automotriz - Sports/Tuning)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" with "Snap & Punch" motion.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Performance Theatre"
KEYWORDS: Speed, Metal, Adrenaline, Engineering, Sound.
LIGHTING: Garage lights, neon reflections, motion blur streaks.
COLOR STRATEGY: Metallic greys, Dark blues + Signal Red/Yellow.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Technical, Passionate, Intense.
AVOID: "We fix cars".
USE: "Precision", "Performance", "Unleash".

-- HERO CONTENT:
HEADLINE: Power statement. "PURE ADRENALINE.", "PRECISION ENGINEERED."
SUBHEADLINE: Focus on results/upgrades.

-- SECTIONS:
1. **The Machine:** Hero car shot.
2. **The Specs:** Technical data visualized.
3. **The Garage:** Workshop hygiene shots.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Close-ups of engines, wheels spinning, reflections on paint.
'
WHERE description LIKE '%Performance Theatre%';

-- 11. Trusted Dealer (Automotriz - Family/Sales)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" for trust.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Trusted Dealer"
KEYWORDS: Trust, Family, Journey, Safety, Choice.
LIGHTING: Bright, clean, sunny dealership.
COLOR STRATEGY: Trust Blue, White, Clean Grey.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Helping hand, Honest, Direct.
AVOID: "Used cars for cheap".
USE: "Certified", "Partner", "Your next journey".

-- HERO CONTENT:
HEADLINE: Trust statement. "DRIVE WITH CONFIDENCE.", "YOUR PARTNER."

-- SECTIONS:
1. **The Selection:** Featured inventory.
2. **The Promise:** Warranty/Service guarantee.
3. **The Team:** Smiling agents.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Keys being handed over, families smiling in cars, clean showroom.
'
WHERE description LIKE '%Trusted Dealer%';

-- 12. Collector Gallery (Automotriz - Luxury/Classic)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Liquid Flow" motion logic.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Collector Gallery"
KEYWORDS: History, Curve, Shine, Investment, Art.
LIGHTING: Museum lighting, softbox, highlighting curves.
COLOR STRATEGY: Dark warmth (mahogany, leather), Gold accents.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Curator, Historian, Respectful.
AVOID: Price focused copy.
USE: "Legacy", "Timeless", "Masterpiece".

-- HERO CONTENT:
HEADLINE: "TIMELESS.", "THE COLLECTION."

-- SECTIONS:
1. **The Masterpiece:** Hero car of the month.
2. **The History:** Story of a restoration.
3. **The Inventory:** Gallery grid.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Details of leather seats, analog clusters, chrome badges.
'
WHERE description LIKE '%Collector Gallery%';
