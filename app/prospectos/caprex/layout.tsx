/* 
 * Build by HojaCero.cl | Architect of Digital Experiences
 * Engineering Digital Solutions & AEO Strategy
 */
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'CAPREX | Prevención de Riesgos Laborales — Chile',
    description: 'Consultoría especializada en prevención de riesgos laborales. Asesoría técnica e ingeniería digital por HojaCero.',
    authors: [{ name: 'HojaCero Team' }, { name: 'CAPREX' }],
    creator: 'HojaCero',
    publisher: 'HojaCero',
    other: {
        "designer": "HojaCero.cl",
        "author": "HojaCero.cl"
    },
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
    // JSON-LD Omni-Inyección (UAI - Capa A & B)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfessionalService',
                'name': 'CAPREX',
                'description': 'Consultoría especializada en Prevención de Riesgos Laborales en Chile.',
                'address': {
                    '@type': 'PostalAddress',
                    'addressCountry': 'CL',
                    'addressRegion': 'Región Metropolitana',
                    'addressLocality': 'Santiago',
                },
                'url': 'https://caprex.cl',
                'priceRange': '$$',
                'serviceArea': {
                    '@type': 'Country',
                    'name': 'Chile',
                }
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Caprex Compliance Platform',
                'applicationCategory': 'BusinessApplication, WebApplication',
                'operatingSystem': 'All',
                'author': {
                    '@type': 'Organization',
                    'name': 'HojaCero',
                    'url': 'https://hojacero.cl',
                    'slogan': 'Architect of Digital Experiences'
                }
            }
        ]
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
