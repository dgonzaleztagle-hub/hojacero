const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function diagnose() {
    console.log('🕵️‍♀️ Sherlock Mode: Investigating Growth Data...');

    // 1. Fetch All Clients
    console.log('\n1. Fetching Roster (List)...');
    const { data: clients, error: listError } = await supabase.from('growth_clients').select('*');

    if (listError) {
        console.error('❌ Roster Fetch Failed:', listError);
        return;
    }

    if (!clients || clients.length === 0) {
        console.error('⚠️ No clients found in DB. Did seed run?');
        return;
    }

    console.log(`✅ Found ${clients.length} clients.`);
    clients.forEach(c => console.log(`   - [${c.id}] ${c.client_name} (${c.plan_tier})`));

    // 2. Simulate Single Client Fetch (Like UI)
    const targetId = clients[0].id;
    console.log(`\n2. Attempting .single() fetch for ID: ${targetId}...`);

    const { data: singleClient, error: singleError } = await supabase
        .from('growth_clients')
        .select('*')
        .eq('id', targetId)
        .single();

    if (singleError) {
        console.error('❌ Single Fetch Failed:', singleError);
        console.log('💡 Diagnosis: RLS is likely blocking generic SELECTs or .single() calls.');
        console.log('   Note: "PGRST116" means JSON object empty/row not found (often RLS).');
    } else {
        console.log('✅ Single Fetch Success:', singleClient.client_name);
        console.log('🎉 DB Permissions seem fine via Anon Key.');
    }
}

diagnose();
