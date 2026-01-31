import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'Biocrom | Soluciones Integrales en Cromatografía & Óptica',
    description: 'Elevando el estándar del análisis científico en Chile. Especialistas en cromatografía líquida (HPLC), gaseosa (GC) y microscopía óptica desde 2014. Distribuidor oficial DataApex.',
    keywords: ['Cromatografía Chile', 'HPLC', 'GC', 'DataApex Clarity', 'Microscopía Óptica', 'Validación IQ OQ PQ', 'Laboratorio Analítico', 'Biocrom EIRL', 'Patricio Puentes'],
    authors: [{ name: 'Biocrom EIRL' }],
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
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Biocrom EIRL',
        image: 'https://hojacero.cl/prospectos/biocrom/hero.png',
        description: 'Soluciones integrales para laboratorios de Cromatografía y Óptica.',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'CL',
            addressRegion: 'Región Metropolitana',
            addressLocality: 'Santiago'
        },
        telephone: '+56 9 5006 9920',
        url: 'https://biocrom.cl',
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00'
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
