import { createClient } from '@supabase/supabase-js';
import { collectPropertyLinks } from '../lib/housing-intel/seed-collector';
import { extractPropertyDetails } from '../lib/housing-intel/forensic-detailer';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function mineBuinWithSeeds() {
  console.log('⛏️ Iniciando Operación Minería Buin (Modo Semillas & Sigilo)...');
  
  // Semilla Maestra de Buin (Venta de Casas) - URL Amigable verificada
  const seedUrl = 'https://www.toctoc.com/venta/casa/buin';

  try {
    // Fase 1: Recolectar links
    const links = await collectPropertyLinks(seedUrl);
    
    if (links.length === 0) {
      console.log('⚠️ No se encontraron links. La IP podría estar bloqueada o los selectores cambiaron.');
      return;
    }

    console.log(`🚀 Procesando ${Math.min(links.length, 5)} propiedades de prueba...`);

    // Fase 2: Extraer detalles (Procesamos solo 5 para prueba inicial)
    for (const link of links.slice(0, 5)) {
      const details = await extractPropertyDetails(link);
      
      if (details) {
        // Guardar en Supabase
        const { error } = await supabase
          .from('housing_properties')
          .upsert({
            ...details,
            toctoc_id: link.split('/').pop()?.split('?')[0],
            lat: -33.7316583, // Placeholder si no se extrae lat del detalle
            lng: -70.7580323, // Placeholder
            comuna: 'Buin',
            last_seen_at: new Date().toISOString()
          }, { onConflict: 'toctoc_id' });

        if (error) console.error(`❌ Error guardando ${link}:`, error);
        else console.log(`✅ Guardada: ${details.title}`);
      }
      
      // Pausa entre propiedades para sigilo extremo
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log('🏁 Proceso de prueba finalizado.');

  } catch (error) {
    console.error('❌ Error fatal en minería:', error);
  }
}

mineBuinWithSeeds();
