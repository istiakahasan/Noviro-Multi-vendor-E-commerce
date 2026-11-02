/* eslint-disable @typescript-eslint/no-explicit-any */
// components/pages/Subscription/payment/PaymentForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import {
  clearSubscription,
  setSubscription,
} from "@/redux/features/subscriptionSlice";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();

  const { stripeSubscriptionId, stripeCustomerId } = useAppSelector(
    (state: RootState) => state.subscription,
  );
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  console.log(
    "PaymentForm: Initial state check - stripeCustomerId:",
    stripeCustomerId,
    "stripeSubscriptionId:",
    stripeSubscriptionId,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !stripeCustomerId || !stripeSubscriptionId) {
      const missing = [];
      if (!stripe) missing.push("stripe");
      if (!elements) missing.push("elements");
      if (!stripeCustomerId) missing.push("stripeCustomerId");
      if (!stripeSubscriptionId) missing.push("stripeSubscriptionId");
      console.log(
        "PaymentForm: Missing required components:",
        missing.join(", "),
      );
      toast.error(
        `Payment system or subscription details not ready. Missing: ${missing.join(", ")}`,
      );
      return;
    }

    console.log("Step 1: Form submitted, creating payment method");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.log("PaymentForm: CardElement not found");
      toast.error("Card details not entered.");
      return;
    }

    setPaymentProcessing(true);
    setPaymentError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.log("PaymentForm: Error creating payment method:", error);
        setPaymentError(error.message!);
        toast.error(error.message);
        return;
      }

      console.log("Step 2: Payment method created:", paymentMethod?.id);

      const secretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";
      console.log("Secret Key:", secretKey);
      if (!secretKey) {
        throw new Error("Stripe secret key not found");
      }
      const authHeader = `Bearer ${secretKey}`;

      // Step 3: Attach payment method to customer
      const attachBody = new URLSearchParams();
      attachBody.append("customer", stripeCustomerId);

      const attachRes = await fetch(
        `https://api.stripe.com/v1/payment_methods/${paymentMethod!.id}/attach`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: attachBody.toString(),
        },
      );

      const attachData = await attachRes.json();
      console.log("Step 3: Payment method attached:", attachData);

      if (attachRes.status !== 200) {
        throw new Error(
          attachData.error?.message || "Failed to attach payment method",
        );
      }

      // Step 4: Update subscription with default payment method
      const updateBody = new URLSearchParams();
      updateBody.append("default_payment_method", paymentMethod!.id);

      const updateRes = await fetch(
        `https://api.stripe.com/v1/subscriptions/${stripeSubscriptionId}`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: updateBody.toString(),
        },
      );

      const updateData = await updateRes.json();
      console.log("Step 4: Subscription updated:", updateData);

      if (updateRes.status !== 200) {
        throw new Error(
          updateData.error?.message || "Failed to update subscription",
        );
      }

      const latestInvoiceId = updateData.latest_invoice;
      if (!latestInvoiceId) {
        throw new Error("No latest invoice found after update");
      }

      dispatch(
        setSubscription({
          paymentMethodId: paymentMethod!.id,
          latest_invoice: latestInvoiceId,
        }),
      );

      // Step 5: Pay the invoice
      const payRes = await fetch(
        `https://api.stripe.com/v1/invoices/${latestInvoiceId}/pay`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const payData = await payRes.json();
      console.log("Step 5: Invoice paid:", payData);

      if (payRes.status !== 200 || payData.status !== "paid") {
        throw new Error(payData.error?.message || "Payment failed");
      }

      console.log("Step 6: Payment successful");
      toast.success("Payment successful! 🎉");
      dispatch(clearSubscription());
      router.push("/payment-success");
    } catch (err: any) {
      console.error("PaymentForm: Error during payment process:", err);
      const msg = err.message || "Payment failed. Please try again.";
      setPaymentError(msg);
      toast.error(msg);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (!stripe || !elements) {
    console.log("PaymentForm: Stripe or elements not initialized");
    return (
      <div className="text-center py-12 text-gray-400">
        Initializing secure checkout...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mb-12 px-4">
      <div className="p-8 rounded-b-2xl shadow-2xl bg-white/50 backdrop-blur-md border border-gray-300">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>

          <button
            type="submit"
            disabled={
              paymentProcessing ||
              !stripe ||
              !elements ||
              !stripeCustomerId ||
              !stripeSubscriptionId
            }
            className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white hover:bg-black bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02]"
          >
            {paymentProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>

          {paymentError && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300">
              <p>{paymentError}</p>
            </div>
          )}

          <div className="flex items-center justify-center pt-6 border-t border-gray-700 text-sm text-gray-400">
            <svg
              className="h-5 w-5 mr-2 text-black"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Payments are{" "}
            <span className="font-semibold text-black mx-1">secure</span> and
            encrypted with 256-bit SSL
          </div>
        </form>
      </div>
    </div>
  );
}
