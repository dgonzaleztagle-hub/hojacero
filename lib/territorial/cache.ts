import type { SupabaseClient } from '@supabase/supabase-js';

export function getQuadrantKey(lat: number, lng: number): string {
  const latRounded = Math.round(lat * 100) / 100;
  const lngRounded = Math.round(lng * 100) / 100;
  return `${latRounded}_${lngRounded}`;
}

export async function getCachedData(
  supabase: SupabaseClient,
  quadrantKey: string,
  businessType: string
): Promise<{ competitors: unknown[]; anchors: unknown[] } | null> {
  try {
    const { data, error } = await supabase
      .from('territorial_cache')
      .select('*')
      .eq('quadrant_key', quadrantKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    await supabase
      .from('territorial_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('id', data.id);

    const competitors = data.competitors?.[businessType] || [];
    const anchors = data.anchors || [];

    console.log(`📦 CACHE HIT: ${quadrantKey} (hits: ${data.hit_count + 1})`);
    return { competitors, anchors };
  } catch {
    return null;
  }
}

export async function saveToCacheInternal(
  supabase: SupabaseClient,
  lat: number,
  lng: number,
  businessType: string,
  competitors: unknown[],
  anchors: unknown[]
): Promise<void> {
  const quadrantKey = getQuadrantKey(lat, lng);

  try {
    const { data: existing } = await supabase
      .from('territorial_cache')
      .select('*')
      .eq('quadrant_key', quadrantKey)
      .single();

    if (existing) {
      const updatedCompetitors = {
        ...existing.competitors,
        [businessType]: competitors
      };

      await supabase
        .from('territorial_cache')
        .update({
          competitors: updatedCompetitors,
          anchors: anchors.length > (existing.anchors?.length || 0) ? anchors : existing.anchors,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      console.log(`📦 CACHE UPDATE: ${quadrantKey} (+${businessType})`);
    } else {
      const latCenter = Math.round(lat * 100) / 100;
      const lngCenter = Math.round(lng * 100) / 100;

      await supabase
        .from('territorial_cache')
        .insert({
          quadrant_key: quadrantKey,
          lat_center: latCenter,
          lng_center: lngCenter,
          competitors: { [businessType]: competitors },
          anchors: anchors,
          hit_count: 0
        });

      console.log(`📦 CACHE NEW: ${quadrantKey}`);
    }
  } catch (err) {
    console.error('Error guardando caché:', err);
  }
}
