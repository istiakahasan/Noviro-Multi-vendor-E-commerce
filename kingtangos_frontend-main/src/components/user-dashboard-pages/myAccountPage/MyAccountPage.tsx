// "use client";
// import React from "react";
// import { MdOutlineKeyboardArrowRight } from "react-icons/md";

// // import processing from "@/assets/user-dashboard/processing.png";
// // import complete from "@/assets/user-dashboard/complete.png";
// // import shipped from "@/assets/user-dashboard/shipped.png";
// // import returns from "@/assets/user-dashboard/returns.png";
// // import Image from "next/image";
// import { useUserDashboardOverviewsQuery } from "@/redux/api/userDashbord/userDashbordApi";

// export default function MyAccountPage() {
//   const { data, isLoading, isError } = useUserDashboardOverviewsQuery({});

//   console.log(data, isLoading, isError); // TODO: Fetch data from userDashboardOverviews API
//   return (
//     <div className="p-6">
//       <div className="bg-white p-5 rounded-xl shadow-sm">
//         <div className="flex flex-wrap justify-between border-b-2 pb-4">
//           <p className="text-xl text-primary">Hi, Towhidul Islam</p>
//           <div className="flex gap-2 items-center cursor-pointer">
//             <p className="text-xl text-primary">My Profile</p>
//             <MdOutlineKeyboardArrowRight className="text-2xl" />
//           </div>
//         </div>

//         <div className="grid xl:grid-cols-7 lg:grid-cols-4 md:grid-cols-3 grid-cols-1 justify-between">
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">10</h2>
//             <p className="text-xl text-primary">Products</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">18</h2>
//             <p className="text-xl text-primary">Services</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">18</h2>
//             <p className="text-xl text-primary">Consultations</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">08</h2>
//             <p className="text-xl text-primary">Subscriptions</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">08</h2>
//             <p className="text-xl text-primary">Coupon</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">35</h2>
//             <p className="text-xl text-primary">Wishlists</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <h2 className="text-4xl font-semibold text-primary">100</h2>
//             <p className="text-xl text-primary">Views</p>
//           </div>
//         </div>
//       </div>

//       {/* <div className="bg-white p-5 rounded-xl shadow-sm mt-10">
//         <div className="flex flex-wrap justify-between border-b-2 pb-4">
//           <p className="text-xl text-primary">My Orders</p>
//           <div className="flex gap-2 items-center cursor-pointer">
//             <p className="text-xl text-primary">View All</p>
//             <MdOutlineKeyboardArrowRight className="text-2xl" />
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-between">
//           <div className="flex flex-col justify-center items-center pt-7">
//             <Image src={processing} height={48} width={48} alt="" />
//             <p className="text-xl text-primary">Processing</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <Image src={complete} height={48} width={48} alt="" />
//             <p className="text-xl text-primary">Complete</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <Image src={shipped} height={48} width={48} alt="" />
//             <p className="text-xl text-primary">Shipped</p>
//           </div>
//           <div className="flex flex-col justify-center items-center pt-7">
//             <Image src={returns} height={48} width={48} alt="" />
//             <p className="text-xl text-primary">Returns</p>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// }

"use client";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  useAuthMeQuery,
  useUserDashboardOverviewsQuery,
} from "@/redux/api/userDashbord/userDashbordApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const { data, isLoading, isError } = useUserDashboardOverviewsQuery({});
  const {
    data: authData,
    isLoading: loadingUser,
    isError: errorUser,
  } = useAuthMeQuery(undefined);
  const router = useRouter();

  console.log(authData);

  const userName = authData?.data?.firstName + " " + authData?.data?.lastName; // Replace with actual user name from auth state

  const overview = data?.data || {
    product: 0,
    service: 0,
    consultations: 0,
    subscription: 0,
    wishlist: 0,
    cartItems: 0,
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (errorUser) {
    return (
      <div className="min-hereen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load user data.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome & Profile Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
          <p className="text-xl font-semibold text-primary">Hi, {userName}</p>
          <div
            onClick={() => router.push("/user/profile")}
            className="flex items-center gap-2 cursor-pointer hover:text-primary/80 transition-colors corsor-pointer"
          >
            <p className="text-lg font-medium text-primary">My Profile</p>
            <MdOutlineKeyboardArrowRight className="text-2xl text-primary" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-row items-center justify-between">
          {/* Products */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-primary">
              {overview.product}
            </h2>
            <p className="text-lg text-gray-600 mt-1">Products</p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-primary">
              {overview.service}
            </h2>
            <p className="text-lg text-gray-600 mt-1">Services</p>
          </div>

          {/* Consultations */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-primary">
              {overview.consultations}
            </h2>
            <p className="text-lg text-gray-600 mt-1">Consultations</p>
          </div>

          {/* Subscriptions */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-primary">
              {overview.subscription}
            </h2>
            <p className="text-lg text-gray-600 mt-1">Subscriptions</p>
          </div>

          {/* Wishlists */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold text-primary">
              {overview.wishlist}
            </h2>
            <p className="text-lg text-gray-600 mt-1">Wishlists</p>
          </div>
        </div>
      </div>

      {/* Optional: My Orders Section (Uncomment when ready) */}
      {false && (
        <div className="bg-white p-5 rounded-xl shadow-sm mt-10">
          <div className="flex flex-wrap justify-between items-center border-b-2 border-gray-100 pb-4 mb-6">
            <p className="text-xl font-semibold text-primary">My Orders</p>
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary/80 transition-colors">
              <p className="text-lg font-medium text-primary">View All</p>
              <MdOutlineKeyboardArrowRight className="text-2xl text-primary" />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
            {/* Add order status cards here later */}
          </div>
        </div>
      )}
    </div>
  );
}
