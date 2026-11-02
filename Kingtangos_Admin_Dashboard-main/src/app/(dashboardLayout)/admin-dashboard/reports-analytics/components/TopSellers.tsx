// import React from 'react';
// import { TrendingUp, Star } from 'lucide-react';
// import { useGetTopSellerQuery } from '@/redux/features/withdrawalRequest/withdrawalApi';

// // 1. Data Structure Interface
// interface Seller {
//   rank: number;
//   name: string;
//   revenue: string;
//   orders: string;
//   rating: number;
//   growth: string; // e.g., '12%'
// }

// // 2. Dummy Data
// const topSellers: Seller[] = [
//   { rank: 1, name: 'Tech Haven', revenue: '$145,600', orders: '1,247', rating: 4.9, growth: '12%' },
//   { rank: 2, name: 'Fashion Forward', revenue: '$128,900', orders: '1,098', rating: 4.8, growth: '8%' },
//   { rank: 3, name: 'Home Essentials', revenue: '$112,300', orders: '956', rating: 4.7, growth: '15%' },
//   { rank: 4, name: 'Beauty Bar', revenue: '$98,700', orders: '842', rating: 4.9, growth: '10%' },
//   { rank: 5, name: 'Sports Pro', revenue: '$87,200', orders: '721', rating: 4.6, growth: '3%' },
// ];

// // 3. Growth Indicator Component (Local)
// const GrowthIndicator: React.FC<{ growth: string }> = ({ growth }) => {



//   // Styles to match the green pill in the image
//   const wrapperClasses =
//     'inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20';

//   return (
//     <div className={wrapperClasses}>
//       {/* Lucide TrendingUp Icon */}
//       <TrendingUp className="w-3.5 h-3.5 text-green-500 mr-1 stroke-2" />
//       {growth}
//     </div>
//   );
// };

// // 4. Rank Badge Component (Local)
// const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
//     // Styles to match the blue circle in the image
//     const colorClasses = 'bg-blue-100 text-blue-700';

//     return (
//         <div 
//             className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${colorClasses}`}
//         >
//             {rank}
//         </div>
//     );
// };

// // 5. Main Component
// const TopSellers: React.FC = () => {

// const {data,isLoading,isError} = useGetTopSellerQuery();

// console.log(data);




//   return (
//     // Card container matching the image: white background, rounded edges, shadow, border
//     <div className=" shadow-sm rounded-xl w-full border border-gray-100 font-sans">
      
//       {/* Header Section */}
//       <div className="px-6 pt-5 pb-3">
//         <h2 className="text-xl font-semibold text-gray-900">Top Sellers</h2>
//         <p className="mt-0.5 text-sm text-gray-500">Leading performers this month</p>
//       </div>

//       {/* Table Container */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
          
//           {/* Table Header */}
//           <thead>
//             <tr className="bg-gray-50"> 
//               {['Rank', 'Seller Name', 'Revenue', 'Orders', 'Rating', 'Growth'].map((header) => (
//                 <th
//                   key={header}
//                   scope="col"
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
          
//           {/* Table Body */}
//           <tbody className="bg-white divide-y divide-gray-200">
//             {topSellers.map((seller) => (
//               <tr key={seller.rank} className="hover:bg-gray-50 transition-colors">
                
//                 {/* Rank */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-1/12">
//                   <RankBadge rank={seller.rank} />
//                 </td>
                
//                 {/* Seller Name (Bold/Medium font weight) */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 w-3/12">
//                   {seller.name}
//                 </td>
                
//                 {/* Revenue */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-2/12">
//                   {seller.revenue}
//                 </td>
                
//                 {/* Orders */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-2/12">
//                   {seller.orders}
//                 </td>
                
//                 {/* Rating */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-2/12">
//                   <div className="flex items-center">
//                     {/* Lucide Star Icon (filled and colored yellow to match the image) */}
//                     <Star 
//                         className="w-4 h-4 text-yellow-500 mr-1" 
//                         fill="currentColor" // Fill the icon with the text color
//                         strokeWidth={0} // Remove the stroke border
//                     />
//                     {seller.rating.toFixed(1)}
//                   </div>
//                 </td>
                
//                 {/* Growth */}
//                 <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 w-2/12">
//                   <GrowthIndicator growth={seller.growth} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TopSellers;



"use client";

import React from "react";
import { TrendingUp, Star } from "lucide-react";
import { useGetTopSellerQuery } from "@/redux/features/withdrawalRequest/withdrawalApi";
import Image from "next/image";

// Top Seller Interface (from API)
interface TopSeller {
  id: string;
  name: string;
  logo: string;
  revenue: number;
  orders: number;
  rating: number;
  growth: number;
}

// Skeleton Loader Component
const TableSkeleton: React.FC = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="animate-pulse">
        <td className="px-6 py-3">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-20 rounded bg-gray-200"></div>
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-16 rounded bg-gray-200"></div>
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-10 rounded bg-gray-200"></div>
        </td>
        <td className="px-6 py-3">
          <div className="h-4 w-12 rounded bg-gray-200"></div>
        </td>
      </tr>
    ))}
  </>
);

// Growth Indicator
const GrowthIndicator: React.FC<{ growth: number }> = ({ growth }) => {
  const wrapperClasses =
    "inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20";
  return (
    <div className={wrapperClasses}>
      <TrendingUp className="w-3.5 h-3.5 text-green-500 mr-1 stroke-2" />
      {growth}%
    </div>
  );
};

// Main Component
const TopSellers: React.FC = () => {
  const { data, isLoading, isError } = useGetTopSellerQuery();
  const sellers: TopSeller[] = data?.data || [];

  return (
    <div className="shadow-sm rounded-xl w-full border border-gray-100 font-sans">
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-xl font-semibold text-gray-900">Top Sellers</h2>
        <p className="mt-0.5 text-sm text-gray-500">Leading performers this month</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {["Seller", "Revenue", "Orders", "Rating", "Growth"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  Error loading top sellers
                </td>
              </tr>
            ) : sellers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                  No top sellers found
                </td>
              </tr>
            ) : (
              sellers.map((seller, index) => (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  {/* Seller Logo + Name */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 flex items-center gap-3">
                    <Image
                      src={seller.logo}
                      alt={seller.name}
                      width={10}
                      height={10}
                      loading='lazy'
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">{seller.name}</span>
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    €{seller.revenue.toLocaleString()}
                  </td>

                  {/* Orders */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    {seller.orders.toLocaleString()}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" strokeWidth={0} />
                      {seller.rating.toFixed(1)}
                    </div>
                  </td>

                  {/* Growth */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                    <GrowthIndicator growth={seller.growth} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellers;
