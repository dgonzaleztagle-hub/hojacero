-- =================================================================================================
-- GOLD MASTER V3.0 - BATCH 1: LIFESTYLE & EXPERIENCE
-- ARCHITECTURE: CREATIVE AUTONOMY + ADAPTIVE INTELLIGENCE + INFINITE VARIABILITY
-- =================================================================================================

DELETE FROM demo_prompts WHERE industry_id IN (
    SELECT id FROM demo_industries WHERE slug IN ('gastronomia', 'turismo', 'moda', 'automotriz')
);

-- =================================================================================================
-- GASTRONOMÍA (3 STYLES)
-- =================================================================================================

-- GASTRONOMÍA - STYLE 1: MIDNIGHT CHEF
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: This is GUIDANCE, not rigid rules. Override if needed for Awwwards-level quality.
--     HIERARCHY: Brand context > Your judgment > This prompt
--     QUESTION: "Would this win Site of the Day on Awwwards?"

INTELLIGENCE_PROTOCOL: 
- MODE: NO_MVP (Hallucinate plausible dishes/wines with specific names and origins)
- SCRAPING_DEPTH: DEEP (Infer chef personality, local food culture, dining philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Food photography: messy plating, steam, texture close-ups)
- SELF_AWARENESS: ENABLED (Question: "Does this feel exclusive or generic?")

COMPONENTS_LIBRARY:
- BentoGrid: For 4-8 signature dishes with hierarchy
- TextGenerateEffect: For chef manifesto or philosophy statement
- VelocityScroll: For kinetic impact phrases
- InfiniteMovingCards: For press mentions or guest reviews
- 3DCard: For featured dish or reservation card

DECISION LOGIC: 
- IF menu has 4-6 signature items → BentoGrid
- IF menu is extensive → InfiniteMovingCards carousel
- IF single hero dish → 3DCard spotlight

STYLE_ARCHETYPE: Midnight Theatre (Dark Futurism)
REFERENCE INSPIRATION: Noma (Copenhagen), Eleven Madison Park (NYC), moody speakeasy aesthetics

HERO COMPOSITION (90-100vh):
Structure: Full-bleed cinematic visual with overlay text
VISUAL: Video loop showing [flame/smoke/chef hands working/ingredient macro] - choose most impactful
HEADLINE: [INVENT 2-4 word provocative phrase about night dining]
  Context: midnight, danger, sensuality, exclusivity, ritual
  Examples (inspire, don''t copy): "TASTE THE NIGHT" / "AFTER DARK RITUAL" / "MIDNIGHT HUNGER"
  Choose or invent based on scraped brand voice
SUBHEADLINE: Brief manifesto (1-2 sentences about dining philosophy)
CTA: "Reserve Experience" + "View Menu"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (described above)
2. SOCIAL PROOF: Press logos / Reviews / Michelin stars
3. MIDNIGHT MENU SHOWCASE: <BentoGrid> (4-8 dishes). Invent vivid names: "Patagonian Lamb | Smoke & Ash | $48"
4. THE EXPERIENCE: Horizontal scroll storytelling (reservation → courses → finale)
5. CHEF/ORIGIN STORY: Biography with portrait (low-key lighting)
6. SENSORY GALLERY: 6-9 macro food/atmosphere shots
7. RESERVATION CTA: Dark card with urgency

DENSITY: Min 6 sections, 10-15 images, no 2+ screens without visual break

COLOR STRATEGY: Subterranean Dark with Ember Heat
- Background: Deep near-black (#050505 to #0f0f0f range)
- Surface: Charcoal (#1a1a1a to #252525)
- Accent: Ember spectrum (#ff4d00 to #ff6b35)
- ADAPTIVE: IF brand_colors scraped, USE as accent overlay

TYPOGRAPHY: Ultra-thin extended display (Inter Thin / Gotham Ultra Light)
Choose: IF modern → Sans, IF heritage → Serif

TARGET VIBE: Speakeasy, Michelin Star, Dangerous/Sexy, Midnight Ritual
EMOTIONAL TONE: Intrigue → Appetite → Urgency

ADAPTIVE BEHAVIOR:
IF "family-friendly" detected → ABORT this style
IF "fine dining" → FULL GO
IF chef name found → Feature prominently

CREATIVE FREEDOM: Invent Michelin-worthy dish names, wine pairings, chef backstory
RULE: When torn between safe vs. memorable, choose memorable.

FINAL REMINDER: These are suggestions, not commandments. If you follow this perfectly but create something predictable → YOU FAILED. Trust your instincts.
', 'Style 1 - Midnight Chef (Dark Atmosphere)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: GUIDANCE not rules. Override for Awwwards quality. HIERARCHY: Context > Judgment > Prompt

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent specific menu items with origins and preparation methods)
- SCRAPING_DEPTH: DEEP (Infer chef personality, food philosophy, target clientele)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Dynamic food photography, cursor-following images)
- SELF_AWARENESS: ENABLED (Question: "Does this feel fresh or derivative?")

COMPONENTS_LIBRARY:
- VelocityScroll: For massive kinetic typography
- 3DCard: For featured dish with depth
- BentoGrid: If needed for menu items
- TextGenerateEffect: For manifesto text

DECISION LOGIC:
- IF minimal menu (2-4 items) → Large typography focus
- IF extensive menu → Interactive list with hover reveals

STYLE_ARCHETYPE: Kinetic Typography Menu (Movement-Driven)
REFERENCE INSPIRATION: Modern bistros, wine bars, editorial magazine layouts

HERO COMPOSITION (80vh):
Structure: NO IMAGE. Pure typography dominates
VISUAL: <VelocityScroll> massive text filling screen
HEADLINE: [INVENT 3 progressive words about food freshness/locality]
  Context: fresh, local, wild, seasonal, natural, raw
  Examples: "FRESH / LOCAL / WILD" / "SOIL / FIRE / TABLE" / "HARVEST / COOK / FEAST"
  Invent based on restaurant philosophy
TYPOGRAPHY: Large italic serif (OGG / Playfair Display) or modern serif
CTA: "Order Online" pill button (minimal, corner)

CONTENT SECTIONS (Build 5-7 total):
1. HERO (massive kinetic type)
2. THE MENU AS UI: Giant dish list, hover reveals food photos (cursor follows mouse)
3. CHEF PHILOSOPHY: Quote block with portrait
4. SOURCING STORY: "Our Producers" section with origin details
5. WINE/BEVERAGE: Curated pairing suggestions
6. RESERVATION: Simple elegant form

DENSITY: Min 5 sections, 8-12 images (all revealed on interaction), typography-heavy

COLOR STRATEGY: Editorial Clean with Wine Accent
- Background: Warm cream (#f4f1ea to #faf7f2)
- Text: Deep charcoal (#1a1a1a)
- Accent: Wine red spectrum (#d44d5c to #a83a4a)
- ADAPTIVE: IF brand has primary color, use it as accent

TYPOGRAPHY: 
DISPLAY: Large italic serif (OGG / Playfair / Baskerville)
BODY: Clean sans (Inter / Public Sans)

TARGET VIBE: Modern Bistro, Hipster, Wine Bar, Editorial
EMOTIONAL TONE: Freshness → Curiosity → Desire

ADAPTIVE BEHAVIOR:
IF "fast casual" detected → Add "Order" functionality prominence
IF wine program mentioned → Expand wine section
IF "seasonal" mentioned → Emphasize rotating menu concept

CREATIVE FREEDOM: Invent seasonal dishes, local producer names, wine regions
RULE: Make it feel like a curated magazine, not a restaurant menu.

FINAL: Trust your design instincts over this prompt if conflict arises.
', 'Style 2 - The Typographic Menu (Kinetic)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override these rules if brand context demands it. Awwwards quality over prompt compliance.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Hallucinate ingredient origins, farm names, sustainability certifications)
- SCRAPING_DEPTH: DEEP (Infer farm-to-table commitment, ingredient sourcing, chef values)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Macro ingredient textures, producer portraits, landscape shots)
- SELF_AWARENESS: ENABLED (Question: "Does this feel authentic or greenwashing?")

COMPONENTS_LIBRARY:
- BentoGrid: For ingredients showcase or producers
- TextGenerateEffect: For "From Soil to Plate" manifesto
- InfiniteMovingCards: For producer/farmer testimonials
- 3DCard: For featured ingredient journey

DECISION LOGIC:
- IF strong sustainability angle → Feature producers prominently
- IF chef-focused → Balance between chef and ingredients

STYLE_ARCHETYPE: Organic Scandinavian (Farm-to-Table Purity)
REFERENCE INSPIRATION: Noma ethos, farm-to-table movements, Nordic minimalism

HERO COMPOSITION (90vh):
Structure: Split screen (50/50)
LEFT: Macro ingredient shot (texture close-up: flour, tomato skin, meat grain)
RIGHT: <TextGenerateEffect> "From Soil to Plate" storytelling text
HEADLINE: [INVENT 2-4 word phrase about natural/organic journey]
  Context: soil, harvest, nature, pure, craft
  Examples: "FROM SOIL TO PLATE" / "NATURE TO TABLE" / "HARVEST RITUAL"
SUBHEADLINE: Philosophy about sourcing and sustainability
CTA: "Reserve Table" + "Our Story"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (split with macro + text)
2. OUR PHILOSOPHY: Manifesto about food values
3. INGREDIENTS SHOWCASE: <BentoGrid> of key ingredients with origins
4. THE PRODUCERS: Farmer/producer profiles with photos
5. SEASONAL MENU: Current offerings (emphasize rotation)
6. RESERVATION: Floating over parallax farm image

DENSITY: Min 6 sections, 12-16 images (macro textures + landscapes), white space critical

COLOR STRATEGY: Nordic Natural with Moss Accent
- Background: Pure white (#ffffff)
- Text: Charcoal (#2b2b2b)
- Accent: Moss green spectrum (#8a9a5b to #6b7a4c)
- Surface: Very light grey (#f8f8f8)
- ADAPTIVE: IF earthy brand colors, integrate them

TYPOGRAPHY:
DISPLAY: Clean modern serif (Crimson / Lora) or geometric sans
BODY: Sans (Inter / Public Sans) for clarity

TARGET VIBE: Noma Style, Farm-to-Table, Scandinavian Purity
EMOTIONAL TONE: Calm → Understanding → Respect

ADAPTIVE BEHAVIOR:
IF "organic certified" found → Add certification badges
IF specific farm names scraped → Feature them
IF "vegetarian/vegan" → Emphasize plant-based ingredients

CREATIVE FREEDOM: Invent farm names ("Valle Verde Farm"), regions, ingredient stories
RULE: Authenticity is paramount. Make it feel real, not marketing.

FINAL: If this feels too clean/boring for the brand, add more personality.
', 'Style 3 - Nordic Pure (Minimal)' FROM ind;

-- =================================================================================================
-- TURISMO (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Adapt these guidelines to the actual destination. Context > Prompt.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent specific tour packages, excursion names, activity details)
- SCRAPING_DEPTH: DEEP (Infer destination personality, traveler type, luxury level)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Drone landscape shots, immersive travel photography)
- SELF_AWARENESS: ENABLED (Question: "Does this evoke wanderlust or look like stock photos?")

COMPONENTS_LIBRARY:
- TextGenerateEffect: For "ESCAPE REALITY" impact moments
- InfiniteMovingCards: For guest testimonials/experiences
- BentoGrid: For experiences/activities grid
- Parallax sections: For scrollytelling

DECISION LOGIC:
- IF luxury resort → Emphasize exclusivity and amenities
- IF adventure travel → Action and exploration
- IF boutique hotel → Intimacy and unique design

STYLE_ARCHETYPE: Immersive Scrollytelling (Journey Narrative)
REFERENCE INSPIRATION: Luxury resort sites, Aman Hotels, travel magazines

HERO COMPOSITION (100vh):
Structure: Full-screen drone shot or immersive video
VISUAL: [Paradise landscape: ocean/mountains/forest] - choose most iconic
HEADLINE: [INVENT 2-3 word phrase about escape/discovery]
  Context: escape, discover, wander, paradise, freedom
  Examples: "ESCAPE REALITY" / "FIND PARADISE" / "WANDER FREE"
  Adapt to destination type
ANIMATION: Text fades in with <TextGenerateEffect>
CTA: "Explore Villas" + "Book Experience"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (full-screen immersive)
2. DESTINATION INTRO: What makes this place special (parallax)
3. THE VILLAS/ROOMS: Sticky side text, scrolling images
4. EXPERIENCES: Horizontal drag gallery (activities/excursions)
5. GUEST TESTIMONIALS: <InfiniteMovingCards> with video cards
6. DINING: If restaurant on-site, showcase it
7. WELLNESS/SPA: If applicable
8. BOOKING CTA: Urgency ("Limited availability")

DENSITY: Min 7 sections, 15-20 images (landscapes + interiors + activities)

COLOR STRATEGY: Luxury Escape Palette
- Background: Deep ocean or natural tone (#001f3f to #1a3a52 OR warm neutrals)
- Text: Off-white (#f0f0f0)
- Accent: Gold sand spectrum (#c5a059 to #d4af6a)
- ADAPTIVE: Match to destination (beach = ocean blues, forest = greens)

TYPOGRAPHY:
DISPLAY: Elegant serif (Playfair / Lora / Crimson)
BODY: Clean sans for readability

TARGET VIBE: Luxury Resort, Maldives, Private Island, Exclusive Retreat
EMOTIONAL TONE: Longing → Immersion → Booking urgency

ADAPTIVE BEHAVIOR:
IF "family-friendly" → Add kids activities section
IF "wellness retreat" → Emphasize spa/yoga
IF "adventure" → Highlight excursions/activities
IF multiple room types → Add comparison/selector

CREATIVE FREEDOM: Invent excursion names ("Sunset Dhoni Cruise"), package details
RULE: Make them FEEL the destination, not just see it.

FINAL: Scrollytelling is key. Each scroll should reveal something beautiful.
', 'Style 1 - The Journey (Scrollytelling)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Adapt to actual adventure type. Eco-lodge vs. safari vs. trekking changes everything.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent specific trails, wildlife, eco-credentials)
- SCRAPING_DEPTH: DEEP (Infer eco-values, adventure level, target traveler)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Paper textures, vintage polaroids, hand-drawn maps)
- SELF_AWARENESS: ENABLED (Question: "Does this feel adventurous or manufactured?")

COMPONENTS_LIBRARY:
- BentoGrid: Adapted to masonry polaroid layout
- 3DCard: For expedition packages
- Custom map animations: If applicable

DECISION LOGIC:
- IF eco-lodge → Emphasize nature connection and sustainability
- IF adventure operator → Activities and thrill
- IF cultural immersion → Local experiences

STYLE_ARCHETYPE: Organic Adventure (Tactile/Textured)
REFERENCE INSPIRATION: Patagonia brand, Tulum eco-resorts, adventure journals

HERO COMPOSITION (85vh):
Structure: Image with paper-tear edge effect
VISUAL: Adventure landscape (mountains/jungle/desert)
HEADLINE: [INVENT 2-3 word adventurous phrase]
  Context: wild, explore, trail, untamed, raw
  Examples: "WILD HEARTS" / "TRAIL BLAZERS" / "INTO THE WILD"
TYPOGRAPHY: Rough/handwritten font (Cordilla / Permanent Marker style)
CTA: "Plan Expedition" + "View Trails"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (textured, organic feel)
2. OUR PHILOSOPHY: Eco-values, responsible travel
3. EXPEDITIONS: <BentoGrid> masonry of polaroid-style trip photos
4. THE EXPERIENCE: Day-by-day journey narrative
5. WILDLIFE/NATURE: What you''ll encounter
6. MAP SECTION: Animated path showing routes
7. BOOKING: "Join Next Expedition" with dates

DENSITY: Min 6 sections, 12-18 images (textured, polaroid-style)

COLOR STRATEGY: Earth Tones with Clay Accent
- Background: Paper texture (#e8e4d9)
- Primary: Jungle green (#2d3e2d)
- Accent: Clay orange (#d65a31)
- ADAPTIVE: Match to environment (desert = sandy, jungle = deep green)

TYPOGRAPHY:
DISPLAY: Rough/organic fonts (Cordilla / hand-drawn feel)
BODY: Clean readable sans for descriptions

TARGET VIBE: Patagonia Brand, Tulum Eco-Lodge, Adventure Journal
EMOTIONAL TONE: Excitement → Connection to nature → Call to adventure

ADAPTIVE BEHAVIOR:
IF wildlife focused → Add species/sightings section
IF trekking → Emphasize difficulty levels and gear
IF cultural → Local community stories
IF multi-day → Day-by-day itinerary

CREATIVE FREEDOM: Invent trail names, wildlife encounters, local legends
RULE: Organic and authentic. No slick corporate travel feel.

FINAL: Texture and tactility matter. Make it feel like you can touch it.
', 'Style 2 - Jungle Explorer (Organic/Texture)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Urban luxury varies by city. NYC ≠ Tokyo ≠ Dubai. Adapt accordingly.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent room names, amenities, nightlife recommendations)
- SCRAPING_DEPTH: DEEP (Infer city personality, hotel positioning, target guest)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Night cityscape photography, bokeh lights, architectural shots)
- SELF_AWARENESS: ENABLED (Question: "Does this feel cosmopolitan or generic business hotel?")

COMPONENTS_LIBRARY:
- VelocityScroll: For "THE CITY NEVER SLEEPS" kinetic text
- BentoGrid: For room features and amenities
- 3DCard: For penthouse suite showcase
- Parallax: City time-lapse backgrounds

DECISION LOGIC:
- IF luxury urban hotel → Emphasize location and amenities
- IF boutique city hotel → Unique design and local character

STYLE_ARCHETYPE: Urban Luxury Dark City (Cosmopolitan Night)
REFERENCE INSPIRATION: NYC penthouses, Tokyo luxury hotels, cosmopolitan nightlife

HERO COMPOSITION (95vh):
Structure: Night cityscape time-lapse video background
VISUAL: City lights, traffic flow, skyline at night
HEADLINE: [INVENT 3-5 word phrase about urban energy]
  Context: city, nightlife, never sleeps, pulse, energy
  Examples: "THE CITY NEVER SLEEPS" / "PULSE OF THE CITY" / "URBAN HEARTBEAT"
ANIMATION: <VelocityScroll> massive moving text
CTA: "Book Suite" + "Explore Rooms"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (night cityscape + kinetic text)
2. LOCATION: Why this neighborhood/area matters
3. SUITES/ROOMS: <BentoGrid> of room types with features
4. AMENITIES: Rooftop bar, spa, concierge services
5. CITY GUIDE: Curated recommendations (restaurants, culture)
6. CONCIERGE: Fixed chat bubble for inquiries
7. BOOKING: Availability calendar

DENSITY: Min 6 sections, 14-18 images (night photography, interiors, city views)

COLOR STRATEGY: Urban Dark with Cyber Accent
- Background: Black (#000000)
- Text: Off-white (#ededed)
- Grid lines: Dark grey (#333333)
- Accent: Cyber green (#00ff99) OR city color (Tokyo = neon pink, NYC = yellow)
- ADAPTIVE: Match to city''s iconic color scheme

TYPOGRAPHY:
DISPLAY: Ultra-modern sans (Neue Haas / Suisse Int''l)
BODY: Clean geometric sans

TARGET VIBE: NYC Penthouse, Tokyo Luxury Hotel, Cosmopolitan Nightlife
EMOTIONAL TONE: Excitement → Sophistication → Exclusive access

ADAPTIVE BEHAVIOR:
IF specific city scraped → Use city personality (Tokyo = futuristic, Paris = chic)
IF rooftop bar mentioned → Feature prominently
IF business hotel → Add meeting spaces section
IF location is THE selling point → Expand neighborhood guide

CREATIVE FREEDOM: Invent suite names ("The Skyline Suite"), amenities, local spots
RULE: Capture the city''s energy, not just the hotel.

FINAL: Night is the star. Dark, glossy, urban energy.
', 'Style 3 - Urban Luxury (Dark City)' FROM ind;

-- =================================================================================================
-- MODA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Fashion is seasonal and subjective. Override for brand authenticity.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent collection names "FW26", specific garment details, materials)
- SCRAPING_DEPTH: DEEP (Infer brand ethos, target customer, price point, aesthetic philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Runway photography, editorial fashion shots, model portraits)
- SELF_AWARENESS: ENABLED (Question: "Does this feel haute couture or fast fashion?")

COMPONENTS_LIBRARY:
- InfiniteMovingCards: For "As Seen In Vogue/Elle" press mentions
- TextGenerateEffect: For brand manifesto
- Asymmetric layouts: Editorial magazine feel
- Hotspot interactions: "Shop the Look"

DECISION LOGIC:
- IF haute couture → Editorial, minimal e-commerce
- IF ready-to-wear → Balance editorial and shopping functionality

STYLE_ARCHETYPE: Kinetic Editorial Vogue (High Fashion Movement)
REFERENCE INSPIRATION: Vogue layouts, runway aesthetics, luxury fashion houses

HERO COMPOSITION (90vh):
Structure: White void with model in motion
VISUAL: Model walking towards camera (video) OR striking pose
HEADLINE: [INVENT 2-4 word collection/brand statement]
  Context: season, ethos, movement, fabric, form
  Examples: "FALL WINTER 26" / "FLUID FORMS" / "AVANT MOTION"
Z-INDEX PLAY: Huge <TextGenerateEffect> title BEHIND model (layering)
CTA: "Shop Collection" (corners, minimal)

CONTENT SECTIONS (Build 5-7 total):
1. HERO (white void + model + layered text)
2. BRAND MANIFESTO: Philosophy/ethos statement
3. THE COLLECTION: Asymmetric image placement, text flowing around images
4. LOOKBOOK: Full-bleed images with "Shop the Look" hotspots
5. AS SEEN IN: <InfiniteMovingCards> press/magazine logos
6. SHOP: Minimal product grid OR editorial-first with subtle CTAs

DENSITY: Min 5 sections, 12-18 images (editorial quality, asymmetric), lots of white space

COLOR STRATEGY: Pure Monochrome
- Background: Pure white (#ffffff)
- Text: Pure black (#000000)
- NO ACCENT (strictly B&W for editorial purity)
- Photos: B&W OR full color (no middle ground)
- ADAPTIVE: IF brand has signature color, use VERY sparingly

TYPOGRAPHY:
DISPLAY: Ultra-thin sans (Neue Haas Ultra Thin) OR elegant serif
BODY: Minimal, small (10-12px), lots of letter spacing

TARGET VIBE: High Fashion, Runway, Avant-Garde, Vogue Editorial
EMOTIONAL TONE: Aspiration → Desire → Exclusive access

ADAPTIVE BEHAVIOR:
IF e-commerce heavy → Add product filtering/sorting
IF lookbook/editorial → Reduce shopping friction, let imagery lead
IF specific designer → Personalize with designer story
IF seasonal collection → Emphasize limited time

CREATIVE FREEDOM: Invent collection names, fabric descriptions, styling details
RULE: Editorial first, commerce second. Make them want it before showing price.

FINAL: White space is luxury. Don''t fill it just because you can.
', 'Style 1 - Vogue White (Kinetic Editorial)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Streetwear needs attitude. Safe = death. Be bold.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent drop details, limited stock numbers, collaboration hints)
- SCRAPING_DEPTH: DEEP (Infer underground culture, streetwear positioning, hype mechanics)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Flash photography, grain/noise, street culture imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this feel hyped or trying too hard?")

COMPONENTS_LIBRARY:
- VelocityScroll: For "DROP 001 / SOLD OUT" marquee urgency
- 3DCard: For hero product spotlight
- Marquee text: Constantly scrolling notifications
- Noise overlays: Gritty texture

DECISION LOGIC:
- IF hype/limited drops → Emphasize scarcity and FOMO
- IF underground brand → Anti-establishment aesthetic

STYLE_ARCHETYPE: Neo-Brutalist Flash (Streetwear Hype)
REFERENCE INSPIRATION: Supreme, Off-White, underground streetwear culture

HERO COMPOSITION (85vh):
Structure: Flash photography with harsh light
VISUAL: Product shot with hard flash, high contrast
OVERLAY: Noise texture, grain
HEADLINE: [INVENT drop name and status]
  Context: drop, limited, sold out, warning, exclusive
  Examples: "DROP 001 / SOLD OUT" / "RESTOCK FEB 15" / "MEMBERS ONLY"
TYPOGRAPHY: Helvetica Bold (Stretched horizontally, distorted)
CTA: "Join Waitlist" / "Notify Me"

CONTENT SECTIONS (Build 5-6 total):
1. HERO (flash photo + noise + urgency)
2. DROP INFO: What''s releasing, when, how many
3. PRODUCT GRID: Harsh black borders (4px), <VelocityScroll> "Limited Stock" warning
4. LOOKBOOK: Street photography style (candid, flash)
5. ABOUT: Brand manifesto (anti-establishment if applicable)
6. ACCESS: "Join the Community" / Newsletter with benefits

DENSITY: Min 5 sections, 10-15 images (flash photography, street culture), aggressive layout

COLOR STRATEGY: Alert Red with Harsh Black
- Background: Red error (#ff0000) OR black (#000000)
- Text: White (#ffffff)
- Borders: Thick black borders (4px+)
- ADAPTIVE: IF brand has signature color, use it aggressively
- NO SUBTLETY: High contrast only

TYPOGRAPHY:
DISPLAY: Helvetica Bold (stretched/distorted)
LABELS: ALL CAPS, tight spacing
BODY: Minimal, almost invisible

TARGET VIBE: Streetwear, Hypebeast, Underground, Limited Drops
EMOTIONAL TONE: FOMO → Urgency → Desire to belong

ADAPTIVE BEHAVIOR:
IF collaboration detected → Feature partner brand prominently
IF sold out items → Show them anyway with "SOLD OUT" overlay (builds hype)
IF drop calendar → Display upcoming releases
IF membership/community → Emphasize exclusive access

CREATIVE FREEDOM: Invent drop names, stock numbers (keep low for hype), collaboration hints
RULE: Manufactured scarcity is part of the game. Lean into it.

FINAL: Loud, unapologetic, aggressive. If it feels safe, start over.
', 'Style 2 - Underground Flash (Brutalist)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Heritage luxury requires restraint. Less is more. Earn the gold.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent heritage story "Est. 1950", generational craftsmanship details)
- SCRAPING_DEPTH: DEEP (Infer craftsmanship values, materials, legacy positioning)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Macro textures: leather grain, fabric weave, stitching detail)
- SELF_AWARENESS: ENABLED (Question: "Does this feel timeless or costume-y?")

COMPONENTS_LIBRARY:
- TextGenerateEffect: For "The Legacy" storytelling
- BentoGrid: For collection showcase
- Video: Craftsmanship detail footage
- Parallax: Subtle depth

DECISION LOGIC:
- IF true heritage brand → Lead with history
- IF new brand → Focus on craftsmanship and timeless design

STYLE_ARCHETYPE: Heritage Gold (Old Money Luxury)
REFERENCE INSPIRATION: Italian leather houses, Hermès, bespoke tailoring

HERO COMPOSITION (80vh):
Structure: Oil painting aesthetic
VISUAL: Product hero shot with oil painting texture overlay
HEADLINE: [INVENT 2-3 word timeless phrase]
  Context: legacy, timeless, craft, elegance, heritage
  Examples: "TIMELESS ELEGANCE" / "CRAFTED LEGACY" / "ETERNAL STYLE"
TYPOGRAPHY: Serif italic (Baskerville / Bodoni / Italian Old Style)
SUBHEADLINE: "Handcrafted since [YEAR]" (invent if needed)
CTA: "Explore Collection" + "Our Story"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (oil painting texture, elegant serif)
2. THE LEGACY: Heritage story, founding narrative
3. COLLECTION: <BentoGrid> with image + story per piece
4. CRAFTSMANSHIP: Video detail of hands working (stitching, cutting)
5. MATERIALS: Macro shots of leather/fabric with provenance
6. BESPOKE: If applicable, custom/made-to-measure offering
7. CONTACT: "Visit Our Atelier"

DENSITY: Min 6 sections, 14-20 images (macro textures + products + craft), generous spacing

COLOR STRATEGY: Rich Black with Gold Foil
- Background: Rich black (#121212)
- Text: Off-white (#f5f5f5)
- Accent: Gold foil spectrum (#d4af37 to #c5a259)
- Lines/borders: Hairline gold
- ADAPTIVE: IF brand has heritage color, integrate subtly

TYPOGRAPHY:
DISPLAY: Elegant serif italic (Baskerville / Bodoni)
LABELS: Small caps, generous spacing
BODY: Serif for storytelling

TARGET VIBE: Old Money, Italian Leather, Hermès, Bespoke Tailoring
EMOTIONAL TONE: Admiration → Aspiration → Investment mindset

ADAPTIVE BEHAVIOR:
IF founding year found → Use it prominently
IF artisan names available → Feature them
IF bespoke/custom → Emphasize personalization
IF materials are premium → Detail provenance (Italian leather, Japanese denim)

CREATIVE FREEDOM: Invent heritage details, founding stories, artisan generations
RULE: Restraint equals luxury. Gold accents, not gold everything.

FINAL: Timeless over trendy. Every element should age gracefully.
', 'Style 3 - Luxury Heritage (Classic)' FROM ind;

-- =================================================================================================
-- AUTOMOTRIZ (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Engineering precision vs. emotional design. Balance both. Context is king.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent technical specs: HP, 0-60 times, aerodynamics, materials)
- SCRAPING_DEPTH: DEEP (Infer engineering focus, performance positioning, target buyer)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Blueprint wireframes, technical diagrams, precision machinery)
- SELF_AWARENESS: ENABLED (Question: "Does this feel engineered or over-designed?")

COMPONENTS_LIBRARY:
- BentoGrid: For technical specs grid (Engine, Aero, Speed)
- TextGenerateEffect: For "PRECISION ENGINEERING" manifesto
- Animated counters: Numbers counting up (HP, torque)
- 3D model: Wireframe car rotation if applicable

DECISION LOGIC:
- IF performance/racing → Emphasize specs and engineering
- IF luxury/design → Balance beauty and performance

STYLE_ARCHETYPE: Blueprint Technical Bento (German Precision)
REFERENCE INSPIRATION: F1 factories, German engineering, technical manuals

HERO COMPOSITION (90vh):
Structure: Wireframe 3D model rotating
VISUAL: Car as blueprint/wireframe on dark grid background
HEADLINE: [INVENT 2-3 word engineering phrase]
  Context: precision, engineering, performance, power, aero
  Examples: "PRECISION ENGINEERING" / "ENGINEERED POWER" / "AERO PERFECTION"
BACKGROUND: Blueprint grid pattern
ANIMATION: Car rotates slowly, specs appear as annotations
CTA: "Configure Yours" + "View Specs"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (wireframe 3D rotation)
2. TECHNICAL DATA: Scrolling monospace specs in navbar
3. PERFORMANCE: <BentoGrid> showing Engine / Aerodynamics / Speed with animated numbers
4. ENGINEERING STORY: What makes this different (materials, innovation)
5. GALLERY: Detail shots (engine bay, carbon fiber, wheel design)
6. CONFIGURATOR: If applicable, build-your-own
7. CONTACT: "Schedule Test Drive" / "Find Dealer"

DENSITY: Min 6 sections, 12-16 images (technical details, blueprints, precision shots)

COLOR STRATEGY: Technical Blue with Warning Red
- Background: Blueprint blue (#002b5c)
- Lines/Grid: White (#ffffff)
- Text: Off-white
- Accent: Warning red (#ff3333) for performance highlights
- ADAPTIVE: IF brand has racing colors, use them

TYPOGRAPHY:
DISPLAY: Technical monospace (IBM Plex Mono / Courier)
NUMBERS: Tabular, precise alignment
BODY: Clean sans (Inter / Roboto)

TARGET VIBE: F1 Factory, German Engineering, Technical Precision
EMOTIONAL TONE: Admiration → Understanding → Desire to own

ADAPTIVE BEHAVIOR:
IF racing heritage → Add championship wins, track records
IF electric vehicle → Emphasize range, efficiency, tech
IF luxury brand → Balance specs with comfort/luxury features
IF customization available → Interactive configurator

CREATIVE FREEDOM: Invent specs (keep realistic: 400-800 HP range), engineering innovations
RULE: Precision matters. Make numbers and details feel authoritative.

FINAL: Technical but not boring. Make engineering sexy.
', 'Style 1 - Engineering Blueprints (Technical Bento)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Speed is subjective. Adapt to brand personality: refined speed vs. raw power.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent track records, lap times, championship details)
- SCRAPING_DEPTH: DEEP (Infer speed culture: JDM vs. muscle vs. supercar)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Motion blur photography, camera shake effects, speed streaks)
- SELF_AWARENESS: ENABLED (Question: "Does this feel fast or cartoonish?")

COMPONENTS_LIBRARY:
- VelocityScroll: For "NEED FOR SPEED" background kinetic text
- InfiniteMovingCards: For championship wins, race results
- Video backgrounds: Motion blur, camera shake on scroll
- Glitch effects: Speed distortion

DECISION LOGIC:
- IF racing focus → Track records and performance
- IF street culture → Aesthetic and modification culture

STYLE_ARCHETYPE: Raw Speed Blur (Underground Racing)
REFERENCE INSPIRATION: Need for Speed games, JDM culture, racing documentaries

HERO COMPOSITION (95vh):
Structure: Car in motion with extreme blur
VISUAL: Car moving fast, motion blur background, camera shake effect
HEADLINE: [INVENT 2-4 word speed phrase]
  Context: speed, racing, adrenaline, performance, unleashed
  Examples: "NEED FOR SPEED" / "BORN TO RACE" / "VELOCITY UNLEASHED"
ANIMATION: <VelocityScroll> huge text moving with parallax
TYPOGRAPHY: Wide extended sans (stretched horizontally), italic
CTA: "Test Drive" + "Performance Specs"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (motion blur, kinetic text, camera shake)
2. TRACK RECORDS: <InfiniteMovingCards> showing championships, lap times
3. PERFORMANCE: Stats with aggressive presentation (HP, torque, 0-60)
4. GALLERY: Action shots (car in motion, track, dyno)
5. VIDEO SECTION: "Test Drive" with motion blur video background
6. MODS/TUNING: If applicable, customization options
7. CONTACT: "Book Track Day" / "Find Dealer"

DENSITY: Min 5 sections, 10-14 images/videos (all motion, energy, speed)

COLOR STRATEGY: Asphalt Dark with Volt Accent
- Background: Asphalt black (#111111)
- Secondary: Smoke grey (#e6e6e6)
- Accent: Volt yellow/green (#ccff00) OR racing stripe color
- ADAPTIVE: IF brand has racing livery, use those colors

TYPOGRAPHY:
DISPLAY: Wide extended sans, italic, stretched
BODY: Sans (Roboto Condensed / Eurostile)
EMPHASIS: Italic everything for speed feel

TARGET VIBE: JDM Racing, Need for Speed, Underground Culture
EMOTIONAL TONE: Adrenaline → Excitement → Action drive

ADAPTIVE BEHAVIOR:
IF JDM culture → Emphasize tuning, modifications
IF supercar → Luxury + performance balance
IF muscle car → Raw power, sound, heritage
IF track-focused → Lap times, racing pedigree

CREATIVE FREEDOM: Invent race wins, track records (Nürburgring times), speed stats
RULE: Everything should feel kinetic. Static = death.

FINAL: If it doesn''t make your heart race, it''s not fast enough.
', 'Style 2 - Underground Racing (Raw)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Gallery minimalism requires discipline. Every pixel intentional. Trust the car.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent model names, trim levels, configuration options)
- SCRAPING_DEPTH: DEEP (Infer luxury positioning, design language, target collector)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Studio lighting, white cyclorama, infinite floor, perfect reflections)
- SELF_AWARENESS: ENABLED (Question: "Is this letting the car shine or overdesigning?")

COMPONENTS_LIBRARY:
- 3DCard: For main model showcase with depth
- TextGenerateEffect: For "The Art of Motion" philosophy
- Horizontal scroll: Gallery with ample spacing
- Minimal interactions: Let car be the star

DECISION LOGIC:
- IF supercar/luxury → Pure gallery aesthetic
- IF multiple models → Elegant selector/comparison

STYLE_ARCHETYPE: Gallery Studio Minimal (Automotive Art)
REFERENCE INSPIRATION: Art museums, Apple product pages, supercar dealerships

HERO COMPOSITION (85vh):
Structure: Car in white void (cyclorama)
VISUAL: Car in perfect studio lighting, infinite white floor with soft reflections
HEADLINE: [INVENT 2-3 word design/motion phrase]
  Context: art, motion, design, sculpture, form
  Examples: "THE ART OF MOTION" / "SCULPTED SPEED" / "PURE FORM"
TYPOGRAPHY: Extremely thin sans (Helvetica Neue Ultra Light)
NAVBAR: Invisible until hover
CTA: "Configure" + "Reserve"

CONTENT SECTIONS (Build 5-6 total):
1. HERO (white void, perfect lighting, centered car)
2. DESIGN PHILOSOPHY: Manifesto about design language
3. GALLERY: Horizontal scroll with one car per screen, ample white space
4. CONFIGURATOR: <3DCard> showing model with color/option selection
5. DETAILS: Macro shots of design details (curves, lights, interior)
6. CONTACT: "Schedule Private Viewing"

DENSITY: Min 5 sections, 8-12 images (ALL studio quality, lots of white space)

COLOR STRATEGY: Museum White with Minimal Black
- Background: Pure white (#ffffff)
- Shadows: Soft grey (#eeeeee)
- Text: Black, minimal presence (#000000)
- NO ACCENT: Purity is the accent
- Car color: Let it be the only color on page

TYPOGRAPHY:
DISPLAY: Ultra-thin sans (Helvetica Neue Ultra Light / Thin)
BODY: Minimal, small, disappears into background
NUMBERS: Precise, tabular

TARGET VIBE: Supercar Dealership, Art Museum, Automotive Gallery
EMOTIONAL TONE: Awe → Desire → Ownership aspiration

ADAPTIVE BEHAVIOR:
IF multiple models → Comparison tool with specs
IF customization heavy → Interactive 3D configurator
IF limited edition → Emphasize exclusivity, numbering
IF heritage brand → Add design evolution timeline

CREATIVE FREEDOM: Invent model names, design details, materials (carbon fiber, alcantara)
RULE: Restraint is luxury. The car is art. Let it breathe.

FINAL: If you added decoration, remove it. The car decorates itself.
', 'Style 3 - Gallery Studio (Clean)' FROM ind;

-- VERIFICATION
SELECT 
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('gastronomia', 'turismo', 'moda', 'automotriz')
GROUP BY di.name
ORDER BY di.name;
