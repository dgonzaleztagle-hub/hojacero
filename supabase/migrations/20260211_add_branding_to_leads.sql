-- Add branding column to leads table for construction leads
-- Date: 2026-02-11
-- Purpose: Store logo and color palette for leads built from scratch

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN leads.branding IS 'Branding assets: logo_url, palette (primary, secondary, accent, neutral), palette_approved, palette_variations';

-- Example structure:
-- {
--   "logo_url": "https://...",
--   "palette": {
--     "primary": "#1A73E8",
--     "secondary": "#34A853",
--     "accent": "#FBBC04",
--     "neutral": "#5F6368"
--   },
--   "palette_approved": false,
--   "palette_variations": [
--     { "name": "Original", "colors": {...} },
--     { "name": "Vibrante", "colors": {...} }
--   ]
-- }
