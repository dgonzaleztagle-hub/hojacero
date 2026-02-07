'use client';

import { ScrollReveal } from './shared/ScrollReveal';
import { motion } from 'framer-motion';
import { Rocket, Mail, ExternalLink } from 'lucide-react';

export function CTASection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full text-center">
                <ScrollReveal>
                    {/* Rocket Icon */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="inline-flex p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full backdrop-blur-sm">
                            <Rocket className="w-16 h-16 text-green-400" />
                        </div>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-white"
                    >
                        ¿Listo para cocinar
                        <br />
                        el éxito?
                    </motion.h2>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-xl text-zinc-400 mb-4"
                    >
                        Este reporte validó tu idea. Ahora construyamos tu marca.
                    </motion.p>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-zinc-500 mb-12 max-w-2xl mx-auto"
                    >
                        Cotiza con nosotros creación de logo, sitio web y tu imagen de marketing digital.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <motion.a
                            href="mailto:contacto@hojacero.cl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full font-semibold text-white overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Contactar Ahora
                            </span>
                        </motion.a>

                        <motion.a
                            href="https://hojacero.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                            <span className="flex items-center gap-2">
                                Visitar HojaCero
                                <ExternalLink className="w-4 h-4" />
                            </span>
                        </motion.a>
                    </motion.div>

                    {/* Branding */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-20 pt-12 border-t border-white/10"
                    >
                        <p className="text-2xl font-bold text-white mb-2">HOJACERO INTELLIGENCE</p>
                        <p className="text-sm text-zinc-500 italic">Datos que construyen negocios</p>
                    </motion.div>
                </ScrollReveal>
            </div>
        </section>
    );
}
