-- Migración: Agregar campos para asignación y notas de cierre
-- Ejecutar en Supabase SQL Editor

-- ============================================
-- PARTE 1: Campos nuevos para agenda_events
-- ============================================

ALTER TABLE agenda_events 
ADD COLUMN IF NOT EXISTS assigned_to TEXT DEFAULT 'daniel',
ADD COLUMN IF NOT EXISTS meeting_notes TEXT,
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN agenda_events.assigned_to IS 'Responsable de la reunión: daniel, gaston, both';
COMMENT ON COLUMN agenda_events.meeting_notes IS 'Notas post-reunión (cierre)';
COMMENT ON COLUMN agenda_events.reminder_sent IS 'Si ya se envió el reminder de 30 min';

-- Índice para buscar reuniones próximas que necesitan reminder
CREATE INDEX IF NOT EXISTS idx_agenda_pending_reminders 
ON agenda_events (start_time, reminder_sent) 
WHERE status = 'pending' AND reminder_sent = FALSE;

-- ============================================
-- PARTE 2: Tabla para tracking de demos
-- ============================================

CREATE TABLE IF NOT EXISTS demo_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prospecto TEXT NOT NULL,
    visitor_ip TEXT,
    user_agent TEXT,
    device_fingerprint TEXT,
    referrer TEXT,
    city TEXT,
    country TEXT,
    is_team_member BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consultas comunes
CREATE INDEX IF NOT EXISTS idx_demo_visits_prospecto ON demo_visits(prospecto);
CREATE INDEX IF NOT EXISTS idx_demo_visits_created ON demo_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_visits_real ON demo_visits(is_team_member) WHERE is_team_member = FALSE;

COMMENT ON TABLE demo_visits IS 'Tracking de visitas a demos de prospectos';

-- ============================================
-- PARTE 3: Tabla para dispositivos del equipo
-- ============================================

CREATE TABLE IF NOT EXISTS team_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint TEXT UNIQUE NOT NULL,
    owner TEXT NOT NULL, -- daniel, gaston
    device_name TEXT, -- "MacBook Daniel", "iPhone Gaston"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE team_devices IS 'Dispositivos del equipo para excluir del tracking';

-- ============================================
-- PARTE 4: RLS (Row Level Security)
-- ============================================

-- Permitir insert público para tracking (sin auth)
ALTER TABLE demo_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON demo_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON demo_visits FOR SELECT USING (true);

ALTER TABLE team_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated all" ON team_devices FOR ALL USING (true);
