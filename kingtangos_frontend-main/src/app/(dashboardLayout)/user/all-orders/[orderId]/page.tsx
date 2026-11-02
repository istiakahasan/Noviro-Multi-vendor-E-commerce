"use client";

import OrderDetails from "@/components/userDashboard/OrderDetails";
import OrderTrack from "@/components/userDashboard/OrderTrack";
import { useGetOrderDetailsQuery } from "@/redux/api/userDashbord/userDashbordApi";
import { usePathname } from "next/navigation";

export default function OrderId() {
  const path = usePathname();
  const orderId = path.split("/")[3];
  console.log(orderId, path);
  const { data, isLoading, isError } = useGetOrderDetailsQuery(orderId);

  const order = data?.data;

  console.log(order, "order details");

  return (
    <div className="p-6">
      <OrderDetails order={order} isLoading={isLoading} isError={isError} />
      <OrderTrack order={order} isLoading={isLoading} isError={isError} />
    </div>
  );
}
