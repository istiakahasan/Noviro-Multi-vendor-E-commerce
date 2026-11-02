"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MessageSquare,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRescheduleBookingMutation } from "@/lib/api/scheduleManagement/scheduleApi";
import { toast } from "sonner";
import { format } from "date-fns";

const schema = z.object({
  newBookingDate: z.string().min(1, "Date is required"),
  newStartTime: z.string().min(1, "Start time is required"),
  newEndTime: z.string().min(1, "End time is required"),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const RescheduleButton = ({
  bookingId,
  disabled = false,
}: {
  bookingId: string;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rescheduleBooking, { isLoading }] = useRescheduleBookingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newBookingDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the payload in the format requested by the user
      const payload = {
        newBookingDate: data.newBookingDate,
        newStartTime: `${data.newBookingDate}T${data.newStartTime}:00.000Z`,
        newEndTime: `${data.newBookingDate}T${data.newEndTime}:00.000Z`,
        reason: data.reason,
      };

      await rescheduleBooking({ bookingId, body: payload }).unwrap();
      toast.success("Booking rescheduled successfully");
      setIsOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reschedule booking");
    }
  };

  return (
    <>
      <button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`flex-1 min-w-[160px] px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-3 group relative overflow-hidden ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
        }`}
      >
        <span className="relative z-10 flex items-center gap-3">
          <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Reschedule
        </span>
        {!disabled && (
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 z-101 border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <Dialog.Title className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        Reschedule Booking
                      </Dialog.Title>
                      <Dialog.Description className="text-gray-500 mt-1">
                        Move this appointment to a new time slot.
                      </Dialog.Description>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      {/* Date Field */}
                      <div className="relative group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                          New Booking Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                          <input
                            type="date"
                            {...register("newBookingDate")}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold text-gray-900"
                          />
                        </div>
                        {errors.newBookingDate && (
                          <p className="text-red-500 text-xs mt-1 font-bold">
                            {errors.newBookingDate.message}
                          </p>
                        )}
                      </div>

                      {/* Time Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                            Start Time
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                              type="time"
                              {...register("newStartTime")}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold text-gray-900"
                            />
                          </div>
                          {errors.newStartTime && (
                            <p className="text-red-500 text-xs mt-1 font-bold">
                              {errors.newStartTime.message}
                            </p>
                          )}
                        </div>
                        <div className="relative group">
                          <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                            End Time
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                            <input
                              type="time"
                              {...register("newEndTime")}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold text-gray-900"
                            />
                          </div>
                          {errors.newEndTime && (
                            <p className="text-red-500 text-xs mt-1 font-bold">
                              {errors.newEndTime.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reason Field */}
                      <div className="relative group">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                          Reason for Rescheduling
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                          <textarea
                            {...register("reason")}
                            rows={3}
                            placeholder="Briefly explain why you're rescheduling..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-semibold text-gray-900 resize-none"
                          />
                        </div>
                        {errors.reason && (
                          <p className="text-red-500 text-xs mt-1 font-bold">
                            {errors.reason.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-xl shadow-indigo-100"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Confirm Reschedule
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </>
  );
};

export default RescheduleButton;
