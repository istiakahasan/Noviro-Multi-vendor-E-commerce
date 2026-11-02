'use client';


import React, { useState } from 'react';
// import { GoGear } from 'react-icons/go';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useGetWeeklyAvailabilityQuery, useUpdateSingleDayAvailabilityMutation } from '@/redux/api/scheduleManagement/scheduleApi';

interface DayData {
  dayName: string;
  displayName: string;
  time: string;
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

const SkeletonRow = () => (
  <li className="flex items-center justify-between mb-5 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-300" />
      <div className="h-5 w-24 bg-gray-200 rounded" />
    </div>
    <div className="flex justify-center items-center gap-5">
      <div className="h-7 w-28 bg-gray-200 rounded-xl" />
      <div className="h-5 w-5 bg-gray-200 rounded-full" />
    </div>
  </li>
);

const WeeklyAvailability = () => {
  const { data: response, isLoading, error } = useGetWeeklyAvailabilityQuery();
  const [updateDay, { isLoading: isUpdating }] = useUpdateSingleDayAvailabilityMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const availabilityData = response?.data
    ?.map((item) => ({
      dayName: item.dayName.toLowerCase(),
      displayName: item.dayName.charAt(0).toUpperCase() + item.dayName.slice(1).toLowerCase(),
      time:
        !item.isAvailable || item.startTime === "00:00"
          ? "Unavailable"
          : `${item.startTime.slice(0, 5)} - ${item.endTime.slice(0, 5)}`,
      dayOfWeek: item.dayOfWeek,
      isAvailable: item.isAvailable,
      startTime: item.startTime.slice(0, 5),
      endTime: item.endTime.slice(0, 5),
    }))
    .sort((a, b) => {
      const order = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      return order.indexOf(a.dayName) - order.indexOf(b.dayName);
    });

  const openModal = (day: DayData) => {
    setSelectedDay(day);
    setIsAvailable(day.isAvailable);
    setStartTime(day.isAvailable ? day.startTime : "09:00");
    setEndTime(day.isAvailable ? day.endTime : "17:00");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedDay) return;

    toast.promise(
      updateDay({
        dayOfWeek: selectedDay.dayOfWeek,
        isAvailable,
        startTime: isAvailable ? startTime : "00:00",
        endTime: isAvailable ? endTime : "00:00",
      }).unwrap(),
      {
        loading: "Updating...",
        success: `${selectedDay.displayName} updated!`,
        error: "Failed to update.",
      }
    );
    setModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Weekly Availability</h3>
        <ul className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </ul>
      </div>
    );
  }

  if (error || !availabilityData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Weekly Availability</h3>
        <p className="text-sm text-red-500">Failed to load availability</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Weekly Availability</h3>
        <ul className="space-y-3">
          {availabilityData.map((day) => (
            <li key={day.dayName} className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    day.time === "Unavailable" ? "bg-gray-300" : "bg-green-500"
                  }`}
                />
                <span className="capitalize">{day.displayName}</span>
              </div>
              <div className="flex justify-center items-center gap-5">
                <span
                  className={`text-sm ${
                    day.time === "Unavailable"
                      ? "text-gray-400"
                      : "font-medium bg-gray-100 py-1 px-2 rounded-xl"
                  }`}
                >
                  {day.time}
                </span>
                <button onClick={() => openModal(day)}>
                  {/* <GoGear size={20} className="text-gray-600 hover:text-black transition" /> */}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Beautiful Modal - Matches Your Image Exactly */}
      {modalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-5 border-b ${isAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{selectedDay.displayName}</h3>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isAvailable
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {isAvailable ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Start Time</label>
                      <div className="relative">
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">End Time</label>
                      <div className="relative">
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">No working hours · Day off</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-60"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeeklyAvailability;