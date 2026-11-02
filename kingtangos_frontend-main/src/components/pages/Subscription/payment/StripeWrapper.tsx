// components/pages/Subscription/payment/StripeWrapper.tsx
"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function StripeWrapper({ children }: { children: React.ReactNode }) {
  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#d1d5dc", // Cyan accent
      colorBackground: "#4b5563",
      colorText: "#e2e8f0",
      colorDanger: "#ef4444",
      fontFamily: '"Inter", system-ui, sans-serif',
      spacingUnit: "4px",
      borderRadius: "12px",
      colorTextPlaceholder: "#94a3b8",
    },
    rules: {
      ".Input": {
        backgroundColor: "#0f172a",
        border: "1px solid #4b5563",
        color: "#ffffff",
        padding: "12px",
      },
      ".Input:focus": {
        borderColor: "#6a7282",
        boxShadow: "0 0 0 2px rgba(0, 255, 255, 0.2)",
      },
      ".Label": {
        color: "#e2e8f0",
        fontWeight: "500",
      },
      ".Tab": {
        backgroundColor: "#d1d5dc",
        color: "#cbd5e1",
        border: "none",
      },
      ".Tab--selected": {
        backgroundColor: "#d1d5dc",
        color: "#000",
        border: "none",
      },
      ".AccordionItem": {
        backgroundColor: "#1e293b",
      },
    },
  };

  const options = {
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}