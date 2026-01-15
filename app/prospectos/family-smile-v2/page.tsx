'use client'

import { motion } from 'framer-motion'
import { BentoGrid, BentoGridItem } from '@/components/premium/BentoGrid'
import { InfiniteMovingCards } from '@/components/premium/InfiniteMovingCards'
import { Phone, Mail, MapPin, Clock, Instagram, Calendar } from 'lucide-react'

export default function FamilySmileV2() {
    const dentalServices = [
        {
            name: 'Urgencia Dental',
            price: '$10.000',
            description: 'Atención inmediata para emergencias dentales',
            duration: '1 hora'
        },
        {
            name: 'Periodoncia',
            price: '$15.000',
            description: 'Tratamiento especializado de las encías',
            duration: '1 hora'
        },
        {
            name: 'Endodoncia',
            price: '$15.000',
            description: 'Tratamiento de conductos radiculares',
            duration: '1 hora'
        },
        {
            name: 'Ortodoncia',
            price: '$15.000',
            description: 'Brackets y frenillos para alineación dental',
            duration: '1 hora'
        },
        {
            name: 'Blanqueamiento Dental',
            price: '$100.000',
            description: 'Sonrisa más brillante y radiante',
            duration: '1 hora'
        },
        {
            name: 'Limpieza Preventiva',
            price: '$60.000',
            description: 'Profilaxis dental completa',
            duration: '1 hora'
        },
        {
            name: 'Implantes Dentales',
            price: '$700.000',
            description: 'Solución permanente para dientes perdidos',
            duration: '1 hora'
        },
        {
            name: 'Tapadura en Resina',
            price: 'Desde $20.000',
            description: 'Restauraciones estéticas de alta calidad',
            duration: '1 hora'
        }
    ]

    const aestheticServices = [
        {
            name: 'Botox',
            price: 'Desde $100.000',
            description: 'Tratamiento para arrugas por zonas'
        },
        {
            name: 'Ácido Hialurónico Labios',
            price: '$250.000',
            description: 'Volumen y definición natural'
        },
        {
            name: 'Exosomas',
            price: '$250.000',
            description: 'Rejuvenecimiento facial avanzado'
        },
        {
            name: 'Endolifting Láser',
            price: 'Desde $800.000',
            description: 'Lifting facial sin cirugía'
        },
        {
            name: 'Lipopapada Láser',
            price: '$600',
            description: 'Eliminación de grasa sin cirugía'
        },
        {
            name: 'Peeling Hollywood',
            price: '$600',
            description: 'Renovación profunda de la piel'
        }
    ]

    const testimonials = [
        {
            quote: "Excelente atención y profesionalismo. El Dr. Quiroga es un especialista de primer nivel.",
            name: "María González",
            title: "Paciente"
        },
        {
            quote: "Tratamiento de periodoncia impecable. Recuperé la salud de mis encías completamente.",
            name: "Carlos Ramírez",
            title: "Paciente"
        },
        {
            quote: "Los tratamientos estéticos son increíbles. Me veo 10 años más joven.",
            name: "Patricia Silva",
            title: "Paciente"
        }
    ]

    return (
        <div className="min-h-screen bg-white">

            {/* HERO - Clean, Trustworthy */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,200,240,0.1),rgba(255,255,255,0))]" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                FAMILY SMILE
                            </span>
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-light text-gray-800 mb-8">
                            Dental Clinic by Dr. Juan Carlos Quiroga
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 font-light"
                    >
                        Odontología Familiar | Medicina Estética | Las Condes
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <a
                            href="https://www.familysmiledentalclinic.com/book-online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                        >
                            <span className="relative z-10">Reservar Hora</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>

                        <a
                            href="tel:+56988159895"
                            className="px-8 py-4 border-2 border-cyan-600 text-cyan-600 rounded-full text-lg font-medium hover:bg-cyan-50 transition-all duration-300 flex items-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Urgencias: +56 9 8815 9895
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-8 text-gray-500 flex items-center justify-center gap-2"
                    >
                        <MapPin className="w-4 h-4" />
                        Augusto Leguía Sur 79, Las Condes
                    </motion.p>
                </div>
            </section>

            {/* SERVICIOS DENTALES */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Servicios <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Dentales</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Odontología integral para toda la familia con tecnología de vanguardia
                        </p>
                    </motion.div>

                    <BentoGrid className="max-w-7xl mx-auto">
                        {dentalServices.slice(0, 6).map((service, idx) => (
                            <BentoGridItem
                                key={idx}
                                title={service.name}
                                description={service.description}
                                header={
                                    <div className="h-32 w-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-cyan-600">{service.price}</div>
                                            <div className="text-sm text-gray-500 mt-1">{service.duration} consulta</div>
                                        </div>
                                    </div>
                                }
                                className="md:col-span-1"
                            />
                        ))}
                    </BentoGrid>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <a
                            href="https://www.familysmiledentalclinic.com/book-online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors"
                        >
                            <Calendar className="w-5 h-5" />
                            Ver Todos los Servicios Dentales
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* MEDICINA ESTÉTICA */}
            <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Medicina <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Estética</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tratamientos faciales avanzados con tecnología láser de última generación
                        </p>
                    </motion.div>

                    <BentoGrid className="max-w-7xl mx-auto">
                        {aestheticServices.map((service, idx) => (
                            <BentoGridItem
                                key={idx}
                                title={service.name}
                                description={service.description}
                                header={
                                    <div className="h-32 w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                                        <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                                    </div>
                                }
                                className="md:col-span-1"
                            />
                        ))}
                    </BentoGrid>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <a
                            href="https://www.familysmiledentalclinic.com/servicios-de-medicina-est%C3%A9tica"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Ver Tratamientos Estéticos Completos
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* DR. QUIROGA */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-8">
                            Dr. Juan Carlos Quiroga
                        </h2>
                        <p className="text-xl text-gray-600 mb-6">
                            Odontólogo Especialista en Periodoncia y Medicina Estética
                        </p>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                            Dedicado al cuidado integral de la salud bucal y estética facial de nuestros pacientes,
                            combinando experiencia profesional con tecnología de vanguardia.
                        </p>
                        <a
                            href="https://www.instagram.com/familysmilecl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors"
                        >
                            <Instagram className="w-6 h-6" />
                            <span className="font-medium">@familysmilecl</span>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* TESTIMONIOS */}
            <section className="py-24 px-6 bg-gradient-to-br from-cyan-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold text-gray-900 mb-6">
                            Lo Que Dicen Nuestros Pacientes
                        </h2>
                    </motion.div>

                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="slow"
                    />
                </div>
            </section>

            {/* CONTACTO */}
            <section className="py-24 px-6 bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-12">
                        Agenda Tu Cita
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <motion.a
                            href="tel:+56988159895"
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all"
                        >
                            <Phone className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                            <p className="text-cyan-100">+56 9 8815 9895</p>
                        </motion.a>

                        <motion.a
                            href="mailto:familysmiledentalclinic11@gmail.com"
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all"
                        >
                            <Mail className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Email</h3>
                            <p className="text-cyan-100 text-sm">familysmiledentalclinic11@gmail.com</p>
                        </motion.a>

                        <motion.a
                            href="https://maps.google.com/?q=Augusto+Leguía+Sur+79+Las+Condes"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all"
                        >
                            <MapPin className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
                            <p className="text-cyan-100">Augusto Leguía Sur 79<br />Las Condes, Santiago</p>
                        </motion.a>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <a
                            href="https://www.familysmiledentalclinic.com/book-online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-12 py-5 bg-white text-cyan-600 rounded-full text-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            Reservar Hora Online
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-lg mb-4">Family Smile Dental Clinic</p>
                    <p className="text-sm">
                        © 2024 Family Smile Dental Clinic. Todos los derechos reservados.
                    </p>
                    <p className="text-xs mt-4">
                        Demo generado por HojaCero Factory
                    </p>
                </div>
            </footer>

        </div>
    )
}
