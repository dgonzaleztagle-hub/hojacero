const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node register-client-killswitch.js '[CLIENT_NAME]' '[SITE_URL]'");
    process.exit(1);
}

const [clientName, siteUrl] = args;
const clientSlug = clientName.toLowerCase().replace(/\s+/g, '-');

async function main() {
    console.log(`🔒 HojaCero Kill Switch Registration`);
    console.log(`   Target: ${clientName} (${siteUrl})`);

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error("❌ Missing Supabase credentials in .env.local");
        generateFallbackSQL();
        return;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Attempt to Register Client
    console.log(`   Attempting automatic registration...`);

    // Check if already exists? (Optional, but good practice)

    const { data, error } = await supabase
        .from('monitored_sites')
        .insert([{
            client_name: clientName,
            site_url: siteUrl,
            local_path: `d:/clientes/${clientSlug}/`,
            hosting_type: 'vercel',
            maintenance_day: 1,
            plan_type: 'basic',
            status: 'active',
            contract_start: new Date().toISOString(),
            contract_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        }])
        .select('id')
        .single();

    if (error) {
        console.error(`❌ Registration Failed: ${error.message}`);
        console.log(`   (Likely due to RLS policies or missing Service Key)`);
        generateFallbackSQL();
    } else {
        console.log(`✅ Client Registered! ID: ${data.id}`);

        // 2. Activate Kill Switch (site_status)
        const { error: statusError } = await supabase
            .from('site_status')
            .insert([{ id: data.id, is_active: true }]);

        if (statusError) {
            console.warn(`⚠️ Warning: Could not create status entry: ${statusError.message}`);
        } else {
            console.log(`✅ Kill Switch Activated: ACTIVE`);
        }

        console.log(`\n🎉 SUCCESS! Use this ID for the next step:`);
        console.log(`   ${data.id}`);
    }
}

function generateFallbackSQL() {
    const filename = `manual_register_${clientSlug}.sql`;
    const filepath = path.join(__dirname, '..', 'sql', filename);

    // Ensure sql dir exists
    const sqlDir = path.dirname(filepath);
    if (!fs.existsSync(sqlDir)) {
        fs.mkdirSync(sqlDir, { recursive: true });
    }

    const sqlContent = `-- 🚨 MANUAL FALLBACK SCRIPT for ${clientName}
-- Ejecutar en Supabase SQL Editor

INSERT INTO monitored_sites (
  client_name, site_url, local_path, hosting_type, 
  maintenance_day, plan_type, status, contract_start, contract_end
) VALUES (
  '${clientName}', '${siteUrl}', 'd:/clientes/${clientSlug}/', 'vercel', 
  1, 'basic', 'active', NOW(), NOW() + interval '1 year'
) RETURNING id;

-- COPIAR EL ID GENERADO ARRIBA Y REEMPLAZAR 'ID_AQUI':
-- INSERT INTO site_status (id, is_active) VALUES ('ID_AQUI', true);
`;

    fs.writeFileSync(filepath, sqlContent);
    console.log(`\n⚠️  FALLBACK TRIGGERED`);
    console.log(`   Create SQL script: ${filename}`);
    console.log(`   Action: Run this script manually in Supabase and copy the ID.`);
}

main();
