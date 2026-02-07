// Script para limpiar el caché de análisis territorial
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function clearCache() {
    console.log('🗑️ Limpiando caché territorial...');

    const { data, error } = await supabase
        .from('territorial_cache')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos

    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.log('✅ Caché limpiado exitosamente');
    }
}

clearCache();
