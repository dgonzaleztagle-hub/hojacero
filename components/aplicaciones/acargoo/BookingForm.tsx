"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, User, Phone, Mail, FileText } from "lucide-react";
import type { BookingData } from "@/app/aplicaciones/acargoo/page";

interface BookingFormProps {
    bookingData: BookingData;
    onSubmit: (data: Partial<BookingData>) => void;
    onBack: () => void;
}

export default function BookingForm({ bookingData, onSubmit, onBack }: BookingFormProps) {
    const [formData, setFormData] = useState({
        pickup: "",
        delivery: "",
        description: "",
        name: "",
        phone: "",
        email: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Limpiar error al escribir
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.pickup.trim()) newErrors.pickup = "Dirección de origen requerida";
        if (!formData.delivery.trim()) newErrors.delivery = "Dirección de destino requerida";
        if (!formData.name.trim()) newErrors.name = "Nombre requerido";
        if (!formData.phone.trim()) newErrors.phone = "Teléfono requerido";
        if (!formData.email.trim()) {
            newErrors.email = "Email requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                pickup: formData.pickup,
                delivery: formData.delivery,
                description: formData.description,
                contact: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                },
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Header */}
            <div className="w-full max-w-3xl mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#1e3a5f] transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Cambiar fecha
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-2">
                    Detalles del servicio
                </h2>
                <p className="text-slate-600">
                    {bookingData.service?.name} • {bookingData.date} a las {bookingData.time}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                {/* Direcciones */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Direcciones
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Dirección de origen *
                            </label>
                            <input
                                type="text"
                                value={formData.pickup}
                                onChange={(e) => handleChange("pickup", e.target.value)}
                                placeholder="Ej: Av. Providencia 1234, Providencia"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-slate-900 ${errors.pickup
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-slate-200 focus:border-[#ff9900]"
                                    } outline-none`}
                            />
                            {errors.pickup && (
                                <p className="text-red-500 text-sm mt-1">{errors.pickup}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Dirección de destino *
                            </label>
                            <input
                                type="text"
                                value={formData.delivery}
                                onChange={(e) => handleChange("delivery", e.target.value)}
                                placeholder="Ej: Av. Las Condes 9876, Las Condes"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-slate-900 ${errors.delivery
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-slate-200 focus:border-[#ff9900]"
                                    } outline-none`}
                            />
                            {errors.delivery && (
                                <p className="text-red-500 text-sm mt-1">{errors.delivery}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Descripción */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Descripción del encargo
                    </h3>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Describe lo que necesitas transportar (opcional)"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-[#ff9900] text-slate-900 outline-none transition-all duration-300 resize-none"
                    />
                </div>

                {/* Datos de Contacto */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Datos de contacto
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="Juan Pérez"
                                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-slate-900 ${errors.name
                                    ? "border-red-500 focus:border-red-500"
                                    : "border-slate-200 focus:border-[#ff9900]"
                                    } outline-none`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="+56 9 1234 5678"
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-slate-900 ${errors.phone
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-200 focus:border-[#ff9900]"
                                        } outline-none`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    placeholder="juan@ejemplo.com"
                                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-slate-900 ${errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-200 focus:border-[#ff9900]"
                                        } outline-none`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Confirmar Reserva
                </motion.button>
            </form>
        </div>
    );
}
