/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
} from 'date-fns';
import { ServiceSlotResponse } from '@/types/serviceSlotResponse.type';
import { ConsultationBookingDateResponse } from '@/types/monthlyDateBooking.type';

type CalendarProps = {
  isOpen: boolean
  onClose: () => void
  onComplete: (date: Date, time: string) => void
  bookingDateMonthly?: ConsultationBookingDateResponse
  bookingSlots?: ServiceSlotResponse
  onDateSelect: (date: Date) => void;
  currentMonth: Date; 
  onMonthChange: (date: Date) => void;
};

const ProfessionalSelectCalendar: React.FC<CalendarProps> = ({ 
  onDateSelect, 
  bookingDateMonthly,
  currentMonth, 
  onMonthChange
}: CalendarProps) => {
  
  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    onMonthChange(newMonth);
  };
  
  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    onMonthChange(newMonth);
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      // Create a copy of the current day to avoid reference issues
      const currentDay = new Date(day);
      const formattedDate = format(currentDay, 'yyyy-MM-dd');

      const isBooked =
        bookingDateMonthly?.data?.availability?.some(
          item => item.date === formattedDate && item.available === false
        ) ?? false;

      const isAvailable =
        bookingDateMonthly?.data?.availability?.some(
          item => item.date === formattedDate && item.available === true
        ) ?? false;

      const inCurrentMonth = isSameMonth(currentDay, currentMonth);

      const baseStyle =
        'md:w-10 w-8 md:h-10 h-8 flex items-center justify-center rounded-full text-sm';
      let style = 'border border-gray-300 text-gray-400 cursor-not-allowed';

      if (inCurrentMonth) {
        if (isBooked) {
          style = 'bg-[#FF5722]/75 text-white cursor-not-allowed';
        } else if (isAvailable) {
          style = 'hover:bg-orange-600/90 bg-orange-600 text-white cursor-pointer';
        } else {
          style = 'border border-gray-300 text-gray-400 cursor-not-allowed';
        }
      }

      days.push(
        <div
          key={formattedDate}
          className="flex flex-col items-center md:max-w-xl max-w-md w-full"
          onClick={() => {
            if (inCurrentMonth && isAvailable && !isBooked) {
              console.log('Date clicked in calendar:', currentDay);
              handleDateClick(currentDay);
            }
          }}
        >
          <div className={`${baseStyle} ${style}`}>
            {format(currentDay, 'd')}
          </div>
          <div className="text-xs text-gray-500">
            {format(currentDay, 'EEE')}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div key={`week-${format(day, 'yyyy-MM-dd')}`} className="flex justify-start lg md:gap-5 gap-3 mb-2">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex justify-center items-center w-full max-w-md px-6 mb-4">
        <div className="flex justify-between w-full items-center text-primary">
          <button onClick={handlePrevMonth} className="text-xl">{'‹'}</button>
          <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={handleNextMonth} className="text-xl">{'›'}</button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col">{rows}</div>
    </div>
  );
};

export default ProfessionalSelectCalendar;