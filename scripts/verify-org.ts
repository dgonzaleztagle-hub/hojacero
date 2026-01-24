import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ No se encontró OPENAI_API_KEY en .env.local');
        return;
    }

    console.log('🔑 Usando Key:', apiKey.substring(0, 15) + '...');

    const openai = new OpenAI({ apiKey });

    try {
        // Consultar modelos para obtener el ID de la organización en los headers
        const response = await openai.models.list();
        // @ts-ignore - Accediendo a los headers de la respuesta
        const orgId = response.response.headers.get('openai-organization');
        console.log('🏢 Organización Detectada (ID):', orgId);

        if (orgId === 'org-C7uVYaCbxlzaDQd3fVNx7wqo') {
            console.log('✅ COINCIDE con la organización de Tier 1 (hojacero)');
        } else if (orgId === 'org-1ECAMOfN6xAAb9hXcKsmTWwn') {
            console.log('⚠️  COINCIDE con la organización bloqueada (Personal)');
        } else {
            console.log('❓ Es una organización diferente:', orgId);
        }
    } catch (error: any) {
        console.error('❌ Error al verificar:', error.message);
        if (error.message.includes('429')) {
            console.log('❌ Límite excedido detectado.');
        }
    }
}

verifyKey();
