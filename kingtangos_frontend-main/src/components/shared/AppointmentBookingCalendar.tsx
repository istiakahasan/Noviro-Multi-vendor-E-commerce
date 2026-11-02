/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ConsultationBookingDateResponse } from "@/types/monthlyDateBooking.type"
import { ConsultationSlotResponse } from "@/types/consultationSlot.type"

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (date: Date, time: string) => void
  bookingDateMonthly?: ConsultationBookingDateResponse
  bookingSlots?: ConsultationSlotResponse
    onDateSelect: (date: Date) => void;
  // timeSlot?: ConsultationSlotResponse
}

export function AppointmentBookingCalendar({ isOpen, onClose, onComplete, onDateSelect, bookingDateMonthly, bookingSlots }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<"calendar" | "time">("calendar")


  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
    setView("time")
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleDone = () => {
    if (selectedDate && selectedTime) {
      onComplete(selectedDate, selectedTime)
      handleClose()
    }
  }

  const handleClose = () => {
    setView("calendar")
    setSelectedDate(null)
    setSelectedTime(null)
    onClose()
  }

  const handleBackToCalendar = () => {
    setView("calendar")
    setSelectedTime(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-white rounded-3xl border-0 shadow-2xl">
        {view === "calendar" ? (
          <CalendarView
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onClose={handleClose}
            bookingDateMonthly={bookingDateMonthly}
          />
        ) : (
          <TimeView
            selectedDate={selectedDate!}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
            onDone={handleDone}
            onBack={handleBackToCalendar}
            bookingSlots={bookingSlots}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

interface CalendarViewProps {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onClose: () => void
  bookingDateMonthly?: ConsultationBookingDateResponse
}

function CalendarView({ currentMonth, setCurrentMonth, selectedDate, onDateSelect, bookingDateMonthly }: CalendarViewProps) {

  const bookingDates = bookingDateMonthly?.data?.availability || [];
 
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    // Adjust so Monday is 0, Sunday is 6
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1

    const days: (number | null)[] = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      const prevMonthDate = new Date(year, month, 0 - (adjustedStartDay - i - 1))
      days.push(prevMonthDate.getDate())
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return { days, daysInMonth, startOffset: adjustedStartDay }
  }

  const { daysInMonth, startOffset } = getDaysInMonth(currentMonth)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {bookingDates.map((day: any, index) => {
          const isCurrentMonth = index >= startOffset && index < startOffset + daysInMonth
          const dayNumber = day?.day || 0
          const displayDay = day?.day?.toString() || ''
          const isAvailable = day?.available === true
          const isTodayDate = isToday(dayNumber)

          return (
            <button
              key={index}
              onClick={() => {
                if (isCurrentMonth && day && isAvailable) {
                  onDateSelect(new Date(day.date))
                }
              }}
              disabled={!isCurrentMonth || !isAvailable}
              className={`
                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                ${!isCurrentMonth
                  ? "text-slate-300 cursor-not-allowed"
                  : isSelected(dayNumber)
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : isTodayDate && isAvailable
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : isTodayDate && !isAvailable
                        ? "bg-blue-50 text-blue-400 border border-blue-200 cursor-not-allowed"
                        : isAvailable
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "text-slate-500 bg-slate-100 cursor-not-allowed"
                }
              `}
            >
              {displayDay}
            </button>
          )
        })}
      </div>

      {/* Done button */}
      <div className="flex justify-end">
        {/* <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg shadow-sm">
          Done
        </Button> */}
      </div>
    </div>
  )
}

interface TimeViewProps {
  selectedDate: Date
  selectedTime: string | null
  onTimeSelect: (time: string) => void
  onDone: () => void
  onBack: () => void
  bookingSlots?: ConsultationSlotResponse
}

function TimeView({ selectedDate, selectedTime, onTimeSelect, onDone, onBack, bookingSlots }: TimeViewProps) {
  // Generate time slots (example: every hour from 9 AM to 9 PM)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: 'UTC', // Ensure consistent timezone handling
    });
  };

  return (
<div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900">
          {formatDate(selectedDate)}
        </h2>
        <div className="w-9" />
      </div>

      <div className="h-px bg-slate-200 mb-6" />

      {/* Time Slots */}
      <div className="grid grid-cols-3 gap-3 mb-6 max-h-[280px] overflow-y-auto pr-2">
        {bookingSlots?.data?.availableSlots?.map((slot: any) => {
          const time = formatTime(slot.startTime);

          return (
            <button
              key={slot.startTime}
              onClick={() => onTimeSelect(time)}
              disabled={!slot.isAvailable}
              className={`
                py-3 px-4 rounded-lg text-sm font-medium transition-all border
                ${selectedTime === time
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                }
                ${!slot.isAvailable ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {time}
            </button>
          );
        })}
      </div>

      {/* Done Button */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button
          onClick={onDone}
          disabled={!selectedTime}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Done
        </Button>
      </div>
    </div>
  )
}
