import type { Metadata } from "next";
import { Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";
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
  description: "Transformamos negocios con código de alta calidad, diseño premium y estrategias de marketing digital de alto impacto. Especialistas en Web Apps, E-commerce y SEO en Chile.",
  keywords: [
    "Agencia de Marketing Digital Chile",
    "Desarrollo Web Premium",
    "Diseño UI/UX",
    "Web Apps a medida",
    "E-commerce Chile",
    "SEO Avanzado",
    "Estrategia Digital",
    "Software Factory",
    "HojaCero",
    "Automatización de Procesos"
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

        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TZ2V9PSL');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}
