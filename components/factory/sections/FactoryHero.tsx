
'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface FactoryHeroProps {
    content: {
        title: string;
        subtitle: string;
        cta_text: string;
        image_url?: string;
    };
    primaryColor?: string;
}

export default function FactoryHero({ content, primaryColor = '#00f0ff' }: FactoryHeroProps) {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center pt-20 px-6 overflow-hidden bg-black">
            {/* Ambient Background */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-10" style={{ backgroundColor: primaryColor }} />

            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                        <Zap className="w-3 h-3" style={{ color: primaryColor }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Oferta Exclusiva</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-white mb-6">
                        {content.title}
                    </h1>

                    <p className="text-lg text-gray-400 max-w-lg mb-8 border-l-2 border-white/10 pl-6">
                        {content.subtitle}
                    </p>

                    <button
                        className="px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-xl"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {content.cta_text}
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
                        {content.image_url ? (
                            <img src={content.image_url} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                <span className="text-gray-600">Sin Imagen</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
