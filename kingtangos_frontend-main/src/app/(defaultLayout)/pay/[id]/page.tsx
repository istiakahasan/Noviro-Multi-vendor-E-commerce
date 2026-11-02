"use client";

import PaymentForm from "@/components/pages/Subscription/payment/PaymentForm";
import { StripeWrapper } from "@/components/pages/Subscription/payment/StripeWrapper";
import { useCreateSubscriptionPlanMutation } from "@/redux/api/subscription/subscriptionApi";
import { setSubscription } from "@/redux/features/subscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function PaymentPage() {
  const pathname = usePathname();
  const planId = pathname.split("/")[2];
  console.log("PaymentPage: Plan ID from path:", planId);

  const dispatch = useAppDispatch();
  const subData = useAppSelector((state: RootState) => state.subscription);
  console.log("PaymentPage: Current subscription state:", subData);

  const [createSubscriptionPlan, { isLoading: createLoading }] =
    useCreateSubscriptionPlanMutation();

  useEffect(() => {
    const createSubIfMissing = async () => {
      if (!planId || subData.stripeCustomerId || subData.stripeSubscriptionId)
        return;

      console.log(
        "PaymentPage: Subscription details missing, creating now with planId:",
        planId,
      );

      try {
        const response = await createSubscriptionPlan({ planId }).unwrap();
        console.log("PaymentPage: Subscription created:", response);

        dispatch(
          setSubscription({
            stripeSubscriptionId:
              response?.data?.subscription?.stripeSubscriptionId,
            stripeCustomerId: response?.data?.subscription?.stripeCustomerId,
          }),
        );
        console.log("PaymentPage: Dispatched new subscription data");
      } catch (err) {
        console.error("PaymentPage: Failed to create subscription:", err);
        toast.error(
          "Failed to initialize subscription. Please try again from the subscription page.",
        );
      }
    };

    createSubIfMissing();
  }, [
    planId,
    subData.stripeCustomerId,
    subData.stripeSubscriptionId,
    createSubscriptionPlan,
    dispatch,
  ]);

  if (createLoading) {
    return (
      <div className="text-center py-12">Initializing subscription...</div>
    );
  }

  if (!subData.stripeCustomerId || !subData.stripeSubscriptionId) {
    return (
      <div className="text-center py-12 text-red-600">
        Subscription details not found. Please try again from the subscription
        page.
      </div>
    );
  }

  return (
    <div className="xl:w-[1200px] mx-auto xl:px-0 lg:px-20 md:px-6 px-3 py-8 lg:py-20 ">
      <div className="max-w-[736px] mx-auto bg-white/90 backdrop-blur-md rounded-t-2xl border border-gray-300 p-6">
        <h2 className="text-lg text-center font-semibold mb-6">
          Enter Payment Details
        </h2>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12">
            Loading secure payment form...
          </div>
        }
      >
        <StripeWrapper>
          <PaymentForm />
        </StripeWrapper>
      </Suspense>
    </div>
  );
}

export default PaymentPage;
