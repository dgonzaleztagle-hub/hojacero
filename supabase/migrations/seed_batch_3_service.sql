-- =================================================================================================
-- BATCH 3: SERVICE & CARE (Health, Education, Construction, Fitness)
-- ARCHITECTURE: HIGH DENSITY PREMIUM + AWWWARDS TRENDS 2026
-- =================================================================================================

-- 1. SALUD (Health & Aesthetic)
-- Trends: Organic Soft, Swiss Clean, Dark Luxury (Derma)
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'salud')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ORGANIC_SOFT_WELLNESS.
1. NAVBAR: Translucent blur. Rounded pills.
2. HERO: Soft focus video of water/leaves or skin texture. No hard lines.
3. CONTENT: "Treatments" carousel with floating rounded cards. Wave dividers (SVG).
4. VIBE: Spa, Dermatology, Calm, Trust.
5. COLOR: #f8f5f2 (Warm White), #8ebf8e (Sage), #d4a373 (Soft Earth).', 'Style 1 - Organic Spa (Soft/Calm)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: SWISS_CLINICAL_CLEAN.
1. NAVBAR: White solid. Blue logo.
2. HERO: Split screen. Doctor/Tech on right (Crisp lighting). "PRECISION MEDICINE" on left.
3. CONTENT: Bento Grid of technology/machines. "Patient Portal" prominent block.
4. VIBE: Dental Clinic, High-Tech Surgery, Lab.
5. COLOR: #ffffff (Bg), #0050ff (Science Blue), #f0f0f0 (Grey).', 'Style 2 - Future Clinical (Swiss/Tech)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: DARK_LUXURY_DERMA.
1. NAVBAR: Black. Gold Serif font.
2. HERO: High contrast B&W portrait with gold foil overlay text. "TIMELESS BEAUTY".
3. CONTENT: Minimal list of procedures using Roman Numerals (I, II, III).
4. VIBE: Plastic Surgery, Exclusive Aesthetic Center.
5. COLOR: #0a0a0a (Bg), #d4af37 (Gold), #ffffff (Text).', 'Style 3 - Luxury Derma (Dark/Exclusive)' FROM ind;

-- 2. EDUCACIÓN (Education)
-- Trends: Institutional (Ivy), Vibrant (EdTech), Cinematic (Mentor)
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: NEO_ACADEMY_VIBRANT.
1. NAVBAR: Floating dynamic bar.
2. HERO: 3D abstract shapes floating. Headline: "LEARN THE FUTURE". Inter font.
3. CONTENT: "Curriculum" timeline with progress bars. "Success Stories" video bubbles.
4. VIBE: Coding Bootcamp, Design School, EdTech.
5. COLOR: #111111 (Bg), #7928ca (Purple), #ff0080 (Pink). Dark Mode.', 'Style 1 - Future Academy (Vibrant/Dark)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: IVY_LEAGUE_CLASSIC.
1. NAVBAR: Cream background. Serif Logo centered.
2. HERO: Campus photography (Architecture). Serif Headline: "Tradition of Excellence".
3. CONTENT: 3-Column text grid (Newspaper style). "Faculty" portraits in grayscale.
4. VIBE: University, Law School, Traditional Conservatory.
5. COLOR: #fdfbf7 (Paper), #002147 (Oxford Blue), #85754d (Bronze).', 'Style 2 - Ivy League (Classic/Serif)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: CINEMATIC_MASTERCLASS.
1. NAVBAR: Hidden.
2. HERO: Close-up of Mentor talking (Video Loop). "MASTER YOUR CRAFT".
3. CONTENT: Scrollytelling chapters. Dark background. Focus on the person.
4. VIBE: Personal Brand, High-Ticket Course, Coaching.
5. COLOR: #000000 (Bg), #ffffff (Text), #ff4d00 (Accent - Focus).', 'Style 3 - The Mentor (Cinematic)' FROM ind;

-- 3. CONSTRUCCIÓN (Construction)
-- Trends: Industrial Scale, Blueprint, Sustainable
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: HEAVY_INDUSTRY_SCALE.
1. NAVBAR: Safety Yellow bar. Stencil font.
2. HERO: Massive machinery or building low-angle shot. "BUILDING GIANTS".
3. CONTENT: Big bold numbers (Stats). Project Gallery with heavy black borders.
4. VIBE: Civil Engineering, Heavy Machinery, Logistics.
5. COLOR: #fca311 (Safety Yellow), #14213d (Navy), #000000 (Text).', 'Style 1 - Heavy Metal (Industrial/Scale)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: BLUEPRINT_TECHNICAL.
1. NAVBAR: Grid lines background. Monospace font.
2. HERO: CAD drawing animating into real photo. "PRECISION ENGINEERING".
3. CONTENT: "Specs" table. Technical icons (Vector style).
4. VIBE: Architecture Firm, Structural Engineer.
5. COLOR: #003366 (Blueprint), #ffffff (Lines), #faeb00 (Accent).', 'Style 2 - Blueprint Tech (Linear)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ECO_SUSTAINABLE.
1. NAVBAR: Wood texture or warm grey.
2. HERO: Sunlight, wood, plants. "LIVING ARCHITECTURE".
3. CONTENT: Soft masonry grid. "Materials" section (Stone, Wood, Glass samples).
4. VIBE: Sustainable Building, Landscape Design, Eco-Resort.
5. COLOR: #e3e3e3 (Stone), #5c7c58 (Green), #8d6e63 (Wood).', 'Style 3 - Eco Build (Organic/Material)' FROM ind;

-- 4. FITNESS (Refinement)
-- Incorporating the 360 Sports success + variations
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: DARK_MODE_FUTURISM (NEON SWEAT).
1. NAVBAR: Black. Volt Green (#ccff00) accents. "JOIN NOW" skewed button.
2. HERO: Dark Gym Atmosphere (Fog/Neon). "YOUR BODY IS THE MACHINE". Massive Sans Condensed.
3. CONTENT: "Programs" Marquee (Scrolling text). Glitch effect cards.
4. VIBE: 360 Sports, High Performance, Night Club Gym.
5. COLOR: #050505 (Bg), #ccff00 (Volt), #ffffff (Text).', 'Style 1 - Neon Sweat (High Energy)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: ZEN_SANCTUARY_MINIMAL.
1. NAVBAR: Minimal. Centered serif logo.
2. HERO: Soft light, person stretching. "FIND YOUR CENTER". Serif Display font.
3. CONTENT: Lots of whitespace. "Classes" simple list. Rounded images.
4. VIBE: Pilates, Yoga Studio, Mindfulness.
5. COLOR: #f7f3e8 (Cream), #7a7a7a (Grey), #b5aa9d (Sand).', 'Style 2 - Zen Flow (Soft/Balance)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: RAW_CONCRETE_GRUNGE.
1. NAVBAR: Distressed texture. Uppercase bold.
2. HERO: B&W grainy video of lifting. "UNAPOLOGETIC STRENGTH". Stencil font.
3. CONTENT: Rough borders. Spray paint effects. "WOD" section.
4. VIBE: CrossFit Box, Powerlifting, Garage Gym.
5. COLOR: #222222 (Concrete), #ffffff (Chalk), #ff3333 (Red Marker).', 'Style 3 - Raw Power (Grunge/Street)' FROM ind;
