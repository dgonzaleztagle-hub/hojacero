
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testInsert() {
    console.log("Probando inserción manual en Supabase...");

    // Usamos las variables locales para probar
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Usamos Anon key por ahora, OJO: RLS debe permitir insert publico o autenticado

    if (!supabaseUrl || !supabaseKey) {
        console.error("Faltan variables de entorno");
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from('email_inbox').insert({
        sender: 'test@manual.com',
        recipient: 'contacto@hojacero.cl',
        subject: 'Prueba Manual desde Script',
        body_text: 'Si ves esto, Supabase funciona y el problema es el Worker.'
    }).select();

    if (error) {
        console.error("Error insertando:", error);
    } else {
        console.log("¡Éxito! Inserción correcta:", data);
    }
}

testInsert();
