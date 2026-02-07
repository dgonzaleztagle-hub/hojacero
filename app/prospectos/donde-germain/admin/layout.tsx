import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Germain COCINA",
    description: "Panel de Gestión y Cocina - Donde Germain",
    manifest: "/prospectos/donde-germain/manifest-admin.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Germain COCINA",
    },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
