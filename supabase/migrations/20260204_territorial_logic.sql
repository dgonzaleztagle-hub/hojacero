-- Migration: Territorial Intelligence Engine Infrastructure
-- Version: 20260204_territorial_logic

-- 1. Tabla de tareas territoriales (El "Nervio Digital")
CREATE TABLE IF NOT EXISTS territorial_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    raw_data JSONB DEFAULT '{}',
    error_message TEXT,
    worker_id TEXT, -- Identificador del PC de Gastón (hostname + platform)
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Habilitar Realtime para el seguimiento en vivo desde el Dashboard
-- Nota: Asegúrate de habilitar Realtime en el dashboard de Supabase para esta tabla
ALTER PUBLICATION supabase_realtime ADD TABLE territorial_tasks;

-- 3. Registro de Workers (Para saber si el PC de Gastón está activo)
CREATE TABLE IF NOT EXISTS worker_status (
    worker_id TEXT PRIMARY KEY,
    last_seen TIMESTAMPTZ DEFAULT now(),
    is_online BOOLEAN DEFAULT true,
    hostname TEXT,
    platform TEXT
);

-- 4. Función de Heartbeat (Llamada desde worker_local.js)
CREATE OR REPLACE FUNCTION update_worker_heartbeat(w_id TEXT, w_hostname TEXT, w_platform TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO worker_status (worker_id, hostname, platform, last_seen, is_online)
    VALUES (w_id, w_hostname, w_platform, now(), true)
    ON CONFLICT (worker_id) DO UPDATE
    SET last_seen = now(), is_online = true, hostname = EXCLUDED.hostname, platform = EXCLUDED.platform;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
