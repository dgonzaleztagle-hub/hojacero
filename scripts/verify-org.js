const OpenAI = require('openai');
const dotenv = require('dotenv');
const path = require('path');

// Cargar .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error('❌ No se encontró OPENAI_API_KEY en .env.local');
        return;
    }

    console.log('🔑 Usando Key:', apiKey.substring(0, 15) + '...');

    // Configurar el cliente. OpenAI librería v4+ usa 'new OpenAI'
    // Si la librería es vieja, esto podría fallar, pero asumimos v4
    const openai = new OpenAI({ apiKey });

    try {
        // Consultar modelos - esto suele devolver la organización en los headers
        const response = await openai.models.list();

        // En la v4 de la SDK de OpenAI, la respuesta cruda está en response.response
        // Pero a veces es directo si no se usa el wrapper. 
        // Intentaremos obtenerlo de la respuesta
        const orgId = response.headers?.get('openai-organization') || 'No detectado en headers';
        console.log('🏢 Organización Detectada (ID):', orgId);

        if (orgId === 'org-C7uVYaCbxlzaDQd3fVNx7wqo') {
            console.log('✅ COINCIDE con la organización de Tier 1 (hojacero)');
        } else if (orgId === 'org-1ECAMOfN6xAAb9hXcKsmTWwn') {
            console.log('⚠️  COINCIDE con la organización bloqueada (Personal)');
        } else {
            console.log('❓ Es una organización diferente:', orgId);
        }
    } catch (error) {
        console.log('🏢 Intentando detectar via error...');
        // Si hay error 429, el header suele venir igual
        if (error.response && error.response.headers) {
            const orgId = error.response.headers.get('openai-organization');
            console.log('🏢 Organización Detectada via Error (ID):', orgId);
        } else {
            console.error('❌ Error fatal:', error.message);
        }
    }
}

verifyKey();
