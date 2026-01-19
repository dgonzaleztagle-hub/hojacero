-- Tabla para el chat interno/bitácora (Polimórfica simplificada)
CREATE TABLE IF NOT EXISTS bitacora_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES monitored_sites(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE, -- Soporte para Pipeline/Leads
    author TEXT NOT NULL CHECK (author IN ('Yo', 'Gaston', 'Sistema')),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_bitacora_reference CHECK (client_id IS NOT NULL OR lead_id IS NOT NULL)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_bitacora_client_id ON bitacora_clientes(client_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_lead_id ON bitacora_clientes(lead_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_created_at ON bitacora_clientes(created_at DESC);

-- RLS (Permisiva por ahora para dashboard interno)
ALTER TABLE bitacora_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access for authenticated users" ON bitacora_clientes
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger para actualizar updated_at del cliente cuando hay nuevo mensaje (opcional, para ordenar por actividad)
-- (Omitido por ahora para mantener simpleza)
