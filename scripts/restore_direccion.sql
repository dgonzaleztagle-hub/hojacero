-- RESTAURAR COLUMNA DIRECCIÓN
-- 1. Agregar columna 'direccion' si no existe
ALTER TABLE leads ADD COLUMN IF NOT EXISTS direccion text;

-- 2. Backfill (Rellenar) datos desde el JSON 'source_data'
UPDATE leads
SET direccion = source_data->>'address'
WHERE direccion IS NULL AND source_data->>'address' IS NOT NULL;

-- 3. Confirmación
SELECT COUNT(*) as leads_con_direccion FROM leads WHERE direccion IS NOT NULL;
