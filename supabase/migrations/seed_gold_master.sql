-- =================================================================================================
-- GOLD MASTER SEEDING V2.1: HOJACERO INTELLIGENCE + CREATIVE ARSENAL
-- ARCHITECTURE: HIGH DENSITY PREMIUM + DEEP CONTEXT + COMPONENT ORCHESTRATION
-- =================================================================================================

-- 1. CLEANUP (The "Swipe")
DELETE FROM demo_prompts;

-- =================================================================================================
-- BATCH 1: LIFESTYLE & EXPERIENCE
-- =================================================================================================

-- GASTRONOMÍA
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Hallucinate plausible dishes/wines), DEEP_CONTEXT (Infer local history), ASSET_SPECIFICITY (Food must look messy/real).
AVAILABLE_ASSETS: 
- BentoGrid (import { BentoGrid, BentoGridItem } from "@/components/premium/BentoGrid") - Use for Menu Highlights.
- TextGenerateEffect (import { TextGenerateEffect } from "@/components/premium/TextGenerate") - Use for Chef Manifesto.
- InfiniteMovingCards (import { InfiniteMovingCards } from "@/components/premium/InfiniteMovingCards") - Use for "Press/Reviews".

LAYOUT_INSTRUCTION: AWWWARDS_DARK_FUTURISM.
1. NAVBAR: Transparent. Centered Logo. Micro-interaction "Book Table" button (Outline).
2. HERO: Cinematic Video Loop (Slow motion flame/chef). Headline: "TASTE THE NIGHT". Font: Inter Display (Thin & Wide).
3. CONTENT: "Midnight Menu" section using <BentoGrid>. "The Experience" (Horizontal Scroll of textures).
4. VIBE: Speakeasy, Michelin Star, Dangerous/Sexy.
5. COLOR: #050505 (Bg), #1a1a1a (Cards), #ff4d00 (Accent - Ember).', 'Style 1 - Midnight Chef (Dark Atmosphere)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent specific menu items), DEEP_CONTEXT (Infer chef personality), ASSET_SPECIFICITY (Food must look real).
AVAILABLE_ASSETS:
- VelocityScroll (import { VelocityScroll } from "@/components/premium/VelocityScroll") - Use for "FRESH / LOCAL / WILD" marquee.
- 3DCard (import { CardContainer, CardBody, CardItem } from "@/components/premium/3DCard") - Use for featured dish.

LAYOUT_INSTRUCTION: KINETIC_TYPOGRAPHY_MENU.
1. NAVBAR: Minimal. Logo Left. "Order Online" Pill Button.
2. HERO: NO IMAGE. Massive <VelocityScroll> text: "FRESH / LOCAL / WILD". Font: OGG or Playfair Display (Italic).
3. CONTENT: The Menu IS the UI. Giant list of dishes with hover-reveal images (Cursor follows mouse with food photo). 
4. VIBE: Modern Bistro, Hipster, Wine Bar.
5. COLOR: #f4f1ea (Bg - Cream), #1a1a1a (Text), #d44d5c (Accent - Wine).', 'Style 2 - The Typographic Menu (Kinetic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Hallucinate ingredient origins), DEEP_CONTEXT (Infer farm-to-table story), ASSET_SPECIFICITY (Macro textures).
AVAILABLE_ASSETS:
- BentoGrid (import { BentoGrid, BentoGridItem } from "@/components/premium/BentoGrid") - Use for Ingredients Showcase.
- TextGenerateEffect (import { TextGenerateEffect } from "@/components/premium/TextGenerate") - Use for "From Soil to Plate" text.

LAYOUT_INSTRUCTION: ORGANIC_SCANDINAVIAN.
1. NAVBAR: Clean White. Logo Black. 
2. HERO: Split Screen. Left: Macro shot of Ingredient (Texture). Right: Storytelling text <TextGenerateEffect> "From Soil to Plate".
3. CONTENT: <BentoGrid> of ingredients/producers. "Reserve" section floating over parallax image.
4. VIBE: Noma style, Farm-to-table, Pure.
5. COLOR: #ffffff (Bg), #2b2b2b (Text), #8a9a5b (Accent - Moss Green).', 'Style 3 - Nordic Pure (Minimal)' FROM ind;

-- TURISMO
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent specific tours/packages), DEEP_CONTEXT (Infer location vibes), ASSET_SPECIFICITY (Drone shots).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for "ESCAPE REALITY".
- InfiniteMovingCards - Use for "Guest Experiences".

LAYOUT_INSTRUCTION: IMMERSIVE_SCROLLYTELLING.
1. NAVBAR: Hidden until scroll up.
2. HERO: Full-screen drone shot (Paradise). Text fades in: <TextGenerateEffect words="ESCAPE REALITY" />.
3. CONTENT: Sections overlap with Parallax. "The Villa" (Sticky side text, scrolling images). "Experiences" (Horizontal Drag).
4. VIBE: Luxury Resort, Maldives, Private Island.
5. COLOR: #001f3f (Deep Ocean), #f0f0f0 (Text), #c5a059 (Accent - Gold Sand).', 'Style 1 - The Journey (Scrollytelling)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent specific trails/animals), DEEP_CONTEXT (Infer eco-values), ASSET_SPECIFICITY (Paper textures).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Expeditions".
- 3DCard - Use for "Package Details".

LAYOUT_INSTRUCTION: ORGANIC_ADVENTURE.
1. NAVBAR: Blur glass effect. Logo: Rough/Handwritten style.
2. HERO: Image with "Paper Tear" edge effect. Headline: "WILD HEARTS". Font: Rough Cordilla.
3. CONTENT: Masonry Grid of Polaroid-style photos (<BentoGrid> adapted). Map section with animated path.
4. VIBE: Patagonia, Tulum, Eco-Lodge.
5. COLOR: #2d3e2d (Jungle Green), #e8e4d9 (Paper), #d65a31 (Accent - Clay).', 'Style 2 - Jungle Explorer (Organic/Texture)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent room names/amenities), DEEP_CONTEXT (Infer city nightlife), ASSET_SPECIFICITY (Night photography).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "THE CITY NEVER SLEEPS".
- BentoGrid - Use for "Penthouse Suite Features".

LAYOUT_INSTRUCTION: URBAN_LUX_DARK.
1. NAVBAR: Black Glossy Bar. Silver Logo.
2. HERO: Night cityscape time-lapse. <VelocityScroll text="THE CITY NEVER SLEEPS" />.
3. CONTENT: <BentoGrid> of Rooms and Amenities. "Concierge" Chat bubble fixed.
4. VIBE: New York Penthouse, Tokyo Hotel.
5. COLOR: #000000 (Bg), #ededed (Text), #333333 (Grid Lines), #00ff99 (Accent - Cyber).', 'Style 3 - Urban Luxury (Dark City)' FROM ind;

-- MODA
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent collection names like "FW26"), DEEP_CONTEXT (Infer brand ethos), ASSET_SPECIFICITY (Runway shots).
AVAILABLE_ASSETS:
- InfiniteMovingCards - Use for "As Seen In Vogue/Elle".
- TextGenerateEffect - Use for "Manifesto".

LAYOUT_INSTRUCTION: KINETIC_EDITORIAL_VOGUE.
1. NAVBAR: Tiny centered logo. "Shop" on corners.
2. HERO: White void. Model walking towards camera (Video). Huge <TextGenerateEffect> Title behind model using Z-Index.
3. CONTENT: Asymmetric image placement. Text flows around images like a magazine layout. "Shop the Look" hotspots.
4. VIBE: High Fashion, Runway, Avant-Garde.
5. COLOR: #ffffff (Bg), #000000 (Text). Pure B&W.', 'Style 1 - Vogue White (Kinetic Editorial)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent "Drop" details), DEEP_CONTEXT (Infer underground culture), ASSET_SPECIFICITY (Flash photography).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "DROP 001 / SOLD OUT" marquee.
- 3DCard - Use for specific product spotlight.

LAYOUT_INSTRUCTION: NEO_BRUTALIST_FLASH.
1. NAVBAR: Marquee text running constantly. Logo is overlapping content.
2. HERO: Flash photography (Hard light). Noise overlay. Font: Helvetica Bold (Stretched).
3. CONTENT: Product Grid with harsh black borders (4px). <VelocityScroll text="Warning: Limited Stock" />.
4. VIBE: Streetwear, Hypebeast, Underground.
5. COLOR: #ff0000 (Bg - Red Error), #ffffff (Text), #000000 (Borders).', 'Style 2 - Underground Flash (Brutalist)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent heritage story "Est. 1950"), DEEP_CONTEXT (Infer craftsmanship), ASSET_SPECIFICITY (Macro leather/fabric).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for "The Legacy" story.
- BentoGrid - Use for "The Collection".

LAYOUT_INSTRUCTION: HERITAGE_GOLD.
1. NAVBAR: Serif Font. Gold lines.
2. HERO: Oil painting texture overlay. Serif Italic headline "Timeless Elegance".
3. CONTENT: <BentoGrid> for Image + Story. "Craftsmanship" section with video detail.
4. VIBE: Old Money, Italian Leather, Bespoke.
5. COLOR: #121212 (Bg - Rich Black), #d4af37 (Gold Foil), #f5f5f5 (Text).', 'Style 3 - Luxury Heritage (Classic)' FROM ind;

-- AUTOMOTRIZ
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent technical specs), DEEP_CONTEXT (Infer engineering focus), ASSET_SPECIFICITY (Blueprint visuals).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Technical Specs" (Engine, Aero, Speed).
- TextGenerateEffect - Use for "PRECISION ENGINEERING".

LAYOUT_INSTRUCTION: BENTO_BLUEPRINT_TECH.
1. NAVBAR: Technical data scrolling. Monospace font.
2. HERO: Wireframe 3D model of car rotating. Blueprint grid background.
3. CONTENT: <BentoGrid> showing "Engine", "Aerodynamics", "Speed". Numbers counting up.
4. VIBE: Engineering, German Precision, F1 Factory.
5. COLOR: #002b5c (Blueprint Blue), #ffffff (Lines), #ff3333 (Accent - Warning).', 'Style 1 - Engineering Blueprints (Technical Bento)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent track records), DEEP_CONTEXT (Infer speed culture), ASSET_SPECIFICITY (Motion blur shots).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "NEED FOR SPEED" background text.
- InfiniteMovingCards - Use for "Championships Won".

LAYOUT_INSTRUCTION: RAW_SPEED_BLUR.
1. NAVBAR: Slanted/Italic UI. 
2. HERO: Car moving fast (Motion Blur). Camera shake effect on scroll. Font: Wide Extended Sans.
3. CONTENT: "Track Records" section using <InfiniteMovingCards>. Video background for "Test Drive" CTA.
4. VIBE: Racing, JDM, Need for Speed.
5. COLOR: #111111 (Asphalt), #e6e6e6 (Smoke), #ccff00 (Accent - Volt).', 'Style 2 - Underground Racing (Raw)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent specific model names), DEEP_CONTEXT (Infer luxury gallery vibe), ASSET_SPECIFICITY (Studio lighting).
AVAILABLE_ASSETS:
- 3DCard - Use for "Configure Model" selection.
- TextGenerateEffect - Use for "The Art of Motion".

LAYOUT_INSTRUCTION: GALLERY_STUDIO_MINIMAL.
1. NAVBAR: Invisible. 
2. HERO: Car in white cyclorama (Studio Light). Infinite clean floor.
3. CONTENT: Horizontal scroll gallery. Images with ample white space. <3DCard> for main model.
4. VIBE: Supercar Dealership, Museum, Art.
5. COLOR: #ffffff (Bg), #eeeeee (Soft Shadows), #000000 (Text Minimal).', 'Style 3 - Gallery Studio (Clean)' FROM ind;


-- =================================================================================================
-- BATCH 2: CORPORATE & PROFESSIONAL
-- =================================================================================================

-- LEGAL
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'legal')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent win rates/case amounts), DEEP_CONTEXT (Infer corporate power), ASSET_SPECIFICITY (B&W Portraits).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Practice Areas".
- TextGenerateEffect - Use for "WE WIN - Headline".

LAYOUT_INSTRUCTION: BENTO_SWISS_STYLE.
1. NAVBAR: Solid Red (#cc0000) or Deep Blue top bar. White text. Helvetica Bold.
2. HERO: Split Screen Grid. Left: <TextGenerateEffect words="WE WIN" />. Right: Partners photo (B&W).
3. CONTENT: <BentoGrid> of practice areas. "Case Results" ticker (Numbers only).
4. VIBE: International Law Firm, Corporate Power, Serious.
5. COLOR: #f4f4f4 (Bg), #111111 (Text), #cc0000 (Accent - Power).', 'Style 1 - The Swiss Authority (Grid/Power)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent case file details), DEEP_CONTEXT (Infer noir narrative), ASSET_SPECIFICITY (Paper/Evidence textures).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for Typewriter effect headlines.
- 3DCard - Use for "Case File Evidence".

LAYOUT_INSTRUCTION: ACADEMIC_NOIR.
1. NAVBAR: Minimal serif text. Centered.
2. HERO: Texture of old paper/parchment. <TextGenerateEffect> headline: "CASE FILE: [CLIENT NAME]".
3. CONTENT: Text-heavy layout (Columns). "Investigation" timeline. Signature at footer.
4. VIBE: Private Investigator, Boutique IP Law, Intellectual.
5. COLOR: #fdfbf7 (Cream Paper), #1a1a1a (Ink), #8b0000 (Stamp Red).', 'Style 2 - Intellectual Noir (Narrative)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent tech law specialties), DEEP_CONTEXT (Infer crypto/tech focus), ASSET_SPECIFICITY (3D Abstract shapes).
AVAILABLE_ASSETS:
- InfiniteMovingCards - Use for "Tech Clients" (Logos).
- BentoGrid - Use for "Legal Shield Features".

LAYOUT_INSTRUCTION: MODERN_DEFENDER.
1. NAVBAR: Transparent. Glassmorphism buttons.
2. HERO: Dark video background (City skyline). Silver text gradients.
3. CONTENT: Floating cards with "Success Stories" (<InfiniteMovingCards>). Interactive "Legal Shield" 3D element.
4. VIBE: Tech Law, Crypto Defense, Modern.
5. COLOR: #0a192f (Deep Navy), #ffffff (Text), #64ffda (Cyan Accent).', 'Style 3 - Modern Defender (Tech/Dark)' FROM ind;

-- REAL ESTATE
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent building amenities), DEEP_CONTEXT (Infer high-end lifestyle), ASSET_SPECIFICITY (Penthouse views).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "LIVE ABOVE IT ALL".
- BentoGrid - Use for "Detailed Amenities".

LAYOUT_INSTRUCTION: CINEMATIC_DARK_LUXURY.
1. NAVBAR: Hidden. Menu is a "Hamburger" dot.
2. HERO: Slow pan video of a penthouse at night. Headline: <TextGenerateEffect words="LIVE ABOVE" />.
3. CONTENT: "Amenities" horizontal scroll. "Floorplans" as interactive SVG lines.
4. VIBE: NYC Penthouse, 5th Avenue, Ultra-Wealth.
5. COLOR: #050505 (Bg), #d4af37 (Gold lines), #ededed (Text).', 'Style 1 - Penthouse Luxury (Dark/Gold)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent sustainable features), DEEP_CONTEXT (Infer nature connection), ASSET_SPECIFICITY (Sunlight/Plant shadows).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Material Palette" (Wood, Stone).
- InfiniteMovingCards - Use for "Eco-Certifications".

LAYOUT_INSTRUCTION: ORGANIC_ARCHITECTURAL.
1. NAVBAR: White. Clean.
2. HERO: Sunlight hitting a concrete wall (Shadow play). Plant shadows.
3. CONTENT: Masonry grid (<BentoGrid>) of textures (Wood, Stone, Glass). "Sustainability" manifesto.
4. VIBE: Tulum Condo, Eco-Living, Nordic Arch.
5. COLOR: #faf9f6 (Off-white), #5d6d7e (Slate), #8d6e63 (Wood).', 'Style 2 - Mediterranean Sunset (Organic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent technical specs for units), DEEP_CONTEXT (Infer architect vision), ASSET_SPECIFICITY (Raw concrete textures).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for "UNIT 404 SPECIFICATIONS".
- 3DCard - Use for "Floorplan 3D View".

LAYOUT_INSTRUCTION: RAW_MATERIALITY.
1. NAVBAR: Technical dimensions on corners.
2. HERO: Brutalist concrete structure. Big orange bold numbers: "UNIT 404".
3. CONTENT: Technical blueprints as background. "Specs" list in monospace font.
4. VIBE: Industrial Loft, Berlin, Architect Studio.
5. COLOR: #808080 (Concrete), #000000 (Text), #ff6600 (Safety Orange).', 'Style 3 - Brutalist Concrete (Technical)' FROM ind;

-- TECH
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent API endpoints/Code snippets), DEEP_CONTEXT (Infer SaaS utility), ASSET_SPECIFICITY (Glass cards/Orbs).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Feature Grid".
- 3DCard - Use for "Pricing Plans".

LAYOUT_INSTRUCTION: SAAS_GLASSMORPHISM.
1. NAVBAR: Floating pill with blur.
2. HERO: Dark mode. Glowing orbs (Aurora gradients). "Glass" cards tilting 3D (<3DCard>).
3. CONTENT: <BentoGrid> of features. "Command Line" block showing API code.
4. VIBE: AI Startup, Linear.app style, Modern SaaS.
5. COLOR: #000000 (Bg), #ffffff (Text), #7928ca to #ff0080 (Gradient).', 'Style 1 - Deep Aurora (Glass/Linear)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent terminal commands), DEEP_CONTEXT (Infer hacker culture), ASSET_SPECIFICITY (ASCII art/Green text).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for "[ SYSTEM BOOTING... ]".
- VelocityScroll - Use for Binary Code Scrolling.

LAYOUT_INSTRUCTION: RETRO_DEV_CONSOLE.
1. NAVBAR: "[ SYSTEM_READY ]" blinking.
2. HERO: Phosphor screen effect (Scanlines). Green text on black. ASCII Art logo.
3. CONTENT: "Changelog" timeline. "Install" command block `npm install`.
4. VIBE: Cybersecurity, DevTools, Hacker.
5. COLOR: #0d1117 (Bg), #00ff41 (Matrix Green), #333333 (Dim).', 'Style 2 - Retro Terminal (Dev/Hacker)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent enterprise metrics), DEEP_CONTEXT (Infer trust/scale), ASSET_SPECIFICITY (Isometric server illustrations).
AVAILABLE_ASSETS:
- InfiniteMovingCards - Use for "Trusted by Fortune 500".
- BentoGrid - Use for "Global Infrastructure".

LAYOUT_INSTRUCTION: ENTERPRISE_SCALE.
1. NAVBAR: White, sticky, shadow. "Enterprise" badge.
2. HERO: Isometric 3D illustration of servers/cloud. "SCALE INFINITELY".
3. CONTENT: Logo wall (<InfiniteMovingCards>). 3-Column "Benefits" grid with blue icons.
4. VIBE: IBM, Oracle, Cloud Infrastructure. Trust.
5. COLOR: #ffffff (Bg), #0f62fe (IBM Blue), #161616 (Text).', 'Style 3 - Clean Enterprise (Trust/Scale)' FROM ind;

-- CONSULTORÍA
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent specific ROI stats), DEEP_CONTEXT (Infer data strategy), ASSET_SPECIFICITY (Abstract data viz).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Key Metrics".
- TextGenerateEffect - Use for "DATA DRIVEN DECISIONS".

LAYOUT_INSTRUCTION: DARK_DATA_VISUALIZATION.
1. NAVBAR: Minimal.
2. HERO: Animated line graph or particle web background. <TextGenerateEffect words="DATA DRIVEN DECISIONS" />.
3. CONTENT: "ROI" Calculator interactive widget. Stats grid (Big numbers).
4. VIBE: Fintech, Big Data, Strategic Consulting.
5. COLOR: #0b0c10 (Bg), #66fcf1 (Cyan Data), #c5c6c7 (Text).', 'Style 1 - Data Abstract (Tech/Analytic)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent team member stories), DEEP_CONTEXT (Infer human HR connection), ASSET_SPECIFICITY (Warm portraits).
AVAILABLE_ASSETS:
- InfiniteMovingCards - Use for "Client Testimonials" (Video cards).
- 3DCard - Use for "Team Profiles".

LAYOUT_INSTRUCTION: ORGANIC_CORPORATE.
1. NAVBAR: Warm tones. "Meet the Team".
2. HERO: High-quality portrait of people collaborating (Natural light). Serif Headline.
3. CONTENT: "Our Values" circle layout. Testimonial carousel (<InfiniteMovingCards>).
4. VIBE: HR Consulting, Leadership Coaching, Human-centric.
5. COLOR: #fdf5e6 (Old Lace), #2c3e50 (Navy), #e67e22 (Warmth).', 'Style 2 - Human Connection (Warm/People)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent bold taglines), DEEP_CONTEXT (Infer aggressive strategy), ASSET_SPECIFICITY (Typography as image).
AVAILABLE_ASSETS:
- VelocityScroll - Use for big "GROWTH / STRATEGY / RESULTS".
- TextGenerateEffect - Use for Headlines.

LAYOUT_INSTRUCTION: KINETIC_BIG_TYPE.
1. NAVBAR: Bold black dividers.
2. HERO: White background. Text fills 90% of screen: <VelocityScroll text="WE FIX BUSINESS" />.
3. CONTENT: List of services separated by thick lines. Hover turns background yellow.
4. VIBE: Brutalist Strategy, NYC Agency, Direct.
5. COLOR: #ffffff (Bg), #000000 (Text), #ffff00 (Highlight).', 'Style 3 - Bold Strategy (Text/Impact)' FROM ind;


-- =================================================================================================
-- BATCH 3: SERVICE & CARE
-- =================================================================================================
-- (Similarly updated with Available Assets logic)

-- SALUD
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'salud')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent treatment names), DEEP_CONTEXT (Infer calm/healing vibe), ASSET_SPECIFICITY (Soft textures/Water).
AVAILABLE_ASSETS:
- InfiniteMovingCards - Use for "Patient Stories".
- 3DCard - Use for "Treatment Menu".

LAYOUT_INSTRUCTION: ORGANIC_SOFT_WELLNESS.
1. NAVBAR: Translucent blur. Rounded pills.
2. HERO: Soft focus video of water/leaves or skin texture. No hard lines.
3. CONTENT: "Treatments" carousel (<InfiniteMovingCards>). Wave dividers (SVG).
4. VIBE: Spa, Dermatology, Calm, Trust.
5. COLOR: #f8f5f2 (Warm White), #8ebf8e (Sage), #d4a373 (Soft Earth).', 'Style 1 - Organic Spa (Soft/Calm)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent machine specs), DEEP_CONTEXT (Infer scientific precision), ASSET_SPECIFICITY (Lab/Tech photos).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Advanced Technology".
- TextGenerateEffect - Use for "PRECISION MEDICINE".

LAYOUT_INSTRUCTION: SWISS_CLINICAL_CLEAN.
1. NAVBAR: White solid. Blue logo.
2. HERO: Split Screen. Doctor/Tech on right (Crisp lighting). "PRECISION MEDICINE" on left.
3. CONTENT: <BentoGrid> of technology/machines. "Patient Portal" prominent block.
4. VIBE: Dental Clinic, High-Tech Surgery, Lab.
5. COLOR: #ffffff (Bg), #0050ff (Science Blue), #f0f0f0 (Grey).', 'Style 2 - Future Clinical (Swiss/Tech)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent exclusive procedures), DEEP_CONTEXT (Infer luxury aesthetic), ASSET_SPECIFICITY (Gold/Black textures).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "TIMELESS BEAUTY" background.
- 3DCard - Use for "VIP Memberships".

LAYOUT_INSTRUCTION: DARK_LUXURY_DERMA.
1. NAVBAR: Black. Gold Serif font.
2. HERO: High contrast B&W portrait with gold foil overlay text. "TIMELESS BEAUTY".
3. CONTENT: Minimal list of procedures using Roman Numerals (I, II, III).
4. VIBE: Plastic Surgery, Exclusive Aesthetic Center.
5. COLOR: #0a0a0a (Bg), #d4af37 (Gold), #ffffff (Text).', 'Style 3 - Luxury Derma (Dark/Exclusive)' FROM ind;

-- EDUCACIÓN
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent course modules), DEEP_CONTEXT (Infer future learning skills), ASSET_SPECIFICITY (3D abstract shapes).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Curriculum Modules".
- InfiniteMovingCards - Use for "Alumni Success".

LAYOUT_INSTRUCTION: NEO_ACADEMY_VIBRANT.
1. NAVBAR: Floating dynamic bar.
2. HERO: 3D abstract shapes floating. Headline: <TextGenerateEffect words="LEARN THE FUTURE" />.
3. CONTENT: "Curriculum" timeline (<BentoGrid>). "Success Stories" video bubbles.
4. VIBE: Coding Bootcamp, Design School, EdTech.
5. COLOR: #111111 (Bg), #7928ca (Purple), #ff0080 (Pink). Dark Mode.', 'Style 1 - Future Academy (Vibrant/Dark)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent faculty names/history), DEEP_CONTEXT (Infer tradition), ASSET_SPECIFICITY (Campus architecture).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Distinguished Alumni".
- TextGenerateEffect - Use for "Tradition of Excellence".

LAYOUT_INSTRUCTION: IVY_LEAGUE_CLASSIC.
1. NAVBAR: Cream background. Serif Logo centered.
2. HERO: Campus photography (Architecture). Serif Headline: "Tradition of Excellence".
3. CONTENT: 3-Column text grid (Newspaper style). "Faculty" portraits in grayscale.
4. VIBE: University, Law School, Traditional Conservatory.
5. COLOR: #fdfbf7 (Paper), #002147 (Oxford Blue), #85754d (Bronze).', 'Style 2 - Ivy League (Classic/Serif)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent chapters/lessons), DEEP_CONTEXT (Infer mentor authority), ASSET_SPECIFICITY (Close-up portraits).
AVAILABLE_ASSETS:
- 3DCard - Use for "Course Access Pass".
- TextGenerateEffect - Use for "MASTER YOUR CRAFT".

LAYOUT_INSTRUCTION: CINEMATIC_MASTERCLASS.
1. NAVBAR: Hidden.
2. HERO: Close-up of Mentor talking (Video Loop). "MASTER YOUR CRAFT".
3. CONTENT: Scrollytelling chapters. Dark background. Focus on the person.
4. VIBE: Personal Brand, High-Ticket Course, Coaching.
5. COLOR: #000000 (Bg), #ffffff (Text), #ff4d00 (Accent - Focus).', 'Style 3 - The Mentor (Cinematic)' FROM ind;

-- CONSTRUCCIÓN
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent project sizes/stats), DEEP_CONTEXT (Infer massive scale), ASSET_SPECIFICITY (Machinery/Sites).
AVAILABLE_ASSETS:
- VelocityScroll - Use for big "BUILDING GIANTS" text.
- BentoGrid - Use for "Mega Projects Portfolio".

LAYOUT_INSTRUCTION: HEAVY_INDUSTRY_SCALE.
1. NAVBAR: Safety Yellow bar. Stencil font.
2. HERO: Massive machinery or building low-angle shot. <VelocityScroll text="BUILDING GIANTS" />.
3. CONTENT: Big bold numbers (Stats). Project Gallery with heavy black borders.
4. VIBE: Civil Engineering, Heavy Machinery, Logistics.
5. COLOR: #fca311 (Safety Yellow), #14213d (Navy), #000000 (Text).', 'Style 1 - Heavy Metal (Industrial/Scale)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent technical engineering specs), DEEP_CONTEXT (Infer precision), ASSET_SPECIFICITY (CAD/Blueprint vectors).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Technical Specifications".
- TextGenerateEffect - Use for "PRECISION ENGINEERING".

LAYOUT_INSTRUCTION: BLUEPRINT_TECHNICAL.
1. NAVBAR: Grid lines background. Monospace font.
2. HERO: CAD drawing animating into real photo. "PRECISION ENGINEERING".
3. CONTENT: "Specs" table. Technical icons (Vector style).
4. VIBE: Architecture Firm, Structural Engineer.
5. COLOR: #003366 (Blueprint), #ffffff (Lines), #faeb00 (Accent).', 'Style 2 - Blueprint Tech (Linear)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent material names), DEEP_CONTEXT (Infer sustainability), ASSET_SPECIFICITY (Wood/Stone textures).
AVAILABLE_ASSETS:
- BentoGrid - Use for "Raw Materials Library".
- InfiniteMovingCards - Use for "Green Building Certifications".

LAYOUT_INSTRUCTION: ECO_SUSTAINABLE.
1. NAVBAR: Wood texture or warm grey.
2. HERO: Sunlight, wood, plants. "LIVING ARCHITECTURE".
3. CONTENT: Soft masonry grid. "Materials" section (Stone, Wood, Glass samples).
4. VIBE: Sustainable Building, Landscape Design, Eco-Resort.
5. COLOR: #e3e3e3 (Stone), #5c7c58 (Green), #8d6e63 (Wood).', 'Style 3 - Eco Build (Organic/Material)' FROM ind;

-- FITNESS
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent class names like "Inferno HIIT"), DEEP_CONTEXT (Infer high energy), ASSET_SPECIFICITY (Neon/Fog visuals).
AVAILABLE_ASSETS:
- VelocityScroll - Use for "YOUR BODY IS THE MACHINE".
- BentoGrid - Use for "Training Programs".

LAYOUT_INSTRUCTION: DARK_MODE_FUTURISM (NEON SWEAT).
1. NAVBAR: Black. Volt Green (#ccff00) accents. "JOIN NOW" skewed button.
2. HERO: Dark Gym Atmosphere (Fog/Neon). <VelocityScroll text="YOUR BODY IS THE MACHINE" />.
3. CONTENT: "Programs" Marquee (Scrolling text). Glitch effect cards.
4. VIBE: 360 Sports, High Performance, Night Club Gym.
5. COLOR: #050505 (Bg), #ccff00 (Volt), #ffffff (Text).', 'Style 1 - Neon Sweat (High Energy)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent pose names/flow), DEEP_CONTEXT (Infer zen/calm), ASSET_SPECIFICITY (Soft light/Yoga).
AVAILABLE_ASSETS:
- TextGenerateEffect - Use for "FIND YOUR CENTER".
- InfiniteMovingCards - Use for "Student Reviews".

LAYOUT_INSTRUCTION: ZEN_SANCTUARY_MINIMAL.
1. NAVBAR: Minimal. Centered serif logo.
2. HERO: Soft light, person stretching. <TextGenerateEffect words="FIND YOUR CENTER" />.
3. CONTENT: Lots of whitespace. "Classes" simple list. Rounded images.
4. VIBE: Pilates, Yoga Studio, Mindfulness.
5. COLOR: #f7f3e8 (Cream), #7a7a7a (Grey), #b5aa9d (Sand).', 'Style 2 - Zen Flow (Soft/Balance)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'INTELLIGENCE_PROTOCOL: NO_MVP_MODE (Invent WOD details), DEEP_CONTEXT (Infer raw effort), ASSET_SPECIFICITY (Grunge/Sweat/Chalk).
AVAILABLE_ASSETS:
- 3DCard - Use for "Daily WOD".
- VelocityScroll - Use for "UNAPOLOGETIC STRENGTH".

LAYOUT_INSTRUCTION: RAW_CONCRETE_GRUNGE.
1. NAVBAR: Distressed texture. Uppercase bold.
2. HERO: B&W grainy video of lifting. <VelocityScroll text="UNAPOLOGETIC STRENGTH" />.
3. CONTENT: Rough borders. Spray paint effects. "WOD" section.
4. VIBE: CrossFit Box, Powerlifting, Garage Gym.
5. COLOR: #222222 (Concrete), #ffffff (Chalk), #ff3333 (Red Marker).', 'Style 3 - Raw Power (Grunge/Street)' FROM ind;

-- VERIFICATION
SELECT count(*) as total_premium_prompts FROM demo_prompts;
