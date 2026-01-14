-- Pipeline de Leads - Migración de campos y tabla de actividad
-- Fecha: 2026-01-14
-- Propósito: Agregar campos de auditoría a leads y crear tabla de activity log

-- 1. Agregar campos de auditoría a leads
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS nota_revision TEXT,
ADD COLUMN IF NOT EXISTS revisado_por TEXT,
ADD COLUMN IF NOT EXISTS revisado_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 2. Actualizar estados válidos (comentario de referencia)
-- Estados: 'detected', 'discarded', 'ready_to_contact', 'in_contact', 'proposal_sent', 'won', 'lost'

-- 3. Crear tabla de activity log para auditoría
CREATE TABLE IF NOT EXISTS lead_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  usuario TEXT NOT NULL,  -- 'Daniel' o 'Gaston'
  accion TEXT NOT NULL,   -- 'reviewed', 'discarded', 'moved_to_contact', 'contacted', etc.
  nota TEXT,              -- Nota opcional del usuario
  estado_anterior TEXT,   -- Estado antes del cambio
  estado_nuevo TEXT,      -- Estado después del cambio
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Habilitar RLS
ALTER TABLE lead_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON lead_activity_log FOR ALL USING (true) WITH CHECK (true);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_lead_activity_log_lead_id ON lead_activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);
