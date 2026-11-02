// "use client";

// import React from "react";

// const schedules = [
//   {
//     time: "09:00 AM",
//     name: "Emma Wilson",
//     detail: "Hair Styling Consultation",
//     color: "text-purple-600",
//     status: "Scheduled",
//     statusColor: "bg-[#28A745]/10 text-[#28A745]",
//   },
//   {
//     time: "11:30 AM",
//     name: "Michael Chen",
//     detail: "Personal Training Session",
//     color: "text-green-600",
//     status: "Scheduled",
//     statusColor: "bg-[#28A745]/10 text-[#28A745]",
//   },
//   {
//     time: "02:00 PM",
//     name: "Sarah Davis",
//     detail: "Nutrition Consultation",
//     color: "text-purple-600",
//     status: "Pending",
//     statusColor: "bg-[#FF5722]/10 text-[#FF5722]",
//   },
//   {
//     time: "04:30 PM",
//     name: "James Brown",
//     detail: "Yoga Session",
//     color: "text-green-600",
//     status: "Scheduled",
//     statusColor: "bg-[#28A745]/10 text-[#28A745]",
//   },
//   {
//     time: "06:00 PM",
//     name: "Lisa Garcia",
//     detail: "Beauty Consultation",
//     color: "text-purple-600",
//     status: "Scheduled",
//     statusColor: "bg-[#28A745]/10 text-[#28A745]",
//   },
// ];

// const TodaysSchedule: React.FC = () => {
//   return (
//     <section className="bg-white- p-6 rounded-lg shadow-sm ">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         Today&apos;s Schedule
//       </h2>

//       <div className="space-y-4">
//         {schedules.map((item, index) => (
//           <div key={index} className="flex items-center bg-[#F9FAFB] px-4 py-2 rounded-lg  space-x-5">
//             <div className="text-lg font-medium text-gray-600 min-w-[60px]">
//               {item.time}
//             </div>

//             <div className="flex-1">
//               <h4 className="font-semibold text-gray-800">{item.name}</h4>
//               <p className={item.color}>{item.detail}</p>
//             </div>

//             <span
//               className={`px-3 py-2 rounded-lg  text-sm font-medium ${item.statusColor}`}
//             >
//               {item.status}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default TodaysSchedule;

"use client";

import { useGetTodaysScheduleQuery } from "@/lib/api/users/userApi";
import { format } from "date-fns";

const TodaysSchedule: React.FC = () => {
  const {
    data: scheduleData,
    isLoading,
    isError,
    error,
  } = useGetTodaysScheduleQuery();

  // Handle loading state
  if (isLoading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today&apos;s Schedule
        </h2>
        <p className="text-gray-500 text-center py-8">
          Loading today&apos;s bookings...
        </p>
      </section>
    );
  }

  // Handle error
  if (isError) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today&apos;s Schedule
        </h2>
        <p className="text-red-500 text-center py-8">
          Failed to load schedule. Please try again.
        </p>
      </section>
    );
  }

  const bookings = scheduleData?.data?.todaySchedule || [];

  // const bookings = [
  //           {
  //               "id": "0cbf6a1c-b95b-4071-99fd-aa60b1c4e4fb",
  //               "serviceId": "933e628c-049a-4979-8bc4-63ca1398066a",
  //               "specialistId": "22f719f5-53cc-403e-a22e-481a5a18277e",
  //               "userId": "938a378b-3898-4587-aa39-901b74e25e1b",
  //               "bookingDate": "2025-11-16T18:00:00.000Z",
  //               "startTime": "2025-11-17T09:00:00.000Z",
  //               "endTime": "2025-11-17T09:30:00.000Z",
  //               "status": "CONFIRMED",
  //               "createdAt": "2025-11-16T04:12:41.675Z",
  //               "updatedAt": "2025-11-16T04:12:41.675Z",
  //               "user": {
  //                   "id": "938a378b-3898-4587-aa39-901b74e25e1b",
  //                   "firstName": "Super",
  //                   "lastName": "Admin",
  //                   "email": "hasansanim562@gmail.com",
  //                   "password": "$2b$12$DFFHghTenVDe7OQMENyUPeSfn3fdMNp3QXJyvwZWEEbFRFuYjA6U6",
  //                   "profilePic": "",
  //                   "passwordChangedAt": null,
  //                   "isVerified": true,
  //                   "isResetPassword": false,
  //                   "canResetPassword": false,
  //                   "isResentOtp": false,
  //                   "role": "SUPER_ADMIN",
  //                   "isSubscribed": false,
  //                   "planExpiration": null,
  //                   "resetPasswordOTP": null,
  //                   "resetPasswordOTPExpiresAt": null,
  //                   "createdAt": "2025-11-08T08:51:08.830Z",
  //                   "updatedAt": "2025-11-08T08:51:08.830Z"
  //               },
  //               "service": {
  //                   "id": "933e628c-049a-4979-8bc4-63ca1398066a",
  //                   "storeId": "9cbf8992-a691-4865-8cb7-b2f81febbb2b",
  //                   "categoryId": "243d510a-ccc4-4e96-8674-783f201c3373",
  //                   "serviceTypeId": "e9f901c3-1a3d-41a5-994e-783ea8604845",
  //                   "name": "Premium Hair Styling & Cut",
  //                   "profilePic": null,
  //                   "price": 1500,
  //                   "description": "Get a professional haircut and styling service from our expert stylists. Includes wash, cut, and blow dry.",
  //                   "duration": "9 hours",
  //                   "location": "Dhaka, Bangladesh",
  //                   "slotDuration": 30,
  //                   "subCategoryId": "7138a911-0d04-46c2-a245-863c35f92358",
  //                   "startDate": "2025-11-12T00:00:00.000Z",
  //                   "endDate": "2026-01-01T00:00:00.000Z",
  //                   "startTime": "2025-11-11T09:00:00.000Z",
  //                   "endTime": "2025-11-11T18:00:00.000Z",
  //                   "tags": [
  //                       "trending",
  //                       "popular",
  //                       "premium",
  //                       "mens-grooming"
  //                   ],
  //                   "averageRating": 0,
  //                   "totalReviews": 0,
  //                   "totalSlot": 10,
  //                   "createdAt": "2025-11-10T08:50:09.331Z",
  //                   "updatedAt": "2025-11-10T08:50:09.331Z"
  //               }
  //           }
  //       ];

  // If no bookings today
  if (bookings.length === 0) {
    return (
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today&apos;s Schedule
        </h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No bookings today</p>
          <p className="text-sm mt-2">Enjoy your day off!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Today&apos;s Schedule
      </h2>

      {/* Optional: Show the message from API */}
      {scheduleData?.data?.message && (
        <p className="text-sm text-gray-600 mb-4 italic">
          {scheduleData.data.message}
        </p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => {
          // Format time from startTime (e.g., "2025-11-17T09:00:00.000Z" → "09:00 AM")
          const time = new Date(booking.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "UTC",
          });

          // Determine status color
          const statusColor =
            booking.status === "CONFIRMED"
              ? "bg-[#28A745]/10 text-[#28A745]" // Green
              : booking.status === "PENDING"
                ? "bg-[#FF5722]/10 text-[#FF5722]" // Orange
                : "bg-gray-100 text-gray-700";

          // Color for service name (you can customize based on service type)
          // const serviceColor = booking.service.name.toLowerCase().includes('hair')
          //   ? 'text-purple-600'
          //   : 'text-green-600';

          // Safe color based on service name
          const serviceName = booking.service?.name || "";
          const serviceColor = serviceName.toLowerCase().includes("hair")
            ? "text-purple-600"
            : "text-green-600";

          return (
            <div
              key={booking.id}
              className="flex items-center bg-[#F9FAFB] px-4 py-3 rounded-lg space-x-5"
            >
              <div className="text-lg font-medium text-gray-600 min-w-[80px]">
                {time}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {booking.user.firstName} {booking.user.lastName}
                </h4>
                <p className={`text-sm ${serviceColor}`}>
                  {booking?.service?.name}
                  {/* {booking?.service?.name || 'Unknown Service'} */}
                </p>
              </div>

              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColor}`}
              >
                {booking.status}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TodaysSchedule;
