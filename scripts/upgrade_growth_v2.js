const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function upgradeToV2() {
    console.log('🚀 Upgrading Data to Growth OS v2...');

    // 1. Upgrade Clients (Backfill active_modules)
    console.log('\n1. Backfilling Active Modules for Clients...');
    const { data: clients, error: clientError } = await supabase.from('growth_clients').select('id, plan_tier, client_name');

    if (clientError) {
        console.error('❌ Error reading clients. Did you run the SQL migration first?', clientError.message);
        return;
    }

    for (const client of clients) {
        let modules = { ads: false, seo: false, social: false, email: false, strategy: false };

        // Logic: Enable modules based on Tier
        if (client.plan_tier === 'foundation') {
            modules = { ads: false, seo: true, social: false, email: false, strategy: false };
        } else if (client.plan_tier === 'velocity') {
            modules = { ads: true, seo: true, social: true, email: true, strategy: false };
        } else if (client.plan_tier === 'dominance') {
            modules = { ads: true, seo: true, social: true, email: true, strategy: true };
        }

        const { error: updateError } = await supabase
            .from('growth_clients')
            .update({ active_modules: modules })
            .eq('id', client.id);

        if (updateError) console.error(`   ❌ Failed to update ${client.client_name}:`, updateError.message);
        else console.log(`   ✅ Updated ${client.client_name} modules:`, JSON.stringify(modules));
    }

    // 2. Upgrade Tasks (Backfill priority)
    console.log('\n2. Backfilling Task Priorities...');
    // Heuristic: "Strategy" and "Ads" are High Priority. "Reporting" is Normal. "Setup" is High.

    // Update High Priority Categories
    const highCategories = ['strategy', 'ads', 'setup', 'crm'];
    const { error: highError } = await supabase
        .from('growth_tasks')
        .update({ priority: 'high' })
        .in('category', highCategories);

    if (highError) console.error('   ❌ Error setting High Priority:', highError.message);
    else console.log('   ✅ Marked critical categories as High Priority.');

    // Update Low Priority
    const { error: lowError } = await supabase
        .from('growth_tasks')
        .update({ priority: 'low' })
        .eq('category', 'content'); // Content creation usually takes time, not urgent "fire" (unless late)

    if (lowError) console.error('   ❌ Error setting Low Priority:', lowError.message);
    else console.log('   ✅ Marked content tasks as Low Priority.');

    console.log('\n✨ Upgrade Complete! Now implementing the UI...');
}

upgradeToV2();
