import { Metadata } from 'next';
import { SalesAgentView } from '@/components/sales-agent/SalesAgentView';

export const metadata: Metadata = {
    title: 'Diagnóstico Táctico | HojaCero',
    description: 'Auditoría avanzada de infraestructura digital para negocios de alto impacto.',
};

export default function DiagnosticoPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col pt-16">
            <div className="max-w-7xl mx-auto w-full px-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            DIAGNÓSTICO <span className="text-cyan-500">TÁCTICO</span>
                        </h1>
                        <p className="text-zinc-500 text-sm mt-2 font-medium uppercase tracking-widest">
                            Auditoría de Conversión e Infraestructura Digital
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 pb-8">
                <SalesAgentView />
            </div>
        </div>
    );
}
