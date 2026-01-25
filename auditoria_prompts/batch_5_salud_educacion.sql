-- =============================================================================
-- BATCH 5: SALUD & EDUCACIÓN (V4.0 - FLEXIBLE & SKILL-DRIVEN)
-- =============================================================================

-- 25. Future Clinical (Salud - Modern Clinic/Tech)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md" FIRST.
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Swiss Minimal" or "Liquid Flow" are great here.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Future Clinical"
KEYWORDS: Science, Purity, Human, Hope, Precision.
LIGHTING: Bright, diffuse, sterile but warm (like a spaceship infirmary or Apple store).
COLOR STRATEGY: White base, Teal/Blue/Soft Purple accents. Can use Glassmorphism.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Empathetic, advanced, reassuring.
AVOID: Scary medical jargon, bloody images.
USE: "Care", "Advanced", "Life".

-- HERO CONTENT:
HEADLINE: "CARE REIMAGINED.", "YOUR HEALTH. FUTURE PROOF."
SUBHEADLINE: Focus on technology + humanity.

-- SECTIONS:
1. **The Tech:** Advanced equipment showcase.
2. **The Care:** Patient journey.
3. **The Team:** Doctors in casual/pro attire (not stiff).

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Microscopes, clean bright rooms, happy patients (lifestyle), 3D molecular art.
'
WHERE description LIKE '%Future Clinical%';

-- 26. Holistic Wellness (Salud - Alternative/Spa)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Liquid Flow" motion is mandatory vibes.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Holistic Wellness"
KEYWORDS: Balance, Earth, Breath, Center, Organic.
LIGHTING: Natural, dappled sunlight (leaves shadows).
COLOR STRATEGY: Earth tones, Greens, Soft Creams.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Calm, Grounded, Spiritual (lightly).
AVOID: Medical terms.
USE: "Balance", "Energize", "Heal".

-- HERO CONTENT:
HEADLINE: "FIND YOUR CENTER.", "BREATHE."

-- SECTIONS:
1. **The Approach:** Mind/Body connection.
2. **The Space:** Calming environment tour.
3. **The Guidance:** Practitioner bio.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Stones, plants, water, hands resting, soft fabrics. No clinical white coats.
'
WHERE description LIKE '%Holistic Wellness%';

-- 27. Smile Gallery (Salud - Dental/Aesthetic)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Cinematic Fullscreen" (before/after sliders) works well.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Smile Gallery"
KEYWORDS: Confidence, Art, Detail, Transform, Glow.
LIGHTING: Beauty lighting (ring light style), high key.
COLOR STRATEGY: White, Gold, Black (Luxury aesthetic) or Pastel High-End.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Artistic, Confident, Life-changing.
AVOID: "Teeth cleaning", "Cavities".
USE: "Smile design", "Confidence", "Artistry".

-- HERO CONTENT:
HEADLINE: "DESIGN YOUR SMILE.", "CONFIDENCE UNLOCKED."

-- SECTIONS:
1. **The Art:** Smile makeover process.
2. **The Results:** Before/After showcase.
3. **The Studio:** Luxury clinic photos.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Close up of smiles (lips/teeth), happy people laughing, art tools.
'
WHERE description LIKE '%Smile Gallery%';

-- 28. Future Learning (Educación - EdTech/Modern)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Asimetría Radical" or "Fluid Magazine".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Future Learning"
KEYWORDS: Growth, Curiosity, Tomorrow, Skill, Path.
LIGHTING: Bright, colorful, energetic.
COLOR STRATEGY: Multi-color gradients, vibrant.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Encouraging, Modern, Active.
AVOID: "Enrollment", "Institution".
USE: "Start learning", "Master the skill".

-- HERO CONTENT:
HEADLINE: "LEARN THE FUTURE.", "UNLOCK SKILLS."

-- SECTIONS:
1. **The Skills:** Modern curriculum grid.
2. **The Method:** How it works (video focus).
3. **The Outcome:** Career success stories.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Students with laptops in cafes (not classrooms), abstract brain/connection art.
'
WHERE description LIKE '%Future Learning%';

-- 29. Career Accelerator (Educación - Bootcamps/Professional)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "Brutalist Grid" (structure) or "Swiss Minimal".

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Career Accelerator"
KEYWORDS: Speed, Job, Hire, Network, Level Up.
LIGHTING: Office professional, dynamic.
COLOR STRATEGY: Energetic but pro (Electric Blue, Orange).

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Coach, Pushing, Results-driven.
AVOID: Academic theory.
USE: "Get hired", "Salary increase", "Network".

-- HERO CONTENT:
HEADLINE: "LEVEL UP.", "YOUR NEXT ROLE."

-- SECTIONS:
1. **The Outcome:** Salary/Job stats.
2. **The Mentors:** Expert profiles.
3. **The Network:** Alumni companies logos.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Modern workspaces, shaking hands, people presenting.
'
WHERE description LIKE '%Career Accelerator%';

-- 30. Learning Platform (Educación - Kids/School)
UPDATE demo_prompts
SET content = '
-- 🚨 CORE DIRECTIVE:
-- 1. READ "d:\proyectos\hojacero\BIBLIA.md".
-- 2. READ "creative-director-h0.md".
-- 3. OBEY Random Seeds. "The Friendly Neighbor" typo pairing fits well.

-- =============================================================================
-- ATMOSPHERE & CONCEPT
-- =============================================================================
CONCEPT: "Learning Platform"
KEYWORDS: Play, Discover, Friend, Safe, Fun.
LIGHTING: Sunny, soft, warm.
COLOR STRATEGY: Primary Soft (Pastel Red, Blue, Yellow). Rounded shapes.

-- =============================================================================
-- CONTENT STRATEGY
-- =============================================================================
VOICE: Playful, Safe, Trustworthy (for parents).
AVOID: Boring curriculum lists.
USE: "Explore", "Play", "Grow".

-- HERO CONTENT:
HEADLINE: "PLAY TO LEARN.", "CURIOUS MINDS."

-- SECTIONS:
1. **The Playground:** Learning environment.
2. **The Safety:** Trust signals for parents.
3. **The Fun:** Happy kids/students.

-- =============================================================================
-- ASSET DIRECTION
-- =============================================================================
IMAGES: Kids playing, colorful toys/books, diverse groups smiling.
'
WHERE description LIKE '%Learning Platform%';
