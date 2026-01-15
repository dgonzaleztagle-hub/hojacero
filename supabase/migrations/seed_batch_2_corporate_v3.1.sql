-- =================================================================================================
-- GOLD MASTER V3.1 - BATCH 2: CORPORATE & PROFESSIONAL
-- FINAL EDITION: Creative Autonomy + Design Judgment + Editorial Curation + Asset Generation
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
-- ⚠️ META: Override for Awwwards quality when needed.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts - use asymmetric grids
❌ Uniform attorney grid where all photos look identical
❌ Navy blue + gold cliché (overused in legal)
❌ Stock photos of gavels, courthouses, handshakes
❌ Corporate template feeling

SELF-CHECK BEFORE EACH SECTION:
1. "Does this look like every other law firm site?" → If YES, redesign
2. "What makes THIS firm visually distinctive?" → Must have answer
3. "Would a Fortune 500 GC be impressed?" → If NO, elevate

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
✅ Extract real attorney names, credentials, practice areas
✅ Use exact titles, bar admissions, notable cases (if public)
✅ Preserve firm positioning: boutique vs full-service, specialty focus
❌ Don''t invent case results (legal liability)
✅ If testimonials found, quote exactly

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
- Generate architectural/environmental photography
- Modern office aesthetic, not stock business imagery
- Attorney portraits: editorial professional, not LinkedIn headshots

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer firm positioning, practice areas, target clients)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Architectural, environmental, editorial portraits)
- SELF_AWARENESS: ENABLED (Question: "Does this command respect?")

STYLE_ARCHETYPE: Swiss Authority (Premium Legal)
REFERENCE INSPIRATION: Cravath, Skadden, modern luxury branding

HERO COMPOSITION (90vh):
Structure: ASYMMETRIC - Statement (60%) + Visual (40%)
VISUAL: Architectural detail OR abstract legal concept
HEADLINE: [Firm name or INVENT authority phrase]
  Context: counsel, trusted, strategic, decisive
  Examples: "TRUSTED COUNSEL" / "STRATEGIC PRECISION" / "[FIRM NAME]"
SUBHEADLINE: Practice focus or client promise
CTA: "Our Practice" + "Contact"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (authoritative, asymmetric)
2. EXPERTISE: <BentoGrid> practice areas - real if scraped
3. TEAM: Attorney profiles with real credentials
4. APPROACH: What distinguishes the firm
5. NOTABLE WORK: Sectors served, not specific cases unless public
6. CONTACT: Professional, easy

COLOR STRATEGY: Restrained Authority
- Background: Off-white (#fafaf9) OR deep charcoal (#1a1a1a)
- Accent: Minimal - deep burgundy (#722F37) OR forest green (#2D5A27)
- NOT navy + gold cliché

TYPOGRAPHY: Refined, authoritative (serif headlines, sans body)

VIBE: White-Shoe Firm, Strategic Partner, Premium Legal
EMOTIONAL: Confidence → Trust → Engagement

FINAL: Real credentials, authority presentation. Respect through restraint.
', 'Style 1 - Swiss Authority (Premium Legal)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- PROTOCOLS: Design Judgment + Editorial Curation + Asset Generation
❌ Never: Generic legal layouts, stock gavels, template feel
✅ Always: Bold storytelling, real attorney profiles, dramatic presence

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer litigation focus, courtroom presence, notable cases)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Dramatic lighting, editorial portraits, architectural)

STYLE_ARCHETYPE: Legal Drama (Courtroom Presence)
REFERENCE INSPIRATION: HBO legal dramas, prestige firm positioning

HERO COMPOSITION (100vh):
Structure: DRAMATIC - Dark with spotlight elements
VISUAL: Lead partner portrait OR courtroom architectural
HEADLINE: [INVENT dramatic legal phrase]
  Examples: "WHEN EVERYTHING IS AT STAKE" / "THE FIGHT MATTERS" / "DECISIVE ACTION"
SUBHEADLINE: What the firm does best
CTA: "Case Evaluation" + "Our Victories"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (dramatic, dark)
2. BATTLEGROUND: Practice areas with intensity
3. THE TEAM: Partners as protagonists
4. WINS: Case outcomes if public, else sectors served
5. APPROACH: How they fight
6. CONTACT: Urgent, accessible

COLOR STRATEGY: Dramatic Contrast
- Dark backgrounds with light accents
- Deep blacks (#0a0a0a) with selective highlights

TYPOGRAPHY: Bold, confident, dramatic

VIBE: Courtroom Drama, High-Stakes Litigation
EMOTIONAL: Concern → Confidence → Contact

FINAL: Real attorneys as protagonists. Drama without cheese.
', 'Style 2 - Legal Drama (Courtroom)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for tech-legal hybrid aesthetic.

-- PROTOCOLS: Modern, tech-forward legal presentation
❌ Never: Traditional legal imagery
✅ Always: Tech-company aesthetic applied to legal

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer tech law focus, startup clients, innovation practice)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Tech-forward imagery, modern workspace, digital-native)

STYLE_ARCHETYPE: TechLaw (Innovation Legal)
REFERENCE INSPIRATION: Fenwick, Cooley, tech company design language

HERO COMPOSITION (85vh):
Structure: CLEAN TECH - Grid-based, modern
VISUAL: Abstract tech-legal concept OR modern workspace
HEADLINE: [INVENT innovation-legal phrase]
  Examples: "LAW FOR INNOVATORS" / "LEGAL ENGINEERING" / "STARTUP → SCALE"
SUBHEADLINE: Tech practice positioning
CTA: "Start Conversation" + "Our Expertise"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (tech aesthetic)
2. SERVICES: Clean grid, not traditional practice areas
3. CLIENTS: Logos if permissible, else sectors
4. TEAM: Modern, approachable attorney profiles
5. RESOURCES: Blog, insights (if found)
6. CONTACT: Easy, conversational

COLOR STRATEGY: Tech Minimal
- Light mode: White + single vibrant accent
- Dark mode option if tech-native feel

TYPOGRAPHY: Modern sans, tech company feel

VIBE: Tech Company That Happens to Be Legal
EMOTIONAL: Modern → Aligned → Engaged

FINAL: Real tech law content. Legal without the stuffiness.
', 'Style 3 - TechLaw (Innovation)' FROM ind;

-- =================================================================================================
-- REAL ESTATE (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Generic real estate templates, stock house photos, uniform property grids
✅ Always: Architectural photography, editorial presentation, property as art
SELF-CHECK: "Is this Architectural Digest quality?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real property details, addresses, prices if scraped
✅ Generate architectural photography, not MLS-style
✅ Curate 3-6 hero properties from full listings

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer market focus, price point, property types)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Architectural photography, lifestyle imagery)
- SELF_AWARENESS: ENABLED (Question: "Would this be in a design magazine?")

STYLE_ARCHETYPE: Architectural Luxury (Design-Forward Real Estate)
REFERENCE INSPIRATION: Compass, Sotheby''s Realty, architectural publications

HERO COMPOSITION (100vh):
Structure: FULL-BLEED architectural beauty
VISUAL: Stunning property exterior OR interior design moment
HEADLINE: [INVENT architectural phrase OR "Properties by [AGENT]"]
  Context: design, living, architecture, curated
  Examples: "ARCHITECTURE OF LIVING" / "CURATED SPACES" / "DESIGN-FORWARD HOMES"
SUBHEADLINE: Market/specialty focus
CTA: "View Properties" + "Connect"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (architectural, stunning)
2. FEATURED: <BentoGrid> 3-6 properties - real details, one hero larger
3. NEIGHBORHOOD: Market expertise, area knowledge
4. ABOUT: Agent/team profile
5. TESTIMONIALS: Client success stories
6. CONTACT: Easy property inquiry

COLOR STRATEGY: Architectural Minimal
- Clean whites + architectural greys
- Single warm accent (if brand color)

TYPOGRAPHY: Modern architectural (clean sans, generous spacing)

VIBE: Architectural Publication, Design Gallery
EMOTIONAL: Aspiration → Trust → Inquiry

FINAL: Real properties, architectural presentation. Homes as design objects.
', 'Style 1 - Architectural Luxury (Design)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- PROTOCOLS: Interactive, map-centric, exploration-focused
✅ Use real property locations, listing details if scraped
✅ Generate neighborhood/lifestyle photography
❌ Avoid: Static grids, non-interactive experience

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer service areas, property types, market positioning)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Neighborhood life, community moments, location beauty)

STYLE_ARCHETYPE: Interactive Map (Location-First)
REFERENCE INSPIRATION: Compass explore, Airbnb maps, location-focused experiences

HERO COMPOSITION (90vh):
Structure: SPLIT - Map/location (50%) + Text (50%)
VISUAL: Map or neighborhood scene
HEADLINE: [INVENT exploration phrase]
  Examples: "EXPLORE [CITY]" / "FIND YOUR NEIGHBORHOOD" / "LOCATION FIRST"
SUBHEADLINE: How they help find perfect location
CTA: "Explore Map" + "Property Search"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (location-focused)
2. NEIGHBORHOODS: Area guides with character
3. PROPERTIES: Filterable by location
4. LOCAL INSIGHTS: What makes each area special
5. AGENT: Local expertise positioning
6. CONTACT: Location-based inquiry

COLOR STRATEGY: Map-Friendly
- Light background for map readability
- Location markers as accent color

TYPOGRAPHY: Clear, navigational

VIBE: Local Explorer, Neighborhood Expert
EMOTIONAL: Curiosity → Discovery → Connection

FINAL: Real locations, exploration experience. Location as the hero.
', 'Style 2 - Interactive Map (Location)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for data quality.

-- PROTOCOLS: Data-driven, investment-focused presentation
✅ Use real market data if scraped (appreciation, ROI, rental yields)
✅ Generate professional, clean property imagery
❌ Avoid: Purely aesthetic, no data substance

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer investment focus, ROI positioning, market analysis)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Professional property shots, data visualization)

STYLE_ARCHETYPE: Investment Dashboard (Data-Driven)
REFERENCE INSPIRATION: Fundrise, real estate investment platforms, fintech

HERO COMPOSITION (85vh):
Structure: DATA-FORWARD - Stats + Visual
VISUAL: Property with data overlay OR abstract property data
HEADLINE: [INVENT investment phrase]
  Examples: "INVEST SMARTER" / "DATA-DRIVEN REAL ESTATE" / "ROI FOCUSED"
SUBHEADLINE: Investment value proposition
CTA: "See Opportunities" + "Market Analysis"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (data-driven)
2. MARKET DATA: Key stats on market performance
3. PROPERTIES: Investment-focused details (yield, appreciation)
4. ANALYSIS: Market insights, trends
5. ABOUT: Investment expertise
6. CONTACT: Serious investor inquiry

COLOR STRATEGY: Fintech Clean
- Light mode with data accent colors
- Charts in brand-consistent palette

TYPOGRAPHY: Data-friendly, clear numbers

VIBE: Investment Platform, Smart Money
EMOTIONAL: Analysis → Confidence → Invest

FINAL: Real data, investment presentation. Property as asset class.
', 'Style 3 - Investment Dashboard (Data)' FROM ind;

-- =================================================================================================
-- TECH/SAAS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Generic SaaS template, gradient hero with laptop mockup, purple/blue gradients
✅ Always: Product-forward, unique visual language, bold design choices
SELF-CHECK: "Does this look like 1000 other SaaS sites?" → Redesign

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real product features, pricing if scraped
✅ Generate product UI mockups, not generic laptop frames
✅ Show actual product functionality

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer product type, target user, key features)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Product UI, feature demos, contextual usage)
- SELF_AWARENESS: ENABLED (Question: "Is this product-forward or marketing-forward?")

STYLE_ARCHETYPE: Product-Led Growth (PLG)
REFERENCE INSPIRATION: Linear, Notion, Figma - product as the star

HERO COMPOSITION (90vh):
Structure: PRODUCT-FORWARD - UI as hero element
VISUAL: Product interface, not marketing abstraction
HEADLINE: [INVENT product value phrase OR product name]
  Context: simple, powerful, intuitive, effortless
  Examples: "WORK SIMPLIFIED" / "[PRODUCT NAME]" / "FINALLY, [SOLUTION]"
SUBHEADLINE: One-line value prop
CTA: "Start Free" + "See Demo"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (product-forward)
2. FEATURES: <BentoGrid> 3-6 key features with UI previews
3. HOW IT WORKS: Simple flow visualization
4. INTEGRATIONS: If applicable
5. PRICING: Real tiers if scraped, else sample structure
6. TESTIMONIALS: Customer validation
7. CTA: Get started emphasis

COLOR STRATEGY: Product-First
- Light mode: Clean white + single vibrant accent
- Dark mode: Deep blacks + accent pops
- NOT purple/cyan gradient cliché

TYPOGRAPHY: Modern, technical (Inter, SF Pro, system)

VIBE: Best-in-class SaaS, Product-obsessed
EMOTIONAL: Curiosity → Understanding → Trial

FINAL: Real product, product-forward presentation. Show, don''t tell.
', 'Style 1 - Product-Led Growth (PLG)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for developer aesthetic.

-- PROTOCOLS: Developer-first, technical, no marketing fluff
✅ Use real API examples, code snippets if found
✅ Generate code-focused imagery, terminal aesthetic
❌ Avoid: Marketing-heavy, non-technical presentation

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer developer tools, API focus, technical docs)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Code blocks, terminal UI, technical diagrams)

STYLE_ARCHETYPE: Developer First (API/Tooling)
REFERENCE INSPIRATION: Stripe, Vercel, GitHub - developer-beloved

HERO COMPOSITION (85vh):
Structure: CODE-FORWARD - Syntax highlighted examples
VISUAL: Code block OR terminal interface
HEADLINE: [INVENT developer phrase]
  Examples: "SHIP FASTER" / "[TOOL] FOR DEVELOPERS" / "BUILD BETTER"
SUBHEADLINE: Technical value prop (in dev language)
CTA: "Get API Key" + "Read Docs"

CONTENT SECTIONS (Build 5-7 total):
1. HERO (code-forward)
2. QUICKSTART: Code example to start
3. FEATURES: Technical capabilities
4. DOCS PREVIEW: Documentation access
5. COMMUNITY: Open source, contributors
6. PRICING: Developer-friendly tiers

COLOR STRATEGY: Code-Editor Dark
- Dark mode default (like VS Code / GitHub dark)
- Syntax highlighting colors

TYPOGRAPHY: Monospace for code, clean sans for prose

VIBE: Developer Tool, Technical Excellence
EMOTIONAL: Interest → "I can use this" → Sign up

FINAL: Real technical content. Developers smell marketing BS.
', 'Style 2 - Developer First (API/Tools)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for enterprise trust.

-- PROTOCOLS: Enterprise-focused, trust-building, security-conscious
✅ Use real enterprise features, compliance certifications if found
✅ Generate professional, corporate-friendly imagery
❌ Avoid: Startup vibes, casual tone

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer enterprise features, security, compliance)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Professional, corporate, trust-building)

STYLE_ARCHETYPE: Enterprise Trust (B2B/Corporate)
REFERENCE INSPIRATION: Salesforce, ServiceNow, enterprise SaaS

HERO COMPOSITION (85vh):
Structure: TRUST-FORWARD - Logos + proposition
VISUAL: Enterprise context OR abstract professional
HEADLINE: [INVENT enterprise phrase]
  Examples: "TRUSTED BY INDUSTRY LEADERS" / "ENTERPRISE [SOLUTION]" / "SCALE WITH CONFIDENCE"
SUBHEADLINE: Enterprise value prop
CTA: "Talk to Sales" + "See Platform"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (enterprise trust)
2. LOGOS: Enterprise customer logos (if found)
3. CAPABILITIES: Enterprise features (SSO, compliance, SLA)
4. CASE STUDIES: Enterprise success stories
5. SECURITY: Compliance, certifications
6. PRICING: Enterprise/custom
7. CONTACT: Sales conversation

COLOR STRATEGY: Enterprise Professional
- Light mode, professional palette
- Brand colors, not trendy

TYPOGRAPHY: Professional, not playful

VIBE: Enterprise Platform, Trusted Partner
EMOTIONAL: Consideration → Trust → Sales call

FINAL: Real enterprise content. Build trust, not hype.
', 'Style 3 - Enterprise Trust (B2B)' FROM ind;

-- =================================================================================================
-- CONSULTORÍA (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Generic consulting template, stock business photos, handshake imagery
✅ Always: Transformation stories, real methodology, unique visual approach
SELF-CHECK: "Does this show what makes this firm unique?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real service areas, methodology, team if scraped
✅ Generate abstract transformation visuals, not stock business
✅ Curate 3-5 core offerings from full service list

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer consulting specialty, methodology, target clients)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Transformation visuals, abstract progress, team editorial)
- SELF_AWARENESS: ENABLED (Question: "Does this communicate value or just jargon?")

STYLE_ARCHETYPE: Transformation Story (Change Consulting)
REFERENCE INSPIRATION: McKinsey, BCG, premium consulting presence

HERO COMPOSITION (90vh):
Structure: BOLD STATEMENT with visual metaphor
VISUAL: Abstract transformation OR team in action
HEADLINE: [INVENT transformation phrase]
  Context: transform, evolve, accelerate, unlock, reimagine
  Examples: "TRANSFORM YOUR BUSINESS" / "FROM [A] TO [B]" / "REIMAGINE POSSIBLE"
SUBHEADLINE: Firm positioning statement
CTA: "Start Conversation" + "Our Approach"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (bold transformation)
2. EXPERTISE: <BentoGrid> service areas with clear outcomes
3. APPROACH: Methodology that differentiates
4. CASE STUDIES: Transformation stories (anonymized if needed)
5. TEAM: Leadership profiles
6. CONTACT: Strategic conversation

COLOR STRATEGY: Strategic Minimal
- Clean backgrounds, minimal palette
- Single sophisticated accent

TYPOGRAPHY: Confident, strategic (mix serif + sans)

VIBE: Strategic Partner, Transformation Agent
EMOTIONAL: Challenge → Possibility → Engagement

FINAL: Real expertise presented clearly. Show the why behind the what.
', 'Style 1 - Transformation Story (Change)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for quality.

-- PROTOCOLS: Workshop energy, collaborative, human-centered
✅ Use real workshop offerings, facilitation approach if found
✅ Generate collaborative imagery, workshop moments
❌ Avoid: Corporate stuffiness

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer workshop focus, facilitation style, human-centered approach)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Workshop moments, collaboration, people-centered)

STYLE_ARCHETYPE: Workshop Energy (Collaborative)
REFERENCE INSPIRATION: IDEO, design thinking, innovation consulting

HERO COMPOSITION (85vh):
Structure: HUMAN-CENTERED - People or process
VISUAL: Workshop in action OR collaboration moment
HEADLINE: [INVENT collaborative phrase]
  Examples: "THINK TOGETHER" / "INNOVATION THROUGH COLLABORATION" / "YOUR TEAM, ACTIVATED"
SUBHEADLINE: How collaboration creates results
CTA: "Book Workshop" + "Our Process"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (collaborative, energetic)
2. WORKSHOPS: Types of sessions offered
3. PROCESS: How collaboration unfolds
4. OUTCOMES: What participants achieve
5. FACILITATORS: Human-centered team
6. BOOK: Workshop scheduling

COLOR STRATEGY: Warm, Inviting
- Warm neutrals + energetic accent
- Human-centered palette

TYPOGRAPHY: Friendly, approachable

VIBE: Innovation Lab, Collaborative Partner
EMOTIONAL: Stuck → Energized → Engaged

FINAL: Real workshop content. Energy over corporate.
', 'Style 2 - Workshop Energy (Collaborative)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for thought leadership quality.

-- PROTOCOLS: Expertise-forward, content-rich, intellectual
✅ Use real publications, speaking engagements, expertise areas
✅ Generate professional thought leader imagery
❌ Avoid: Generic consulting vibes

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer thought leadership, publications, unique expertise)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Author-style portraits, publication covers, conference)

STYLE_ARCHETYPE: Thought Leader (Expertise-Forward)
REFERENCE INSPIRATION: Simon Sinek, individual expert brands

HERO COMPOSITION (90vh):
Structure: EXPERT-FORWARD - Leader as focus
VISUAL: Expert portrait OR keynote moment
HEADLINE: [Expert name or INVENT expertise phrase]
  Examples: "[NAME]" / "STRATEGIC INSIGHT" / "EXPERTISE THAT TRANSFORMS"
SUBHEADLINE: Core expertise statement
CTA: "Book [Name]" + "Insights"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (expert-forward)
2. EXPERTISE: What they know best
3. CONTENT: Books, articles, publications
4. SPEAKING: Keynotes, events
5. CONSULTING: How to engage services
6. CONTACT: Direct access

COLOR STRATEGY: Professional, Refined
- Clean, minimal, focused on content
- Professional palette

TYPOGRAPHY: Authoritative, editorial

VIBE: Public Intellectual, Business Author
EMOTIONAL: Interest → Respect → Engage

FINAL: Real expertise content. Substance over style.
', 'Style 3 - Thought Leader (Expertise)' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('legal', 'real-estate', 'tech', 'consultoria')
GROUP BY di.name
ORDER BY di.name;
