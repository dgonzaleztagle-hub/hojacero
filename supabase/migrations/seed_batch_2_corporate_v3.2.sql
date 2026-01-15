-- =================================================================================================
-- GOLD MASTER V3.2 - BATCH 2: CORPORATE & PROFESSIONAL (FULL PROTOCOLS)
-- COMPLETE EDITION: Every prompt has ALL protocols expanded
-- =================================================================================================

DELETE FROM demo_prompts WHERE industry_id IN (
    SELECT id FROM demo_industries WHERE slug IN ('legal', 'real-estate', 'tech', 'consultoria')
);

-- =================================================================================================
-- LEGAL (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'legal')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric layouts - asymmetry is sophistication
❌ Uniform attorney grid - differentiate partners from associates
❌ Navy blue + gold cliché - overused in legal
❌ Stock gavels, handshakes, courthouse photos
❌ Corporate template feeling

SELF-CHECK:
1. "Does this look like every law firm site?" → Redesign if yes
2. "What makes THIS firm visually distinctive?" → Specific answer required
3. "Would a Fortune 500 GC be impressed?" → Must be yes

MEMORABILITY: Architectural elegance that commands respect

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Attorney names, credentials, bar admissions, practice areas
STEP 2 - CURATE: Partners prominently, key practice areas, notable representations
STEP 3 - GAPS: Don''t invent case outcomes (liability), invent positioning only

GOLDEN RULE: "Show expertise through restraint"

⚠️ LEGAL NOTE: Never invent case results or client names

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Architectural detail, modern office, abstract legal concept
SUPPORTING: Editorial attorney portraits (not LinkedIn), office environment
SELF-CHECK: "Authority without cliché?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Firm positioning, practice focus, target clients)

STYLE_ARCHETYPE: Swiss Authority (Premium Legal)
REFERENCE: Cravath, Skadden, modern luxury branding

HERO (90vh):
Structure: ASYMMETRIC - Statement (60%) + Visual (40%)
VISUAL: Architectural OR abstract legal
HEADLINE: [Firm name or INVENT authority phrase]
  Examples: "TRUSTED COUNSEL" / "STRATEGIC PRECISION" / "[FIRM NAME]"
CTA: "Our Practice" + "Contact"

SECTIONS (6-8):
1. HERO (authoritative)
2. EXPERTISE: <BentoGrid> practice areas
3. TEAM: Attorney profiles with real credentials
4. APPROACH: Firm differentiator
5. SECTORS: Industries served
6. CONTACT: Professional, easy

COLOR: Off-white (#fafaf9) OR charcoal (#1a1a1a)
Accent: Deep burgundy (#722F37) OR forest green (#2D5A27)
NOT navy + gold

TYPOGRAPHY: Refined serif headlines, sans body

VIBE: White-Shoe Firm, Strategic Partner
EMOTIONAL: Confidence → Trust → Engagement

ADAPTIVE:
IF real credentials → Display prominently
IF awards/rankings → Feature

FINAL: Real credentials, authority through restraint.
', 'Style 1 - Swiss Authority (Premium) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: Generic legal, stock imagery, template layouts
SELF-CHECK: Dramatic without cheese? Courtroom presence?
MEMORABILITY: Legal as drama

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Attorneys, litigation focus, notable cases (if public)
CURATE: Lead litigators as protagonists
IMAGES: Dramatic lighting, editorial portraits, architectural
CHECK: "HBO quality?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Legal Drama (Courtroom Presence)
REFERENCE: HBO legal dramas, prestige positioning

HERO (100vh):
Structure: DRAMATIC - Dark with spotlight
VISUAL: Lead partner portrait OR courtroom architectural
HEADLINE: [INVENT dramatic phrase]
  Examples: "WHEN EVERYTHING''S AT STAKE" / "THE FIGHT MATTERS" / "DECISIVE ACTION"
CTA: "Case Evaluation" + "Our Victories"

SECTIONS (6-8):
1. HERO (dramatic)
2. BATTLEGROUND: Practice areas with intensity
3. THE TEAM: Partners as protagonists
4. WINS: Outcomes if public
5. APPROACH: How they fight
6. CONTACT: Urgent, accessible

COLOR: Dark backgrounds, selective highlights
TYPOGRAPHY: Bold, confident

VIBE: High-Stakes Litigation
EMOTIONAL: Concern → Confidence → Contact

FINAL: Real attorneys as protagonists.
', 'Style 2 - Legal Drama (Courtroom) - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for tech aesthetic.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS: Traditional legal imagery, stuffy presentation
SELF-CHECK: Tech company vibe? Startup-friendly?
MEMORABILITY: Law for innovators

-- =============================================================================
-- CONTENT EXTRACTION + ASSET GENERATION
-- =============================================================================
SCRAPE: Tech focus, startup clients, innovation practice
CURATE: Tech-relevant services, modern approach
IMAGES: Tech-forward, modern workspace
CHECK: "Would a YC founder hire this firm?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: TechLaw (Innovation Legal)
REFERENCE: Fenwick, Cooley, tech company design

HERO (85vh):
Structure: CLEAN TECH grid
VISUAL: Abstract tech-legal OR modern workspace
HEADLINE: [INVENT innovation phrase]
  Examples: "LAW FOR INNOVATORS" / "LEGAL ENGINEERING" / "STARTUP → SCALE"
CTA: "Start Conversation" + "Expertise"

SECTIONS (5-7):
1. HERO (tech aesthetic)
2. SERVICES: Clean grid, modern categories
3. CLIENTS: Sectors or logos if permissible
4. TEAM: Modern, approachable
5. RESOURCES: Blog, insights
6. CONTACT: Conversational

COLOR: Light mode, single vibrant accent
TYPOGRAPHY: Modern sans, tech feel

VIBE: Tech Company That''s Legal
EMOTIONAL: Aligned → Modern → Engaged

FINAL: Real tech law content, modern presentation.
', 'Style 3 - TechLaw (Innovation) - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- REAL ESTATE (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Generic real estate templates
❌ MLS-style property photos
❌ Uniform property grids
❌ Stock interiors

SELF-CHECK: Architectural Digest quality? Property as design object?
MEMORABILITY: Stunning architecture forward

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Properties, prices, addresses, agent details
STEP 2 - CURATE: 3-6 hero properties, not full listings
STEP 3 - GAPS: Invent only descriptions, not prices

GOLDEN RULE: "Homes as architecture"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Stunning architectural exterior or interior moment
SUPPORTING: Design magazine quality, lifestyle in space
SELF-CHECK: "Would this be in a design magazine?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Market focus, price point, property types)

STYLE_ARCHETYPE: Architectural Luxury (Design-Forward)
REFERENCE: Compass, Sotheby''s Realty, AD

HERO (100vh):
Structure: FULL-BLEED architectural
VISUAL: Stunning property
HEADLINE: [INVENT architectural phrase OR "Properties by [AGENT]"]
  Examples: "ARCHITECTURE OF LIVING" / "CURATED SPACES"
CTA: "View Properties" + "Connect"

SECTIONS (6-8):
1. HERO (architectural)
2. FEATURED: <BentoGrid> 3-6 properties - ONE hero larger
3. NEIGHBORHOODS: Market expertise
4. ABOUT: Agent/team
5. TESTIMONIALS: Client success
6. CONTACT: Property inquiry

COLOR: Architectural whites + greys, warm accent
TYPOGRAPHY: Modern architectural sans

VIBE: Architectural Publication
EMOTIONAL: Aspiration → Trust → Inquiry

ADAPTIVE:
IF real properties → Use exact details
IF prices → Display prominently

FINAL: Real properties, design magazine presentation.
', 'Style 1 - Architectural Luxury - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Static grids, boring listings
SELF-CHECK: Exploration feel? Interactive? Location-first?
SCRAPE: Properties by location, neighborhoods, local insights
IMAGES: Neighborhood life, community moments
CHECK: "Does this help discover?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Interactive Map (Location-First)
REFERENCE: Compass explore, Airbnb maps

HERO (90vh):
Structure: SPLIT - Map/location (50%) + Text (50%)
VISUAL: Map or neighborhood
HEADLINE: [INVENT exploration phrase]
  Examples: "EXPLORE [CITY]" / "FIND YOUR NEIGHBORHOOD"
CTA: "Explore Map" + "Property Search"

SECTIONS (6-8):
1. HERO (location)
2. NEIGHBORHOODS: Area character guides
3. PROPERTIES: By location
4. LOCAL INSIGHTS: What makes each area special
5. AGENT: Local expertise
6. CONTACT

COLOR: Map-friendly, light background
TYPOGRAPHY: Clear, navigational

VIBE: Local Explorer
EMOTIONAL: Curiosity → Discovery → Connection

FINAL: Real locations, exploration experience.
', 'Style 2 - Interactive Map - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Only aesthetic, no data substance
SELF-CHECK: Investment-minded? Data-driven?
SCRAPE: Market data, ROI, rental yields, appreciation
IMAGES: Clean properties, data visualization
CHECK: "Serious investor appeal?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Investment Dashboard (Data-Driven)
REFERENCE: Fundrise, RE investment platforms

HERO (85vh):
Structure: DATA-FORWARD - Stats visible
VISUAL: Property + data overlay
HEADLINE: [INVENT investment phrase]
  Examples: "INVEST SMARTER" / "DATA-DRIVEN RE" / "ROI FOCUSED"
CTA: "Opportunities" + "Market Analysis"

SECTIONS (6-8):
1. HERO (data-driven)
2. MARKET DATA: Key performance stats
3. PROPERTIES: Investment details (yield, appreciation)
4. ANALYSIS: Trends, insights
5. ABOUT: Investment expertise
6. CONTACT: Investor inquiry

COLOR: Fintech clean, data accent colors
TYPOGRAPHY: Data-friendly, clear numbers

VIBE: Investment Platform
EMOTIONAL: Analysis → Confidence → Invest

FINAL: Real data, investment presentation.
', 'Style 3 - Investment Dashboard - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- TECH/SAAS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Generic SaaS template (gradient hero + laptop mockup)
❌ Purple/blue gradient cliché
❌ Marketing over product
❌ Stock team photos

SELF-CHECK: Product-forward? Unique visual language? Not 1000 other SaaS?
MEMORABILITY: Product as hero

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Features, pricing tiers, integrations, use cases
STEP 2 - CURATE: 3-6 killer features, real pricing
STEP 3 - GAPS: Invent plausible features only if empty

GOLDEN RULE: "Show, don''t tell"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Product UI as hero, not marketing abstraction
SUPPORTING: Feature demos, UI previews, usage context
SELF-CHECK: "Is product visible in first 2 seconds?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Product type, target user, key features)

STYLE_ARCHETYPE: Product-Led Growth (PLG)
REFERENCE: Linear, Notion, Figma

HERO (90vh):
Structure: PRODUCT-FORWARD - UI as hero
VISUAL: Product interface visible
HEADLINE: [Product name or value phrase]
  Examples: "WORK SIMPLIFIED" / "[PRODUCT]" / "FINALLY, [SOLUTION]"
CTA: "Start Free" + "See Demo"

SECTIONS (6-8):
1. HERO (product forward)
2. FEATURES: <BentoGrid> 3-6 with UI previews
3. HOW IT WORKS: Flow visualization
4. INTEGRATIONS: If applicable
5. PRICING: Real tiers
6. TESTIMONIALS: Customer proof
7. CTA: Start emphasis

COLOR: Clean white + single vibrant accent OR dark mode
NOT purple/cyan gradient

TYPOGRAPHY: Modern system (Inter, SF Pro)

VIBE: Best-in-class SaaS, Product-obsessed
EMOTIONAL: Curiosity → Understanding → Trial

ADAPTIVE:
IF real features → Show UI
IF real pricing → Display exactly

FINAL: Real product, product-forward presentation.
', 'Style 1 - Product-Led Growth - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for developer quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Marketing-heavy, non-technical presentation
SELF-CHECK: Developer would trust? No BS? Code-forward?
SCRAPE: API, docs, code examples, integrations
CURATE: Technical capabilities, quickstart
IMAGES: Code blocks, terminal, technical diagrams
CHECK: "Developers smell BS instantly"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Developer First (API/Tooling)
REFERENCE: Stripe, Vercel, GitHub

HERO (85vh):
Structure: CODE-FORWARD
VISUAL: Syntax highlighted code block
HEADLINE: [INVENT dev phrase]
  Examples: "SHIP FASTER" / "[TOOL] FOR DEVELOPERS" / "BUILD BETTER"
CTA: "Get API Key" + "Read Docs"

SECTIONS (5-7):
1. HERO (code)
2. QUICKSTART: Code example
3. FEATURES: Technical capabilities
4. DOCS: Documentation access
5. COMMUNITY: Open source
6. PRICING: Dev-friendly tiers

COLOR: Dark mode (VS Code aesthetic)
Syntax highlighting colors
TYPOGRAPHY: Monospace for code, clean sans for prose

VIBE: Developer Tool, Technical Excellence
EMOTIONAL: Interest → "I can use this" → Sign up

FINAL: Real technical content. Substance over marketing.
', 'Style 2 - Developer First - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for enterprise quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Startup vibes, casual tone
SELF-CHECK: Enterprise trustworthy? Security-conscious?
SCRAPE: Enterprise features, compliance, SSO, SLAs
CURATE: Security, scale, enterprise logos
IMAGES: Professional, corporate, trustworthy
CHECK: "Would procurement approve?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Enterprise Trust (B2B/Corporate)
REFERENCE: Salesforce, ServiceNow

HERO (85vh):
Structure: TRUST-FORWARD - Logos + proposition
VISUAL: Enterprise context
HEADLINE: [INVENT enterprise phrase]
  Examples: "TRUSTED BY LEADERS" / "ENTERPRISE [SOLUTION]" / "SCALE CONFIDENT"
CTA: "Talk to Sales" + "Platform"

SECTIONS (6-8):
1. HERO (trust)
2. LOGOS: Enterprise customers
3. CAPABILITIES: Enterprise features (SSO, compliance)
4. CASE STUDIES: Enterprise success
5. SECURITY: Certifications
6. PRICING: Enterprise/custom
7. SALES: Conversation CTA

COLOR: Enterprise professional, brand colors
TYPOGRAPHY: Professional, not playful

VIBE: Enterprise Platform, Trusted Partner
EMOTIONAL: Consideration → Trust → Sales call

FINAL: Real enterprise content. Trust, not hype.
', 'Style 3 - Enterprise Trust - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- CONSULTORÍA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Generic consulting template
❌ Stock business photos (handshakes, suits)
❌ Jargon without substance
❌ Corporate sterility

SELF-CHECK: Shows real value? Unique methodology? Transformation clear?
MEMORABILITY: Transformation story

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Services, methodology, team, case studies
STEP 2 - CURATE: 3-5 core offerings, unique approach
STEP 3 - GAPS: Invent methodology details only if empty

GOLDEN RULE: "Value, not jargon"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Transformation visual, abstract progress, team in action
SUPPORTING: Methodology diagrams, team editorial, work moments
SELF-CHECK: "Communicates value or just jargon?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Consulting specialty, methodology, target clients)

STYLE_ARCHETYPE: Transformation Story (Change Consulting)
REFERENCE: McKinsey, BCG

HERO (90vh):
Structure: BOLD STATEMENT with visual metaphor
VISUAL: Abstract transformation OR team
HEADLINE: [INVENT transformation phrase]
  Examples: "TRANSFORM YOUR BUSINESS" / "FROM A TO B" / "REIMAGINE POSSIBLE"
CTA: "Start Conversation" + "Approach"

SECTIONS (6-8):
1. HERO (transformation)
2. EXPERTISE: <BentoGrid> service areas with outcomes
3. APPROACH: Differentiating methodology
4. CASE STUDIES: Transformation stories
5. TEAM: Leadership profiles
6. CONTACT: Strategic conversation

COLOR: Minimal, sophisticated accent
TYPOGRAPHY: Confident serif + sans mix

VIBE: Strategic Partner, Transformation Agent
EMOTIONAL: Challenge → Possibility → Engagement

ADAPTIVE:
IF real methodology → Feature prominently
IF case studies → Use with permission

FINAL: Real expertise, clear value presentation.
', 'Style 1 - Transformation Story - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Corporate stuffiness, passive presentation
SELF-CHECK: Workshop energy? Collaborative feel? Human-centered?
SCRAPE: Workshop offerings, facilitation approach
CURATE: Collaboration outcomes, process
IMAGES: Workshop moments, people working together
CHECK: "Would I want to be in this workshop?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Workshop Energy (Collaborative)
REFERENCE: IDEO, design thinking

HERO (85vh):
Structure: HUMAN-CENTERED
VISUAL: Workshop or collaboration
HEADLINE: [INVENT collaborative phrase]
  Examples: "THINK TOGETHER" / "INNOVATION THROUGH COLLABORATION" / "TEAM ACTIVATED"
CTA: "Book Workshop" + "Process"

SECTIONS (6-8):
1. HERO (collaborative)
2. WORKSHOPS: Session types
3. PROCESS: How collaboration works
4. OUTCOMES: What participants achieve
5. FACILITATORS: Human profiles
6. BOOK: Scheduling

COLOR: Warm neutrals, energetic accent
TYPOGRAPHY: Friendly, approachable

VIBE: Innovation Lab, Collaborative Partner
EMOTIONAL: Stuck → Energized → Engaged

FINAL: Real workshop content, energy over corporate.
', 'Style 2 - Workshop Energy - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Generic consulting, no intellectual depth
SELF-CHECK: Thought leadership visible? Content-rich?
SCRAPE: Publications, speaking, unique expertise
CURATE: Books, articles, keynotes
IMAGES: Author portraits, speaking moments, publication covers
CHECK: "Would I read their book?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Thought Leader (Expertise-Forward)
REFERENCE: Simon Sinek, individual expert brands

HERO (90vh):
Structure: EXPERT-FORWARD
VISUAL: Expert portrait OR keynote
HEADLINE: [Expert name or expertise phrase]
  Examples: "[NAME]" / "STRATEGIC INSIGHT" / "EXPERTISE THAT TRANSFORMS"
CTA: "Book [Name]" + "Insights"

SECTIONS (6-8):
1. HERO (expert)
2. EXPERTISE: What they know best
3. CONTENT: Books, articles
4. SPEAKING: Keynotes, events
5. CONSULTING: How to engage
6. CONTACT: Direct access

COLOR: Professional, minimal, content-focused
TYPOGRAPHY: Authoritative, editorial

VIBE: Public Intellectual, Business Author
EMOTIONAL: Interest → Respect → Engage

FINAL: Real expertise content. Substance over style.
', 'Style 3 - Thought Leader - FULL PROTOCOLS' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('legal', 'real-estate', 'tech', 'consultoria')
GROUP BY di.name
ORDER BY di.name;
