import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subiabre Propiedades | Tu Hogar Perfecto Te Espera",
    description: "Encuentra la propiedad de tus sueños con 15 años de experiencia en el mercado inmobiliario premium de Santiago.",
    keywords: "propiedades, inmobiliaria, casas, departamentos, Santiago, venta, arriendo",
    openGraph: {
        title: "Subiabre Propiedades | Experiencia Premium",
        description: "15 años transformando sueños en hogares reales",
        type: "website",
    },
};

export default function SubiabreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
