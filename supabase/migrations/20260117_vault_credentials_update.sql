-- Asegurar que las columnas para credenciales existen
-- Es idempotente (si ya existen, no hace nada malo)

DO $$ 
BEGIN 
    -- 1. Agregar columna credentials si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitored_sites' AND column_name = 'credentials') THEN
        ALTER TABLE monitored_sites ADD COLUMN credentials JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- 2. Agregar columna hosting_provider si no existe (para separar del type)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monitored_sites' AND column_name = 'hosting_provider') THEN
        ALTER TABLE monitored_sites ADD COLUMN hosting_provider TEXT DEFAULT 'Vercel';
    END IF;

    -- 3. Asegurar que pagos tenga created_at para ordenamiento preciso
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pagos' AND column_name = 'created_at') THEN
        ALTER TABLE pagos ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;
