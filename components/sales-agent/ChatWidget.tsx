'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatInterface } from './ChatInterface';

// ============================================================================
// CHAT WIDGET — MINIMAL TRIGGER
// Estilo: Círculo "HELP" con pulso sutil cyan — se funde con la estética H0
// ============================================================================

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="w-[95vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col mb-4"
                    >
                        <ChatInterface onClose={() => setIsOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimal Trigger — Circle "HELP" */}
            {!isOpen && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    animate={{
                        borderColor: [
                            'rgba(255,255,255,0.1)',
                            'rgba(0,240,255,0.35)',
                            'rgba(255,255,255,0.1)',
                        ],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    whileHover={{
                        scale: 1.08,
                        borderColor: 'rgba(0,240,255,0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full border bg-black/60 backdrop-blur-sm flex items-center justify-center group"
                    style={{ borderWidth: '1px' }}
                    aria-label="Abrir chat de ayuda"
                >
                    <motion.span
                        animate={{
                            color: [
                                'rgba(113,113,122,1)',
                                'rgba(0,240,255,0.9)',
                                'rgba(113,113,122,1)',
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="text-[9px] font-bold uppercase tracking-[0.2em]"
                    >
                        Help
                    </motion.span>
                </motion.button>
            )}
        </div>
    );
}
