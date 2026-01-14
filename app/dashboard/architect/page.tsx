'use client';

import { useState } from 'react';
import { Sparkles, Terminal, Copy, ArrowRight, Zap, Cpu, Code, Megaphone, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../DashboardContext';

type GeneratorMode = 'DEV' | 'MARKETING';

export default function ArchitectPage() {
    const { userRole } = useDashboard();

    // ADMIN STATE
    const [mode, setMode] = useState<GeneratorMode>('DEV');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    // CLIENT WIZARD STATE
    const [wizardStep, setWizardStep] = useState(1);
    const [clientAnswers, setClientAnswers] = useState({
        identity: '',
        activity: '',
        vision: '',
        functionality: '',
        assets: '', // New Field
        soul: ''
    });
    const [clientResult, setClientResult] = useState('');

    // --- HANDLERS ---

    const handleAdminGenerate = () => {
        setIsGenerating(true);
        setGeneratedPrompt('');
        setTimeout(() => {
            if (mode === 'DEV') {
                setGeneratedPrompt(`# ARQUITECTURA SUGERIDA\n\n- Backend: Next.js API Routes (Serverless)\n- DB: Supabase (PostgreSQL) con RLS activado\n- Auth: Magic Link para onboarding sin fricción\n\n# MODELO DE DATOS\n- [Users] -> 1:N -> [Projects]\n- [Projects] -> 1:N -> [Invoices]\n\n# NEXT STEPS\n1. "npx create-next-app@latest"\n2. Configurar variables de entorno .env.local`);
            } else {
                setGeneratedPrompt(`# ESTRATEGIA DE CONTENIDOS\n\n1. ANCLAJE EMOCIONAL: "Tranquilidad Mental"\n2. COPY SUGERIDO (Instagram):\n"¿Tu contabilidad es un caos? 🤯 Deja que los expertos se ocupen. En [Nombre] ordenamos tus números para que tú ordenes tu vida."\n\n3. KEYWORDS SEO:\n- "Contador para Pymes Santiago"\n- "Asesoría Tributaria Online"`);
            }
            setIsGenerating(false);
        }, 2000);
    };

    const handleClientNext = () => {
        if (wizardStep < 7) { // Increased steps
            setWizardStep(prev => prev + 1);
        } else {
            // FINISH WIZARD
            setIsGenerating(true);
            setTimeout(() => {
                const autoPrompt = `# CLIENT BRIEF: ${clientAnswers.identity.toUpperCase()}\n\n1. IDENTIDAD: ${clientAnswers.identity}\n2. ACTIVIDAD: ${clientAnswers.activity}\n3. VISIÓN: ${clientAnswers.vision}\n4. FUNCIONALIDAD: ${clientAnswers.functionality}\n5. ASSETS: ${clientAnswers.assets}\n6. ALMA: ${clientAnswers.soul}\n\n[DETECTED VIBE]: ${clientAnswers.soul.length > 50 ? 'Complex/Deep' : 'Direct/Pragmatic'}\n[RECOMMENDED STACK]: Next.js + Tailwind (Premium UI)`;
                setClientResult(autoPrompt);
                setIsGenerating(false);
                setWizardStep(7); // Success Screen is now step 7
            }, 2000);
        }
    };

    // --- RENDER: CLIENT VIEW (The Wizard) ---
    if (userRole === 'CLIENT') {
        const isStepValid = () => {
            if (wizardStep === 1) return clientAnswers.identity.length > 3;
            if (wizardStep === 2) return clientAnswers.activity.length > 3;
            if (wizardStep === 3) return clientAnswers.vision.length > 3;
            if (wizardStep === 4) return clientAnswers.functionality.length > 3;
            if (wizardStep === 5) return clientAnswers.assets.length > 3; // Validation for assets
            if (wizardStep === 6) return clientAnswers.soul.length > 3;
            return true;
        };

        return (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-light text-white tracking-tight">Construyamos tu Visión</h1>
                    <p className="text-zinc-500 mt-2">6 preguntas para entender la esencia de tu proyecto.</p>
                </div>

                {/* Progress Bar */}
                {wizardStep < 7 && (
                    <div className="w-full bg-zinc-900 h-1 mt-4 rounded-full overflow-hidden">
                        <div
                            className="bg-cyan-500 h-full transition-all duration-500"
                            style={{ width: `${(wizardStep / 6) * 100}%` }}
                        />
                    </div>
                )}

                {/* Wizard Steps */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 min-h-[300px] flex flex-col justify-center">

                    {wizardStep === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">1. ¿De qué se trata tu marca?</h3>
                            <p className="text-sm text-zinc-500">Cuéntanos el nombre y qué te hace diferente del resto.</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.identity}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, identity: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Mi marca se llama... y somos únicos porque..."
                            />
                        </div>
                    )}

                    {wizardStep === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">2. ¿Qué haces exactamente?</h3>
                            <p className="text-sm text-zinc-500">¿Vendes productos? ¿Ofreces servicios? ¿Eres consultor? Descríbenos tu día a día.</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.activity}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, activity: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Nos dedicamos a..."
                            />
                        </div>
                    )}

                    {wizardStep === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">3. ¿Qué te gustaría encontrar en tu página?</h3>
                            <p className="text-sm text-zinc-500">Imagina que entras hoy. ¿Qué ves? ¿Qué sientes? ¿Es seria, divertida, minimalista?</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.vision}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, vision: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Me imagino un sitio que..."
                            />
                        </div>
                    )}

                    {wizardStep === 4 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">4. ¿Qué funcionalidades imaginas?</h3>
                            <p className="text-sm text-zinc-500">¿Necesitas que te agenden horas? ¿Un carrito de compras? ¿Un chat? ¿Un formulario complejo?</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.functionality}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, functionality: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Necesito sí o sí..."
                            />
                        </div>
                    )}

                    {wizardStep === 5 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">5. Material Gráfico y Estilo</h3>
                            <p className="text-sm text-zinc-500">¿Ya tienes logo? ¿Colores definidos? Pega aquí links de Pinterest, Drive o describe tu paleta.</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.assets}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, assets: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Tengo un logo en vector, mis colores son azul y dorado..."
                            />
                        </div>
                    )}

                    {wizardStep === 6 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8">
                            <h3 className="text-xl text-white font-medium">6. Describe brevemente qué piensas de tu negocio</h3>
                            <p className="text-sm text-zinc-500">¿Es tu "bebé"? ¿Es una máquina de hacer dinero? ¿Un legado familiar? (Esto nos da el alma).</p>
                            <textarea
                                autoFocus
                                value={clientAnswers.soul}
                                onChange={(e) => setClientAnswers({ ...clientAnswers, soul: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                rows={3}
                                placeholder="Para mí, este negocio es..."
                            />
                        </div>
                    )}

                    {wizardStep === 7 && (
                        <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl text-white font-light">¡Solicitud Procesada!</h3>
                                <p className="text-zinc-500 mt-2">Hemos generado la estructura técnica basada en tus respuestas.</p>
                            </div>
                            <div className="bg-black/50 rounded-xl p-4 text-left border border-white/5">
                                <p className="text-xs text-zinc-600 font-mono mb-2">RESUMEN TÉCNICO GENERADO (INTERNO):</p>
                                <pre className="text-xs text-cyan-400 font-mono whitespace-pre-wrap">
                                    {clientResult}
                                </pre>
                            </div>
                            <button
                                onClick={() => { setWizardStep(1); setClientAnswers({ identity: '', activity: '', vision: '', functionality: '', assets: '', soul: '' }); }}
                                className="text-sm text-zinc-400 hover:text-white underline"
                            >
                                Iniciar nueva consulta
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons for Wizard */}
                {wizardStep < 7 && (
                    <div className="flex justify-between">
                        <button
                            onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                            className={`text-zinc-500 hover:text-white transition-colors ${wizardStep === 1 ? 'invisible' : ''}`}
                        >
                            Atrás
                        </button>
                        <button
                            onClick={handleClientNext}
                            disabled={!isStepValid() || isGenerating}
                            className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 transition-all
                                ${isStepValid() && !isGenerating
                                    ? 'bg-white text-black hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`}
                        >
                            {isGenerating ? 'Analizando...' : wizardStep === 6 ? 'ENVIAR BRIEF' : 'Siguiente'}
                            {!isGenerating && wizardStep < 6 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDER: ADMIN VIEW (Tabbed Architect) ---
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-cyan-400" />
                        Arquitecto IA
                    </h1>
                    <p className="text-zinc-500 mt-1">Generador de Arquitectura y Estrategia.</p>
                </div>
                <div className="bg-cyan-950/30 border border-cyan-500/20 px-4 py-2 rounded-lg flex items-center gap-3">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]"></span>
                    <span className="text-xs font-mono text-cyan-400 tracking-wider">MODO: {mode} OPS</span>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setMode('DEV')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'DEV' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Code className="w-4 h-4" />
                    DEV OPS (Daniel)
                </button>
                <button
                    onClick={() => setMode('MARKETING')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'MARKETING' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-zinc-400 hover:text-white'
                        }`}
                >
                    <Megaphone className="w-4 h-4" />
                    MARKETING (Gaston)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Console */}
                <div className="space-y-6">
                    <div className={`border rounded-2xl p-6 transition-colors duration-500 ${mode === 'DEV' ? 'bg-zinc-900/50 border-cyan-500/10' : 'bg-zinc-900/50 border-purple-500/10'
                        }`}>
                        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                            <Terminal className={`w-4 h-4 ${mode === 'DEV' ? 'text-cyan-400' : 'text-purple-400'}`} />
                            {mode === 'DEV' ? 'Terminal de Comandos' : 'Parámetros de Campaña'}
                        </h3>

                        <div className="space-y-4">
                            {mode === 'DEV' ? (
                                // DEV INPUTS (Simplified - Console Style)
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Instrucción Técnica / Stack</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Describe el stack y la arquitectura deseada. Ej: 'Sistema de reservas con Next.js, caché en Redis y notificaciones por WhatsApp...'"
                                        className="w-full bg-black border border-white/10 rounded-lg p-4 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                                    />
                                    <p className="text-xs text-zinc-600 mt-2 font-mono">Use 'Generate' to compile blueprint.</p>
                                </div>
                            ) : (
                                // MARKETING INPUTS (Preserved)
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Plataforma</label>
                                            <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500">
                                                <option>Google Ads</option>
                                                <option>Meta Ads</option>
                                                <option>Email Strategy</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Objetivo</label>
                                            <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500">
                                                <option>Ventas</option>
                                                <option>Leads</option>
                                                <option>Branding</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Contexto / Prompt</label>
                                        <textarea rows={4} placeholder="Detalles de la campaña..." className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none" />
                                    </div>
                                </>
                            )}

                            <button
                                onClick={handleAdminGenerate}
                                disabled={isGenerating}
                                className={`w-full py-4 rounded-lg font-bold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2
                                    ${isGenerating
                                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                        : mode === 'DEV'
                                            ? 'bg-white text-black hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                                            : 'bg-white text-black hover:bg-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                    }`}
                            >
                                {isGenerating ? (
                                    <><Sparkles className="w-4 h-4 animate-spin" /> Procesando...</>
                                ) : (
                                    <><Zap className="w-4 h-4" /> Generar Output</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Console */}
                <div className="bg-black border border-white/10 rounded-2xl p-6 relative overflow-hidden font-mono">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-20 ${mode === 'DEV' ? 'via-cyan-500' : 'via-purple-500'
                        }`}></div>

                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-zinc-500 font-bold">SYSTEM OUTPUT</span>
                        {generatedPrompt && (
                            <button className={`text-xs flex items-center gap-1 hover:text-white transition-colors ${mode === 'DEV' ? 'text-cyan-400' : 'text-purple-400'
                                }`}>
                                <Copy className="w-3 h-3" /> Copiar
                            </button>
                        )}
                    </div>

                    <div className="h-[400px] overflow-y-auto text-sm space-y-2 scrollbar-thin scrollbar-thumb-white/20 hover:scrollbar-thumb-white/40">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-4">
                                <p className={`animate-pulse text-xs ${mode === 'DEV' ? 'text-cyan-500/50' : 'text-purple-500/50'}`}>
                                    {mode === 'DEV' ? '> COMPILING ARCHITECTURE...' : '> ANALYZING MARKET DATA...'}
                                </p>
                            </div>
                        ) : generatedPrompt ? (
                            <div className="text-zinc-300 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {generatedPrompt}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                                <Terminal className="w-12 h-12 mb-4 opacity-20" />
                                <p>Ready for input...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
