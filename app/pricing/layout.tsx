import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "Precios | HojaCero — Desarrollo Web en Chile",
    description: "Planes transparentes desde $50.000 CLP. Landing de conversión, sitio premium con SEO, auditoría web y desarrollo a medida. Sin letra chica.",
    alternates: { canonical: "https://hojacero.cl/pricing" },
    openGraph: { title: "Precios — HojaCero", description: "Planes transparentes desde $50.000 CLP.", url: "https://hojacero.cl/pricing", type: "website", locale: "es_CL", siteName: "HojaCero" },
};
export default function PricingLayout({ children }: { children: React.ReactNode }) { return children; }
