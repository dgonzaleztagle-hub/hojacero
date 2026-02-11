import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

export default function DesignLabPage() {
    const experiments = [
        {
            id: "burning-leaf",
            title: "Burning Leaf Reveal",
            description: "Organic reveal animation using SVG masking filters.",
            status: "Ready",
        },
        {
            id: "cinematic-stagger",
            title: "Cinematic Stagger",
            description: "Orchestrated list entrances using framer-motion variants.",
            status: "Basic",
        },
        {
            id: "renaissance",
            title: "Renaissance Deep Scroll",
            description: "WebGL Shader atmosphere + immersive layering.",
            status: "Verified",
        },
        {
            id: "golden-master",
            title: "Golden Master",
            description: "Full orchestration: WebGL, Parallax Bento, Magnetic UI.",
            status: "Ready",
        },
        {
            id: "burning-paper",
            title: "True Burning Paper",
            description: "WebGL Shader Dissolve with fire edges.",
            status: "Ready",
        },
        {
            id: "magnetic-ui",
            title: "Magnetic UI Button",
            description: "Elements that physically attract to the cursor.",
            status: "Verified",
        },
        {
            id: "editorial-reveal",
            title: "Editorial Mask Reveal",
            description: "High-end typography reveal using clipping masks.",
            status: "Verified",
        },
        {
            id: "h0_store",
            title: "H0 Store Engine",
            description: "Infinite attributes white-label e-commerce core + Nebula Vibe.",
            status: "Ready",
        },
        // Future experiments will go here
    ];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
            <header className="mb-12 border-b border-neutral-800 pb-8">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                    <FlaskConical className="w-8 h-8" />
                    <h1 className="text-3xl font-bold tracking-tight">HojaCero Design Lab</h1>
                </div>
                <p className="text-neutral-400 max-w-2xl text-lg">
                    Nuestro gimnasio visual. Un espacio aislado para entrenar el "Hojo",
                    prototipar efectos premium y validar la "Física del Lujo" antes de pasar a producción.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiments.map((exp) => (
                    <Link
                        key={exp.id}
                        href={`/design-lab/${exp.id}`}
                        className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 hover:border-emerald-500/50 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${exp.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {exp.status}
                                </span>
                                <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                            </div>

                            <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                                {exp.title}
                            </h2>
                            <p className="text-neutral-400 text-sm">
                                {exp.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
