'use client';

import { useEffect, useState, useRef } from 'react';

const CHARS = '-./_[]{}*+?!';

interface TextScrambleProps {
    text: string;
    trigger: boolean;
    className?: string;
}

export default function TextScramble({ text, trigger, className = '' }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!trigger) {
            setDisplayText('');
            return;
        }

        let iteration = 0;
        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current!);
            }

            iteration += 1 / 2; // Speed control: higher denominator = slower
        }, 30); // Frame rate: lower = faster

        return () => clearInterval(intervalRef.current!);
    }, [trigger, text]);

    return (
        <span className={`font-mono ${className}`}>
            {displayText}
        </span>
    );
}
