// "use client";
// // src/app/(dashboardLayout)/admin-dashboard/platform-settings/components/CommissionSettings.tsx
// import { CommissionRate } from "@/types/global";
// import { Edit2, Eye, X } from "lucide-react";
// import React, { useState } from "react";

// // interface CommissionSettingsProps {}
// interface CommissionSettingsProps {
//   [key: string]: NonNullable<unknown>;
// }

// const CommissionSettings: React.FC<CommissionSettingsProps> = () => {
//   const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([
//     { id: "1", category: "Products", rate: 10 },
//     { id: "2", category: "Services", rate: 7 },
//     { id: "3", category: "Subscriptions", rate: 5 },
//   ]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingRate, setEditingRate] = useState<CommissionRate | null>(null);
//   const [editForm, setEditForm] = useState({ category: "", rate: 0 });

//   const categories = ["Products", "Services", "Subscriptions"];

//   const openEditModal = (rate: CommissionRate) => {
//     setEditingRate(rate);
//     setEditForm({ category: rate.category, rate: rate.rate });
//     setIsModalOpen(true);
//   };

//   const handleInputChange = (field: "category" | "rate", value: string) => {
//     if (field === "rate") {
//       setEditForm((prev) => ({ ...prev, rate: parseInt(value) || 0 }));
//     } else {
//       setEditForm((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleSaveEdit = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (editingRate && editForm.rate >= 0) {
//       setCommissionRates((prev) =>
//         prev.map((r) =>
//           r.id === editingRate.id
//             ? { ...r, category: editForm.category, rate: editForm.rate }
//             : r
//         )
//       );
//       console.log(
//         "Updated Commission Rates:",
//         commissionRates.map((r) => ({
//           category: r.category,
//           rate: `${r.rate}%`,
//         }))
//       );
//     }
//     setIsModalOpen(false);
//     setEditingRate(null);
//   };

//   const handleCancelEdit = () => {
//     setIsModalOpen(false);
//     setEditingRate(null);
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold text-gray-900">
//         Category-Based Commission Rates
//       </h2>
//       <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 CATEGORY 
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 COMMISSION RATE (%)
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {commissionRates.map((rate) => (
//               <tr key={rate.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   {rate.category}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {rate.rate}%
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => openEditModal(rate)}
//                       className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
//                     >
//                       <Edit2 size={16} />
//                     </button>
//                     <button className="p-1 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
//                       <Eye size={16} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Buttons */}
//       <div className="flex justify-start pt-6 border-t border-gray-200 space-x-3">
//         <button
//           type="submit"
//           className="bg-[#333333] cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2  focus:ring-offset-2 transition-colors"
//         >
//           Save Changes
//         </button>
//         <button
//           type="button"
//           className="bg-gray-50 text-gray-700 border border-gray-600 px-6 py-2 rounded-md cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//       {/* Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Edit Commission Rate
//               </h3>
//               <button
//                 onClick={handleCancelEdit}
//                 className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <form onSubmit={handleSaveEdit}>
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="category"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Category
//                   </label>
//                   <select
//                     id="category"
//                     value={editForm.category}
//                     onChange={(e) =>
//                       handleInputChange("category", e.target.value)
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="rate"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Commission Rate (%)
//                   </label>
//                   <input
//                     id="rate"
//                     type="number"
//                     value={editForm.rate}
//                     onChange={(e) => handleInputChange("rate", e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     min="0"
//                     step="1"
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={handleCancelEdit}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CommissionSettings;




import React from 'react';
import ComitionRate from '../../platform-setting/components/ComitionRate';

const CommissionSettings = () => {
  return (
    <div>
      <ComitionRate />
    </div>
  );
};

export default CommissionSettings;