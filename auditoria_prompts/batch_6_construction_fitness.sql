-- =============================================================================
-- BATCH 6: CONSTRUCCIÓN & FITNESS (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================

-- 31. Master Builder (Construcción - High End Residential)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Architectural Luxury" with "Swiss Minimal" layout.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Master Builder"
KEYWORDS: Architect, Stone, Wood, Scale, Perfection.
LIGHTING: Natural, texture focused (shadows on materials).
COLOR STRATEGY: Neutral, Earth, Stone Grey.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Proud, Solid, Artisan.
AVOID: "We build houses".
USE: "Crafting legacy", "Structure", "Vision".

-- HERO CONTENT:
HEADLINE: "BUILT TO LAST.", "VISION REALIZED."
SUBHEADLINE: Focus on custom homes/projects.

-- SECTIONS:
1. **The Portfolio:** Hero project shots.
2. **The Process:** From blueprint to key.
3. **The Materials:** Quality focus.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Construction details (clean), blueprints, finished high-end interiors.
'
WHERE description LIKE '%Master Builder%';

-- 32. TechBuild (Construcción - Commercial/Engineering)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Brutalist Grid" works perfectly.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "TechBuild"
KEYWORDS: Steel, Beam, Crane, Height, City.
LIGHTING: High contrast, harsh sun on steel.
COLOR STRATEGY: Industrial. Yellow/Orange safety colors + Concrete Grey.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Capable, Big Scale, Efficient.
AVOID: Residential softness.
USE: "Infrastructure", "Scale", "Engineering".

-- HERO CONTENT:
HEADLINE: "SHAPING THE SKYLINE.", "INFRASTRUCTURE."

-- SECTIONS:
1. **The Projects:** Skyscrapers/Bridges.
2. **The Capacity:** Fleet/Equipment stats.
3. **The Safety:** Certificates.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Cranes, welders sparks, drone shots of sites.
'
WHERE description LIKE '%TechBuild%';

-- 33. Heritage Craftsman (Construcción - Renovation/Artisan)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Fluid Magazine" or "Tuscan Warmth" logic.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Heritage Craftsman"
KEYWORDS: Restore, Wood, Soul, Hand, History.
LIGHTING: Dust motes in light, warm workshop.
COLOR STRATEGY: Wood tones, deep varnish colors.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Respectful, Patient, Skilled.
AVOID: "Fast repairs".
USE: "Restoration", "Respect for the past", "Detail".

-- HERO CONTENT:
HEADLINE: "HONOR THE PAST.", "HAND CRAFTED."

-- SECTIONS:
1. **The Transformation:** Before/After slider.
2. **The Workshop:** Tools and hands.
3. **The Story:** History of the craft.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Close up of chisels, sawdust, restored vintage details.
'
WHERE description LIKE '%Heritage Craftsman%';

-- 34. Transformation Energy (Fitness - Crossfit/High Intensity)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Snap & Punch" motion is mandatory.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Transformation Energy"
KEYWORDS: Sweat, Reps, Grind, Power, Community.
LIGHTING: Gym neon, harsh shadows, sweat glisten.
COLOR STRATEGY: Black + Volt Green/Red/Orange.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Loud, Motivating, Tough love.
AVOID: "Gentle exercise".
USE: "Push limits", "Grind", "Result".

-- HERO CONTENT:
HEADLINE: "EARN YOUR BODY.", "NO SHORTCUTS."

-- SECTIONS:
1. **The WOD:** Workout of the day.
2. **The Tribe:** Group photos (community).
3. **The Results:** Transformation photos.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Weights dropping, chalk dust, faces in effort grimace.
'
WHERE description LIKE '%Transformation Energy%';

-- 35. Wellness Sanctuary (Fitness - Yoga/Pilates)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Liquid Flow" motion logic.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Wellness Sanctuary"
KEYWORDS: Flow, Stretch, Light, Air, Core.
LIGHTING: Morning sun, airy studio.
COLOR STRATEGY: Pastels. Peach, Sage, Sky.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Soft, Encouraging, Mindful.
AVOID: Aggressive fitness terms.
USE: "Flow", "Connect", "Strengthen".

-- HERO CONTENT:
HEADLINE: "MOVE WITH INTENTION.", "FIND FLOW."

-- SECTIONS:
1. **The Practice:** Class types.
2. **The Studio:** Space vibe.
3. **The Teachers:** Calm portraits.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Stretching silhouettes, beautiful mats/props, plants in studio.
'
WHERE description LIKE '%Wellness Sanctuary%';

-- 36. Performance Lab (Fitness - Science/Athletics)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Tech Glitch" or "Swiss Minimal".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Performance Lab"
KEYWORDS: Data, VO2, Metrics, Optimize, Biohack.
LIGHTING: Clinical sport lab, blue light.
COLOR STRATEGY: White, Grey, Carbon Fiber texture.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Scientific, Precision, Elite.
AVOID: "Just sweat".
USE: "Optimize performance", "Data driven", "Recovery".

-- HERO CONTENT:
HEADLINE: "OPTIMIZE HUMAN POTENTIAL.", "ENGINEER YOUR BODY."

-- SECTIONS:
1. **The Data:** Human metrics focus.
2. **The Tech:** Equipment (cryo, sensors).
3. **The Protocol:** Training methodology.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Runners on treadmills with sensors, data overlays, ice baths.
'
WHERE description LIKE '%Performance Lab%';
