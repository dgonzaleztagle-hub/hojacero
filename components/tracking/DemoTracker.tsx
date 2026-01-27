'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * DemoTracker - Componente invisible que trackea visitas a demos
 * 
 * Uso: Agregar en el layout o page de prospectos
 * <DemoTracker />
 */
export function DemoTracker() {
    const pathname = usePathname();
    const tracked = useRef(false);

    useEffect(() => {
        // Solo trackear una vez por sesión
        if (tracked.current) return;

        // Solo trackear páginas de prospectos
        if (!pathname.startsWith('/prospectos/')) return;

        // Extraer nombre del prospecto de la URL
        const prospecto = pathname.split('/prospectos/')[1]?.split('/')[0];
        if (!prospecto) return;

        // PRIORIDAD: ¿Es un dispositivo registrado del equipo?
        // Usamos el mismo ID que genera /internal/device-setup
        const teamId = localStorage.getItem('h0_device_id');

        // Si no es equipo, generamos fingerprint simple
        const fingerprint = teamId || generateFingerprint();

        // Enviar tracking
        fetch('/api/tracking/demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prospecto,
                device_fingerprint: fingerprint,
                referrer: document.referrer || null
            })
        }).catch(err => {
            console.warn('Demo tracking failed:', err);
        });

        tracked.current = true;
    }, [pathname]);

    return null; // Componente invisible
}

/**
 * Genera un fingerprint simple del dispositivo
 * No usa cookies, solo características del navegador
 */
function generateFingerprint(): string {
    const data = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 'unknown',
        // @ts-ignore
        navigator.deviceMemory || 'unknown'
    ].join('|');

    // Hash simple
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

/**
 * Hook para marcar dispositivo como del equipo
 * Llamar una vez desde el dashboard para excluir de métricas
 */
export function useMarkAsTeamDevice() {
    return () => {
        const fingerprint = generateFingerprint();
        localStorage.setItem('hojacero_team_device', fingerprint);

        // También enviar al servidor para registrar
        fetch('/api/tracking/team-device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fingerprint })
        });

        console.log('✅ Dispositivo marcado como del equipo:', fingerprint);
        return fingerprint;
    };
}
