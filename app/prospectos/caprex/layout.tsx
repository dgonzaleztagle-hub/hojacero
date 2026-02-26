import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'CAPREX | Prevención de Riesgos Laborales — Chile',
    description: 'Consultoría especializada en prevención de riesgos laborales. Asesoría en DS44, Ley Karin, auditorías, capacitaciones e IPER para empresas en Chile. La experta con nombre y respaldo técnico.',
    keywords: [
        'Prevención de Riesgos Chile',
        'Consultora Prevención Riesgos',
        'Ley Karin 21643',
        'DS44 Decreto Supremo 44',
        'Ley 16744',
        'IPER',
        'Auditoría Seguridad Laboral',
        'Riesgos Psicosociales',
        'Capacitación Seguridad Laboral',
        'CAPREX',
    ],
    authors: [{ name: 'CAPREX' }],
    openGraph: {
        title: 'CAPREX | Prevención de Riesgos Laborales',
        description: 'Consultoría boutique de prevención de riesgos. Rigor técnico, trato personal. DS44, Ley Karin, IPER y más.',
        type: 'website',
    },
};

export default function CaprexLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'CAPREX',
        description: 'Consultoría especializada en Prevención de Riesgos Laborales en Chile.',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'CL',
            addressRegion: 'Región Metropolitana',
            addressLocality: 'Santiago',
        },
        url: 'https://caprex.cl',
        priceRange: '$$',
        serviceArea: {
            '@type': 'Country',
            name: 'Chile',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios de Prevención de Riesgos',
            itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoría Externa DS44' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diagnóstico IPER' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Protocolo Ley Karin' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Auditorías de Seguridad' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Capacitación Especializada' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Gestión Riesgos Psicosociales' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Planes y Programas de Prevención' } },
            ],
        },
    };

    return (
        <>
            <Script
                id="caprex-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
