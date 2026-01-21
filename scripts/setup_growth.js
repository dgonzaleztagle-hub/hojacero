const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupGrowth() {
    console.log('🚀 Starting Growth Engine Setup...');
    console.log(`📡 Connecting to ${supabaseUrl}...`);

    // 1. Check if we can read from growth_clients
    const { data: existingClients, error: readError } = await supabase
        .from('growth_clients')
        .select('*');

    if (readError) {
        console.error('❌ Error reading growth_clients (RLS Issue?):', readError.message);
        console.log('👉 Please run the "fix_growth_rls.sql" migration in Supabase SQL Editor first.');
        return;
    }

    console.log(`✅ Read Connection success. Found ${existingClients?.length || 0} clients.`);

    if (existingClients && existingClients.length > 0) {
        console.log('ℹ️ Data already exists. Skipping seed.');
        return;
    }

    console.log('🌱 Seeding Data...');

    // 2. Insert Clients
    const clients = [
        { client_name: 'DermoEstetica', website: 'dermoestetica.cl', plan_tier: 'velocity', health_score: 85, status: 'active', next_audit_date: new Date(Date.now() + 12096e5).toISOString() },
        { client_name: 'Abogados Chile', website: 'abogadoschile.cl', plan_tier: 'foundation', health_score: 100, status: 'active', next_audit_date: new Date(Date.now() + 25920e5).toISOString() },
        { client_name: 'Constructora Civil', website: 'constructora.cl', plan_tier: 'dominance', health_score: 92, status: 'active', next_audit_date: new Date(Date.now() + 6048e5).toISOString() }
    ];

    const { data: insertedClients, error: insertError } = await supabase
        .from('growth_clients')
        .insert(clients)
        .select();

    if (insertError) {
        console.error('❌ Error inserting clients:', insertError.message);
        return;
    }

    console.log(`✅ Inserted ${insertedClients.length} clients.`);

    // 3. Insert Tasks for DermoEstetica
    const dermo = insertedClients.find(c => c.client_name === 'DermoEstetica');
    if (dermo) {
        const tasks = [
            { client_id: dermo.id, title: 'Optimizar Google Ads (Search Keywords)', category: 'ads', status: 'pending', due_date: new Date(Date.now() + 86400e3).toISOString(), is_recurring: true },
            { client_id: dermo.id, title: 'Crear Landing Page "Depilación Láser"', category: 'content', status: 'in_progress', due_date: new Date(Date.now() + 259200e3).toISOString(), is_recurring: false },
            { client_id: dermo.id, title: 'Reporte Mensual Enero', category: 'reporting', status: 'done', due_date: new Date(Date.now() - 172800e3).toISOString(), is_recurring: true }
        ];

        const { error: taskError } = await supabase.from('growth_tasks').insert(tasks);
        if (taskError) console.error('❌ Error inserting tasks:', taskError.message);
        else console.log('✅ Inserted initial tasks for DermoEstetica.');
    }

    console.log('✨ Setup Complete! Refresh the Dashboard.');
}

setupGrowth();
