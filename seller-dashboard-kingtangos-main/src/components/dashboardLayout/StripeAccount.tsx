/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useCreateStripeAccountMutation } from "@/redux/api/withdrawApi/withdrawApi";


interface StripeAccountResponse {
  success: boolean;
  message: string;
  data?: {
    accountId: string;
    status: string;
    onboardingUrl: string;
    message: string;
  };
}

const StripeAccount = () => {
  const [createStripeAccount, { isLoading }] = useCreateStripeAccountMutation();
  const [error, setError] = useState<string | null>(null);

  const handleStripeSetup = async () => {
    try {
      setError(null);
      
      // Cast the response to the expected type
      const response = await createStripeAccount({}).unwrap() as StripeAccountResponse;
      
      if (response.success && response.data?.onboardingUrl) {
        // Optional: You might want to store the accountId in localStorage or state
        // localStorage.setItem('stripeAccountId', response.data.accountId);
        
        // Redirect to Stripe onboarding
        window.location.href = response.data.onboardingUrl;
      } else {
        setError(response.message || "Failed to create Stripe account");
      }
    } catch (err: any) {
      setError(err?.data?.message || "An error occurred while setting up Stripe");
      console.error("Stripe account creation error:", err);
    }
  };

  return (
    <div>
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 flex flex-col justify-center items-center h-[210px] space-y-3">
          <Button 
            onClick={handleStripeSetup}
            disabled={isLoading}
            className="w-full max-w-xs bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 "
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "Connect Stripe Account"
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            You&apos;ll be redirected to Stripe to complete account setup
          </p>
          
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded w-full">{error}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StripeAccount;