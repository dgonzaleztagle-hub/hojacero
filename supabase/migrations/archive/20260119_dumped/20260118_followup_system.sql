-- Add Follow-up columns to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS next_action_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_action_note TEXT,
ADD COLUMN IF NOT EXISTS urgency_level TEXT DEFAULT 'normal'; -- 'normal', 'high', 'critical'

-- Index for searching pending actions efficiently
CREATE INDEX IF NOT EXISTS idx_leads_next_action_date ON public.leads(next_action_date);

-- Add comment
COMMENT ON COLUMN public.leads.next_action_date IS 'Scheduled date for next sales action';
COMMENT ON COLUMN public.leads.next_action_note IS 'Instructions for the next action';
