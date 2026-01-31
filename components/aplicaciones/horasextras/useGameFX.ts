import { useState, useCallback } from "react";

export type Particle = {
    id: string;
    x: number;
    y: number;
    color: string;
};

export const COMBO_MESSAGES = ["¡Lindo!", "¡Increíble!", "¡Wow!", "❤️", "✨", "🔥"];

export function useGameFX() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [comboText, setComboText] = useState("");
    const [shouldShake, setShouldShake] = useState(false);

    // Genera una explosión de múltiples fragmentos en una coordenada
    const spawnExplosion = useCallback((r: number, c: number, color: string) => {
        // SHATTER LOGIC: 6 to 10 particles per gem
        const particleCount = 6 + Math.floor(Math.random() * 5);
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: Math.random().toString(36).substr(2, 9),
                x: c, // Logic coordinates
                y: r,
                color: color
            });
        }

        setParticles(prev => [...prev, ...newParticles]);

        // Auto-cleanup particles logic
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.includes(p)));
        }, 1000);
    }, []);

    const triggerCombo = useCallback(() => {
        // 70% chance to show text (Less frequent as requested)
        if (Math.random() > 0.3) {
            const msg = COMBO_MESSAGES[Math.floor(Math.random() * COMBO_MESSAGES.length)];
            setComboText(msg);
        }

        // Shake ALWAYS happens because it feels good physically
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 300);

        // Hide text safety timeout
        setTimeout(() => setComboText(""), 1200);
    }, []);

    return {
        particles,
        comboText,
        shouldShake,
        spawnExplosion,
        triggerCombo
    };
}
