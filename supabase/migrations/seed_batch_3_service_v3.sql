-- =================================================================================================
-- GOLD MASTER V3.0 - BATCH 3: SERVICE & CARE
-- ARCHITECTURE: CREATIVE AUTONOMY + ADAPTIVE INTELLIGENCE + INFINITE VARIABILITY
-- =================================================================================================

DELETE FROM demo_prompts WHERE industry_id IN (
    SELECT id FROM demo_industries WHERE slug IN ('salud', 'educacion', 'construccion', 'fitness')
);

-- =================================================================================================
-- SALUD (3 STYLES)
-- =================================================================================================

-- SALUD - STYLE 1: FUTURE CLINICAL
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'salud')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: This is GUIDANCE, not rigid rules. Override if needed for Awwwards-level quality.
--     HIERARCHY: Brand context > Your judgment > This prompt
--     QUESTION: "Would this win Site of the Day on Awwwards?"

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent medical specialties, treatment approaches, patient outcomes)
- SCRAPING_DEPTH: DEEP (Infer practice type: clinic, hospital, specialist, telehealth)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Clean medical photography, facility shots, compassionate care imagery)
- SELF_AWARENESS: ENABLED (Question: "Does this feel trustworthy or sterile?")

COMPONENTS_LIBRARY:
- BentoGrid: For services or specialties
- TextGenerateEffect: For care philosophy or mission
- InfiniteMovingCards: For patient testimonials or doctor profiles
- Appointment booking: Integrated scheduling

DECISION LOGIC:
- IF multi-specialty clinic → Showcase breadth of services
- IF specialist practice → Deep dive into expertise area
- IF telehealth → Emphasize virtual care convenience

STYLE_ARCHETYPE: Future Clinical (Tech-Enhanced Healthcare)
REFERENCE INSPIRATION: Modern hospitals, Apple Health aesthetic, minimalist medical design

HERO COMPOSITION (85vh):
Structure: Clean, reassuring
VISUAL: Modern medical facility OR compassionate patient-doctor interaction
HEADLINE: [INVENT 2-4 word care statement]
  Context: care, health, wellness, healing, trusted
  Examples: "CARE REIMAGINED" / "YOUR HEALTH PARTNER" / "HEALING STARTS HERE"
  Adapt to practice type (urgent care vs. wellness vs. specialist)
SUBHEADLINE: Services offered or practice philosophy (1 sentence)
CTA: "Book Appointment" + "Our Services"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (clean, trustworthy)
2. SERVICES: <BentoGrid> of specialties or treatments
3. MEET OUR DOCTORS: Professional profiles with credentials and photos
4. PATIENT CARE APPROACH: What makes care different (telemedicine, same-day, holistic)
5. TESTIMONIALS: <InfiniteMovingCards> patient reviews (HIPAA-compliant)
6. INSURANCE & BILLING: Accepted insurance, payment options
7. VIRTUAL CARE: If applicable, telehealth capabilities
8. APPOINTMENT BOOKING: Integrated scheduler with availability

DENSITY: Min 6 sections, 10-14 images (medical facility, doctors, care moments), clean spacing

COLOR STRATEGY: Clinical Trust with Healing Accent
- Background: Pure white (#ffffff) OR very light blue-grey (#f7fafc)
- Text: Professional dark (#1a1a1a)
- Accent: Adaptive based on practice type
  IF wellness/holistic → Healing green spectrum (#00a896 to #00d4aa)
  IF pediatric → Friendly blue spectrum (#4db8ff to #0099ff)
  IF urgent/emergency → Alert red spectrum (#ff3333 to #e53935)
  IF dental → Clean white/blue (#0066cc to #4d94ff)
- Trust signals: Certification badges in original colors

TYPOGRAPHY:
DISPLAY: Modern clean sans (Inter / Circular)
BODY: Highly readable sans (Inter / Public Sans)
EMPHASIS: Bold for important health information

TARGET VIBE: Modern Hospital, Apple Health, Trustworthy Medical Care
EMOTIONAL TONE: Concern → Reassurance → Action (book appointment)

ADAPTIVE BEHAVIOR:
IF telehealth → Prominently feature virtual care, show how it works
IF emergency/urgent care → Show hours, wait times, insurance acceptance
IF specialist → Detail credentials, published research, treatment philosophy
IF family practice → Show all-ages care, preventive focus
IF wellness center → Holistic approach, integrative medicine
IF multi-location → Location selector with maps

CREATIVE FREEDOM: Invent specialties, treatment approaches, patient outcomes (realistic medical claims)
RULE: Trust through transparency. Clean design reflects clean care.

FINAL REMINDER: Medical credibility is paramount. If it feels like a spa instead of healthcare → recalibrate.
', 'Style 1 - Future Clinical (Tech Healthcare)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Wellness is personal and holistic. Override for wellness philosophy.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent wellness programs, holistic treatments, practitioner specialties)
- SCRAPING_DEPTH: DEEP (Infer approach: integrative, naturopathic, functional medicine)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Natural textures, wellness imagery, peaceful environments)
- SELF_AWARENESS: ENABLED (Question: "Does this feel healing or hippie?")

COMPONENTS_LIBRARY:
- BentoGrid: For wellness services or programs
- TextGenerateEffect: For wellness philosophy
- Organic layouts: Natural flow, not rigid grids
- Video: Practitioner introductions or facility tours

DECISION LOGIC:
- IF integrative medicine → Balance Western and alternative approaches
- IF spa/wellness → Emphasize relaxation, self-care
- IF functional medicine → Root cause approach, personalized care

STYLE_ARCHETYPE: Holistic Wellness (Natural Healing)
REFERENCE INSPIRATION: Boutique spas, wellness retreats, naturopathic medicine

HERO COMPOSITION (90vh):
Structure: Organic, calming
VISUAL: Nature-inspired wellness imagery (plants, natural light, peaceful spaces)
HEADLINE: [INVENT 2-4 word wellness statement]
  Context: whole, balance, natural, restore, thrive
  Examples: "WHOLE BODY WELLNESS" / "NATURALLY RESTORED" / "BALANCE FOUND"
SUBHEADLINE: Wellness philosophy or approach
CTA: "Start Your Journey" + "Explore Services"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (organic, calming)
2. OUR PHILOSOPHY: Holistic approach to health
3. WELLNESS SERVICES: <BentoGrid> of treatments (acupuncture, nutrition, massage, etc.)
4. PRACTITIONER PROFILES: Credentials and specialties
5. PROGRAMS: Wellness packages or memberships
6. CLIENT TRANSFORMATIONS: Before/after stories (respectful, not exploitative)
7. VIRTUAL CONSULTATIONS: If offered
8. BOOKING: Schedule consultation or treatment

DENSITY: Min 6 sections, 12-16 images (natural, wellness-focused, organic), generous spacing

COLOR STRATEGY: Natural Wellness with Earth Tones
- Background: Warm cream (#faf8f5 to #f5f3f0)
- Text: Warm dark brown (#3e2723)
- Accent: Earth green spectrum (#7cb342 to #558b2f) OR healing teal (#00897b)
- Natural textures: Wood, stone, plants
- ADAPTIVE: Calming, natural, not clinical

TYPOGRAPHY:
DISPLAY: Organic serif (Lora / Crimson) OR friendly sans
BODY: Highly readable (Inter / Public Sans)
EMPHASIS: Gentle, not aggressive

TARGET VIBE: Wellness Retreats, Integrative Medicine, Natural Healing
EMOTIONAL TONE: Stress → Calm → Hope

ADAPTIVE BEHAVIOR:
IF acupuncture → Show treatment rooms, explain process
IF nutrition counseling → Emphasize personalized plans
IF massage therapy → Show peaceful treatment spaces
IF yoga/meditation → Include class schedules, instructor profiles
IF functional medicine → Explain testing, root cause approach
IF membership model → Show tiers, benefits, value

CREATIVE FREEDOM: Invent wellness programs, treatment modalities, client outcomes
RULE: Healing without pseudoscience. Natural but credible.

FINAL: Calming and trustworthy. If it feels like unproven health claims → add credibility.
', 'Style 2 - Holistic Wellness (Natural)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Dental needs trust and modern comfort. Override for practice personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent dental services, technology, comfort amenities)
- SCRAPING_DEPTH: DEEP (Infer practice type: family, cosmetic, orthodontics, pediatric)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Modern dental office, smile transformations, technology)
- SELF_AWARENESS: ENABLED (Question: "Does this ease dental anxiety or increase it?")

COMPONENTS_LIBRARY:
- BentoGrid: For dental services
- Before/after sliders: Smile transformations
- InfiniteMovingCards: Patient testimonials
- 3D tooth models: If applicable for education

DECISION LOGIC:
- IF cosmetic dentistry → Lead with smile transformations
- IF family dentistry → Show all-ages care, preventive focus
- IF pediatric → Fun, colorful, anxiety-reducing

STYLE_ARCHETYPE: Smile Gallery (Modern Dental Confidence)
REFERENCE INSPIRATION: Modern dental offices, smile transformation campaigns

HERO COMPOSITION (80vh):
Structure: Smile-focused
VISUAL: Beautiful smile close-up OR modern dental office
HEADLINE: [INVENT 2-4 word smile statement]
  Context: smile, confident, bright, healthy, transform
  Examples: "YOUR BEST SMILE" / "SMILE WITH CONFIDENCE" / "BRIGHTER DAYS"
SUBHEADLINE: Services offered or practice differentiator
CTA: "Book Consultation" + "See Smile Gallery"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (smile-focused, inviting)
2. DENTAL SERVICES: <BentoGrid> of treatments (cleaning, whitening, implants, ortho)
3. SMILE GALLERY: Before/after transformations with sliders
4. MEET THE DENTISTS: Profiles with credentials
5. TECHNOLOGY: Modern equipment, comfort amenities (sedation, entertainment)
6. PATIENT TESTIMONIALS: <InfiniteMovingCards> reviews
7. INSURANCE & FINANCING: Accepted plans, payment options
8. NEW PATIENT SPECIAL: If applicable, first visit offer

DENSITY: Min 6 sections, 14-20 images (smiles, office, technology), bright and clean

COLOR STRATEGY: Dental Clean with Friendly Accent
- Background: Bright white (#ffffff)
- Text: Professional dark (#1a1a1a)
- Accent: Smile blue spectrum (#0099ff to #00ccff) OR mint green (#00d4aa)
- Trust signals: Professional association badges
- ADAPTIVE: Bright, clean, not sterile

TYPOGRAPHY:
DISPLAY: Friendly modern sans (Circular / Inter Display)
BODY: Clean, readable (Inter / Public Sans)
EMPHASIS: Approachable, not clinical

TARGET VIBE: Modern Dental Office, Smile Transformation Campaigns
EMOTIONAL TONE: Anxiety → Comfort → Confidence

ADAPTIVE BEHAVIOR:
IF cosmetic focus → Lead with dramatic transformations
IF family practice → Show kids and adults, preventive care
IF pediatric → Colorful, fun, games/entertainment in waiting room
IF orthodontics → Show Invisalign, braces options, treatment timeline
IF implants/surgery → Emphasize painless procedures, sedation
IF anxiety-friendly → Highlight comfort options, gentle approach

CREATIVE FREEDOM: Invent dental technologies, smile transformations, patient experiences
RULE: Ease anxiety, build confidence. Modern care, not scary dentistry.

FINAL: Approachable and professional. If it still triggers dental fear → soften the approach.
', 'Style 3 - Smile Gallery (Dental)' FROM ind;

-- =================================================================================================
-- EDUCACIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Education is transformation. Override for educational philosophy.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent programs, curriculum highlights, student outcomes, faculty credentials)
- SCRAPING_DEPTH: DEEP (Infer institution type: university, bootcamp, online, K-12, tutoring)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Campus/classroom photos, student success imagery, learning moments)
- SELF_AWARENESS: ENABLED (Question: "Does this inspire learning or feel corporate?")

COMPONENTS_LIBRARY:
- BentoGrid: For programs or courses
- TextGenerateEffect: For mission or educational philosophy
- InfiniteMovingCards: For student/alumni testimonials
- Video embeds: Campus tours or course previews

DECISION LOGIC:
- IF university → Show campus life, academic rigor, outcomes
- IF bootcamp → Emphasize job placement, skills gained, fast-track
- IF online learning → Show platform, flexibility, support

STYLE_ARCHETYPE: Future Learning (Modern Education)
REFERENCE INSPIRATION: Modern universities, online learning platforms, progressive schools

HERO COMPOSITION (90vh):
Structure: Aspirational, student-focused
VISUAL: Students learning/collaborating OR campus beauty shot
HEADLINE: [INVENT 2-4 word learning statement]
  Context: learn, grow, future, discover, transform
  Examples: "YOUR FUTURE STARTS HERE" / "LEARN TO LEAD" / "EDUCATION EVOLVED"
  Adapt to institution level and type
SUBHEADLINE: What makes this education different or program focus
CTA: "Explore Programs" + "Apply Now" OR "Start Learning"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (aspirational, student-centered)
2. PROGRAMS: <BentoGrid> of courses/degrees/tracks
3. STUDENT OUTCOMES: Job placement, grad school acceptance, career success
4. FACULTY: Instructor/professor profiles with credentials
5. STUDENT LIFE: Campus activities, clubs, community (if applicable)
6. LEARNING EXPERIENCE: Pedagogy, hands-on, project-based, etc.
7. ADMISSIONS: Process, requirements, financial aid
8. TESTIMONIALS: <InfiniteMovingCards> student/alumni stories
9. VIRTUAL TOUR: If campus-based, or platform demo if online

DENSITY: Min 7 sections, 15-20 images (students, campus/platform, learning moments)

COLOR STRATEGY: Academic Trust with Youth Energy
- Background: Clean white (#ffffff) OR light warm grey (#f7f7f7)
- Text: Professional dark (#1a1a1a)
- Accent: Adaptive based on institution
  IF university → School colors OR academic blue (#003d7a to #0052a3)
  IF tech bootcamp → Tech purple (#6c5ce7) OR code green (#00d4aa)
  IF K-12 → Friendly multi-color spectrum
  IF online → Digital blue (#0066ff)
- ADAPTIVE: Professional yet energetic

TYPOGRAPHY:
DISPLAY: Modern academic (Lora / Inter Display)
BODY: Highly readable (Inter / Public Sans)
EMPHASIS: Inspiring, not bureaucratic

TARGET VIBE: Modern Universities, Progressive Schools, Online Learning Platforms
EMOTIONAL TONE: Aspiration → Possibility → Enrollment

ADAPTIVE BEHAVIOR:
IF university → Show campus, research, student life, outcomes
IF bootcamp → Job placement stats, curriculum, career services
IF online platform → Show UI, flexibility, student support
IF K-12 school → Parent + student appeal, safety, values
IF tutoring service → Personalization, results, subject expertise
IF certification program → Industry recognition, credential value

CREATIVE FREEDOM: Invent programs, student outcomes, faculty bios (realistic educational claims)
RULE: Inspire learning, not sell degrees. Transform lives, not process students.

FINAL REMINDER: Education is hope. If it feels like a transaction → emphasize transformation.
', 'Style 1 - Future Learning (Modern Education)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Bootcamps promise career transformation. Deliver proof, not promises.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent curriculum modules, job placement data, hiring partners)
- SCRAPING_DEPTH: DEEP (Infer bootcamp type: coding, design, data, marketing)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Students coding/working, career fair imagery, success stories)
- SELF_AWARENESS: ENABLED (Question: "Is this credible or overselling?")

COMPONENTS_LIBRARY:
- VelocityScroll: For impact stats ("94% JOB PLACEMENT")
- BentoGrid: For curriculum modules
- InfiniteMovingCards: For hiring partner logos
- Progress trackers: Learning journey visualization

DECISION LOGIC:
- IF coding bootcamp → Show languages/frameworks, portfolio projects
- IF design bootcamp → Show design process, portfolio work
- IF data science → Show tools (Python, SQL), capstone projects

STYLE_ARCHETYPE: Career Accelerator (Results-Driven Bootcamp)
REFERENCE INSPIRATION: Le Wagon, General Assembly, modern bootcamp sites

HERO COMPOSITION (85vh):
Structure: Bold, outcome-focused
VISUAL: Recent grads celebrating OR students working intensely
HEADLINE: [INVENT 2-4 word career transformation statement]
  Context: career, launch, code, design, hired, transform
  Examples: "LAUNCH YOUR CAREER" / "CODE TO HIRED" / "12 WEEKS TO NEW YOU"
STATS OVERLAY: Key metrics (job placement %, avg salary, weeks)
CTA: "Apply Now" + "See Curriculum"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (outcome-focused with stats)
2. JOB PLACEMENT: <VelocityScroll> stats, hiring partner logos
3. CURRICULUM: <BentoGrid> weekly modules with skills learned
4. LEARNING FORMAT: In-person, remote, hybrid; schedule options
5. PORTFOLIO PROJECTS: What students build (real examples)
6. CAREER SERVICES: Resume help, interview prep, job matching
7. STUDENT STORIES: Before/after career transformations
8. FINANCING: ISA, loans, scholarships, payment plans
9. UPCOMING COHORTS: Start dates, apply now urgency

DENSITY: Min 7 sections, 12-18 images (students, workspace, success stories), dynamic

COLOR STRATEGY: Tech Bootcamp Energy
- Background: White (#ffffff) OR dark mode toggle option
- Text: High contrast (#0a0a0a on light, #f0f0f0 on dark)
- Accent: Tech vibrant (Purple #6c5ce7 OR Cyan #00d4ff OR Code green #00ff88)
- Stats: Bold, impossible to miss
- ADAPTIVE: Energetic, modern, tech-forward

TYPOGRAPHY:
DISPLAY: Bold modern sans (Inter Bold / Circular)
NUMBERS: Large, impactful stats
BODY: Clean sans (Inter / Public Sans)

TARGET VIBE: Le Wagon, General Assembly, Modern Bootcamps
EMOTIONAL TONE: Frustration with current job → Hope → Action (Apply)

ADAPTIVE BEHAVIOR:
IF coding bootcamp → Show tech stack, GitHub projects, hiring partners
IF design bootcamp → Show design tools (Figma, etc.), portfolio work
IF data science → Show Python, SQL, ML projects
IF remote-first → Emphasize flexibility, async options
IF income share agreement → Explain model, no upfront cost
IF job guarantee → Detail terms, refund policy

CREATIVE FREEDOM: Invent placement stats (realistic: 85-95%), hiring partners, student outcomes
RULE: Transformation is real. Back claims with proof. Results > promises.

FINAL: Credible urgency. If it feels like a scam → add more proof and transparency.
', 'Style 2 - Career Accelerator (Bootcamp)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Online learning is global and accessible. Override for platform personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent course catalog, instructor bios, learning paths, platform features)
- SCRAPING_DEPTH: DEEP (Infer platform type: Udemy-style, cohort-based, university extension)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Platform UI, learning dashboard, student diversity, video thumbnails)
- SELF_AWARENESS: ENABLED (Question: "Is this intuitive or overwhelming?")

COMPONENTS_LIBRARY:
- BentoGrid: For course categories or featured courses
- 3DCard: For course previews with hover details
- Search/filter: Course discovery
- Platform demo: Interactive UI walkthrough

DECISION LOGIC:
- IF marketplace → Show course variety, instructor diversity
- IF cohort-based → Emphasize community, live sessions
- IF self-paced → Highlight flexibility, lifetime access

STYLE_ARCHETYPE: Learning Platform (Accessible Knowledge)
REFERENCE INSPIRATION: Coursera, Udemy, cohort-based course platforms

HERO COMPOSITION (80vh):
Structure: Platform-forward or learner-focused
VISUAL: Platform dashboard OR diverse students learning
HEADLINE: [INVENT 2-4 word learning accessibility statement]
  Context: learn, anywhere, anytime, skills, upskill, master
  Examples: "LEARN ANYTHING" / "SKILLS FOR EVERYONE" / "KNOWLEDGE UNLOCKED"
SEARCH BAR: Prominent course search (if marketplace)
CTA: "Browse Courses" + "Start Free" OR "Join Cohort"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (platform or learner-focused with search)
2. FEATURED COURSES: <BentoGrid> or <3DCard> grid
3. LEARNING PATHS: Curated journeys for career goals
4. HOW IT WORKS: Platform features (video, quizzes, projects, certificates)
5. INSTRUCTORS: If marketplace, show diverse expert instructors
6. STUDENT OUTCOMES: Certificates earned, skills gained, career changes
7. TESTIMONIALS: <InfiniteMovingCards> learner reviews
8. PRICING: Free courses, paid tiers, subscriptions

DENSITY: Min 6 sections, 12-16 images (platform UI, students, course thumbnails)

COLOR STRATEGY: Digital Learning Friendly
- Background: Clean white (#ffffff) OR light grey (#fafafa)
- Cards: White with shadows
- Text: Readable dark (#1a1a1a)
- Accent: Learning blue (#0066ff to #0099ff) OR knowledge purple (#7c3aed)
- ADAPTIVE: Accessible, friendly, not overwhelming

TYPOGRAPHY:
DISPLAY: Friendly sans (Circular / Inter Display)
BODY: Highly readable (Inter / System UI)
LABELS: Clear category tags

TARGET VIBE: Coursera, Udemy, Modern Learning Platforms
EMOTIONAL TONE: Curiosity → Discovery → Enrollment

ADAPTIVE BEHAVIOR:
IF marketplace → Show course variety, instructor diversity, reviews
IF cohort-based → Emphasize community, live sessions, deadlines
IF university extension → Academic credibility, transferable credits
IF free model → Show free tier, upsell premium features
IF certificate programs → Show credential value, employer recognition
IF mobile app → Show cross-device learning experience

CREATIVE FREEDOM: Invent courses, instructors, learning paths, student outcomes
RULE: Accessible but not overwhelming. Discovery should feel exciting, not paralyzing.

FINAL: User-friendly and credible. If navigation feels confusing → simplify discovery.
', 'Style 3 - Learning Platform (Accessible)' FROM ind;

-- =================================================================================================
-- CONSTRUCCIÓN (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Construction is craftsmanship at scale. Override for company personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent project types, build methodologies, safety records, team credentials)
- SCRAPING_DEPTH: DEEP (Infer company type: residential, commercial, general contractor, specialty)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Construction site photography, before/after builds, team in action)
- SELF_AWARENESS: ENABLED (Question: "Does this show expertise or just hard hats?")

COMPONENTS_LIBRARY:
- BentoGrid: For project portfolio or services
- Before/after sliders: Build transformations
- InfiniteMovingCards: For client testimonials
- Timeline animations: Project process visualization

DECISION LOGIC:
- IF residential → Show home builds/renovations with family appeal
- IF commercial → Emphasize scale, timeline, budget adherence
- IF specialty → Deep dive into expertise (roofing, foundation, etc.)

STYLE_ARCHETYPE: Master Builder (Craftsmanship & Scale)
REFERENCE INSPIRATION: Architectural portfolios, construction time-lapses, trade craftsmanship

HERO COMPOSITION (90vh):
Structure: Bold project showcase
VISUAL: Dramatic construction site OR stunning finished build
HEADLINE: [INVENT 2-4 word building statement]
  Context: build, craft, solid, quality, dream, home
  Examples: "BUILT TO LAST" / "YOUR VISION BUILT" / "CRAFTED WITH PRIDE"
  Adapt to residential vs. commercial focus
SUBHEADLINE: Company specialty or values (safety, quality, on-time)
CTA: "View Portfolio" + "Get Estimate"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (dramatic build or finished project)
2. OUR SERVICES: <BentoGrid> of construction types (residential, commercial, remodel)
3. PROJECT PORTFOLIO: Before/after sliders, project photos
4. BUILD PROCESS: Timeline from consultation to completion
5. SAFETY & CERTIFICATIONS: Licenses, insurance, safety record
6. MEET THE TEAM: Principals, project managers, foremen
7. CLIENT TESTIMONIALS: <InfiniteMovingCards> reviews with projects
8. AREAS SERVED: Service radius with map
9. FREE ESTIMATE: Quote request form

DENSITY: Min 7 sections, 20-30 images (builds, team, process, portfolio)

COLOR STRATEGY: Industrial Strength with Trust Accent
- Background: Light concrete (#f5f5f5) OR white (#ffffff)
- Text: Bold dark (#1a1a1a)
- Accent: Adaptive based on construction type
  IF residential → Warm wood/home tones (#8b6f47 to #a0826d)
  IF commercial → Industrial blue (#003d7a to #0052a3)
  IF luxury builds → Rich black/gold (#1a1a1a + #d4af37)
- Safety: High-vis yellow for safety badges
- ADAPTIVE: Strong, trustworthy, not generic

TYPOGRAPHY:
DISPLAY: Bold industrial sans (Inter Bold / Helvetica Bold)
NUMBERS: Large for project stats (sq ft, budget, timeline)
BODY: Readable sans (Inter / Public Sans)

TARGET VIBE: Master Craftsmanship, Reliable General Contractor
EMOTIONAL TONE: Dream → Trust → Commitment (hire)

ADAPTIVE BEHAVIOR:
IF residential → Show home transformations, family testimonials
IF commercial → Emphasize scale, timeline, budget expertise
IF luxury custom builds → Showcase architectural collaboration
IF remodel specialist → Before/after transformations, creative solutions
IF green building → LEED, sustainable materials, energy efficiency
IF multi-location → Show service areas, regional projects

CREATIVE FREEDOM: Invent project details, build timelines, client outcomes (realistic construction)
RULE: Show, don''t tell. Photos of actual builds > stock construction imagery.

FINAL REMINDER: Trust is built through completed projects. Portfolio quality is everything.
', 'Style 1 - Master Builder (Craftsmanship)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Modern construction embraces technology. Override for tech adoption level.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent tech tools: BIM, drones, project management software, virtual walkthroughs)
- SCRAPING_DEPTH: DEEP (Infer tech-forward positioning: 3D modeling, smart homes, prefab)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Tech tools in use, 3D renders, drone footage, dashboards)
- SELF_AWARENESS: ENABLED (Question: "Does this show innovation or gimmick?")

COMPONENTS_LIBRARY:
- 3D model viewers: Interactive building visualizations
- BentoGrid: For technology features or smart home integrations
- Video: Drone footage, time-lapse builds
- Dashboard mockups: Client portal for project tracking

DECISION LOGIC:
- IF tech-forward builder → Lead with innovation, visualization tools
- IF smart home specialist → Show integrations, automation
- IF prefab/modular → Emphasize efficiency, precision, sustainability

STYLE_ARCHETYPE: TechBuild (Construction Evolved)
REFERENCE INSPIRATION: Prefab home companies, smart construction, BIM-focused firms

HERO COMPOSITION (85vh):
Structure: Tech-forward visualization
VISUAL: 3D building render OR drone construction footage
HEADLINE: [INVENT 2-4 word tech-construction statement]
  Context: smart, precision, future, efficient, evolved
  Examples: "CONSTRUCTION EVOLVED" / "BUILT SMART" / "PRECISION BUILDING"
INTERACTION: Rotate 3D model or scrub through build time-lapse
CTA: "Visualize Your Build" + "Our Technology"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (3D render or drone footage)
2. OUR TECHNOLOGY: BIM, drones, project management tools
3. BUILD VISUALIZATION: 3D walkthroughs clients can interact with
4. SMART BUILDING: If applicable, home automation, energy systems
5. PROJECT TRACKING: Client portal demo showing transparency
6. PORTFOLIO: Tech-enabled projects with metrics (timeline, budget accuracy)
7. PROCESS: How technology improves each phase
8. CONSULTATION: 3D design consultation booking

DENSITY: Min 6 sections, 12-18 visuals (3D renders, tech, builds, dashboards)

COLOR STRATEGY: Construction Tech Gradient
- Background: Clean white (#ffffff) OR tech grey (#f7f7f7)
- Text: Professional dark (#1a1a1a)
- Accent: Tech blue gradient (#0066ff to #0099ff) OR innovation green (#00d4aa)
- 3D renders: High-quality architectural visualization
- ADAPTIVE: Modern, precise, tech-forward

TYPOGRAPHY:
DISPLAY: Modern geometric sans (Inter Display / Neue Haas)
BODY: Clean technical (Inter / Roboto)
METRICS: Monospace for precision data

TARGET VIBE: Prefab Innovation, Smart Construction, BIM-Focused Firms
EMOTIONAL TONE: Curiosity → Confidence in process → Engagement

ADAPTIVE BEHAVIOR:
IF smart home builder → Show automation, energy management, tech integrations
IF prefab/modular → Emphasize speed, precision, sustainability, cost control
IF BIM specialist → Show clash detection, coordination, efficiency gains
IF green building → Tech for energy efficiency, sustainable materials tracking
IF luxury tech → Home theaters, smart systems, architectural tech
IF client portal → Real-time project updates, budget tracking, milestone alerts

CREATIVE FREEDOM: Invent tech tools, smart features, efficiency metrics (realistic construction tech)
RULE: Technology serves building, not the other way around. Innovation with purpose.

FINAL: Modern but credible. If it feels like tech for tech''s sake → connect to customer value.
', 'Style 2 - TechBuild (Construction Evolved)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Heritage builders have generational expertise. Override for legacy story.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent company history, generational stories, landmark projects, trade heritage)
- SCRAPING_DEPTH: DEEP (Infer heritage positioning: family business, decades in trade, local landmark builds)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Vintage project photos, family photos, craftsmanship details, completed landmarks)
- SELF_AWARENESS: ENABLED (Question: "Does this feel trusted or dated?")

COMPONENTS_LIBRARY:
- Timeline: Company history visualization
- BentoGrid: For landmark projects
- TextGenerateEffect: For family story or values
- Before/after: Restorations and historical projects

DECISION LOGIC:
- IF multi-generational → Lead with family story, legacy
- IF historical restoration → Show respect for craftsmanship, preservation
- IF local landmark builder → Showcase community impact

STYLE_ARCHETYPE: Heritage Craftsman (Generational Trust)
REFERENCE INSPIRATION: European master builders, family trade businesses, restoration specialists

HERO COMPOSITION (85vh):
Structure: Timeless, trustworthy
VISUAL: Landmark project OR family working across generations
HEADLINE: [INVENT 2-4 word legacy statement]
  Context: legacy, generations, trust, crafted, enduring
  Examples: "BUILT FOR GENERATIONS" / "LEGACY OF CRAFT" / "TRUSTED SINCE [YEAR]"
SUBHEADLINE: Years in business, generations, local roots
CTA: "Our Story" + "View Legacy Projects"

CONTENT SECTIONS (Build 7-9 total):
1. HERO (legacy-focused, timeless)
2. OUR STORY: Family history, how it started, generational handoff
3. LANDMARK PROJECTS: Major builds, community landmarks, historical projects
4. CRAFTSMANSHIP: Attention to detail, traditional methods, quality materials
5. RESTORATION EXPERTISE: If applicable, historical preservation work
6. MEET THE FAMILY: Multi-generational team photos and roles
7. COMMUNITY ROOTS: Local involvement, sponsorships, giving back
8. TESTIMONIALS: Long-term clients, multi-project relationships
9. CONTINUE THE LEGACY: Contact for bids on new projects

DENSITY: Min 7 sections, 18-24 images (historical, family, landmark projects, detail shots)

COLOR STRATEGY: Heritage Craftsmanship Palette
- Background: Warm cream (#faf8f5) OR classic white (#ffffff)
- Text: Rich brown (#3e2723 to #4e342e)
- Accent: Heritage gold (#b8960f to #a0826d) OR trade red (#8b0000)
- Vintage photo tones: Sepia or B&W for historical images
- ADAPTIVE: Timeless, warm, trustworthy

TYPOGRAPHY:
DISPLAY: Classic serif (Garamond / Baskerville) OR strong slab serif
BODY: Readable serif for storytelling
EMPHASIS: Traditional but not old-fashioned

TARGET VIBE: European Master Builders, Family Trade Businesses, Historical Craftsmen
EMOTIONAL TONE: Respect for history → Trust in expertise → Hire for legacy

ADAPTIVE BEHAVIOR:
IF multi-generational → Show family timeline, passing of torch
IF historical restoration → Showcase preservation expertise, respect for history
IF local landmark builder → Feature projects community recognizes
IF trade specialization → Deep dive into mastery (masonry, carpentry, etc.)
IF union/certified → Show credentials, apprenticeship programs
IF warranty/guarantee → Generational commitment to standing behind work

CREATIVE FREEDOM: Invent company history (keep realistic: 25-100+ years), family stories, landmark projects
RULE: Heritage is earned, not claimed. Show decades of trust through completed work.

FINAL: Timeless trust. If it feels dated instead of reliable → modernize presentation, not legacy.
', 'Style 3 - Heritage Craftsman (Legacy)' FROM ind;

-- =================================================================================================
-- FITNESS (3 STYLES)
-- =================================================================================================

WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', '
-- ⚠️ META: Fitness is transformation and energy. Override for gym personality.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent workout programs, trainer credentials, transformation stories, class types)
- SCRAPING_DEPTH: DEEP (Infer gym type: crossfit, boutique, big box, personal training, studio)
- ASSET_STRATEGY: SPECIFIC_GENERATION (High-energy workout photos, transformation shots, facility images)
- SELF_AWARENESS: ENABLED (Question: "Does this motivate or intimidate?")

COMPONENTS_LIBRARY:
- VelocityScroll: For impact statements ("PUSH YOUR LIMITS")
- BentoGrid: For class types or training programs
- Before/after sliders: Transformation stories
- Video: Workout clips, trainer intros, facility tours

DECISION LOGIC:
- IF personal training focused → Lead with trainers, personalized programs
- IF class-based (spin, yoga, HIIT) → Show class energy, schedule
- IF crossfit/hardcore → Emphasize intensity, community, results

STYLE_ARCHETYPE: Transformation Energy (High-Intensity Motivation)
REFERENCE INSPIRATION: Boutique fitness studios, transformation campaigns, athletic brands

HERO COMPOSITION (95vh):
Structure: High-energy, kinetic
VISUAL: Intense workout moment OR transformation photo
HEADLINE: [INVENT 2-4 word power statement]
  Context: push, transform, strong, unleash, power, limits
  Examples: "PUSH YOUR LIMITS" / "UNLEASH YOUR POWER" / "TRANSFORM TODAY"
ANIMATION: <VelocityScroll> massive kinetic text
CTA: "Start Free Trial" + "View Classes"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (high-energy, motivational)
2. PROGRAMS: <BentoGrid> of training types (HIIT, strength, yoga, spin)
3. TRANSFORMATIONS: Before/after client results with stories
4. MEET THE TRAINERS: Credentials, specialties, energy
5. CLASS SCHEDULE: If applicable, daily/weekly class grid
6. FACILITY: Equipment, space, amenities (showers, lockers, juice bar)
7. MEMBERSHIP: Tiers, pricing, trial offers
8. TESTIMONIALS: Client success stories

DENSITY: Min 6 sections, 15-20 images (workouts, transformations, facility, energy), bold layout

COLOR STRATEGY: Athletic Energy with Intensity
- Background: Dark dramatic (#0a0a0a to #1a1a1a) OR bright white (#ffffff)
- Text: High contrast
- Accent: Energy spectrum (Electric blue #0099ff OR Volt yellow #ffdd00 OR Power red #ff3333)
- ADAPTIVE: Match gym brand/vibe (hardcore dark vs. wellness light)

TYPOGRAPHY:
DISPLAY: Bold extended sans (Inter Black / Helvetica Bold Condensed)
BODY: Clean, energetic (Inter / Roboto)
METRICS: Large transformation numbers

TARGET VIBE: Boutique Fitness, Transformation Campaigns, Athletic Energy
EMOTIONAL TONE: Frustration with current fitness → Motivation → Action (Join)

ADAPTIVE BEHAVIOR:
IF crossfit/hardcore → Intense imagery, community focus, "no excuses"
IF boutique studio (cycling, barre) → Aspirational, community, music/vibe
IF yoga/wellness → Calming energy, mindfulness, healing
IF personal training → One-on-one attention, customized programs
IF 24-hour gym → Convenience, flexibility, no judgment
IF specialized (boxing, climbing) → Show unique offering, skill progression

CREATIVE FREEDOM: Invent programs, transformations (realistic fitness results), trainer bios
RULE: Motivate, don''t intimidate. Accessible intensity. Results, not perfection.

FINAL REMINDER: Transformation is individual. If it feels exclusive to athletes → broaden appeal.
', 'Style 1 - Transformation Energy (High-Intensity)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Wellness fitness prioritizes holistic health. Override for wellness philosophy.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent wellness programs, holistic services, mindfulness offerings)
- SCRAPING_DEPTH: DEEP (Infer approach: yoga-focused, meditation, recovery, lifestyle)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Peaceful workout imagery, wellness moments, community connection)
- SELF_AWARENESS: ENABLED (Question: "Does this feel healing or hippie?")

COMPONENTS_LIBRARY:
- BentoGrid: For wellness services (yoga, meditation, massage)
- TextGenerateEffect: For wellness philosophy
- Organic layouts: Natural flow
- Video: Class previews, teacher intros

DECISION LOGIC:
- IF yoga studio → Show styles offered, teacher expertise, community
- IF wellness center → Emphasize holistic approach (fitness + nutrition + mindfulness)
- IF recovery focus → Show modalities (stretching, massage, cryotherapy)

STYLE_ARCHETYPE: Wellness Sanctuary (Holistic Fitness)
REFERENCE INSPIRATION: Yoga studios, wellness retreats, mindful fitness spaces

HERO COMPOSITION (85vh):
Structure: Calm, centered
VISUAL: Peaceful yoga/wellness moment
HEADLINE: [INVENT 2-4 word wellness statement]
  Context: balance, restore, centered, whole, mindful, flow
  Examples: "FIND YOUR BALANCE" / "MOVE WITH PURPOSE" / "WELLNESS RESTORED"
SUBHEADLINE: Wellness approach or philosophy
CTA: "Try A Class" + "Explore Wellness"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (calm, centered)
2. OUR APPROACH: Holistic wellness philosophy
3. CLASSES & SERVICES: <BentoGrid> yoga styles, meditation, workshops
4. TEACHERS: Profiles with training credentials
5. WELLNESS PROGRAMS: Challenges, workshops, retreats
6. COMMUNITY: Member stories, events, connection
7. SCHEDULE: Class calendar with filtering
8. MEMBERSHIP: Options, drop-in, packages, intro offers

DENSITY: Min 6 sections, 12-16 images (classes, teachers, peaceful moments), generous spacing

COLOR STRATEGY: Wellness Natural Tones
- Background: Soft white (#fafafa) OR warm cream (#f5f3f0)
- Text: Warm dark (#3e2723)
- Accent: Healing spectrum (Sage green #7cb342 OR Calm blue #00acc1 OR Earth terracotta #d84315)
- Natural textures: Wood, plants, natural light
- ADAPTIVE: Calming, natural, welcoming

TYPOGRAPHY:
DISPLAY: Organic serif (Lora / Crimson) OR friendly sans
BODY: Readable, peaceful (Inter / Public Sans)
EMPHASIS: Gentle, inviting

TARGET VIBE: Yoga Studios, Wellness Retreats, Mindful Fitness
EMOTIONAL TONE: Stress → Calm → Commitment (Join)

ADAPTIVE BEHAVIOR:
IF yoga-focused → Show styles (vinyasa, yin, restorative), teacher expertise
IF meditation included → Mindfulness programs, guided sessions
IF nutrition/lifestyle → Holistic approach, workshops, community
IF recovery/mobility → Stretching, massage, injury prevention
IF prenatal/postnatal → Specialized classes, community support
IF wellness retreats → Weekend/week-long immersive experiences

CREATIVE FREEDOM: Invent class names, teacher backgrounds, wellness programs
RULE: Accessible wellness. Healing without pseudoscience. Community, not cult.

FINAL: Peaceful and authentic. If it feels exclusive to yogis → emphasize beginners welcome.
', 'Style 2 - Wellness Sanctuary (Holistic)' FROM ind

UNION ALL
SELECT id, 'art_direction', '
-- ⚠️ META: Athletic performance needs data and science. Override for training philosophy.

INTELLIGENCE_PROTOCOL:
- MODE: NO_MVP (Invent training methodologies, performance metrics, sport-specific programs)
- SCRAPING_DEPTH: DEEP (Infer focus: sports performance, olympic lifting, athletic training)
- ASSET_STRATEGY: SPECIFIC_GENERATION (Athletes training, performance data, sports-specific drills)
- SELF_AWARENESS: ENABLED (Question: "Does this show expertise or bro science?")

COMPONENTS_LIBRARY:
- BentoGrid: For sport-specific programs
- Data visualization: Performance tracking, metrics
- Video: Training demonstrations, athlete testimonials
- Progress charts: Measurable improvements

DECISION LOGIC:
- IF sports performance → Show sport-specific training, athlete results
- IF olympic lifting → Technique focus, progressive programming
- IF athletic development → Youth to pro pathway, fundamentals to elite

STYLE_ARCHETYPE: Performance Lab (Science-Driven Athletics)
REFERENCE INSPIRATION: Olympic training centers, D1 athletic facilities, performance institutes

HERO COMPOSITION (90vh):
Structure: Data-driven, powerful
VISUAL: Athlete in peak performance moment
HEADLINE: [INVENT 2-4 word performance statement]
  Context: elite, performance, peak, train, compete, win
  Examples: "TRAIN LIKE A PRO" / "PEAK PERFORMANCE" / "BUILT TO COMPETE"
METRICS OVERLAY: Performance stats (speed, power, strength gains)
CTA: "Performance Assessment" + "Our Programs"

CONTENT SECTIONS (Build 6-8 total):
1. HERO (athlete-focused with data)
2. TRAINING PROGRAMS: <BentoGrid> sport-specific or general athletic development
3. PERFORMANCE TESTING: Assessments offered (speed, power, agility, strength)
4. COACHING STAFF: Credentials (CSCS, Olympic lifting certs, sport backgrounds)
5. ATHLETE RESULTS: Before/after performance metrics, competition outcomes
6. TRAINING METHODOLOGY: Science-backed approach, periodization
7. FACILITY & EQUIPMENT: Performance-grade equipment, training areas
8. ASSESSMENT: Free performance evaluation booking

DENSITY: Min 6 sections, 12-18 images (athletes, training, data, facility), dynamic

COLOR STRATEGY: Athletic Performance Palette
- Background: Performance black (#0a0a0a) OR clinical white (#ffffff)
- Text: High contrast
- Accent: Performance spectrum (Champion gold #ffd700 OR Speed red #ff3333 OR Tech blue #0066ff)
- Data viz: Multi-color charts and metrics
- ADAPTIVE: Professional athletic, data-driven

TYPOGRAPHY:
DISPLAY: Bold athletic sans (Inter Black / Helvetica Bold)
NUMBERS: Large performance metrics, tabular data
BODY: Technical precision (Inter / Roboto)

TARGET VIBE: Olympic Training Centers, D1 Athletics, Performance Institutes
EMOTIONAL TONE: Competitive drive → Scientific confidence → Elite training

ADAPTIVE BEHAVIOR:
IF youth athletic development → Age-appropriate progressions, fundamentals
IF college/pro athletes → Elite-level training, sport-specific periodization
IF olympic lifting → Technical coaching, progressive strength programs
IF speed/agility → Performance testing, data-driven improvements
IF injury prevention → Movement assessment, corrective exercise
IF team training → Group programs, sport-specific conditioning

CREATIVE FREEDOM: Invent programs, performance metrics (realistic athletic gains), athlete outcomes
RULE: Science over hype. Data-driven, not broscience. Results are measurable.

FINAL: Elite but accessible. If it feels intimidating to committed athletes → balance expertise with approachability.
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
