export type TerritorialSynthesis = Record<string, unknown>;

export async function synthesizeWithGroq(
  prompt: string,
  apiKey: string | undefined,
  debugData?: unknown
): Promise<TerritorialSynthesis> {
  console.log('🤖 Llamando a Groq...');
  if (debugData) {
    console.log('📍 Datos para análisis:', JSON.stringify(debugData, null, 2).substring(0, 500));
  }

  if (!apiKey) {
    console.error('❌ GROQ_API_KEY no disponible');
    return { error: 'GROQ_API_KEY no configurada' };
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'Eres un analista territorial chileno experto. Tu trabajo es generar reportes profesionales basados en datos reales. Responde ÚNICAMENTE con JSON válido, sin texto adicional, sin markdown, sin explicaciones.'
          },
          { role: 'user', content: prompt }
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

    const cleaned = content.replace(/```json?|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    console.log('✅ JSON parseado correctamente');
    return (parsed || {}) as TerritorialSynthesis;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unknown error';
    console.error('❌ Error en synthesizeWithGroq:', message);
    return { error: 'Error en síntesis', message };
  }
}

/**
 * Síntesis usando Google Gemini 1.5 (El cerebro de Google)
 * Mucho más potente en razonamiento y capaz de "Grounding"
 */
export async function synthesizeWithGemini(
  prompt: string,
  apiKey: string | undefined
): Promise<TerritorialSynthesis> {
  console.log('🧠 Llamando a Google Gemini 1.5 Pro...');
  
  if (!apiKey) {
    console.error('❌ GOOGLE_AI_KEY no disponible');
    return { error: 'GOOGLE_AI_KEY no configurada' };
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${prompt}\n\nIMPORTANTE: Responde estrictamente con un JSON válido. No incluyas markdown, solo el objeto.` }]
        }],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: "application/json",
        }
      })
    });

    const result = await res.json();
    
    if (result.error) {
      console.error('❌ Error de Gemini:', result.error);
      return { error: result.error.message || 'Error de Google Gemini' };
    }

    const content = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('❌ Sin contenido en respuesta de Gemini');
      return { error: 'No content from Gemini' };
    }

    const cleaned = content.replace(/```json?|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    console.log('✅ Inteligencia de Google procesada correctamente');
    return (parsed || {}) as TerritorialSynthesis;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'unknown error';
    console.error('❌ Error en synthesizeWithGemini:', message);
    return { error: 'Error en síntesis de Google', message };
  }
}
