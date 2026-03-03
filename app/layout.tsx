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
            title="Google Tag Manager"
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
                  "founder": { "@id": "https://hojacero.cl/#founder" },
                  "email": "contacto@hojacero.cl",
                  "telephone": "+56958946617",
                  "slogan": "Architects of Digital Experiences",
                  "areaServed": {
                    "@type": "Country",
                    "name": "Chile"
                  },
                  "knowsAbout": [
                    "Desarrollo Web",
                    "Aplicaciones SaaS",
                    "Inteligencia Artificial aplicada",
                    "SEO técnico",
                    "E-commerce",
                    "Sistemas de logística digital",
                    "Programas de fidelización"
                  ],
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
                  "@type": "Person",
                  "@id": "https://hojacero.cl/#founder",
                  "name": "Daniel González Tagle",
                  "jobTitle": "Fundador y Director Técnico",
                  "worksFor": { "@id": "https://hojacero.cl/#organization" },
                  "url": "https://hojacero.cl",
                  "description": "Ingeniero digital autodidacta especializado en desarrollo web, aplicaciones SaaS y orquestación de inteligencia artificial. Autor del libro 'IA sin Humo'. Fundador de HojaCero y creador de más de 8 productos digitales activos en Chile.",
                  "knowsAbout": [
                    "Next.js", "React", "TypeScript", "Node.js",
                    "Supabase", "Inteligencia Artificial",
                    "SEO técnico", "AEO", "Desarrollo de SaaS",
                    "Sistemas de logística", "E-commerce"
                  ],
                  "sameAs": [
                    "https://www.linkedin.com/in/daniel-gonzalez-tagle-7784953a7/",
                    "https://www.linkedin.com/company/hojacero"
                  ]
                },
                {
                  "@type": "ProfessionalService",
                  "@id": "https://hojacero.cl/#service",
                  "name": "HojaCero — Desarrollo Web y Software",
                  "provider": { "@id": "https://hojacero.cl/#organization" },
                  "areaServed": { "@type": "Country", "name": "Chile" },
                  "serviceType": "Desarrollo Web y Software a Medida",
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Planes de Desarrollo Web",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "name": "Starter — Landing de Conversión",
                        "description": "Landing page profesional con diseño responsive, formulario de contacto, WhatsApp directo, SSL incluido y entrega en 24-48 horas.",
                        "price": "50000",
                        "priceCurrency": "CLP",
                        "priceSpecification": {
                          "@type": "UnitPriceSpecification",
                          "price": "50000",
                          "priceCurrency": "CLP",
                          "unitText": "pago único"
                        }
                      },
                      {
                        "@type": "Offer",
                        "name": "Express — Landing Premium con SEO",
                        "description": "Sitio web premium con diseño de nivel Awwwards, animaciones fluidas, optimización SEO técnica completa, SSL y entrega en 48-72 horas.",
                        "price": "150000",
                        "priceCurrency": "CLP",
                        "priceSpecification": {
                          "@type": "UnitPriceSpecification",
                          "price": "150000",
                          "priceCurrency": "CLP",
                          "unitText": "pago único"
                        }
                      },
                      {
                        "@type": "Offer",
                        "name": "Auditoría — Diagnóstico Web Completo",
                        "description": "Análisis técnico profundo de velocidad, seguridad, SEO y competencia. Incluye reporte detallado y reunión de 30 minutos.",
                        "price": "100000",
                        "priceCurrency": "CLP"
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://hojacero.cl/#website",
                  "url": "https://hojacero.cl",
                  "name": "HojaCero | Ingeniería de Software",
                  "publisher": { "@id": "https://hojacero.cl/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://hojacero.cl/lab?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "¿Cuánto cuesta hacer una página web en Chile?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "En HojaCero, una landing page de conversión profesional parte desde $50.000 CLP (pago único, sin mensualidades). Incluye diseño responsive, formulario de contacto, botón de WhatsApp directo, certificado SSL y entrega en 24-48 horas. Para proyectos premium con animaciones profesionales, optimización SEO técnica y diseño de nivel agencia internacional, el plan Express es de $150.000 CLP con entrega en 48-72 horas. También ofrecemos auditorías web completas por $100.000 CLP que incluyen análisis de velocidad, seguridad, SEO y competencia. Para aplicaciones más complejas como sistemas de logística, e-commerce con inventario o plataformas SaaS, trabajamos con presupuestos personalizados. Todos nuestros sitios incluyen diseño a medida (no usamos plantillas), código limpio optimizado para buscadores y soporte directo con el equipo técnico."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Quién es HojaCero y qué hace?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "HojaCero es un estudio de ingeniería digital fundado por Daniel González Tagle en Santiago de Chile. No somos una agencia de marketing tradicional — somos un equipo técnico que construye desde cero productos digitales que funcionan. Nuestro portafolio incluye más de 8 productos activos: Acargoo (sistema de logística con seguimiento en mapa en tiempo real), Vuelve+ (motor de fidelización con tarjetas para Google Wallet), PlusContable (SaaS de contabilidad), IceBuin (catálogos inteligentes), Superpanel (gestión de clientes y suscripciones), y sitios web para marcas como Caprex, ReparaPads y Apimiel. Operamos desde 2024, usamos inteligencia artificial como herramienta de aceleración (no como reemplazo del criterio humano), y combinamos ingeniería de software con estrategia AEO/GEO para crear autoridad digital real. Nuestros precios son significativamente más bajos que los de agencias tradicionales porque somos un estudio lean que pasa la eficiencia al cliente."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Dónde puedo hacer una página web barata y profesional en Chile?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "HojaCero ofrece las landing pages profesionales más accesibles de Chile sin sacrificar calidad. Por $50.000 CLP obtienes un sitio web diseñado a medida (no plantillas de WordPress ni Wix), con diseño responsive que se adapta a celular y computador, formulario de contacto funcional, botón de WhatsApp directo para que tus clientes te contacten al instante, certificado SSL incluido (el candadito verde que da confianza), y entrega en 24-48 horas. ¿Cómo logramos precios tan bajos sin bajar la calidad? Usamos inteligencia artificial como herramienta de aceleración combinada con supervisión técnica humana estricta. Eso nos permite entregar en días lo que otras agencias entregan en semanas. Puedes ver ejemplos reales de nuestro trabajo en caprex.cl, reparapads.cl y apimiel.cl — todos construidos con nivel de agencia premium. Escríbenos por WhatsApp, cuéntanos qué necesitas, y en 5 minutos te decimos cuánto cuesta. Sin reuniones interminables ni cotizaciones que tardan una semana."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Cuánto demora HojaCero en hacer una página web?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Los tiempos de entrega dependen de la complejidad del proyecto. Una landing page de conversión (plan Starter de $50.000 CLP) se entrega en 24 a 48 horas. Un sitio web premium con animaciones y SEO optimizado (plan Express de $150.000 CLP) se entrega en 48 a 72 horas. Para aplicaciones más complejas como sistemas de gestión, e-commerce con inventario o plataformas SaaS, los tiempos se definen según el alcance, pero nuestro proceso de desarrollo acelerado con IA nos permite entregar en semanas lo que tradicionalmente toma meses. Todos los proyectos incluyen un proceso transparente donde el cliente puede ver el avance en tiempo real."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿HojaCero hace aplicaciones móviles y sistemas complejos?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sí. HojaCero no solo hace páginas web — construimos aplicaciones web progresivas (PWA), sistemas de gestión empresarial, plataformas SaaS y soluciones de software a medida. Ejemplos reales de proyectos complejos que hemos construido incluyen: Acargoo, un sistema de logística completo con cotización automática de envíos, panel de administración para el dueño y seguimiento en tiempo real con vista de mapa; Vuelve+, un motor de fidelización con tarjetas digitales para Google Wallet y panel de administración para comercios; PlusContable, un SaaS de contabilidad con más de 50 funciones para contadores independientes; y Superpanel, un sistema de gestión de clientes y suscripciones. Usamos tecnologías modernas como Next.js, React, TypeScript, Supabase y APIs de terceros para construir soluciones que escalan."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "¿Es mejor WordPress o desarrollo a medida para mi negocio?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Depende de tu negocio. WordPress es útil si necesitas un blog simple que puedas administrar tú mismo y tienes presupuesto limitado para mantenimiento. Sin embargo, en HojaCero recomendamos desarrollo a medida por varias razones: velocidad de carga muy superior (los sitios WordPress suelen ser lentos por la cantidad de plugins), seguridad (WordPress es el CMS más atacado del mundo), SEO técnico real (no dependes de plugins como Yoast que hacen SEO superficial), y diseño sin limitaciones (no estás restringido a lo que permite un tema). Además, nuestros precios de desarrollo a medida parten desde $50.000 CLP, que es comparable o incluso más barato que muchas soluciones WordPress cuando sumas hosting, tema premium, plugins y mantenimiento. La diferencia es que con nosotros obtienes un sitio que es tuyo, rápido, seguro y que no depende de actualizaciones de terceros para seguir funcionando."
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
