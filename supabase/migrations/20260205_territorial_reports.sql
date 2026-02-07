-- Tabla para almacenar reportes territoriales
CREATE TABLE IF NOT EXISTS territorial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL,
    plan_type INTEGER NOT NULL CHECK (plan_type IN (1, 2, 3)),
    coordinates JSONB,
    dimensiones JSONB,
    analysis JSONB,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'ERROR')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_territorial_reports_status ON territorial_reports(status);
CREATE INDEX IF NOT EXISTS idx_territorial_reports_created_at ON territorial_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_territorial_reports_plan_type ON territorial_reports(plan_type);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_territorial_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_territorial_reports_updated_at
    BEFORE UPDATE ON territorial_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_territorial_reports_updated_at();

-- RLS Policies (ajustar según necesidad)
ALTER TABLE territorial_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users" ON territorial_reports
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
