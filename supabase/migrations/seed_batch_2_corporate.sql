-- =================================================================================================
-- BATCH 2: CORPORATE & PROFESSIONAL (Legal, Real Estate, Tech, Consulting)
-- ARCHITECTURE: HIGH DENSITY PREMIUM + AWWWARDS TRENDS 2026
-- =================================================================================================

-- 1. LEGAL (Law Firms)
-- Trends: Swiss Style, Bento Grid, Serif Typography
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'legal')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: BENTO_SWISS_STYLE.
1. NAVBAR: Solid Red (#cc0000) or Deep Blue top bar. White text. Helvetica Bold.
2. HERO: Split Screen Grid. Left: "WE WIN". Right: Partners photo (B&W).
3. CONTENT: Bento Grid of practice areas. "Case Results" ticker (Numbers only).
4. VIBE: International Law Firm, Corporate Power, Serious.
5. COLOR: #f4f4f4 (Bg), #111111 (Text), #cc0000 (Accent - Power).', 'Style 1 - The Swiss Authority (Grid/Power)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ACADEMIC_NOIR.
1. NAVBAR: Minimal serif text. Centered.
2. HERO: Texture of old paper/parchment. Typewriter font headline: "CASE FILE: [CLIENT NAME]".
3. CONTENT: Text-heavy layout (Columns). "Investigation" timeline. Signature at footer.
4. VIBE: Private Investigator, Boutique IP Law, Intellectual.
5. COLOR: #fdfbf7 (Cream Paper), #1a1a1a (Ink), #8b0000 (Stamp Red).', 'Style 2 - Intellectual Noir (Narrative)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: MODERN_DEFENDER.
1. NAVBAR: Transparent. Glassmorphism buttons.
2. HERO: Dark video background (City skyline). Silver text gradients.
3. CONTENT: Floating cards with "Success Stories". Interactive "Legal Shield" 3D element.
4. VIBE: Tech Law, Crypto Defense, Modern.
5. COLOR: #0a192f (Deep Navy), #ffffff (Text), #64ffda (Cyan Accent).', 'Style 3 - Modern Defender (Tech/Dark)' FROM ind;

-- 2. REAL ESTATE (Propiedades)
-- Trends: Cinematic Scrollytelling, Brutalism, Organic
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: CINEMATIC_DARK_LUXURY.
1. NAVBAR: Hidden. Menu is a "Hamburger" dot.
2. HERO: Slow pan video of a penthouse at night. Headline: "LIVE ABOVE". Font: Thin Elegant Sans.
3. CONTENT: "Amenities" horizontal scroll. "Floorplans" as interactive SVG lines.
4. VIBE: NYC Penthouse, 5th Avenue, Ultra-Wealth.
5. COLOR: #050505 (Bg), #d4af37 (Gold lines), #ededed (Text).', 'Style 1 - Penthouse Luxury (Dark/Gold)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ORGANIC_ARCHITECTURAL.
1. NAVBAR: White. Clean.
2. HERO: Sunlight hitting a concrete wall (Shadow play). Plant shadows.
3. CONTENT: Masonry grid of textures (Wood, Stone, Glass). "Sustainability" manifesto.
4. VIBE: Tulum Condo, Eco-Living, Nordic Arch.
5. COLOR: #faf9f6 (Off-white), #5d6d7e (Slate), #8d6e63 (Wood).', 'Style 2 - Mediterranean Sunset (Organic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: RAW_MATERIALITY.
1. NAVBAR: Technical dimensions on corners.
2. HERO: Brutalist concrete structure. Big orange bold numbers: "UNIT 404".
3. CONTENT: Technical blueprints as background. "Specs" list in monospace font.
4. VIBE: Industrial Loft, Berlin, Architect Studio.
5. COLOR: #808080 (Concrete), #000000 (Text), #ff6600 (Safety Orange).', 'Style 3 - Brutalist Concrete (Technical)' FROM ind;

-- 3. TECH (SaaS & B2B)
-- Trends: Linear/Glass, Retro, Enterprise
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: SAAS_GLASSMORPHISM.
1. NAVBAR: Floating pill with blur.
2. HERO: Dark mode. Glowing orbs (Aurora gradients). "Glass" cards tilting 3D.
3. CONTENT: Bento Grid of features. "Command Line" block showing API code.
4. VIBE: AI Startup, Linear.app style, Modern SaaS.
5. COLOR: #000000 (Bg), #ffffff (Text), #7928ca to #ff0080 (Gradient).', 'Style 1 - Deep Aurora (Glass/Linear)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: RETRO_DEV_CONSOLE.
1. NAVBAR: "[ SYSTEM_READY ]" blinking.
2. HERO: Phosphor screen effect (Scanlines). Green text on black. ASCII Art logo.
3. CONTENT: "Changelog" timeline. "Install" command block `npm install`.
4. VIBE: Cybersecurity, DevTools, Hacker.
5. COLOR: #0d1117 (Bg), #00ff41 (Matrix Green), #333333 (Dim).', 'Style 2 - Retro Terminal (Dev/Hacker)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ENTERPRISE_SCALE.
1. NAVBAR: White, sticky, shadow. "Enterprise" badge.
2. HERO: Isometric 3D illustration of servers/cloud. "SCALE INFINITELY".
3. CONTENT: Logo wall (Greyscale). 3-Column "Benefits" grid with blue icons.
4. VIBE: IBM, Oracle, Cloud Infrastructure. Trust.
5. COLOR: #ffffff (Bg), #0f62fe (IBM Blue), #161616 (Text).', 'Style 3 - Clean Enterprise (Trust/Scale)' FROM ind;

-- 4. CONSULTORÍA (Consulting)
-- Trends: Data Viz, Human, Typography
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: DARK_DATA_VISUALIZATION.
1. NAVBAR: Minimal.
2. HERO: Animated line graph or particle web background. "DATA DRIVEN DECISIONS".
3. CONTENT: "ROI" Calculator interactive widget. Stats grid (Big numbers).
4. VIBE: Fintech, Big Data, Strategic Consulting.
5. COLOR: #0b0c10 (Bg), #66fcf1 (Cyan Data), #c5c6c7 (Text).', 'Style 1 - Data Abstract (Tech/Analytic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ORGANIC_CORPORATE.
1. NAVBAR: Warm tones. "Meet the Team".
2. HERO: High-quality portrait of people collaborating (Natural light). Serif Headline.
3. CONTENT: "Our Values" circle layout. Testimonial carousel (Video).
4. VIBE: HR Consulting, Leadership Coaching, Human-centric.
5. COLOR: #fdf5e6 (Old Lace), #2c3e50 (Navy), #e67e22 (Warmth).', 'Style 2 - Human Connection (Warm/People)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: KINETIC_BIG_TYPE.
1. NAVBAR: Bold black dividers.
2. HERO: White background. Text fills 90% of screen: "WE FIX BUSINESS".
3. CONTENT: List of services separated by thick lines. Hover turns background yellow.
4. VIBE: Brutalist Strategy, NYC Agency, Direct.
5. COLOR: #ffffff (Bg), #000000 (Text), #ffff00 (Highlight).', 'Style 3 - Bold Strategy (Text/Impact)' FROM ind;
