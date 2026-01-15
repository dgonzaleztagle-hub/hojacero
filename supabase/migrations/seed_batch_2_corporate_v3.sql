-- =================================================================================================
-- GOLD MASTER V3.0 - BATCH 2: CORPORATE & PROFESSIONAL
-- ARCHITECTURE: CREATIVE AUTONOMY + ADAPTIVE INTELLIGENCE + INFINITE VARIABILITY
-- =================================================================================================

DELETE FROM demo_prompts WHERE industry_id IN (
    SELECT id FROM demo_industries WHERE slug IN ('legal', 'real-estate', 'tech', 'consultoria')
);

-- =================================================================================================
-- LEGAL (3 STYLES)
-- =================================================================================================

-- LEGAL - STYLE 1: SWISS AUTHORITY
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'legal')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: This is GUIDANCE, not rigid rules. Override if needed for Awwwards-level quality.
--     HIERARCHY: Brand context > Your judgment > This prompt
--     QUESTION: "Would this win Site of the Day on Awwwards?"

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent case types, legal specializations, firm credentials)
- SCRAPING_DEPTH: DEEP (Infer firm positioning: boutique vs. full-service, practice areas, client type)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Professional portraits, office architecture, legal imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this feel authoritative or intimidating?")

COMPONENTS_LIBRARY:
- BentoGrid: For practice areas or attorney profiles
- TextGenerateEffect: For firm manifesto or values
- InfiniteMovingCards: For case results or client testimonials
- Minimal layouts: Clean, serious, professional

DECISION LOGIC:
- IF boutique firm (1-5 attorneys) → Emphasize personal attention and expertise
- IF full-service firm → Showcase breadth of practice areas
- IF litigation focus → Highlight case wins and trial experience

STYLE_ARCHETYPE: Swiss Authority (Minimalist Power)
REFERENCE INSPIRATION: Swiss banking minimalism, law library aesthetics, corporate boardrooms

HERO COMPOSITION (85vh):
Structure: Minimal geometric layout
VISUAL: Architectural photo (law library, modern office, justice scales macro)
HEADLINE: [INVENT 2-3 word authority statement]
  Context: justice, defense, counsel, advocate, protect
  Examples: "JUSTICE REFINED" / "YOUR DEFENSE" / "LEGAL PRECISION"
  Adapt to firm personality (aggressive litigator vs. trusted counselor)
SUBHEADLINE: Practice areas or firm tagline (1 sentence)
CTA: "Schedule Consultation" + "Our Expertise"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (minimal, authoritative)
2. PRACTICE AREAS: <BentoGrid> of specializations with icons
3. ATTORNEY PROFILES: Professional headshots with credentials
4. CASE RESULTS: Notable wins or settlements (if litigation-focused)
5. CLIENT TESTIMONIALS: <InfiniteMovingCards> with corporate/individual quotes
6. CONSULTATION PROCESS: What to expect timeline
7. CONTACT: Multiple options (phone, form, office locations)

DENSITY: Min 6 sections, 8-12 images (professional photography), generous white space

COLOR STRATEGY: Authority Neutral with Accent
- Background: Pure white (#ffffff) OR warm grey (#f7f7f7)
- Text: Deep charcoal (#1a1a1a to #2b2b2b)
- Accent: Adaptive based on practice area
  IF litigation/criminal → Bold red spectrum (#c41e3a to #8b0000)
  IF corporate/transactional → Navy blue spectrum (#001f3f to #002b5c)
  IF boutique/family → Warm grey/gold spectrum (#a89968 to #8b7355)
- Lines/borders: Hairline dark grey

TYPOGRAPHY:
DISPLAY: Elegant serif (Garamond / Baskerville / Playfair)
LABELS: Sans caps (Inter / Helvetica)
BODY: Serif for readability and authority

TARGET VIBE: Law Library, Swiss Banking, Boardroom Confidence
EMOTIONAL TONE: Trust → Confidence → Action (contact)

ADAPTIVE BEHAVIOR:
IF "criminal defense" detected → More aggressive positioning, trial focus
IF "corporate law" → Emphasize business partnership, transactions
IF "family law" → Softer approach, empathy, mediation
IF individual attorney/solo practice → Personal brand over firm
IF multiple office locations → Add location selector

CREATIVE FREEDOM: Invent case types won, bar admissions, years of experience
RULE: Authority comes from restraint, not decoration.

FINAL REMINDER: Clean, professional, authoritative. No gimmicks. If it looks like a personal injury billboard → YOU FAILED.
', 'Style 1 - Swiss Authority (Minimal)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Legal drama meets modern design. Override for firm personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent trial results, settlements, case narratives)
- SCRAPING_DEPTH: DEEP (Infer trial approach: aggressive vs. strategic, client testimonials)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Cinematic courtroom imagery, dramatic portraits, motion graphics)
- SELF_AWARENESS: ENABLED (Question: "Does this feel powerful or cheesy?")

COMPONENTS_LIBRARY:
- VelocityScroll: For impact statements ("$10M RECOVERED")
- TextGenerateEffect: For attorney bios with gravitas
- BentoGrid: For case categories
- Video backgrounds: Subtle motion

DECISION LOGIC:
- IF high-profile litigation → Lead with victories and media presence
- IF class action → Emphasize scale and impact

STYLE_ARCHETYPE: Cinematic Legal Drama (Bold Impact)
REFERENCE INSPIRATION: HBO legal dramas, investigative journalism aesthetics

HERO COMPOSITION (90vh):
Structure: Dark dramatic with powerful statement
VISUAL: Cinematic B&W portrait of lead attorney OR courtroom perspective
HEADLINE: [INVENT 2-4 word power statement]
  Context: fight, win, justice, advocate, relentless
  Examples: "WE FIGHT TO WIN" / "JUSTICE SERVED" / "YOUR LEGAL WEAPON"
TYPOGRAPHY: Bold extended sans (stretched horizontally)
CTA: "Free Consultation" + "Our Wins"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (dramatic, high contrast)
2. TRACK RECORD: <VelocityScroll> with verdicts/settlements ("$15M WON")
3. PRACTICE FOCUS: What cases we take (filters out weak cases)
4. ATTORNEY ARSENAL: Team with trial experience highlighted
5. CASE STUDIES: 2-3 detailed victory narratives
6. VIDEO: "Meet the Team" or client testimonial
7. CONSULTATION: Urgency ("Don''t wait, statute of limitations")

DENSITY: Min 6 sections, 10-14 images/videos (cinematic, dramatic)

COLOR STRATEGY: Courtroom Drama Dark
- Background: Deep charcoal (#121212 to #1a1a1a)
- Text: Off-white (#f0f0f0)
- Accent: Justice gold (#d4af37) OR verdict red (#c41e3a)
- ADAPTIVE: IF plaintiff firm → Red (aggression), IF defense → Gold (prestige)

TYPOGRAPHY:
DISPLAY: Bold extended sans (Helvetica Bold Condensed)
NUMBERS: Large, impactful (verdicts/settlements)
BODY: Clean sans

TARGET VIBE: Legal Thriller, Investigative Journalism, Courtroom Power
EMOTIONAL TONE: Urgency → Confidence → Relief

ADAPTIVE BEHAVIOR:
IF personal injury → Lead with settlement amounts
IF criminal defense → Highlight acquittals and reduced charges
IF class action → Show impact scale (number of clients represented)
IF contingency fee → Emphasize "No Win No Fee"

CREATIVE FREEDOM: Invent case wins, settlement amounts (keep realistic), client quotes
RULE: Bold but credible. Confidence, not arrogance.

FINAL: If it doesn''t make them want to call immediately, dial up the impact.
', 'Style 2 - Legal Drama (Cinematic)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Technology meets legal precision. Adapt to firm tech-savviness.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent digital case management features, tech advantages)
- SCRAPING_DEPTH: DEEP (Infer tech adoption: client portals, e-discovery, remote consultations)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Tech interface mockups, data visualization, modern office spaces)
- SELF_AWARENESS: ENABLED (Question: "Does this feel innovative or gimmicky?")

COMPONENTS_LIBRARY:
- 3DCard: For service offerings with depth
- BentoGrid: For technology features
- Animated data viz: Case flowcharts, success rates

DECISION LOGIC:
- IF tech-forward firm → Showcase client portal, virtual consultations
- IF traditional firm going modern → Balance heritage with innovation

STYLE_ARCHETYPE: TechLaw Interface (Digital Precision)
REFERENCE INSPIRATION: LegalTech startups, SaaS legal platforms, modern corporate offices

HERO COMPOSITION (80vh):
Structure: Interface-inspired layout
VISUAL: Abstract legal tech imagery (data patterns, interface elements)
HEADLINE: [INVENT 2-4 word tech-legal fusion]
  Context: precision, digital, modern, efficient, transparent
  Examples: "LEGAL EVOLVED" / "PRECISION ADVOCACY" / "TECH MEETS LAW"
TYPOGRAPHY: Modern geometric sans (Neue Haas / Suisse)
CTA: "Book Virtual Consult" + "Client Portal Access"

CONTENT SECTIONS (Build 6-7 total):
1. HERO (tech-forward, clean)
2. OUR APPROACH: How technology enhances legal service
3. PRACTICE AREAS: Interactive cards with case type selectors
4. TECHNOLOGY: Client portal demo, document tracking, transparent billing
5. TEAM: Modern attorney profiles with LinkedIn integration
6. TRANSPARENT PRICING: Clear fee structures (if applicable)
7. CONTACT: Multi-channel (chat, video, phone, form)

DENSITY: Min 6 sections, 10-12 images (modern, tech-focused), clean spacing

COLOR STRATEGY: Tech Legal Gradient
- Background: Light grey (#f5f5f5)
- Cards: White (#ffffff)
- Text: Dark charcoal (#1a1a1a)
- Accent: Tech blue gradient (#0066ff to #0099ff)
- ADAPTIVE: IF corporate tech clients → Match their industry colors

TYPOGRAPHY:
DISPLAY: Modern geometric sans (Neue Haas / Inter Display)
BODY: Clean sans (Inter / Roboto)
LABELS: Monospace for data points

TARGET VIBE: LegalTech Startup, SaaS Platform, Modern Corporate Office
EMOTIONAL TONE: Innovation → Trust → Efficiency

ADAPTIVE BEHAVIOR:
IF client portal exists → Feature it prominently with demo
IF remote consultations offered → Highlight virtual meeting capabilities
IF e-billing → Show transparent pricing dashboard
IF younger attorneys → Emphasize modern approach vs. old-school firms

CREATIVE FREEDOM: Invent tech features, portal capabilities, efficiency metrics
RULE: Modern but professional. Innovation enhances law, doesn''t replace it.

FINAL: Clean, efficient, trustworthy. If it feels like a startup over a law firm, tone it down.
', 'Style 3 - TechLaw (Digital)' FROM ind;

-- =================================================================================================
-- REAL ESTATE (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Luxury real estate varies by market. NYC ≠ Miami ≠ LA. Adapt accordingly.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent luxury property details, neighborhood guides, agent credentials)
- SCRAPING_DEPTH: DEEP (Infer market positioning: luxury vs. volume, buyer vs. seller focus)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Architectural photography, drone aerials, lifestyle imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this evoke aspiration or generic real estate?")

COMPONENTS_LIBRARY:
- BentoGrid: For featured properties masonry layout
- InfiniteMovingCards: For agent testimonials or sold properties
- 3DCard: For flagship property showcase
- Map integrations: Property locations

DECISION LOGIC:
- IF luxury real estate → Emphasize exclusivity, white-glove service
- IF volume/residential → Accessible, transparent, helpful
- IF commercial → ROI focus, investment potential

STYLE_ARCHETYPE: Architectural Luxury (Editorial Property)
REFERENCE INSPIRATION: Architectural Digest, luxury real estate magazines, Sotheby''s Realty

HERO COMPOSITION (100vh):
Structure: Full-bleed property hero
VISUAL: Stunning architectural shot (exterior/interior of luxury property)
HEADLINE: [INVENT 2-4 word luxury living statement]
  Context: home, luxury, estate, exclusive, elevated
  Examples: "ELEVATED LIVING" / "LUXURY REDEFINED" / "YOUR SANCTUARY"
  Adapt to market (urban penthouse vs. coastal estate)
SUBHEADLINE: Market area or agent tagline
CTA: "View Portfolio" + "Schedule Showing"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (full-bleed luxury property)
2. FEATURED PROPERTIES: <BentoGrid> masonry of listings
3. NEIGHBORHOOD GUIDE: Area highlights, amenities, lifestyle
4. AGENT PROFILE: Credentials, sales record, market expertise
5. SOLD PORTFOLIO: <InfiniteMovingCards> of recent sales with prices
6. MARKET INSIGHTS: Local trends, property values
7. CLIENT TESTIMONIALS: Buyer/seller experiences
8. CONTACT: Multiple touchpoints (showing request, valuation, consultation)

DENSITY: Min 7 sections, 20-30 images (property photography, lifestyle, aerials)

COLOR STRATEGY: Luxury Neutral with Gold Accent
- Background: Pure white (#ffffff) OR warm beige (#faf8f5)
- Text: Deep charcoal (#1a1a1a)
- Accent: Gold foil spectrum (#d4af37 to #b8960f)
- Lines/borders: Hairline gold
- ADAPTIVE: IF beachfront market → Add ocean blues, IF urban → Sophisticated greys

TYPOGRAPHY:
DISPLAY: Elegant serif (Playfair / Lora / Bodoni)
BODY: Clean sans (Inter / Public Sans)
PRICE DISPLAY: Large, prominent, elegant

TARGET VIBE: Architectural Digest, Sotheby''s Realty, Luxury Lifestyle
EMOTIONAL TONE: Aspiration → Desire → Inquiry

ADAPTIVE BEHAVIOR:
IF luxury focus → Lead with flagship properties, emphasize exclusivity
IF residential volume → Show transparency, neighborhood data, affordability
IF commercial → ROI metrics, cap rates, investment potential
IF buyer''s agent → Home finding process, market knowledge
IF seller''s agent → Marketing strategy, sales record

CREATIVE FREEDOM: Invent property details, neighborhood amenities, sales records
RULE: Aspirational yet approachable. Luxury accessible, not alienating.

FINAL REMINDER: Property photography is everything. If images don''t sell the dream, copy won''t save it.
', 'Style 1 - Architectural Luxury (Editorial)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Modern real estate with interactive discovery. Override for agent style.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent property specs, virtual tour features, search filters)
- SCRAPING_DEPTH: DEEP (Infer tech adoption: virtual tours, 3D walkthroughs, AI search)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Interactive property cards, map interfaces, lifestyle vignettes)
- SELF_AWARENESS: ENABLED (Question: "Is this user-friendly or overwhelming?")

COMPONENTS_LIBRARY:
- Interactive map: Property locations with pop-up cards
- 3DCard: Property previews with flip interaction
- Search filters: Dynamic property finding
- Virtual tour embeds

DECISION LOGIC:
- IF tech-forward agency → Interactive property search, virtual tours
- IF traditional agent → Simple gallery with contact focus

STYLE_ARCHETYPE: Interactive Property Map (Discovery-Driven)
REFERENCE INSPIRATION: Zillow, Airbnb Experiences, modern PropTech platforms

HERO COMPOSITION (90vh):
Structure: Interactive map or property carousel
VISUAL: Animated map of service area with property pins OR hero carousel
HEADLINE: [INVENT 2-3 word discovery statement]
  Context: find, discover, home, search, dream
  Examples: "FIND YOUR HOME" / "DREAM DISCOVERED" / "HOME AWAITS"
INTERACTION: Click pins to preview properties, drag to explore
CTA: "Start Search" + "Browse Listings"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (interactive map or carousel)
2. SMART SEARCH: Filters (price, beds, neighborhood, amenities)
3. FEATURED LISTINGS: <3DCard> grid with flip for details
4. VIRTUAL TOURS: Embedded 3D walkthroughs of select properties
5. NEIGHBORHOOD EXPLORER: Area guides with lifestyle photos
6. WHY CHOOSE US: Agent value proposition
7. TESTIMONIALS: Recent buyers/sellers
8. CONTACT: Simple form with immediate response promise

DENSITY: Min 6 sections, 15-25 images (properties, neighborhoods, lifestyle)

COLOR STRATEGY: Friendly Modern with Trust Blue
- Background: Soft white (#fafafa)
- Cards: Pure white (#ffffff)
- Text: Charcoal (#2b2b2b)
- Accent: Trust blue spectrum (#0066cc to #0052a3)
- ADAPTIVE: IF coastal → Ocean blues, IF urban → City greys, IF suburban → Greens

TYPOGRAPHY:
DISPLAY: Friendly modern sans (Inter / Circular)
BODY: Clean sans for readability
PRICE: Bold, clear, consistent format

TARGET VIBE: Zillow, Airbnb, Modern PropTech, User-Friendly
EMOTIONAL TONE: Exploration → Discovery → Connection

ADAPTIVE BEHAVIOR:
IF virtual tours available → Feature them prominently
IF buyer focus → Emphasize search and discovery
IF seller focus → Show marketing reach and sold examples
IF multiple agents → Team profiles with specializations
IF specific neighborhood expert → Hyperlocal market data

CREATIVE FREEDOM: Invent search features, virtual tour capabilities, property details
RULE: User experience first. Make finding home feel intuitive, not overwhelming.

FINAL: Interactive but not gimmicky. Technology serves discovery, not distraction.
', 'Style 2 - Interactive Map (Discovery)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Investment-focused real estate. Numbers tell the story. Adapt to investor type.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent ROI metrics, cap rates, market trends, investment analysis)
- SCRAPING_DEPTH: DEEP (Infer investor focus: commercial, multi-family, flip, rental income)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Data visualizations, market charts, property financials)
- SELF_AWARENESS: ENABLED (Question: "Is this data-rich or data-overload?")

COMPONENTS_LIBRARY:
- BentoGrid: For investment properties with financial snapshots
- Animated charts: Market trends, ROI projections
- Data tables: Property comparisons
- Minimal text: Numbers speak

DECISION LOGIC:
- IF commercial real estate → Cap rates, NOI, tenant profiles
- IF residential investment → Rental yields, appreciation potential
- IF house flipping → ARV calculations, rehab ROI

STYLE_ARCHETYPE: Investment Dashboard (Data-Driven)
REFERENCE INSPIRATION: Bloomberg Terminal, financial dashboards, investment platforms

HERO COMPOSITION (85vh):
Structure: Dashboard layout with key metrics
VISUAL: Skyline or property with overlaid data points
HEADLINE: [INVENT 2-3 word investment statement]
  Context: returns, invest, yield, growth, portfolio
  Examples: "INVEST SMART" / "ROI MAXIMIZED" / "WEALTH BUILT"
METRICS OVERLAY: Key stats (avg cap rate, YoY growth, properties sold)
CTA: "Investment Portfolio" + "Market Analysis"

CONTENT SECTIONS (Build 6-7 total):
1. HERO (dashboard with metrics overlay)
2. INVESTMENT PROPERTIES: <BentoGrid> with financial snapshots (cap rate, NOI, price)
3. MARKET ANALYSIS: Charts showing trends, appreciation, rent growth
4. ROI CALCULATOR: Interactive tool for investment scenarios
5. CASE STUDIES: Successful investment examples with actual numbers
6. WHY US: Investment expertise, track record
7. CONSULTATION: Schedule investment strategy session

DENSITY: Min 6 sections, 12-18 visuals (properties, charts, data viz)

COLOR STRATEGY: Financial Trust with Growth Green
- Background: Dark grey (#1e1e1e) OR white (#ffffff)
- Cards: Contrasting (white on dark, dark on white)
- Text: High contrast
- Accent: Growth green (#00cc66) for positive metrics, Red (#ff3333) for alerts
- ADAPTIVE: Professional financial palette

TYPOGRAPHY:
DISPLAY: Bold geometric sans (Inter Bold / Helvetica)
NUMBERS: Monospace tabular (IBM Plex Mono) for financial data
BODY: Clean sans

TARGET VIBE: Bloomberg Terminal, Investment Platform, Financial Dashboard
EMOTIONAL TONE: Analysis → Confidence → Investment action

ADAPTIVE BEHAVIOR:
IF commercial focus → Emphasize tenant quality, lease terms, NNN
IF multi-family → Show unit mix, occupancy rates, rent rolls
IF flip focus → ARV methodology, contractor network, timeline
IF syndication → Show past deals, investor returns, minimum investment
IF 1031 exchange specialist → Highlight tax deferral expertise

CREATIVE FREEDOM: Invent market metrics, property financials, ROI examples (keep realistic)
RULE: Data-driven but accessible. Numbers build trust, not confusion.

FINAL: If an investor can''t immediately assess opportunity, simplify the data presentation.
', 'Style 3 - Investment Dashboard (Data-Driven)' FROM ind;

-- =================================================================================================
-- TECH / SAAS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: SaaS landing pages are formulaic. Break the pattern while converting.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent product features, use cases, customer logos, metrics)
- SCRAPING_DEPTH: DEEP (Infer product type: B2B vs. B2C, complexity, pricing model)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Product screenshots, workflow diagrams, customer success imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this explain value or just list features?")

COMPONENTS_LIBRARY:
- BentoGrid: For features showcase
- TextGenerateEffect: For value proposition impact
- InfiniteMovingCards: For social proof (customer logos, testimonials)
- 3DCard: For product demo or pricing tiers

DECISION LOGIC:
- IF complex product → Lead with use case, show product solving problem
- IF simple product → Demo upfront, quick value demonstration
- IF freemium → Emphasize free tier, low barrier to entry

STYLE_ARCHETYPE: Product-Led Growth (Clarity First)
REFERENCE INSPIRATION: Linear, Superhuman, Notion (modern SaaS excellence)

HERO COMPOSITION (90vh):
Structure: Split-screen or product-first hero
LEFT: Value proposition and CTA
RIGHT: Product screenshot/demo in action
HEADLINE: [INVENT 2-5 word value statement]
  Context: productivity, workflow, automation, simple, powerful
  Examples: "WORK SIMPLIFIED" / "AUTOMATE EVERYTHING" / "BUILD FASTER"
  Focus on OUTCOME not feature
SUBHEADLINE: One-liner explaining what it does (8-12 words max)
CTA: "Start Free Trial" + "Watch Demo"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (value prop + product visual)
2. SOCIAL PROOF: <InfiniteMovingCards> with customer logos
3. PROBLEM → SOLUTION: Show pain point, show how product solves it
4. FEATURES: <BentoGrid> (max 6 key features, not 20)
5. USE CASES: Different ways customers use it
6. INTEGRATIONS: If applicable, show ecosystem
7. TESTIMONIALS: Real customer quotes with photos
8. PRICING: <3DCard> tiers (if public pricing)
9. CTA: Final conversion push

DENSITY: Min 7 sections, 12-18 images (product UI, customers, diagrams)

COLOR STRATEGY: Modern SaaS Vibrant
- Background: Pure white (#ffffff) OR very light grey (#fafbfc)
- Text: Near-black (#0a0a0a)
- Accent: Brand-specific vibrant (Purple #6c5ce7 OR Blue #0066ff OR Green #00d4aa)
- ADAPTIVE: IF brand colors scraped, USE them boldly
- Gradients: Subtle brand color gradients for depth

TYPOGRAPHY:
DISPLAY: Modern geometric sans (Inter Display / Circular)
BODY: Clean sans (Inter / System UI)
CODE: Monospace for any technical examples

TARGET VIBE: Linear, Notion, Superhuman, Modern SaaS Excellence
EMOTIONAL TONE: Curiosity → Understanding → Trial signup

ADAPTIVE BEHAVIOR:
IF B2B → Show enterprise features, security, integrations
IF B2C → Emphasize simplicity, personal benefit
IF developer tool → Show code examples, API docs
IF no-code tool → Emphasize accessibility, ease
IF freemium → Make free tier prominent
IF enterprise-only → Emphasize ROI, support, security

CREATIVE FREEDOM: Invent features, customer names/logos, usage metrics, integration partners
RULE: Clarity over cleverness. If value isn''t obvious in 3 seconds, redesign.

FINAL REMINDER: Show, don''t tell. Product screenshots > feature lists. Customer outcomes > company ego.
', 'Style 1 - Product-Led Growth (Clarity)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Developer tools need credibility and speed. Respect their time.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent API endpoints, code examples, developer workflows)
- SCRAPING_DEPTH: DEEP (Infer technical depth: API, SDK, infrastructure, DevOps)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Code screenshots, terminal GIFs, architecture diagrams)
- SELF_AWARENESS: ENABLED (Question: "Would a senior dev trust this in 10 seconds?")

COMPONENTS_LIBRARY:
- Code blocks: Syntax-highlighted examples
- BentoGrid: For features or use cases
- Terminal animations: Show actual usage
- Minimal chrome: Get out of the way

DECISION LOGIC:
- IF API/SDK → Code examples front and center
- IF infrastructure → Show architecture, performance benchmarks
- IF DevOps tool → Show CI/CD integration

STYLE_ARCHETYPE: Developer First (Code-Driven)
REFERENCE INSPIRATION: Vercel, Stripe Docs, Railway, developer-focused products

HERO COMPOSITION (85vh):
Structure: Code-first or terminal-driven
LEFT: Simple value prop (developers hate fluff)
RIGHT: Live code example or terminal demo
HEADLINE: [INVENT 2-4 word technical value]
  Context: fast, simple, powerful, scalable, deploy
  Examples: "DEPLOY IN SECONDS" / "API SIMPLIFIED" / "INFRASTRUCTURE AUTOMATED"
SUBHEADLINE: Technical one-liner
CTA: "Read Docs" + "Start Building"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (minimal + code/terminal)
2. QUICK START: 3-step getting started (actual code)
3. KEY FEATURES: <BentoGrid> with technical benefits
4. CODE EXAMPLES: Common use cases with syntax highlighting
5. PERFORMANCE: Benchmarks, metrics, comparisons
6. INTEGRATIONS: What it works with (frameworks, tools)
7. DOCUMENTATION: Link to comprehensive docs

DENSITY: Min 5 sections, 8-12 visuals (code, diagrams, UI), lots of code examples

COLOR STRATEGY: Developer Dark Mode
- Background: Terminal black (#0d1117) OR dark grey (#1e1e1e)
- Code blocks: Syntax theme (VSCode Dark+ or similar)
- Text: Off-white (#e6edf3)
- Accent: Neon code accent (#58a6ff OR #7ee787)
- ADAPTIVE: Match popular IDE themes developers recognize

TYPOGRAPHY:
DISPLAY: Modern geometric sans (Inter / GitHub Sans)
CODE: Monospace (JetBrains Mono / Fira Code) with ligatures
BODY: Clean sans, minimal

TARGET VIBE: Vercel, Stripe, Railway, GitHub, Developer-Centric
EMOTIONAL TONE: Respect → Trust → "Let me try this"

ADAPTIVE BEHAVIOR:
IF API product → Show cURL examples, SDKs in multiple languages
IF infrastructure → Architecture diagrams, scaling examples
IF open source → GitHub stars, contributor count
IF paid service → Show pricing per usage (developers hate sales calls)
IF enterprise → Emphasize security, compliance, SLA

CREATIVE FREEDOM: Invent API endpoints, code examples, performance metrics (keep realistic)
RULE: Respect developer intelligence. No marketing fluff. Show, don''t tell.

FINAL: Fast, simple, credible. If it takes more than 60 seconds to understand value → FAILED.
', 'Style 2 - Developer First (Code-Driven)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Enterprise SaaS needs trust signals and ROI. Adapt to buyer persona.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent enterprise features, security certifications, ROI metrics)
- SCRAPING_DEPTH: DEEP (Infer buyer: IT, procurement, C-suite; compliance needs)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Enterprise UI screenshots, security badges, customer logos)
- SELF_AWARENESS: ENABLED (Question: "Does this build enterprise trust or feel startup-y?")

COMPONENTS_LIBRARY:
- BentoGrid: For enterprise features (security, compliance, support)
- InfiniteMovingCards: For Fortune 500 customer logos
- Case study cards: ROI examples
- Trust badges: Certifications

DECISION LOGIC:
- IF security-critical → Lead with compliance, certifications
- IF ROI-focused → Show cost savings, productivity gains
- IF IT buyer → Emphasize integrations, admin controls

STYLE_ARCHETYPE: Enterprise Trust (Authority & Scale)
REFERENCE INSPIRATION: Salesforce, ServiceNow, enterprise software leaders

HERO COMPOSITION (80vh):
Structure: Professional, trust-focused
VISUAL: Enterprise dashboard screenshot OR customer success imagery
HEADLINE: [INVENT 2-4 word enterprise value]
  Context: scale, secure, enterprise, trusted, proven
  Examples: "ENTERPRISE GRADE" / "TRUSTED BY THOUSANDS" / "SCALE WITH CONFIDENCE"
TRUST SIGNALS: Customer logos, certification badges visible
CTA: "Request Demo" + "Talk to Sales"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (trust-focused, professional)
2. TRUSTED BY: <InfiniteMovingCards> Fortune 500 logos
3. ENTERPRISE FEATURES: Security, compliance, SSO, admin controls
4. ROI CALCULATOR: Interactive tool showing cost savings
5. CASE STUDIES: Customer success stories with metrics
6. SECURITY & COMPLIANCE: SOC 2, GDPR, ISO badges with details
7. INTEGRATIONS: Enterprise ecosystem (Salesforce, SAP, etc.)
8. SUPPORT: White-glove onboarding, dedicated success manager
9. CONTACT: "Request Demo" form with sales qualification

DENSITY: Min 7 sections, 15-20 images (product, customers, trust signals)

COLOR STRATEGY: Enterprise Professional Blue
- Background: Pure white (#ffffff)
- Text: Professional dark (#1a1a1a)
- Accent: Enterprise blue (#0052cc to #0066ff)
- Trust badges: Multi-color (actual certification colors)
- ADAPTIVE: Corporate, serious, trustworthy palette

TYPOGRAPHY:
DISPLAY: Professional sans (Inter / Helvetica Neue)
BODY: Clean sans for readability
EMPHASIS: Bold for metrics and ROI numbers

TARGET VIBE: Salesforce, ServiceNow, Enterprise Software Leaders
EMOTIONAL TONE: Research → Trust → Sales conversation

ADAPTIVE BEHAVIOR:
IF security product → Lead with compliance, penetration testing
IF productivity tool → Show time/cost savings ROI
IF  IT infrastructure → Emphasize uptime, SLA, support
IF multi-tenant → Show admin controls, user management
IF on-premise option → Highlight deployment flexibility

CREATIVE FREEDOM: Invent customer logos (Fortune 500 style), ROI metrics, security certifications
RULE: Enterprise trust is earned through proof, not promises.

FINAL: Professional, credible, scalable. If it feels like a startup pitch → add gravitas.
', 'Style 3 - Enterprise Trust (Authority)' FROM ind;

-- =================================================================================================
-- CONSULTORÍA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Consulting is about transformation. Override for consulting type.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent methodologies, client transformations, industry expertise)
- SCRAPING_DEPTH: DEEP (Infer consulting type: strategy, IT, operations, HR; client size)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Professional imagery, transformation diagrams, client success)
- SELF_AWARENESS: ENABLED (Question: "Does this show value or just jargon?")

COMPONENTS_LIBRARY:
- BentoGrid: For service offerings or client results
- TextGenerateEffect: For value proposition or methodology
- InfiniteMovingCards: For client logos or testimonials
- Case study reveals: Progressive disclosure

DECISION LOGIC:
- IF strategy consulting → Lead with transformation outcomes
- IF IT consulting → Show technical expertise, implementation success
- IF boutique → Emphasize specialization, personal service

STYLE_ARCHETYPE: Transformation Story (Results-Driven)
REFERENCE INSPIRATION: McKinsey, Bain, BCG (but more approachable)

HERO COMPOSITION (85vh):
Structure: Impact-first hero
VISUAL: Client success imagery (executives, transformation moments)
HEADLINE: [INVENT 2-4 word transformation statement]
  Context: transform, growth, strategy, accelerate, optimize
  Examples: "TRANSFORM YOUR BUSINESS" / "GROWTH ACCELERATED" / "STRATEGY DELIVERED"
SUBHEADLINE: What you do (consulting type + specialization)
CTA: "Start Conversation" + "Our Approach"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (transformation-focused)
2. OUR APPROACH: Methodology or framework (3-5 steps)
3. SERVICES: <BentoGrid> of offerings with brief descriptions
4. CLIENT RESULTS: Metrics of transformation (revenue growth, cost savings, etc.)
5. CASE STUDIES: 2-3 detailed transformation stories
6. INDUSTRIES: Sectors served with expertise highlights
7. TEAM: Consultant profiles with credentials
8. CONTACT: Discovery call scheduling

DENSITY: Min 6 sections, 12-16 images (professional, aspirational, client success)

COLOR STRATEGY: Professional Authority with Energy
- Background: Pure white (#ffffff) OR light grey (#f7f7f7)
- Text: Deep charcoal (#1a1a1a)
- Accent: Energy spectrum (Blue #0066ff OR Teal #00a896 OR Purple #6c5ce7)
- ADAPTIVE: IF specific industry → Match industry conventions

TYPOGRAPHY:
DISPLAY: Modern professional serif (Lora / Crimson) OR bold sans
BODY: Clean sans (Inter / Public Sans)
METRICS: Large, bold numbers

TARGET VIBE: McKinsey-level Authority, Approachable Expertise
EMOTIONAL TONE: Challenge recognized → Solution offered → Partnership

ADAPTIVE BEHAVIOR:
IF strategy consulting → Lead with business transformation outcomes
IF IT/digital → Show technology enablement, digital transformation
IF operations → Efficiency gains, process optimization metrics
IF HR/talent → Culture change, employee engagement results
IF boutique → Emphasize deep specialization over breadth
IF global firm → Show international reach, cross-market experience

CREATIVE FREEDOM: Invent methodologies, client results (realistic metrics), transformation stories
RULE: Outcomes over buzzwords. Show actual transformation, not consultant-speak.

FINAL REMINDER: If a CEO can''t understand the value in 15 seconds, simplify the message.
', 'Style 1 - Transformation Story (Results)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Workshop-driven consulting needs energy and interaction. Override for style.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent workshop formats, facilitation methods, participant outcomes)
- SCRAPING_DEPTH: DEEP (Infer approach: design thinking, agile, innovation sprints)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Workshop photos, sticky notes, collaboration imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this feel energizing or corporate-boring?")

COMPONENTS_LIBRARY:
- BentoGrid: For workshop types or outcomes
- VelocityScroll: For impact statements
- Image grids: Workshop in action photos
- Testimonial cards: Participant feedback

DECISION LOGIC:
- IF design thinking → Show collaborative brainstorming
- IF agile coaching → Emphasize team transformation
- IF innovation consulting → Showcase ideation to execution

STYLE_ARCHETYPE: Workshop Energy (Collaborative Innovation)
REFERENCE INSPIRATION: IDEO, design thinking studios, innovation labs

HERO COMPOSITION (90vh):
Structure: Dynamic, energetic
VISUAL: Workshop in action (team collaboration, sticky notes, energy)
HEADLINE: [INVENT 2-4 word innovation statement]
  Context: innovate, create, collaborate, transform, workshop
  Examples: "INNOVATE TOGETHER" / "IDEAS TO ACTION" / "WORKSHOPS THAT WORK"
TYPOGRAPHY: Bold, energetic, slightly playful
CTA: "Book Workshop" + "Our Process"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (workshop energy, collaborative)
2. OUR METHOD: Visual process flow (discover, ideate, prototype, test)
3. WORKSHOP TYPES: <BentoGrid> of offerings (Strategy Sprint, Design Thinking, etc.)
4. PARTICIPANT OUTCOMES: What teams achieve post-workshop
5. PHOTO GALLERY: Workshops in action (8-12 candid photos)
6. CLIENT STORIES: Before/after transformation narratives
7. FACILITATORS: Team profiles with workshop credentials
8. BOOKING: Calendar integration for workshop scheduling

DENSITY: Min 6 sections, 18-24 images (workshop photos, collaboration, energy)

COLOR STRATEGY: Innovation Vibrant with Energy
- Background: Off-white (#fafafa) OR light warm grey (#f5f3f0)
- Sticky note yellows, pinks, greens (workshop vibes)
- Text: Dark grey (#2b2b2b)
- Accent: Energetic orange (#ff6b35) OR innovation blue (#0099ff)
- ADAPTIVE: Vibrant, collaborative, not corporate

TYPOGRAPHY:
DISPLAY: Bold modern sans (Inter Bold / Circular)
BODY: Friendly sans (Inter / Public Sans)
HANDWRITING: For workshop quotes/insights

TARGET VIBE: IDEO, Design Thinking, Innovation Labs, Energetic Collaboration
EMOTIONAL TONE: Curiosity → Engagement → "Let''s do this"

ADAPTIVE BEHAVIOR:
IF design thinking → Show double diamond process, user empathy
IF agile transformation → Emphasize team rituals, retrospectives
IF innovation sprints → Show rapid prototyping, fast iteration
IF remote workshops → Highlight virtual facilitation, Miro boards
IF corporate training → Balance energy with professionalism

CREATIVE FREEDOM: Invent workshop names, facilitation techniques, participant outcomes
RULE: Energy without chaos. Collaborative, not hippie. Results-driven fun.

FINAL: If it looks like a corporate training manual → inject more energy and humanity.
', 'Style 2 - Workshop Energy (Collaborative)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Thought leadership consulting positions expertise. Override for personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent frameworks, research insights, speaking topics, publications)
- SCRAPING_DEPTH: DEEP (Infer positioning: academic, practitioner, industry expert)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Conference speaking photos, book covers, research visuals)
- SELF_AWARENESS: ENABLED (Question: "Does this establish authority or arrogance?")

COMPONENTS_LIBRARY:
- TextGenerateEffect: For keynote topic or big idea
- BentoGrid: For thought leadership content (articles, talks, research)
- InfiniteMovingCards: For speaking engagements or media mentions
- Video embeds: Keynote clips

DECISION LOGIC:
- IF author/speaker → Lead with book, keynotes, media
- IF research-driven → Show frameworks, original methodologies
- IF practitioner expert → Balance theory with client results

STYLE_ARCHETYPE: Thought Leader Authority (Intellectual Capital)
REFERENCE INSPIRATION: TED speakers, business book authors, industry luminaries

HERO COMPOSITION (80vh):
Structure: Authoritative, editorial
VISUAL: Professional portrait OR speaking on stage
HEADLINE: [INVENT 2-5 word big idea or framework]
  Context: framework names, provocative statements, expertise areas
  Examples: "THE GROWTH PARADOX" / "DISRUPTION DECODED" / "LEADERSHIP REIMAGINED"
SUBHEADLINE: Positioning statement or book title
CTA: "Book Speaking" + "Read Research"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (authority-focused portrait or stage)
2. BIG IDEA: Core framework or thesis explained visually
3. THOUGHT LEADERSHIP: <BentoGrid> of articles, talks, books, research
4. SPEAKING: <InfiniteMovingCards> of conference logos, past engagements
5. MEDIA: As featured in (logos of publications, podcasts)
6. CONSULTING: How to work together (advisory, workshops, keynotes)
7. INSIGHTS: Latest thinking (blog posts, videos, podcasts)
8. CONTACT: Speaking inquiries, consulting requests

DENSITY: Min 6 sections, 10-14 images (professional photos, media, book covers)

COLOR STRATEGY: Editorial Authority with Accent
- Background: Pure white (#ffffff) OR light editorial grey (#f9f9f9)
- Text: Near-black (#0a0a0a)
- Accent: Sophisticated spectrum (Navy #002b5c OR Burgundy #8b0000 OR Forest #2d5016)
- ADAPTIVE: Academic yet approachable

TYPOGRAPHY:
DISPLAY: Editorial serif (Garamond / Baskerville) for gravitas
BODY: Clean sans for readability
QUOTES: Large, impactful pull quotes

TARGET VIBE: TED Speakers, Business Authors, Industry Thought Leaders
EMOTIONAL TONE: Curiosity → Respect → Follow/Hire

ADAPTIVE BEHAVIOR:
IF published author → Feature book prominently with reviews
IF keynote speaker → Show speaking reel, past venues
IF academic → Emphasize research, publications, methodology
IF practitioner → Balance thought leadership with client results
IF media personality → Show podcast, TV appearances, interviews

CREATIVE FREEDOM: Invent frameworks, book titles, speaking topics, media mentions
RULE: Authority through substance. Ideas > ego.

FINAL: Authoritative but accessible. If it feels like academic gatekeeping → humanize it.
', 'Style 3 - Thought Leader (Authority)' FROM ind;

-- VERIFICATION
SELECT 
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('legal', 'real-estate', 'tech', 'consultoria')
GROUP BY di.name
ORDER BY di.name;
