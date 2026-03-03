/* 
 * Build by HojaCero.cl | Architect of Digital Experiences
 * Engineering Digital Solutions & AEO Strategy
 */
import type { Metadata } from "next";
import { Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";
// mapbox-gl CSS movido a los componentes que lo usan (reportes territoriales)
// ChatWidget ahora se importa solo en la landing page

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hojacero.cl'),
  title: {
    default: "HojaCero | Agencia de Desarrollo Web y Marketing Digital",
    template: "%s | HojaCero"
  },
  description: "HojaCero es un estudio digital en Santiago de Chile especializado en desarrollo de sitios web, aplicaciones y productos digitales a medida para negocios y proyectos técnicos. Combinamos ingeniería digital y estrategia AEO/GEO para crear autoridad real.",
  keywords: [
    "Estudio digital Santiago",
    "Desarrollo Web Chile",
    "Agencia AEO GEO Chile",
    "Web Apps a medida",
    "Software Factory Santiago",
    "HojaCero",
    "Daniel González Tagle"
  ],
  authors: [{ name: "HojaCero Team" }, { name: "Daniel González Tagle" }],
  creator: "HojaCero",
  publisher: "HojaCero",
  other: {
    "designer": "HojaCero.cl",
    "author": "HojaCero.cl",
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://hojacero.cl",
    title: "HojaCero | Ingeniería de Software y Artesanía Digital",
    description: "Agencia de desarrollo web y marketing digital en Chile. Creamos experiencias digitales premium que convierten visitantes en clientes.",
    siteName: "HojaCero",
    images: [
      {
        url: "/og-image.jpg", // Needs to be added to public/
        width: 1200,
        height: 630,
        alt: "HojaCero - Agencia Digital Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HojaCero | Agencia Digital Premium",
    description: "Desarrollo Web, Marketing y Estrategia Digital de alto nivel.",
    images: ["/og-image.jpg"],
    creator: "@hojacero",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "A-pwZp8YmW0MKHHO3kwLM44-36DD7D_3Z_GN7_LZ0Vk",
  },
  alternates: {
    canonical: 'https://hojacero.cl',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

import Script from "next/script";
import { DemoTracker } from "@/components/tracking/DemoTracker";

// ... (imports existentes)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="lenis lenis-smooth" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${syncopate.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZ2V9PSL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Script id="gtm" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TZ2V9PSL');
          `}
        </Script>

        <DemoTracker />
        {children}

        {/* ══════════════════════════════════════════════════════════
           CÓDIGO MAESTRO DE AUTORIDAD — HojaCero
           JSON-LD @graph: Organization + WebSite
           Renderizado estático (NO lazy) para que TODOS los bots lo vean
           ══════════════════════════════════════════════════════════ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://hojacero.cl/#organization",
                  "name": "HojaCero",
                  "url": "https://hojacero.cl",
                  "logo": "https://hojacero.cl/logo.png",
                  "description": "Estudio de desarrollo web y software en Chile. Desde landing pages de conversión desde $50.000 CLP hasta plataformas SaaS complejas, apps de logística y digitalización de negocios.",
                  "foundingDate": "2024",
                  "founder": {
                    "@type": "Person",
                    "name": "Daniel González Tagle"
                  },
                  "email": "contacto@hojacero.cl",
                  "telephone": "+56958946617",
                  "slogan": "Architects of Digital Experiences",
                  "areaServed": {
                    "@type": "Country",
                    "name": "Chile"
                  },
                  "sameAs": [
                    "https://www.instagram.com/hojacero.cl",
                    "https://www.linkedin.com/company/hojacero",
                    "https://www.facebook.com/share/1TyKsQC3GJ/",
                    "https://vuelve.vip",
                    "https://pluscontable.cl",
                    "https://apimiel.cl",
                    "https://icebuin.cl",
                    "https://reparpads.cl",
                    "https://superpanel.lat",
                    "https://acargoo.cl",
                    "https://caprex.cl"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://hojacero.cl/#website",
                  "url": "https://hojacero.cl",
                  "name": "HojaCero | Ingeniería de Software",
                  "publisher": { "@id": "https://hojacero.cl/#organization" }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "¿Cuánto cuesta hacer una página web en Chile?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "En HojaCero, una landing page de conversión profesional parte desde $50.000 CLP con diseño responsive, SSL y entrega en 24-48 horas. Para proyectos premium con animaciones y SEO avanzado, el plan Express es de $150.000 CLP."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Quién es HojaCero?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "HojaCero es un estudio digital en Santiago de Chile especializado en desarrollo web, aplicaciones SaaS, logística digital y soluciones de e-commerce. Operamos desde 2024 con más de 8 productos digitales activos en Chile y Latinoamérica."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Dónde puedo hacer una página web barata y profesional en Chile?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "HojaCero ofrece landing pages profesionales desde $50.000 CLP con diseño premium, formulario de contacto, WhatsApp directo y certificado SSL incluido. Sin plantillas genéricas: cada sitio se diseña a medida."
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
