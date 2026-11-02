// // app/schedule/components/AvailabilityModal.tsx
// 'use client';
// import React, { useState } from 'react';

// interface AvailabilityModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedOffDays: string[]) => void;
//   offDays: string[]; // ISO date strings, e.g., ['2025-08-06']
//   highlightedDays?: string[]; // Optional highlighted days
// }

// const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   offDays,
//   highlightedDays = [],
// }) => {
//   const [currentDate, setCurrentDate] = useState(() => {
//     const now = new Date();
//     return new Date(now.getFullYear(), now.getMonth(), 1);
//   });
//   const [selectedOffDays, setSelectedOffDays] = useState(offDays);

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const generateCalendar = (year: number, monthIndex: number) => {
//     const firstDay = new Date(year, monthIndex, 1);
//     const startDate = new Date(firstDay);
//     startDate.setDate(firstDay.getDate() - firstDay.getDay());
//     const days: Date[] = [];
//     for (let i = 0; i < 42; i++) {
//       const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
//       days.push(day);
//     }
//     return days;
//   };

//   const calendarDays = generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

//   const getDateKey = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
//   };

//   const toggleOffDay = (dateKey: string, isOff: boolean) => {
//     setSelectedOffDays(prev =>
//       isOff ? prev.filter(d => d !== dateKey) : [...prev, dateKey].sort()
//     );
//   };

//   const getDayClass = (isOff: boolean, isHigh: boolean, isCurrMonth: boolean) => {
//     const base = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors';
//     let className = base;

//     if (!isCurrMonth) {
//       className += ' text-gray-300';
//       if (isOff) {
//         className += ' bg-red-100 border-2 border-red-300';
//       } else if (isHigh) {
//         className += ' bg-blue-100 border-2 border-blue-300';
//       }
//       return className;
//     }

//     if (isOff) {
//       className += ' bg-red-100 text-red-600 border-2 border-red-300 hover:bg-red-200 cursor-pointer';
//     } else if (isHigh) {
//       className += ' bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-blue-200 cursor-pointer';
//     } else {
//       className += ' text-gray-900 hover:bg-gray-100 cursor-pointer';
//     }

//     return className;
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="p-6 pb-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={handlePrevMonth}
//                 className="text-gray-400 hover:text-gray-600 text-xl"
//               >
//                 &lsaquo;
//               </button>
//               <span className="text-lg font-semibold text-gray-900">
//                 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//               </span>
//               <button
//                 onClick={handleNextMonth}
//                 className="text-gray-400 hover:text-gray-600 text-xl"
//               >
//                 &rsaquo;
//               </button>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 text-xl"
//             >
//               &times;
//             </button>
//           </div>
//         </div>

//         {/* Calendar Grid */}
//         <div className="p-6">
//           <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
//             <div>Sun</div>
//             <div>Mon</div>
//             <div>Tue</div>
//             <div>Wed</div>
//             <div>Thu</div>
//             <div>Fri</div>
//             <div>Sat</div>
//           </div>
//           <div className="grid grid-cols-7 gap-1">
//             {calendarDays.map((date, index) => {
//               const dateKey = getDateKey(date);
//               const dayNum = date.getDate();
//               const isCurrMonth = date.getMonth() === currentDate.getMonth();
//               const isOff = selectedOffDays.includes(dateKey);
//               const isHigh = highlightedDays.includes(dateKey);
//               const Element = isCurrMonth ? 'button' : 'div';
//               const onClick = isCurrMonth ? () => toggleOffDay(dateKey, isOff) : undefined;
//               return (
//                 <Element
//                   key={index}
//                   className={getDayClass(isOff, isHigh, isCurrMonth)}
//                   onClick={onClick}
//                 >
//                   {dayNum}
//                 </Element>
//               );
//             })}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 pt-4 border-t border-gray-200 flex justify-start gap-3">
          
//           <button
//             onClick={() => onSave(selectedOffDays)}
//             className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800"
//           >
//             Save
//           </button>

//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvailabilityModal;







// app/schedule/components/AvailabilityModal.tsx
'use client';

import React, { useState } from 'react';
import { useGetWeeklyAvailabilityQuery } from '@/lib/api/scheduleManagement/scheduleApi';
import { ArrowLeft, ArrowRight, Cross, X } from 'lucide-react';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ isOpen, onClose }) => {
  const { data } = useGetWeeklyAvailabilityQuery();

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Get which days of week are unavailable (e.g. Sunday, Friday)
  const weeklyOffDays = data?.data
    ?.filter((item) => !item.isAvailable)
    .map((item) => item.dayOfWeek) || []; // 0=Sun, 6=Sat

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const generateCalendar = (year: number, monthIndex: number) => {
    const firstDay = new Date(year, monthIndex, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return days;
  };

  const calendarDays = generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isWeeklyOff = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday
    return weeklyOffDays.includes(dayOfWeek);
  };

  const getDayClass = (date: Date, isCurrentMonth: boolean) => {
    const base = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium';
    if (!isCurrentMonth) {
      return `${base} text-gray-300`;
    }
    if (isWeeklyOff(date)) {
      return `${base} bg-red-100 text-red-600 border-2 border-red-300`;
    }
    return `${base} text-gray-900`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevMonth}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <ArrowLeft/>
              </button>
              <span className="text-lg font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button
                onClick={handleNextMonth}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                <ArrowRight/>
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              <X/>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              return (
                <div
                  key={index}
                  className={getDayClass(date, isCurrentMonth)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 rounded-full bg-red-100 border-2 border-red-300"></div>
            <span>Weekly Unavailable Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;