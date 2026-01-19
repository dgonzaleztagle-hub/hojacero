-- Create demo_industries table
CREATE TABLE IF NOT EXISTS demo_industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_prompts table
CREATE TABLE IF NOT EXISTS demo_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_id UUID REFERENCES demo_industries(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('art_direction', 'copywriting', 'image_generation', 'analysis')),
    content TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE demo_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_prompts ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read for everyone for now, modify as needed)
CREATE POLICY "Allow public read industries" ON demo_industries FOR SELECT USING (true);
CREATE POLICY "Allow public read prompts" ON demo_prompts FOR SELECT USING (true);

-- Seed Industries
INSERT INTO demo_industries (name, slug, description) VALUES
('Salud & Estética', 'salud', 'Clínicas dentales, medicina estética, dermatología, cirugía plástica.'),
('Gastronomía Premium', 'gastronomia', 'Restaurantes de autor, alta cocina, bares de especialidad, dark kitchens high-end.'),
('Real Estate', 'real-estate', 'Inmobiliarias, venta de propiedades de lujo, arquitectura, interiorismo.'),
('Legal & Corporativo', 'legal', 'Bufetes de abogados, consultoras financieras, notarías, servicios B2B.'),
('Automotriz & Detailing', 'automotriz', 'Car detailing, venta de autos de lujo, talleres de performance.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Prompts (Example for Gastronomy - we can add more later)
WITH industry AS (SELECT id FROM demo_industries WHERE slug = 'gastronomia')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT 
    id, 
    'art_direction', 
    'Estilo "Dark & Moody". Fondo negro mate o carbón. Tipografía serif elegante (Playfair Display) para títulos. Fotografía macro con iluminación dramática. Acentos dorados sutiles.', 
    'Vibe Moody Chef'
FROM industry;

WITH industry AS (SELECT id FROM demo_industries WHERE slug = 'real-estate')
INSERT INTO demo_prompts (industry_id, category, content, description)
SELECT 
    id, 
    'art_direction', 
    'Estilo "Brutalismo Refinado". Mucho espacio blanco negativo. Tipografía Sans-Serif grotesca (Helvetica/Inter) gigante. Imágenes a sangre (full width).', 
    'Vibe Swiss Architect'
FROM industry;
