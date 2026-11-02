/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ServiceSlotResponse } from '@/types/serviceSlotResponse.type';
import React, { useState } from 'react';

type TimeSelectorProps = {

  serviceBookingSlots?: ServiceSlotResponse;
  onTimeSelect?: (time: string) => void;
};

const TimeSelector: React.FC<TimeSelectorProps> = ({ serviceBookingSlots, onTimeSelect }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSlotClick = (slot: any) => {
    // Your existing click handler logic...

    // Add this to notify parent component
    if (onTimeSelect && slot.isAvailable) {
      onTimeSelect(slot.startTime);
    }
  };

  const timeSlots = serviceBookingSlots?.data?.availableSlots || [];

  const formatTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC', // Ensure consistent timezone handling
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return isoString;
    }
  };

  return (
    <div className={`w-full max-w-md ${timeSlots.length > 6 ? 'max-h-[350px] overflow-y-auto pr-2' : ''}`}>
      {timeSlots.length > 0 ? (
        <div className={`space-y-3 ${timeSlots.length > 6 ? 'pb-4' : ''}`}>
          {timeSlots.map((slot: any) => {
            const displayTime = formatTime(slot.startTime);
            const isSelected = selectedTime === slot.startTime;

            return (
              <button
                key={slot.startTime}
                onClick={() => {
                  setSelectedTime(slot.startTime);
                  handleTimeSlotClick(slot);
                }}

                className={`w-full px-4 py-3 rounded-md border text-left text-sm transition-all duration-200
              ${isSelected ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-300 text-gray-800 bg-gray-100 hover:bg-gray-200'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{displayTime}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50 min-h-[350px] flex flex-col justify-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">No date selected</h3>
          <p className="text-gray-600 text-sm">
            Please choose an available date from the calendar to view time slots
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
