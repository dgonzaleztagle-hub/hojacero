'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                toast.error('Error al iniciar sesión: ' + error.message);
            } else {
                toast.success('¡Bienvenido a HojaCero!');
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white font-sans">
            {/* Left: Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5 bg-zinc-950">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <img src="/branding/h0-architect.png" alt="HojaCero" className="w-16 mb-8 opacity-90 invert" />
                    <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-4">
                        Architects of<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Digital Experiences</span>
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-md">
                        Plataforma de inteligencia comercial y desarrollo web de alto rendimiento.
                    </p>
                </div>

                <div className="relative z-10 text-xs font-mono text-zinc-600">
                    <p>SYSTEM_VERSION: v3.4.0</p>
                    <p>STATUS: OPERATIONAL</p>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-24 bg-black relative">
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

                <div className="w-full max-w-sm space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <img src="/branding/h0-architect.png" alt="HojaCero" className="w-12 mx-auto lg:hidden mb-6 invert" />
                        <h2 className="text-2xl font-bold tracking-tight">Iniciar Sesión</h2>
                        <p className="text-zinc-400 text-sm mt-2">
                            Ingresa tus credenciales para acceder al Dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                                placeholder="usuario@hojacero.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold text-sm py-3.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ingresar al Sistema'}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-zinc-600">
                            Acceso restringido a personal autorizado de HojaCero.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
