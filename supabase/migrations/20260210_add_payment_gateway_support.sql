-- Migration: Add Payment Gateway Support
-- Simplified: credentials stored as JSONB, protected by RLS

-- Payment configuration table
CREATE TABLE IF NOT EXISTS public.h0_store_payment_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_method TEXT NOT NULL DEFAULT 'mercadopago', -- 'mercadopago', 'flow', 'transbank'
    credentials JSONB, -- API keys as JSON (protected by RLS)
    test_mode BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add payment tracking fields to orders
ALTER TABLE public.h0_store_orders
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending';

-- Enable RLS
ALTER TABLE public.h0_store_payment_config ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can manage payment config" ON public.h0_store_payment_config;

CREATE POLICY "Authenticated users can manage payment config"
ON public.h0_store_payment_config
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Insert default config
INSERT INTO public.h0_store_payment_config (payment_method, test_mode)
VALUES ('mercadopago', true)
ON CONFLICT DO NOTHING;
