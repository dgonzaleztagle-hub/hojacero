-- =================================================================================================
-- PIPELINE & CRM MIGRATION
-- =================================================================================================

-- 1. Create a custom type for Pipeline Stages to ensure data consistency
-- Order matters: radar -> contact -> negotiation -> production -> closed/lost
CREATE TYPE pipeline_stage_type AS ENUM (
    'radar',           -- Detectado / Por contactar
    'contactado',      -- Ya se envió mensaje/email
    'reunion',         -- Se agendó reunión o se envió propuesta
    'negociacion',     -- Discutiendo presupuesto/alcance
    'produccion',      -- ¡Venta Cerrada! (Handover a Dev)
    'perdido'          -- No interesado (por ahora)
);

-- 2. Update 'leads' table with CRM superpowers
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS pipeline_stage pipeline_stage_type DEFAULT 'radar',
ADD COLUMN IF NOT EXISTS pipeline_order INTEGER DEFAULT 0, -- For Drag & Drop positioning
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',         -- Array of strings: ['urgente', 'factory', 'corporate']
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'full'; -- 'full', 'dev', 'marketing'

-- 3. Create an index to make the Kanban board load instantly
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_stage ON leads(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_leads_pipeline_order ON leads(pipeline_order);

-- 4. Initial Migration of Data
-- Map existing statuses (from 'estado' column) to new pipeline stages
-- Values in 'estado': detected, ready_to_contact, in_contact, proposal_sent, won, lost, discarded

UPDATE leads SET pipeline_stage = 'radar' WHERE estado IN ('detected', 'ready_to_contact');
UPDATE leads SET pipeline_stage = 'contactado' WHERE estado = 'in_contact';
UPDATE leads SET pipeline_stage = 'negociacion' WHERE estado = 'proposal_sent';
UPDATE leads SET pipeline_stage = 'produccion' WHERE estado = 'won';
UPDATE leads SET pipeline_stage = 'perdido' WHERE estado IN ('discarded', 'lost');

-- 5. Helper Function to reorder cards (Critical for Frontend Drag & Drop)
-- This allows us to reorder a card and shift others automatically if needed, 
-- or we can handle it via frontend-first optimistic updates. 
-- For now, simple update is enough.

COMMENT ON COLUMN leads.pipeline_stage IS 'Current column in the Kanban board';
COMMENT ON COLUMN leads.pipeline_order IS 'Vertical position in the Kanban column';
