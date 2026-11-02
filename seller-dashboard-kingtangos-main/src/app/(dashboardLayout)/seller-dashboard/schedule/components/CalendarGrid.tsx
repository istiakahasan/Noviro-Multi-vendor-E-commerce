"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  View,
  EventProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useGetMyBookingsAsStoreOwnerQuery } from "@/redux/api/bookings/bookingsApi";

// Define proper TypeScript interfaces
interface BookingUser {
  firstName: string;
  lastName: string;
}

interface BookingService {
  name: string;
}

interface Booking {
  id: string;
  status: string;
  startTime: string;
  endTime: string;
  user: BookingUser;
  service: BookingService | null; // ← Important: allow null
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    serviceName: string;
    userName: string;
    bookingId: string;
  };
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

const CalendarGrid: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.WEEK);

  const { data, isLoading, error } = useGetMyBookingsAsStoreOwnerQuery({});

  // Transform CONFIRMED bookings into calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    if (!data?.data) {
      console.log("No data found");
      return [];
    }
    console.log("Raw bookings data:", data.data);

    const confirmedEvents = data.data
      .filter((booking: Booking) => {
        const isConfirmed = booking.status === "CONFIRMED";
        console.log(
          `Booking ${booking.id} status: ${booking.status}, confirmed: ${isConfirmed}`,
        );
        return isConfirmed;
      })
      .map((booking: Booking) => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);

        // Safe access to service.name
        const serviceName = booking.service?.name || "Unknown Service";

        console.log(`Creating event for booking ${booking.id}:`, {
          title: `${booking.user.firstName} ${booking.user.lastName}`,
          start,
          end,
          service: serviceName,
        });

        return {
          id: booking.id,
          title: `${booking.user.firstName} ${booking.user.lastName}`,
          start,
          end,
          resource: {
            serviceName,
            userName: `${booking.user.firstName} ${booking.user.lastName}`,
            bookingId: booking.id,
          },
        };
      });

    console.log("Final events:", confirmedEvents);
    return confirmedEvents;
  }, [data]);

  // Custom event styling
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#10b981",
      borderRadius: "6px",
      opacity: 0.95,
      color: "white",
      border: "0px",
      fontSize: "11px",
      padding: "4px 6px",
      fontWeight: "500",
      lineHeight: "1.2",
      overflow: "hidden",
      cursor: "pointer",
      minHeight: "auto",
      whiteSpace: "nowrap" as const,
    },
  });

  // Show green dot in month view
  const dayPropGetter = (date: Date) => {
    const hasEvent = events.some(
      (e) => format(e.start, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    );
    if (hasEvent) {
      return {
        className: "rbc-day-with-event",
      };
    }
    return {};
  };

  // Custom event component for better display
  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    return (
      <div className="custom-event">
        <div className="font-semibold text-xs leading-tight truncate">
          {event.title}
        </div>
        <div className="text-xs opacity-90 leading-tight truncate">
          {event.resource.serviceName}
        </div>
        <div className="text-xs opacity-80 leading-tight truncate">
          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
        </div>
      </div>
    );
  };

  // Custom week header format
  const formats = useMemo(
    () => ({
      timeGutterFormat: "h a",
      eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
        `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`,
      dayFormat: (date: Date) => format(date, "EEE"),
      dayHeaderFormat: (date: Date) => format(date, "EEE, MMM dd"),
      monthHeaderFormat: (date: Date) => format(date, "MMMM yyyy"),
    }),
    [],
  );

  // Inject dot style
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .rbc-day-with-event {
        position: relative;
      }
      .rbc-day-with-event::after {
        content: '';
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background-color: #10b981;
        border-radius: 50%;
        z-index: 10;
      }
      .rbc-today .rbc-day-with-event::after {
        background-color: white;
        box-shadow: 0 0 0 2px #10b981;
      }
      .custom-event {
        font-size: 11px;
        line-height: 1.2;
        padding: 2px 4px;
      }
      .rbc-event {
        border: none !important;
        padding: 0px !important;
        min-height: auto !important;
      }
      .rbc-event-label {
        display: none !important;
      }
      .rbc-timeslot-group {
        min-height: 60px !important;
      }
      .rbc-day-slot .rbc-event {
        border-left: 3px solid #059669 !important;
      }
      .rbc-event-content {
        white-space: normal !important;
        overflow: visible !important;
      }
      .rbc-month-view .rbc-event {
        min-height: 20px !important;
        padding: 2px 4px !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Navigation handlers
  const handlePrevious = () => {
    if (view === Views.MONTH) {
      setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    } else {
      setDate(addDays(date, -7));
    }
  };

  const handleNext = () => {
    if (view === Views.MONTH) {
      setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    } else {
      setDate(addDays(date, 7));
    }
  };

  const handleToday = () => {
    setDate(new Date());
  };

  // Debug
  console.log("Calendar state:", {
    eventsCount: events.length,
    view,
    date,
    isLoading,
    hasData: !!data?.data,
  });

  // if (isLoading) {
  //   return (
  //     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
  //       {/* Skeleton Header */}
  //       <div className="flex items-center justify-between mb-6 animate-pulse">
  //         <div className="flex items-center gap-4">
  //           <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
  //           <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
  //           <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
  //           <div className="w-16 h-8 bg-gray-200 rounded-md"></div>
  //         </div>
  //         <div className="flex gap-2">
  //           <div className="w-16 h-8 bg-gray-200 rounded-md"></div>
  //           <div className="w-16 h-8 bg-gray-200 rounded-md"></div>
  //         </div>
  //       </div>
  //       {/* Skeleton Calendar Grid */}
  //       <div className="grid grid-cols-7 gap-2 h-[600px] animate-pulse">
  //         {[...Array(42)].map((_, i) => (
  //           <div
  //             key={i}
  //             className="border border-gray-200 rounded-md bg-gray-100"
  //           ></div>
  //         ))}
  //       </div>
  //       {/* Skeleton Legend */}
  //       <div className="mt-6 flex justify-center animate-pulse">
  //         <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
  //           <div className="w-3 h-3 rounded-full bg-gray-300"></div>
  //           <div className="w-48 h-4 bg-gray-200 rounded-md"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Loading state
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-8">
  //      <div className="flex items-center justify-center min-h-[70vh]">
  //       <div className="flex items-center justify-center space-x-2">
  //         <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
  //         <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
  //         <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
  //       </div>
  //     </div>
  //     </div>
  //   )
  // }

  // Network error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 md:p-8">
        <div className="mx-auto container">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Failed to load subscriptions</p>
              <p className="mt-2 text-gray-600">Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg md:p-6 shadow-sm border border-gray-200">
      {/* Custom Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4  flex-col md:flex-row">
          <button
            onClick={handlePrevious}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Previous"
          >
            <IoIosArrowBack size={20} className="text-gray-600" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
            {view === Views.WEEK
              ? `${format(date, "MMM dd")} - ${format(
                  addDays(date, 6),
                  "MMM dd, yyyy",
                )}`
              : format(date, "MMMM yyyy")}
          </h2>
          <button
            onClick={handleNext}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Next"
          >
            <IoIosArrowForward size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Today
          </button>
        </div>
        <div className="flex gap-2 flex-col md:flex-row">
          <button
            onClick={() => setView(Views.WEEK)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
              view === Views.WEEK
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView(Views.MONTH)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
              view === Views.MONTH
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onView={setView}
          onNavigate={setDate}
          toolbar={false}
          dayPropGetter={dayPropGetter}
          eventPropGetter={eventStyleGetter}
          showMultiDayTimes
          step={30}
          timeslots={2}
          formats={formats}
          popup
          components={{
            event: CustomEvent,
          }}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8 AM start
          max={new Date(0, 0, 0, 18, 0, 0)} // 6 PM end
        />
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-sm font-medium text-gray-700">
            Confirmed Appointment ({events.length})
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
