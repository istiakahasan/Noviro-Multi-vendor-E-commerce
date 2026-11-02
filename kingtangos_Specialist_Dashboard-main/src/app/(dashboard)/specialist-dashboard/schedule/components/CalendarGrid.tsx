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
import { useGetMyBookingsAsSpecialistQuery } from "@/lib/bookings/bookingApi";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Clock,
  Calendar as CalendarIcon,
  RotateCcw,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

// Define proper TypeScript interfaces
interface BookingUser {
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

interface BookingService {
  name: string;
}

interface BookingConsultation {
  name: string;
}

interface Booking {
  id: string;
  status: string;
  serviceId: string | null;
  consultationId: string | null;
  startTime: string;
  endTime: string;
  amount: number;
  paymentStatus: string;
  rescheduleReason?: string | null;
  notes?: string | null;
  user: BookingUser;
  service: BookingService | null;
  consultation: BookingConsultation | null;
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
    type: "Service" | "Consultation";
    booking: Booking;
  };
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales: { "en-US": enUS },
});

const CalendarGrid: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const { data, isLoading } = useGetMyBookingsAsSpecialistQuery({
    page: 1,
    limit: 1000,
  });

  // Transform PENDING bookings into calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    const bookings = data?.data as unknown as Booking[];
    if (!bookings) return [];

    return bookings
      .filter((booking: Booking) => booking.status === "PENDING")
      .map((booking: Booking) => {
        const start = new Date(booking.startTime.replace("Z", ""));
        const end = new Date(booking.endTime.replace("Z", ""));
        const serviceName =
          booking.service?.name ||
          booking.consultation?.name ||
          "Unknown Service";

        return {
          id: booking.id,
          title: `${booking.user.firstName} ${booking.user.lastName}`,
          start,
          end,
          resource: {
            serviceName,
            userName: `${booking.user.firstName} ${booking.user.lastName}`,
            bookingId: booking.id,
            type: booking.serviceId ? "Service" : "Consultation",
            booking,
          },
        };
      });
  }, [data]);

  // Expand time range to see morning/evening slots
  const minTime = new Date(0, 0, 0, 6, 0, 0); // 6 AM
  const maxTime = new Date(0, 0, 0, 23, 0, 0); // 11 PM

  // Custom monochromatic event styling
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#18181b", // zinc-900 (Deep Black)
      borderRadius: "6px",
      opacity: 0.95,
      color: "white",
      border: "1px solid #3f3f46", // zinc-700
      fontSize: "11px",
      fontWeight: "500",
      lineHeight: "1.4",
      overflow: "hidden",
      cursor: "pointer",
      minHeight: "auto",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
  });

  // Black dot in month view
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

  // Custom event component with truncation and proper padding
  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    return (
      <div
        className="custom-event group flex flex-col w-full p-1.5 overflow-hidden relative"
        title={`Type: ${event.resource.type}`}
      >
        <div className="font-bold text-white leading-tight truncate whitespace-nowrap mb-0.5">
          {event.title}
        </div>
        <div className="text-[10px] text-zinc-400 font-medium leading-tight truncate whitespace-nowrap">
          {event.resource.serviceName}
        </div>

        {/* Hover Type Badge */}
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {event.resource.type}
          </span>
        </div>
      </div>
    );
  };

  // Custom Month Date Header to handle per-day scrolling
  const MonthDateHeader: React.FC<{ label: string; date: Date }> = ({
    label,
    date: dayDate,
  }) => {
    const dayEvents = useMemo(
      () =>
        events
          .filter(
            (e) =>
              format(e.start, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd"),
          )
          .sort((a, b) => a.start.getTime() - b.start.getTime()),
      [dayDate, events],
    );

    return (
      <div className="flex flex-col h-full w-full">
        <div className="rbc-button-link rbc-label p-2 font-bold text-zinc-900">
          {label}
        </div>
        <div className="flex-1 overflow-y-auto px-1 space-y-1 custom-day-scrollbar">
          {dayEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(event);
              }}
              className="bg-zinc-900 rounded-md p-1.5 cursor-pointer hover:bg-zinc-800 transition-colors border border-zinc-800 shadow-sm relative group"
            >
              <div className="flex items-start gap-1.5">
                <span className="text-[9px] font-black text-zinc-600 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-[10px] truncate leading-tight">
                    {event.title}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate leading-tight">
                    {event.resource.serviceName}
                  </div>
                </div>
              </div>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                  {event.resource.type}
                </span>
                <div className="text-[8px] font-medium text-zinc-600 tracking-tighter uppercase leading-none">
                  {format(event.start, "h:mm a")}
                </div>
              </div>
            </div>
          ))}
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

  // Inject monochromatic styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .rbc-day-with-event {
        position: relative;
      }
      .rbc-day-with-event::after {
        content: '';
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background-color: #18181b;
        border-radius: 50%;
        z-index: 10;
      }
      .rbc-today .rbc-day-with-event::after {
        background-color: #71717a;
      }
      .rbc-event {
        border: none !important;
        transition: all 0.2s ease;
      }
      .rbc-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        z-index: 50 !important;
      }
      .rbc-timeslot-group {
        min-height: 80px !important;
        border-bottom: 1px solid #f4f4f5 !important;
      }
      .rbc-day-slot .rbc-event {
        border-left: 3px solid #18181b !important;
      }
      .rbc-today {
        background-color: #fafafa !important;
      }
      .rbc-off-range-bg {
        background-color: #fcfcfc !important;
      }
      .rbc-header {
        font-weight: 800 !important;
        font-size: 13px !important;
        padding: 12px 0 !important;
        color: #09090b !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        border-bottom: 2px solid #f4f4f5 !important;
      }

      /* Custom Extra Thin Scrollbar - 1px & Transparent */
      .custom-day-scrollbar::-webkit-scrollbar {
        width: 1px !important;
      }
      .custom-day-scrollbar::-webkit-scrollbar-track {
        background: transparent !important;
      }
      .custom-day-scrollbar::-webkit-scrollbar-thumb {
        background: transparent !important;
        border-radius: 10px !important;
      }
      .custom-day-scrollbar:hover::-webkit-scrollbar-thumb {
        background: #d4d4d8 !important; /* zinc-300 */
      }

      /* Hide default event rows in month view to use custom day header scrolling */
      .rbc-month-view .rbc-row-content .rbc-row:not(:first-child) {
        display: none !important;
      }
      .rbc-month-view .rbc-month-row {
        overflow: hidden !important;
        flex: 1 1 0 !important;
        min-height: 150px !important; /* Increased Height */
      }
      .rbc-month-view .rbc-date-cell {
        height: 100% !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      .rbc-month-view .rbc-row-content {
        height: 100% !important;
        pointer-events: none;
      }
      .rbc-month-view .rbc-row-content .rbc-row:first-child {
        height: 100% !important;
        pointer-events: auto;
      }

      /* Fix row header alignment */
      .rbc-month-view .rbc-header {
        border-bottom: 1px solid #f4f4f5 !important;
      }

      /* Week view scrollbar refinement */
      .rbc-time-content::-webkit-scrollbar {
        width: 1px !important;
      }
      .rbc-time-content::-webkit-scrollbar-thumb {
        background: transparent !important;
      }
      .rbc-time-content:hover::-webkit-scrollbar-thumb {
        background: #d4d4d8 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
            <div className="w-40 h-6 bg-gray-100 rounded-md"></div>
            <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
            <div className="w-16 h-8 bg-gray-100 rounded-md"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-8 bg-gray-100 rounded-md"></div>
            <div className="w-16 h-8 bg-gray-100 rounded-md"></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 h-[600px] animate-pulse">
          {[...Array(42)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-50 rounded-md bg-gray-50/50"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-100">
      {/* Monochromatic Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <div className="flex items-center bg-zinc-50 rounded-2xl p-1.5 border border-zinc-100 shadow-inner">
            <button
              onClick={() => {
                if (view === Views.MONTH) {
                  setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
                } else {
                  setDate(addDays(date, -7));
                }
              }}
              className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-black"
            >
              <IoIosArrowBack size={20} />
            </button>
            <button
              onClick={() => setDate(new Date())}
              className="px-6 py-3 text-xs font-black text-zinc-900 uppercase tracking-widest hover:bg-white rounded-xl transition-all"
            >
              Today
            </button>
            <button
              onClick={() => {
                if (view === Views.MONTH) {
                  setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
                } else {
                  setDate(addDays(date, 7));
                }
              }}
              className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-zinc-400 hover:text-black"
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-black tracking-tighter uppercase truncate max-w-[400px]">
            {view === Views.WEEK
              ? `${format(startOfWeek(date, { weekStartsOn: 0 }), "MMM dd")} - ${format(
                  addDays(startOfWeek(date, { weekStartsOn: 0 }), 6),
                  "MMM dd, yyyy",
                )}`
              : format(date, "MMMM yyyy")}
          </h2>
        </div>

        <div className="flex bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100 shadow-inner">
          <button
            onClick={() => setView(Views.WEEK)}
            className={`px-10 py-3.5 rounded-xl font-black text-xs tracking-widest transition-all ${
              view === Views.WEEK
                ? "bg-black text-white shadow-xl"
                : "text-zinc-500 hover:text-black"
            }`}
          >
            WEEK
          </button>
          <button
            onClick={() => setView(Views.MONTH)}
            className={`px-10 py-3.5 rounded-xl font-black text-xs tracking-widest transition-all ${
              view === Views.MONTH
                ? "bg-black text-white shadow-xl"
                : "text-zinc-500 hover:text-black"
            }`}
          >
            MONTH
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className="relative group/calendar rounded-3xl overflow-hidden border-none shadow-sm bg-zinc-50/20"
        style={{ height: 750 }}
      >
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
          onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
          components={{
            event: CustomEvent,
            month: {
              dateHeader: MonthDateHeader as any,
            },
          }}
          min={minTime}
          max={maxTime}
        />
      </div>

      {/* Monochromatic Legend */}
      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-4 px-8 py-4 bg-zinc-50 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-black shadow-[0_0_12px_rgba(0,0,0,0.15)]"></div>
          <span className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em]">
            Pending Requests ({events.length})
          </span>
        </div>
      </div>

      {/* Black & White Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <Dialog.Root
            open={!!selectedEvent}
            onOpenChange={() => setSelectedEvent(null)}
          >
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xl z-100"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-4xl shadow-2xl p-0 z-101 border border-zinc-100 overflow-hidden"
                >
                  {/* Black Header */}
                  <div className="relative h-56 bg-zinc-950 p-10 flex items-end">
                    <div className="absolute top-8 right-8">
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-white rounded-4xl shadow-2xl flex items-center justify-center text-black font-black text-3xl overflow-hidden border-4 border-zinc-900">
                        {selectedEvent.resource.booking.user.profilePic ? (
                          <img
                            src={selectedEvent.resource.booking.user.profilePic}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          selectedEvent.resource.booking.user.firstName[0]
                        )}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase whitespace-nowrap truncate max-w-[200px]">
                          {selectedEvent.title}
                        </h3>
                        <p className="text-zinc-500 font-bold text-sm tracking-wide truncate max-w-[200px]">
                          {selectedEvent.resource.booking.user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-12 space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                          Schedule
                        </p>
                        <div className="flex items-center gap-4 text-black font-extrabold text-sm">
                          <Clock className="w-5 h-5 text-zinc-300" />
                          <div>
                            <p>
                              {selectedEvent.start.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "2-digit",
                              })}
                            </p>
                            <p className="text-zinc-500">
                              {selectedEvent.start.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}{" "}
                              -{" "}
                              {selectedEvent.end.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                          Value
                        </p>
                        <div className="flex flex-col items-end">
                          <p className="text-black font-black text-xl tracking-tighter">
                            €{selectedEvent.resource.booking.amount}
                          </p>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate w-full text-right flex items-center justify-end gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${selectedEvent.resource.type === "Service" ? "bg-purple-500" : "bg-teal-500"}`}
                            ></span>
                            {selectedEvent.resource.type}:{" "}
                            {selectedEvent.resource.serviceName}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {selectedEvent.resource.booking.rescheduleReason && (
                        <div className="p-6 bg-zinc-50 rounded-4xl border border-zinc-100 space-y-2">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <RotateCcw className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              REASON
                            </p>
                          </div>
                          <p className="text-zinc-900 font-bold text-sm leading-relaxed italic">
                            "{selectedEvent.resource.booking.rescheduleReason}"
                          </p>
                        </div>
                      )}

                      {selectedEvent.resource.booking.notes && (
                        <div className="p-6 bg-zinc-50 rounded-4xl border border-zinc-100 space-y-2">
                          <div className="flex items-center gap-3 text-zinc-400">
                            <MessageSquare className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              NOTES
                            </p>
                          </div>
                          <p className="text-zinc-900 font-bold text-sm leading-relaxed italic">
                            "{selectedEvent.resource.booking.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      <a
                        href={`/specialist-dashboard/bookings/${selectedEvent.id}`}
                        className="w-full py-6 bg-black hover:bg-zinc-800 text-white rounded-3xl font-black text-xs tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98]"
                      >
                        VIEW FULL DETAILS
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CalendarGrid;
