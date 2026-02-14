export const getAnalysis = (lead: any) => {
    const raw = lead.analysis || lead.source_data?.analysis || {};
    const fallbackStrategy = {
        painPoints: [] as string[],
        hook: raw.vibe ? `Abordaje ${raw.vibe}` : 'Consultoría Digital',
        proposedSolution: raw.suggestedSolution || 'Pendiente',
        estimatedValue: raw.estimatedValue || 'Por Definir'
    };

    const salesStrategy = raw.salesStrategy || (raw.painPoints ? {
        painPoints: Array.isArray(raw.painPoints) ? raw.painPoints : [raw.painPoints || 'Sin dolor detectado'],
        hook: fallbackStrategy.hook,
        proposedSolution: fallbackStrategy.proposedSolution,
        estimatedValue: fallbackStrategy.estimatedValue
    } : fallbackStrategy);

    return {
        ...raw,
        salesStrategy,
        scoreBreakdown: normalizeScoreBreakdown(raw.scoreBreakdown || {}),
        recommendedChannel: raw.recommendedChannel || 'Email',
        competitiveAnalysis: raw.competitiveAnalysis || raw.vibe || 'Análisis pendiente'
    };
};

export const normalizeScoreBreakdown = (breakdown: Record<string, unknown>) => {
    const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
    return {
        webScore: n(breakdown.webScore ?? breakdown.sinWeb),
        reviewsScore: n(breakdown.reviewsScore ?? breakdown.ratingBajo),
        contactScore: n(breakdown.contactScore ?? breakdown.sinContactoDigital),
        techScore: n(breakdown.techScore ?? breakdown.techObsoleta),
        socialScore: n(breakdown.socialScore ?? breakdown.sinRedesSociales)
    };
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
