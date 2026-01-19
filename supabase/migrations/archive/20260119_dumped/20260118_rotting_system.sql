-- 1. Add last_activity_at to leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT now();

-- 2. Backfill from existing activity log (latest activity per lead)
UPDATE public.leads l
SET last_activity_at = sub.max_created_at
FROM (
    SELECT lead_id, MAX(created_at) as max_created_at
    FROM public.lead_activity_log
    GROUP BY lead_id
) sub
WHERE l.id = sub.lead_id;

-- 3. Create Trigger Function to auto-update leads.last_activity_at
CREATE OR REPLACE FUNCTION public.update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.leads
    SET last_activity_at = NEW.created_at
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create Trigger on lead_activity_log
DROP TRIGGER IF EXISTS trigger_update_lead_activity ON public.lead_activity_log;
CREATE TRIGGER trigger_update_lead_activity
AFTER INSERT ON public.lead_activity_log
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_last_activity();

-- 5. Create Trigger for Chat (bitacora_clientes) as well
DROP TRIGGER IF EXISTS trigger_update_lead_activity_chat ON public.bitacora_clientes;
CREATE TRIGGER trigger_update_lead_activity_chat
AFTER INSERT ON public.bitacora_clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_lead_last_activity();

-- 6. Index for fast "Rotting" queries
CREATE INDEX IF NOT EXISTS idx_leads_last_activity_at ON public.leads(last_activity_at);
