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
