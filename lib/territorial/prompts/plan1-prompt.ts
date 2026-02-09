/**
 * Prompt Generator for Plan 1 (Plan 150k - Básico)
 * 
 * Genera el prompt para análisis territorial básico con Groq LLM.
 * Enfoque: Diagnóstico territorial para validación de idea de negocio.
 */

export interface Plan1PromptData {
    address: string;
    comuna: string;
    gse: { gse: string; ingreso: string; descripcion: string } | null;
    metro: { station: string; line: string; distance: number } | null;
    competitors: any[];
    anchors: any[];
    business_type: string;
    oceanoAzul?: string;
    oceanoRojo?: string;
    saturation?: any;
}

export function generatePlan1Prompt(data: Plan1PromptData): string {
    // Formatear competidores con detalles
    const detailedBusinesses = data.competitors
        ?.map((c: any, i: number) => `${i + 1}. ${c.title || c.name} (${c.distance}m)`)
        .join('\n') || 'No se detectaron competidores directos';

    // Formatear anclas
    const anchorDetails = data.anchors
        ?.map((a: any, i: number) => `${i + 1}. ${a.name} (${a.type}, ${a.distance}m)`)
        .join('\n') || 'No se detectaron anclas comerciales relevantes';

    // Formatear saturación
    const saturationInfo = data.saturation
        ? JSON.stringify(data.saturation, null, 2)
        : null;

    return `Eres un consultor territorial de HojaCero Chile especializado en análisis de viabilidad comercial. Tu trabajo es generar un REPORTE PROFESIONAL basado en datos reales de la zona.

## CONTEXTO CRÍTICO:
Este es un análisis territorial para un emprendedor que está evaluando abrir un negocio de ${data.business_type} en ${data.address}, ${data.comuna}.

## ESTILO DE ESCRITURA (CRÍTICO - SIGUE ESTE TONO):
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
