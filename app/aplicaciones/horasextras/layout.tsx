import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "HorasExtras Love",
    description: "Juntos construimos nuestro futuro ❤️",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "HorasExtras",
    },
};

export const viewport: Viewport = {
    themeColor: "#D81B60",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function HorasExtrasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased touch-none overflow-hidden h-screen bg-[#FFF5F7]">
            {children}
        </div>
    );
}
