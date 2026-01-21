export const getAnalysis = (lead: any) => {
    const raw = lead.analysis || lead.source_data?.analysis || {};
    if (raw.painPoints && !raw.salesStrategy) {
        return {
            salesStrategy: {
                painPoints: Array.isArray(raw.painPoints) ? raw.painPoints : [raw.painPoints || 'Sin dolor detectado'],
                hook: raw.vibe ? `Abordaje ${raw.vibe}` : 'Consultoría Digital',
                proposedSolution: raw.suggestedSolution || 'Pendiente',
                estimatedValue: raw.estimatedValue || 'Por Definir'
            },
            scoreBreakdown: raw.scoreBreakdown || {},
            recommendedChannel: 'Email',
            competitiveAnalysis: raw.vibe || 'Análisis pendiente'
        };
    }
    return raw;
};

export const getLeadData = (lead: any, location = 'Santiago, Chile') => {
    const sourceData = lead.source_data || {};
    return {
        title: lead.title || lead.nombre || 'Sin nombre',
        address: lead.address || lead.direccion || '',
        phone: lead.telefono || lead.phoneNumber || sourceData.telefono || '',
        email: lead.emails?.[0] || lead.email || sourceData.emails?.[0] || sourceData.email || null,
        whatsapp: lead.whatsapp || sourceData.whatsapp || null,
        instagram: lead.instagram || sourceData.instagram || null,
        facebook: lead.facebook || sourceData.facebook || null,
        website: lead.website || lead.sitio_web || sourceData.sitio_web || null,
        rating: lead.rating || sourceData.rating || null,
        techStack: lead.techStack || sourceData.techStack || [],
        hasSSL: lead.hasSSL ?? sourceData.scraped?.hasSSL ?? sourceData.hasSSL ?? true,
        analysis: lead.analysis || sourceData.analysis || {},
        zona: lead.zona_busqueda || location,
        nota: lead.nota_revision || '',
        revisadoPor: lead.revisado_por || null,
        demo_url: lead.demo_url || sourceData.demo_url || '',
    };
};
