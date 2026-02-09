-- Tabla de caché para Portal Inmobiliario
-- Evita scraping excesivo y mejora performance

CREATE TABLE IF NOT EXISTS portal_inmobiliario_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comuna VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- 'venta' | 'arriendo'
  
  -- Estadísticas
  precio_promedio_uf DECIMAL(10,2),
  precio_uf_m2 DECIMAL(10,2),
  muestra INTEGER,
  
  -- Data completa (JSONB)
  data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP, -- Cache válido por 7 días
  
  -- Índices para búsqueda rápida
  UNIQUE(comuna, tipo)
);

-- Índice para búsqueda por expiración
CREATE INDEX IF NOT EXISTS idx_portal_cache_expires 
ON portal_inmobiliario_cache(expires_at);

-- Índice para búsqueda por comuna
CREATE INDEX IF NOT EXISTS idx_portal_cache_comuna 
ON portal_inmobiliario_cache(comuna);

COMMENT ON TABLE portal_inmobiliario_cache IS 'Caché de datos de Portal Inmobiliario para evitar scraping excesivo';
COMMENT ON COLUMN portal_inmobiliario_cache.expires_at IS 'Cache válido por 7 días desde created_at';
