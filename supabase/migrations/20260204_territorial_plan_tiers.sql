-- Agregar tipo de plan para distinguir entre Validación, Estrategia e Inversión
ALTER TABLE territorial_tasks 
ADD COLUMN IF NOT EXISTS plan_type INTEGER DEFAULT 1 CHECK (plan_type IN (1, 2, 3));

-- Comentarios para documentación técnica
COMMENT ON COLUMN territorial_tasks.plan_type IS '1: Validación ($150k), 2: Estrategia ($350k), 3: Inversión ($600k)';
