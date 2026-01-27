import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: Request) {
    try {
        const { leadId } = await req.json();

        if (!leadId) {
            return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
        }

        if (!GROQ_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Error de Configuración: La variable GROQ_API_KEY no está definida en el servidor.'
            }, { status: 500 });
        }

        const supabase = await createClient();

        // Get the lead data
        const { data: lead, error: fetchError } = await supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (fetchError || !lead) {
            return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
        }

        // Build the AI prompt
        const sourceData = lead.source_data || {};
        const prompt = `
Analiza este negocio como potencial cliente para una agencia de diseño web:

DATOS DEL NEGOCIO:
- Nombre: ${lead.nombre}
- Dirección: ${lead.direccion || 'No disponible'}
- Rating: ${sourceData.rating || 'No disponible'} estrellas (${sourceData.reviewCount || 0} reseñas)
- Website: ${lead.sitio_web || 'NO TIENE'}
- Email: ${lead.email || sourceData.email || 'No encontrado'}
- Teléfono: ${lead.telefono || 'No encontrado'}

DATOS TÉCNICOS:
- SSL: ${sourceData.hasSSL ? 'Sí' : 'No'}
- Tech detectada: ${sourceData.techStack?.join(', ') || 'No detectada'}
- Instagram: ${sourceData.instagram || lead.instagram || 'No'}
- Facebook: ${sourceData.facebook || lead.facebook || 'No'}

Responde en JSON con esta estructura EXACTA:
{
  "score": [0-100, donde 100 = máxima oportunidad],
  "scoreBreakdown": {
    "sinWeb": [0-25 puntos si no tiene web],
    "ratingBajo": [0-20 puntos si rating < 4],
    "sinContactoDigital": [0-15 si no tiene email/whatsapp],
    "techObsoleta": [0-20 si tech vieja o no SSL],
    "sinRedesSociales": [0-10 si no tiene redes]
  },
  "vibe": "[Profesional|Amateur|Tradicional|Moderno|Startup|Corporativo]",
  "opportunity": "[Diseño Web|Rediseño|App Móvil|SEO|Reputación|Marketing Digital|Branding]",
  "analysisReport": "Análisis en español de 2-3 oraciones explicando POR QUÉ este lead es valioso",
  "salesStrategy": {
    "hook": "Gancho inicial para el primer contacto (1 oración persuasiva)",
    "painPoints": ["problema 1", "problema 2"],
    "proposedSolution": "Qué servicio específico ofrecer",
    "estimatedValue": "[Bajo|Medio|Alto|Premium]"
  },
  "competitiveAnalysis": "Breve análisis de qué está haciendo bien/mal vs su competencia",
  "recommendedChannel": "[Email|WhatsApp|Llamada|Visita]"
}`;

        // Call Groq API
        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'Eres un experto en Lead Qualification. Responde SOLO con JSON válido, sin markdown ni explicaciones adicionales.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text();
            throw new Error(`Groq API Error: ${aiResponse.status} - ${errorText}`);
        }

        const aiData = await aiResponse.json();
        const aiText = aiData.choices?.[0]?.message?.content;

        if (!aiText) {
            throw new Error('No response from AI');
        }

        // Parse the AI response
        const jsonString = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonString);

        // Update the lead in the database
        const updatedSourceData = {
            ...sourceData,
            analysis: analysis
        };

        const { error: updateError } = await supabase
            .from('leads')
            .update({
                puntaje_oportunidad: analysis.score,
                razon_ia: analysis.analysisReport,
                source_data: updatedSourceData
            })
            .eq('id', leadId);

        if (updateError) {
            throw new Error(`Database update failed: ${updateError.message}`);
        }

        return NextResponse.json({
            success: true,
            analysis: analysis,
            message: 'Lead re-analizado correctamente'
        });

    } catch (error: any) {
        console.error('Reanalyze Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
