"use client";

import SubscriptionViewDetails from '@/components/dashboardLayout/Orders&Bookings/SubscriptionViewDetails';
import { useParams } from 'next/navigation';

const SubscriptionViewPage = () => {
  const params = useParams();
  const subscriptionViewId = params.subscriptionViewId as string;
  console.log("subscriptionViewId:", subscriptionViewId);

  return (
    <div>
      <SubscriptionViewDetails subscriptionViewId={subscriptionViewId} />
    </div>
  );
};

export default SubscriptionViewPage;