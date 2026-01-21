import { Playfair_Display, Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';
import { Metadata } from 'next';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

// SEO Data from Discovery Notes
export const metadata: Metadata = {
    title: 'Apimiel Chile | Miel Premium de Santa Bárbara',
    description: 'La Ciencia de la Naturaleza en cada Gota. Miel cruda y orgánica desde los bosques endémicos de Santa Bárbara, Biobío.',
    keywords: ['Miel Organica', 'Apicultura Sustentable', 'Miel Chile', 'Santa Barbara', 'Premium Honey', 'Monofloral'],
    authors: [{ name: 'Apimiel Chile' }],
    creator: 'Apimiel Chile',
    publisher: 'Apimiel Chile',
    openGraph: {
        title: 'Apimiel Chile | "Arquitectura Líquida"',
        description: 'Transformamos la venta de miel en una experiencia de viscosidad premium. Miel cruda, precisión ancestral.',
        url: 'https://apimiel.cl',
        siteName: 'Apimiel Chile',
        images: [
            {
                url: '/prospectos/apimiel/apimiel_hero_clean.png',
                width: 1920,
                height: 1080,
                alt: 'Apimiel Hero - Viscosidad Premium',
            },
        ],
        locale: 'es_CL',
        type: 'website',
    },
    icons: {
        icon: '/favicon.ico', // Assuming default favicon or add one later
    },
};

export default function ApimielLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // JSON-LD for LocalBusiness
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "Apimiel Chile",
        "description": "Venta de miel monofloral orgánica y productos derivados de la colmena.",
        "image": "https://apimiel.cl/prospectos/apimiel/apimiel_hero_clean.png",
        "telephone": "+56 9 1234 5678",
        "email": "hola@apimiel.cl",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Quillaileo",
            "addressLocality": "Santa Bárbara",
            "addressRegion": "Región del Biobío",
            "addressCountry": "CL"
        },
        "url": "https://apimiel.cl",
        "priceRange": "$$",
        "areaServed": "Chile"
    };

    return (
        <div className={`${playfair.variable} ${inter.variable} font-sans bg-[#1A1A1A] text-[#FDF5E6] antialiased selection:bg-[#D4AF37] selection:text-[#1A1A1A]`}>
            {/* Kill Switch - Sistema de Retención HojaCero */}
            <script dangerouslySetInnerHTML={{
                __html: `
                (async function() {
                const SITE_ID = '2f494d0e-55e3-4ba0-9e5a-167529eaa8ce';
                const API = 'https://vcxfdihsyehomqfdzzjf.supabase.co/rest/v1/site_status';
                try {
                    const res = await fetch(API + '?id=eq.' + SITE_ID + '&select=is_active', {
                    headers: { 'apikey': 'sb_publishable_Qz1iRV_N9JWqjUBmQkQgVA_iwNSLGDu' }
                    });
                    const data = await res.json();
                    if (data[0] && !data[0].is_active) {
                    document.body.innerHTML = '<div style="display:flex;height:100vh;align-items:center;justify-content:center;background:#111;color:#fff;font-family:system-ui;text-align:center;padding:2rem;"><div><h1>🔧 Sitio en Mantenimiento</h1><p>Estamos realizando mejoras. Vuelve pronto.</p></div></div>';
                    }
                } catch (e) { /* fail-safe */ }
                })();
            `}} />

            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />
            <div className="relative z-10">
                {children}
            </div>
            <Footer />
        </div>
    );
}
