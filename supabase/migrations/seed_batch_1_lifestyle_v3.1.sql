-- =================================================================================================
-- GOLD MASTER V3.1 - BATCH 1: LIFESTYLE & EXPERIENCE
-- FINAL EDITION: Creative Autonomy + Design Judgment + Editorial Curation + Asset Generation
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
❌ Centered symmetric hero layouts - use asymmetric grids (7/5, 8/4)
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
- Extract all factual data: prices, hours, addresses, service names, product descriptions
- Capture brand voice: tone, language style, formality level
- Note visual identity: colors, photography style, mood

STEP 2 - EDITORIAL CURATION (Use Judgment):
✅ USE exact factual data (prices, hours, contact info)
✅ USE real service/product names from the site
✅ SAMPLE selectively (show 4-8 items from 20+, curate the best)
✅ ELEVATE presentation without changing facts
❌ DON''T show low-quality content just because it exists
❌ DON''T fill every section if content is weak
❌ DON''T invent new services/products not offered

STEP 3 - STRATEGIC GAPS:
- IF missing content for critical section → Invent plausible, consistent content
- IF scraped content is generic → Improve copy while preserving facts
- ALWAYS maintain brand voice consistency

GOLDEN RULE: "Show their best content in the best possible light"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO IMAGE (REQUIRED):
- Generate high-end photography specific to this industry/brand
- Style: Editorial quality, NOT stock photo aesthetic
- Mood: Match the brand vibe detected from scraping

SUPPORTING IMAGES (3-6):
- Generate contextual images for main services/products
- Match premium aesthetic of hero
- Vary angles and compositions for visual interest

SELF-CHECK FOR IMAGES:
- "Would this image appear on a generic stock photo site?"
- If YES → Regenerate with more specificity and personality
- If NO → Proceed

-- =============================================================================
-- INDUSTRY-SPECIFIC PROMPT
-- =============================================================================

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION (Extract real content first, then elevate presentation)
- SCRAPING_DEPTH: DEEP (Infer chef personality, local food culture, dining philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Food photography: messy plating, steam, texture close-ups)
- SELF_AWARENESS: ENABLED (Question: "Does this feel exclusive or generic?")

COMPONENTS_LIBRARY:
- BentoGrid: For 4-8 signature dishes with hierarchy (one featured larger)
- TextGenerateEffect: For chef manifesto or philosophy statement
- VelocityScroll: For kinetic impact phrases
- InfiniteMovingCards: For press mentions or guest reviews
- 3DCard: For featured dish or reservation card

DECISION LOGIC:
- IF menu has 4-6 signature items → BentoGrid with 1 hero item larger
- IF menu is extensive → InfiniteMovingCards carousel + curated selection
- IF single hero dish → 3DCard spotlight
- IF no menu found → Invent 4-6 plausible dishes matching brand

STYLE_ARCHETYPE: Midnight Theatre (Dark Futurism)
REFERENCE INSPIRATION: Noma (Copenhagen), Eleven Madison Park (NYC), moody speakeasy aesthetics

HERO COMPOSITION (90-100vh):
Structure: ASYMMETRIC - Text on left (60%), Visual on right (40%) with overlap
VISUAL: Video loop showing [flame/smoke/chef hands working/ingredient macro] - choose most impactful
HEADLINE: [INVENT 2-4 word provocative phrase about night dining]
  Context: midnight, danger, sensuality, exclusivity, ritual
  Examples (inspire, don''t copy): "TASTE THE NIGHT" / "AFTER DARK RITUAL" / "MIDNIGHT HUNGER"
  Typography: Serif + Italic mix for personality
SUBHEADLINE: Brief manifesto (1-2 sentences about dining philosophy)
CTA: "Reserve Experience" + "View Menu"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (asymmetric, described above)
2. SOCIAL PROOF: Press logos / Reviews / Michelin stars (if found, else skip)
3. MIDNIGHT MENU SHOWCASE: <BentoGrid> (4-8 dishes) - ONE card featured larger
   Use real dish names if scraped, else invent: "Patagonian Lamb | Smoke & Ash | $48"
4. THE EXPERIENCE: Horizontal scroll storytelling (reservation → courses → finale)
5. CHEF/ORIGIN STORY: Biography with portrait (low-key lighting) - use real name if found
6. SENSORY GALLERY: 6-9 macro food/atmosphere shots
7. RESERVATION CTA: Dark card with urgency

DENSITY: Min 6 sections, 10-15 images, no 2+ screens without visual break

COLOR STRATEGY: Subterranean Dark with Ember Heat
- Background: Deep near-black (#050505 to #0f0f0f range)
- Surface: Charcoal (#1a1a1a to #252525)
- Accent: Ember spectrum (#ff4d00 to #ff6b35)
- ADAPTIVE: IF brand_colors scraped → USE as accent overlay

TYPOGRAPHY: Serif + Italic for headlines, Sans for body
- Display: Dramatic serif (Playfair Display / Cormorant)
- Body: Clean sans (Inter / Public Sans)
- Accents: Italic for emotional emphasis

TARGET VIBE: Speakeasy, Michelin Star, Dangerous/Sexy, Midnight Ritual
EMOTIONAL TONE: Intrigue → Appetite → Urgency

ADAPTIVE BEHAVIOR:
IF "family-friendly" detected → ABORT this style, use warm palette
IF "fine dining" → FULL GO on luxury elements
IF chef name found → Feature prominently as brand hero
IF prices found → Display exact amounts
IF no prices → Omit or use "Price upon request"

CREATIVE FREEDOM: Within the Editorial Curation rules, express maximum creativity in layout and visual treatment. The scraped content is your foundation, not your prison.

FINAL REMINDER: Premium execution of real content beats invented content with generic design. Trust the data, elevate the presentation.
', 'Style 1 - Midnight Chef (Dark Futurism)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: This is GUIDANCE, not rigid rules. Override if needed for Awwwards-level quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts
❌ Uniform card grids where all cards look identical
❌ Cyan/blue gradients as primary accent
❌ Generic rounded buttons
❌ White backgrounds without texture

SELF-CHECK BEFORE EACH SECTION:
1. "Could this exist on 1000 generic sites?" → Redesign if yes
2. "What makes THIS unique?" → Need specific answer
3. "Would I screenshot this?" → Improve if no

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
✅ Extract and use real menu items, prices, chef name, location
✅ Sample the best 4-8 dishes if extensive menu
✅ Preserve exact factual data
❌ Don''t invent if real content exists

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
- Generate warm, inviting food photography
- Mediterranean color warmth with golden hour lighting
- Avoid stock photo aesthetic

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION (Real content first, elevate presentation)
- SCRAPING_DEPTH: DEEP (Infer family legacy, regional cuisine, traditional methods)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Warm sunlit imagery, rustic textures, family moments)
- SELF_AWARENESS: ENABLED (Question: "Does this feel like home?")

COMPONENTS_LIBRARY:
- BentoGrid: Family-style dish spread with hierarchy
- TextGenerateEffect: For family story or heritage statement
- InfiniteMovingCards: For multi-generational recipes or guest testimonials
- Parallax sections: For immersive storytelling

DECISION LOGIC:
- IF family-owned → Feature founders/family prominently
- IF regional specialty → Highlight origin story
- IF casual dining → Warmer, more approachable layout

STYLE_ARCHETYPE: Tuscan Warmth (Mediterranean Comfort)
REFERENCE INSPIRATION: Italian trattorias, Greek tavernas, warm hospitality

HERO COMPOSITION (85-95vh):
Structure: ASYMMETRIC - Image takes 60% with text overlay
VISUAL: Family table scene OR signature dish in golden light
HEADLINE: [INVENT 2-4 word warmth phrase]
  Context: family, tradition, warmth, soul, generations
  Examples: "TASTE OF HOME" / "WHERE FAMILY GATHERS" / "RECIPES FROM NONNA"
SUBHEADLINE: Heritage statement or location pride
CTA: "Our Story" + "Make Reservation"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (warm, inviting, asymmetric)
2. FAMILY/ORIGIN STORY: Multi-generation narrative with real photos if findable
3. MENU HIGHLIGHTS: <BentoGrid> featuring 4-8 signature dishes - real names/prices
4. THE TABLE: Gallery of communal dining moments
5. LOCATION & AMBIANCE: Interior/exterior shots with warmth
6. TESTIMONIALS: <InfiniteMovingCards> guest love stories
7. RESERVATION: Warm CTA with contact info

DENSITY: Min 6 sections, 12-16 images, generous whitespace

COLOR STRATEGY: Mediterranean Warmth
- Background: Warm cream (#faf8f5 to #f5f0e8)
- Surface: Soft white (#ffffff with warm undertone)
- Accent: Terra cotta spectrum (#d4622b to #e07b3c) OR olive green (#7c8c54)
- ADAPTIVE: Use brand colors if scraped

TYPOGRAPHY:
- Display: Warm serif (Lora / Playfair Display)
- Body: Readable sans (Inter / Public Sans)
- Accents: Handwritten touches for personality

TARGET VIBE: Nonna''s Kitchen, Local Favorite, Warm Embrace
EMOTIONAL TONE: Nostalgia → Comfort → Hunger

ADAPTIVE BEHAVIOR:
IF modern cuisine → Blend tradition with contemporary
IF fast casual → Simplify, focus on convenience
IF have real family story → Feature prominently
IF reviews found → Quote exact testimonials

FINAL: Warmth and authenticity. Real content elevated with love.
', 'Style 2 - Tuscan Warmth (Mediterranean)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards-level quality if needed.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric layouts
❌ Uniform grids
❌ Cyan/blue gradients
❌ Stock photo vibes

SELF-CHECK: "Is this unique?" / "Would I screenshot this?"

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION PROTOCOLS
-- =============================================================================
✅ Use real menu, chef, prices if scraped
✅ Generate high-concept, artistic food photography
✅ Curate best 4-6 items for showcase

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer innovation level, chef vision, experimental approach)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Abstract plating, lab-like precision, artistic food)
- SELF_AWARENESS: ENABLED (Question: "Is this avant-garde or pretentious?")

COMPONENTS_LIBRARY:
- BentoGrid: Experimental dishes as art pieces
- 3DCard: Hero dish with rotation
- VelocityScroll: Bold manifesto statements
- Horizontal scroll: Tasting menu journey

STYLE_ARCHETYPE: Avant-Garde Laboratory (Experimental Futurism)
REFERENCE INSPIRATION: El Bulli, Alinea, molecular gastronomy aesthetics

HERO COMPOSITION (100vh):
Structure: FULL-BLEED with floating elements
VISUAL: Abstract food as sculpture OR chef as artist
HEADLINE: [INVENT 2-3 word provocative concept]
  Context: experiment, deconstruct, future, art, boundaries
  Examples: "FOOD AS ART" / "BEYOND TASTE" / "THE EXPERIMENT"
SUBHEADLINE: Chef vision statement
CTA: "Experience" + "The Process"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (full-bleed, avant-garde)
2. PHILOSOPHY: Chef''s artistic manifesto
3. THE LAB: Behind-the-scenes creative process
4. TASTING JOURNEY: Horizontal scroll of courses (real or invented)
5. INGREDIENTS: Origin and inspiration for key elements
6. PRESS & AWARDS: Recognition if found
7. RESERVATION: Limited seating emphasis

DENSITY: Min 6 sections, 10-14 images (artistic, abstract)

COLOR STRATEGY: Clinical White with Accent Pop
- Background: Pure white (#ffffff) OR clinical grey (#f5f5f5)
- Surface: Glass/transparent effects
- Accent: Single bold color (Chef''s choice or brand color)
- ADAPTIVE: Monochrome with one vibrant accent

TYPOGRAPHY:
- Display: Ultra-modern sans (Neue Haas / Helvetica Now)
- Body: Minimal, technical (Inter / Roboto)
- Emphases: ALL CAPS for impact

TARGET VIBE: Laboratory, Gallery, Conceptual Space
EMOTIONAL TONE: Curiosity → Wonder → Desire

ADAPTIVE BEHAVIOR:
IF molecular gastronomy → Full experimental mode
IF tasting menu → Feature journey format
IF chef awards → Display prominently
IF casual → Soften the clinical edge

FINAL: Art meets food. Real content with conceptual presentation.
', 'Style 3 - Avant-Garde Lab (Experimental)' FROM ind;

-- =================================================================================================
-- TURISMO (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: This is GUIDANCE not rigid rules. Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts
❌ Uniform card grids
❌ Cyan/blue gradients as primary
❌ Generic stock travel photos
❌ White backgrounds without texture

SELF-CHECK: "Unique?" / "Screenshot-worthy?" / "Not on 1000 other sites?"

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
✅ Extract real tour names, prices, durations, itineraries
✅ Use actual destination mentioned
✅ Generate cinematic travel photography, not stock
✅ Curate best 4-6 experiences from full catalog

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer destination personality, target traveler, experience type)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Cinematic landscapes, golden hour, adventure moments)
- SELF_AWARENESS: ENABLED (Question: "Does this inspire wanderlust or look like a brochure?")

COMPONENTS_LIBRARY:
- BentoGrid: Destination/experience showcase with hierarchy
- InfiniteMovingCards: Traveler testimonials
- Parallax: Immersive landscape scrolling
- Video backgrounds: Cinematic destination loops

DECISION LOGIC:
- IF luxury travel → Muted elegance, serif typography
- IF adventure travel → Bold, dynamic, action imagery
- IF cultural travel → Warm, authentic, storytelling focus

STYLE_ARCHETYPE: Wanderlust Cinema (Epic Travel)
REFERENCE INSPIRATION: National Geographic, luxury travel magazines, cinematic trailers

HERO COMPOSITION (100vh):
Structure: FULL-BLEED cinematic with text overlay
VISUAL: Drone shot of destination OR hero traveler moment
HEADLINE: [INVENT 2-4 word destination call]
  Context: journey, discover, escape, beyond, horizon
  Examples: "BEYOND THE HORIZON" / "DISCOVER [DESTINATION]" / "YOUR JOURNEY AWAITS"
  Use real destination name if scraped
SUBHEADLINE: What makes this destination unique
CTA: "Plan Your Trip" + "Explore Experiences"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (cinematic, full-bleed)
2. DESTINATION OVERVIEW: Why this place, what makes it special
3. EXPERIENCES: <BentoGrid> 4-8 tours/activities - real names, durations, prices
4. ITINERARY EXAMPLE: Day-by-day journey (if found or create plausible)
5. TESTIMONIALS: <InfiniteMovingCards> traveler stories
6. GALLERY: 8-12 stunning destination images
7. PRACTICAL INFO: Best time to visit, included/excluded, tips
8. BOOKING CTA: Clear call to action with contact

DENSITY: Min 7 sections, 15-20 images (all cinematic quality)

COLOR STRATEGY: Adaptive to Destination
- IF beach/tropical → Turquoise + Sand + Sunset
- IF mountain/adventure → Forest green + Stone + Sky blue
- IF desert → Warm terracotta + Gold + Deep blue
- IF urban → Neutral + Architectural accents
- ALWAYS: One dominant natural color from destination

TYPOGRAPHY:
- Display: Elegant serif (Cormorant / Playfair) OR bold sans (depending on vibe)
- Body: Clean, readable (Inter / Public Sans)
- Location names: Large, impactful

TARGET VIBE: Cinematic Travel Film, Luxury Editorial, Adventure Magazine
EMOTIONAL TONE: Wanderlust → Imagination → Booking

ADAPTIVE BEHAVIOR:
IF specific destination found → Feature prominently
IF multi-destination → Create visual variety
IF adventure focus → More dynamic imagery
IF relaxation focus → Softer, more serene presentation
IF prices found → Display exact, build packages

FINAL: Real destinations, cinematic presentation. Inspire the journey.
', 'Style 1 - Wanderlust Cinema (Epic Travel)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality if needed.

-- DESIGN JUDGMENT + EDITORIAL CURATION + ASSET GENERATION PROTOCOLS:
❌ Never: Centered layouts, uniform grids, stock photos, cyan/blue gradients
✅ Always: Asymmetric layouts, curated real content, specific high-quality images
SELF-CHECK: "Unique? Screenshot-worthy? Not generic?"

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer cultural depth, local authenticity, hidden gems)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Documentary style, local faces, authentic moments)
- SELF_AWARENESS: ENABLED (Question: "Does this feel like insider knowledge?")

STYLE_ARCHETYPE: Local Insider (Authentic Journeys)
REFERENCE INSPIRATION: Airbnb Experiences, Anthony Bourdain style, local community focus

HERO COMPOSITION (90vh):
Structure: SPLIT - Local scene (60%) + Text (40%)
VISUAL: Authentic local moment (market, artisan, community gathering)
HEADLINE: [INVENT phrase about authentic discovery]
  Examples: "THE REAL [CITY]" / "TRAVEL LIKE A LOCAL" / "BEYOND THE TOURIST PATH"
  Use real location if scraped
SUBHEADLINE: Promise of authentic experience
CTA: "Find Your Experience" + "Meet Our Guides"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (authentic, local focus)
2. WHY LOCAL: Philosophy of authentic travel
3. EXPERIENCES: <BentoGrid> 4-6 authentic activities - real if scraped
4. LOCAL GUIDES: Profile the people who lead experiences
5. TESTIMONIALS: Focus on transformative moments
6. COMMUNITY IMPACT: How tourism benefits locals
7. BOOKING: Easy connection to experiences

COLOR STRATEGY: Earthy Authenticity
- Background: Warm natural (#f5f0e8 to #faf8f5)
- Accent: Earth tones (terracotta, olive, ochre)
- ADAPTIVE: Pull colors from local culture/textiles

TYPOGRAPHY: Warm, approachable, not corporate

TARGET VIBE: Documentary, Authentic, Insider Access
EMOTIONAL TONE: Curiosity → Connection → Commitment

FINAL: Real local content, documentary presentation. Authentic over polished.
', 'Style 2 - Local Insider (Authentic)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- PROTOCOLS: Design Judgment + Editorial Curation + Asset Generation
❌ Never: Generic layouts, uniform grids, stock imagery
✅ Always: Premium aesthetic, curated real content, cinematic quality

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer luxury level, exclusive access, premium positioning)
- ASSET_STRATEGY: SPECIFIC_GENERATION (High-fashion travel, architectural beauty, exclusive access)
- SELF_AWARENESS: ENABLED (Question: "Does this whisper exclusivity?")

STYLE_ARCHETYPE: Luxury Escape (Premium Travel)
REFERENCE INSPIRATION: Aman Resorts, Four Seasons, high-end travel publications

HERO COMPOSITION (100vh):
Structure: FULL-BLEED with minimal, elegant text
VISUAL: Architectural beauty OR exclusive panorama
HEADLINE: [INVENT understated luxury phrase]
  Context: exclusive, retreat, sanctuary, curated
  Examples: "YOUR PRIVATE ESCAPE" / "CURATED PERFECTION" / "WHERE TIME STANDS STILL"
SUBHEADLINE: Subtle promise (less is more)
CTA: "Inquire" + "View Collection"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (architectural, minimal text)
2. THE PHILOSOPHY: Understated luxury positioning
3. PROPERTIES/EXPERIENCES: <BentoGrid> elegant showcase - real if scraped
4. DETAILS: What''s included (butler service, transfers, etc.)
5. GALLERY: Magazine-quality images
6. TESTIMONIALS: Discrete, high-profile if possible
7. PRIVATE INQUIRY: Exclusive booking process

COLOR STRATEGY: Muted Luxury
- Background: Off-white (#fafaf9) OR deep charcoal (#1a1a1a)
- Accent: Gold/champagne (#c9b887) OR single muted jewel tone
- Maximum restraint - less is more

TYPOGRAPHY: Elegant, spaced, uppercase headers

TARGET VIBE: Quiet Luxury, Private Collection, Whispered Exclusivity
EMOTIONAL TONE: Aspiration → Desire → Discrete Inquiry

FINAL: Real premium content, whispered presentation. Exclusivity over volume.
', 'Style 3 - Luxury Escape (Premium)' FROM ind;

-- =================================================================================================
-- MODA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Centered layouts, uniform product grids, stock model photos
✅ Always: Editorial layouts, curated collections, runway aesthetics
SELF-CHECK: "Could this be in Vogue?" / "Is this fashion-forward?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real product names, prices, collection names if scraped
✅ Generate editorial fashion photography, not e-commerce style
✅ Curate 6-12 pieces from full catalog

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer brand positioning, target customer, design philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Editorial fashion photography, runway style)
- SELF_AWARENESS: ENABLED (Question: "Is this editorial or catalog?")

STYLE_ARCHETYPE: Runway Editorial (High Fashion)
REFERENCE INSPIRATION: Vogue editorials, fashion week, Jacquemus campaigns

HERO COMPOSITION (100vh):
Structure: FULL-BLEED with dramatic type
VISUAL: Editorial model shot OR product as sculpture
HEADLINE: [Collection name or INVENT fashion statement]
  Context: season, mood, collection name, artistic statement
  Examples: "AUTUMN SOLITUDE" / "THE NEW SILHOUETTE" / "AFTER HOURS"
SUBHEADLINE: Collection philosophy
CTA: "Shop Collection" + "View Lookbook"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (full-bleed editorial)
2. COLLECTION STORY: Design inspiration and philosophy
3. LOOKBOOK: <BentoGrid> 6-12 key pieces - real names/prices if scraped
4. CAMPAIGN VIDEO: If available, or mood imagery
5. DETAILS: Craftsmanship, materials, process
6. RUNWAY/PRESS: If found, recognition
7. SHOP CTA: Clean, fashion-forward

COLOR STRATEGY: Monochrome with Accent
- Black & white base with single season color
- ADAPTIVE: Pull from collection colors if scraped

TYPOGRAPHY: High-fashion (thin extended, uppercase, tracked)

TARGET VIBE: Fashion Week, Editorial Shoot, Designer Flagship
EMOTIONAL TONE: Desire → Aspiration → Purchase

FINAL: Real products, editorial presentation. Fashion over commerce.
', 'Style 1 - Runway Editorial (High Fashion)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- PROTOCOLS: Design Judgment + Editorial Curation + Asset Generation
❌ Never: Generic layouts, stock photos
✅ Always: Lifestyle integration, curated products, authentic casting

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer brand values, sustainability, community focus)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Lifestyle photography, diverse casting, real moments)
- SELF_AWARENESS: ENABLED (Question: "Does this feel authentic or performative?")

STYLE_ARCHETYPE: Lifestyle Brand (Community Fashion)
REFERENCE INSPIRATION: Everlane, Reformation, community-driven fashion

HERO COMPOSITION (90vh):
Structure: ASYMMETRIC lifestyle scene
VISUAL: Real people in real contexts wearing product
HEADLINE: [INVENT value-driven phrase]
  Examples: "MADE FOR LIVING" / "YOUR EVERYDAY UNIFORM" / "CONSCIOUS STYLE"
SUBHEADLINE: Brand mission or value statement
CTA: "Shop Now" + "Our Story"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (lifestyle, authentic)
2. VALUES: Brand mission, sustainability, ethics
3. SHOP: <BentoGrid> curated products with real pricing
4. COMMUNITY: Real customers, user-generated feel
5. MATERIALS/PROCESS: Transparency about making
6. TESTIMONIALS: Community voices
7. NEWSLETTER: Community membership

COLOR STRATEGY: Natural, Approachable
- Earth tones, neutral palette
- ADAPTIVE: Brand colors if found

TYPOGRAPHY: Friendly, approachable, modern

VIBE: Neighborhood Store, Community Hub, Values-Driven
EMOTIONAL: Connection → Trust → Support

FINAL: Real products + values = authentic brand presentation.
', 'Style 2 - Lifestyle Brand (Community)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for streetwear edge.

-- PROTOCOLS: Asymmetric, bold, culture-forward
❌ Never: Corporate layouts, stock images
✅ Always: Street culture aesthetic, limited-drop urgency

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer cultural positioning, collaborations, drop model)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Street photography, urban context, hype aesthetic)

STYLE_ARCHETYPE: Streetwear Drop (Culture Currency)
REFERENCE INSPIRATION: Supreme, Palace, streetwear culture

HERO COMPOSITION (100vh):
Structure: BOLD, LOUD, UNAPOLOGETIC
VISUAL: Product as cultural artifact OR street context
HEADLINE: [Product name or INVENT hype phrase]
  Examples: "DROP 003" / "SOLD OUT IN 2 MINUTES" / "CULTURE NOT CLOTHES"
SUBHEADLINE: Scarcity or cultural statement
CTA: "Shop Drop" + "Get Notified"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (loud, cultural)
2. THE DROP: Current/upcoming products with countdown if applicable
3. ARCHIVE: Past drops, sold-out items (credibility)
4. CULTURE: Collaborations, community, cultural moments
5. SIGN UP: SMS/email for drop notifications

COLOR STRATEGY: Bold Contrast
- Black + white + one loud accent
- ADAPTIVE: Brand palette

TYPOGRAPHY: Bold, condensed, aggressive

VIBE: Drop Culture, Street Currency, FOMO
EMOTIONAL: Urgency → Desire → Act Now

FINAL: Real drops, street culture presentation. Hype over polish.
', 'Style 3 - Streetwear Drop (Culture)' FROM ind;

-- =================================================================================================
-- AUTOMOTRIZ (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Car dealer template layouts, stock car photos, centered grids
✅ Always: Automotive editorial, cinematic presentation, hero vehicle focus
SELF-CHECK: "Is this car magazine quality?" / "Would Porsche approve?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real model names, specs, prices if scraped
✅ Generate automotive photography: dramatic lighting, detail shots, motion
✅ Feature 1-3 hero vehicles prominently

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer brand positioning, target customer, vehicle specialization)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Automotive editorial, studio lighting, motion blur)
- SELF_AWARENESS: ENABLED (Question: "Does this feel like car porn or car lot?")

STYLE_ARCHETYPE: Performance Theatre (Automotive Luxury)
REFERENCE INSPIRATION: Porsche.com, BMW Art of Drive, automotive photography

HERO COMPOSITION (100vh):
Structure: FULL-BLEED vehicle as sculpture
VISUAL: Hero vehicle in dramatic lighting or motion
HEADLINE: [Model name or INVENT performance phrase]
  Context: power, precision, evolution, engineered
  Examples: "ENGINEERED OBSESSION" / "THE NEW [MODEL]" / "PERFORMANCE REDEFINED"
SUBHEADLINE: Key spec or philosophy statement
CTA: "Configure Yours" + "View Specs"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (cinematic, vehicle-forward)
2. PERFORMANCE: Key specs in dramatic presentation
3. DESIGN: Detail shots, craftsmanship focus
4. INTERIOR: Cockpit as experience
5. GALLERY: 8-12 editorial images
6. CONFIGURE/PRICING: If applicable
7. CONTACT: Test drive or inquiry

COLOR STRATEGY: Vehicle-Driven
- Background: Deep black (luxury) OR pure white (cleanliness)
- Accent: Vehicle color or brand color
- Minimal palette, maximum focus on car

TYPOGRAPHY: Precision, technical, spaced

VIBE: Automotive Art Gallery, Performance Documentation
EMOTIONAL: Lust → Justification → Inquiry

FINAL: Real vehicles, obsessive presentation. Car as art piece.
', 'Style 1 - Performance Theatre (Luxury Auto)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- PROTOCOLS: Trust-focused, dealership elevated
✅ Use real inventory, prices, financing if scraped
✅ Generate approachable automotive photography
❌ Avoid: Car lot vibes, too many vehicles cluttering

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer dealership type, brand portfolio, buying process)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Clean automotive shots, lifestyle context)

STYLE_ARCHETYPE: Trusted Dealer (Elevated Commerce)
REFERENCE INSPIRATION: Carvana, modern dealership experiences

HERO COMPOSITION (90vh):
Structure: ASYMMETRIC with vehicle + value prop
VISUAL: Featured vehicle or lifestyle context
HEADLINE: [INVENT trust-building phrase]
  Examples: "FIND YOUR DRIVE" / "TRANSPARENT PRICING" / "YOUR NEXT RIDE"
SUBHEADLINE: What makes buying here different
CTA: "Browse Inventory" + "Trade-In Value"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (vehicle + trust elements)
2. FEATURED INVENTORY: <BentoGrid> 4-8 vehicles - real specs/prices
3. BUYING PROCESS: How it works, transparency
4. FINANCING: Options, calculator if applicable
5. TESTIMONIALS: Customer stories
6. VISIT: Location, hours, contact

COLOR STRATEGY: Clean, Trustworthy
- Professional palette: navy, grey, white
- Brand accent if applicable

TYPOGRAPHY: Clear, honest, approachable

VIBE: Modern Car Buying, Transparent, No Hassle
EMOTIONAL: Skepticism → Trust → Action

FINAL: Real inventory elevated. Trust through transparency.
', 'Style 2 - Trusted Dealer (Commerce)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for collector aesthetic.

-- PROTOCOLS: Gallery/museum presentation
✅ Use real vehicle details if classic/collection
✅ Generate vintage automotive photography
❌ Avoid: Modern dealer vibes

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer collection focus, era, restoration expertise)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Vintage photography, heritage moments, patina beauty)

STYLE_ARCHETYPE: Collector Gallery (Classic Automotive)
REFERENCE INSPIRATION: Classic car museums, Sotheby''s auto auctions

HERO COMPOSITION (100vh):
Structure: MUSEUM presentation - vehicle as artifact
VISUAL: Classic vehicle in studio or period setting
HEADLINE: [Era or INVENT heritage phrase]
  Examples: "THE GOLDEN ERA" / "AUTOMOTIVE HERITAGE" / "1967 [MODEL]"
SUBHEADLINE: Historical significance or provenance
CTA: "View Collection" + "Private Inquiry"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (museum quality)
2. COLLECTION: <BentoGrid> 4-8 vehicles with provenance
3. RESTORATION: Process and expertise
4. HISTORY: Timeline of automotive heritage
5. PRIVATE SALES: Discrete inquiry process

COLOR STRATEGY: Heritage Elegance
- Sepia/warm tones OR classic black & white
- Gold accents for luxury
- Period-appropriate feel

TYPOGRAPHY: Classic, refined, serif

VIBE: Automotive Museum, Collector''s Vault, Heritage Preservation
EMOTIONAL: Nostalgia → Appreciation → Desire

FINAL: Real collections, museum presentation. Heritage as asset.
', 'Style 3 - Collector Gallery (Classic)' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('gastronomia', 'turismo', 'moda', 'automotriz')
GROUP BY di.name
ORDER BY di.name;
