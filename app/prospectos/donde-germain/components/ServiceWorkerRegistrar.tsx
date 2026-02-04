'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/prospectos/donde-germain' })
                .then((registration) => {
                    console.log('✅ Service Worker registrado:', registration.scope);
                })
                .catch((error) => {
                    console.error('❌ Error registrando Service Worker:', error);
                });
        }
    }, []);

    return null;
}
