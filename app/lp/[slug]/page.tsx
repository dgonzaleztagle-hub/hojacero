
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import SectionRenderer from '@/components/factory/SectionRenderer';
import { LandingConfig } from '@/types/factory';

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function PublicLandingPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch from Database
    const { data: landing, error } = await supabase
        .from('h0_landings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !landing) {
        // For now, if DB is not ready, we show a mock if it's a test slug
        if (slug.startsWith('demo-')) {
            return <LandingPreviewMock slug={slug} />;
        }
        notFound();
    }

    const config = landing.config as any;

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {config.map((section: any) => (
                <SectionRenderer
                    key={section.id}
                    section={section}
                    primaryColor={landing.primary_color || '#00f0ff'}
                />
            ))}

            <footer className="py-12 bg-black text-center border-t border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-700">
                    Desarrollado por <span className="text-gray-500">HojaCero.cl</span>
                </p>
            </footer>
        </main>
    );
}

function LandingPreviewMock({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8 text-center">
            <div className="max-w-md p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-3xl">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">⚡</span>
                </div>
                <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Ads-Factory Demo</h1>
                <p className="text-gray-500 mb-8 border-l border-white/10 pl-4 text-justify">
                    Esta es una vista previa de la ruta <code className="text-cyan-500 font-mono">/lp/{slug}</code>.
                    Corre el script SQL para habilitar persistencia real.
                </p>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl mb-6">
                    <p className="text-xs text-cyan-400 font-bold mb-1 uppercase tracking-wider">Misión Crítica</p>
                    <p className="text-[10px] text-cyan-300">El sistema está listo para recibir configuraciones.</p>
                </div>
            </div>
        </div>
    );
}
