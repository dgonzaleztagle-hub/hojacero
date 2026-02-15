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
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://hojacero.cl",
    title: "HojaCero | Architects of Digital Experiences",
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
    canonical: './',
  },
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
      </body>
    </html>
  );
}
