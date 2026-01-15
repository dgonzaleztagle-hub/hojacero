-- =================================================================================================
-- GOLD MASTER V3.2 - BATCH 3: SERVICE & CARE (FULL PROTOCOLS)
-- COMPLETE EDITION: Every prompt has ALL protocols expanded
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
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Centered symmetric layouts
❌ Stock medical photos (stethoscopes, smiling doctors)
❌ Blue/cyan gradients (overused in healthcare)
❌ Uniform doctor grids
❌ Sterile without warmth

SELF-CHECK:
1. "Does this look like every clinic?" → Redesign if yes
2. "What makes THIS practice distinctive?" → Specific answer
3. "Does this inspire trust AND comfort?" → Both required

MEMORABILITY: Modern healthcare, not sterile

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Doctors, credentials, services, prices, contact info
STEP 2 - CURATE: 4-8 key services, real doctor profiles
STEP 3 - GAPS: Don''t invent credentials or claims

GOLDEN RULE: "Trust + Care, not just clinical"

⚠️ HEALTH NOTE: Never invent medical credentials or treatment claims

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Modern healthcare moment, professional warmth
SUPPORTING: Facility beauty shots, doctor portraits (editorial, not LinkedIn)
SELF-CHECK: "Builds trust? Eases anxiety? Not stock?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Practice type, specialties, patient demographics)

STYLE_ARCHETYPE: Future Clinical (Tech-Enhanced Healthcare)
REFERENCE: One Medical, Apple Health aesthetic

HERO (85vh):
Structure: ASYMMETRIC - Trust statement + Visual
VISUAL: Modern healthcare moment
HEADLINE: [INVENT care statement]
  Examples: "CARE REIMAGINED" / "YOUR HEALTH PARTNER" / "HEALING STARTS HERE"
CTA: "Book Appointment" + "Services"

SECTIONS (6-8):
1. HERO (clean, trustworthy)
2. SERVICES: <BentoGrid> 4-8 services - ONE featured
3. TEAM: Doctors with real credentials
4. APPROACH: Care differentiator
5. TESTIMONIALS: If found
6. INSURANCE/PAYMENT: Practical info
7. BOOKING: Clear path

COLOR: White OR light blue-grey (#f7fafc)
Accent: Healing green (#00a896) OR calm blue (#0066cc)
NOT cyan gradient

TYPOGRAPHY: Modern clean sans (Inter, Circular)

VIBE: Modern Hospital, Apple Health
EMOTIONAL: Concern → Reassurance → Action

ADAPTIVE:
IF telehealth → Feature virtual care
IF specialist → Deep expertise
IF prices found → Display exactly

FINAL: Real credentials, trust-building. Clean, not sterile.
', 'Style 1 - Future Clinical - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for wellness quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Clinical sterility, generic wellness stock
SELF-CHECK: Natural warmth? Holistic feel? Authentic healing?
SCRAPE: Wellness services, practitioner philosophy, approach
CURATE: Best treatments, healing modalities
IMAGES: Natural textures, peaceful environments, healing imagery
CHECK: "Does this feel like sanctuary?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Holistic Wellness (Natural Healing)
REFERENCE: Boutique spas, wellness retreats

HERO (90vh):
Structure: ORGANIC flow
VISUAL: Peaceful wellness environment
HEADLINE: [INVENT wellness phrase]
  Examples: "WHOLE BODY WELLNESS" / "NATURALLY RESTORED" / "BALANCE FOUND"
CTA: "Start Journey" + "Services"

SECTIONS (6-8):
1. HERO (calming)
2. PHILOSOPHY: Holistic approach
3. SERVICES: <BentoGrid> treatments
4. PRACTITIONERS: With credentials
5. PROGRAMS: Wellness packages
6. TESTIMONIALS: Transformations
7. BOOKING

COLOR: Warm cream (#faf8f5), sage, terracotta
TYPOGRAPHY: Organic serif + friendly sans

VIBE: Wellness Retreat, Integrative Health
EMOTIONAL: Stress → Calm → Hope

FINAL: Real wellness content, warm natural feel.
', 'Style 2 - Holistic Wellness - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for dental quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Scary dental, clinical sterility, dated imagery
SELF-CHECK: Inviting? Anxiety-reducing? Smile-focused?
SCRAPE: Dental services, prices, doctor credentials
CURATE: Key treatments, before/after if permitted
IMAGES: Smiles, modern dental office, welcoming
CHECK: "Would I want to visit?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Smile Gallery (Modern Dental)
REFERENCE: Modern dental offices, smile campaigns

HERO (80vh):
Structure: ASYMMETRIC - Smile + Trust
VISUAL: Beautiful smile OR modern office
HEADLINE: [INVENT smile statement]
  Examples: "YOUR BEST SMILE" / "SMILE CONFIDENT" / "BRIGHTER DAYS"
CTA: "Book Consultation" + "Services"

SECTIONS (6-8):
1. HERO (smile-focused)
2. SERVICES: <BentoGrid> treatments - real prices if scraped
3. GALLERY: Before/after if permitted
4. TEAM: Dentist profiles
5. TECHNOLOGY: Modern equipment
6. TESTIMONIALS: Patient success
7. BOOKING

COLOR: Bright white, smile blue (#0099ff) OR mint (#00d4aa)
Add warmth, not sterile
TYPOGRAPHY: Friendly modern sans

VIBE: Modern Dental, Smile Confidence
EMOTIONAL: Anxiety → Comfort → Confidence

ADAPTIVE:
IF cosmetic → Lead with transformations
IF family → Show all-ages
IF real prices → Display exactly

FINAL: Real dental content, anxiety-reducing. Inviting, not scary.
', 'Style 3 - Smile Gallery (Dental) - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- EDUCACIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Boring academic templates
❌ Stock classroom photos
❌ Uniform student grids
❌ Brochure feeling

SELF-CHECK: Inspiring? Transformation visible? Future-focused?
MEMORABILITY: Aspiration for learning

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Programs, pricing, faculty, outcomes
STEP 2 - CURATE: Key programs, success metrics
STEP 3 - GAPS: Invent only positioning, not stats

GOLDEN RULE: "Inspire transformation"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Students in inspiring moment, campus beauty
SUPPORTING: Learning in action, success stories, faculty
SELF-CHECK: "Would I want to learn here?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Institution type, target students, unique value)

STYLE_ARCHETYPE: Future Learning (Modern Education)
REFERENCE: Modern universities, progressive schools

HERO (90vh):
Structure: ASPIRATIONAL
VISUAL: Students inspiring moment OR campus
HEADLINE: [INVENT learning statement]
  Examples: "YOUR FUTURE STARTS HERE" / "LEARN TO LEAD" / "EDUCATION EVOLVED"
CTA: "Explore Programs" + "Apply Now"

SECTIONS (7-9):
1. HERO (aspirational)
2. PROGRAMS: <BentoGrid> courses/degrees
3. OUTCOMES: Success metrics
4. FACULTY: Instructor profiles
5. EXPERIENCE: Learning approach
6. TESTIMONIALS: Student stories
7. ADMISSIONS: Application info
8. VISIT: Campus tour

COLOR: Clean base + energetic accent (school colors if found)
TYPOGRAPHY: Modern academic

VIBE: Inspiring Institution
EMOTIONAL: Aspiration → Possibility → Enrollment

FINAL: Real programs, inspirational presentation.
', 'Style 1 - Future Learning - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for bootcamp quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Generic education, no proof of outcomes
SELF-CHECK: Results visible? Transformation clear? Urgency?
SCRAPE: Curriculum, placement rates, cohorts
CURATE: Outcomes, career changes, curriculum
IMAGES: Career transformation, students learning/coding
CHECK: "Does this prove career change?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Career Accelerator (Bootcamp)
REFERENCE: Le Wagon, General Assembly

HERO (85vh):
Structure: STATS-FORWARD
VISUAL: Graduates in new careers
HEADLINE: [INVENT career phrase]
  Examples: "LAUNCH YOUR CAREER" / "12 WEEKS TO NEW YOU" / "CODE TO HIRED"
STATS: Placement %, salary, program length
CTA: "Apply Now" + "Curriculum"

SECTIONS (7-9):
1. HERO (stats)
2. OUTCOMES: Career metrics prominently
3. CURRICULUM: Week-by-week
4. FORMAT: In-person, remote, schedule
5. STORIES: Before/after careers
6. FINANCING: Payment options
7. APPLY: Cohort dates, urgency

COLOR: Dark mode, tech accent
TYPOGRAPHY: Bold, urgent

VIBE: Career Catalyst, Transformation
EMOTIONAL: Frustration → Hope → Apply

FINAL: Real results, urgency. Proof, not promises.
', 'Style 2 - Career Accelerator - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for platform quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Overwhelming course dump, no discovery UX
SELF-CHECK: Easy to explore? Learner-friendly? Accessible?
SCRAPE: Course catalog, categories, instructors
CURATE: Featured courses, learning paths
IMAGES: Platform UI, learner diversity, course previews
CHECK: "Can I find what I want easily?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Learning Platform (Accessible Knowledge)
REFERENCE: Coursera, Udemy

HERO (80vh):
Structure: PLATFORM with search
VISUAL: Course catalog or dashboard
HEADLINE: [INVENT accessibility phrase]
  Examples: "LEARN ANYTHING" / "SKILLS FOR EVERYONE" / "KNOWLEDGE UNLOCKED"
SEARCH: Prominent
CTA: "Browse Courses" + "Start Free"

SECTIONS (6-8):
1. HERO (platform)
2. FEATURED: Curated selection
3. PATHS: Career journeys
4. HOW IT WORKS: Features
5. INSTRUCTORS: If applicable
6. TESTIMONIALS: Learner success
7. PRICING: Tiers

COLOR: Digital learning, accessible palette
TYPOGRAPHY: Clear, navigational

VIBE: Accessible Learning
EMOTIONAL: Curiosity → Discovery → Enrollment

FINAL: Real courses, discovery experience.
', 'Style 3 - Learning Platform - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- CONSTRUCCIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Generic contractor templates
❌ Hard hat stock photos
❌ Yellow/black cliché
❌ Brochure feeling

SELF-CHECK: Portfolio-forward? Craftsmanship visible? Would win the bid?
MEMORABILITY: Built to impress

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Projects, services, certifications, team
STEP 2 - CURATE: 4-8 best projects, specialties
STEP 3 - GAPS: Invent descriptions only, not project names

GOLDEN RULE: "Portfolio is proof"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: Stunning completed project OR dramatic build moment
SUPPORTING: Before/after, detail shots, craftsmanship
SELF-CHECK: "Would this win a project bid?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Specialty: residential, commercial, renovation)

STYLE_ARCHETYPE: Master Builder (Craftsmanship)
REFERENCE: Architectural portfolios, premium contractors

HERO (90vh):
Structure: PROJECT-FORWARD
VISUAL: Stunning completed project
HEADLINE: [INVENT craftsmanship phrase]
  Examples: "BUILT TO LAST" / "YOUR VISION BUILT" / "CRAFTED WITH PRIDE"
CTA: "View Portfolio" + "Get Estimate"

SECTIONS (7-9):
1. HERO (project showcase)
2. SERVICES: <BentoGrid> service areas
3. PORTFOLIO: Before/after gallery
4. PROCESS: Consultation → Completion
5. TEAM: Key personnel
6. CERTIFICATIONS: Licenses, awards
7. TESTIMONIALS: Client projects
8. ESTIMATE: Free quote

COLOR: Industrial concrete or warm wood tones
TYPOGRAPHY: Bold, reliable

VIBE: Master Craftsman
EMOTIONAL: Trust → Confidence → Hire

ADAPTIVE:
IF real projects → Feature with details
IF certifications → Display prominently

FINAL: Real projects, craftsmanship presentation.
', 'Style 1 - Master Builder - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for tech quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Traditional contractor only, no tech
SELF-CHECK: Tech-forward? Innovation visible? Modern build?
SCRAPE: BIM, drones, project management tech
CURATE: Technology advantages
IMAGES: 3D renders, tech tools, modern construction
CHECK: "Innovation clear?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: TechBuild (Innovation Construction)
REFERENCE: Prefab companies, smart construction

HERO (85vh):
Structure: TECH-FORWARD with 3D visualization
VISUAL: Render OR tech-enhanced construction
HEADLINE: [INVENT innovation phrase]
  Examples: "CONSTRUCTION EVOLVED" / "BUILT SMART" / "PRECISION BUILDING"
CTA: "Visualize Your Build" + "Technology"

SECTIONS (6-8):
1. HERO (tech)
2. TECHNOLOGY: Tools and innovation
3. VISUALIZATION: 3D walkthroughs
4. PORTFOLIO: Tech-enabled projects
5. PROCESS: How tech improves outcomes
6. CONSULTATION

COLOR: Clean modern, tech accents
TYPOGRAPHY: Modern, precise

VIBE: Innovation Builder
EMOTIONAL: Vision → Confidence → Engage

FINAL: Real technology, innovation presentation.
', 'Style 2 - TechBuild - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for heritage quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Only modern, no heritage story
SELF-CHECK: Legacy visible? Trust through history? Community roots?
SCRAPE: Years in business, landmark projects, family history
CURATE: Heritage story, notable builds
IMAGES: Historical photos, landmark projects, family
CHECK: "Trust earned over decades?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Heritage Craftsman (Legacy)
REFERENCE: Multi-generational builders, restoration

HERO (85vh):
Structure: LEGACY-FOCUSED
VISUAL: Landmark project OR founders
HEADLINE: [INVENT heritage phrase]
  Examples: "BUILT FOR GENERATIONS" / "LEGACY OF CRAFT" / "TRUSTED SINCE [YEAR]"
CTA: "Our Story" + "View Projects"

SECTIONS (7-9):
1. HERO (legacy)
2. OUR STORY: History
3. LANDMARK PROJECTS: Notable builds
4. CRAFTSMANSHIP: Values
5. TEAM: Multi-generational
6. COMMUNITY: Local involvement
7. TESTIMONIALS: Long-term clients
8. CONTACT

COLOR: Heritage warmth, antique tones, gold
TYPOGRAPHY: Classic, timeless serif

VIBE: Heritage Builder, Community Institution
EMOTIONAL: Respect → Trust → Hire

FINAL: Real history, heritage presentation.
', 'Style 3 - Heritage Craftsman - FULL PROTOCOLS' FROM ind;

-- =================================================================================================
-- FITNESS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Override for Awwwards quality.

-- =============================================================================
-- DESIGN JUDGMENT PROTOCOL
-- =============================================================================
ANTI-PATTERNS (NEVER DO):
❌ Generic gym templates
❌ Stock fitness poses
❌ Same-y class grids
❌ Intimidating without inviting

SELF-CHECK: Motivating? Energy without intimidation? Transformation visible?
MEMORABILITY: Body transformation energy

-- =============================================================================
-- CONTENT EXTRACTION PROTOCOL
-- =============================================================================
STEP 1 - SCRAPE: Classes, trainers, pricing, schedules
STEP 2 - CURATE: 4-6 key programs, featured trainers
STEP 3 - GAPS: Invent class descriptions, not credentials

GOLDEN RULE: "Motivate without intimidate"

-- =============================================================================
-- ASSET GENERATION PROTOCOL
-- =============================================================================
HERO: High-energy workout moment OR transformation result
SUPPORTING: Trainer action shots, class intensity, before/after
SELF-CHECK: "Does this motivate someone to join?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
INTELLIGENCE_PROTOCOL:
- MODE: EDITORIAL_CURATION
- SCRAPING_DEPTH: DEEP (Gym type: crossfit, boutique, studio)

STYLE_ARCHETYPE: Transformation Energy (High-Intensity)
REFERENCE: Boutique fitness, athletic brands

HERO (95vh):
Structure: KINETIC - Energy and motion
VISUAL: Intense workout moment
HEADLINE: [INVENT power statement]
  Examples: "PUSH YOUR LIMITS" / "UNLEASH POWER" / "TRANSFORM TODAY"
CTA: "Start Free Trial" + "Classes"

SECTIONS (6-8):
1. HERO (high-energy)
2. PROGRAMS: <BentoGrid> training types - ONE featured
3. TRANSFORMATIONS: Before/after
4. TRAINERS: Profiles with credentials
5. SCHEDULE: Class calendar
6. FACILITY: Equipment, space
7. MEMBERSHIP: Pricing, trial
8. JOIN CTA

COLOR: Dark dramatic OR bright white
Accent: Electric blue, volt yellow, power red
TYPOGRAPHY: Bold, athletic

VIBE: Transformation Factory
EMOTIONAL: Frustration → Motivation → Join

ADAPTIVE:
IF crossfit → Community intensity
IF boutique → Style + experience
IF real prices → Display exactly

FINAL: Real programs, energy presentation. Motivate!
', 'Style 1 - Transformation Energy - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for wellness quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Hyper-intensity, aggressive vibes
SELF-CHECK: Calm energy? Mind-body connection? Healing movement?
SCRAPE: Yoga, meditation, wellness classes
CURATE: Wellness modalities, teacher philosophy
IMAGES: Peaceful workout, wellness moments, sanctuary vibes
CHECK: "Does this feel like healing space?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Wellness Sanctuary (Holistic Fitness)
REFERENCE: Yoga studios, mindful fitness

HERO (85vh):
Structure: CALM - Peaceful, centered
VISUAL: Serene yoga/wellness moment
HEADLINE: [INVENT wellness phrase]
  Examples: "FIND YOUR BALANCE" / "MOVE WITH PURPOSE" / "WELLNESS RESTORED"
CTA: "Try A Class" + "Explore"

SECTIONS (6-8):
1. HERO (calm)
2. APPROACH: Holistic philosophy
3. CLASSES: <BentoGrid> yoga, meditation
4. TEACHERS: Training credentials
5. PROGRAMS: Wellness challenges
6. COMMUNITY: Connection
7. SCHEDULE + MEMBERSHIP

COLOR: Warm cream, natural tones, sage
TYPOGRAPHY: Organic, peaceful

VIBE: Healing Space, Mindful Movement
EMOTIONAL: Stress → Calm → Commitment

FINAL: Real wellness content, peaceful energy.
', 'Style 2 - Wellness Sanctuary - FULL PROTOCOLS' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Override for performance quality.

-- =============================================================================
-- DESIGN JUDGMENT + CONTENT + ASSETS
-- =============================================================================
ANTI-PATTERNS: Generic fitness, no data/science
SELF-CHECK: Data-driven? Athletic performance? Measurable results?
SCRAPE: Performance programs, testing, sports focus
CURATE: Training methodology, performance metrics
IMAGES: Athletes training, performance data, sports context
CHECK: "Would a competitive athlete train here?"

-- =============================================================================
-- INDUSTRY-SPECIFIC
-- =============================================================================
STYLE_ARCHETYPE: Performance Lab (Athletic Training)
REFERENCE: Olympic training, D1 athletics

HERO (90vh):
Structure: DATA-DRIVEN with metrics
VISUAL: Athlete in peak performance
HEADLINE: [INVENT performance phrase]
  Examples: "TRAIN LIKE A PRO" / "PEAK PERFORMANCE" / "BUILT TO COMPETE"
CTA: "Assessment" + "Programs"

SECTIONS (6-8):
1. HERO (athlete + data)
2. PROGRAMS: Sport-specific
3. TESTING: Performance assessments
4. COACHING: Staff credentials
5. RESULTS: Athlete outcomes
6. METHODOLOGY: Science-backed
7. FACILITY + ASSESSMENT

COLOR: Performance palette - black, white, electric
TYPOGRAPHY: Technical, bold

VIBE: Elite Training Facility
EMOTIONAL: Drive → Confidence → Train

FINAL: Real performance content. Data and science.
', 'Style 3 - Performance Lab - FULL PROTOCOLS' FROM ind;

-- VERIFICATION
SELECT
    di.name as industry,
    COUNT(dp.id) as prompt_count
FROM demo_industries di
LEFT JOIN demo_prompts dp ON di.id = dp.industry_id
WHERE di.slug IN ('salud', 'educacion', 'construccion', 'fitness')
GROUP BY di.name
ORDER BY di.name;
