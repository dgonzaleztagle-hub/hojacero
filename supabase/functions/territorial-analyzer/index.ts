// @ts-nocheck - Deno Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// GSE por comuna (simplificado)
const GSE_DATA: Record<string, { gse: string; ingreso: string }> = {
  'las condes': { gse: 'ABC1', ingreso: '$4.500.000+' },
  'vitacura': { gse: 'ABC1', ingreso: '$5.000.000+' },
  'lo barnechea': { gse: 'ABC1', ingreso: '$4.800.000+' },
  'providencia': { gse: 'C1a', ingreso: '$2.800.000' },
  'ñuñoa': { gse: 'C1b', ingreso: '$2.200.000' },
  'santiago': { gse: 'C2', ingreso: '$1.500.000' },
  'la florida': { gse: 'C3', ingreso: '$900.000' },
  'maipú': { gse: 'C3', ingreso: '$850.000' },
  'puente alto': { gse: 'D', ingreso: '$650.000' },
};

// Geocoding con Nominatim
async function geocode(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=cl&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'HojaCero/1.0' } });
  const data = await res.json();
  if (!data.length) return null;
  const { lat, lon, display_name } = data[0];
  const comuna = display_name.split(',').find((p: string) =>
    p.toLowerCase().includes('las condes') || p.toLowerCase().includes('providencia') ||
    p.toLowerCase().includes('santiago') || p.toLowerCase().includes('ñuñoa')
  )?.trim() || 'Santiago';
  return { lat: parseFloat(lat), lng: parseFloat(lon), comuna };
}

// Competidores con Overpass
async function getCompetitors(lat: number, lng: number, businessType: string) {
  const typeMap: Record<string, string> = {
    'restaurant': 'amenity=restaurant', 'cafe': 'amenity=cafe',
    'pharmacy': 'amenity=pharmacy', 'supermarket': 'shop=supermarket',
    'gym': 'leisure=fitness_centre', 'hairdresser': 'shop=hairdresser',
  };
  const tag = typeMap[businessType] || 'shop';
  const query = `[out:json][timeout:10];node(around:500,${lat},${lng})[${tag}];out body 10;`;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', body: query, headers: { 'Content-Type': 'text/plain' }
    });
    const data = await res.json();
    return data.elements?.map((e: any) => e.tags?.name || 'Sin nombre').slice(0, 5) || [];
  } catch { return []; }
}

// Síntesis con Groq
async function synthesize(data: any, planType: number) {
  const planPrompts: Record<number, string> = {
    1: `Eres un analista territorial comercial chileno experto. Genera un análisis PROFUNDO y COMERCIAL en JSON válido.

CONTEXTO:
- Dirección: ${data.address}
- Comuna: ${data.comuna}
- GSE: ${data.gse.gse} (Ingreso promedio: ${data.gse.ingreso})
- Tipo de negocio: ${data.business_type}
- Competidores cercanos (500m): ${data.competitors.length}

INSTRUCCIONES:
1. Usa un tono COMERCIAL y PERSUASIVO, no académico
2. Sé ESPECÍFICO con datos concretos (no genérico)
3. Menciona la comuna y el GSE en el análisis
4. Usa números y porcentajes cuando sea posible
5. Enfócate en VIABILIDAD COMERCIAL, no residencial

ESTRUCTURA JSON REQUERIDA:
{
  "ecosistema": {
    "tipo_zona": "Descripción específica del tipo de zona comercial (ej: 'Corredor comercial de alto tráfico', 'Zona residencial premium', 'Hub gastronómico emergente')",
    "dinamica": "Análisis DETALLADO (3-4 oraciones) de cómo funciona el barrio: flujos peatonales, horarios peak, perfil de transeúntes, actividad comercial. Menciona la comuna y características específicas.",
    "conectividad": "Análisis de acceso: transporte público cercano, estacionamientos, accesibilidad peatonal, principales vías de acceso"
  },
  "demografia": {
    "perfil": "Descripción ESPECÍFICA del perfil demográfico: edad promedio, composición familiar, estilo de vida, hábitos de consumo. Menciona el GSE ${data.gse.gse} y su significado comercial.",
    "poder_adquisitivo": "Análisis del poder de compra: ingreso promedio (${data.gse.ingreso}), disposición al gasto, ticket promedio esperado, sensibilidad al precio"
  },
  "flujos": {
    "patron": "Descripción de patrones de movilidad: horarios de mayor tráfico, días peak, estacionalidad, origen/destino de flujos",
    "oportunidad": "Análisis de cómo aprovechar estos flujos para el negocio: mejor horario de apertura, días clave, estrategias de captura"
  },
  "competencia": {
    "total": ${data.competitors.length},
    "saturacion": "Análisis HONESTO de saturación: ¿hay espacio para otro ${data.business_type}? ¿Qué diferenciación se necesita? Menciona competidores específicos si los hay.",
    "ventana": "Oportunidad de diferenciación: qué NO están haciendo los competidores, nichos desatendidos, propuesta de valor única"
  },
  "digital": {
    "presencia_local": "Análisis de presencia digital de competidores locales: ¿tienen web? ¿redes sociales activas? ¿delivery? Oportunidad de destacar digitalmente.",
    "estrategia": "Recomendación específica: canales digitales prioritarios (Instagram, Google Maps, delivery apps), tipo de contenido, frecuencia de publicación"
  },
  "veredicto": {
    "viabilidad": "ALTA",
    "score": 85,
    "resumen": "Resumen ejecutivo (2-3 oraciones) del análisis: ¿es viable? ¿por qué? ¿cuál es el principal factor de éxito?",
    "estrategia": "Recomendación ACCIONABLE (3-4 puntos específicos) para maximizar éxito: posicionamiento, diferenciación, pricing, marketing, operación"
  }
}

IMPORTANTE: 
- NO uses frases genéricas como "zona con potencial" o "buena ubicación"
- SÉ ESPECÍFICO: menciona la comuna, el GSE, el número de competidores
- Si hay ${data.competitors.length} competidores, analiza si es MUCHO o POCO para un ${data.business_type}
- La viabilidad debe ser ALTA solo si realmente lo justifican los datos
- Si hay más de 5 competidores en 500m, considera viabilidad MEDIA y sugiere diferenciación fuerte`,

    2: `Genera análisis comercial COMPLETO en JSON:
{"score_viabilidad":8,"nivel_riesgo":"BAJO","vision":"","avatar":{"pagador":"","influenciador":""},"competidores":[],"matriz_riesgo":{"regulatorio":"","economico":"","competencia":""},"estrategia":{"fase1":"","fase2":"","fase3":""},"proyeccion":{"ticket":0,"venta_mensual":0}}`,

    3: `Genera dossier de inversión en JSON:
{"veredicto":"STRONG BUY/BUY/HOLD/SELL","tesis":"","cap_rate":0,"noi":0,"inversion_uf":0,"plusvalia_3_años":"","stress_test":{"pesimista":{},"base":{},"optimista":{}}}`
  };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: 'Eres analista territorial chileno. Responde SOLO JSON válido.' },
        { role: 'user', content: `Datos: ${JSON.stringify(data)}\n\n${planPrompts[planType]}` }
      ],
      temperature: 0.1, max_tokens: 3000
    })
  });
  const result = await res.json();
  const content = result.choices?.[0]?.message?.content || '{}';
  try { return JSON.parse(content.replace(/```json?|```/g, '').trim()); }
  catch { return { error: 'Error parsing', raw: content }; }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { address, plan_type = 1, business_type = 'restaurant' } = await req.json();
    if (!address) return new Response(JSON.stringify({ error: 'Falta dirección' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // 1. Geocoding
    const geo = await geocode(address);
    if (!geo) return new Response(JSON.stringify({ error: 'No se pudo geocodificar' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // 2. Datos
    const gse = GSE_DATA[geo.comuna.toLowerCase()] || { gse: 'C2', ingreso: '$1.200.000' };
    const competitors = await getCompetitors(geo.lat, geo.lng, business_type);

    // 3. Síntesis
    const dataForAI = { address, comuna: geo.comuna, gse, competitors, business_type, plan_type };
    const analysis = await synthesize(dataForAI, plan_type);

    // 4. Guardar
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: report } = await supabase.from('territorial_reports').insert({
      address, comuna: geo.comuna, coordinates: { lat: geo.lat, lng: geo.lng },
      business_type, plan_type, dimensiones: { gse, competitors }, analysis
    }).select().single();

    return new Response(JSON.stringify({
      success: true, report_id: report?.id, address, comuna: geo.comuna,
      coordinates: geo, dimensiones: { gse, competitors }, analysis
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
