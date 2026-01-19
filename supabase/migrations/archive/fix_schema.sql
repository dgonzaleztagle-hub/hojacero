-- 🛠️ FIXED LEADS SCHEMA (Ejecutar para agregar columnas faltantes)

ALTER TABLE leads ADD COLUMN IF NOT EXISTS fuente TEXT DEFAULT 'radar';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS telefono TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS zona_busqueda TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS categoria TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS razon_ia TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS puntaje_oportunidad INT;

-- Confirmación
SELECT '✅ Esquema Corregido: Columnas agregadas.' as status;
