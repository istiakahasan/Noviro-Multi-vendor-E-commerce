import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleCheckBig, Star } from "lucide-react";

const pricingTiers = [
  {
    id: 1,
    badge: "Most Popular",
    badgeColor: "orange",
    isPopular: true,
    title: "Starter Plan",
    subtitle: "Perfect for individuals",
    rating: 4.8,
    reviewCount: 120,
    price: "$9 / month",
    features: [
      { text: "Basic access" },
      { text: "Email support" },
      { text: "Community access" },
    ],
  },
  {
    id: 2,
    badge: "Best Value",
    badgeColor: "blue",
    isPopular: false,
    title: "Basic Plan",
    subtitle: "For small teams",
    rating: 4.6,
    reviewCount: 95,
    price: "$19 / month",
    features: [
      { text: "All Starter features" },
      { text: "Team collaboration" },
      { text: "Priority email support" },
    ],
  },
  {
    id: 3,
    badge: "Recommended",
    badgeColor: "orange",
    isPopular: false,
    title: "Standard Plan",
    subtitle: "For growing businesses",
    rating: 4.7,
    reviewCount: 210,
    price: "$29 / month",
    features: [
      { text: "All Basic features" },
      { text: "Advanced analytics" },
      { text: "Custom reports" },
    ],
  },
];

const SubscriptionPackage = () => {
  return (
    <div className="grid xl:gap-6 gap-3 md:grid-cols-2 lg:grid-cols-3">
      {pricingTiers.map((tier, index) => (
        <div 
          key={index}
          className="p-[2px] rounded-lg hover:bg-gradient-to-br hover:from-blue-500 hover:via-blue-400 hover:to-orange-500 transition-all duration-300"
        >
          <Card className="flex flex-col bg-white h-full">
            <div className="flex h-full flex-col rounded-lg">
              <div
                className={cn(
                  "xl:px-4 py-3 text-center text-sm font-medium text-white rounded-t-lg",
                  tier.badgeColor === "orange" && "bg-orange-500",
                  tier.badgeColor === "blue" && "bg-blue-600"
                )}
              >
                {tier.badge}
              </div>

              <div className="flex flex-col flex-1 xl:p-6 lg:p-4 md:p-4 p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tier.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {tier.subtitle}
                </p>

                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {tier.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({tier.reviewCount})
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-gray-900">
                  {tier.price}
                </p>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="flex items-center justify-center rounded-full border-blue-500">
                          <CircleCheckBig className="h-5 w-5 stroke-[3] text-blue-500" />
                        </div>
                      </div>
                      <span className="text-sm text-gray-700">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex-1" />
              </div>

              <div className="px-6 pb-6 pt-4">
                <Button
                  className={
                    "w-full rounded-lg py-6 font-semibold hover:bg-gray-900 hover:text-white bg-gray-600 text-white"}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPackage;