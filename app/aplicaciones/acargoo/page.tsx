"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AcargooHero from "../../../components/aplicaciones/acargoo/AcargooHero";
import ServiceSelector from "../../../components/aplicaciones/acargoo/ServiceSelector";
import BookingCalendar from "../../../components/aplicaciones/acargoo/BookingCalendar";
import BookingForm from "../../../components/aplicaciones/acargoo/BookingForm";
import BookingConfirmation from "../../../components/aplicaciones/acargoo/BookingConfirmation";

type BookingStep = "hero" | "service" | "calendar" | "details" | "confirmation";

export interface BookingData {
    service?: {
        id: string;
        name: string;
        icon: string;
        description?: string;
    };
    date?: string;
    time?: string;
    pickup?: string;
    delivery?: string;
    description?: string;
    contact?: {
        name: string;
        phone: string;
        email: string;
    };
    confirmation?: {
        orderId: string;
        trackingCode: string;
        waMeLink: string | null;
    };
}

export default function AcargooPage() {
    const [step, setStep] = useState<BookingStep>("hero");
    const [bookingData, setBookingData] = useState<BookingData>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const updateBookingData = (data: Partial<BookingData>) => {
        setBookingData((prev) => ({ ...prev, ...data }));
    };

    const goToStep = (newStep: BookingStep) => {
        setStep(newStep);
    };

    const handleCreateOrder = async (formData: Partial<BookingData>) => {
        const payload: BookingData = { ...bookingData, ...formData };

        setSubmitting(true);
        setSubmitError(null);

        try {
            const response = await fetch("/api/acargoo/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceId: payload.service?.id,
                    date: payload.date,
                    time: payload.time,
                    pickup: payload.pickup,
                    delivery: payload.delivery,
                    description: payload.description,
                    contact: payload.contact,
                }),
            });

            const result = await response.json();
            if (!response.ok || !result?.ok) {
                throw new Error(result?.error || "No pudimos registrar tu reserva.");
            }

            updateBookingData({
                ...formData,
                confirmation: {
                    orderId: result.order.id,
                    trackingCode: result.order.trackingCode,
                    waMeLink: result.order.waMeLink || null,
                },
            });
            goToStep("confirmation");
        } catch (error: any) {
            setSubmitError(error?.message || "No pudimos registrar tu reserva.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen">
            <AnimatePresence mode="wait">
                {step === "hero" && (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AcargooHero onStart={() => goToStep("service")} />
                    </motion.div>
                )}

                {step === "service" && (
                    <motion.div
                        key="service"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ServiceSelector
                            onSelect={(service: { id: string; name: string; icon: string }) => {
                                updateBookingData({ service });
                                goToStep("calendar");
                            }}
                            onBack={() => goToStep("hero")}
                        />
                    </motion.div>
                )}

                {step === "calendar" && (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BookingCalendar
                            selectedService={bookingData.service}
                            onSelectSlot={(date: string, time: string) => {
                                updateBookingData({ date, time });
                                goToStep("details");
                            }}
                            onBack={() => goToStep("service")}
                        />
                    </motion.div>
                )}

                {step === "details" && (
                    <motion.div
                        key="details"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BookingForm
                            bookingData={bookingData}
                            onSubmit={handleCreateOrder}
                            onBack={() => goToStep("calendar")}
                            submitError={submitError}
                            submitting={submitting}
                        />
                    </motion.div>
                )}

                {step === "confirmation" && (
                    <motion.div
                        key="confirmation"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <BookingConfirmation
                            bookingData={bookingData}
                            onNewBooking={() => {
                                setBookingData({});
                                goToStep("hero");
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
