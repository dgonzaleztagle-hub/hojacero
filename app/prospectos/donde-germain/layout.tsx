import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Donde Germain | La Mafia del Sabor",
    description: "Menú Gourmet, Burger Mafia y Empanadas Brutales. Pide online ahora.",
    manifest: "/manifest.json",
    themeColor: "#000000",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Germain Pro",
    },
    icons: {
        icon: "/germain_pwa_icon.png",
        apple: "/germain_pwa_icon.png",
    }
};

export default function GermainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="germain-pro-wrapper">
            {children}
        </div>
    );
}
