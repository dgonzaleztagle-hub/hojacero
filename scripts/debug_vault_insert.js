const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env manual
try {
    const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...obj] = line.split('=');
        if (key && obj) {
            const val = obj.join('=').trim();
            if (!process.env[key]) process.env[key] = val;
        }
    });
} catch (e) {
    console.error("Could not read .env.local");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing credentials");
    console.log("URL:", SUPABASE_URL);
    console.log("Key available:", !!SUPABASE_KEY);
    process.exit(1);
}

console.log("Using Key type:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SERVICE_ROLE" : "ANON/PUBLIC");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log("🛠️ Attempting DEBUG Vault Insert...");

    const payload = {
        client_name: "Debug Client " + Date.now(),
        site_url: "https://debug.com",
        status: "active",
        plan_type: "Mensual",
        email_contacto: "debug@test.com",
        dia_cobro: 15,
        monto_mensual: 1.5, // The float that was causing issues
        moneda: "UF",
        cuotas_implementacion: 3,
        cuotas_pagadas: 0,
        contract_start: new Date().toISOString(),
        contract_end: new Date().toISOString()
    };

    console.log("Payload:", payload);

    const { data, error } = await supabase
        .from('monitored_sites')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error("❌ INSERT FAILED!");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("✅ INSERT SUCCESS!");
        console.log("Created ID:", data.id);

        // Clean up
        await supabase.from('monitored_sites').delete().eq('id', data.id);
        console.log("Cleaned up debug row.");
    }
}

main();
