import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    title: "Acargoo+ | Logistics Solutions",
    description: "Sistema de agendamiento y logística profesional",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Acargoo+",
    },
};

export const viewport: Viewport = {
    themeColor: "#1e3a5f",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function AcargooLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {children}
        </div>
    );
}
