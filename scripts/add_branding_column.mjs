import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

console.log('🚀 Adding branding column to leads table...');

const { data, error } = await supabase.rpc('query', {
    query: `
        ALTER TABLE leads 
        ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb;
        
        COMMENT ON COLUMN leads.branding IS 'Branding assets: logo_url, palette, palette_approved, palette_variations';
    `
});

if (error) {
    console.error('❌ Migration failed:', error);

    // Try direct query
    console.log('Trying direct query...');
    const { error: directError } = await supabase
        .from('leads')
        .select('branding')
        .limit(1);

    if (directError && directError.message.includes('column "branding" does not exist')) {
        console.error('Column does not exist. Please run migration manually in Supabase SQL Editor.');
        console.log('\nSQL to run:');
        console.log('ALTER TABLE leads ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT \'{}\'::jsonb;');
    } else {
        console.log('✅ Column might already exist');
    }
} else {
    console.log('✅ Migration completed successfully');
}
