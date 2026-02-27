/* 
 * Build by HojaCero.cl | Architect of Digital Experiences
 * Engineering Digital Solutions & AEO Strategy
 */
import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import { MagneticCursorDot } from '@/components/premium/MagneticCursor';
import { GrainTexture } from '@/components/premium/GrainTexture';
import { DemoTracker } from '@/components/tracking/DemoTracker';
import '@/app/globals.css';

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-orbitron',
    display: 'swap',
});

const rajdhani = Rajdhani({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-rajdhani',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'REPARAPADS | Batería Viva',
    description: 'Servicio técnico especializado en baterías electrónicas. La Florida, Santiago. Ingeniería digital por HojaCero.',
    authors: [{ name: "HojaCero Team" }],
    creator: "HojaCero",
    publisher: "HojaCero",
    other: {
        "designer": "HojaCero.cl",
        "author": "HojaCero.cl"
    }
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // JSON-LD Omni-Inyección (UAI - Capa A & B)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LocalBusiness",
                "name": "REPARAPADS",
                "description": "Servicio técnico especializado en baterías electrónicas en La Florida, Santiago.",
                "url": "https://reparapads.cl",
                "telephone": "+56958274826",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "La Florida",
                    "addressRegion": "Metropolitana",
                    "addressCountry": "CL"
                }
            },
            {
                "@type": "SoftwareApplication",
                "name": "ReparPads Digital Hub",
                "applicationCategory": "BusinessApplication, WebApplication",
                "operatingSystem": "All",
                "author": {
                    "@type": "Organization",
                    "name": "HojaCero",
                    "url": "https://hojacero.cl",
                    "slogan": "Architect of Digital Experiences"
                }
            }
        ]
    };

    return (
        <div className={`${orbitron.variable} ${rajdhani.variable} bg-[#050505] text-[#ECFEFF] selection:bg-[#10B981] selection:text-black min-h-screen`}>
            {/* UAI Authority Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Global Effects */}
            <MagneticCursorDot />
            <GrainTexture opacity={0.07} animated={true} />
            <DemoTracker />

            {/* Main Content */}
            <main className="relative min-h-screen font-rajdhani overflow-x-hidden">
                {children}
            </main>

            {/* Floating WhatsApp (HUD Style) */}
            <a
                href="https://wa.me/56958274826?text=Hola%20Reparpads,%20necesito%20cotizar%20una%20reparación"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 group"
            >
                <div className="absolute inset-0 bg-[#10B981] rounded-full blur-[10px] opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                <div className="relative bg-[#050505] border border-[#10B981] text-[#10B981] w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#10B981] hover:text-black transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                </div>
            </a>
        </div>
    );
}
