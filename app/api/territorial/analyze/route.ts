import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getFoursquareCompetitors } from '@/lib/scrapers/foursquare-scraper';
import { getTomTomCompetitors } from '@/lib/scrapers/tomtom-scraper';
import { getSerperCompetitors } from '@/lib/scrapers/serper-scraper';
import Groq from 'groq-sdk';
import { generateTerritorialMap } from '@/lib/mapbox-static';
import { geocodeBatch } from '@/lib/mapbox-geocoding';

// Módulos territoriales
import { getGSEByComuna, getDefaultGSE } from '@/lib/territorial/data/gse-data';
import { findNearestMetro } from '@/lib/territorial/data/metro-stations';
import { geocode } from '@/lib/territorial/utils/geocoding';
import { calculateDistance } from '@/lib/territorial/utils/distance';
import { generatePlan1Prompt } from '@/lib/territorial/prompts/plan1-prompt';
import { generatePlan2Prompt } from '@/lib/territorial/prompts/plan2-prompt';
import { generatePlan3Prompt } from '@/lib/territorial/prompts/plan3-prompt';
import { getPortalInmobiliarioData } from '@/lib/scrapers/portal-inmobiliario-cached';
import { estimarFlujoPeatonal, estimarTicketPromedio, estimarVentasMensuales } from '@/lib/territorial/estimators/flow-ticket-estimators';

// ============================================
// MOTOR TERRITORIAL HOJACERO v2.0
// Basado en reportes de Gastón
// ============================================

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;


// ============================================
// SISTEMA DE CACHÉ POR CUADRANTE (~1km²)
// ============================================

// Genera clave de cuadrante redondeando lat/lng a 2 decimales
function getQuadrantKey(lat: number, lng: number): string {
  const latRounded = Math.round(lat * 100) / 100;
  const lngRounded = Math.round(lng * 100) / 100;
  return `${latRounded}_${lngRounded}`;
}

// Buscar en caché
async function getCachedData(supabase: any, quadrantKey: string, businessType: string): Promise<{ competitors: any[]; anchors: any[] } | null> {
  try {
    const { data, error } = await supabase
      .from('territorial_cache')
      .select('*')
      .eq('quadrant_key', quadrantKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    // Incrementar hit_count
    await supabase
      .from('territorial_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('id', data.id);

    // Obtener competidores del tipo específico
    const competitors = data.competitors?.[businessType] || [];
    const anchors = data.anchors || [];

    console.log(`📦 CACHE HIT: ${quadrantKey} (hits: ${data.hit_count + 1})`);
    return { competitors, anchors };
  } catch {
    return null;
  }
}

// Guardar en caché
async function saveToCacheInternal(
  supabase: any,
  lat: number,
  lng: number,
  businessType: string,
  competitors: any[],
  anchors: any[]
): Promise<void> {
  const quadrantKey = getQuadrantKey(lat, lng);

  try {
    // Intentar obtener caché existente
    const { data: existing } = await supabase
      .from('territorial_cache')
      .select('*')
      .eq('quadrant_key', quadrantKey)
      .single();

    if (existing) {
      // Actualizar caché existente agregando nuevo tipo de negocio
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
      // Crear nuevo registro de caché
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


// ============================================
// COMPETIDORES CON OVERPASS API
// ============================================
async function getCompetitors(lat: number, lng: number, businessType: string, radius: number = 500) {
  const typeMap: Record<string, string> = {
    'restaurant': 'amenity=restaurant',
    'cafe': 'amenity=cafe',
    'fast_food': 'amenity=fast_food',
    'pharmacy': 'amenity=pharmacy',
    'supermarket': 'shop=supermarket',
    'gym': 'leisure=fitness_centre',
    'hairdresser': 'shop=hairdresser',
    'clothes': 'shop=clothes',
    'bakery': 'shop=bakery',
  };

  const tag = typeMap[businessType] || 'shop';
  const query = `[out:json][timeout:15];(node(around:${radius},${lat},${lng})[${tag}];way(around:${radius},${lat},${lng})[${tag}];);out body 20;`;

  console.log('🔍 Overpass Query:', { businessType, tag, radius, lat, lng });

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();

    console.log('📊 Overpass resultados:', data.elements?.length || 0, 'lugares encontrados');

    const results = data.elements?.map((e: any) => ({
      name: e.tags?.name || 'Sin nombre',
      brand: e.tags?.brand,
      cuisine: e.tags?.cuisine,
      opening_hours: e.tags?.opening_hours,
      lat: e.lat,  // ← Coordenadas de Overpass
      lng: e.lon   // ← Overpass usa 'lon' no 'lng'
    })).slice(0, 15) || [];

    console.log('✅ Retornando', results.length, 'competidores con coordenadas');
    return results;
  } catch (error) {
    console.error('❌ Error en Overpass:', error);
    return [];
  }
}

// ============================================
// ANÁLISIS DE SATURACIÓN POR CATEGORÍA GASTRONÓMICA
// ============================================
interface CategorySaturation {
  count: number;
  level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'NULA';
  names: string[];
}

async function getCompetitorsAllCategories(
  lat: number,
  lng: number,
  address: string,
  business_type: string = 'restaurant',
  radius: number = 5000
): Promise<any> {
  // 0. Intentar Serper (Google Maps) - Es la más confiable y ya tenemos la KEY
  if (SERPER_API_KEY) {
    console.log('🔍 Usando Serper (Google Maps) con key local...');
    try {
      // Smart Hunting: Solo para restaurantes (tienen muchos nichos)
      // Para otros negocios, búsqueda simple es suficiente
      let subQueries: string[] = [];

      if (business_type === 'restaurant' || business_type === 'fast_food') {
        // Restaurantes: Smart Hunting con nichos específicos
        subQueries = [
          `sushi en ${address}`,
          `comida china en ${address}`,
          `comida coreana en ${address}`,
          `pizzeria en ${address}`,
          `hamburguesas en ${address}`,
          `pollo en ${address}`,
          `comida mexicana en ${address}`,
          `comida peruana en ${address}`,
          `mariscos en ${address}`,
          `parrilla en ${address}`,
          `comida arabe en ${address}`,
          `restaurantes en ${address}` // Query genérica al final
        ];
      } else if (business_type === 'cafe') {
        // Cafeterías: Mini Smart Hunting
        subQueries = [
          `cafeterias en ${address}`,
          `cafes en ${address}`,
          `heladerias en ${address}`,
          `pastelerias en ${address}`
        ];
      } else {
        // Otros negocios: Búsqueda simple y directa
        const businessNames: Record<string, string> = {
          'pharmacy': 'farmacias',
          'supermarket': 'minimarket',
          'gym': 'gimnasios',
          'clothes': 'tiendas de ropa',
          'hairdresser': 'peluquerías',
          'hardware': 'ferreterías',
          'bookstore': 'librerías',
          'optics': 'ópticas',
          'beauty': 'centros de estética',
          'veterinary': 'veterinarias',
          'dental': 'clínicas dentales',
          'medical': 'centros médicos',
          'car_service': 'talleres mecánicos',
          'laundry': 'lavanderías',
          'bakery': 'panaderías',
          'pet_store': 'tiendas de mascotas',
          'florist': 'floristerías'
        };

        const searchTerm = businessNames[business_type] || business_type;
        subQueries = [`${searchTerm} en ${address}`];
      }

      const result = await getSerperCompetitors(lat, lng, address, SERPER_API_KEY, subQueries);

      // Filtrar y calcular distancias reales para asegurar radio de 3km
      const filteredRestaurants = (result.restaurants || [])
        .map((r: any) => ({
          ...r,
          distance: r.lat && r.lng ? calculateDistance(lat, lng, r.lat, r.lng) : null
        }))
        .filter((r: any) => r.distance === null || r.distance <= radius) // 3000m por defecto
        .sort((a: any, b: any) => (a.distance || 99999) - (b.distance || 99999));

      return {
        saturation: result,
        oceanoAzul: result.oceanoAzul,
        oceanoRojo: result.oceanoRojo,
        restaurants: filteredRestaurants
      };
    } catch (err) {
      console.error('⚠️ Falló Serper, intentando otros...', err);
    }
  }

  // 1. Intentar Foursquare (Mejor para comida/ocio)
  if (FOURSQUARE_API_KEY && FOURSQUARE_API_KEY.length > 20) {
    console.log('🌟 Usando Foursquare Places API...');
    try {
      const result = await getFoursquareCompetitors(lat, lng, FOURSQUARE_API_KEY);
      // Mapear de result.byCategory a result.categories para mantener compatibilidad con el resto del archivo
      return {
        saturation: result,
        oceanoAzul: result.oceanoAzul,
        oceanoRojo: result.oceanoRojo
      };
    } catch (err) {
      console.error('⚠️ Falló Foursquare, reintentando con Overpass (OSM)...', err);
    }
  }

  // Fallback a Overpass (OSM)
  console.log('🏛️ Usando Overpass (OSM) como fuente secundaria...');

  // Categorías gastronómicas a buscar (basado en lo que Gastón busca en UberEats)
  const cuisineTypes = [
    { key: 'sushi', query: 'cuisine~sushi|japanese', label: 'Sushi/Japonés' },
    { key: 'chinese', query: 'cuisine~chinese|cantonese', label: 'Chino' },
    { key: 'korean', query: 'cuisine~korean', label: 'Coreano' },
    { key: 'pizza', query: 'cuisine~pizza|italian', label: 'Pizza/Italiano' },
    { key: 'burger', query: 'cuisine~burger|american', label: 'Hamburguesas' },
    { key: 'chicken', query: 'cuisine~chicken|fried_chicken', label: 'Pollo' },
    { key: 'mexican', query: 'cuisine~mexican', label: 'Mexicano' },
    { key: 'peruvian', query: 'cuisine~peruvian', label: 'Peruano' },
    { key: 'seafood', query: 'cuisine~seafood|fish', label: 'Mariscos' },
  ];

  // Consulta única a Overpass para obtener TODOS los restaurantes
  const query = `[out:json][timeout:25];(
    node(around:${radius},${lat},${lng})[amenity=restaurant];
    way(around:${radius},${lat},${lng})[amenity=restaurant];
    node(around:${radius},${lat},${lng})[amenity=fast_food];
    way(around:${radius},${lat},${lng})[amenity=fast_food];
  );out body 100;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();
    const allRestaurants = data.elements || [];

    console.log(`🍽️ Total restaurantes encontrados en radio ${radius}m:`, allRestaurants.length);

    // Clasificar restaurantes por categoría de cocina
    const categories: Record<string, CategorySaturation> = {};

    for (const cuisine of cuisineTypes) {
      const matches = allRestaurants.filter((e: any) => {
        const cuisineTag = (e.tags?.cuisine || '').toLowerCase();
        const name = (e.tags?.name || '').toLowerCase();
        // Buscar por tag cuisine o por nombre
        return cuisineTag.includes(cuisine.key) ||
          name.includes(cuisine.key) ||
          (cuisine.key === 'sushi' && (cuisineTag.includes('japanese') || name.includes('sushi'))) ||
          (cuisine.key === 'chinese' && (cuisineTag.includes('chinese') || name.includes('china') || name.includes('chino'))) ||
          (cuisine.key === 'korean' && (cuisineTag.includes('korean') || name.includes('corea'))) ||
          (cuisine.key === 'pizza' && (cuisineTag.includes('pizza') || cuisineTag.includes('italian') || name.includes('pizza'))) ||
          (cuisine.key === 'burger' && (cuisineTag.includes('burger') || name.includes('burger') || name.includes('hamburguesa'))) ||
          (cuisine.key === 'chicken' && (cuisineTag.includes('chicken') || name.includes('pollo'))) ||
          (cuisine.key === 'mexican' && (cuisineTag.includes('mexican') || name.includes('mexic'))) ||
          (cuisine.key === 'peruvian' && (cuisineTag.includes('peruvian') || name.includes('peru'))) ||
          (cuisine.key === 'seafood' && (cuisineTag.includes('seafood') || name.includes('marisco')));
      });

      const count = matches.length;
      let level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'NULA';

      // Gastón Unified Logic: 0=NULA, 1-2=BAJA, 3-4=MEDIA, 5+=ALTA
      if (count >= 5) level = 'ALTA';
      else if (count >= 3) level = 'MEDIA';
      else if (count >= 1) level = 'BAJA';
      else level = 'NULA';

      categories[cuisine.key] = {
        count,
        level,
        // Transparencia Total: Listar TODOS los nombres encontrados (Gastón Rule)
        names: matches.map((e: any) => e.tags?.name || 'Sin nombre')
      };
    }

    // Detectar Océano Azul (menor saturación) y Océano Rojo (mayor saturación)
    let oceanoAzul: string | null = null;
    let oceanoRojo: string | null = null;
    let minCount = Infinity;
    let maxCount = 0;

    for (const [key, data] of Object.entries(categories)) {
      if (data.count < minCount) {
        minCount = data.count;
        oceanoAzul = key;
      }
      if (data.count > maxCount) {
        maxCount = data.count;
        oceanoRojo = key;
      }
    }

    console.log('🔵 Océano Azul detectado:', oceanoAzul, `(${minCount} competidores)`);
    console.log('🔴 Océano Rojo detectado:', oceanoRojo, `(${maxCount} competidores)`);

    return { categories, oceanoAzul, oceanoRojo };
  } catch (err) {
    console.error('Error en análisis de saturación:', err);
    return { categories: {}, oceanoAzul: null, oceanoRojo: null };
  }
}

// ============================================
// ANCLAS COMERCIALES (Hospitales, Colegios, Malls)
// ============================================
async function getAnchors(lat: number, lng: number, radius: number = 1000) {
  const query = `[out:json][timeout:15];(
        node(around:${radius},${lat},${lng})[amenity=hospital];
        node(around:${radius},${lat},${lng})[amenity=school];
        node(around:${radius},${lat},${lng})[shop=mall];
        node(around:${radius},${lat},${lng})[amenity=university];
    );out body 10;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();

    return data.elements?.map((e: any) => ({
      name: e.tags?.name || 'Sin nombre',
      type: e.tags?.amenity || e.tags?.shop,
    })).slice(0, 10) || [];
  } catch {
    return [];
  }
}


// ============================================
// PROMPTS POR PLAN (ESTILO GASTÓN)
// ============================================
function getPromptPlan1(data: any): string {
  // Formatear datos de saturación para el prompt
  let saturationInfo = '';
  if (data.saturation && Object.keys(data.saturation).length > 0) {
    saturationInfo = Object.entries(data.saturation)
      .map(([key, val]: [string, any]) =>
        `  - ${key.toUpperCase()}: ${val.count} competidores (${val.level})${val.names.length ? ` → ${val.names.join(', ')}` : ''}`
      ).join('\n');
  }

  // Formatear anclas comerciales con más detalle
  let anchorDetails = '';
  if (data.anchors && data.anchors.length > 0) {
    anchorDetails = data.anchors.map((a: any) => `  - ${a.name} (${a.type})`).join('\n');
  } else {
    anchorDetails = '  - Sin anclas detectadas';
  }

  // Formatear competidores detallados con distancias (si están disponibles)
  let detailedBusinesses = '';
  if (data.restaurants && data.restaurants.length > 0) {
    detailedBusinesses = data.restaurants.map((r: any) =>
      `  - ${r.name} ${r.distance ? `(a ${r.distance}m)` : ''} ${r.category ? `[${r.category}]` : ''}`
    ).join('\n');
  } else if (data.competitors && data.competitors.length > 0) {
    detailedBusinesses = data.competitors.map((c: any) => `  - ${c.name}`).join('\n');
  } else {
    detailedBusinesses = '  - No se detectaron competidores en el radio de 5km.';
  }

  return `Eres un Senior Territorial Investment Consultant de HojaCero. Tu misión es generar un DOSSIER DE INTELIGENCIA COMERCIAL para un inversionista de alto nivel.

REGLAS DE ORO ("MÁS ES MÁS"):
1. NARRATIVA DENSA Y COMERCIAL: No resumas. Explica, interpreta y proyecta. Usa un lenguaje sofisticado de negocios (ej: "Share of Voice", "Ticket Promedio", "Capilaridad Logística", "Océano Azul").
2. DIÁLOGO ESTRATÉGICO: Cada dato debe ir acompañado de una interpretación comercial. Si hay flujo vehicular, explica cómo eso impacta en la visibilidad de marca. Si hay competencia, explica el riesgo de canibalización.
3. PRECISIÓN TÉCNICA: Menciona distancias específicas (ej: "a solo 340m") para validar la autoridad del software.
4. VENTANAS DE OPORTUNIDAD: Si una categoría tiene 0 competidores, no solo lo menciones; destaca la brecha de mercado y el potencial de ser el "First Mover" en la zona.
5. EXCLUSIÓN DE RUIDO: Ignora cualquier local a más de 5km. El foco es el radio de impacto directo.

ESTRUCTURA DEL DOSSIER (Manten los títulos elegantes):
1. ANÁLISIS ESTRATÉGICO DEL ENTORNO: Alma del barrio, dinámicas de gentrificación o consolidación, y conectividad estratégica.
2. PERFIL PSICODEMOGRÁFICO: No solo edad/ingreso. Habla de estilos de vida, momentos de consumo y propensión al gasto en la zona.
3. MICRO-LOGÍSTICA Y POLOS DE ATRACCIÓN: Análisis de anclas comerciales (colegios, hospitales, retail) y cómo alimentan el flujo hacia el punto de interés.
4. DOSSIER DE COMPETENCIA (MARKET SCAN): Desglose crítico de la saturación. Nivel de riesgo por categoría, nombres de competidores y su ubicación relativa exacta.
5. VEREDICTO DE VIABILIDAD E INVERSIÓN: Calificación final basada en la matriz de riesgo/oportunidad. Recomendación del "Producto Ganador" con justificación comercial.
6. PLAN DE CAPTACIÓN Y DOMINIO DIGITAL: Cómo inyectar pauta y contenido para saturar la mente del consumidor local.

## DATOS PARA ANALIZAR:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE predominante: ${data.gse?.gse} (${data.gse?.descripcion})
- Ingreso promedio zona: ${data.gse?.ingreso}
- Metro más cercano: ${data.metro ? `${data.metro.station} (Línea ${data.metro.line}, ${data.metro.distance}m)` : 'No hay metro cercano'}
- Rubro a analizar: ${data.business_type}
- Competidores REALES (Nombre y Distancia):
${detailedBusinesses}
- Anclas comerciales: 
${anchorDetails}
- Datos de saturación por categoría: 
${saturationInfo || 'Sin datos de saturación disponibles'}
- Océano Azul (Oportunidad): ${data.oceanoAzul ? data.oceanoAzul.toUpperCase() : 'No detectado'}
- Océano Rojo (Zona de Riesgo / Saturado): ${data.oceanoRojo ? data.oceanoRojo.toUpperCase() : 'No detectado'}

CRITICAL GUIDANCE ON SATURATION:
- OCEANOS AZULES / NULA / BAJA: Son áreas de alta oportunidad.
- OCEANOS ROJOS / MEDIA / ALTA: Son "ZONAS DE MUERTE". El inversionista NO debe entrar aquí a menos que tenga una ventaja competitiva radical. Si recomiendas entrar en un Océano Rojo, debes justificar por qué no será "comido vivo".
- Si el rubro solicitado (${data.business_type}) está en una categoría con saturación MEDIA o ALTA, tu tono debe ser de ADVERTENCIA EXTREMA.

## INSTRUCCIONES ESPECÍFICAS:
1. Usa emojis en cada sección como en el ejemplo
2. Numera las páginas como en el ejemplo
3. Usa mayúsculas para títulos principales
4. Incluye datos cuantitativos reales
5. Menciona nombres específicos de locales/empresas si están disponibles
6. Usa el mismo tono consultor profesional y directo
7. Incluye referencias específicas a grupos/comunidades si se conocen
8. Genera recomendaciones hiper-específicas según el rubro
9. CRÍTICO: "polos_atraccion" DEBE ser un array de strings (["Ancla 1", "Ancla 2"]), NO un string narrativo largo

## GENERA EXACTAMENTE ESTE JSON CON EL MISMO ESTILO Y FORMATO QUE EL EJEMPLO:

{
  "ecosistema": {
    "titulo": "[PÁGINA 1: EL ECOSISTEMA \\"NOMBRE_DEL_SECTOR\\"]",
    "tipo_zona": "[descripción específica con clasificación detallada]",
    "dinamica": "[descripción detallada de la dinámica del barrio con contexto específico]",
    "conectividad": "[descripción específica sobre accesibilidad, flujos y conectividad con detalles concretos]"
  },
  "demografia": {
    "titulo": "[PÁGINA 2: TU CLIENTE OBJETIVO (DEMOGRAFÍA)]",
    "perfil_principal": "[descripción detallada con edades y características específicas]",
    "poder_adquisitivo": "[descripción específica con nivel y ejemplos]",
    "densidad": "[nivel específico con datos cuantitativos reales]",
    "dato_clave": "[insight específico y valioso sobre comportamiento de compra con detalles concretos]"
  },
  "flujos": {
    "titulo": "[PÁGINA 3: FLUJOS Y VISIBILIDAD]",
    "flujo_vehicular": "[descripción específica con niveles y horarios si aplica]",
    "flujo_peatonal": "[descripción específica con niveles y horarios si aplica]",
    "polos_atraccion": ["Ancla 1 con nombre específico y distancia", "Ancla 2 con nombre específico y distancia", "Ancla 3 con nombre específico y distancia"]
  },
  "competencia": {
    "titulo": "[PÁGINA 4: SCAN DE MERCADO (APPS & COMPETENCIA)]",
    "saturacion_por_categoria": {
      "oceano_azul": "${data.oceanoAzul || 'no detectado'}",
      "oceano_rojo": "${data.oceanoRojo || 'no detectado'}"
    },
    "analisis_saturacion": "[descripción detallada de categorías saturadas y oportunidades con emojis y niveles específicos]",
    "oportunidad": "[oportunidad específica basada en el Océano Azul detectado con detalles concretos]",
    "riesgo": "[advertencia específica sobre el Océano Rojo y competencia con detalles concretos]",
    "competidores_clave": [lista de nombres reales de competidores encontrados]
  },
  "veredicto": {
    "titulo": "[PÁGINA 5: VEREDICTO HOJACERO]",
    "viabilidad": "[NIVEL_ESPECÍFICO como en el ejemplo]",
    "resumen": "[resumen ejecutivo detallado incluyendo el Océano Azul como oportunidad con contexto específico]",
    "estrategia_recomendada": "[estrategia específica hiper-detallada como en el ejemplo]"
  },
  "digital": {
    "titulo": "[PÁGINA 6: RECOMENDACIÓN DIGITAL]",
    "plan_ataque": [
      "[detalle específico de acción digital con plataformas/grupos reales]",
      "[detalle específico de acción digital con plataformas/grupos reales]",
      "[detalle específico de acción digital con plataformas/grupos reales]"
    ]
  }
}`;
}

function getPromptPlan2(data: any): string {
  return `Eres un consultor estratégico senior de HojaCero Chile. Genera un ANÁLISIS COMERCIAL COMPLETO que expanda y profundice el análisis inicial del Plan 1, manteniendo la misma calidad y estilo consultor profesional.

## FORMATO CONSULTOR PROFESIONAL (SIGUE ESTE ESTILO):
- Usa un tono más analítico y estratégico que el Plan 1
- Incluye datos cuantitativos específicos
- Mantiene el enfoque práctico pero con mayor profundidad
- Usa el mismo estilo de Gastón con análisis detallados

## RELACIÓN CON PLAN 1:
- El Plan 2 debe expandir cada sección del Plan 1 con mayor profundidad
- Debe mantener la coherencia con los hallazgos del Plan 1
- Debe añadir capas de análisis que el Plan 1 no cubrió

## DATOS RECOPILADOS:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE: ${data.gse?.gse} (${data.gse?.descripcion})
- Ingreso zona: ${data.gse?.ingreso}
- Metro: ${data.metro ? `${data.metro.station} (L${data.metro.line}, ${data.metro.distance}m)` : 'No detectado'}
- Competidores: ${data.competitors?.length || 0}
- Anclas: ${data.anchors?.length || 0}
- Rubro: ${data.business_type}
- Datos del Plan 1: ${JSON.stringify({
    oceanoAzul: data.oceanoAzul,
    oceanoRojo: data.oceanoRojo,
    saturation: data.saturation
  })}

CRITICAL GUIDANCE ON SATURATION:
- OCEANOS AZULES / NULA / BAJA: Son áreas de alta oportunidad estratégica.
- OCEANOS ROJOS / MEDIA / ALTA: Son "ZONAS DE MUERTE". Si el rubro (${data.business_type}) cae aquí, tu auditoría digital debe ser SPARTANA: busca fallas críticas en los líderes para encontrar un hueco de supervivencia, de lo contrario, advierte contra la inversión.

## GENERA EXACTAMENTE ESTE JSON SIGUIENDO EL ESTILO CONSULTOR PROFESIONAL:

{
  "resumen_ejecutivo": {
    "score_viabilidad": [1-10],
    "nivel_riesgo": "[BAJO/MEDIO/ALTO]",
    "vision_general": "[Párrafo ejecutivo de 3-4 líneas que conecte con el análisis del Plan 1 pero con mayor profundidad]"
  },
  "demografia_profunda": {
    "avatar_pagador": {
      "descripcion": "[Quién paga: edad, género, ocupación con datos específicos]",
      "comportamiento": "[Cómo compra, cuándo, frecuencia con ejemplos concretos]"
    },
    "avatar_influenciador": {
      "descripcion": "[Quién influye en la decisión con datos demográficos específicos]",
      "rol": "[Cómo influye en el proceso de compra]"
    },
    "ticket_promedio_zona": "[Estimación basada en GSE con rangos específicos]",
    "frecuencia_compra": "[diaria/semanal/quincenal/mensual con datos concretos]"
  },
  "flujo_accesibilidad": {
    "ultima_milla": "[Análisis detallado del acceso con datos de tiempo/distancia]",
    "estacionamiento": "[Disponibilidad y tipo con números específicos]",
    "horarios_oro": [
      {"hora": "[hora específica]", "tipo_venta": "[tipo de venta en ese horario]", "volumen": "[estimación]"},
      {"hora": "[hora específica]", "tipo_venta": "[tipo de venta en ese horario]", "volumen": "[estimación]"}
    ]
  },
  "auditoria_digital": {
    "competidor_1": {
      "nombre": "[Nombre específico encontrado en análisis]",
      "presencia": "[Descripción detallada de presencia digital con plataformas específicas]",
      "debilidad": "[Debilidad digital específica detectada]",
      "oportunidad": "[Oportunidad específica para superarlo]"
    },
    "competidor_2": {
      "nombre": "[Nombre específico encontrado en análisis]",
      "presencia": "[Descripción detallada]",
      "debilidad": "[Debilidad específica]",
      "oportunidad": "[Oportunidad específica]"
    },
    "conclusion_digital": "[Resumen del gap digital a explotar con oportunidades concretas]"
  },
  "matriz_riesgo": {
    "regulatorio": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de regulaciones/permisos]"},
    "economico": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de sensibilidad económica]"},
    "competencia": {"nivel": "[BAJO/MEDIO/ALTO]", "descripcion": "[Detalles específicos de amenaza competitiva]"}
  },
  "estrategia_lanzamiento": {
    "fase_1_hype": {
      "nombre": "PRE-LANZAMIENTO (Semana -2 a 0)",
      "acciones": ["Acción específica con plataforma", "Acción específica con canal", "Acción específica con táctica"]
    },
    "fase_2_marcha_blanca": {
      "nombre": "MARCHA BLANCA (Semana 1-2)",
      "acciones": ["Acción específica con métrica", "Acción específica con objetivo"]
    },
    "fase_3_retencion": {
      "nombre": "RETENCIÓN (Mes 2+)",
      "acciones": ["Acción específica con herramienta", "Acción específica con estrategia"]
    }
  },
  "proyeccion_financiera": {
    "pedidos_lunes_jueves": "[Estimación diaria con rango]",
    "pedidos_viernes_sabado": "[Estimación diaria con rango]",
    "ticket_promedio": [número estimado en CLP],
    "venta_mensual": [número estimado en CLP],
    "nota": "Proyección basada en análisis del Plan 1 y datos de mercado específicos"
  },
  "conclusion": {
    "veredicto": "[ORO/PLATA/BRONCE/RIESGO]",
    "mensaje": "[Mensaje final de 2-3 líneas que conecte con el Plan 1 pero indique la profundidad adicional]"
  }
}`;
}

function getPromptPlan3(data: any): string {
  return `Eres un analista de inversiones inmobiliarias de HojaCero Chile. Genera un DOSSIER DE INVERSIÓN que sintetice y eleve los análisis previos del Plan 1 y Plan 2 hacia una evaluación de inversión profesional.

## FORMATO DE DOSSIER PROFESIONAL (SIGUE ESTE ESTILO):
- Usa un lenguaje de inversión y análisis financiero
- Mantiene la coherencia con los hallazgos de Plan 1 y Plan 2
- Incluye proyecciones financieras detalladas
- Usa el mismo estilo profesional y directo de Gastón

## RELACIÓN CON PLANES ANTERIORES:
- El Plan 3 debe sintetizar y elevar los hallazgos de Plan 1 y Plan 2
- Debe mantener coherencia con los análisis previos pero con enfoque de inversión
- Debe conectar los hallazgos operacionales con la viabilidad de inversión

## DATOS:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE: ${data.gse?.gse}
- Ingreso: ${data.gse?.ingreso}
- Metro: ${data.metro ? `${data.metro.station} (${data.metro.distance}m)` : 'No'}
- Competidores: ${data.competitors?.length || 0}
- Anclas: ${data.anchors?.length || 0}
- Análisis previos: ${JSON.stringify({
    oceanoAzul: data.oceanoAzul,
    oceanoRojo: data.oceanoRojo,
    saturation: data.saturation,
    plan1_analysis: data.saturation,
    plan2_analysis: data.anchors
  })}

CRITICAL SATURATION ADVISORY:
- No ignores la saturación previa. Si el rubro propuesto está en Océano Rojo, el "veredicto_inversion" debería ser HOLD o SELL a menos que la tesis de inversión sea disruptiva (ej: inversión en propiedad para arriendo a un rubro distinto).

## GENERA EXACTAMENTE ESTE JSON SIGUIENDO EL ESTILO DE DOSSIER PROFESIONAL:

{
  "resumen_ejecutivo": {
    "veredicto_inversion": "[STRONG BUY/BUY/HOLD/SELL]",
    "tesis": "[Tesis de inversión en 3-4 líneas que conecte con análisis previos]",
    "indicadores_clave": {
      "inversion_estimada_uf": [número],
      "cap_rate_proyectado": [número %],
      "plusvalia_3_años": "[%]"
    }
  },
  "macro_entorno": {
    "efecto_fortaleza": "[Análisis del efecto fortaleza/polo comercial basado en anclas identificadas]",
    "masa_critica": "[Análisis de masa crítica de consumidores con datos cuantitativos]",
    "gse_predominante": "${data.gse?.gse}",
    "comportamiento_consumidor": "[Tendencias de consumo de la zona conectadas con análisis previos]"
  },
  "inteligencia_mercado": {
    "tenant_mix_evitar": [
      {"rubro": "[Rubro]", "razon": "[Por qué evitar basado en análisis de competencia]"}
    ],
    "tenant_mix_recomendado": [
      {"prioridad": 1, "rubro": "[Rubro]", "data": "[Justificación con datos de análisis previos]", "estrategia": "[Cómo abordar basado en hallazgos]"},
      {"prioridad": 2, "rubro": "[Rubro]", "data": "[Justificación]", "estrategia": "[Estrategia basada en análisis previos]"}
    ]
  },
  "modelo_financiero": {
    "precio_adquisicion_uf": [número estimado basado en análisis previos],
    "habilitacion_uf": [número basado en análisis de zona],
    "inversion_total_uf": [número basado en análisis previos],
    "arriendo_mensual_uf": [número basado en proyecciones del Plan 2],
    "noi_uf": [número anual basado en análisis financiero],
    "cap_rate": [número % calculado]
  },
  "stress_test": {
    "pesimista": {"cap_rate": [número], "vacancia": [%]},
    "base": {"cap_rate": [número], "vacancia": [%]},
    "optimista": {"cap_rate": [número], "vacancia": [%]}
  },
  "estrategia_salida": {
    "horizonte_años": [3-5],
    "valor_venta_estimado_uf": [número],
    "utilidad_capital_uf": [número]
  },
  "hoja_ruta": [
    "Paso 1: [Acción inmediata conectada con hallazgos previos]",
    "Paso 2: [Siguiente paso basado en análisis previos]",
    "Paso 3: [Consolidación alineada con estrategia previa]"
  ]
}`;
}

// ============================================
// SÍNTESIS CON GROQ
// ============================================
async function synthesizeWithGroq(data: any, planType: number): Promise<any> {
  const prompts: Record<number, string> = {
    1: getPromptPlan1(data),
    2: getPromptPlan2(data),
    3: getPromptPlan3(data),
  };

  console.log('🤖 Llamando a Groq...');
  console.log('📍 Datos para análisis:', JSON.stringify(data, null, 2).substring(0, 500));

  if (!GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY no disponible');
    return { error: 'GROQ_API_KEY no configurada' };
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Eres un analista territorial chileno experto. Tu trabajo es generar reportes profesionales basados en datos reales. Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, sin explicaciones.' },
          { role: 'user', content: prompts[planType] }
        ],
        temperature: 0.3,
        max_tokens: 3000
      })
    });

    const result = await res.json();
    console.log('📥 Respuesta Groq status:', res.status);

    if (result.error) {
      console.error('❌ Error de Groq:', result.error);
      return { error: result.error.message || 'Error de Groq', raw: JSON.stringify(result.error) };
    }

    const content = result.choices?.[0]?.message?.content;
    console.log('📝 Content length:', content?.length || 0);
    console.log('📝 Content preview:', content?.substring(0, 200));

    if (!content) {
      console.error('❌ Sin contenido en respuesta de Groq');
      return { error: 'No content from Groq', raw: JSON.stringify(result).substring(0, 500) };
    }

    // Limpiar posibles artefactos de markdown
    const cleaned = content.replace(/```json?|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    console.log('✅ JSON parseado correctamente');
    return parsed;

  } catch (e: any) {
    console.error('❌ Error en synthesizeWithGroq:', e.message);
    return { error: 'Error en síntesis', message: e.message };
  }
}

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

    let competitors: any[];
    let anchors: any[];
    let fromCache = false;

    if (cachedData && cachedData.competitors.length > 0) {
      // Usar datos cacheados
      competitors = cachedData.competitors;
      anchors = cachedData.anchors;
      fromCache = true;
    } else {
      // Obtener datos frescos de Overpass
      competitors = await getCompetitors(geo.lat, geo.lng, business_type);
      anchors = await getAnchors(geo.lat, geo.lng);

      // Guardar en caché para futuras consultas
      saveToCacheInternal(supabase, geo.lat, geo.lng, business_type, competitors, anchors);
    }

    // 6. Análisis de saturación y anclas comerciales
    let territorialData: {
      saturation: any;
      oceanoAzul: string | null;
      oceanoRojo: string | null;
      restaurants?: any[];
      anchors?: any[];
    } = { saturation: null, oceanoAzul: null, oceanoRojo: null, restaurants: [], anchors: [] };

    // Sistema de queries dinámicas por categoría de negocio
    let specificQueries: string[] = [];
    let useSerperScraper = false;

    // Switch para asignar queries específicas según business_type
    switch (business_type) {
      case 'restaurant':
        useSerperScraper = true;
        specificQueries = [
          `sushi en ${geo.comuna}, Chile`,
          `comida china en ${geo.comuna}, Chile`,
          `comida coreana en ${geo.comuna}, Chile`,
          `pizzería en ${geo.comuna}, Chile`,
          `hamburguesas en ${geo.comuna}, Chile`,
          `pollo asado en ${geo.comuna}, Chile`,
          `comida mexicana en ${geo.comuna}, Chile`,
          `comida peruana en ${geo.comuna}, Chile`,
          `comida saludable en ${geo.comuna}, Chile`,
          `restaurantes cerca de ${address}`
        ];
        break;

      case 'fast_food':
        useSerperScraper = true;
        specificQueries = [
          `hamburguesas en ${geo.comuna}, Chile`,
          `pollo asado en ${geo.comuna}, Chile`,
          `completos en ${geo.comuna}, Chile`,
          `sandwicherías en ${geo.comuna}, Chile`,
          `pizzería en ${geo.comuna}, Chile`,
          `comida rápida en ${geo.comuna}, Chile`,
          `fast food cerca de ${address}`
        ];
        break;

      case 'cafe':
        useSerperScraper = true;
        specificQueries = [
          `cafeterías en ${geo.comuna}, Chile`,
          `cafés en ${geo.comuna}, Chile`,
          `heladerías en ${geo.comuna}, Chile`,
          `pastelerías en ${geo.comuna}, Chile`,
          `coffee shop en ${geo.comuna}, Chile`
        ];
        break;

      case 'bakery':
        useSerperScraper = true;
        specificQueries = [
          `panaderías en ${geo.comuna}, Chile`,
          `pastelerías en ${geo.comuna}, Chile`,
          `reposterías en ${geo.comuna}, Chile`
        ];
        break;

      case 'pharmacy':
        useSerperScraper = true;
        specificQueries = [
          `farmacias en ${geo.comuna}, Chile`,
          `Cruz Verde en ${geo.comuna}, Chile`,
          `Salcobrand en ${geo.comuna}, Chile`,
          `Ahumada en ${geo.comuna}, Chile`
        ];
        break;

      case 'gym':
        useSerperScraper = true;
        specificQueries = [
          `gimnasios en ${geo.comuna}, Chile`,
          `centros de entrenamiento en ${geo.comuna}, Chile`,
          `fitness en ${geo.comuna}, Chile`
        ];
        break;

      case 'supermarket':
        useSerperScraper = true;
        specificQueries = [
          `minimarket en ${geo.comuna}, Chile`,
          `supermercados en ${geo.comuna}, Chile`,
          `almacenes en ${geo.comuna}, Chile`
        ];
        break;

      case 'hairdresser':
        useSerperScraper = true;
        specificQueries = [
          `peluquerías en ${geo.comuna}, Chile`,
          `barberías en ${geo.comuna}, Chile`,
          `salones de belleza en ${geo.comuna}, Chile`
        ];
        break;

      case 'beauty':
        useSerperScraper = true;
        specificQueries = [
          `centros de estética en ${geo.comuna}, Chile`,
          `spa en ${geo.comuna}, Chile`,
          `salones de belleza en ${geo.comuna}, Chile`
        ];
        break;

      case 'dental':
        useSerperScraper = true;
        specificQueries = [
          `clínicas dentales en ${geo.comuna}, Chile`,
          `dentistas en ${geo.comuna}, Chile`,
          `odontólogos en ${geo.comuna}, Chile`
        ];
        break;

      case 'medical':
        useSerperScraper = true;
        specificQueries = [
          `centros médicos en ${geo.comuna}, Chile`,
          `clínicas en ${geo.comuna}, Chile`,
          `consultorios en ${geo.comuna}, Chile`
        ];
        break;

      case 'veterinary':
        useSerperScraper = true;
        specificQueries = [
          `veterinarias en ${geo.comuna}, Chile`,
          `clínicas veterinarias en ${geo.comuna}, Chile`
        ];
        break;

      case 'hardware':
        useSerperScraper = true;
        specificQueries = [
          `ferreterías en ${geo.comuna}, Chile`,
          `materiales de construcción en ${geo.comuna}, Chile`
        ];
        break;

      case 'bookstore':
        useSerperScraper = true;
        specificQueries = [
          `librerías en ${geo.comuna}, Chile`,
          `papelerías en ${geo.comuna}, Chile`
        ];
        break;

      case 'optics':
        useSerperScraper = true;
        specificQueries = [
          `ópticas en ${geo.comuna}, Chile`
        ];
        break;

      case 'clothes':
        useSerperScraper = true;
        specificQueries = [
          `tiendas de ropa en ${geo.comuna}, Chile`,
          `boutiques en ${geo.comuna}, Chile`
        ];
        break;

      case 'car_service':
        useSerperScraper = true;
        specificQueries = [
          `talleres mecánicos en ${geo.comuna}, Chile`,
          `mecánicas en ${geo.comuna}, Chile`
        ];
        break;

      case 'laundry':
        useSerperScraper = true;
        specificQueries = [
          `lavanderías en ${geo.comuna}, Chile`,
          `tintorerías en ${geo.comuna}, Chile`
        ];
        break;

      case 'pet_store':
        useSerperScraper = true;
        specificQueries = [
          `tiendas de mascotas en ${geo.comuna}, Chile`,
          `pet shop en ${geo.comuna}, Chile`
        ];
        break;

      case 'florist':
        useSerperScraper = true;
        specificQueries = [
          `floristerías en ${geo.comuna}, Chile`,
          `flores en ${geo.comuna}, Chile`
        ];
        break;

      default:
        // Fallback para categorías no definidas
        useSerperScraper = false;
        break;
    }

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

    // 6.5. Portal Inmobiliario (solo Plan 3 - Inversión)
    let portalInmobiliarioData = null;
    if (plan_type === 3 || plan_type === '3') {
      console.log('🏢 Plan 3 detectado: Obteniendo datos de Portal Inmobiliario...');
      portalInmobiliarioData = await getPortalInmobiliarioData(supabase, geo.comuna);

      if (portalInmobiliarioData) {
        console.log(`  ✅ Portal Inmobiliario: Venta ${portalInmobiliarioData.venta.muestra} props | Arriendo ${portalInmobiliarioData.arriendo.muestra} props`);
      } else {
        console.log('  ⚠️ Portal Inmobiliario: No se pudieron obtener datos');
      }
    }

    // 6.6. Estimadores de Flujo y Ticket (Plan 2 y 3)
    let estimadores = null;
    if (plan_type === 2 || plan_type === '2' || plan_type === 3 || plan_type === '3') {
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
      saturation: territorialData.saturation?.byCategory || {},
      oceanoAzul: territorialData.oceanoAzul,
      oceanoRojo: territorialData.oceanoRojo,
      restaurants: territorialData.restaurants, // Restaurantes específicos con nombres reales
      anchors_comerciales: territorialData.anchors, // Anclas comerciales específicas con nombres reales
      // Portal Inmobiliario (solo Plan 3)
      portal_inmobiliario: portalInmobiliarioData,
      // Estimadores (Plan 2 y 3)
      estimadores: estimadores,
    };

    // 8. Síntesis con Groq
    const analysis = await synthesizeWithGroq(dataForAI, plan_type);

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
        let combinedCoords: Array<{ lat: number; lng: number; name: string; color: string; type: string }> = [];

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
          .filter((c: any) => c.lat && c.lng)
          .map((c: any) => ({
            lat: parseFloat(c.lat),
            lng: parseFloat(c.lng),
            name: c.name,
            type: c.tags?.amenity || '',
            color: getMarkerColor(c.name, c.tags?.amenity || '')
          }));
        combinedCoords.push(...overpassCoords);

        // 2. Geocodificar competidores de Serper (frescos)
        if (territorialData.restaurants && territorialData.restaurants.length > 0) {
          const serperCompetitors = territorialData.restaurants.slice(0, 20);
          const addresses = serperCompetitors.map((c: any) => c.address).filter(Boolean);

          if (addresses.length > 0) {
            console.log('📮 Geocodificando', addresses.length, 'locales de Serper...');
            const geocoded = await geocodeBatch(addresses, MAPBOX_TOKEN, 'cl');
            const serperCoords = geocoded
              .filter(g => g !== null)
              .map((g, i) => ({
                lat: g!.lat,
                lng: g!.lng,
                name: serperCompetitors[i].name,
                type: (serperCompetitors[i].cuisine || []).join(', '),
                color: getMarkerColor(serperCompetitors[i].name, (serperCompetitors[i].cuisine || []).join(', '))
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

        mapUrl = generateTerritorialMap(
          { lat: geo.lat, lng: geo.lng },
          competitorCoords as any,
          MAPBOX_TOKEN
        );
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

  } catch (err: any) {
    console.error('Error en territorial-analyzer:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
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
