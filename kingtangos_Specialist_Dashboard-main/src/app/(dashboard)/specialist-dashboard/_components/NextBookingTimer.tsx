// "use client";

// import React, { useEffect, useState } from "react";

// const NextBookingTimer: React.FC = () => {
//   // Example: next booking starts in 45 minutes 32 seconds
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 0,
//     minutes: 45,
//     seconds: 32,
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         let { hours, minutes, seconds } = prev;

//         if (seconds > 0) {
//           seconds--;
//         } else if (minutes > 0) {
//           minutes--;
//           seconds = 59;
//         } else if (hours > 0) {
//           hours--;
//           minutes = 59;
//           seconds = 59;
//         } else {
//           clearInterval(timer);
//         }

//         return { hours, minutes, seconds };
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Format to always show 2 digits
//   const formatTime = (val: number) => val.toString().padStart(2, "0");

//   return (
//     <section className="bg-gradient-to-r from-[#77D9E4] to-[#16CA97] border border-cyan-200 px-4 py-3 rounded-lg shadow-sm">
//       <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
//         Your next booking will start in
//       </h3>

//       <div className="flex justify-center space-x-4 font-semibold">
//         <span className="py-1 px-2 bg-[#F8F8F8]/40 text-base text-black/80 rounded-md">{formatTime(timeLeft.hours)}</span>
//         {/* <span className="text-gray-200">:</span> */}
//         <span className="py-1 px-2 bg-[#F8F8F8]/40 text-base text-black/80 rounded-md">{formatTime(timeLeft.minutes)}</span>
//         {/* <span className="text-gray-200">:</span> */}
//         <span className="py-1 px-2 bg-[#F8F8F8]/40 text-base text-black/80 rounded-md">{formatTime(timeLeft.seconds)}</span>
//       </div>

//       <div className="flex justify-center space-x-6 text-xs text-[#333333] mt-2">
//         <span>Hrs</span>
//         <span>Mins</span>
//         <span>Sec</span>
//       </div>
//     </section>
//   );
// };

// export default NextBookingTimer;

"use client";

import { useGetMyBookingsAsSpecialistQuery } from "@/lib/bookings/bookingApi";
import React, { useEffect, useState } from "react";

const NextBookingTimer = () => {
  const { data, isLoading } = useGetMyBookingsAsSpecialistQuery({
    page: 1,
    limit: 100,
  });

  const [nextBookingDate, setNextBookingDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // -----------------------------
  // FIND NEXT BOOKING
  // -----------------------------
  useEffect(() => {
    if (!data?.data) return;

    const now = new Date();
    const upcoming = data.data
      .map((b) => ({
        ...b,
        wallStartTime: new Date(b.startTime.replace("Z", "")),
      }))
      .filter((b) => b.wallStartTime > now)
      .sort((a, b) => a.wallStartTime.getTime() - b.wallStartTime.getTime())[0];

    setNextBookingDate(upcoming ? upcoming.wallStartTime : null);
  }, [data]);

  // -----------------------------
  // COUNTDOWN
  // -----------------------------
  useEffect(() => {
    if (!nextBookingDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextBookingDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextBookingDate]);

  const format = (v: number) => v.toString().padStart(2, "0");

  // -----------------------------
  // SKELETON LOADER
  // -----------------------------
  if (isLoading) {
    return (
      <section className="bg-linear-to-r from-[#77D9E4] to-[#16CA97] border border-cyan-200 px-4 py-4 rounded-lg shadow-sm animate-pulse">
        <div className="h-4 w-48 bg-white/40 mx-auto rounded mb-4"></div>

        <div className="flex justify-center space-x-3">
          <div className="h-8 w-10 bg-white/50 rounded-md"></div>
          <div className="h-8 w-10 bg-white/50 rounded-md"></div>
          <div className="h-8 w-10 bg-white/50 rounded-md"></div>
          <div className="h-8 w-10 bg-white/50 rounded-md"></div>
        </div>

        <div className="flex justify-center space-x-6 mt-3">
          <div className="h-3 w-8 bg-white/30 rounded"></div>
          <div className="h-3 w-8 bg-white/30 rounded"></div>
          <div className="h-3 w-8 bg-white/30 rounded"></div>
          <div className="h-3 w-8 bg-white/30 rounded"></div>
        </div>
      </section>
    );
  }

  // -----------------------------
  // NO UPCOMING BOOKING
  // -----------------------------
  if (!isLoading && !nextBookingDate) {
    return (
      <div className="bg-white border px-4 py-4 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No upcoming bookings
        </h3>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <section className="bg-linear-to-r from-[#77D9E4] to-[#16CA97] border border-cyan-200 px-4 py-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
        Your next booking will start in
      </h3>

      <div className="flex justify-center space-x-3 font-semibold">
        <span className="py-1 px-2 bg-white/40 text-base text-black/80 rounded-md">
          {format(timeLeft.days)}
        </span>

        <span className="py-1 px-2 bg-white/40 text-base text-black/80 rounded-md">
          {format(timeLeft.hours)}
        </span>

        <span className="py-1 px-2 bg-white/40 text-base text-black/80 rounded-md">
          {format(timeLeft.minutes)}
        </span>

        <span className="py-1 px-2 bg-white/40 text-base text-black/80 rounded-md">
          {format(timeLeft.seconds)}
        </span>
      </div>

      <div className="flex justify-center space-x-6 text-xs text-[#333333] mt-2">
        <span>Days</span>
        <span>Hours</span>
        <span>Mins</span>
        <span>Sec</span>
      </div>
    </section>
  );
};

export default NextBookingTimer;
