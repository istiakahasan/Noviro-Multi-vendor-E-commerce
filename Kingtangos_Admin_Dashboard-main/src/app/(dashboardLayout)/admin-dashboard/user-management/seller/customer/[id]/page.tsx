


// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useParams } from "next/navigation";
// import { useGetSingleUserQuery } from "@/redux/features/userManagement/userManagementApi";
// import PageLoader from "@/app/loading";

// const CustomerDetailsPage = () => {
//   const {id} =  useParams();
//   console.log(id);

//   const {data, isError, isLoading} = useGetSingleUserQuery(`${id}`);

//   console.log(data);
  
//   const [isDisableOpen, setIsDisableOpen] = useState(false);
//   const [isBanOpen, setIsBanOpen] = useState(false);

//   const orders = [
//     {
//       id: "#00745",
//       date: "Today at 6:58 pm",
//       status: "Completed",
//       items: 4,
//       amount: "$2,742.00",
//     },
//     {
//       id: "#00745",
//       date: "May 23 2025",
//       status: "Pending",
//       items: 7,
//       amount: "$2,742.00",
//     },
//     {
//       id: "#00745",
//       date: "May 23 2025",
//       status: "Completed",
//       items: 3,
//       amount: "$2,742.00",
//     },
//     {
//       id: "#00745",
//       date: "May 23 2025",
//       status: "Pending",
//       items: 4,
//       amount: "$2,742.00",
//     },
//     {
//       id: "#00745",
//       date: "May 23 2025",
//       status: "Canceled",
//       items: 5,
//       amount: "$2,742.00",
//     },
//   ];
//   const statusColors: Record<string, string> = {
//     Completed: "bg-green-100 text-green-700",
//     Pending: "bg-yellow-100 text-yellow-700",
//     Canceled: "bg-red-100 text-red-700",
//   };
//   if (isLoading) {
//     return <PageLoader/>;
//   }
//   if (isError) {
//     return <div>Error loading customer data.</div>;
//   }
//   return (
//     <>
//       <div className="max-w-7xl mx-auto ">
//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl font-semibold">Customer Details</h1>
          
//         </div>
//         {/* Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT: Customer Profile */}
//           <Card className="col-span-1 border border-gray-100 h-fit">
//             <CardContent className="flex flex-col items-center text-center py-6">
//               <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
//                 <Image
//                   src="https://i.ibb.co.com/ZzcCMzNx/3.webp"
//                   alt="Customer"
//                   width={96}
//                   height={96}
//                   className="object-cover"
//                 />
//               </div>
//               <h2 className="font-semibold text-lg">Nefetari D. Vivi</h2>
//               <p className="text-gray-500 text-sm">Nefetarid.vivi@gmail.com</p>
//               <p className="text-gray-500 text-sm mb-4">+2884927923479</p>
//               <div className="w-full border-t my-4" />
//               <div className="w-full text-left text-sm space-y-3">
//                 <div>
//                   <p className="text-gray-500">Last Order</p>
//                   <p>
//                     Today at 6:57 pm -{" "}
//                     <span className="text-blue-600 font-medium">#34683</span>
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Average Order Value</p>
//                   <p>$534.07</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Registration</p>
//                   <p>9 months ago</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-500">Email Marketing</p>
//                   <p className="font-medium">Subscribed</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           {/* RIGHT: Details Section */}
//           <div className="col-span-2 flex flex-col gap-6">
//             {/* Notes */}
//             <Card className="border border-gray-100">
//               <CardContent className="p-4 text-gray-400">
//                 Notes about customer
//               </CardContent>
//             </Card>
//             {/* Recent Orders */}
//             <Card className="border border-gray-100">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold">
//                   Recent Orders
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse min-w-[800px]">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                           Order ID
//                         </th>
//                         <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                           Date
//                         </th>
//                         <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                           Status
//                         </th>
//                         <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                           Items
//                         </th>
//                         <th className="px-4 py-3 text-xs font-medium text-gray-600">
//                           Amount
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {orders.map((order, i) => (
//                         <tr key={i} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm text-gray-700 font-medium">
//                             {order.id}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700">
//                             {order.date}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${statusColors[order.status]}`}
//                             >
//                               {order.status}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700">
//                             {order.items} Items
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700">
//                             {order.amount}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="text-center text-gray-500 mt-3 text-sm">
//                   View all 12 orders
//                 </div>
//               </CardContent>
//             </Card>
//             {/* Addresses */}
//             <Card className="border border-gray-100">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold">Addresses</CardTitle>
//               </CardHeader>
//               <CardContent className="text-sm">
//                 <div className="border-b pb-3 mb-3">
//                   <p className="font-medium">Nefetari D. Vivi</p>
//                   <p className="text-gray-500">
//                     Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-medium">Bou Hancock</p>
//                   <p className="text-gray-500">
//                     Random Federation 115302, Moscow ul. Varshavskaya, 15-2-178
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Disable Modal */}
//       <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-red-500 font-bold text-lg">Are you sure!</DialogTitle>
//             <DialogDescription className="text-gray-900">You want to disable this customer?</DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="justify-center space-x-2">
//             <Button variant="destructive" onClick={() => setIsDisableOpen(false)}>
//               Yes
//             </Button>
//             <Button onClick={() => setIsDisableOpen(false)}>No</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Ban Modal */}
//       <Dialog open={isBanOpen} onOpenChange={setIsBanOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-red-500 font-bold text-lg">Are you sure!</DialogTitle>
//             <DialogDescription className="text-gray-900">You want to ban this customer?</DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="justify-center space-x-2">
//             <Button variant="destructive" onClick={() => setIsBanOpen(false)}>
//               Yes
//             </Button>
//             <Button onClick={() => setIsBanOpen(false)}>No</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
// export default CustomerDetailsPage;

















"use client";
import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Mail, Calendar, Shield, User, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { useGetSingleUserQuery, UserData } from "@/redux/features/userManagement/userManagementApi";
import PageLoader from "@/app/loading";
import SendMessageButton from "@/app/(dashboardLayout)/admin-dashboard/chat/(component)/sendMessage";


const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleUserQuery(id);
  console.log(data);

  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);

  if (isLoading) return <PageLoader />;
  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">Failed to load user details.</p>
      </div>
    );
  }

  const user = data.data;
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const joinedDate = format(new Date(user.createdAt), "MMMM d, yyyy");
  const joinedTimeAgo = format(new Date(user.createdAt), "MMM d, yyyy");

  // Get orders (if available)
  const orders = user.orders || [];
  const hasOrders = orders.length > 0;

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
      DELIVERED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
      FAILED: "bg-red-100 text-red-800 border-red-200",
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{user.role.toLowerCase().replace("_", " ")} Details</h1>
          <p className="text-gray-500 text-sm mt-1">Complete profile and account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Customer Profile */}
          <Card className="col-span-1 border border-gray-200 shadow-sm h-fit">
            <CardContent className="flex flex-col items-center text-center py-8">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-blue-50 mb-4">
                {user.profilePic ? (
                  <Image
                    src={user.profilePic}
                    alt={fullName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              <h2 className="font-bold text-xl text-gray-900">{fullName}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className={`text-sm font-medium ${user.isVerified ? "text-emerald-600" : "text-orange-600"}`}>
                  {user.isVerified ? "Verified Account" : "Unverified"}
                </span>
              </div>
              <SendMessageButton userType={user.role.toLowerCase().replace("_", " ")} receiverId={user.id} className="ml-2" nextUrl={`/admin-dashboard/chat`} />

              <div className="w-full border-t border-gray-200 my-6" />

              <div className="w-full text-left space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">User Role</span>
                  <span className="font-medium capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium">{joinedTimeAgo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subscription</span>
                  <span className={`font-medium ${user.isSubscribed ? "text-emerald-600" : "text-gray-500"}`}>
                    {user.isSubscribed ? "Active" : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Status</span>
                  <span className="font-medium text-emerald-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-gray-500 italic">No admin notes added yet.</p>
              </CardContent>
            </Card>

            {/* Recent Orders - Table Format */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  Recent Orders
                  {hasOrders && (
                    <span className="ml-auto text-sm font-normal text-gray-500">
                      {orders.length} {orders.length === 1 ? "order" : "orders"}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasOrders ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">
                                #{order.id.slice(0, 8)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {format(new Date(order.createdAt), "MMM d, yyyy")}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {order.orderItems.length} {order.orderItems.length === 1 ? "item" : "items"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-gray-900">
                                ${order.totalAmount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="capitalize text-gray-600">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border inline-block w-fit ${getStatusColor(order.orderStatus)}`}>
                                  {order.orderStatus}
                                </span>
                                {/* <span className={`px-2 py-1 rounded-full text-xs font-medium border inline-block w-fit ${getStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus}
                                </span> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 border-2 border-dashed rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No orders placed yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This user hasn&apos;t made any purchases.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Addresses */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-sm">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {fullName}
                  </p>
                  <p className="text-gray-500 italic">No shipping address provided</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <p className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    {fullName}
                  </p>
                  <p className="text-gray-500 italic">No billing address provided</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs - unchanged */}
      <Dialog open={isDisableOpen} onOpenChange={setIsDisableOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-lg">Disable Account</DialogTitle>
            <DialogDescription>Are you sure you want to disable this customer?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-4">
            <Button variant="outline" onClick={() => setIsDisableOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setIsDisableOpen(false)}>Disable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBanOpen} onOpenChange={setIsBanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-lg">Ban User</DialogTitle>
            <DialogDescription>Are you sure you want to permanently ban this user?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-4">
            <Button variant="outline" onClick={() => setIsBanOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setIsBanOpen(false)}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerDetailsPage;