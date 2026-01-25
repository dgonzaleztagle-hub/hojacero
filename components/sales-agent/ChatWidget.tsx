'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const ROBOT_GIF_PATH = "/waiting-clicky.gif";
import { ChatInterface } from './ChatInterface';

import { Bot } from 'lucide-react';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);

    // Auto-open or show notification after some time (optional)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setHasNewMessage(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isOpen]);

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

            {/* Bubble Button */}
            <div className="relative">
                <AnimatePresence>
                    {hasNewMessage && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute bottom-full right-0 mb-4 bg-zinc-900 border border-white/10 px-4 py-2 rounded-2xl whitespace-nowrap shadow-2xl"
                        >
                            <span className="text-xs font-medium text-white">¿En qué puedo ayudarte hoy? 👋</span>
                            <div className="absolute top-full right-6 w-3 h-3 bg-zinc-900 border-r border-b border-white/10 transform rotate-45 -translate-y-1.5" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setHasNewMessage(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center relative shadow-2xl transition-all overflow-hidden ${isOpen
                        ? 'bg-zinc-900 border border-white/20'
                        : 'bg-transparent'
                        }`}
                >
                    <div className="w-16 h-16 flex items-center justify-center">
                        <img
                            src={ROBOT_GIF_PATH}
                            alt="H0 Robot"
                            className="w-full h-full object-contain scale-125 mix-blend-screen"
                        />
                    </div>

                    {!isOpen && hasNewMessage && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                    )}
                </motion.button>
            </div>
        </div>
    );
}
