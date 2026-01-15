-- Seeding Full Prompts for Design Roulette (TRUE VARIETY VERSION)
-- 3 to 4 DISTINCT Art Directions per Industry to ensure unique generations.
-- "No Hardcoding" philosophy.

-- Ensure industries exist
INSERT INTO demo_industries (name, slug, description) VALUES
('Salud & Estética', 'salud', 'Clínicas dentales, medicina estética, dermatología, cirugía plástica.'),
('Gastronomía Premium', 'gastronomia', 'Restaurantes de autor, alta cocina, bares de especialidad.'),
('Real Estate', 'real-estate', 'Inmobiliarias, venta de propiedades de lujo, arquitectura.'),
('Legal & Corporativo', 'legal', 'Bufetes de abogados, consultoras financieras, servicios B2B.'),
('Automotriz & Detailing', 'automotriz', 'Car detailing, venta de autos de lujo, performance.'),
('Tech & SaaS B2B', 'tech', 'Software, Startups, Apps, plataformas digitales.'),
('Turismo & Hospitalidad', 'turismo', 'Hoteles boutique, travel luxury, resorts.'),
('Educación & Coaching', 'educacion', 'Cursos high-ticket, mentores, academias.'),
('Fitness & Wellness', 'fitness', 'Gimnasios boutique, yoga, pilates, training.'),
('Construcción & Industria', 'construccion', 'Ingeniería, constructoras, logística.'),
('Moda & Retail', 'moda', 'Marcas de ropa, showrooms, e-commerce.'),
('Consultoría & Finanzas', 'consultoria', 'Strategic consulting, wealth management.')
ON CONFLICT (slug) DO NOTHING;

DELETE FROM demo_prompts; -- Reset

-- ==========================================================================================
-- 1. SALUD & ESTÉTICA (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'salud')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Future Clinical". Minimalismo aséptico extremo. Blanco sobre blanco. Acentos plateados y cristalinos. Tipografía Sans muy fina. Transmite tecnología de punta sin contacto humano.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Organic Spa". Tonos tierra suaves, beige, verde oliva, terracota. Bordes redondeados intensos (Soft UI). Tipografía Serif con curvas. Transmite calma, naturaleza y calidez humana.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Luxury Dermatology". Negro y Dorado. Fotografía de alto contraste. Tipografía Serif Romana clásica (Trajan/Cinzel). Vibe de marca de cosmética de lujo (tipo La Mer). Transmite exclusividad y precio alto.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Enfócate en transformación y bienestar.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Portrait of a woman with glowing skin, high-end studio lighting.', 'Img Base' FROM ind;

-- ==========================================================================================
-- 2. GASTRONOMÍA (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Midnight Chef". Fondo negro absoluto. Acentos neón sutiles (púrpura/ámbar). Tipografía Sans Bold condensada. Fotografía con flash directo (estilo revista de moda). Vibe nocturno y atrevido.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Nordic Pure". Blanco, madera clara, luz natural difusa. Layouts de grilla muy ordenados. Tipografía Sans geométrica minimalista. Vibe honesto, ingredientes frescos, día.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Classic Heritage". Tonos vino tinto, verde botella, madera oscura. Tipografía Serif itálica manuscrita. Marcos ornamentados sutiles. Vibe de restaurante con estrella Michelin tradicional y solera.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Describe la experiencia sensorial, no el menú.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Gourmet dish plated elegantly, dramatic lighting.', 'Img Base' FROM ind;

-- ==========================================================================================
-- 3. REAL ESTATE (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Brutalist Concrete". Gris cemento, negro y naranja seguridad. Tipografía Monospace técnica. Líneas de guía visibles. Vibe arquitectónico puro y duro.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Mediterranean Sunset". Colores cálidos (Ocre, Arena, Azul Cielo). Tipografía Serif suave. Degradados suaves imitando el atardecer. Vibe vacacional y relajado.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Penthouse Luxury". Negro brillante (Piano Black) y reflejos. Imágenes panorámicas nocturnas de ciudad. Tipografía Sans muy delgada y elegante. Vibe exclusivo y cosmopolita.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Vende el sueño y el estilo de vida exclusivo.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Architectural shot of luxury home, dusk lighting.', 'Img Base' FROM ind;

-- ==========================================================================================
-- 4. LEGAL (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'legal')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "New York Power". Azul marino profundo y blanco. Rascacielos. Layouts de periódico financiero (columnas). Tipografía Serif de transición (Times New Roman). Autoridad clásica.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Modern Boutique". Mucho espacio en blanco. Tipografía Sans Grotesca (Helvetica) en negrita. Un solo color de acento fuerte (ej: Amarillo Eléctrico o Rojo). Rupturista y moderno.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Intellectual Noir". Blanco y Negro estricto. Grano fotográfico. Tipografía Typewriter. Documentos antiguos. Vibe de investigación profunda y seriedad académica.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Lenguaje de estrategia, protección y victoria.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Abstract textures of law library or corporate office.', 'Img Base' FROM ind;

-- ==========================================================================================
-- 5. AUTOMOTRIZ (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'automotriz')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Underground Racing". Fondo asfalto, humo, neón rojo. Tipografía extendida (Wide) itálica. UI inclinada. Vibe rápido y agresivo.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Gallery Studio". Fondo blanco infinito (Cyclorama). Iluminación perfecta de softbox. Tipografía técnica minúscula. Vibe de exposición de arte o concesionario de ultra-lujo.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Engineering Blueprints". Fondo azul blueprint o negro rejilla. Líneas vectoriales blancas. Tipografía técnica CAD. Vibe de precisión mecánica y taller de performance.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Pasión por la máquina y la perfección técnica.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Luxury car detail shot, dramatic lighting.', 'Img Base' FROM ind;

-- ==========================================================================================
-- 6. TECH (3 Variantes)
-- ==========================================================================================
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'tech')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Deep Aurora". Fondo negro (#050505). Gradientes boreales (Cian/Magenta) difuminados. Glassmorphism. Vibe SaaS moderno (Linear-like).', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Retro Terminal". Fondo fósforo verde o ámbar sobre negro. Tipografía Pixel o Monospace. UI basada en caracteres ASCII. Vibe hacker/cyberpunk.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Clean Enterprise". Blanco y Azul Corporativo (IBM Blue). Sombras suaves (Drop shadows). Gráficos vectoriales planos isométricos. Vibe confiable y escalable.', 'Style 3' FROM ind
UNION ALL
SELECT id, 'copywriting', 'Velocidad, escalabilidad y futuro.', 'Copy Base' FROM ind
UNION ALL
SELECT id, 'image_generation', 'Abstract 3D tech shapes, glass and light.', 'Img Base' FROM ind;

-- (Adding reduced sets for the remaining industries to ensure script fits, focusing on 3 distinct styles each)

-- 7. TURISMO
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'turismo')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Jungle Explorer". Verdes saturados, texturas de papel mapa. Tipografía Rough.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Minimal Sand". Tonos beige y crema. Serif itálica elegante. Silencio visual.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Urban Luxury". Negro y luces de ciudad desenfocadas (Bokeh). Vibe hotel cosmopolita.', 'Style 3' FROM ind;

-- 8. EDUCACIÓN
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'educacion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Cinema Stage". Fondo oscuro, spot light en el mentor. Contraste dramático.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Ivy League". Papel crema, serif tradicional, azul marino. Académico.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Modern Workshop". Colores vibrantes (Amarillo/Negro). Shapes geométricos. Dinámico.', 'Style 3' FROM ind;

-- 9. FITNESS
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'fitness')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: HIGH_DENSITY_PREMIUM. 
1. NAVBAR: Must include client logo (path: /prospectos/[slug]/logo.png) + "Free Pass" CTA.
2. HERO: Full-screen height. BACKGROUND: Generative Dark/Neon Gym Atmosphere (use image_generation prompt). HEADLINE: Massive, Uppercase, Inter Font, Tracking-tighter.
3. CONTENT: 3-Column Service Grid (Icons + Title + Desc), Membership Plans (Highlight "Pro"), Location Block. 
4. GRAPHICS: Use "Volt" (#ccff00) accents on Black (#050505). Add noise textures. 
5. INTERACTION: Custom cursor, hover states on cards. NO EMPTY SPACES.', 'Style 1 - Neon Sweat (High Density)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: LUXURY_MINIMAL.
1. NAVBAR: Transparent, centered logo. 
2. HERO: Split screen (50% Image / 50% Text). Soft pastel gradient background. 
3. TYPOGRAPHY: Serif Display (Playfair/Cinzel) for elegance. 
4. CONTENT: Text-heavy ethos section, "Our Instructors" carousel, "Membership Application" form. 
5. VIBE: Yoga Studio / Wellness Center. Lighting: Soft, diffused.', 'Style 2 - Zen Flow (High Density)' FROM ind
UNION ALL
SELECT id, 'art_direction', 'LAYOUT_INSTRUCTION: RAW_INDUSTRIAL.
1. NAVBAR: Stencil font, industrial borders. 
2. HERO: Grayscale video or heavy grain image. Glitch text effects. 
3. CONTENT: Masonry grid for gallery, bold black/white contrast, "Train Hard" manifesto section. 
4. DETAILS: Use chain-link fence patterns, heavy borders. 
5. VIBE: CrossFit Box / Powerlifting. Unapologetic.', 'Style 3 - Raw Gym (High Density)' FROM ind;

-- 10. CONSTRUCCIÓN
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'construccion')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Blueprint Line". Azul técnico y líneas blancas finas. Precisión.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Heavy Metal". Amarillo seguridad y Negro. Tipografía Stencil. Escala masiva.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Sustainable Eco". Madera, verde, concreto limpio. Arquitectura verde.', 'Style 3' FROM ind;

-- 11. MODA
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'moda')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Vogue White". Fondo blanco. Fotos asimétricas. Tipografía minúscula.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Underground Flash". Fotos con flash duro. Actitud rebelde. Tipografía distorsionada.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Luxury Gold". Negro y Dorado. Serif ornamentada. Barroco moderno.', 'Style 3' FROM ind;

-- 12. CONSULTORÍA
WITH ind AS (SELECT id FROM demo_industries WHERE slug = 'consultoria')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT id, 'art_direction', 'Estilo "Data Abstract". Líneas finas azules sobre blanco. Gráficos de datos.', 'Style 1' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Human Warmth". Tonos cálidos. Retratos de personas sonriendo. Confianza.', 'Style 2' FROM ind
UNION ALL
SELECT id, 'art_direction', 'Estilo "Bold Strategy". Tipografía gigante negra sobre blanco. Mensajes cortos. Impacto.', 'Style 3' FROM ind;
