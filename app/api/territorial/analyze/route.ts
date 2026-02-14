import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateTerritorialMap } from '@/lib/mapbox-static';
import { geocodeBatch } from '@/lib/mapbox-geocoding';

// Módulos territoriales
import { getGSEByComuna, getDefaultGSE } from '@/lib/territorial/data/gse-data';
import { findNearestMetro } from '@/lib/territorial/data/metro-stations';
import { geocode } from '@/lib/territorial/utils/geocoding';
import { calculateDistance } from '@/lib/territorial/utils/distance';
import { getPromptPlan1, getPromptPlan2, getPromptPlan3 } from '@/lib/territorial/prompts/legacy-plan-prompts';
import { getPortalInmobiliarioData } from '@/lib/scrapers/portal-inmobiliario-cached';
import { estimarFlujoPeatonal, estimarTicketPromedio, estimarVentasMensuales } from '@/lib/territorial/estimators/flow-ticket-estimators';
import { getQuadrantKey, getCachedData, saveToCacheInternal } from '@/lib/territorial/cache';
import { getCompetitors, getAnchors } from '@/lib/territorial/poi-sources';
import type { TerritorialDataBlock } from '@/lib/territorial/types';
import { synthesizeWithGroq } from '@/lib/territorial/synthesis';
import { getSerperQueriesForBusinessType } from '@/lib/territorial/query-builder';

// ============================================
// MOTOR TERRITORIAL HOJACERO v2.0
// Basado en reportes de Gastón
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

type OverpassCompetitor = {
  lat?: number | string;
  lng?: number | string;
  name?: string;
  tags?: { amenity?: string };
};

type SerperRestaurant = {
  address?: string;
  name?: string;
  cuisine?: string[];
};

type PromptAnchor = {
  name?: string;
  type?: string;
};

type PromptCompetitor = {
  name?: string;
  distance?: number;
  category?: string;
};

type PromptSaturationEntry = {
  count?: number;
  level?: string;
  names?: string[];
};

const normalizeOverpassCompetitor = (value: unknown): OverpassCompetitor | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const lat = raw.lat;
  const lng = raw.lng;
  const name = raw.name;
  const tags = raw.tags;

  const normalized: OverpassCompetitor = {};
  if (typeof lat === 'number' || typeof lat === 'string') normalized.lat = lat;
  if (typeof lng === 'number' || typeof lng === 'string') normalized.lng = lng;
  if (typeof name === 'string') normalized.name = name;
  if (tags && typeof tags === 'object') {
    const amenity = (tags as Record<string, unknown>).amenity;
    normalized.tags = { amenity: typeof amenity === 'string' ? amenity : undefined };
  }
  return normalized;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeAnchor = (value: unknown): PromptAnchor | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name : undefined;
  const type = typeof raw.type === 'string' ? raw.type : undefined;
  return { name, type };
};

const normalizePromptCompetitor = (value: unknown): PromptCompetitor | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name : undefined;
  const distance = typeof raw.distance === 'number' ? raw.distance : undefined;
  const category = typeof raw.category === 'string' ? raw.category : undefined;
  return { name, distance, category };
};

const normalizeSaturationEntry = (value: unknown): PromptSaturationEntry | null => {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  return {
    count: typeof raw.count === 'number' ? raw.count : undefined,
    level: typeof raw.level === 'string' ? raw.level : undefined,
    names: Array.isArray(raw.names) ? raw.names.filter((n): n is string => typeof n === 'string') : undefined
  };
};


// ============================================
// PROMPTS POR PLAN (ESTILO GASTÓN)
// ============================================
// ============================================
// HANDLER PRINCIPAL
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, plan_type = 1, business_type = 'restaurant', business_name } = body;

    if (!address) {
      return NextResponse.json({ error: 'Falta la dirección' }, { status: 400 });
    }

    // Inicializar Supabase temprano para caché
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Geocoding
    const geo = await geocode(address);
    if (!geo) {
      return NextResponse.json({ error: 'No se pudo geocodificar la dirección' }, { status: 400 });
    }

    // 2. Obtener GSE
    const gse = getGSEByComuna(geo.comuna) || getDefaultGSE();

    // 3. Metro más cercano
    const metro = findNearestMetro(geo.lat, geo.lng, calculateDistance);

    // 4. Buscar en caché primero
    const quadrantKey = getQuadrantKey(geo.lat, geo.lng);
    const cachedData = await getCachedData(supabase, quadrantKey, business_type);

    let competitors: OverpassCompetitor[];
    let anchors: PromptAnchor[];
    let fromCache = false;

    if (cachedData && cachedData.competitors.length > 0) {
      // Usar datos cacheados
      competitors = cachedData.competitors
        .map(normalizeOverpassCompetitor)
        .filter((c): c is OverpassCompetitor => c !== null);
      anchors = cachedData.anchors
        .map(normalizeAnchor)
        .filter((a): a is PromptAnchor => a !== null);
      fromCache = true;
    } else {
      // Obtener datos frescos de Overpass
      const freshCompetitors = await getCompetitors(geo.lat, geo.lng, business_type);
      competitors = freshCompetitors
        .map(normalizeOverpassCompetitor)
        .filter((c): c is OverpassCompetitor => c !== null);
      const freshAnchors = await getAnchors(geo.lat, geo.lng);
      anchors = freshAnchors
        .map(normalizeAnchor)
        .filter((a): a is PromptAnchor => a !== null);

      // Guardar en caché para futuras consultas
      saveToCacheInternal(supabase, geo.lat, geo.lng, business_type, competitors, anchors);
    }

    // 6. Análisis de saturación y anclas comerciales
    let territorialData: TerritorialDataBlock = {
      saturation: null,
      oceanoAzul: null,
      oceanoRojo: null,
      restaurants: [],
      anchors: []
    };

    // Sistema de queries dinámicas por categoría de negocio
    const { useSerperScraper, specificQueries } = getSerperQueriesForBusinessType(
      business_type,
      geo.comuna,
      address
    );

    // Ejecutar scraper si está configurado
    if (useSerperScraper && SERPER_API_KEY) {
      const newData = await import('@/lib/scrapers/serper-scraper');
      const territorialResult = await newData.getTerritorialData(
        geo.lat,
        geo.lng,
        address,
        SERPER_API_KEY,
        specificQueries,
        5, // Radio de 5km para análisis detallado (Gastón Rule)
        business_type // NUEVO: Pasar business_type para clasificación dinámica
      );

      territorialData = {
        saturation: territorialResult.saturation,
        oceanoAzul: territorialResult.saturation.oceanoAzul,
        oceanoRojo: territorialResult.saturation.oceanoRojo,
        restaurants: territorialResult.restaurants,
        anchors: territorialResult.anchors
      };
    }

    // 6.5. Portal Inmobiliario (Plan 2 Premium - Inversión)
    let portalInmobiliarioData = null;
    if (plan_type === 2 || plan_type === '2') {
      console.log('🏢 Plan 2 Premium detectado: Obteniendo datos de Portal Inmobiliario...');
      portalInmobiliarioData = await getPortalInmobiliarioData(supabase, geo.comuna);

      if (portalInmobiliarioData) {
        console.log(`  ✅ Portal Inmobiliario: Venta ${portalInmobiliarioData.venta.muestra} props | Arriendo ${portalInmobiliarioData.arriendo.muestra} props`);
      } else {
        console.log('  ⚠️ Portal Inmobiliario: No se pudieron obtener datos');
      }
    }

    // 6.6. Estimadores de Flujo y Ticket (Plan 2 Premium)
    let estimadores = null;
    if (plan_type === 2 || plan_type === '2') {
      console.log('📊 Calculando estimadores de flujo y ticket...');

      // Estimar flujo peatonal
      const flujoEstimado = estimarFlujoPeatonal(
        gse.gse,
        100, // Metros cuadrados estimados (ajustar según local)
        !!metro,
        metro?.distance
      );

      // Estimar ticket promedio
      const ticketEstimado = estimarTicketPromedio(
        business_type,
        gse.gse
      );

      // Estimar ventas mensuales
      const ventasEstimadas = estimarVentasMensuales(
        flujoEstimado,
        ticketEstimado,
        0.15 // 15% tasa de conversión
      );

      estimadores = {
        flujo: flujoEstimado,
        ticket: ticketEstimado,
        ventas: ventasEstimadas
      };

      console.log(`  ✅ Flujo estimado: ${flujoEstimado.flujo_diario_estimado}/día`);
      console.log(`  ✅ Ticket promedio: $${ticketEstimado.ticket_promedio_clp.toLocaleString()} CLP`);
      console.log(`  ✅ Ventas estimadas: ${ventasEstimadas.ventas_mensuales_uf} UF/mes`);
    }

    // 7. Preparar datos para IA
    const saturationByCategory =
      (territorialData.saturation as { byCategory?: Record<string, unknown> } | null)?.byCategory || {};
    const promptSaturation = Object.fromEntries(
      Object.entries(saturationByCategory)
        .map(([key, val]) => [key, normalizeSaturationEntry(val)])
        .filter(([, val]) => val !== null)
    ) as Record<string, PromptSaturationEntry>;
    const promptRestaurants = (territorialData.restaurants || [])
      .map(normalizePromptCompetitor)
      .filter((r): r is PromptCompetitor => r !== null);

    const dataForAI = {
      address,
      comuna: geo.comuna,
      gse,
      metro,
      competitors, // Datos de Overpass
      anchors, // Anclas de Overpass
      business_type,
      business_name,
      plan_type,
      // Nuevos datos más específicos de Serper
      saturation: promptSaturation,
      oceanoAzul: territorialData.oceanoAzul,
      oceanoRojo: territorialData.oceanoRojo,
      restaurants: promptRestaurants, // Restaurantes específicos con nombres reales
      anchors_comerciales: territorialData.anchors, // Anclas comerciales específicas con nombres reales
      // Portal Inmobiliario (solo Plan 3)
      portal_inmobiliario: portalInmobiliarioData,
      // Estimadores (Plan 2 y 3)
      estimadores: estimadores,
    };

    // 8. Síntesis con Groq
    const prompts: Record<number, string> = {
      1: getPromptPlan1(dataForAI),
      2: getPromptPlan2(dataForAI),
      3: getPromptPlan3(dataForAI)
    };
    const planKey = Number(plan_type) === 2 ? 2 : Number(plan_type) === 3 ? 3 : 1;
    const analysis = await synthesizeWithGroq(prompts[planKey], GROQ_API_KEY, dataForAI);

    // Validar que la síntesis no tenga errores antes de continuar
    if (analysis.error) {
      console.error('❌ Error en síntesis de Groq:', analysis.error);
      return NextResponse.json({
        error: 'Error generando análisis territorial',
        details: analysis.error,
        message: analysis.message || 'La IA no pudo procesar los datos correctamente'
      }, { status: 500 });
    }

    // 8. Generar mapa estático (Mapbox)
    let mapUrl: string | null = null;
    if (MAPBOX_TOKEN) {
      try {
        console.log('🗺️ Iniciando generación de mapa...');
        // 📍 LÓGICA DE MAPA ESTRATÉGICO: COMBINAR OVERPASS + SERPER CON COLORES
        const combinedCoords: Array<{ lat: number; lng: number; name: string; color: string; type: string }> = [];

        // Función auxiliar para obtener color por nombre/tipo
        const getMarkerColor = (name: string, type: string = ''): string => {
          const text = `${name} ${type}`.toLowerCase();
          if (text.includes('sushi') || text.includes('japon')) return 'ff7f50'; // Salmon
          if (text.includes('burger') || text.includes('hamburguesa')) return 'ffb700'; // Gold
          if (text.includes('chino') || text.includes('chinese') || text.includes('china')) return 'cc0000'; // Red
          if (text.includes('pizza')) return '228b22'; // Green
          if (text.includes('corea') || text.includes('korean') || text.includes('kimchi')) return '9400d3'; // Purple
          if (text.includes('peru') || text.includes('ceviche')) return '00ced1'; // Turquoise
          if (text.includes('pollo') || text.includes('chicken')) return 'ff4500'; // OrangeRed
          if (text.includes('café') || text.includes('coffee') || text.includes('pasteleria')) return '8b4513'; // Brown
          return '3b82f6'; // Azul defect (Anclas o general)
        };

        // 1. Agregar competidores detectados por Overpass
        const overpassCoords = competitors
          .filter(c => c.lat && c.lng)
          .map(c => {
            const lat = toNumber(c.lat);
            const lng = toNumber(c.lng);
            if (lat === null || lng === null) return null;
            return {
              lat,
              lng,
              name: c.name || 'Sin nombre',
              type: c.tags?.amenity || '',
              color: getMarkerColor(c.name || 'Sin nombre', c.tags?.amenity || '')
            };
          })
          .filter((coord): coord is { lat: number; lng: number; name: string; type: string; color: string } => coord !== null);
        combinedCoords.push(...overpassCoords);

        // 2. Geocodificar competidores de Serper (frescos)
        if (territorialData.restaurants && territorialData.restaurants.length > 0) {
          const serperCompetitors = territorialData.restaurants.slice(0, 20) as SerperRestaurant[];
          const addresses = serperCompetitors.map(c => c.address).filter(Boolean) as string[];

          if (addresses.length > 0) {
            console.log('📮 Geocodificando', addresses.length, 'locales de Serper...');
            const geocoded = await geocodeBatch(addresses, MAPBOX_TOKEN, 'cl');
            const serperCoords = geocoded
              .filter(g => g !== null)
              .map((g, i) => ({
                lat: g!.lat,
                lng: g!.lng,
                name: serperCompetitors[i].name || 'Sin nombre',
                type: (serperCompetitors[i].cuisine || []).join(', '),
                color: getMarkerColor(serperCompetitors[i].name || 'Sin nombre', (serperCompetitors[i].cuisine || []).join(', '))
              }));
            combinedCoords.push(...serperCoords);
          }
        }

        // 3. Deduplicar y limpiar
        const uniqueCoords: Array<{ lat: number; lng: number; name: string; color: string; type: string }> = [];
        const seen = new Set<string>();

        for (const coord of combinedCoords) {
          const key = `${coord.lat.toFixed(4)},${coord.lng.toFixed(4)}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueCoords.push(coord);
          }
        }

        const competitorCoords = uniqueCoords;
        console.log('📍 Total pines finales para el mapa:', uniqueCoords.length);

        const mapCompetitors = competitorCoords.map(c => ({
          lat: c.lat,
          lng: c.lng,
          name: c.name
        }));
        mapUrl = generateTerritorialMap({ lat: geo.lat, lng: geo.lng }, mapCompetitors, MAPBOX_TOKEN);
        console.log('🗺️ Mapa generado con', competitorCoords.length, 'competidores');
        console.log('🔗 URL:', mapUrl.substring(0, 150) + '...');
      } catch (mapError) {
        console.error('⚠️ Error generando mapa:', mapError);
        // No bloqueamos el análisis si falla el mapa
      }
    }

    // 9. Guardar en BD (territorial_reports)
    const { data: report, error: dbError } = await supabase
      .from('territorial_reports')
      .insert({
        address,
        comuna: geo.comuna,
        coordinates: { lat: geo.lat, lng: geo.lng },
        business_type,
        business_name,
        plan_type: plan_type.toString(),
        dimensiones: {
          gse,
          metro,
          competitors,
          anchors,
          saturation: territorialData.saturation,
          oceanoAzul: territorialData.oceanoAzul,
          oceanoRojo: territorialData.oceanoRojo,
          restaurants: territorialData.restaurants,
          anchors_comerciales: territorialData.anchors
        },
        analysis,
        map_url: mapUrl // URL del mapa estático
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error guardando reporte:', dbError);
    }

    // 10. Respuesta
    return NextResponse.json({
      success: true,
      report_id: report?.id,
      address,
      comuna: geo.comuna,
      coordinates: { lat: geo.lat, lng: geo.lng },
      map_url: mapUrl, // URL del mapa estático
      dimensiones: {
        gse,
        metro,
        competitors,
        anchors,
        saturation: territorialData.saturation,
        oceanoAzul: territorialData.oceanoAzul,
        oceanoRojo: territorialData.oceanoRojo
      },
      analysis,
      cache_hit: fromCache,
      quadrant: quadrantKey
    });

  } catch (err: unknown) {
    console.error('Error en territorial-analyzer:', err);
    const message = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}


