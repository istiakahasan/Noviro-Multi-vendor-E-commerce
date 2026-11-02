"use client";

import OrderViewDetails from '@/components/dashboardLayout/Orders&Bookings/OrderDetailsPage';
import { useParams } from 'next/navigation';

const OrderViewPage = () => {
  const params = useParams();
  const orderViewId = params.orderViewId as string;
  console.log("orderViewId:", orderViewId);

  return (
    <div>
      <OrderViewDetails orderViewId={orderViewId} />
    </div>
  );
};

export default OrderViewPage;