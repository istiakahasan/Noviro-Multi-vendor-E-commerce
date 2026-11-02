// import React, { useState } from "react";

// const days = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ];

// const WeeklyAvailability = () => {
//   const [availability, setAvailability] = useState(
//     days.map((day) => ({
//       day,
//       enabled: day !== "sunday",
//       start: "09:00 AM",
//       end: "05:00 PM",
//     }))
//   );

//   const toggleDay = (index: number) => {
//     const updated = [...availability];
//     updated[index].enabled = !updated[index].enabled;
//     setAvailability(updated);
//   };

//   const handleTimeChange = (index: number, field: "start" | "end", value: string) => {
//     const updated = [...availability];
//     updated[index][field] = value;
//     setAvailability(updated);
//   };

//   return (
//     <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
//       <h3 className="font-semibold text-gray-900 mb-4">Weekly Availability</h3>

//       <div className="space-y-3">
//         {availability.map((item, index) => (
//           <div
//             key={item.day}
//             className="flex items-center justify-between border-b border-gray-100 last:border-none pb-2 text-sm"
//           >
//             {/* Left side: toggle + label */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => toggleDay(index)}
//                 className={`relative w-10 h-5 rounded-full transition-colors ${
//                   item.enabled ? "bg-black" : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform ${
//                     item.enabled ? "translate-x-5" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//               <span className="capitalize">{item.day}</span>
//             </div>

//             {/* Right side: time inputs */}
//             {item.enabled ? (
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={item.start}
//                   onChange={(e) => handleTimeChange(index, "start", e.target.value)}
//                   className="w-24 h-8 text-xs border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   placeholder="09:00 AM"
//                 />
//                 <span className="text-gray-400">to</span>
//                 <input
//                   type="text"
//                   value={item.end}
//                   onChange={(e) => handleTimeChange(index, "end", e.target.value)}
//                   className="w-24 h-8 text-xs border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//                   placeholder="05:00 PM"
//                 />
//               </div>
//             ) : (
//               <span className="text-gray-400 text-xs">Unavailable</span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeeklyAvailability;

"use client";

import {
  useGetWeeklyAvailabilityQuery,
  useUpdateSingleDayAvailabilityMutation,
} from "@/lib/api/scheduleManagement/scheduleApi";
import React, { useEffect, useState } from "react";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const WeeklyAvailability = () => {
  const { data, isLoading } = useGetWeeklyAvailabilityQuery();
  const [updateDay] = useUpdateSingleDayAvailabilityMutation();

  const [availability, setAvailability] = useState(
    days.map((day) => ({
      day,
      enabled: false,
      start: "09:00",
      end: "17:00",
    }))
  );

  // === Load API Data ===
  useEffect(() => {
    if (!data?.data) return;

    const mapped = days.map((day, index) => {
      const db = data.data.find((d) => d.dayOfWeek === index); // Sunday = 0

      return {
        day,
        enabled: db?.isAvailable ?? false,
        start: db?.startTime || "09:00",
        end: db?.endTime || "17:00",
      };
    });

    setAvailability(mapped);
  }, [data]);

  // === Toggle Day ===
  const toggleDay = async (index: number) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);

    await updateDay({
      dayOfWeek: index,
      startTime: updated[index].start,
      endTime: updated[index].end,
      isAvailable: updated[index].enabled,
    });
  };

  // === Time Change ===
  const handleTimeChange = async (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);

    await updateDay({
      dayOfWeek: index,
      startTime: updated[index].start,
      endTime: updated[index].end,
      isAvailable: updated[index].enabled,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          Weekly Availability
        </h3>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Weekly Availability</h3>

      <div className="space-y-3">
        {availability.map((item, index) => (
          <div
            key={item.day}
            className="flex items-center justify-between border-b border-gray-100 last:border-none pb-2 text-sm"
          >
            {/* Left: toggle + day */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDay(index)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  item.enabled ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform ${
                    item.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>

              <span className="capitalize">{item.day}</span>
            </div>

            {/* Right: time settings */}
            {item.enabled ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.start}
                  onChange={(e) =>
                    handleTimeChange(index, "start", e.target.value)
                  }
                  className="w-24 h-8 text-xs border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="09:00"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="text"
                  value={item.end}
                  onChange={(e) =>
                    handleTimeChange(index, "end", e.target.value)
                  }
                  className="w-24 h-8 text-xs border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="17:00"
                />
              </div>
            ) : (
              <span className="text-gray-400 text-xs">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyAvailability;
