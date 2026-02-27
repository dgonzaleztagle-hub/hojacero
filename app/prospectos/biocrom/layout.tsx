/* 
 * Build by HojaCero.cl | Architect of Digital Experiences
 * Engineering Digital Solutions & AEO Strategy
 */
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Biocrom | Soluciones Integrales en Cromatografía & Óptica',
    description: 'Elevando el estándar del análisis científico en Chile. Especialistas en cromatografía líquida (HPLC), gaseosa (GC) y microscopía óptica. Ingeniería digital por HojaCero.',
    authors: [{ name: 'HojaCero Team' }, { name: 'Biocrom EIRL' }],
    creator: 'HojaCero',
    publisher: 'HojaCero',
    other: {
        "designer": "HojaCero.cl",
        "author": "HojaCero.cl"
    },
    openGraph: {
        title: 'Biocrom | Precisión Analítica',
        description: 'Soluciones integrales para laboratorios de alta complejidad. Representantes oficiales de DataApex y Kromasil en Chile.',
        images: ['/prospectos/biocrom/hero.png'],
        type: 'website',
    },
};

export default function BiocromLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // JSON-LD Omni-Inyección (UAI - Capa A & B)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LocalBusiness',
                'name': 'Biocrom EIRL',
                'image': 'https://hojacero.cl/prospectos/biocrom/hero.png',
                'description': 'Soluciones integrales para laboratorios de Cromatografía y Óptica en Santiago, Chile.',
                'address': {
                    '@type': 'PostalAddress',
                    'addressCountry': 'CL',
                    'addressRegion': 'Región Metropolitana',
                    'addressLocality': 'Santiago'
                },
                'telephone': '+56 9 5006 9920',
                'url': 'https://biocrom.cl',
                'openingHoursSpecification': [
                    {
                        '@type': 'OpeningHoursSpecification',
                        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        'opens': '09:00',
                        'closes': '18:00'
                    }
                ]
            },
            {
                '@type': 'SoftwareApplication',
                'name': 'Biocrom Analytical Platform',
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
                id="biocrom-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
