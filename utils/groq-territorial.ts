/**
 * 🚀 GROQ CLIENT - HOJACERO INTELLIGENCE
 * Motor de síntesis forense para Inteligencia Territorial
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function synthesizeTerritorialData(rawData: any, planType: number) {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY no configurada');
    }

    const planNames: Record<number, string> = {
        1: 'Validación ($150k) - Foco en viabilidad rápida',
        2: 'Estrategia ($350k) - 5 Dimensiones + Digital Gap',
        3: 'Inversión ($600k) - Dossier para Bancos / ROI'
    };

    const prompt = `
    Eres un Analista de Inteligencia Territorial de HojaCero. Tu misión es transformar estos datos crudos en un reporte forense de alto impacto.
    
    PLAN SELECCIONADO: ${planNames[planType]}
    DIRECCIÓN: ${rawData.address}
    
    DATA CRUDA DEL ROBOT:
    ${JSON.stringify(rawData, null, 2)}
    
    REGLAS DE SÍNTESIS:
    1. Si el ambiente digital es "LOW", destaca la OPORTUNIDAD DE ORO para el cliente usando el ADN HojaCero.
    2. En el nivel "Inversión", enfócate en la plusvalía y la reconversión del sector.
    3. Usa un tono técnico, autoritario pero que incite a la acción comercial.
    4. Estima proyecciones basadas en los promedios de precios m2 extraídos.
    
    RESPONDE SOLO UN OBJETO JSON CON ESTA ESTRUCTURA:
    {
      "executive_summary": "Párrafo potente de resumen",
      "dimensions_analysis": {
        "commercial": "Análisis de rentabilidad y stock",
        "digital": "Gap detectado y oportunidad HojaCero",
        "demographic": "Perfil del cliente en la zona",
        "risk": "Factibilidad y entorno"
      },
      "investment_score": 0-100,
      "verdict": "RECOMENDADO / REVISIÓN / ALTO RIESGO",
      "next_steps": ["Paso 1", "Paso 2"]
    }
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [
                    { role: 'system', content: 'Eres un experto en Real Estate e Inteligencia Comercial. Respondes SOLO JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (error: any) {
        console.error('❌ Error en Síntesis Territorial (Groq):', error.message);
        throw error;
    }
}
