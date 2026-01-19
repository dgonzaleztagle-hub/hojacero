import type { Metadata } from "next";
import { Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";

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
};

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
        {children}
      </body>
    </html>
  );
}
