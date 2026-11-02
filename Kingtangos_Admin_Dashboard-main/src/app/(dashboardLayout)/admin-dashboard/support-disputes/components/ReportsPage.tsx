// "use client";
// // src/components/Pages/ReportsPage.tsx
// import React from 'react';
// import {
//   PieChart, Pie, Cell, Tooltip as ReTooltip,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
// } from 'recharts';
// import { TrendingUp } from 'lucide-react';

// // StatCard Component
// interface StatCardProps {
//   icon: React.ReactNode;
//   title: string;
//   value: string | number;
//   change: string;
//   changeType: 'positive' | 'negative';
//   color: string;
// }


// // PerformanceCard Component
// interface PerformanceCardProps {
//   percentage: number;
//   label: string;
//   color: string
// }
// const PerformanceCard: React.FC<PerformanceCardProps> = ({ percentage,color, label }) => (
//   <div className="bg-[#F4F4F4] rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
//     <p className={`text-2xl font-bold ${color}`}>{percentage}%</p>
//     <p className="text-[#6D6D6D] mt-1">{label}</p>
//   </div>
// );

// // ComplaintPieChart Component
// interface ComplaintPieChartProps {
//   data: { name: string; value: number; fill: string }[];
//   title: string;
// }
// const ComplaintPieChart: React.FC<ComplaintPieChartProps> = ({ data, title }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm">
//     <p className="font-semibold mb-4">{title}</p>
//     <PieChart width={300} height={300}>
//       <Pie
//         data={data}
//         dataKey="value"
//         nameKey="name"
//         cx="50%"
//         cy="50%"
//         outerRadius={80}
//         label
//       >
//         {data.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill={entry.fill} />
//         ))}
//       </Pie>
//       <ReTooltip />
//     </PieChart>
//   </div>
// );

// // ResolutionBarChart Component
// interface ResolutionBarChartProps {
//   data: { month: string; resolved: number; opened: number }[];
//   title: string;
// }
// const ResolutionBarChart: React.FC<ResolutionBarChartProps> = ({ data, title }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm">
//     <p className="font-semibold mb-4">{title}</p>
//     <BarChart width={500} height={300} data={data}>
//       <CartesianGrid strokeDasharray="3 3" />
//       <XAxis dataKey="month" />
//       <YAxis />
//       <ReTooltip />
//       <Legend />
//       <Bar dataKey="resolved" fill="#10b981" />
//       <Bar dataKey="opened" fill="#ef4444" />
//     </BarChart>
//   </div>
// );

// // Main ReportsPage
// import { ComplaintDataPoint, ResolutionDataPoint } from '@/types/global';

// const ReportsPage: React.FC = () => {
//   const resolutionData: ResolutionDataPoint[] = [
//     { month: 'Jan', resolved: 90, opened: 70 },
//     { month: 'Feb', resolved: 70, opened: 40 },
//     { month: 'Mar', resolved: 60, opened: 45 },
//     { month: 'Apr', resolved: 75, opened: 55 },
//     { month: 'May', resolved: 70, opened: 50 },
//   ];

//   const complaintData: ComplaintDataPoint[] = [
//     { name: 'Product Quality', value: 55, fill: '#3b82f6' },
//     { name: 'Delivery Issues', value: 25, fill: '#ec4899' },
//     { name: 'Refund Requests', value: 20, fill: '#a78bfa' },
//     { name: 'Service Quality', value: 15, fill: '#facc15' },
//     { name: 'Billing Issue', value: 5, fill: '#f59e0b' },
//   ];

//   return (
//     <div className="space-y-6">
      

//       {/* Charts Row */}
//       <div className="grid grid-cols-2 gap-6">
//         <ComplaintPieChart data={complaintData} title="Complaint Types Distribution" />
//         <ResolutionBarChart data={resolutionData} title="Resolution Trends" />
//       </div>

//       {/* Performance Row */}
//       <div className=" border p-5 rounded-2xl">
//             <h1 className='p-4 text-xl font-bold'>Resolution Performance</h1>       
//         <div className='grid grid-cols-3 gap-6 '>

//         <PerformanceCard percentage={92} label="Resolution Rate" color="text-orange-500" />
//         <PerformanceCard percentage={92} label="Resolution Rate" color="text-green-500" />
//         <PerformanceCard percentage={92} label="Resolution Rate" color="text-blue-500" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportsPage;



"use client";

import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
// import { TrendingUp } from 'lucide-react';
import { ComplaintDataPoint, ResolutionDataPoint } from '@/types/global';

// -------------------- Components --------------------

// PerformanceCard Component
interface PerformanceCardProps {
  percentage: number;
  label: string;
  color: string;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ percentage, color, label }) => (
  <div className="bg-[#F4F4F4] rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
    <p className={`text-2xl font-bold ${color}`}>{percentage}%</p>
    <p className="text-[#6D6D6D] mt-1">{label}</p>
  </div>
);

// ComplaintPieChart Component
interface ComplaintPieChartProps {
  data: { name: string; value: number; fill: string }[];
  title: string;
}

const ComplaintPieChart: React.FC<ComplaintPieChartProps> = ({ data, title }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <p className="font-semibold mb-4">{title}</p>
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
      <ReTooltip />
    </PieChart>
  </div>
);

// ResolutionBarChart Component
interface ResolutionBarChartProps {
  data: { month: string; resolved: number; opened: number }[];
  title: string;
}

const ResolutionBarChart: React.FC<ResolutionBarChartProps> = ({ data, title }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <p className="font-semibold mb-4">{title}</p>
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <ReTooltip />
      <Legend />
      <Bar dataKey="resolved" fill="#10b981" />
      <Bar dataKey="opened" fill="#ef4444" />
    </BarChart>
  </div>
);

// -------------------- Main ReportsPage --------------------

const ReportsPage: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // ✅ Ensure chart only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const resolutionData: ResolutionDataPoint[] = [
    { month: 'Jan', resolved: 90, opened: 70 },
    { month: 'Feb', resolved: 70, opened: 40 },
    { month: 'Mar', resolved: 60, opened: 45 },
    { month: 'Apr', resolved: 75, opened: 55 },
    { month: 'May', resolved: 70, opened: 50 },
  ];

  const complaintData: ComplaintDataPoint[] = [
    { name: 'Product Quality', value: 55, fill: '#3b82f6' },
    { name: 'Delivery Issues', value: 25, fill: '#ec4899' },
    { name: 'Refund Requests', value: 20, fill: '#a78bfa' },
    { name: 'Service Quality', value: 15, fill: '#facc15' },
    { name: 'Billing Issue', value: 5, fill: '#f59e0b' },
  ];

  if (!isClient) {
    // ⏳ Prevent SSR crash
    return <div className="text-center p-10 text-gray-500">Loading charts...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <ComplaintPieChart data={complaintData} title="Complaint Types Distribution" />
        <ResolutionBarChart data={resolutionData} title="Resolution Trends" />
      </div>

      {/* Performance Row */}
      <div className="border p-5 rounded-2xl">
        <h1 className="p-4 text-xl font-bold">Resolution Performance</h1>
        <div className="grid grid-cols-3 gap-6">
          <PerformanceCard percentage={92} label="Resolution Rate" color="text-orange-500" />
          <PerformanceCard percentage={88} label="Response Rate" color="text-green-500" />
          <PerformanceCard percentage={95} label="Customer Satisfaction" color="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
