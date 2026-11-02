'use client';

import React from 'react';
import { Clock, Video, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useGetUpcomingAppointmentSpecialistQuery } from '@/redux/api/scheduleManagement/scheduleApi';

interface Service {
  id: string;
  name: string;
  price: number;
  slotDuration: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Booking {
  id: string;
  serviceId: string;
  specialistId: string;
  userId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  service: Service | null;
  user: User | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Booking[];
}

const UpcomingAppointments: React.FC = () => {
  const { data: response, isLoading, error } = useGetUpcomingAppointmentSpecialistQuery() as {
    data: ApiResponse | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // Transform real API data with null checks
  const appointments = response?.data
    ?.filter((booking) => booking.service && booking.user) // Filter out bookings with null service or user
    ?.map((booking) => {
      const startDate = new Date(booking.startTime);
      const date = format(startDate, 'yyyy-MM-dd');
      const time = format(startDate, 'HH:mm');
      const day = format(startDate, 'MMM dd'); // e.g., Nov 17
      const fullTime = `${day} at ${time}`;

      // Determine type: if it's a video call → consultation, else → service
      const isConsultation =
        booking.service!.name.toLowerCase().includes('consultation') ||
        booking.service!.name.toLowerCase().includes('call') ||
        booking.service!.slotDuration <= 30;

      return {
        id: booking.id,
        name: `${booking.user!.firstName} ${booking.user!.lastName}`,
        time: fullTime,
        type: isConsultation ? 'consultation' : 'service',
        rawDate: startDate,
      };
    })
    .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime()); // Sort by date

  const getTypeConfig = (type: string) => {
    if (type === 'consultation') {
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        icon: Video,
      };
    }
    return {
      bg: 'bg-green-100',
      text: 'text-green-600',
      icon: MapPin,
    };
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between bg-gray-50 p-4 rounded-2xl items-center animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <div>
                  <div className="h-5 w-32 bg-gray-300 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded mt-2" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error or No Appointments
  if (error || !appointments || appointments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Upcoming Appointments</h3>
        <p className="text-center text-gray-500 py-8">
          {error ? "Failed to load appointments" : "No upcoming appointments"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Upcoming Appointments</h3>
      <ul className="space-y-3">
        {appointments.map((item) => {
          const TypeIcon = getTypeConfig(item.type).icon;
          return (
            <li
              key={item.id}
              className="flex justify-between bg-gray-50 p-4 rounded-2xl items-center hover:bg-gray-100 transition"
            >
              <div className="flex items-center">
                <Clock size={16} className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <TypeIcon size={14} className={getTypeConfig(item.type).text} />
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getTypeConfig(item.type).bg} ${getTypeConfig(item.type).text}`}
                >
                  {item.type === 'consultation' ? 'Consultation' : 'Service'}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingAppointments;