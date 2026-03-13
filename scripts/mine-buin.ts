import { createClient } from '@supabase/supabase-js';
import { getTocTocProperties } from '../lib/housing-intel/toctoc-scraper';
import { calculateBoundingBox } from '../lib/housing-intel/geo-utils';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function mineBuin() {
  console.log('⛏️ Iniciando Operación Minería Buin...');
  
  // Centro de Buin
  const lat = -33.7316583;
  const lng = -70.7580323;
  const radius = 5000; // 5km
  const bbox = calculateBoundingBox(lat, lng, radius);

  try {
    const properties = await getTocTocProperties({
      centerLat: lat,
      centerLng: lng,
      radiusInMeters: radius,
      bbox,
      type: 'casa',
      addressHint: 'callejon lo salinas 451 buin'
    });

    console.log(`✅ Recuperadas ${properties.length} propiedades de TOCTOC.`);

    if (properties.length === 0) {
      console.log('⚠️ No se encontraron propiedades. Revisa el script o los selectores.');
      return;
    }

    // Mapear para Supabase
    const toInsert = properties.map(p => ({
      toctoc_id: p.id,
      lat: p.lat,
      lng: p.lng,
      price_uf: p.price_uf,
      title: p.title,
      url: p.url,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      m2_total: p.m2_total,
      property_type: 'casa',
      comuna: 'Buin',
      sector: 'Buin Central / Lo Salinas'
    }));

    const { error } = await supabase
      .from('housing_properties')
      .upsert(toInsert, { onConflict: 'toctoc_id' });

    if (error) {
      console.error('❌ Error al insertar en Supabase:', error);
    } else {
      console.log(`🚀 Éxito: ${toInsert.length} propiedades guardadas en Supabase.`);
    }

  } catch (error) {
    console.error('❌ Error fatal en minería:', error);
  }
}

mineBuin();
