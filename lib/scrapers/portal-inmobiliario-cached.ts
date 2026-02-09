/**
 * Portal Inmobiliario Scraper con Caché
 * 
 * Wrapper del scraper que integra caché de Supabase
 * para evitar scraping excesivo.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { getComercialPropertyData, normalizarComuna, ComercialPropertyStats } from './portal-inmobiliario-scraper';

/**
 * Obtiene datos de Portal Inmobiliario con caché
 * @param supabase Cliente de Supabase
 * @param comuna Comuna a analizar (ej: 'lampa')
 * @returns Estadísticas de propiedades comerciales
 */
export async function getPortalInmobiliarioData(
    supabase: SupabaseClient,
    comuna: string
): Promise<ComercialPropertyStats | null> {
    const comunaNormalizada = normalizarComuna(comuna);

    console.log(`📊 Portal Inmobiliario: ${comuna} → ${comunaNormalizada}`);

    try {
        // 1. Buscar en caché (venta y arriendo)
        const { data: cachedVenta } = await supabase
            .from('portal_inmobiliario_cache')
            .select('*')
            .eq('comuna', comunaNormalizada)
            .eq('tipo', 'venta')
            .gte('expires_at', new Date().toISOString())
            .single();

        const { data: cachedArriendo } = await supabase
            .from('portal_inmobiliario_cache')
            .select('*')
            .eq('comuna', comunaNormalizada)
            .eq('tipo', 'arriendo')
            .gte('expires_at', new Date().toISOString())
            .single();

        // Si ambos están en caché, retornar
        if (cachedVenta && cachedArriendo) {
            console.log(`  ✅ CACHE HIT: Portal Inmobiliario (${comuna})`);
            return {
                venta: cachedVenta.data.venta,
                arriendo: cachedArriendo.data.arriendo,
                fecha_analisis: new Date(cachedVenta.created_at)
            };
        }

        // 2. Scrapear datos frescos
        console.log(`  🔍 SCRAPING: Portal Inmobiliario (${comuna})`);
        const data = await getComercialPropertyData(comunaNormalizada);

        // 3. Guardar en caché (válido por 7 días)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Guardar venta
        await supabase
            .from('portal_inmobiliario_cache')
            .upsert({
                comuna: comunaNormalizada,
                tipo: 'venta',
                precio_promedio_uf: data.venta.precio_promedio_uf,
                precio_uf_m2: data.venta.precio_uf_m2,
                muestra: data.venta.muestra,
                data: { venta: data.venta, arriendo: data.arriendo },
                expires_at: expiresAt
            }, {
                onConflict: 'comuna,tipo'
            });

        // Guardar arriendo
        await supabase
            .from('portal_inmobiliario_cache')
            .upsert({
                comuna: comunaNormalizada,
                tipo: 'arriendo',
                precio_promedio_uf: data.arriendo.precio_promedio_uf,
                precio_uf_m2: data.arriendo.precio_uf_m2,
                muestra: data.arriendo.muestra,
                data: { venta: data.venta, arriendo: data.arriendo },
                expires_at: expiresAt
            }, {
                onConflict: 'comuna,tipo'
            });

        console.log(`  ✅ CACHED: Portal Inmobiliario (${comuna}) - válido por 7 días`);

        return data;

    } catch (error) {
        console.error(`  ❌ ERROR Portal Inmobiliario (${comuna}):`, error);
        return null;
    }
}
