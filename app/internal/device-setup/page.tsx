'use client';

import React, { useEffect, useState } from 'react';
import { registerDevice } from './actions';
import { toast } from 'sonner';

export default function DeviceSetupPage() {
    const [fingerprint, setFingerprint] = useState<string>('');
    const [owner, setOwner] = useState<string>('Daniel');
    const [deviceName, setDeviceName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        // 1. Generate or Retrieve Fingerprint
        let storedId = localStorage.getItem('h0_device_id');
        if (!storedId) {
            storedId = crypto.randomUUID();
            localStorage.setItem('h0_device_id', storedId);
        }
        setFingerprint(storedId);

        // Auto-detect potentially useful device name
        const ua = navigator.userAgent;
        let suggestedName = "PC Desconocido";
        if (ua.includes('Win')) suggestedName = "Windows PC";
        if (ua.includes('Mac')) suggestedName = "MacBook / iMac";
        if (ua.includes('iPhone')) suggestedName = "iPhone";
        if (ua.includes('Android')) suggestedName = "Android Device";

        // Check if we can improve it
        if (!deviceName) {
            setDeviceName(suggestedName);
        }

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await registerDevice({
                fingerprint,
                owner,
                deviceName
            });

            if (result.success) {
                toast.success(result.message);
                setIsRegistered(true);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
                        Team Access
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Registra este dispositivo para acceso privilegiado
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Fingerprint Display */}
                    <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-800">
                        <label className="text-xs font-mono text-neutral-500 uppercase tracking-wider block mb-2">
                            Device Fingerprint
                        </label>
                        <code className="block text-xs text-emerald-400 font-mono break-all">
                            {fingerprint || 'Generando...'}
                        </code>
                    </div>

                    {/* Owner Selection */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            ¿De quién es este dispositivo?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setOwner('Daniel')}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${owner === 'Daniel'
                                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-750'
                                    }`}
                            >
                                Daniel
                            </button>
                            <button
                                type="button"
                                onClick={() => setOwner('Gaston')}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all ${owner === 'Gaston'
                                        ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-750'
                                    }`}
                            >
                                Gastón
                            </button>
                        </div>
                    </div>

                    {/* Device Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Nombre del Dispositivo
                        </label>
                        <input
                            type="text"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="Ej: iPhone de Gastón"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registrando...' : isRegistered ? 'Actualizar Registro' : 'Registrar Dispositivo'}
                    </button>

                    {isRegistered && (
                        <div className="text-center">
                            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Dispositivo Activo
                            </span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
