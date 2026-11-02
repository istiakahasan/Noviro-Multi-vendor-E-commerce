/* eslint-disable */

// "use client";

// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// const DashboardCalendarSection: React.FC = () => {
//   const [value, setValue] = useState<Date>(new Date());

//   return (
//     <section className="bg-white- rounded-2xl w-full max-w-max">
//       <div
//         className="
//           [&_.react-calendar]:border-0 
//           [&_.react-calendar]:w-full 
//           [&_.react-calendar]:rounded-2xl 
//           [&_.react-calendar]:bg-transparent
//           [&_.react-calendar__month-view__weekdays]:text-gray-500 
//           [&_.react-calendar__navigation__label]:font-semibold
//           [&_.react-calendar__navigation]:mb-2
//           [&_.react-calendar__navigation]:justify-between
//           [&_.react-calendar__tile]:text-gray-700 
//           [&_.react-calendar__tile]:aspect-circle
//           [&_.react-calendar__tile]:transition
//           [&_.react-calendar__tile:hover]:bg-blue-100 
//           [&_.react-calendar__tile:hover]:rounded-full
//           [&_.react-calendar__tile--active]:bg-blue-500 
//           [&_.react-calendar__tile--active]:text-white 
//           [&_.react-calendar__tile--active]:rounded-full 
//           [&_.react-calendar__tile--now]:bg-blue-50
//           [&_.react-calendar__tile--now]:text-blue-600
//           [&_.react-calendar__tile--now]:rounded-full
//         "
//       >
//         <Calendar
//           onChange={setValue}
//           value={value}
//           prev2Label={null}
//           next2Label={null}
//         />
//       </div>
//     </section>
//   );
// };

// export default DashboardCalendarSection;



"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";



const DashboardCalendarSection: React.FC = () => {
  // internal state uses the same Value type that react-calendar expects
  const [value, setValue] = useState<any>(new Date());

  const handleChange = (val: any) => {
    setValue(val);
  };

  console.log(value);

  return (
    <section className="bg-white- rounded-2xl shadow shadow-sm w-full lg:max-w-[390px] p-4">

      <div className="react-calendar-wrapper">
        <Calendar
          onChange={handleChange}
          value={value}
          prev2Label={null}
          next2Label={null}
        />
      </div>

      <style jsx global>{`
        .react-calendar,
        .react-calendar * {
          box-shadow: none !important;
        }
        .react-calendar {
          border: none !important;
          background: transparent !important;
          width: 100% !important;
        }

        .react-calendar__navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          border: none !important;
          background: transparent !important;
          padding: 0 4px;
        }
        .react-calendar__navigation button {
          border: none !important;
          background: transparent !important;
          padding: 4px 8px;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          color: #6b7280;
          font-weight: 600;
        }

        .react-calendar__tile {
          border: none !important;
          border-radius: 0 !important;
          height: 40px;
          width: 40px;
          max-width: initial;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 6px 4px;
          padding: 0;
          font-weight: 500;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: rgba(59, 130, 246, 0.08);
          border-radius: 9999px;
        }

        .react-calendar__tile--active {
          background: #1DA2CF !important;
          color: #fff !important;
          border-radius: 10px !important;
        }

        .react-calendar__tile--now {
          background: rgba(37, 99, 235, 0.06);
          color: #2563eb;
          border-radius: 9999px;
        }

        .react-calendar__month-view__days__day {
          border: none !important;
        }
      `}</style>
    </section>
  );
};

export default DashboardCalendarSection;




