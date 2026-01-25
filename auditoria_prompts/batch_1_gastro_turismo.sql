-- =============================================================================
-- BATCH 1: GASTRONOMÍA & TURISMO (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================
-- Core Directive: These prompts now delegate visual decisions to 'creative-director-h0' skill.
-- They focus ONLY on Content Strategy, Tone of Voice, and Industry Vibe.
-- =============================================================================

-- 1. Midnight Theatre (Gastronomía - Night/Exclusive)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST. Its principles are LAW.
-- 2. READ "d:\proyectos\hojacero\.agent\skills\creative-director-h0.md".
-- 3. FOLLOW the Layout/Typo/Motion decisions from the Creative Director Skill.
--    (Ignore any specific layout instructions below if they contradict the Skill).

-- =============================================================================
-- ATMOSPHERE & CONCEPT (The "Vibe")
-- =============================================================================
CONCEPT: "Midnight Theatre"
KEYWORDS: Sensual, Dark, Ritual, Exclusive, Fire, Smoke.
LIGHTING: Low-key lighting, dramatic shadows, spotlight effects.
COLOR STRATEGY: Dark Mode Preferred. IF Creative Director allows "Deep Earth", use that base. Avoid bright/neon unless "Color Acidity" is Neon.

-- =============================================================================
-- CONTENT STRATEGY (What to say)
-- =============================================================================
VOICE: Seductive, Whispering, Confident.
AVOID: "Welcome to...", "Best food in...", Generic friendly web copy.
USE: Short sentences. Sensory words (Taste, Burn, Melt, Secret).

-- HERO CONTENT:
HEADLINE: [Invent 2-3 words provocative]. E.g., "AFTER DARK.", "TASTE THE SIN.", "FIRE & SALT."
SUBHEADLINE: 1 sentence about the philosophy of the kitchen.
CTA: "Reserve Table" (Primary) / "The Menu" (Secondary).

-- SECTIONS (Adapt to Creative Director layout):
1. **The Ritual:** Chef philosophy or concept explanation.
2. **The Stars (Menu):** Highlight 3-5 dishes. Focus on ingredients.
3. **The Scene:** Atmosphere shots (interiors, drinks, details).
4. **Social Proof:** Critics quotes or simplified stars.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Macro shots of food, dark environment, hands working. No faces looking at camera.
VIDEO: Slow motion fire, pouring wine, smoke.

-- =============================================================================
-- DATA HANDLING
-- =============================================================================
IF content missing -> DO NOT INVENT fake history. Use aesthetic placeholder: "A story waiting to be told."
IF prices missing -> Hide prices, show menu item names only.
'
WHERE description LIKE '%Midnight Theatre%';

-- 2. Tuscan Warmth (Gastronomía - Rustic/Family/Day)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "d:\proyectos\hojacero\.agent\skills\creative-director-h0.md".
-- 3. OBEY the Random Seeds from Creative Director (Layout, Typo, Motion).

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Tuscan Warmth" (or "Rustic Honest")
KEYWORDS: Sun, Earth, Flour, Handmade, Family, Tradition.
LIGHTING: Natural distinct daylight, warm golden hour.
COLOR STRATEGY: Warm palette. Beiges, Terracottas, Olive Greens.
COMPATIBILITY: Works best with "Fluid Magazine" or "Chaos Collage" layouts.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Warm, Welcoming, Authentic, "Abuela knows best".
AVOID: Corporate speak, "high conceptual" abstraction.
USE: Words like: Home, Craft, Handmade, Slow, Season.

-- HERO CONTENT:
HEADLINE: Warm invitation. E.g., "REAL FOOD.", "FROM THE EARTH.", "SUNDAY EVERY DAY."
SUBHEADLINE: Focus on tradition/origin of ingredients.

-- SECTIONS:
1. **Our Roots:** Origin story (if real status known).
2. **The Table:** Menu highlights.
3. **The Craft:** Process shots (kneading, pouring, picking).

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Messy perfection (flour on table), hands sharing food, sunlight hitting glass.
'
WHERE description LIKE '%Tuscan Warmth%';

-- 3. Avant-Garde Lab (Gastronomía - Experimental/Modern)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "d:\proyectos\hojacero\.agent\skills\creative-director-h0.md".
-- 3. OBEY the Random Seeds from Creative Director.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Avant-Garde Lab"
KEYWORDS: Laboratory, Precision, Science, Art, Minimalism, Shock.
LIGHTING: Clinical, Studio light, High contrast or Flat lay.
COLOR STRATEGY: Monochrome or Acid Accents. "Swiss Minimal" layout fits perfectly.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Cryptic, Minimal, Confident, Artist statment style.
AVOID: Descriptive adjectives (delicious, tasty).
USE: Ingredients list only. Verbs. Concepts.

-- HERO CONTENT:
HEADLINE: Abstract. E.g., "EDIBLE ART.", "EXPERIMENT 01.", "SENSES."

-- SECTIONS:
1. **The Manifesto:** Culinary philosophy.
2. **The Gallery:** Dishes presented as art objects (lots of whitespace).
3. **The Laboratory:** Kitchen shots, tweezers, plating.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Top-down, isolated dishes on colored background, geometry.
'
WHERE description LIKE '%Avant-Garde Lab%';

-- 4. Wanderlust Cinema (Turismo - Adventure/Nature)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" layout highly recommended if allowed.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Wanderlust Cinema"
KEYWORDS: Epic, Vast, Breath, Discovery, Raw Nature.
LIGHTING: Golden hour, Blue hour, Natural drama.
COLOR STRATEGY: Earth tones + Sky/Water tones.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Inspiring, Epic, Call to Adventure.
AVOID: "We offer tours", "Best prices".
USE: "Discover...", "Get lost in...", "Uncharted...".

-- HERO CONTENT:
HEADLINE: Destination or Emotion. "PATAGONIA RAW.", "BREATHE."
SUBHEADLINE: The promise of the experience.

-- SECTIONS:
1. **The Journey:** Itinerary highlights visualized.
2. **The Views:** Fullscreen galleries.
3. **The Guide:** Human connection (guides/locals).

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Human figures small in vast landscapes (scale). Texture of nature.
'
WHERE description LIKE '%Wanderlust Cinema%';

-- 5. Local Insider (Turismo - Urban/Culture)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Fluid Magazine" or "Chaos Collage" fits well.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Local Insider"
KEYWORDS: Hidden gems, Street, Culture, Secret, Real.
LIGHTING: Street photography, harsh sunlight, neon night.
COLOR STRATEGY: Vibrant, Urban, Eclectic.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: "In the know", Cool friend, Casual.
AVOID: Tourist trap language.
USE: "Secret spots", "Local favorite", "Beyond the guide".

-- HERO CONTENT:
HEADLINE: Urban manifesto. "THE REAL CITY.", "UNFILTERED."

-- SECTIONS:
1. **The Map:** Interactive locations.
2. **The Culture:** Food, Art, Music highlights.
3. **The People:** Portraits of locals.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Candid street shots, close-ups of textures (graffiti, food), movement blur.
'
WHERE description LIKE '%Local Insider%';

-- 6. Luxury Escape (Turismo - High End/Hotel)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Liquid Flow" motion is key here.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Luxury Escape"
KEYWORDS: Silence, Service, Texture, Sanctuary, Time.
LIGHTING: Soft, diffused, interior design lighting.
COLOR STRATEGY: Neutrals, Gold, White, Stone.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Polite, Minimal, sophisticated.
AVOID: Loud selling, exclamation marks.
USE: "Sanctuary", "Time", "Space", "Detail".

-- HERO CONTENT:
HEADLINE: One word or two. "SILENCE.", "YOUR SPACE."
SUBHEADLINE: Whisper the value proposition.

-- SECTIONS:
1. **The Sanctuary:** Room/Space details.
2. **The Senses:** Spa/Food details.
3. **The Service:** Concierge/Butlers (if applicable).

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Interior design details (thread count, marble vein), empty peaceful spaces.
'
WHERE description LIKE '%Luxury Escape%';
