import { GRID_SIZE, Item } from "./useLoveMatchGame";

export type PowerUpType = "bomb" | "super" | null;

export function useGamePowerups() {

    // Decide si un match merece un premio
    const checkPowerUpCreation = (matchSize: number): PowerUpType => {
        if (matchSize >= 5) return "super";
        if (matchSize === 4) return "bomb";
        return null;
    };

    // 1. Explosión Estándar (Al destruir el powerup en un match normal)
    const getPowerUpExplosion = (r: number, c: number, type: PowerUpType, grid: Item[][]) => {
        const targets: { r: number; c: number }[] = [];

        if (type === "bomb") {
            // Radio 3x3 normal
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nr = r + i;
                    const nc = c + j;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                        targets.push({ r: nr, c: nc });
                    }
                }
            }
        } else if (type === "super") {
            // Si explota por accidente (en cadena), limpia fila y columna
            for (let i = 0; i < GRID_SIZE; i++) {
                targets.push({ r: r, c: i });
                targets.push({ r: i, c: c });
            }
        }

        return targets;
    };

    // 2. ACTIVACIÓN DIRECTA (Swap Rayo + Color)
    const getSuperActivation = (targetColor: string, grid: Item[][]) => {
        const targets: { r: number; c: number }[] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c].color === targetColor && grid[r][c].type !== 'empty') {
                    targets.push({ r, c });
                }
            }
        }
        return targets;
    };

    // 3. COMBO DE PODERES (Swap Bomba + Bomba)
    const getMegaBlast = (r: number, c: number) => {
        // Explosión Gigante 5x5
        const targets: { r: number; c: number }[] = [];
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                const nr = r + i;
                const nc = c + j;
                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                    targets.push({ r: nr, c: nc });
                }
            }
        }
        return targets;
    };

    return {
        checkPowerUpCreation,
        getPowerUpExplosion,
        getSuperActivation,
        getMegaBlast
    };
}
