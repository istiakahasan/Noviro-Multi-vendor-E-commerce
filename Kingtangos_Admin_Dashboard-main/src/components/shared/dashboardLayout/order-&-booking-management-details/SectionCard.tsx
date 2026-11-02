// "use client";
// import React from "react";

// interface SectionCardProps {
//   title?: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const SectionCard: React.FC<SectionCardProps> = ({ title, children, className }) => {
//   return (
//     <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className || ""}`}>
//       {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}
//       {children}
//     </div>
//   );
// };

// export default SectionCard;


"use client";
import React from "react";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-3 ${className || ""}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default SectionCard;
