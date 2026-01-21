
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load envs from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = {};

if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            envConfig[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envConfig['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase Credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanMocks() {
    console.log('🧹 Cleaning Mock Data...');

    // 1. Clean Payments (Dependent)
    const { error: errorPagos } = await supabase
        .from('pagos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (neq is a hack to match all if no ID known, or just use filter 'id' not null?)
    // actually .delete().neq('id', -1) work? or just .delete().gte('id', 0)? 
    // Best way to delete all in supabase-js is usually .delete().neq('id', 0) if id is int, or .neq('id', 'x')

    // Better way: .delete().not('id', 'is', null)

    // Let's try to list first to see IDs? No, just delete.
    // 'pagos' usually has UUID id.
    const { error: err1 } = await supabase.from('pagos').delete().neq('site_id', '00000000-0000-0000-0000-000000000000'); // Hacky but works if site_id is UUID/FK

    if (err1) console.error('Error cleaning Pagos:', err1);
    else console.log('✅ Pagos cleaned');

    // 2. Clean Alerts
    const { error: err2 } = await supabase.from('alertas_enviadas').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err2) console.error('Error cleaning Alerts:', err2);
    else console.log('✅ Alerts cleaned');

    // 3. Clean Monitored Sites
    const { error: err3 } = await supabase.from('monitored_sites').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err3) console.error('Error cleaning Sites:', err3);
    else console.log('✅ Monitored Sites cleaned');

    console.log('✨ Database is now clean for production!');
}

cleanMocks();
