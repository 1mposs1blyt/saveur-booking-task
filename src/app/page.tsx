"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingFormData, BookingStatus } from "@/types/booking";
import BookingForm from "@/components/BookingForm/BookingForm";
import ConfirmationScreen from "@/components/ConfirmationScreen/confirmationScreeen";


export default function Home() {
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const handleFormSubmit = async (data: BookingFormData) => {
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setBookingData(data);
    setStatus("success");
  };

  const handleReset = () => {
    setBookingData(null);
    setStatus("idle");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-restaurant-bg">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 overflow-hidden relative">

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-restaurant-text uppercase tracking-wider">
            SAVEUR
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {status === "success" ? "Бронирование подтверждено" : "Онлайн-бронирование столика"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <BookingForm onSubmit={handleFormSubmit} status={status} />
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {bookingData && (
                <ConfirmationScreen data={bookingData} onReset={handleReset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}