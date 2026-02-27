/* 
 * Build by HojaCero.cl | Architect of Digital Experiences
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '360 Sports | High Performance Evolution',
    description: 'Propuesta de Rediseño Premium para 360 Sports. Ingeniería digital por HojaCero.',
    authors: [{ name: 'HojaCero Team' }],
    creator: 'HojaCero',
    publisher: 'HojaCero',
    other: {
        "designer": "HojaCero.cl",
        "author": "HojaCero.cl"
    }
};

export default function LeadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "360 Sports Performance Platform",
        "applicationCategory": "BusinessApplication, WebApplication",
        "operatingSystem": "All",
        "author": {
            "@type": "Organization",
            "name": "HojaCero",
            "url": "https://hojacero.cl",
            "slogan": "Architect of Digital Experiences"
        }
    };

    return (
        <div className={`${inter.className} bg-black text-white selection:bg-[#ccff00] selection:text-black antialiased`}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </div>
    );
}
