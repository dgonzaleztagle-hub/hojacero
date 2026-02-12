import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationPath = join(__dirname, '../supabase/migrations/20260211_add_branding_to_leads.sql');
const sql = readFileSync(migrationPath, 'utf-8');

console.log('🚀 Running migration: 20260211_add_branding_to_leads.sql');

const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

if (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
}

console.log('✅ Migration completed successfully');
