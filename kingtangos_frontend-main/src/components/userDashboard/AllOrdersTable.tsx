"use client";

import { useState } from "react";
import { useGetMyOdersQuery } from "@/redux/api/userDashbord/userDashbordApi";
import { Order } from "@/types/userDashbord/order.types";
import OrdersTable from "../ui/tables/OrdersTable";
import Pagination from "../ui/Pagination/Pagination";

export default function AllOrdersTable({ status }: { status: string }) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading } = useGetMyOdersQuery({
    page: currentPage,
    limit: 10,
    orderStatus: status,
  });

  const orders: Order[] = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="w-full space-y-4 mt-5">
      <OrdersTable orders={orders} isLoading={isLoading} />

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.pages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
