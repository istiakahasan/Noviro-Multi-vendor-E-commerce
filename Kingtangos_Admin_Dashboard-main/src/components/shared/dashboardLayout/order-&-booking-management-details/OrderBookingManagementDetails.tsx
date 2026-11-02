// "use client";
// import React from "react";
// import CustomerCard from "./CustomerCard";
// import AddressCard from "./AddressCard";
// import ItemsTable from "./ItemsTable";
// import TransactionsTable from "./TransactionsTable";
// import SectionCard from "./SectionCard";
// import { useParams } from "next/navigation";
// import { useGetSingleOrderQuery } from "@/redux/features/order-bookings/orderBookingsApi";

// const OrderBookingManagementDetails = () => {

//   const {id} = useParams();
//   console.log(id);
// const { data, isLoading } = useGetSingleOrderQuery(`${id}`);

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

// export default OrderBookingManagementDetails;

"use client";

import React from "react";
import CustomerCard from "./CustomerCard";
import AddressCard from "./AddressCard";
import ItemsTable from "./ItemsTable";
import TransactionsTable from "./TransactionsTable";
import SectionCard from "./SectionCard";
import { useParams } from "next/navigation";
import { useGetSingleOrderQuery } from "@/redux/features/order-bookings/orderBookingsApi";
import PageLoader from "@/app/loading";
interface OrderItem {
  product: {
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
  totalPrice: number;
}
const OrderBookingManagementDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleOrderQuery(id as string);

  if (isLoading) return <PageLoader />;

  const order = data?.data;

  if (!order) return <div>No order found</div>;

  // Format date
  const formattedDate = new Date(order.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // Dynamic items from API
  const items = order.orderItems.map((item: OrderItem) => ({
    name: item.product.name,
    image: item.product.image,
    quantity: item.quantity,
    price: item.price,
    total: item.totalPrice,
  }));

  // Placeholder transaction data (You can replace with API transactions later)
  const transactions = [
    {
      type: "Payment",
      method: order.paymentMethod,
      date: formattedDate,
      amount: order.totalAmount,
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
      {/* Left Section */}
      <div className="xl:col-span-2 space-y-6">
        <SectionCard title="Order & Booking Management">
          <p className="text-gray-600 text-sm mb-5">
            Monitor and manage all product orders, service bookings, and
            subscription activities.
          </p>

          <div className="text-sm text-gray-700 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3 mb-4">
            <span>{formattedDate}</span>
            <span className="text-gray-400">|</span>
            <span>{order.orderItems.length} items</span>
            <span className="text-gray-400">|</span>
            <span>Total ${order.totalAmount}</span>|
            <span>
              Status:{" "}
              <span
                className={`badge text-sm p-2 bg-gray-100 rounded-2xl ${order?.orderStatus === "PENDING" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-green-100 text-green-800 border-green-200"}`}
              >
                {order.orderStatus}
              </span>
            </span>   
          </div>

          {/* Dynamic Items */}
          <ItemsTable
            items={items}
            shipping={order.shippingCost}
            total={order.totalAmount + order.shippingCost}
          />
        </SectionCard>

        <TransactionsTable transactions={transactions} />
      </div>

      {/* Right Section */}
      <div className="space-y-6">
        {/* Customer Card */}
        <CustomerCard
          name={`${order.user.firstName} ${order.user.lastName}`}
          email={order.user.email}
          phone={order.shippingAddress.phone}
          image="https://i.ibb.co.com/PyXSVMn/Ellipse-3.png" // replace with real image if available
        />

        {/* Shipping Address */}
        <AddressCard
          title="Shipping Address"
          name={order.shippingAddress.fullName}
          address={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
          postal={`${order.shippingAddress.postalCode}`}
        />

        {/* Billing Address (fallback to shipping if no billing address exists) */}
        <AddressCard
          title="Billing Address"
          name={order.shippingAddress.fullName}
          address={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
          postal={`${order.shippingAddress.postalCode}`}
        />
      </div>
    </div>
  );
};

export default OrderBookingManagementDetails;
