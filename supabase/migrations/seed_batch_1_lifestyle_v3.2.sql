-- =================================================================================================
-- GOLD MASTER V3.2 - BATCH 1: LIFESTYLE & EXPERIENCE (FULL PROTOCOLS)
-- COMPLETE EDITION: Every prompt has ALL protocols expanded
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

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts - use asymmetric grids (7/5, 8/4, not 6/6)
❌ Uniform card grids where all cards look identical - differentiate at least one
❌ Cyan/blue gradients as primary accent - overused, choose unique palette
❌ Generic rounded buttons without personality
❌ White/solid backgrounds without texture or depth
❌ Stock photo aesthetic in generated images

SELF-CHECK BEFORE EACH SECTION:
1. "Could this section exist on 1000 generic sites?" → If YES, redesign
2. "What makes THIS section unique?" → Must have a specific answer
3. "Would I screenshot this for design inspiration?" → If NO, improve

MEMORABILITY REQUIREMENT:
- Identify ONE element that makes this site unforgettable
- Could be: unique interaction, unexpected layout, custom animation, surprising visual
- If you cannot name it → the design is not done

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL (EDITORIAL CURATION)
-- =============================================================================
STEP 1 - DEEP SCRAPE:
- Extract all factual data: menu items, prices, hours, location, chef name
- Capture brand voice: casual vs fine dining, modern vs traditional
- Note visual identity: colors, photography style from existing site

STEP 2 - EDITORIAL CURATION (Use Judgment):
✅ USE exact prices if found (e.g., "$48" not "market price" if specific)
✅ USE real dish names from menu
✅ SAMPLE selectively (show 4-8 signature dishes, not entire menu)
✅ ELEVATE descriptions without inventing ingredients
❌ DON''T show every menu item - curate the best
❌ DON''T invent dishes if real menu exists
❌ DON''T change factual information

STEP 3 - STRATEGIC GAPS:
- IF no menu found → Invent plausible dishes matching brand/cuisine type
- IF descriptions generic → Improve while keeping dish names
- ALWAYS maintain brand voice consistency

GOLDEN RULE: "Show their best content in the best possible light"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO IMAGE (REQUIRED):
- Generate: Cinematic food moment, moody lighting, chef hands or signature dish
- Style: Editorial gastronomy photography, NOT stock food photos
- Mood: Match the dark, exclusive vibe of this archetype

SUPPORTING IMAGES (4-8):
- Signature dishes with artistic plating
- Atmospheric interior shots (low light, candles, textures)
- Chef portrait if featured
- Ingredient close-ups with texture and steam

SELF-CHECK FOR IMAGES:
- "Would this image appear on a stock photo site?"
- If YES → Regenerate with more specificity and personality
- "Does this match the price point?" → $48 dishes need $48 photography

-- =============================================================================
-- INDUSTRY-SPECIFIC PROMPT
-- =============================================================================

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION (Extract real content first, elevate presentation)
- SCRAPING_DEPTH: DEEP (Infer chef personality, cuisine style, dining philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Dark, moody, exclusive aesthetic)
- SELF_AWARENESS: ENABLED (Question: "Does this feel exclusive or generic?")

COMPONENTS_LIBRARY:
- BentoGrid: For 4-8 signature dishes with visual hierarchy (one featured larger)
- TextGenerateEffect: For chef manifesto or philosophy statement
- VelocityScroll: For kinetic impact phrases
- InfiniteMovingCards: For press mentions or reviews
- 3DCard: For hero dish spotlight

DECISION LOGIC:
- IF menu has 4-6 signature items → BentoGrid with 1 hero larger
- IF extensive menu → Curate best 6-8, use InfiniteMovingCards
- IF single legendary dish → 3DCard spotlight

STYLE_ARCHETYPE: Midnight Theatre (Dark Futurism)
REFERENCE INSPIRATION: Noma, Eleven Madison Park, moody speakeasy

HERO COMPOSITION (90-100vh):
Structure: ASYMMETRIC 7/5 grid - Text section larger, image dramatic
VISUAL: Video loop of [flame/smoke/chef hands] OR hero dish in moody lighting
HEADLINE: [INVENT 2-4 word provocative phrase]
  Context: midnight, ritual, dark, exclusive, sensuality
  Examples: "TASTE THE NIGHT" / "AFTER DARK RITUAL" / "MIDNIGHT HUNGER"
  Typography: Serif + Italic for drama
SUBHEADLINE: Dining philosophy (1-2 sentences)
CTA: "Reserve Experience" + "View Menu"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (asymmetric, dramatic)
2. SOCIAL PROOF: Press/reviews if found
3. MENU SHOWCASE: <BentoGrid> 4-8 dishes - ONE featured larger
4. THE EXPERIENCE: Horizontal scroll journey
5. CHEF STORY: Portrait with bio
6. ATMOSPHERE GALLERY: 6-9 moody shots
7. RESERVATION CTA: Urgency-driven

DENSITY: Min 6 sections, 10-15 images, no 2+ screens without visual

COLOR STRATEGY:
- Background: Deep black (#050505 to #0f0f0f)
- Surface: Charcoal (#1a1a1a to #252525)
- Accent: Ember (#ff4d00 to #ff6b35)
- ADAPTIVE: Use brand colors as accent if scraped

TYPOGRAPHY:
- Display: Dramatic serif (Playfair Display / Cormorant)
- Body: Clean sans (Inter)
- Accents: Italic for emotion

TARGET VIBE: Speakeasy, Michelin Star, Dangerous/Sexy
EMOTIONAL: Intrigue → Appetite → Urgency

ADAPTIVE BEHAVIOR:
IF "family-friendly" detected → ABORT this style
IF chef name found → Feature prominently
IF prices found → Display exact amounts

FINAL: Premium execution of real content beats invented content with generic design.
', 'Style 1 - Midnight Chef (Dark Futurism) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality when needed.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts - use asymmetric grids
❌ Uniform card grids - differentiate cards visually
❌ Cyan/blue gradients - use warm Mediterranean palette
❌ Generic stock food photography
❌ Cold, corporate feeling

SELF-CHECK BEFORE EACH SECTION:
1. "Could this exist on 1000 generic sites?" → Redesign if yes
2. "What makes THIS section unique?" → Need specific answer
3. "Would I screenshot this?" → Improve if no

MEMORABILITY: What''s the ONE unforgettable element?

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - DEEP SCRAPE: Menu, prices, family story, location, hours
STEP 2 - CURATE: Best 4-8 dishes, preserve family heritage if found
STEP 3 - FILL GAPS: Invent only if content missing, maintain warm voice

GOLDEN RULE: "Show their best content in the best light"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Warm, sunlit food or family table scene
SUPPORTING: Rustic textures, golden hour lighting, family moments
SELF-CHECK: "Does this feel like home?" / "No stock vibes?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Family story, regional cuisine, traditions)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Warm, rustic, Mediterranean)

STYLE_ARCHETYPE: Tuscan Warmth (Mediterranean Comfort)
REFERENCE: Italian trattorias, Greek tavernas, warm hospitality

HERO (85-95vh):
Structure: ASYMMETRIC - Warm image (60%) + text overlay
VISUAL: Family table OR signature dish in golden light
HEADLINE: [INVENT warmth phrase]
  Examples: "TASTE OF HOME" / "WHERE FAMILY GATHERS" / "NONNA''S TABLE"
CTA: "Our Story" + "Make Reservation"

SECTIONS (6-8):
1. HERO (warm, inviting)
2. FAMILY STORY: Heritage narrative
3. MENU: <BentoGrid> 4-8 dishes with real names/prices
4. THE TABLE: Communal dining gallery
5. LOCATION: Interior/exterior warmth
6. TESTIMONIALS: Guest stories
7. RESERVATION: Warm CTA

COLOR: Warm cream (#faf8f5), terra cotta (#d4622b), olive (#7c8c54)
TYPOGRAPHY: Warm serif (Lora) + readable sans

VIBE: Nonna''s Kitchen, Local Favorite
EMOTIONAL: Nostalgia → Comfort → Hunger

ADAPTIVE:
IF family story found → Feature prominently
IF reviews found → Quote exactly
IF prices found → Display exact amounts

FINAL: Warmth and authenticity. Real content elevated with love.
', 'Style 2 - Tuscan Warmth (Mediterranean) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered layouts - use bold asymmetry
❌ Uniform grids - create visual drama
❌ Generic blue/cyan - use clinical white with bold accent
❌ Traditional food photography - go abstract, artistic
❌ Boring presentation

SELF-CHECK:
1. "Could this exist on 1000 sites?" → Redesign
2. "What makes this unique?" → Must answer
3. "Would I screenshot?" → Must be yes

MEMORABILITY: ONE avant-garde element that shocks

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Tasting menu, chef vision, innovation approach
STEP 2 - CURATE: Focus on concept, not individual dishes
STEP 3 - GAPS: Invent if needed, match experimental voice

GOLDEN RULE: "Art meets food"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Abstract plating, food as sculpture, lab precision
SUPPORTING: Experimental techniques, chef as artist, process moments
SELF-CHECK: "Is this art or just food?" / "Avant-garde, not pretentious?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Innovation level, molecular gastronomy, concept)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Abstract, clinical, artistic)

STYLE_ARCHETYPE: Avant-Garde Laboratory (Experimental)
REFERENCE: El Bulli, Alinea, molecular gastronomy

HERO (100vh):
Structure: FULL-BLEED with floating elements
VISUAL: Food as sculpture OR chef as artist
HEADLINE: [INVENT conceptual phrase]
  Examples: "FOOD AS ART" / "BEYOND TASTE" / "THE EXPERIMENT"
CTA: "Experience" + "The Process"

SECTIONS (6-8):
1. HERO (avant-garde)
2. PHILOSOPHY: Chef manifesto
3. THE LAB: Creative process
4. TASTING JOURNEY: Horizontal scroll courses
5. INGREDIENTS: Origin stories
6. PRESS: Recognition if found
7. RESERVATION: Limited seating emphasis

COLOR: Clinical white (#ffffff) + single bold accent
TYPOGRAPHY: Ultra-modern sans (Neue Haas / Helvetica Now)

VIBE: Laboratory, Gallery, Conceptual
EMOTIONAL: Curiosity → Wonder → Desire

ADAPTIVE:
IF molecular gastronomy → Full experimental mode
IF tasting menu → Feature journey format
IF awards found → Display prominently

FINAL: Art meets food. Real content with conceptual presentation.
', 'Style 3 - Avant-Garde Lab (Experimental) - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- TURISMO (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric layouts
❌ Generic travel stock photos (couple on beach, passport)
❌ Cyan/blue gradient overuse
❌ Uniform destination cards
❌ Brochure feeling

SELF-CHECK:
1. "Could this be on 1000 travel sites?" → Redesign
2. "What makes THIS destination unique?" → Answer required
3. "Would I screenshot for wanderlust?" → Must be yes

MEMORABILITY: ONE cinematic moment that sparks wanderlust

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Destination, tours, prices, durations, itineraries
STEP 2 - CURATE: Best 4-8 experiences, real destination details
STEP 3 - GAPS: Invent plausible itinerary if missing

GOLDEN RULE: "Show destination magic, not travel logistics"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Cinematic drone shot or golden hour destination moment
SUPPORTING: Diverse travel moments, landscapes, cultural encounters
SELF-CHECK: "National Geographic quality?" / "Not stock travel?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Destination personality, target traveler, experience type)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Cinematic, editorial travel)

STYLE_ARCHETYPE: Wanderlust Cinema (Epic Travel)
REFERENCE: National Geographic, luxury travel magazines

HERO (100vh):
Structure: FULL-BLEED cinematic
VISUAL: Drone shot OR hero traveler moment
HEADLINE: [INVENT destination call]
  Use real destination name if scraped
  Examples: "BEYOND THE HORIZON" / "DISCOVER PATAGONIA" / "YOUR JOURNEY"
CTA: "Plan Your Trip" + "Explore"

SECTIONS (7-9):
1. HERO (cinematic)
2. DESTINATION: Why this place
3. EXPERIENCES: <BentoGrid> 4-8 tours - real names, prices
4. ITINERARY: Sample journey
5. TESTIMONIALS: Traveler stories
6. GALLERY: 8-12 stunning images
7. PRACTICAL: Best time, tips
8. BOOKING CTA

COLOR: Adaptive to destination
- Beach → Turquoise + Sand
- Mountain → Forest + Stone
- Desert → Terracotta + Gold

TYPOGRAPHY: Elegant serif or bold sans by vibe

VIBE: Cinematic Travel Film, Adventure Magazine
EMOTIONAL: Wanderlust → Imagination → Booking

ADAPTIVE:
IF specific destination → Feature prominently
IF prices found → Display exact
IF adventure focus → More dynamic imagery

FINAL: Real destinations, cinematic presentation.
', 'Style 1 - Wanderlust Cinema (Epic Travel) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered layouts, uniform grids
❌ Stock travel photography
❌ Tourist-focused imagery
❌ Corporate travel feeling

SELF-CHECK: Unique? Screenshot-worthy? Authentic feel?

MEMORABILITY: Insider access feeling

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Local experiences, guides, cultural activities
STEP 2 - CURATE: Authentic moments, real local offerings
STEP 3 - GAPS: Invent plausible local experiences

GOLDEN RULE: "Travel like a local"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Authentic local moment (market, artisan, community)
SUPPORTING: Documentary style, local faces, real moments
SELF-CHECK: "Does this feel like insider knowledge?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Local authenticity, hidden gems, community)

STYLE_ARCHETYPE: Local Insider (Authentic Journeys)
REFERENCE: Airbnb Experiences, Anthony Bourdain

HERO (90vh):
Structure: SPLIT - Local scene (60%) + Text (40%)
VISUAL: Authentic local moment
HEADLINE: [INVENT insider phrase]
  Examples: "THE REAL [CITY]" / "BEYOND TOURIST PATH" / "LIKE A LOCAL"
CTA: "Find Experience" + "Meet Guides"

SECTIONS (6-8):
1. HERO (authentic)
2. WHY LOCAL: Philosophy
3. EXPERIENCES: <BentoGrid> authentic activities
4. GUIDES: Local people profiles
5. COMMUNITY IMPACT: How tourism helps
6. TESTIMONIALS: Transformative moments
7. BOOKING

COLOR: Earthy warmth - terracotta, olive, ochre
TYPOGRAPHY: Warm, approachable

VIBE: Documentary, Authentic, Insider
EMOTIONAL: Curiosity → Connection → Commitment

FINAL: Real local content, documentary presentation.
', 'Style 2 - Local Insider (Authentic) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Mass-market travel aesthetic
❌ Generic luxury imagery
❌ Loud, busy layouts
❌ Obvious wealth displays

SELF-CHECK: Whispered exclusivity? Quiet luxury?

MEMORABILITY: Understated elegance

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Premium properties, exclusive access, curated experiences
STEP 2 - CURATE: Show less, imply more
STEP 3 - GAPS: Invent premium details sparingly

GOLDEN RULE: "Less is more in luxury"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Architectural beauty, exclusive access moment
SUPPORTING: Magazine-quality, restrained, elegant
SELF-CHECK: "Does this whisper exclusivity?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Luxury positioning, exclusive access)

STYLE_ARCHETYPE: Luxury Escape (Premium Travel)
REFERENCE: Aman Resorts, Four Seasons

HERO (100vh):
Structure: FULL-BLEED with minimal elegant text
VISUAL: Architectural beauty OR exclusive panorama
HEADLINE: [INVENT understated luxury phrase]
  Examples: "YOUR PRIVATE ESCAPE" / "CURATED PERFECTION" / "WHERE TIME STOPS"
CTA: "Inquire" + "View Collection"

SECTIONS (6-8):
1. HERO (architectural, minimal)
2. PHILOSOPHY: Understated luxury
3. COLLECTION: Elegant property showcase
4. DETAILS: What''s included (subtle)
5. GALLERY: Magazine quality
6. TESTIMONIALS: Discrete
7. PRIVATE INQUIRY

COLOR: Muted - off-white (#fafaf9) OR deep charcoal (#1a1a1a)
Accent: Gold/champagne (#c9b887)
TYPOGRAPHY: Elegant, spaced, minimal

VIBE: Quiet Luxury, Private Collection
EMOTIONAL: Aspiration → Desire → Discrete Inquiry

FINAL: Real premium content, whispered presentation.
', 'Style 3 - Luxury Escape (Premium) - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- MODA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric layouts
❌ Uniform product grids (e-commerce style)
❌ Generic model photography
❌ Blue/cyan color schemes
❌ Catalog feeling

SELF-CHECK: Vogue quality? Editorial not catalog? Screenshot-worthy?

MEMORABILITY: ONE fashion-forward visual moment

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Products, prices, collection names, brand story
STEP 2 - CURATE: 6-12 hero pieces, not full catalog
STEP 3 - GAPS: Invent collection story if needed

GOLDEN RULE: "Fashion over commerce"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Editorial fashion photography, runway style
SUPPORTING: Lookbook shots, detail textures, styling moments
SELF-CHECK: "Would this be in Vogue?" / "Editorial, not catalog?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Brand positioning, target customer, design philosophy)

STYLE_ARCHETYPE: Runway Editorial (High Fashion)
REFERENCE: Vogue editorials, fashion week, Jacquemus

HERO (100vh):
Structure: FULL-BLEED dramatic
VISUAL: Editorial model shot OR product as sculpture
HEADLINE: [Collection name or INVENT]
  Examples: "AUTUMN SOLITUDE" / "THE NEW SILHOUETTE" / "AFTER HOURS"
CTA: "Shop Collection" + "Lookbook"

SECTIONS (6-8):
1. HERO (editorial)
2. COLLECTION STORY: Inspiration
3. LOOKBOOK: <BentoGrid> 6-12 pieces - ONE hero larger
4. CAMPAIGN: Video or mood
5. CRAFTSMANSHIP: Materials, detail
6. RUNWAY/PRESS: If found
7. SHOP CTA

COLOR: Monochrome + single season accent
TYPOGRAPHY: High-fashion (thin, extended, uppercase)

VIBE: Fashion Week, Editorial Shoot
EMOTIONAL: Desire → Aspiration → Purchase

ADAPTIVE:
IF real products → Use exact names/prices
IF collection name → Feature prominently

FINAL: Real products, editorial presentation.
', 'Style 1 - Runway Editorial (High Fashion) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: Avoid corporate fashion, stock models, generic layouts
SELF-CHECK: Authentic? Community feel? Values-driven?
MEMORABILITY: Community connection

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Products, values, sustainability, community
CURATE: Best products + brand story
IMAGES: Lifestyle photography, diverse casting, real moments
CHECK: "Authentic or performative?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Lifestyle Brand (Community Fashion)
REFERENCE: Everlane, Reformation

HERO (90vh):
Structure: ASYMMETRIC lifestyle
VISUAL: Real people wearing product in context
HEADLINE: [INVENT value phrase]
  Examples: "MADE FOR LIVING" / "YOUR EVERYDAY UNIFORM" / "CONSCIOUS STYLE"
CTA: "Shop" + "Our Story"

SECTIONS (6-8):
1. HERO (lifestyle)
2. VALUES: Mission, sustainability
3. SHOP: <BentoGrid> curated products
4. COMMUNITY: Real customers
5. MATERIALS: Transparency
6. TESTIMONIALS: Community voices
7. NEWSLETTER

COLOR: Earth tones, natural palette
TYPOGRAPHY: Friendly, approachable

VIBE: Community Hub, Values-Driven
EMOTIONAL: Connection → Trust → Support

FINAL: Real products + values = authentic brand.
', 'Style 2 - Lifestyle Brand (Community) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for streetwear edge.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: No corporate, no stock, no soft presentation
SELF-CHECK: Street culture? Hype? FOMO?
MEMORABILITY: Drop urgency

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Drops, collabs, cultural positioning
CURATE: Current/upcoming drop focus
IMAGES: Street photography, urban context, hype aesthetic
CHECK: "Culture, not clothes?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Streetwear Drop (Culture Currency)
REFERENCE: Supreme, Palace

HERO (100vh):
Structure: BOLD, LOUD
VISUAL: Product as cultural artifact
HEADLINE: [Drop name or INVENT]
  Examples: "DROP 003" / "SOLD OUT IN 2 MIN" / "CULTURE NOT CLOTHES"
CTA: "Shop Drop" + "Get Notified"

SECTIONS (5-7):
1. HERO (hype)
2. THE DROP: Current products with urgency
3. ARCHIVE: Past drops (credibility)
4. CULTURE: Collabs, community
5. SIGN UP: SMS/email notifications

COLOR: Black + white + one loud accent
TYPOGRAPHY: Bold, condensed, aggressive

VIBE: Drop Culture, FOMO
EMOTIONAL: Urgency → Desire → Act Now

FINAL: Real drops, street culture presentation.
', 'Style 3 - Streetwear Drop (Culture) - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- AUTOMOTRIZ (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Car dealer template layouts
❌ Stock car photos with white background
❌ Centered grids
❌ Generic automotive colors
❌ Brochure feeling

SELF-CHECK: Car magazine quality? Would Porsche approve? Art gallery for cars?

MEMORABILITY: Vehicle as art object

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Models, specs, prices, brand positioning
STEP 2 - CURATE: 1-3 hero vehicles, not full inventory
STEP 3 - GAPS: Invent specs if missing, maintain luxury voice

GOLDEN RULE: "Car as art, not car as product"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Dramatic automotive photography, studio lighting, motion blur
SUPPORTING: Detail shots, interior cockpit, performance moments
SELF-CHECK: "Does this feel like car porn or car lot?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Brand positioning, target buyer, vehicle class)

STYLE_ARCHETYPE: Performance Theatre (Automotive Luxury)
REFERENCE: Porsche.com, BMW Art of Drive

HERO (100vh):
Structure: FULL-BLEED vehicle sculpture
VISUAL: Hero vehicle dramatic lighting or motion
HEADLINE: [Model name or INVENT]
  Examples: "ENGINEERED OBSESSION" / "THE NEW [MODEL]" / "PERFORMANCE REDEFINED"
CTA: "Configure Yours" + "View Specs"

SECTIONS (6-8):
1. HERO (vehicle forward)
2. PERFORMANCE: Specs dramatically presented
3. DESIGN: Detail shots, craftsmanship
4. INTERIOR: Cockpit experience
5. GALLERY: 8-12 editorial images
6. CONFIGURE/PRICING: If applicable
7. TEST DRIVE

COLOR: Deep black (luxury) OR pure white (cleanliness)
Accent: Vehicle color
TYPOGRAPHY: Precision, technical

VIBE: Automotive Art Gallery
EMOTIONAL: Lust → Justification → Inquiry

ADAPTIVE:
IF real model → Use exact specs
IF prices → Display

FINAL: Real vehicles, obsessive presentation.
', 'Style 1 - Performance Theatre (Luxury) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: Car lot vibes, too many vehicles, dated templates
SELF-CHECK: Trust-building? Modern buying experience?
MEMORABILITY: Transparent, hassle-free feeling

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Inventory, prices, financing, process
CURATE: 4-8 featured vehicles, buying process
IMAGES: Clean automotive shots, lifestyle context
CHECK: "Trust or sales pressure?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Trusted Dealer (Elevated Commerce)
REFERENCE: Carvana, modern dealers

HERO (90vh):
Structure: ASYMMETRIC - vehicle + trust message
VISUAL: Featured vehicle or lifestyle
HEADLINE: [INVENT trust phrase]
  Examples: "FIND YOUR DRIVE" / "TRANSPARENT PRICING" / "NO HASSLE"
CTA: "Browse" + "Trade-In Value"

SECTIONS (6-8):
1. HERO (trust)
2. INVENTORY: <BentoGrid> 4-8 vehicles - real specs/prices
3. PROCESS: How buying works
4. FINANCING: Options, calculator
5. TESTIMONIALS: Customer stories
6. VISIT: Location, hours

COLOR: Professional - navy, grey, white
TYPOGRAPHY: Clear, honest

VIBE: Modern Car Buying, Transparency
EMOTIONAL: Skepticism → Trust → Action

FINAL: Real inventory elevated. Trust through transparency.
', 'Style 2 - Trusted Dealer (Commerce) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for collector quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: Modern dealer vibes, casual presentation
SELF-CHECK: Museum quality? Provenance focus? Heritage respect?
MEMORABILITY: Automotive time capsule

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Collection, years, provenance, restoration
CURATE: Hero classics with history
IMAGES: Vintage photography, period setting, patina beauty
CHECK: "Museum worthy?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Collector Gallery (Classic Automotive)
REFERENCE: Sotheby''s auto auctions, classic museums

HERO (100vh):
Structure: MUSEUM - vehicle as artifact
VISUAL: Classic in studio or period setting
HEADLINE: [Era or model]
  Examples: "THE GOLDEN ERA" / "1967 [MODEL]" / "AUTOMOTIVE HERITAGE"
CTA: "View Collection" + "Private Inquiry"

SECTIONS (5-7):
1. HERO (museum)
2. COLLECTION: <BentoGrid> classics with provenance
3. RESTORATION: Process, expertise
4. HISTORY: Timeline
5. PRIVATE SALES: Discrete inquiry

COLOR: Heritage - sepia, B&W, gold accents
TYPOGRAPHY: Classic serif

VIBE: Automotive Museum, Collector''s Vault
EMOTIONAL: Nostalgia → Appreciation → Desire

FINAL: Real collections, museum presentation.
', 'Style 3 - Collector Gallery (Classic) - FULL PROTOCOLS' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('gastronomia', 'turismo', 'moda', 'automotriz')
GROUP BY di.name
ORDER BY di.name;
