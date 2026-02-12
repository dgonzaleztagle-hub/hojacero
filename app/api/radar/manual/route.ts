import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Paletas base por rubro
const RUBRO_PALETTES: Record<string, { primary: string; secondary: string; accent: string; neutral: string }> = {
    gastronomia: { primary: '#FF6B6B', secondary: '#FFA500', accent: '#FFD700', neutral: '#2C2C2C' },
    tecnologia: { primary: '#0066CC', secondary: '#00D4FF', accent: '#6C63FF', neutral: '#1A1A1A' },
    salud: { primary: '#00C9A7', secondary: '#4ECDC4', accent: '#556FB5', neutral: '#2D3748' },
    retail: { primary: '#E63946', secondary: '#F77F00', accent: '#06FFA5', neutral: '#1F2937' },
    servicios: { primary: '#2B2D42', secondary: '#8D99AE', accent: '#EDF2F4', neutral: '#0F172A' },
    default: { primary: '#3B82F6', secondary: '#8B5CF6', accent: '#EC4899', neutral: '#1E293B' }
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const nombre = formData.get('nombre') as string;
        const sitio_web = formData.get('sitio_web') as string;
        const nombre_contacto = formData.get('nombre_contacto') as string;
        const telefono = formData.get('telefono') as string;
        const categoria = formData.get('categoria') as string;
        const lead_type = formData.get('lead_type') as string;
        const concept = formData.get('concept') as string;
        const references = formData.get('references') as string;
        const generate_logo = formData.get('generate_logo') === 'true';
        const logoFile = formData.get('logo') as File | null;

        const supabase = await createClient();

        if (!nombre) {
            return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
        }

        console.log(`📝 MANUAL LEAD [${lead_type || 'auditory'}]: Adding "${nombre}"...`);

        // Handle logo upload if provided
        let logoUrl: string | null = null;
        if (logoFile && lead_type === 'construction') {
            try {
                const fileExt = logoFile.name.split('.').pop();
                const fileName = `${Date.now()}_${nombre.toLowerCase().replace(/\s+/g, '_')}.${fileExt}`;
                const filePath = `lead-logos/${fileName}`;

                const arrayBuffer = await logoFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('client-assets')
                    .upload(filePath, buffer, {
                        contentType: logoFile.type,
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('client-assets')
                    .getPublicUrl(filePath);

                logoUrl = publicUrl;
                console.log(`✅ Logo uploaded: ${logoUrl}`);
            } catch (uploadError) {
                console.error('Logo upload failed:', uploadError);
            }
        }

        // Generate base palette based on rubro
        let basePalette = null;
        if (lead_type === 'construction') {
            const rubroKey = categoria?.toLowerCase() || 'default';
            const matchedRubro = Object.keys(RUBRO_PALETTES).find(key => rubroKey.includes(key)) || 'default';
            basePalette = RUBRO_PALETTES[matchedRubro];
        }

        // Create base lead object
        const newLead = {
            nombre,
            sitio_web: sitio_web || null,
            nombre_contacto: nombre_contacto || null,
            telefono: telefono || null,
            categoria: categoria || null,
            estado: 'ready_to_contact',
            fuente: 'manual',
            zona_busqueda: lead_type === 'construction' ? 'Proyecto Nuevo' : 'Auditoría Manual',
            source_data: {
                manual_entry: true,
                lead_type: lead_type || 'auditory',
                concept: concept || null,
                references: references || null,
                created_at: new Date().toISOString()
            },
            branding: lead_type === 'construction' ? {
                logo_url: logoUrl,
                generate_logo: generate_logo,
                palette: basePalette,
                palette_approved: false,
                palette_variations: [] // Will be populated later
            } : null
        };

        // Insert
        const { data: savedLead, error } = await supabase
            .from('leads')
            .insert(newLead)
            .select()
            .single();

        if (error) {
            throw new Error(`Database Error: ${error.message}`);
        }

        // --- ENRICHMENT LOGIC ---
        let enrichedData = {};

        // Only enrich if it's an auditory lead with a website
        if (lead_type !== 'construction' && sitio_web) {
            try {
                // Dynamic import to avoid issues if not needed
                const { scrapeContactInfo, analyzeLeadWithGroq } = require('@/utils/radar');
                const scraped = await scrapeContactInfo(sitio_web);

                // AI Analyze
                const placeMock = { title: nombre, website: sitio_web, category: categoria || 'Manual Entry' };
                const analysis = await analyzeLeadWithGroq(placeMock, scraped);

                // Update Lead
                const updatePayload = {
                    email: scraped.emails[0] || null,
                    telefono: telefono || scraped.whatsapp || null,
                    puntaje_oportunidad: analysis.score,
                    source_data: {
                        ...savedLead.source_data,
                        scraped,
                        analysis,
                        enriched_at: new Date().toISOString()
                    }
                };

                await supabase.from('leads').update(updatePayload).eq('id', savedLead.id);
                enrichedData = updatePayload;

            } catch (enrichError) {
                console.error("Manual enrichment failed:", enrichError);
            }
        }

        // TODO: If logoUrl exists, trigger async palette extraction (future implementation)
        // This would call a separate API route that uses AI Vision to extract colors

        return NextResponse.json({
            success: true,
            lead: { ...savedLead, ...enrichedData },
            message: lead_type === 'construction' ? 'Proyecto creado exitosamente' : 'Lead creado y analizado exitosamente'
        });

    } catch (error: any) {
        console.error('Manual Lead Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
