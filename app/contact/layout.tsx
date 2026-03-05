import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Contacto | HojaCero — Hablemos de tu Proyecto",
    description: "Escríbenos por WhatsApp y te respondemos en minutos. Santiago, Chile. Disponibles L-V 9:00-19:00.",
    alternates: { canonical: "https://hojacero.cl/contact" },
    openGraph: { title: "Contacto — HojaCero", description: "Escríbenos por WhatsApp.", url: "https://hojacero.cl/contact", type: "website", locale: "es_CL", siteName: "HojaCero" },
};
export default function ContactLayout({ children }: { children: React.ReactNode }) { return children; }
