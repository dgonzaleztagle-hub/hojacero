-- =================================================================================================
-- GOLD MASTER SEEDING: HOJACERO PREMIUM PROMPTS (ALL INDUSTRIES)
-- ARCHITECTURE: HIGH DENSITY PREMIUM + AWWWARDS TRENDS 2026
-- =================================================================================================

-- 1. CLEANUP (The "Swipe")
-- Remove all existing prompts to avoid mixing Legacy Basic prompts with New Premium ones.
DELETE FROM demo_prompts;

-- Reset Sequence if needed (optional, keeping IDs clean)
-- ALTER SEQUENCE demo_prompts_id_seq RESTART WITH 1;

-- =================================================================================================
-- BATCH 1: LIFESTYLE & EXPERIENCE
-- =================================================================================================

-- GASTRONOMÍA
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

-- TURISMO
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

-- MODA
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

-- AUTOMOTRIZ
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


-- =================================================================================================
-- BATCH 2: CORPORATE & PROFESSIONAL
-- =================================================================================================

-- LEGAL
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

-- REAL ESTATE
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

-- TECH
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

-- CONSULTORÍA
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


-- =================================================================================================
-- BATCH 3: SERVICE & CARE
-- =================================================================================================

-- SALUD
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

-- EDUCACIÓN
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

-- CONSTRUCCIÓN
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

-- FITNESS
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

-- VERIFICATION
SELECT count(*) as total_premium_prompts FROM demo_prompts;
