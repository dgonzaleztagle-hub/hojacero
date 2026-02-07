-- Tabla de caché para datos territoriales por cuadrante (~1km²)
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS territorial_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificador de cuadrante (lat/lng redondeados a 2 decimales = ~1km²)
    quadrant_key TEXT NOT NULL UNIQUE,
    lat_center DECIMAL(10, 6) NOT NULL,
    lng_center DECIMAL(10, 6) NOT NULL,
    
    -- Datos cacheados por tipo de negocio
    competitors JSONB DEFAULT '{}',  -- { "restaurant": [...], "cafe": [...] }
    anchors JSONB DEFAULT '[]',
    
    -- Metadatos
    hit_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_territorial_cache_quadrant ON territorial_cache(quadrant_key);

-- RLS (opcional, pero recomendado)
ALTER TABLE territorial_cache ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura/escritura desde service_role
CREATE POLICY "Service role can manage cache" ON territorial_cache
    FOR ALL USING (true) WITH CHECK (true);
