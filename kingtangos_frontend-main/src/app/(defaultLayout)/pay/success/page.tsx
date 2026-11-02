// app/payment/success/page.tsx  (or wherever your success route is)
"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Calendar, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Optional: Confetti animation on mount
  useEffect(() => {
    if (mounted) {
      // You can add a confetti library like 'canvas-confetti' here if desired
      // import confetti from 'canvas-confetti';
      // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Success Card */}
        <div
          className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cyan-500/20 p-10 text-center overflow-hidden"
          style={{
            boxShadow: "0 0 60px rgba(0, 255, 255, 0.15)",
          }}
        >
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
            <div className="relative bg-cyan-500/10 rounded-full p-6 animate-pulse">
              <CheckCircle2 className="w-32 h-32 text-cyan-400 mx-auto" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-lg mx-auto">
            Congratulations! Your subscription has been activated successfully.
            You&rsquo;re all set to enjoy premium features.
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Active Now</h3>
              </div>
              <p className="text-sm text-gray-400">
                Your plan started immediately
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Secure Payment</h3>
              </div>
              <p className="text-sm text-gray-400">
                Processed via encrypted connection
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-cyan-400" />
                <h3 className="font-semibold text-white">Confirmation Sent</h3>
              </div>
              <p className="text-sm text-gray-400">
                Check your email for receipt
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-6 rounded-2xl shadow-lg transform transition hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="/subscriptions" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold text-lg px-8 py-6 rounded-2xl"
              >
                View Subscriptions
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-10">
            Need help? Contact{" "}
            <a href="mailto:support@yourapp.com" className="text-cyan-400 hover:underline">
              support@yourapp.com
            </a>
          </p>
        </div>

        {/* Optional: Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}