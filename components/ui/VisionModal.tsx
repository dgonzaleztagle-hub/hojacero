'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CaseStudy } from '@/app/vision/data';

interface VisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: CaseStudy | null;
}

export const VisionModal: React.FC<VisionModalProps> = ({ isOpen, onClose, project }) => {
    return (
        <AnimatePresence>
            {isOpen && project && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white text-white hover:text-black rounded-full transition-all border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col md:flex-row h-[85vh]">
                            {/* Visual Area (Scrollable) */}
                            <div className="flex-1 relative bg-black overflow-y-auto no-scrollbar">
                                {/* Section 1: The Hook (Slider) */}
                                <div className="h-[60vh] md:h-[500px] w-full sticky top-0 z-10">
                                    <BeforeAfterSlider
                                        imageBefore={project.imageBeforeHero || project.imageBefore || project.imageAfter}
                                        imageAfter={project.imageAfterHero || project.imageAfter}
                                        labelBefore="REALITY"
                                        labelAfter="VISION"
                                    />
                                    {/* Scroll Hint Overlay */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-50 animate-pulse">
                                        <span className="text-[10px] text-white uppercase tracking-widest font-mono">Explore Deep Dive</span>
                                        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent"></div>
                                    </div>
                                </div>

                                {/* Section 2: The Deep Dive (Full Image) */}
                                <div className="relative w-full min-h-screen bg-zinc-950 border-t border-white/10 z-20">
                                    <div className="p-4 md:p-8">
                                        <h3 className="text-xl font-display font-bold text-white mb-4">Full Protocol Deployed</h3>
                                        <div className="relative w-full rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                                            <img
                                                src={project.imageAfter}
                                                alt="Full scale design"
                                                className="w-full h-auto object-cover block"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="w-full md:w-80 p-8 border-l border-white/5 bg-zinc-950 flex flex-col overflow-y-auto">
                                <span className="text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">{project.type}</span>
                                <h2 className="text-3xl font-display font-bold mb-4">{project.client}</h2>
                                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                                    {project.description}
                                </p>

                                <div className="space-y-6 flex-1">
                                    {project.stats && (
                                        <div>
                                            <h4 className="text-[10px] uppercase text-zinc-600 tracking-widest mb-2">Metrics</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-bold text-white">{project.stats.improvement}</span>
                                                <span className="text-xs text-zinc-500">{project.stats.metric}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="text-[10px] uppercase text-zinc-600 tracking-widest mb-2">Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 text-[10px] border border-white/10 rounded-md text-zinc-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {project.viewUrl && project.viewUrl !== '#' && (
                                    <a
                                        href={project.viewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-8 py-3 text-center bg-white text-black font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors uppercase tracking-widest"
                                    >
                                        Visit Site
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
