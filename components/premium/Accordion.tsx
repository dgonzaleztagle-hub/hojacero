'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

export const AccordionItem = ({ question, answer, isOpen, onClick }: AccordionItemProps) => {
    return (
        <div className={cn(
            "border-b border-slate-100 transition-colors duration-300",
            isOpen ? "border-blue-500/30" : "hover:border-slate-200"
        )}>
            <button
                onClick={onClick}
                className="w-full py-6 flex justify-between items-center text-left group focus:outline-none"
            >
                <span className={cn(
                    "text-lg font-bold transition-colors duration-300",
                    isOpen ? "text-blue-700" : "text-slate-800 group-hover:text-blue-600"
                )}>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        isOpen ? "bg-blue-50 text-blue-600" : "text-slate-300 group-hover:text-blue-500"
                    )}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="overflow-hidden"
                    >
                        <p className="text-slate-500 leading-relaxed text-sm pb-6 pr-4">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Accordion = ({ items }: { items: { question: string; answer: string }[] }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // First one open by default

    const handleClick = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="space-y-1">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                    isOpen={activeIndex === index}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
};
