
'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface FactoryCtaProps {
    content: {
        title: string;
        subtitle: string;
        cta_text: string;
        whatsapp_number?: string;
    };
    primaryColor?: string;
}

export default function FactoryCta({ content, primaryColor = '#00f0ff' }: FactoryCtaProps) {
    const handleCta = () => {
        if (content.whatsapp_number) {
            window.open(`https://wa.me/${content.whatsapp_number}`, '_blank');
        }
    };

    return (
        <section className="py-24 px-6 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30" />

            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-[32px] p-12 text-center backdrop-blur-xl"
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {content.title}
                    </h2>

                    <p className="text-xl text-gray-400 mb-10">
                        {content.subtitle}
                    </p>

                    <button
                        onClick={handleCta}
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold bg-[#25D366] text-white transition-all hover:scale-105 shadow-2xl shadow-green-500/20"
                    >
                        <MessageCircle className="w-6 h-6 fill-current" />
                        {content.cta_text}
                    </button>

                    <p className="mt-8 text-sm text-gray-500 font-medium uppercase tracking-[0.2em]">
                        Tu mensaje nos llegará al instante
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
