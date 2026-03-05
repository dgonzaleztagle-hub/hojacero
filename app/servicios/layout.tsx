import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    robots: {
        index: true,
        follow: true,
    },
};

// ============================================================================
// SERVICIOS LAYOUT — Layout minimalista de conversión
// Sin navbar completa para eliminar distracciones
// Todos los CTAs apuntan a WhatsApp HojaCero: +56958946617
// ============================================================================

export default function ServiciosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Navbar Minimalista de Conversión */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-lg font-display font-bold tracking-wider text-white group-hover:text-[#00f0ff] transition-colors">
                            H0
                        </span>
                        <span className="text-xs text-zinc-500 hidden sm:block">
                            HOJACERO
                        </span>
                    </Link>
                    <a
                        href="https://wa.me/56958946617?text=Hola!%20Vi%20sus%20servicios%20y%20me%20interesa%20saber%20más"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.564l4.674-1.497A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.163 0-4.17-.593-5.897-1.625l-.422-.253-2.772.888.879-2.696-.277-.438A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                        </svg>
                        Hablemos
                    </a>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-16">{children}</main>

            {/* Footer Ligero */}
            <footer className="bg-zinc-950 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className="text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/pricing"
                                className="text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                Planes
                            </Link>
                            <Link
                                href="/about"
                                className="text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                Nosotros
                            </Link>
                            <Link
                                href="/lab"
                                className="text-zinc-500 hover:text-white text-sm transition-colors"
                            >
                                Lab
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                            <span>©{new Date().getFullYear()}</span>
                            <Link href="/" className="hover:text-[#00f0ff] transition-colors">
                                HojaCero.cl
                            </Link>
                            <span>· Architects of Digital Experiences</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Sticky WhatsApp CTA — Móvil */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 p-3">
                <a
                    href="https://wa.me/56958946617?text=Hola!%20Vi%20sus%20servicios%20y%20me%20interesa%20saber%20más"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3.5 rounded-xl w-full transition-all duration-300 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.564l4.674-1.497A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.163 0-4.17-.593-5.897-1.625l-.422-.253-2.772.888.879-2.696-.277-.438A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                    </svg>
                    Hablar por WhatsApp
                </a>
            </div>
        </>
    );
}
