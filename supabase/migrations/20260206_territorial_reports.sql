-- Tabla de reportes territoriales guardados
-- Ejecutar en Supabase SQL Editor

-- Limpiar tabla anterior si existe (por si quedó corrupta)
DROP TABLE IF EXISTS territorial_reports CASCADE;

-- Crear tabla desde cero
CREATE TABLE territorial_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información básica
    address TEXT NOT NULL,
    comuna TEXT,
    coordinates JSONB, -- { lat, lng }
    
    -- Tipo de negocio analizado
    business_type TEXT NOT NULL, -- 'restaurant', 'pharmacy', etc.
    business_name TEXT, -- Nombre del negocio (si aplica)
    plan_type TEXT DEFAULT 'validation', -- 'validation', 'strategy', 'investment'
    
    -- Dimensiones del análisis (datos completos)
    dimensiones JSONB NOT NULL, -- { gse, metro, competitors, anchors, saturation, oceanoAzul, oceanoRojo }
    
    -- Análisis generado por IA
    analysis JSONB, -- Resultado completo del análisis de Groq
    
    -- Mapa estático
    map_url TEXT, -- URL del mapa estático (Mapbox)
    
    -- Metadatos
    user_id UUID, -- Para asociar con usuario (futuro)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX idx_territorial_reports_address ON territorial_reports(address);
CREATE INDEX idx_territorial_reports_comuna ON territorial_reports(comuna);
CREATE INDEX idx_territorial_reports_created ON territorial_reports(created_at DESC);

-- RLS
ALTER TABLE territorial_reports ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura/escritura desde service_role
CREATE POLICY "Service role can manage reports" ON territorial_reports
    FOR ALL USING (true) WITH CHECK (true);

-- Comentarios para documentación
COMMENT ON TABLE territorial_reports IS 'Reportes territoriales completos generados por el Motor de Análisis Territorial v2.0';
COMMENT ON COLUMN territorial_reports.dimensiones IS 'Datos completos del análisis: GSE, Metro, Competidores, Anclajes, Saturación, Océanos';
COMMENT ON COLUMN territorial_reports.analysis IS 'Síntesis generada por IA (Groq) con recomendaciones y veredicto';
