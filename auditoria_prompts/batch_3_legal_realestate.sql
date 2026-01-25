-- =============================================================================
-- BATCH 3: LEGAL & REAL ESTATE (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================

-- 13. Swiss Authority (Legal - Corporate/Big Firm)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" is natural, but "Brutalist Grid" adds power.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Swiss Authority"
KEYWORDS: Order, Structure, Stability, Global, Power.
LIGHTING: Even, bright office daylight, clean shadows.
COLOR STRATEGY: Corporate Cold (Navy, Steel) or Deep Earth (if firm is legacy).

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Professional, concise, unshakeable.
AVOID: Emotional pleading, "Please hire us".
USE: "Results", "Strategy", "Global".

-- HERO CONTENT:
HEADLINE: Authority statement. "DEFINING THE LAW.", "GLOBAL REACH."
SUBHEADLINE: Years of experience / Billions in transactions.

-- SECTIONS:
1. **The Firm:** Mission statement.
2. **Practice Areas:** clean list or grid.
3. **The Partners:** Professional headshots.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Skyscrapers, glass facades, abstract geometry of books/columns.
'
WHERE description LIKE '%Swiss Authority%';

-- 14. Legal Drama (Legal - Litigation/Criminal)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" with high contrast is epic here.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Legal Drama"
KEYWORDS: Fight, Protect, Win, Storm, Shield.
LIGHTING: High contrast, dramatic "noir" lighting (like a TV show poster).
COLOR STRATEGY: Black & White + Red accent, or Midnight Blue.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Aggressive (controlled), Protective, Winner.
AVOID: Passive voice.
USE: "We fight", "You win", "Protected".

-- HERO CONTENT:
HEADLINE: Conflict resolution. "WHEN IT MATTERS.", "YOUR DEFENSE."
SUBHEADLINE: Track record of wins.

-- SECTIONS:
1. **The Fight:** Why you need us.
2. **The Wins:** Case studies (anonymous).
3. **The Attorney:** Hero shot looking at camera.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Gavel (abstract), storm clouds clearing, focus on eyes/hands.
'
WHERE description LIKE '%Legal Drama%';

-- 15. TechLaw (Legal - IP/Startups)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Tech Glitch" motion fits perfectly.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "TechLaw"
KEYWORDS: Future, Code, Protect, Innovate, Fast.
LIGHTING: Screen glow, neon accents, digital bokeh.
COLOR STRATEGY: Dark mode with digital accents (Purple, Cyan).

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Smart, Fast, modern.
AVOID: Legalese, old latin terms.
USE: "Scale", "IP", "Protect your code".

-- HERO CONTENT:
HEADLINE: "PROTECT YOUR SCALE.", "LEGALLY INNOVATIVE."

-- SECTIONS:
1. **The Stack:** Legal services for tech.
2. **The Clients:** Logos of startups.
3. **The Speed:** Process explanation (Sprint based).

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: abstract data flows, modern offices, code on screen.
'
WHERE description LIKE '%TechLaw%';

-- 16. Architectural Luxury (Real Estate - High End)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" is mandatory candidate.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Architectural Luxury"
KEYWORDS: Space, Light, Material, View, Elite.
LIGHTING: Golden hour interior, Architectural digest style.
COLOR STRATEGY: Minimal. White, Stone, Black.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Curator of life, Quiet, Expensive.
AVOID: "3 Bed 2 Bath", "Cheap".
USE: "Residence", "Estate", "Lifestyle".

-- HERO CONTENT:
HEADLINE: "LIVING ART.", "THE VIEW."
SUBHEADLINE: Address or exclusive claim.

-- SECTIONS:
1. **The Residence:** Hero property tour.
2. **The Details:** Materials focus.
3. **The Agent:** Lifestyle portrait.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Wide angles of living rooms, close up of marble, infinity pools.
'
WHERE description LIKE '%Architectural Luxury%';

-- 17. Interactive Map (Real Estate - Area Focus/Developer)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Fluid Magazine" works well.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Interactive Map"
KEYWORDS: Location, Connection, Growth, Hub, Future.
LIGHTING: Aerial views, sunny city.
COLOR STRATEGY: Urban palette. Map colors (Blue, Green, Grey).

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Visionary, Connected, Informative.
AVOID: Boring specs.
USE: "Heart of the city", "Connected", "Growth".

-- HERO CONTENT:
HEADLINE: "CENTER OF EVERYTHING.", "YOUR CITY."

-- SECTIONS:
1. **The Location:** Map visualization focus.
2. **The Lifestyle:** Nearby amenities.
3. **The Projects:** Building renders.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Drone shots looking down, city skylines, happy people in parks.
'
WHERE description LIKE '%Interactive Map%';

-- 18. Investment Dashboard (Real Estate - Commercial/B2B)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" or "Brutalist Grid".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Investment Dashboard"
KEYWORDS: Yield, Data, Growth, Solid, ROI.
LIGHTING: Clean studio, flat lighting.
COLOR STRATEGY: Data colors. White background, precise accent colors.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Analytical, Direct, No-nonsense.
AVOID: Fluff.
USE: "ROI", "Yield", "Capital".

-- HERO CONTENT:
HEADLINE: "SMART CAPITAL.", "BUILD WEALTH."

-- SECTIONS:
1. **The Numbers:** Key metrics visualization.
2. **The Opportunity:** Why invest now.
3. **The Track Record:** Past success.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Abstract skyscrapers, charts/graphs, handshake (modern).
'
WHERE description LIKE '%Investment Dashboard%';
