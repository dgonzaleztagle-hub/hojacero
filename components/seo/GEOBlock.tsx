import Head from 'next/head';

interface GEOBlockProps {
    businessName: string;
    description: string;
    city: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    // AEO specific
    exactServices?: string[];
    faq?: { question: string; answer: string }[];
    sameAs?: string[]; // Social profiles for Entity Graph
}

export function GEOBlock({
    businessName,
    description,
    city,
    region = 'Metropolitana',
    country = 'Chile',
    latitude,
    longitude,
    exactServices = [],
    faq = [],
    sameAs = []
}: GEOBlockProps) {

    const serviceAreaSchema = {
        "@type": "Service",
        "serviceType": exactServices.join(", "),
        "areaServed": {
            "@type": "City",
            "name": city
        },
        "provider": {
            "@type": "LocalBusiness",
            "name": businessName
        }
    };

    const faqSchema = faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // Entity Graph Enhancement
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Organization",
            "name": businessName,
            "description": description,
            "sameAs": sameAs, // Link to LinkedIn, Instagram to build Authority
            "location": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": city,
                    "addressRegion": region,
                    "addressCountry": country
                },
                ...(latitude && longitude ? {
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": latitude,
                        "longitude": longitude
                    }
                } : {})
            }
        }
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {/* Service & Area Injection for Local SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }}
            />

            {/* Meta GEO Tags (Legacy but useful for some crawlers) */}
            <meta name="geo.region" content={`CL-${region.substring(0, 2).toUpperCase()}`} />
            <meta name="geo.placename" content={city} />
            {latitude && longitude && (
                <meta name="geo.position" content={`${latitude};${longitude}`} />
            )}
            {latitude && longitude && (
                <meta name="ICBM" content={`${latitude}, ${longitude}`} />
            )}
        </Head>
    );
}
