
"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useGetReportAnaliticsStatsQuery } from "@/redux/features/stats/statsApi";

const SalesReports: React.FC = () => {
  const [period] = useState('Monthly'); // Only Monthly supported by API
  const { data, isLoading } = useGetReportAnaliticsStatsQuery();

  // Transform real API data → chart format
  const chartData = React.useMemo(() => {
    if (!data?.data?.monthlyRevenueTrend) return [];
    return data.data.monthlyRevenueTrend.map((item: {month: string, revenue: number}) => ({
      name: item.month,
      sales: Number(item.revenue) || 0,
    }));
  }, [data]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sales Reports</h2>
            <p className="text-gray-600">Sales over time</p>
          </div>
          <div className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm font-medium">
            Monthly
          </div>
        </div>
        <div className="h-96 w-full bg-gray-50 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales Reports</h2>
          <p className="text-gray-600">Sales over time</p>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 text-white"
            disabled
          >
            Monthly
          </button>
          {/* You can re-enable others later when API supports them */}
          {/* <button className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-600">Weekly</button> */}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tickFormatter={(value) => `€${value.toLocaleString()}`}
            stroke="#6b7280"
          />
          <Tooltip
            formatter={(value: number) => `€${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReports;