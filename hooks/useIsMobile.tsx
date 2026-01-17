'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si estamos en mobile
 * Útil para renderizar componentes diferentes según dispositivo
 * 
 * Uso:
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileHero /> : <DesktopHero />;
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Check inicial
        checkMobile();

        // Listener para resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}

/**
 * Hook para detectar si el dispositivo tiene touch
 * Útil para desactivar efectos hover-only
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch(
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0
        );
    }, []);

    return isTouch;
}

/**
 * Hook combinado para decisiones de UX
 */
export function useDeviceContext() {
    const isMobile = useIsMobile();
    const isTouch = useIsTouchDevice();

    return {
        isMobile,
        isTouch,
        isDesktop: !isMobile,
        // Para efectos que requieren hover
        supportsHover: !isTouch,
        // Breakpoint actual aproximado
        breakpoint: isMobile ? 'mobile' : 'desktop',
    };
}

/**
 * Componente wrapper para renderizado condicional
 * 
 * Uso:
 * <DeviceSwitch
 *   mobile={<MobileHero />}
 *   desktop={<DesktopHero />}
 * />
 */
export function DeviceSwitch({
    mobile,
    desktop,
    breakpoint = 768,
}: {
    mobile: React.ReactNode;
    desktop: React.ReactNode;
    breakpoint?: number;
}) {
    const isMobile = useIsMobile(breakpoint);

    // SSR: por defecto desktop, luego hidrata
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Durante SSR, renderizar desktop (más común para SEO)
        return <>{ desktop } </>;
    }

    return <>{ isMobile? mobile: desktop } </>;
}

export default useIsMobile;
