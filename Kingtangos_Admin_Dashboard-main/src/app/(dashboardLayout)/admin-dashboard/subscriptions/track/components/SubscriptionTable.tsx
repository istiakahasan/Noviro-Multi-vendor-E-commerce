// import { useGetSubscriptionPlanPerformanceQuery } from '@/redux/features/stats/statsApi';
// import { TrendingDown, TrendingUp } from 'lucide-react';
// import React from 'react';

// const SubscriptionTable = () => {
  
  
//    // Data for table: Subscription Plan Performance
//     const tableData = [
//       {
//         plan: "Wellness Spa",
//         type: "Yearly",
//         subscribers: 300,
//         revenue: 90000,
//         growth: "+12%",
//       },
//       {
//         plan: "Monthly Pass",
//         type: "Monthly",
//         subscribers: 250,
//         revenue: 60000,
//         growth: "+3%",
//       },
//       {
//         plan: "Premium Annual",
//         type: "Yearly",
//         subscribers: 180,
//         revenue: 45000,
//         growth: "-5%",
//       },
//       {
//         plan: "Premium Health Monthly",
//         type: "Monthly",
//         subscribers: 60,
//         revenue: 12000,
//         growth: "+8%",
//       },
//     ];
  
//   const {data,isLoading,isError}=useGetSubscriptionPlanPerformanceQuery()

//   console.log(data);
  
  
//     return (
          
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Subscription Plan Performance
//             </h3>
//             <button className="border text-black px-4 py-2 shadow-2xs rounded-md hover:bg-blue-700 flex items-center gap-2">
//               {/* <BarChart3 className="h-4 w-4" /> */}
//               View All Plans
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Plan Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Active Subscribers
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Revenue
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Growth Rate
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {tableData.map((row, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {row.plan}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <span className="inline-flex px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
//                         {row.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {row.subscribers} Subscribers
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ${row.revenue.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <span
//                         className={`inline-flex items-center gap-1 font-medium ${
//                           row.growth.startsWith("+")
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {row.growth.startsWith("+") ? (
//                           <TrendingUp className="w-4 h-4" />
//                         ) : (
//                           <TrendingDown className="w-4 h-4" />
//                         )}
//                         {row.growth}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//     );
// };

// export default SubscriptionTable;

'use client';

import { useGetSubscriptionPlanPerformanceQuery } from '@/redux/features/stats/statsApi';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

const SubscriptionTable = () => {
  const { data, isLoading, isError } = useGetSubscriptionPlanPerformanceQuery();

  // Use real data from API, fallback to empty array
  const tableData = data?.data || [];

  // Loading state — matches your design perfectly
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Subscription Plan Performance
          </h3>
          <button className="border text-black px-4 py-2 shadow-2xs rounded-md hover:bg-blue-700 flex items-center gap-2">
            View All Plans
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Error or no data
  if (isError || tableData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12">
        <p className="text-gray-500">No plan performance data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Subscription Plan Performance
        </h3>
        <button className="border text-black px-4 py-2 shadow-2xs rounded-md hover:bg-blue-700 flex items-center gap- gap-2">
          View All Plans
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
             
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Subscribers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Growth Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.planName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.type === 'month'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {row.type === 'month' ? 'Monthly' : 'Yearly'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.activeSubscribers} Subscribers
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  € {Number(row.revenue).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      row.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {row.growthRate >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {row.growthRate > 0 ? '+' : ''}
                    {row.growthRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;