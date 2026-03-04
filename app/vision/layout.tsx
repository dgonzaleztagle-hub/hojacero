import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visión | HojaCero — Casos de Éxito y Portfolio',
    description: 'Conoce los proyectos reales que hemos construido: desde plataformas SaaS hasta sistemas de logística y fidelización digital. Portfolio completo de HojaCero.',
    alternates: {
        canonical: 'https://hojacero.cl/vision',
    },
    openGraph: {
        title: 'Visión | HojaCero — Portfolio',
        description: 'Proyectos reales de desarrollo web y software en Chile.',
        url: 'https://hojacero.cl/vision',
    },
};

export default function VisionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
