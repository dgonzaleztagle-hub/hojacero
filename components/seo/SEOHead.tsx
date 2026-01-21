import Head from 'next/head';

interface SEOHeadProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    // Props de Negocio
    businessName?: string;
    address?: string;
    phone?: string;
    priceRange?: string; // "$", "$$", "$$$"
    industry?: 'Restaurant' | 'LegalService' | 'MedicalBusiness' | 'LocalBusiness' | 'AutomotiveBusiness' | 'Store';
    openingHours?: string;
}

export function SEOHead({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    businessName,
    address,
    phone,
    priceRange = '$$',
    industry = 'LocalBusiness',
    openingHours,
}: SEOHeadProps) {

    // JSON-LD dinámico según industria
    const jsonLd = businessName ? {
        "@context": "https://schema.org",
        "@type": industry,
        "name": businessName,
        "description": description,
        "image": image,
        "address": address,
        "telephone": phone,
        "priceRange": priceRange,
        "openingHours": openingHours,
        "areaServed": {
            "@type": "Country",
            "name": "Chile"
        },
        "currenciesAccepted": "CLP",
        "paymentAccepted": "Cash, Credit Card, Redcompra"
    } : null;

    return (
        <>
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:locale" content="es_CL" />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* JSON-LD */}
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </>
    );
}
