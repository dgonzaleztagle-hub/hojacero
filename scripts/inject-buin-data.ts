import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function injectRealData() {
  console.log('💉 Inyectando testimonios reales en Buin...');
  
  const properties = [
    {
      title: 'Casa Quinta Linderos, Condominio Los Almendros',
      price_uf: 5110,
      m2_total: 117,
      bedrooms: 3,
      bathrooms: 3,
      lat: -33.7225,
      lng: -70.7358,
      is_active: true,
      url: 'https://www.toctoc.com/propiedades/compra-nuevo/casa/buin/quinta-linderos-condominio-los-almendros/1608464',
      last_seen_at: new Date().toISOString()
    },
    {
      title: 'Barrio Nuevo El Carmen, Buin',
      price_uf: 4200,
      m2_total: 95,
      bedrooms: 3,
      bathrooms: 2,
      lat: -33.7312,
      lng: -70.7421,
      is_active: true,
      url: 'https://www.toctoc.com/propiedades/compra-nuevo/casa/buin/barrio-nuevo-el-carmen/1720590',
      last_seen_at: new Date().toISOString()
    },
    {
      title: 'Condominio Terra Buin',
      price_uf: 3850,
      m2_total: 88,
      bedrooms: 2,
      bathrooms: 2,
      lat: -33.7256,
      lng: -70.7389,
      is_active: true,
      url: 'https://www.toctoc.com/propiedades/compra-nuevo/casa/buin/condominio-terra-buin/4083307',
      last_seen_at: new Date().toISOString()
    },
    {
      title: 'Casa Colonial en Callejon Lo Salinas',
      price_uf: 6500,
      m2_total: 140,
      bedrooms: 4,
      bathrooms: 3,
      lat: -33.7345,
      lng: -70.7312,
      is_active: true,
      last_seen_at: new Date().toISOString()
    },
    {
      title: 'Villa Los Rosales del Bajo',
      price_uf: 2900,
      m2_total: 75,
      bedrooms: 3,
      bathrooms: 1,
      lat: -33.7412,
      lng: -70.7456,
      is_active: true,
      last_seen_at: new Date().toISOString()
    }
  ];

  const { error } = await supabase
    .from('housing_properties')
    .insert(properties);

  if (error) {
    console.error('❌ Error inyectando:', error);
  } else {
    console.log('✅ 5 testimonios reales inyectados con éxito en Buin.');
  }
}

injectRealData();
