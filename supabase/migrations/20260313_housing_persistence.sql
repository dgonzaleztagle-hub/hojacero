-- Migración para Housing Intelligence Persistence
-- Este esquema soporta el modo "Mining & Serve"

-- 1. Tabla de Reportes Generales (Cache de Análisis)
CREATE TABLE IF NOT EXISTS housing_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    address TEXT NOT NULL,
    comuna TEXT,
    coordinates JSONB, -- { lat, lng }
    radius_m INT,
    market_data JSONB, -- Array de testimonios usados
    environment_data JSONB, -- Anclas, colegios, etc.
    analysis JSONB, -- JSON generado por IA
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Propiedades Individuales (Mining DB)
CREATE TABLE IF NOT EXISTS housing_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    toctoc_id TEXT UNIQUE,
    lat FLOAT8 NOT NULL,
    lng FLOAT8 NOT NULL,
    price_uf FLOAT8,
    title TEXT,
    url TEXT,
    rooms INT,
    baths INT,
    m2_total FLOAT8,
    property_type TEXT, -- 'casa', 'departamento'
    image_url TEXT,
    comuna TEXT,
    sector TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda geográfica rápida
CREATE INDEX IF NOT EXISTS idx_housing_properties_coords ON housing_properties USING GIST (
  ll_to_earth(lat, lng)
);

CREATE INDEX IF NOT EXISTS idx_housing_properties_comuna ON housing_properties(comuna);

-- RLS
ALTER TABLE housing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read housing_reports" ON housing_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert housing_reports" ON housing_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read housing_properties" ON housing_properties FOR SELECT USING (true);
CREATE POLICY "Allow public insert housing_properties" ON housing_properties FOR INSERT WITH CHECK (true);
