"use client";

import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, User, Phone, Mail, MessageCircle } from "lucide-react";
import type { BookingData } from "@/app/aplicaciones/acargoo/page";

interface BookingConfirmationProps {
    bookingData: BookingData;
    onNewBooking: () => void;
}

export default function BookingConfirmation({
    bookingData,
    onNewBooking,
}: BookingConfirmationProps) {
    const whatsappMessage = `Hola! Acabo de agendar un servicio de ${bookingData.service?.name} para el ${bookingData.date} a las ${bookingData.time}. Mi nombre es ${bookingData.contact?.name}.`;
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="mb-8"
            >
                <div className="relative">
                    <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={2} />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
                    ></motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-3">
                    ¡Reserva Confirmada!
                </h2>
                <p className="text-slate-600 text-lg">
                    Tu servicio ha sido agendado exitosamente
                </p>
            </motion.div>

            {/* Resumen */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200 mb-8"
            >
                <h3 className="text-xl font-bold text-[#1e3a5f] mb-6">Resumen del servicio</h3>

                <div className="space-y-4">
                    {/* Servicio */}
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Servicio</p>
                            <p className="font-semibold text-[#1e3a5f]">{bookingData.service?.name}</p>
                        </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff9900] to-[#ff7700] flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Fecha y hora</p>
                            <p className="font-semibold text-[#1e3a5f]">
                                {new Date(bookingData.date!).toLocaleDateString("es-CL", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                a las {bookingData.time}
                            </p>
                        </div>
                    </div>

                    {/* Direcciones */}
                    <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-1">Origen</p>
                            <p className="font-medium text-slate-700 mb-3">{bookingData.pickup}</p>
                            <p className="text-sm text-slate-500 mb-1">Destino</p>
                            <p className="font-medium text-slate-700">{bookingData.delivery}</p>
                        </div>
                    </div>

                    {/* Descripción */}
                    {bookingData.description && (
                        <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff9900] to-[#ff7700] flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Descripción</p>
                                <p className="font-medium text-slate-700">{bookingData.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Contacto */}
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Contacto</p>
                            <p className="font-semibold text-[#1e3a5f]">{bookingData.contact?.name}</p>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4" />
                                {bookingData.contact?.phone}
                            </p>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {bookingData.contact?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-2xl space-y-4"
            >
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                    <MessageCircle className="w-6 h-6" />
                    Confirmar por WhatsApp
                </a>

                <button
                    onClick={onNewBooking}
                    className="w-full py-4 bg-white border-2 border-[#1e3a5f] text-[#1e3a5f] rounded-xl font-semibold text-lg hover:bg-[#1e3a5f] hover:text-white transition-all duration-300"
                >
                    Agendar otro servicio
                </button>
            </motion.div>

            {/* Info */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-slate-500 mt-8 text-center max-w-2xl"
            >
                Recibirás un correo de confirmación en {bookingData.contact?.email} con todos los detalles de tu servicio.
            </motion.p>
        </div>
    );
}
