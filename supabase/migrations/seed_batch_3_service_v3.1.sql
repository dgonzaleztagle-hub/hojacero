-- =================================================================================================
-- GOLD MASTER V3.1 - BATCH 3: SERVICE & CARE
-- FINAL EDITION: Creative Autonomy + Design Judgment + Editorial Curation + Asset Generation
-- =================================================================================================

DELETE FROM demo_prompts WHERE industry_id IN (
    SELECT id FROM demo_industries WHERE slug IN ('salud', 'educacion', 'construccion', 'fitness')
);

-- =================================================================================================
-- SALUD (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'salud')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality when needed.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric hero layouts
❌ Generic medical stock photos (stethoscopes, smiling doctors)
❌ Blue/cyan gradients (overused in healthcare)
❌ Uniform doctor grid where all look identical
❌ Sterile feeling without warmth

SELF-CHECK BEFORE EACH SECTION:
1. "Does this look like every other clinic website?" → If YES, redesign
2. "What makes THIS practice visually distinctive?" → Must have answer
3. "Does this inspire trust AND comfort?" → Must be yes to both

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
✅ Extract real doctor names, credentials, specialties
✅ Use exact services, locations, contact info
✅ Preserve exact pricing if displayed on original site
❌ Don''t invent medical claims or credentials
✅ Curate 4-8 key services from full list

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
- Generate modern medical facility imagery
- Professional but warm healthcare photography
- Do NOT use stock stethoscope/handshake imagery

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer practice type, specialties, patient demographics)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Modern healthcare, professional warmth)
- SELF_AWARENESS: ENABLED (Question: "Does this build trust and ease anxiety?")

STYLE_ARCHETYPE: Future Clinical (Tech-Enhanced Healthcare)
REFERENCE INSPIRATION: One Medical, modern clinics, Apple Health aesthetic

HERO COMPOSITION (85vh):
Structure: ASYMMETRIC - Trust statement + Visual
VISUAL: Modern healthcare moment OR facility beauty shot
HEADLINE: [INVENT 2-4 word care statement]
  Context: care, health, wellness, healing, trusted
  Examples: "CARE REIMAGINED" / "YOUR HEALTH PARTNER" / "HEALING STARTS HERE"
  Use real practice name if strong branding
SUBHEADLINE: Services offered or care philosophy
CTA: "Book Appointment" + "Our Services"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (clean, trustworthy, asymmetric)
2. SERVICES: <BentoGrid> 4-8 key services - real names/prices if scraped, ONE featured
3. TEAM: Doctor profiles with real credentials
4. APPROACH: What makes care different
5. TESTIMONIALS: Patient reviews (if found)
6. INSURANCE/PAYMENT: Practical info
7. BOOKING: Clear appointment path

DENSITY: Min 6 sections, 10-14 images, clean professional spacing

COLOR STRATEGY: Clinical Trust with Healing Accent
- Background: Pure white OR light blue-grey (#f7fafc)
- Text: Professional dark (#1a1a1a)
- Accent: Healing green (#00a896) OR calm blue (#0066cc)
- NOT cyan gradient cliché

TYPOGRAPHY: Modern clean sans (Inter, Circular)

VIBE: Modern Hospital, Apple Health, Trustworthy Care
EMOTIONAL: Concern → Reassurance → Action

ADAPTIVE BEHAVIOR:
IF telehealth → Feature virtual care prominently
IF specialist → Deep dive into expertise
IF wellness center → Warmer, more holistic approach
IF prices found → Display exact amounts

FINAL: Real credentials, trust-building presentation. Clean care, not sterile.
', 'Style 1 - Future Clinical (Tech Healthcare)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for wellness warmth.

-- PROTOCOLS: Design Judgment + Editorial Curation + Asset Generation
❌ Never: Clinical sterility, generic wellness stock
✅ Always: Natural warmth, holistic approach, authentic healing

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer wellness approach, practitioner philosophy)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Natural textures, peaceful environments, healing imagery)

STYLE_ARCHETYPE: Holistic Wellness (Natural Healing)
REFERENCE INSPIRATION: Boutique spas, wellness retreats, naturopathic centers

HERO COMPOSITION (90vh):
Structure: ORGANIC - Natural flow, not rigid
VISUAL: Peaceful wellness environment
HEADLINE: [INVENT wellness statement]
  Examples: "WHOLE BODY WELLNESS" / "NATURALLY RESTORED" / "BALANCE FOUND"
SUBHEADLINE: Wellness philosophy
CTA: "Start Your Journey" + "Explore Services"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (organic, calming)
2. PHILOSOPHY: Holistic approach
3. SERVICES: <BentoGrid> treatments - real if scraped
4. PRACTITIONERS: With real credentials
5. PROGRAMS: Wellness packages
6. TESTIMONIALS: Transformation stories
7. BOOKING: Consultation scheduling

COLOR STRATEGY: Natural Wellness
- Warm cream backgrounds (#faf8f5)
- Earth/healing tones (sage, terracotta)

TYPOGRAPHY: Organic serif + friendly sans

VIBE: Wellness Retreat, Integrative Health
EMOTIONAL: Stress → Calm → Hope

FINAL: Real wellness content, warm natural presentation.
', 'Style 2 - Holistic Wellness (Natural)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for dental-specific quality.

-- PROTOCOLS: Trust-building, anxiety-reducing, smile-focused
✅ Use real dental services, prices, doctor credentials
✅ Generate modern dental facility imagery
❌ Avoid: Scary dental imagery, clinical sterility

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer practice type: family, cosmetic, ortho, pediatric)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Smile photography, modern dental office, welcoming)

STYLE_ARCHETYPE: Smile Gallery (Modern Dental Confidence)
REFERENCE INSPIRATION: Modern dental offices, smile transformation campaigns

HERO COMPOSITION (80vh):
Structure: ASYMMETRIC - Smile focus + Trust elements
VISUAL: Beautiful smile OR modern dental office
HEADLINE: [INVENT smile statement]
  Examples: "YOUR BEST SMILE" / "SMILE WITH CONFIDENCE" / "BRIGHTER DAYS"
SUBHEADLINE: Practice differentiator
CTA: "Book Consultation" + "Our Services"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (smile-focused, inviting, asymmetric)
2. SERVICES: <BentoGrid> dental treatments - real prices if scraped, ONE featured
3. SMILE GALLERY: Before/after if permitted
4. TEAM: Dentist profiles with credentials
5. TECHNOLOGY: Modern equipment, comfort amenities
6. TESTIMONIALS: Patient success stories
7. BOOKING: Easy appointment path

COLOR STRATEGY: Dental Clean with Friendly Accent
- Bright white (#ffffff)
- Accent: Smile blue (#0099ff) OR mint (#00d4aa)
- NOT sterile - add warmth

TYPOGRAPHY: Friendly modern sans

VIBE: Modern Dental Office, Smile Confidence
EMOTIONAL: Anxiety → Comfort → Confidence

ADAPTIVE BEHAVIOR:
IF cosmetic focus → Lead with transformations
IF family practice → Show all-ages care
IF pediatric → Colorful, fun, anxiety-reducing
IF real prices → Display exactly

FINAL: Real dental content, anxiety-reducing presentation. Inviting, not scary.
', 'Style 3 - Smile Gallery (Dental)' FROM ind;

-- =================================================================================================
-- EDUCACIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Boring academic template, uniform student grids, stock classroom photos
✅ Always: Inspiring future, transformation stories, aspirational presentation
SELF-CHECK: "Does this inspire someone to learn here?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real programs, pricing, faculty if scraped
✅ Generate aspirational educational imagery
✅ Curate key programs from full catalog

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer institution type, target students, unique value)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Campus beauty, learning moments, student success)
- SELF_AWARENESS: ENABLED (Question: "Does this inspire transformation?")

STYLE_ARCHETYPE: Future Learning (Modern Education)
REFERENCE INSPIRATION: Modern universities, progressive schools, online platforms

HERO COMPOSITION (90vh):
Structure: ASPIRATIONAL - Future focus
VISUAL: Students in inspiring learning moment OR campus beauty
HEADLINE: [INVENT learning statement]
  Examples: "YOUR FUTURE STARTS HERE" / "LEARN TO LEAD" / "EDUCATION EVOLVED"
SUBHEADLINE: What makes this education different
CTA: "Explore Programs" + "Apply Now"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (aspirational, student-centered)
2. PROGRAMS: <BentoGrid> courses/degrees - real if scraped
3. OUTCOMES: Job placement, success metrics
4. FACULTY: Real instructor profiles
5. EXPERIENCE: Learning approach
6. TESTIMONIALS: Student/alumni stories
7. ADMISSIONS: Application info
8. VISIT: Virtual tour or campus info

COLOR STRATEGY: Academic Energy
- Clean base + energetic accent
- School colors if found

TYPOGRAPHY: Modern academic

VIBE: Inspiring Institution, Future-Forward
EMOTIONAL: Aspiration → Possibility → Enrollment

FINAL: Real programs, inspirational presentation. Transform lives.
', 'Style 1 - Future Learning (Modern Education)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for bootcamp urgency.

-- PROTOCOLS: Results-driven, proof-heavy, career transformation
✅ Use real curriculum, placement stats if found
✅ Generate career-focused imagery
❌ Avoid: Generic education stock

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer bootcamp type, placement rates, curriculum)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Career transformation, students coding/learning)

STYLE_ARCHETYPE: Career Accelerator (Bootcamp)
REFERENCE INSPIRATION: Le Wagon, General Assembly, coding bootcamps

HERO COMPOSITION (85vh):
Structure: BOLD STATS - Transformation metrics upfront
VISUAL: Students or recent grads in new careers
HEADLINE: [INVENT career transformation phrase]
  Examples: "LAUNCH YOUR CAREER" / "12 WEEKS TO NEW YOU" / "CODE TO HIRED"
STATS: Job placement %, avg salary, program length
CTA: "Apply Now" + "See Curriculum"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (stats-forward)
2. OUTCOMES: Career metrics prominently
3. CURRICULUM: Week-by-week breakdown
4. FORMAT: In-person, remote, schedule
5. STUDENT STORIES: Before/after careers
6. FINANCING: Payment options
7. APPLY: Cohort dates, urgency

COLOR STRATEGY: Tech Bootcamp Energy
- Dark mode option
- Vibrant tech accent

TYPOGRAPHY: Bold, urgent

VIBE: Career Catalyst, Transformation Vehicle
EMOTIONAL: Frustration → Hope → Apply

FINAL: Real results, urgency presentation. Back claims with proof.
', 'Style 2 - Career Accelerator (Bootcamp)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for platform quality.

-- PROTOCOLS: Platform-forward, course discovery, accessible
✅ Use real course catalog if scraped
✅ Generate platform UI imagery
❌ Avoid: Overwhelming course dump

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer platform type, course variety, target learners)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Platform UI, learner diversity, course thumbnails)

STYLE_ARCHETYPE: Learning Platform (Accessible Knowledge)
REFERENCE INSPIRATION: Coursera, Udemy, cohort learning platforms

HERO COMPOSITION (80vh):
Structure: PLATFORM-FORWARD - Discovery focus
VISUAL: Course catalog or platform dashboard
HEADLINE: [INVENT learning accessibility phrase]
  Examples: "LEARN ANYTHING" / "SKILLS FOR EVERYONE" / "KNOWLEDGE UNLOCKED"
SEARCH: Prominent course search
CTA: "Browse Courses" + "Start Free"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (platform with search)
2. FEATURED COURSES: Curated selection
3. LEARNING PATHS: Career-focused journeys
4. HOW IT WORKS: Platform features
5. INSTRUCTORS: If applicable
6. TESTIMONIALS: Learner success
7. PRICING: Free vs. paid tiers

COLOR STRATEGY: Digital Learning
- Clean, accessible palette
- Learning-friendly accent

TYPOGRAPHY: Clear, navigational

VIBE: Accessible Learning, Skills Platform
EMOTIONAL: Curiosity → Discovery → Enrollment

FINAL: Real courses, platform presentation. Enable discovery.
', 'Style 3 - Learning Platform (Accessible)' FROM ind;

-- =================================================================================================
-- CONSTRUCCIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Generic contractor template, hard hat stock photos, yellow/black cliché
✅ Always: Portfolio-forward, craftsmanship focus, project showcase
SELF-CHECK: "Would this win a project bid?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real project photos if scraped, service areas, expertise
✅ Generate high-quality construction/architecture photography
✅ Curate best 4-8 projects for portfolio

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer specialty: residential, commercial, renovation)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Project photography, before/after, craftsmanship)
- SELF_AWARENESS: ENABLED (Question: "Does this show expertise?")

STYLE_ARCHETYPE: Master Builder (Craftsmanship)
REFERENCE INSPIRATION: Architectural portfolios, premium contractors

HERO COMPOSITION (90vh):
Structure: PROJECT-FORWARD - Portfolio as hero
VISUAL: Stunning completed project OR dramatic build moment
HEADLINE: [INVENT craftsmanship phrase]
  Examples: "BUILT TO LAST" / "YOUR VISION BUILT" / "CRAFTED WITH PRIDE"
SUBHEADLINE: Company specialty or values
CTA: "View Portfolio" + "Get Estimate"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (project showcase)
2. SERVICES: <BentoGrid> service areas
3. PORTFOLIO: Before/after project gallery
4. PROCESS: How they work (consultation → completion)
5. TEAM: Key personnel
6. CERTIFICATIONS: Licenses, insurance, awards
7. TESTIMONIALS: Client projects
8. ESTIMATE: Free quote request

COLOR STRATEGY: Industrial Craft
- Light concrete or warm wood tones
- Accent matching specialty (warm for residential, industrial for commercial)

TYPOGRAPHY: Bold, reliable

VIBE: Master Craftsman, Trusted Builder
EMOTIONAL: Trust → Confidence → Hire

FINAL: Real projects, craftsmanship presentation. Portfolio quality.
', 'Style 1 - Master Builder (Craftsmanship)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for tech-forward construction.

-- PROTOCOLS: Technology/innovation in building
✅ Use real tech if mentioned (BIM, drones, project management)
✅ Generate tech-construction imagery
❌ Avoid: Traditional contractor vibes only

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer tech adoption, innovation positioning)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Tech tools, 3D renders, modern construction)

STYLE_ARCHETYPE: TechBuild (Innovation Construction)
REFERENCE INSPIRATION: Prefab companies, smart construction, BIM-focused

HERO COMPOSITION (85vh):
Structure: TECH-FORWARD - Visualization focus
VISUAL: 3D render OR tech-enhanced construction
HEADLINE: [INVENT innovation phrase]
  Examples: "CONSTRUCTION EVOLVED" / "BUILT SMART" / "PRECISION BUILDING"
SUBHEADLINE: Technology differentiation
CTA: "Visualize Your Build" + "Our Technology"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (tech-forward)
2. TECHNOLOGY: Tools and innovation used
3. VISUALIZATION: 3D walkthroughs/renders
4. PORTFOLIO: Tech-enabled projects
5. PROCESS: How tech improves outcomes
6. CONSULTATION: Tech-enabled planning

COLOR STRATEGY: Construction Tech
- Clean modern palette
- Tech accent colors

TYPOGRAPHY: Modern, precise

VIBE: Innovation Builder, Tech-Enabled
EMOTIONAL: Vision → Confidence → Engage

FINAL: Real technology, innovation presentation. Progress through tech.
', 'Style 2 - TechBuild (Innovation)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for heritage quality.

-- PROTOCOLS: Legacy, multi-generational, trust through history
✅ Use real company history, landmark projects if found
✅ Generate heritage-appropriate imagery
❌ Avoid: Only modern without heritage story

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer years in business, family legacy, landmark projects)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Heritage imagery, landmark projects, family photos)

STYLE_ARCHETYPE: Heritage Craftsman (Legacy)
REFERENCE INSPIRATION: Multi-generational builders, restoration specialists

HERO COMPOSITION (85vh):
Structure: LEGACY-FOCUSED - History as trust
VISUAL: Landmark project OR family/founders
HEADLINE: [INVENT heritage phrase]
  Examples: "BUILT FOR GENERATIONS" / "LEGACY OF CRAFT" / "TRUSTED SINCE [YEAR]"
SUBHEADLINE: Years, generations, local roots
CTA: "Our Story" + "View Projects"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (legacy-focused)
2. OUR STORY: Family/company history
3. LANDMARK PROJECTS: Notable builds
4. CRAFTSMANSHIP: Traditional values
5. TEAM: Multi-generational if applicable
6. COMMUNITY: Local involvement
7. TESTIMONIALS: Long-term clients
8. CONTINUE: Contact for new projects

COLOR STRATEGY: Heritage Warmth
- Warm cream, antique tones
- Heritage gold or trade colors

TYPOGRAPHY: Classic, timeless

VIBE: Heritage Builder, Community Institution
EMOTIONAL: Respect → Trust → Hire

FINAL: Real history, heritage presentation. Trust earned over decades.
', 'Style 3 - Heritage Craftsman (Legacy)' FROM ind;

-- =================================================================================================
-- FITNESS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- DESIGN JUDGMENT PROTOCOL:
❌ Never: Generic gym template, stock fitness poses, same-y class grids
✅ Always: Energy-forward, transformation focus, unique gym personality
SELF-CHECK: "Does this motivate someone to join?"

-- EDITORIAL CURATION + ASSET GENERATION:
✅ Use real class schedules, trainers, pricing if scraped
✅ Generate high-energy fitness photography
✅ Curate 4-6 key programs from full class list

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer gym type: crossfit, boutique, big box, studio)
- ASSET_STRATEGY: SPECIFIC_GENERATION (High-energy workout imagery, transformation photos)
- SELF_AWARENESS: ENABLED (Question: "Does this motivate or intimidate?")

STYLE_ARCHETYPE: Transformation Energy (High-Intensity)
REFERENCE INSPIRATION: Boutique fitness, transformation campaigns, athletic brands

HERO COMPOSITION (95vh):
Structure: KINETIC - Energy and motion
VISUAL: Intense workout moment OR transformation result
HEADLINE: [INVENT power statement]
  Examples: "PUSH YOUR LIMITS" / "UNLEASH YOUR POWER" / "TRANSFORM TODAY"
SUBHEADLINE: What makes this gym different
CTA: "Start Free Trial" + "View Classes"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (high-energy, kinetic)
2. PROGRAMS: <BentoGrid> training types - ONE featured program
3. TRANSFORMATIONS: Before/after results
4. TRAINERS: Profiles with credentials
5. SCHEDULE: Class calendar if applicable
6. FACILITY: Equipment, space, amenities
7. MEMBERSHIP: Pricing tiers, trial offer
8. CTA: Join emphasis

COLOR STRATEGY: Athletic Energy
- Dark dramatic OR bright white
- Energy accent (electric blue, volt yellow, power red)

TYPOGRAPHY: Bold, athletic

VIBE: Transformation Factory, Athletic Performance
EMOTIONAL: Frustration → Motivation → Join

ADAPTIVE BEHAVIOR:
IF crossfit → Intensity, community
IF boutique (spin, barre) → Style, music, experience
IF personal training → One-on-one focus
IF real prices → Display exact

FINAL: Real programs, energy presentation. Motivate without intimidating.
', 'Style 1 - Transformation Energy (High-Intensity)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for wellness quality.

-- PROTOCOLS: Holistic fitness, mind-body, calm energy
✅ Use real class offerings, teacher profiles if scraped
✅ Generate wellness fitness imagery
❌ Avoid: Hyper-intensity that contradicts wellness vibe

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer wellness approach, yoga styles, meditation)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Peaceful workout imagery, wellness moments)

STYLE_ARCHETYPE: Wellness Sanctuary (Holistic Fitness)
REFERENCE INSPIRATION: Yoga studios, wellness retreats, mindful fitness

HERO COMPOSITION (85vh):
Structure: CALM - Peaceful, centered
VISUAL: Serene yoga/wellness moment
HEADLINE: [INVENT wellness statement]
  Examples: "FIND YOUR BALANCE" / "MOVE WITH PURPOSE" / "WELLNESS RESTORED"
SUBHEADLINE: Wellness philosophy
CTA: "Try A Class" + "Explore Wellness"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (calm, centered)
2. APPROACH: Holistic philosophy
3. CLASSES: <BentoGrid> yoga styles, meditation, workshops
4. TEACHERS: Profiles with training credentials
5. PROGRAMS: Wellness challenges, memberships
6. COMMUNITY: Member connection
7. SCHEDULE: Class calendar
8. MEMBERSHIP: Options, intro offers

COLOR STRATEGY: Natural Wellness
- Warm cream, natural tones
- Healing accent (sage, calm blue, earth)

TYPOGRAPHY: Organic, peaceful

VIBE: Healing Space, Mindful Movement
EMOTIONAL: Stress → Calm → Commitment

FINAL: Real wellness content, peaceful presentation. Healing energy.
', 'Style 2 - Wellness Sanctuary (Holistic)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for performance quality.

-- PROTOCOLS: Data-driven, athletic, measurable results
✅ Use real training programs, performance metrics if found
✅ Generate athletic training imagery
❌ Avoid: Generic fitness vibes

INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Infer performance focus, sports specificity, data approach)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Athletes training, performance data, sports context)

STYLE_ARCHETYPE: Performance Lab (Athletic Training)
REFERENCE INSPIRATION: Olympic training centers, D1 athletics, sports performance

HERO COMPOSITION (90vh):
Structure: DATA-DRIVEN - Performance metrics visible
VISUAL: Athlete in peak performance
HEADLINE: [INVENT performance phrase]
  Examples: "TRAIN LIKE A PRO" / "PEAK PERFORMANCE" / "BUILT TO COMPETE"
STATS: Performance metrics (if found)
CTA: "Performance Assessment" + "Our Programs"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (athlete + data)
2. PROGRAMS: Sport-specific training
3. TESTING: Performance assessments
4. COACHING: Staff with credentials
5. RESULTS: Athlete outcomes, metrics
6. METHODOLOGY: Science-backed approach
7. FACILITY: Performance equipment
8. ASSESSMENT: Start evaluation

COLOR STRATEGY: Athletic Performance
- Performance palette (black, white, electric accents)
- Data visualization colors

TYPOGRAPHY: Technical, bold

VIBE: Elite Training Facility, Science of Sport
EMOTIONAL: Drive → Confidence → Train

FINAL: Real performance content. Data and science, not hype.
', 'Style 3 - Performance Lab (Athletic)' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('salud', 'educacion', 'construccion', 'fitness')
GROUP BY di.name
ORDER BY di.name;
