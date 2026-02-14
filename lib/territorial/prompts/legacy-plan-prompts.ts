import { generatePlan2Prompt, type Plan2PromptData } from '@/lib/territorial/prompts/plan2-prompt';

type PromptCompetitor = { name?: string; distance?: number; category?: string };
type PromptAnchor = { name?: string; type?: string };
type PromptSaturationEntry = { count?: number; level?: string; names?: string[] };

interface LegacyPromptInput {
  address?: string;
  comuna?: string;
  gse?: { gse?: string; descripcion?: string; ingreso?: string };
  metro?: { station?: string; line?: string; distance?: number } | null;
  business_type?: string;
  competitors?: PromptCompetitor[];
  anchors?: PromptAnchor[];
  restaurants?: PromptCompetitor[];
  saturation?: Record<string, PromptSaturationEntry>;
  oceanoAzul?: string | null;
  oceanoRojo?: string | null;
  estimadores?: unknown;
  portal_inmobiliario?: unknown;
}

export function getPromptPlan1(data: LegacyPromptInput): string {
  // Formatear datos de saturación para el prompt
  let saturationInfo = '';
  if (data.saturation && Object.keys(data.saturation).length > 0) {
    saturationInfo = Object.entries(data.saturation)
      .map(([key, val]: [string, PromptSaturationEntry]) =>
        `  - ${key.toUpperCase()}: ${val.count} competidores (${val.level})${val.names?.length ? ` → ${val.names.join(', ')}` : ''}`
      ).join('\n');
  }

  // Formatear anclas comerciales con más detalle
  let anchorDetails = '';
  if (data.anchors && data.anchors.length > 0) {
    anchorDetails = data.anchors.map((a: PromptAnchor) => `  - ${a.name} (${a.type})`).join('\n');
  } else {
    anchorDetails = '  - Sin anclas detectadas';
  }

  // Formatear competidores detallados con distancias (si están disponibles)
  let detailedBusinesses = '';
  if (data.restaurants && data.restaurants.length > 0) {
    detailedBusinesses = data.restaurants.map((r: PromptCompetitor) =>
      `  - ${r.name} ${r.distance ? `(a ${r.distance}m)` : ''} ${r.category ? `[${r.category}]` : ''}`
    ).join('\n');
  } else if (data.competitors && data.competitors.length > 0) {
    detailedBusinesses = data.competitors.map((c: PromptCompetitor) => `  - ${c.name}`).join('\n');
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

export function getPromptPlan2(data: LegacyPromptInput): string {
  const normalizedGse =
    data.gse && data.gse.gse && data.gse.ingreso && data.gse.descripcion
      ? { gse: data.gse.gse, ingreso: data.gse.ingreso, descripcion: data.gse.descripcion }
      : null;
  const normalizedMetro =
    data.metro && data.metro.station && data.metro.line && typeof data.metro.distance === 'number'
      ? { station: data.metro.station, line: data.metro.line, distance: data.metro.distance }
      : null;
  const normalizedEstimadores = (data.estimadores ?? null) as Plan2PromptData['estimadores'];
  const normalizedPortalInmobiliario = (data.portal_inmobiliario ?? null) as Plan2PromptData['portal_inmobiliario'];

  // Usar el módulo actualizado que incluye análisis de inversión
  return generatePlan2Prompt({
    address: data.address ?? '',
    comuna: data.comuna ?? '',
    gse: normalizedGse,
    metro: normalizedMetro,
    competitors: data.competitors || [],
    anchors: data.anchors || [],
    business_type: data.business_type ?? '',
    oceanoAzul: data.oceanoAzul ?? undefined,
    oceanoRojo: data.oceanoRojo ?? undefined,
    saturation: data.saturation,
    estimadores: normalizedEstimadores,
    portal_inmobiliario: normalizedPortalInmobiliario
  });
}

export function getPromptPlan3(data: LegacyPromptInput): string {
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


