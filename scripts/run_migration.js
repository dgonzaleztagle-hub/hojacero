const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://vcxfdihsyehomqfdzzjf.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Error: Faltan credenciales de Supabase.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sql = `
-- Tabla para monitorear los robots locales
CREATE TABLE IF NOT EXISTS territorial_workers (
    id TEXT PRIMARY KEY,
    hostname TEXT,
    platform TEXT,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'ONLINE'
);

-- Habilitar RLS
ALTER TABLE territorial_workers ENABLE ROW LEVEL SECURITY;

-- Política simple para permitir upserts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'territorial_workers' AND policyname = 'Enable all for anyone'
    ) THEN
        CREATE POLICY "Enable all for anyone" ON territorial_workers FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Función RPC para el heartbeat que usa el robot
CREATE OR REPLACE FUNCTION update_worker_heartbeat(w_id TEXT, w_hostname TEXT, w_platform TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO territorial_workers (id, hostname, platform, last_heartbeat, status)
    VALUES (w_id, w_hostname, w_platform, NOW(), 'ONLINE')
    ON CONFLICT (id) DO UPDATE SET
        last_heartbeat = EXCLUDED.last_heartbeat,
        status = 'ONLINE';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

async function runMigration() {
    console.log('⏳ Ejecutando migración...');
    const { data, error } = await supabase.rpc('execute_sql', { query: sql });

    if (error) {
        console.error('❌ Error en migración:', error.message);
    } else {
        console.log('✅ Migración completada con éxito.');
    }
}

runMigration();
