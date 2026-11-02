"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useGetWeeklyAvailabilityQuery, useSetWeeklyAvailabilityMutation } from "@/redux/api/scheduleManagement/scheduleApi";
import PageLoading from "@/components/shared/PageLoading";


type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

interface DayAvailability {
  day: DayOfWeek;
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

// Default fallback (only used if API fails)
const defaultAvailability: DayAvailability[] = [
  { day: "Sunday", dayOfWeek: 0, isAvailable: false, startTime: "00:00", endTime: "00:00" },
  { day: "Monday", dayOfWeek: 1, isAvailable: true, startTime: "09:00", endTime: "17:00" },
  { day: "Tuesday", dayOfWeek: 2, isAvailable: true, startTime: "09:00", endTime: "17:00" },
  { day: "Wednesday", dayOfWeek: 3, isAvailable: true, startTime: "09:00", endTime: "17:00" },
  { day: "Thursday", dayOfWeek: 4, isAvailable: true, startTime: "09:00", endTime: "17:00" },
  { day: "Friday", dayOfWeek: 5, isAvailable: true, startTime: "09:00", endTime: "16:00" },
  { day: "Saturday", dayOfWeek: 6, isAvailable: true, startTime: "10:00", endTime: "15:00" },
];

const WeeklyAvailabilityPage = () => {
  const [availability, setAvailability] = useState<DayAvailability[]>(defaultAvailability);

  // Fetch current availability from backend
  const {
    data: fetchedData,
    isLoading: loadingData,
  } = useGetWeeklyAvailabilityQuery();

  const [setWeeklyAvailability, { isLoading: saving }] = useSetWeeklyAvailabilityMutation();

  // Load real data when fetched
  useEffect(() => {
    if (fetchedData?.data) {
      const mapped = fetchedData.data.map((item) => ({
        day:
          item.dayName.charAt(0).toUpperCase() +
          item.dayName.slice(1).toLowerCase() as DayOfWeek,
        dayOfWeek: item.dayOfWeek,
        isAvailable: item.isAvailable,
        startTime: item.isAvailable ? item.startTime.slice(0, 5) : "00:00",
        endTime: item.isAvailable ? item.endTime.slice(0, 5) : "00:00",
      }));

      // Sort by dayOfWeek to ensure correct order
      const sorted = mapped.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      setAvailability(sorted);
    }
  }, [fetchedData]);

  const toggleAvailability = (index: number) => {
    setAvailability((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              isAvailable: !item.isAvailable,
              startTime: !item.isAvailable ? "09:00" : "00:00",
              endTime: !item.isAvailable ? "17:00" : "00:00",
            }
          : item
      )
    );
  };

  const updateTime = (index: number, field: "startTime" | "endTime", value: string) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    const payload = {
      availability: availability.map(({ dayOfWeek, startTime, endTime, isAvailable }) => ({
        dayOfWeek,
        startTime: isAvailable ? startTime : "00:00",
        endTime: isAvailable ? endTime : "00:00",
        isAvailable,
      })),
    };

    toast.promise(setWeeklyAvailability(payload).unwrap(), {
      loading: (
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Saving your weekly schedule...
        </div>
      ),
      success: () => (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <span className="font-medium">Availability updated successfully!</span>
        </div>
      ),
      error: "Failed to save availability. Please try again.",
    });
  };

  // Show loading spinner while fetching
  if (loadingData) {
    return (
      <PageLoading/>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weekly Availability</h1>
          <p className="text-gray-600 mt-2">
            Set your working hours for each day of the week
          </p>
        </div>

        <div className="space-y-4">
          {availability.map((slot, index) => (
            <div
              key={slot.day}
              className={`p-5 rounded-xl border-1 transition-all ${
                slot.isAvailable
                  ? "border-green-100 bg-green-50/20"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{slot.day}</h3>

                <button
                  onClick={() => toggleAvailability(index)}
                  className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                    slot.isAvailable
                      ? "border border-green-400 hover:text-white hover:bg-green-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {slot.isAvailable ? "Available" : "Unavailable"}
                </button>
              </div>

              {slot.isAvailable && (
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTime(index, "startTime", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTime(index, "endTime", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {!slot.isAvailable && (
                <p className="text-gray-500 italic">No working hours • Day off</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => setAvailability(defaultAvailability)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Reset to Default
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium flex items-center gap-3 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyAvailabilityPage;