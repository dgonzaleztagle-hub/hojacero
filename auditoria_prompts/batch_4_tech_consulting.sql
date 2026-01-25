-- =============================================================================
-- BATCH 4: TECH & CONSULTORÍA (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================

-- 19. Product-Led Growth (Tech - SaaS/App)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" or "Tech Glitch" work well for Product.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Product-Led Growth"
KEYWORDS: UX, Clean, Efficient, Scale, Tool.
LIGHTING: Soft app shadows (Stripe style) or dark mode neon.
COLOR STRATEGY: Primary brand color + lots of whitespace/darkspace.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Helpful, Smart, User-centric.
AVOID: Buzzwords without meaning.
USE: "Start building", "Scale fast", "Integrate".

-- HERO CONTENT:
HEADLINE: Problem -> Solution. "MANAGE LESS. BUILD MORE."
SUBHEADLINE: Clear value prop.

-- SECTIONS:
1. **The Product:** UI shots / Dashboard views (BentoGrid).
2. **The Features:** Icon + Text.
3. **The Proof:** Logos/Testimonials.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Abstract UI mockups, floating glass elements, glowing cursors.
'
WHERE description LIKE '%Product-Led Growth%';

-- 20. Developer First (Tech - API/DevTools)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Brutalist Grid" or "Tech Glitch" highly recommended.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Developer First"
KEYWORDS: Code, Terminal, Speed, Docs, Open Source.
LIGHTING: Screen glow, CRT effects, Matrix green/amber.
COLOR STRATEGY: Dark Mode mandatory (unless Creative Director forces "Acid").

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Technical, Geeky, Direct.
AVOID: Marketing fluff.
USE: `npm install`, "API Reference", "Latency".

-- HERO CONTENT:
HEADLINE: "BUILT FOR DEVS.", "SHIP FASTER."
SUBHEADLINE: Single command line installation.

-- SECTIONS:
1. **The Code:** Syntax highlighted snippet.
2. **The Docs:** Interactive API explorer.
3. **The Community:** GitHub stars/contributors.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Code blocks, terminal windows, abstract network nodes.
'
WHERE description LIKE '%Developer First%';

-- 21. Enterprise Trust (Tech - B2B/Security)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" or "Solid Ground".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Enterprise Trust"
KEYWORDS: Shield, Global, Infrastructure, Compliance, Sleep.
LIGHTING: Corporate blue light, server room aesthetic.
COLOR STRATEGY: Deep Blue, Steel Grey, White.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Serious, Capable, Compliance-ready.
AVOID: "Move fast and break things".
USE: "Secure", "Compliant", "Infrastructure".

-- HERO CONTENT:
HEADLINE: "SECURE AT SCALE.", "ENTERPRISE GRADE."

-- SECTIONS:
1. **The Solution:** Architecture diagram.
2. **The Compliance:** ISO/SOC2 badges.
3. **The Contact:** Sales form focused.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Server racks, padlocks (abstract), globe connections.
'
WHERE description LIKE '%Enterprise Trust%';

-- 22. Transformation Story (Consultoría - Strategy/Change)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" (story focused).

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Transformation Story"
KEYWORDS: Change, Future, Path, Growth, Human.
LIGHTING: Sunrise, paths, bridges, light at end of tunnel.
COLOR STRATEGY: Optimistic but grounded.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Visionary, Coach-like.
AVOID: "We define strategies".
USE: "Transform", "Navigate", "Future-proof".

-- HERO CONTENT:
HEADLINE: "NAVIGATE THE SHIFT.", "FUTURE READY."

-- SECTIONS:
1. **The Challenge:** Before state.
2. **The Path:** Methodology visualization.
3. **The Result:** Success metrics.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Metaphors (bridges, lighthouses), team working on whiteboard.
'
WHERE description LIKE '%Transformation Story%';

-- 23. Workshop Energy (Consultoría - Training/Agile)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Chaos Collage" (post-its vibe) or "Fluid Magazine".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Workshop Energy"
KEYWORDS: Action, Team, Sprint, sticky-notes, Motion.
LIGHTING: Bright office, candid movement.
COLOR STRATEGY: Primary colors (Red, Yellow, Blue) like markers.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Energetic, Action-oriented.
AVOID: Theoretical academic talk.
USE: "Sprint", "Do", "Create".

-- HERO CONTENT:
HEADLINE: "BUILD TOGETHER.", "UNLOCK POTENTIAL."

-- SECTIONS:
1. **The Process:** Hands-on photos.
2. **The Output:** Real prototypes/results.
3. **The Vibe:** Video of workshop session.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Post-its, whiteboards, people pointing, high energy groups.
'
WHERE description LIKE '%Workshop Energy%';

-- 24. Thought Leader (Consultoría - Personal Brand)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "The Diplomat" typo pairing is classic here, but "Disruptor" works too.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Thought Leader"
KEYWORDS: Wisdom, Face, Book, Stage, Voice.
LIGHTING: Portrait studio, stage spotlight.
COLOR STRATEGY: Personal branding colors. Focus on the person.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: First person ("I"), Authoritative, provocative.
AVOID: Generic agency "We".
USE: "My vision", "The method".

-- HERO CONTENT:
HEADLINE: Name or Manifesto. "RETHINK [INDUSTRY].", "JANE DOE."

-- SECTIONS:
1. **The Idea:** Core philosophy.
2. **The Proof:** Books/Keynotes.
3. **The Access:** How to hire/book.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: High quality portrait looking at camera, speaking on stage, book cover.
'
WHERE description LIKE '%Thought Leader%';
