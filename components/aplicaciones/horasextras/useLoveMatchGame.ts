import { useState, useCallback, useEffect } from "react";
import { Heart, Star, Cloud, Moon, Flower, Zap, Bomb } from "lucide-react";
import { useGameFX } from "./useGameFX";
import { useGamePowerups, PowerUpType } from "./useGamePowerups";

// --- CONFIGURATION ---
export const GRID_SIZE = 7;
export const TARGET_SCORE = 2000;

export const ITEM_TYPES = [
    { type: "heart", icon: Heart, color: "#FF6B6B" },
    { type: "star", icon: Star, color: "#FFD93D" },
    { type: "cloud", icon: Cloud, color: "#6BCB77" },
    { type: "moon", icon: Moon, color: "#4D96FF" },
    { type: "flower", icon: Flower, color: "#F06292" },
];

export type Item = {
    id: string;
    type: string;
    color: string;
    icon: any;
    powerUp?: PowerUpType;
};

// --- LOGIC HOOK ---
export function useLoveMatchGame() {
    const [grid, setGrid] = useState<Item[][]>([]);
    const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(20);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    // MODULES
    const { particles, comboText, shouldShake, spawnExplosion, triggerCombo } = useGameFX();
    const { checkPowerUpCreation, getPowerUpExplosion, getSuperActivation, getMegaBlast } = useGamePowerups();

    const initGrid = useCallback(() => {
        const newGrid: Item[][] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            newGrid[r] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                const itemConfig = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
                newGrid[r][c] = { ...itemConfig, id: `${r}-${c}-${Math.random()}` };
            }
        }
        setGrid(newGrid);
        setScore(0);
        setMoves(20);
        setGameOver(false);
        setGameWon(false);

        setTimeout(() => processGrid(newGrid), 500);
    }, []);

    // Standard Match Check
    const checkMatches = (currentGrid: Item[][]) => {
        const toRemove = new Set<string>();

        // Horizontal
        for (let r = 0; r < GRID_SIZE; r++) {
            let matchCount = 1;
            for (let c = 0; c < GRID_SIZE; c++) {
                if (c < GRID_SIZE - 1 && currentGrid[r][c].type !== "empty" && currentGrid[r][c].type === currentGrid[r][c + 1].type) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        for (let i = 0; i < matchCount; i++) toRemove.add(`${r},${c - i}`);
                    }
                    matchCount = 1;
                }
            }
        }

        // Vertical
        for (let c = 0; c < GRID_SIZE; c++) {
            let matchCount = 1;
            for (let r = 0; r < GRID_SIZE; r++) {
                if (r < GRID_SIZE - 1 && currentGrid[r][c].type !== "empty" && currentGrid[r][c].type === currentGrid[r + 1][c].type) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        for (let i = 0; i < matchCount; i++) toRemove.add(`${r - i},${c}`);
                    }
                    matchCount = 1;
                }
            }
        }
        return Array.from(toRemove).map(coord => {
            const [r, c] = coord.split(",").map(Number);
            return { r, c };
        });
    };

    // --- SPECIAL MOVE EXECUTION ---
    // If user triggers a manual special move (Switching two bombs, or Super+Color)
    const executeSpecialMove = async (gridInput: Item[][], specialMatches: { r: number, c: number }[]) => {
        setIsProcessing(true);
        setMoves(prev => prev - 1);
        setSelected(null);

        let currentGrid = [...gridInput.map(row => [...row])];

        // Execute the immediate blast
        setScore(prev => prev + (specialMatches.length * 20));
        triggerCombo();

        specialMatches.forEach(m => {
            spawnExplosion(m.r, m.c, currentGrid[m.r][m.c].color);
            currentGrid[m.r][m.c] = { ...currentGrid[m.r][m.c], type: "empty", powerUp: undefined };
        });

        // Update View (Pop)
        setGrid(currentGrid.map(row => [...row]));
        await new Promise(r => setTimeout(r, 300));

        // Gravity
        await applyGravity(currentGrid);

        // Continue normal chain reaction
        await processGrid(currentGrid, false); // false = don't reset processing...

        setIsProcessing(false); // <--- FIX: UNLOCK THE GAME
    };


    // Base Game Engine
    const processGrid = async (passedGrid?: Item[][], isExternalCall = true) => {
        if (isExternalCall) setIsProcessing(true);
        let currentGrid = [...(passedGrid || grid).map(row => [...row])];
        let hasMoreMatches = true;
        let chain = 0;

        while (hasMoreMatches) {
            let matches = checkMatches(currentGrid);

            // Chain Reaction Blasts
            let newBlastArea: { r: number, c: number }[] = [];
            matches.forEach(m => {
                const item = currentGrid[m.r][m.c];
                if (item.powerUp) {
                    const targets = getPowerUpExplosion(m.r, m.c, item.powerUp, currentGrid);
                    newBlastArea.push(...targets);
                }
            });
            if (newBlastArea.length > 0) {
                newBlastArea.forEach(target => {
                    if (!matches.some(m => m.r === target.r && m.c === target.c)) matches.push(target);
                });
                triggerCombo();
            }

            if (matches.length === 0) break;
            chain++;

            // Power Creation Logic
            const powerUpType = checkPowerUpCreation(matches.length);
            let powerUpSpawnedCoords: { r: number, c: number } | null = null;
            let sourceItemProps: any = null;

            if (powerUpType) {
                powerUpSpawnedCoords = matches[0];
                const source = currentGrid[powerUpSpawnedCoords.r][powerUpSpawnedCoords.c];
                if (source && source.type !== 'empty') {
                    sourceItemProps = { ...source };
                }
            }

            if (chain > 1 || matches.length > 3) triggerCombo();
            setScore(prev => prev + (matches.length * 10 * chain));

            matches.forEach(m => spawnExplosion(m.r, m.c, currentGrid[m.r][m.c].color));
            matches.forEach(({ r, c }) => {
                currentGrid[r][c] = { ...currentGrid[r][c], type: "empty", powerUp: undefined };
            });

            if (powerUpSpawnedCoords && powerUpType && sourceItemProps) {
                const { r, c } = powerUpSpawnedCoords;
                const isSuper = powerUpType === 'super';
                currentGrid[r][c] = {
                    ...sourceItemProps,
                    id: `powerup-${Date.now()}`,
                    type: isSuper ? 'super-item' : sourceItemProps.type,
                    color: isSuper ? 'rainbow' : sourceItemProps.color,
                    powerUp: powerUpType
                };
            }

            setGrid(currentGrid.map(row => [...row]));
            await new Promise(r => setTimeout(r, 200));

            await applyGravity(currentGrid);
        }

        if (isExternalCall) setIsProcessing(false);
    };

    // Separated Gravity for reuse
    const applyGravity = async (currentGrid: Item[][]) => {
        for (let c = 0; c < GRID_SIZE; c++) {
            let emptySpaces = 0;
            for (let r = GRID_SIZE - 1; r >= 0; r--) {
                if (currentGrid[r][c].type === "empty") {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    currentGrid[r + emptySpaces][c] = currentGrid[r][c];
                    currentGrid[r][c] = { ...currentGrid[r][c], type: "empty" };
                }
            }
            for (let r = 0; r < emptySpaces; r++) {
                const itemConfig = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
                currentGrid[r][c] = { ...itemConfig, id: `new-${Date.now()}-${r}-${c}` };
            }
        }
        setGrid([...currentGrid]);
        await new Promise(resolve => setTimeout(resolve, 350));
    };


    const handleItemClick = (r: number, c: number) => {
        if (isProcessing || gameOver) return;

        if (!selected) {
            setSelected({ r, c });
        } else {
            const isAdjacent =
                (Math.abs(selected.r - r) === 1 && selected.c === c) ||
                (Math.abs(selected.c - c) === 1 && selected.r === r);

            if (isAdjacent) {
                const newGrid = [...grid.map(row => [...row])];
                const item1 = newGrid[selected.r][selected.c];
                const item2 = newGrid[r][c];

                // Swap in Memory
                newGrid[r][c] = item1;
                newGrid[selected.r][selected.c] = item2;

                // --- SPECIAL INTERACTION CHECK ---
                // 1. Double Bomb (Bomb + Bomb)
                if (item1.powerUp === 'bomb' && item2.powerUp === 'bomb') {
                    const targets = getMegaBlast(r, c);
                    targets.push({ r, c }, { r: selected.r, c: selected.c });
                    setGrid(newGrid);
                    executeSpecialMove(newGrid, targets);
                    return;
                }

                // 2. Super Item Interaction
                const superItem = item1.powerUp === 'super' ? item1 : (item2.powerUp === 'super' ? item2 : null);
                const otherItem = item1.powerUp === 'super' ? item2 : item1;

                if (superItem) {
                    if (otherItem.powerUp === 'super') {
                        // Super + Super = Wipe Board 
                        const allItems = [];
                        for (let i = 0; i < GRID_SIZE; i++) for (let j = 0; j < GRID_SIZE; j++) allItems.push({ r: i, c: j });
                        setGrid(newGrid);
                        executeSpecialMove(newGrid, allItems);
                        return;
                    }

                    if (otherItem.type !== 'empty') {
                        const targets = getSuperActivation(otherItem.color, newGrid);
                        targets.push({ r, c }, { r: selected.r, c: selected.c });
                        setGrid(newGrid);
                        executeSpecialMove(newGrid, targets);
                        return;
                    }
                }

                // --- NORMAL MATCH LOGIC ---
                const matches = checkMatches(newGrid);
                if (matches.length > 0) {
                    setGrid(newGrid);
                    setMoves(prev => prev - 1);
                    setSelected(null);
                    setTimeout(() => processGrid(newGrid), 100);
                } else {
                    setSelected(null); // Invalid move, simple reset
                }
            } else {
                setSelected({ r, c });
            }
        }
    };

    useEffect(() => {
        if (moves <= 0 && !isProcessing) {
            if (score >= TARGET_SCORE) setGameWon(true);
            setGameOver(true);
        }
    }, [moves, isProcessing, score]);

    return {
        grid,
        selected,
        score,
        moves,
        gameOver,
        gameWon,
        comboText,
        particles,
        shouldShake,
        initGrid,
        handleItemClick
    };
}
