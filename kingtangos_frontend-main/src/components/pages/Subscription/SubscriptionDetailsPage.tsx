/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import { AiFillStar } from "react-icons/ai";
import { useParams, useRouter } from "next/navigation";
import {
  useGetPlansCategoryByIdQuery,
  useGetPlansDetailsQuery,
  useGetSubscriptionReviewsQuery,
} from "@/redux/api/plansApi";
import SubscriptionReview from "@/components/shared/review/SubscriptionReview";
import { Button } from "@/components/ui/button";
import { useCreateSubscriptionPlanMutation } from "@/redux/api/subscription/subscriptionApi";
import { useAppDispatch } from "@/redux/hooks";
import { setSubscription } from "@/redux/features/subscriptionSlice";
import { useGetMeQuery } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const subscriptionId = params.id as string;

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedPlan] = useState<any>(null);

  // Get user data - skip the query if no accessToken exists
  const hasAccessToken =
    typeof window !== "undefined" && Cookies.get("accessToken");
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !hasAccessToken, // Skip query if no accessToken
  });

  const isAuthenticated = !!userData?.data?.id;

  const [createSubscriptionPlan, { isLoading, isSuccess, error }] =
    useCreateSubscriptionPlanMutation();

  const { data } = useGetPlansDetailsQuery(subscriptionId);
  const subscriptions = data?.data;

  const categoryId = subscriptions?.categoryId;

  const { data: plans } = useGetPlansCategoryByIdQuery(categoryId!, {
    skip: !categoryId,
  });

  const relatedPlans = useMemo(() => {
    if (!subscriptions || !plans?.data?.length) return [];

    return plans.data.filter(
      (plan: any) =>
        plan.categoryId === subscriptions.categoryId &&
        plan.id !== subscriptions.id,
    );
  }, [plans?.data, subscriptions]);

  const handleBuyNow = async (planId: string) => {
    if (!planId) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the current subscription ID to redirect back after login
      sessionStorage.setItem(
        "redirectAfterLogin",
        `/subscription/${subscriptionId}`,
      );
      router.push("/login");
      return;
    }

    console.log("Step 1: Starting subscription creation with planId:", planId);

    try {
      const subscriptionData = {
        planId: planId,
      };

      const response = await createSubscriptionPlan(subscriptionData).unwrap();
      console.log("Step 2: Subscription created successfully:", response);
      dispatch(
        setSubscription({
          stripeSubscriptionId:
            response?.data?.subscription?.stripeSubscriptionId,
          stripeCustomerId: response?.data?.subscription?.stripeCustomerId,
        }),
      );
      console.log("Step 3: Dispatched subscription data to Redux");

      router.push(`/pay/${planId}`);
      console.log("Step 4: Routed to payment page");
    } catch (err: any) {
      console.error("Failed to create subscription:", err);
      // Show the actual error from the API using toast
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const { data: reviews } = useGetSubscriptionReviewsQuery(subscriptionId);

  // Use selected plan or default subscriptions
  const displayPlan = selectedPlan || subscriptions;
  const bannerRelatedPlans = relatedPlans.slice(0, 3);

  return (
    <div className="md:container mx-auto pt-16">
      <h1 className="text-primary mb-5 font-semibold md:px-0 px-2 lg:text-3xl  md:text-2xl text-xl">
        {displayPlan?.planName}
      </h1>
      <div className="grid grid-cols-12 xl:gap-11 gap-5">
        <div className="lg:col-span-9 col-span-12">
          <Image
            src={displayPlan?.image || "/placeholder-image.png"}
            alt={displayPlan?.planName || "Subscription image"}
            height={580}
            width={1034}
            className="lg:h-[480px] rounded-lg"
          />

          <div className="py-7">
            <div className="grid xl:gap-6 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* Existing content here */}
            </div>
          </div>

          {bannerRelatedPlans.length > 0 && (
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:px-0 px-2">
                {bannerRelatedPlans.map((p: any) => (
                  <article
                    key={p.id}
                    onClick={() => router.push(`/subscription/${p.id}`)}
                    className="overflow-hidden rounded-xl cursor-pointer border border-gray-200 bg-white shadow-sm transition hover:shadow-md flex flex-col h-full"
                  >
                    {/* IMAGE */}
                    <div className="relative h-40 w-full sm:h-44 shrink-0">
                      <Image
                        src={p.image || "/placeholder-image.png"}
                        alt={p.planName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                        {p.planName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <AiFillStar className="text-yellow-600 text-sm" />
                        <span>{p.averageRating}</span>
                        <span>({p.totalReviews})</span>
                      </div>

                      <div className="mt-3 text-[15px] font-semibold text-gray-800">
                        € {p.amount}/{p.interval}
                      </div>

                      {/* FEATURES — NOT REMOVED */}
                      <ul className="my-3 space-y-2">
                        {p.features?.map((f: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] text-gray-600"
                          >
                            <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* BUTTON — ALWAYS SAME POSITION */}
                      <button
                        type="button"
                        className="mt-auto w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                        onClick={() => router.push(`/subscription/${p.id}`)}
                      >
                        Get Started
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="py-7 md:px-0 px-2">
            <h2 className="font-semibold lg:text-2xl  md:text-xl text-lg text-primary">
              Description
            </h2>
            <p className="md:text-base text-sm text-primary">
              {displayPlan?.description}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 col-span-12 md:px-0 px-2">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-semibold text-primary pt-7">KEY FEATURES</h3>
            {displayPlan?.features?.map((feature: string, idx: number) => (
              <p key={idx}>{feature}</p>
            ))}

            <h3 className="font-medium text-primary pt-7">
              Subscription Price: EUR{displayPlan?.amount}
            </h3>
            <div className="flex items-center gap-1 text-primary font-medium">
              Rating:
              <AiFillStar className="text-yellow-500 text-lg" />
              <span>{displayPlan?.averageRating}</span>
            </div>
            <p className="text-primary font-medium">
              Total review: {displayPlan?.totalReviews}
            </p>

            <Button
              onClick={() => handleBuyNow(displayPlan?.id || "")}
              disabled={!displayPlan?.id || isLoading}
              className="bg-primary hover:bg-primary/90 text-lg text-white rounded-full py-5 px-7 my-3"
            >
              {isLoading ? "Processing..." : "Buy Now"}
            </Button>

            {isSuccess && (
              <p className="text-green-600 text-sm mt-2">
                Subscription created successfully!
              </p>
            )}

            {error && (
              <p className="text-red-600 text-sm mt-2">
                Error creating subscription. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>

      <SubscriptionReview subscriptionId={subscriptionId} reviews={reviews} />

      <div className="md:px-0 px-2">
        {relatedPlans.length > 0 && (
          <>
            <h2 className="lg:text-2xl  md:text-xl text-lg font-semibold mt-10">
              You May Also Like
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-10">
              {relatedPlans.map((p: any) => (
                <article
                  key={p.id}
                  onClick={() => router.push(`/subscription/${p.id}`)}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md flex flex-col h-full"
                >
                  {/* IMAGE */}
                  <div className="relative h-40 w-full sm:h-44 shrink-0">
                    <Image
                      src={p.image || "/placeholder-image.png"}
                      alt={p.planName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">
                      {p.planName}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <AiFillStar className="text-yellow-600 text-sm" />
                      <span>{p.averageRating}</span>
                      <span>({p.totalReviews})</span>
                    </div>

                    <div className="mt-3 text-[15px] font-semibold text-gray-800">
                      € {p.amount}/{p.interval}
                    </div>

                    {/* FEATURES — NOT REMOVED */}
                    <ul className="my-3 space-y-2">
                      {p.features?.map((f: any, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] text-gray-600"
                        >
                          <CircleCheckBig className="mt-[1px] shrink-0 text-blue-400 w-4 h-4" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* BUTTON — ALWAYS SAME POSITION */}
                    <button
                      type="button"
                      className="mt-auto w-full rounded-md bg-primary py-2 text-sm font-semibold text-white transition hover:bg-primary/75"
                      onClick={() => router.push(`/subscription/${p.id}`)}
                    >
                      Get Started
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
