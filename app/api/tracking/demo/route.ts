import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Helper to get admin client (lazy init)
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}


interface DemoVisit {
    prospecto: string;
    visitor_ip: string;
    user_agent: string;
    device_fingerprint?: string;
    referrer?: string;
    city?: string;
    country?: string;
    is_team_member: boolean;
    created_at: string;
}

async function sendVisitNotification(visit: DemoVisit) {
    const prospectoName = visit.prospecto.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    try {
        await resend.emails.send({
            from: 'Demo Tracker <contacto@hojacero.cl>',
            to: ['dgonzaleztagle@gmail.com', 'Gaston.jofre1995@gmail.com'],
            subject: `👀 VISITA AL DEMO: ${prospectoName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h1 style="color: white; font-size: 24px; margin: 0;">👀 ¡Alguien está viendo el demo!</h1>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 15px 0; border: 1px solid #e5e7eb;">
                        <h2 style="color: #111; font-size: 20px; margin: 0 0 15px 0;">Demo: ${prospectoName}</h2>
                        
                        <p style="margin: 8px 0; color: #444;">
                            <strong>📍 Ubicación:</strong> ${visit.city || 'Desconocida'}, ${visit.country || 'Desconocido'}
                        </p>
                        <p style="margin: 8px 0; color: #444;">
                            <strong>⏰ Hora:</strong> ${new Date(visit.created_at).toLocaleString('es-CL')}
                        </p>
                        <p style="margin: 8px 0; color: #444;">
                            <strong>🔗 Referrer:</strong> ${visit.referrer || 'Directo'}
                        </p>
                        <p style="margin: 8px 0; color: #666; font-size: 12px;">
                            <strong>Device:</strong> ${visit.user_agent.substring(0, 100)}...
                        </p>
                    </div>

                    <div style="margin-top: 20px; text-align: center;">
                        <a href="https://hojacero.cl/prospectos/${visit.prospecto}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                            Ver Demo
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="font-size: 12px; color: #666;">
                            💡 <strong>Tip:</strong> Este es un buen momento para hacer seguimiento al prospecto
                        </p>
                    </div>
                </div>
            `
        });
        return true;
    } catch (e) {
        console.error('Error sending visit notification:', e);
        return false;
    }
}

// POST: Registrar visita a demo
export async function POST(req: NextRequest) {
    try {
        const supabase = getAdminClient();
        const body = await req.json();
        const { prospecto, device_fingerprint, referrer } = body;

        if (!prospecto) {
            return NextResponse.json({ error: 'Prospecto requerido' }, { status: 400 });
        }

        // Obtener datos del visitante
        const forwarded = req.headers.get('x-forwarded-for');
        const visitor_ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        const user_agent = req.headers.get('user-agent') || 'unknown';

        // Verificar si es miembro del equipo (Fingerprint o IP)
        // 1. Consultar tabla team_devices
        const { data: teamDevice } = await supabase
            .from('team_devices')
            .select('id')
            .eq('fingerprint', device_fingerprint || '')
            .single();

        // 2. Verificar IPs (si tuviéramos tabla de IPs)
        // const isTeamIP = TEAM_IPS.includes(visitor_ip);

        const isTeamMember = !!teamDevice; // || isTeamIP;

        // Buscar geolocalización (simple, basado en IP - en producción usar servicio como ipapi.co)
        let city = null;
        let country = null;

        try {
            const geoRes = await fetch(`https://ipapi.co/${visitor_ip}/json/`);
            if (geoRes.ok) {
                const geo = await geoRes.json();
                city = geo.city;
                country = geo.country_name;
            }
        } catch (e) {
            // Ignorar errores de geolocalización
        }

        const visit: DemoVisit = {
            prospecto,
            visitor_ip,
            user_agent,
            device_fingerprint,
            referrer,
            city,
            country,
            is_team_member: isTeamMember,
            created_at: new Date().toISOString()
        };

        // Guardar en BD
        const { error: dbError } = await supabase
            .from('demo_visits')
            .insert(visit);

        if (dbError) {
            console.error('Error saving visit:', dbError);
        }

        // Solo notificar si NO es miembro del equipo
        if (!isTeamMember) {
            await sendVisitNotification(visit);
        }

        return NextResponse.json({
            success: true,
            is_team: isTeamMember,
            message: isTeamMember ? 'Visita del equipo registrada' : 'Visita registrada y notificada'
        });

    } catch (e: any) {
        console.error('Error tracking visit:', e);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

// GET: Obtener visitas de un demo específico
export async function GET(req: NextRequest) {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const prospecto = searchParams.get('prospecto');

    let query = supabase
        .from('demo_visits')
        .select('*')
        .eq('is_team_member', false) // Solo visitas reales
        .order('created_at', { ascending: false });

    if (prospecto) {
        query = query.eq('prospecto', prospecto);
    }

    const { data, error } = await query.limit(100);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        visits: data,
        total: data?.length || 0
    });
}
