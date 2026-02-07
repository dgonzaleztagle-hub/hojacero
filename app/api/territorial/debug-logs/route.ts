import { NextResponse } from 'next/server';

/**
 * Endpoint de debug para ver logs del último análisis
 * GET /api/territorial/debug-logs
 */
export async function GET() {
    return NextResponse.json({
        message: "Revisa la consola del servidor (terminal donde corre npm run dev) para ver los logs detallados",
        instructions: [
            "1. Haz un nuevo análisis territorial",
            "2. Busca en la terminal estos emojis: 🗺️ 📊 📍 🌍 📮 ✅",
            "3. Los logs mostrarán exactamente qué está pasando con la geocodificación"
        ]
    });
}
