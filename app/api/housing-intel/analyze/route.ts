import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { geocode } from '@/lib/territorial/utils/geocoding';
import { calculateBoundingBox } from '@/lib/housing-intel/geo-utils';
import { getTocTocProperties } from '@/lib/housing-intel/toctoc-scraper';
import { getTerritorialData } from '@/lib/scrapers/serper-scraper';
import { generateTerritorialMap } from '@/lib/mapbox-static';
import { synthesizeWithGroq, synthesizeWithGemini } from '@/lib/territorial/synthesis';
import { getGSEByComuna, getDefaultGSE } from '@/lib/territorial/data/gse-data';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SERPER_API_KEY = process.env.SERPER_API_KEY!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY!;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

/**
 * API Route: Housing Intelligence Analyzer
 * Combina datos residenciales con inteligencia territorial comercial.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, radius_m = 500, property_type = 'casa' } = body;

    if (!address) {
      return NextResponse.json({ error: 'Falta la dirección' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Geocoding
    console.log(`📍 Geocodificando: ${address}`);
    const geo = await geocode(address);
    if (!geo) {
      return NextResponse.json({ error: 'No se pudo geocodificar' }, { status: 400 });
    }

    // 2. Definir áreas de búsqueda
    const bbox = calculateBoundingBox(geo.lat, geo.lng, radius_m);
    const gse = getGSEByComuna(geo.comuna) || getDefaultGSE();

    // 3. Ejecutar Scrapers en paralelo (Sinergia)
    console.log('🚀 Iniciando motores de inteligencia paralelos (Modo Resiliente)...');
    console.time('intel-engines-duration');

    // A. Extracción Quirúrgica en Tiempo Real Puro (Live Scraping)
    console.log('📡 [TRACE 1] Iniciando Scraping de TOCTOC...');
    const residentialData = await getTocTocProperties({
      centerLat: geo.lat, 
      centerLng: geo.lng, 
      radiusInMeters: radius_m, 
      bbox, 
      type: property_type as any,
      addressHint: address
    });
    console.log(`✅ [TRACE 2] Scraping finalizado. Encontradas: ${residentialData.length} propiedades.`);

    // B. Inteligencia de Entorno (H0 Territorial Engine)
    console.log('📡 [TRACE 3] Iniciando Inteligencia Territorial...');
    const territorialData = await (async () => {
      try {
        console.log(`🔎 Buscando en caché cuadrante: ${(geo.lat).toFixed(2)}_${(geo.lng).toFixed(2)}`);
        const { data } = await supabase
          .from('territorial_cache')
          .select('*')
          .eq('quadrant_key', `${(geo.lat).toFixed(2)}_${(geo.lng).toFixed(2)}`)
          .single();
        if (data) {
          console.log('✅ [TRACE 3.1] Caché territorial encontrado.');
          return data;
        }
        
        console.log('📡 [TRACE 3.2] No hay caché. Llamando a Radar H0 (Serper)...');
        const serperData = await getTerritorialData(geo.lat, geo.lng, address, SERPER_API_KEY, [], radius_m / 1000, 'supermarket');
        console.log('✅ [TRACE 3.3] Radar H0 respondió con datos.');
        return serperData;
      } catch (e) {
        console.log(`❌ [TRACE 3.ERR] Error en Territorial: ${e instanceof Error ? e.message : 'Unknown'}`);
        return { anchors: [], saturation: { byCategory: {} } };
      }
    })();

    console.timeEnd('intel-engines-duration');
    console.log(`📊 Datos obtenidos: ${residentialData.length} casas, ${territorialData.anchors.length} anclas.`);

    // 4. Calcular Estadísticas Básicas
    const avg_uf_m2 = residentialData.length > 0 
      ? (residentialData as any[]).reduce((acc, p) => acc + (p.price_uf / (p.m2_total || 1)), 0) / residentialData.length 
      : 0;

    const stats = {
      avg_uf_m2: Math.round(avg_uf_m2 * 10) / 10,
      sample_size: residentialData.length,
      price_range: {
        min: residentialData.length > 0 ? Math.min(...(residentialData as any[]).map(p => p.price_uf)) : 0,
        max: residentialData.length > 0 ? Math.max(...(residentialData as any[]).map(p => p.price_uf)) : 0,
      }
    };

    // 5. Síntesis de IA especializada en Real Estate
    const prompt = `
      Eres el motor de Inteligencia Residencial H0 "Housing Intelligence".
      Analiza los siguientes datos para tasar y caracterizar el entorno de una propiedad.
      
      DIRECCIÓN: ${address}
      COMUNA: ${geo.comuna}
      GSE: ${gse.gse} (${gse.descripcion})
      
      DATOS DE MERCADO (TOCTOC):
      ${JSON.stringify(residentialData.slice(0, 10), null, 2)}
      
      DATOS DE ENTORNO COMERCIAL (H0 RADAR):
      - Anclas Detectadas: ${territorialData.anchors.map((a: any) => a.name).join(', ')}
      - Saturación Gastronómica/Retail: ${JSON.stringify(territorialData.saturation.byCategory)}
      
      OBJETIVO:
      1. Caracteriza el "vibe" del barrio (¿Es residencial consolidado? ¿En renovación? ¿Comercial ruidoso?).
      2. Calcula un "Housing Score" (1-100) basado en calidad de vida (proximidad a servicios vs ruido/tráfico).
      3. Analiza si los precios de TOCTOC están justificados por el entorno comercial.
      
      Responde ÚNICAMENTE en JSON con esta estructura:
      {
        "housing_score": number,
        "vibe_analysis": "string",
        "market_justification": "string",
        "investment_rating": "A" | "B" | "C" | "D",
        "plusvalia_indicators": ["string"],
        "tasacion": {
          "valor_sugerido_uf": number,
          "rango_min_uf": number,
          "rango_max_uf": number,
          "atractivo_negociacion": "Bajo" | "Medio" | "Alto" | "Pendiente",
          "justificacion_precio": "string"
        }
      }

      REGLAS DE ORO PARA TASACIÓN:
      1. Si no hay al menos 2 testigos (propiedades) reales en los datos, establece valor_sugerido_uf en 0 y atractico_negociacion en "Pendiente".
      2. No inventes precios astronómicos. El precio de una casa en Chile suele estar entre 1.000 y 40.000 UF.
      3. El "valor_sugerido_uf" DEBE ser coherente con el promedio de los testigos.
    `;

    // 7. Síntesis Final con IA (Groq / Gemini)
    console.log('📡 [TRACE 4] Iniciando Síntesis AI con Groq...');
    let aiAnalysis = null;
    try {
      aiAnalysis = await synthesizeWithGroq(prompt, GROQ_API_KEY, { residentialData, territorialData });
      console.log('✅ [TRACE 4.1] Síntesis Groq exitosa.');
    } catch (e) {
      console.log(`⚠️ [TRACE 4.ERR] Groq falló: ${e instanceof Error ? e.message : 'Unknown'}. Reintentando con Gemini...`);
      try {
        aiAnalysis = await synthesizeWithGemini(prompt, GOOGLE_AI_KEY);
        console.log('✅ [TRACE 4.2] Síntesis Gemini exitosa.');
      } catch (e2) {
        console.log(`❌ [TRACE 4.FATAL] Ambas IAs fallaron.`);
        throw new Error('Todo el sistema de IA colapsó');
      }
    }
    // 8. Consolidación Final
    console.log('📝 Consolidando reporte final...');
    
    // Generar mapa estático estilo territorial para máxima compatibilidad
    const map_url = generateTerritorialMap(
      { lat: geo.lat, lng: geo.lng },
      residentialData.map(p => ({ lat: p.lat || geo.lat, lng: p.lng || geo.lng, name: p.title })),
      MAPBOX_TOKEN
    );

    const fullAnalysis = {
      success: true,
      address,
      comuna: geo.comuna,
      coordinates: { lat: geo.lat, lng: geo.lng },
      gse,
      stats,
      market: residentialData,
      environment: territorialData,
      analysis: aiAnalysis,
      map_url // NUEVO: URL del mapa estático
    };

    // 6. Guardado en DB
    const { data: report, error: dbError } = await supabase
      .from('housing_reports')
      .insert({
        address,
        comuna: geo.comuna,
        coordinates: { lat: geo.lat, lng: geo.lng },
        radius_m,
        market_data: residentialData,
        environment_data: territorialData,
        analysis: aiAnalysis,
        map_url // Guardar también en DB
      })
      .select()
      .single();

    if (dbError) console.error('⚠️ Error DB:', dbError);

    return NextResponse.json({
      ...fullAnalysis,
      report_id: report?.id
    });

  } catch (error: any) {
    console.error('❌ Error API Housing:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
