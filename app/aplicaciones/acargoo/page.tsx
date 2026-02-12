"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AcargooHero from "@/components/aplicaciones/acargoo/AcargooHero";
import ServiceSelector from "@/components/aplicaciones/acargoo/ServiceSelector";
import BookingCalendar from "@/components/aplicaciones/acargoo/BookingCalendar";
import BookingForm from "@/components/aplicaciones/acargoo/BookingForm";
import BookingConfirmation from "@/components/aplicaciones/acargoo/BookingConfirmation";
import { AcargooTracker } from "@/components/aplicaciones/acargoo/AcargooTracker";

type BookingStep = "hero" | "service" | "calendar" | "details" | "confirmation";

export interface BookingData {
    service?: {
        id: string;
        name: string;
        icon: string;
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
}

export default function AcargooPage() {
    const [step, setStep] = useState<BookingStep>("hero");
    const [bookingData, setBookingData] = useState<BookingData>({});

    const updateBookingData = (data: Partial<BookingData>) => {
        setBookingData((prev) => ({ ...prev, ...data }));
    };

    const goToStep = (newStep: BookingStep) => {
        setStep(newStep);
    };

    return (
        <div className="min-h-screen">
            <AcargooTracker />
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
                            onSelect={(service) => {
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
                            onSelectSlot={(date, time) => {
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
                            onSubmit={(formData) => {
                                updateBookingData(formData);
                                goToStep("confirmation");
                            }}
                            onBack={() => goToStep("calendar")}
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
