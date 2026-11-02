import AllOrdersTable from "@/components/userDashboard/AllOrdersTable";
import React from "react";

export default function AllOrdersPage() {
  return (
    <div className="">
      <h1 className="font-medium text-primary text-2xl">My Orders</h1>
      <AllOrdersTable status="PENDING" />
    </div>
  );
}
