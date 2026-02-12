'use client';

import { useEffect, useRef } from 'react';

/**
 * AcargooTracker - Tracking de visitas para la app Acargoo+
 */
export function AcargooTracker() {
    const tracked = useRef(false);

    useEffect(() => {
        if (tracked.current) return;

        // PRIORIDAD: ¿Es un dispositivo registrado del equipo?
        const teamId = localStorage.getItem('h0_device_id');

        // Generar fingerprint simple
        const fingerprint = teamId || generateFingerprint();

        // Enviar tracking como prospecto "acargoo"
        fetch('/api/tracking/demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prospecto: 'acargoo',
                device_fingerprint: fingerprint,
                referrer: document.referrer || null
            })
        }).catch(err => {
            console.warn('Acargoo tracking failed:', err);
        });

        tracked.current = true;
    }, []);

    return null;
}

function generateFingerprint(): string {
    const data = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown',
    ].join('|');

    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}
