import { NextRequest, NextResponse } from 'next/server';
import { getTocTocPropertyDetail } from '../../_lib/toctoc-scraper';

/**
 * API Route: Housing Intelligence Deep Scan (Detail)
 * Activa el scraper forense para una propiedad específica al hacer click.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, lat: fallbackLat, lng: fallbackLng, ufValue = 37500 } = body;

    if (!url) {
      return NextResponse.json({ error: 'Falta la URL de la propiedad' }, { status: 400 });
    }

    console.log(`📡 [API DETAIL] Iniciando escaneo profundo para: ${url}`);
    
    // Llamar al scraper de detalle (ADN Goyanedelv)
    const detail = await getTocTocPropertyDetail(url, ufValue);

    if (!detail) {
      return NextResponse.json({ error: 'No se pudo extraer el detalle de la propiedad' }, { status: 404 });
    }

    // Coordenadas finales: prioridad detalle, fallback listado
    const finalLat = detail.lat && detail.lat !== 0 ? detail.lat : fallbackLat;
    const finalLng = detail.lng && detail.lng !== 0 ? detail.lng : fallbackLng;

    // Generar mapa estático de Mapbox si hay coordenadas
    let static_map_url = '';
    if (finalLat && finalLng) {
      const { generateMapboxStaticUrl } = await import('@/lib/mapbox-static');
      const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
      
      static_map_url = generateMapboxStaticUrl({
        center: { lat: finalLat, lng: finalLng },
        zoom: 16,
        width: 800,
        height: 600,
        markers: [{ lat: finalLat, lng: finalLng, color: 'ff0000', size: 'large' }],
        style: 'satellite-v9'
      }, MAPBOX_TOKEN);
    }

    return NextResponse.json({
      success: true,
      detail: {
        ...detail,
        static_map_url
      }
    });

  } catch (error: any) {
    console.error('❌ Error API Detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
