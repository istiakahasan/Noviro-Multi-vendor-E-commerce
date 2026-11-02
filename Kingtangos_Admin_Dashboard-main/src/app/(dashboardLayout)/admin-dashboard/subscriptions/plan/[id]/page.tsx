

// "use client";
// import React from "react";

// import { useParams } from "next/navigation";
// import SectionCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/SectionCard";
// import ItemsTable from "@/components/shared/dashboardLayout/order-&-booking-management-details/ItemsTable";
// import TransactionsTable from "@/components/shared/dashboardLayout/order-&-booking-management-details/TransactionsTable";
// import CustomerCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/CustomerCard";
// import AddressCard from "@/components/shared/dashboardLayout/order-&-booking-management-details/AddressCard";
// import { useGetSingleSubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";

// const SubscriptionDetailsPage = () => {

//   const {id} = useParams();
//   console.log(id);
// const { data, isLoading } = useGetSingleSubscriptionQuery(`${id}`);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   console.log(data);


//   const items = [
//     { name: "Dress", image: "https://i.ibb.co.com/xtRpYxWK/fashion-beige-lady-clutch-bag-shoes-accessories-trend-cosmetics-stylish-look-1-1.png", quantity: 4, price: 2742, total: 2742 },
//     { name: "Shoe & Bag", image: "https://i.ibb.co.com/xtRpYxWK/fashion-beige-lady-clutch-bag-shoes-accessories-trend-cosmetics-stylish-look-1-1.png", quantity: 7, price: 2742, total: 2742 },
//     { name: "Shoe & Bag", image: "https://i.ibb.co.com/xtRpYxWK/fashion-beige-lady-clutch-bag-shoes-accessories-trend-cosmetics-stylish-look-1-1.png", quantity: 3, price: 2742, total: 2742 },
//   ];

//   const transactions = [
//     { type: "Payment", method: "Stripe", date: "23 July, 2025", amount: 2742 },
//     { type: "Payment", method: "From account balance", date: "23 July, 2025", amount: 2742 },
//     { type: "Refund", method: "Paypal", date: "23 July, 2025", amount: -342 },
//   ];

//   return (
//     <div className="container mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-6 ">
//       {/* Left Section */}
//       <div className="xl:col-span-2 space-y-6">
//         <SectionCard title="Order & Booking Management">
//         <p className="text-gray-600 text-sm mb-5">
//           Monitor and manage all product orders, service bookings, and subscription activities.
//         </p>

//         <div className="text-sm text-gray-700 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3 mb-4">
//           <span>October 7, 2024 at 8:09 pm</span>
//           <span className="text-gray-400">|</span>
//           <span>6 items</span>
//           <span className="text-gray-400">|</span>
//           <span>Total $9,489</span>
//         </div>

//         <ItemsTable items={items} shipping={68.06} total={68506} />
//       </SectionCard>

//         <TransactionsTable transactions={transactions} />
//       </div>

//       {/* Right Section */}
//       <div className="space-y-6">
//         <CustomerCard
//           name="Nefetari D. Vivi"
//           email="Nefetarid.vivi@gmail.com"
//           phone="+2884927923479"
//           image="https://i.ibb.co.com/PyXSVMn/Ellipse-3.png"
//         />
//         <AddressCard
//           title="Shipping Address"
//           name="Nefetari D. Vivi"
//           address="Random Federation"
//           postal="115302, Moscow"
//         />
//         <AddressCard
//           title="Billing Address"
//           name="Nefetari D. Vivi"
//           address="Random Federation"
//           postal="115302, Moscow"
//         />
//       </div>
//     </div>
//   );
// };

// export default SubscriptionDetailsPage;



























"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useGetSingleSubscriptionQuery } from "@/redux/features/subscription/subscriptionApi";
import Link from "next/link";
import PageLoader from "@/app/loading";

const SubscriptionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleSubscriptionQuery(id);

  if (isLoading) {
    return (
      <PageLoader/>
    );
  }

  if (isError || !data?.data) {
    notFound(); // or you can return a custom not-found UI
  }

  const sub = data.data;
  const user = sub.user;
  const plan = sub.plan;

  // Fixed ternary — the bug was here
  const isActive = new Date(sub.endDate) > new Date() && sub.paymentStatus === "PAID";
  const status = isActive
    ? { label: "Active", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle }
    : sub.paymentStatus === "PENDING"
    ? { label: "Pending", color: "bg-amber-100 text-amber-800", icon: AlertCircle }
    : { label: "Inactive", color: "bg-red-100 text-red-800", icon: XCircle };

  const StatusIcon = status.icon;

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin-dashboard/subscriptions"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Subscription Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">ID: {sub.id}</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${status.color}`}
            >
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-600" />
                Customer Information
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-full flex-shrink-0" >
                  <img src={user.profilePic} alt="" className="w-full h-full object-cover rounded-full" />
                  </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                Subscription Plan
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.planName}</h3>
                  {plan.description && (
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-900 flex items-center gap-2 mt-1">
                      {/* <DollarSign className="w-5 h-5 text-gray-600" /> */}
                      €
                      {sub.amount.toFixed(2)}{" "}
                      <span className="text-sm font-normal text-gray-500">EUR</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Cycle</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize mt-1">
                      {plan.intervalCount > 1 ? `${plan.intervalCount} ` : ""}
                      {plan.interval}(s)
                    </p>
                  </div>
                </div>

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Included Features
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">Stripe</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium capitalize">
                    {sub.paymentStatus.toLowerCase()}
                  </span>
                </div>
                {sub.stripePaymentId && (
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Stripe Payment ID</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {sub.stripePaymentId}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Subscription Period
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {format(new Date(sub.startDate), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date / Renewal</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {format(new Date(sub.endDate), "MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {format(new Date(sub.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-blue-50/20 to-blue-50/40 text-gray-400 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Plan Type</span>
                  <span className="font-medium">Recurring</span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Currency</span>
                  <span className="font-medium uppercase">{plan.currency}</span>
                </div> */}
                <div className="flex justify-between">
                  <span>Store Owner Plan</span>
                  <span className="font-medium">{plan.storeId ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionDetailsPage;