-- Add demo_url column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS demo_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN leads.demo_url IS 'Relative path to the prospect demo page (e.g. /prospectos/familysmile)';
