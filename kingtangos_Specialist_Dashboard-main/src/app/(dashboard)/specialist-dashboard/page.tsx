"use client";

import React from 'react';
import StatisticsCards from './_components/StatisticsCards';
import TodaysSchedule from './_components/TodaysSchedule';
import NextBookingTimer from './_components/NextBookingTimer';
import DashboardCalendarSection from './_components/DashboardCalendarSection';
import PageLoading from '@/components/ui/Loading';
import { useGetUserQuery } from '@/lib/api/users/userApi';
const HomePage = () => {

    const { data, isLoading, isError } = useGetUserQuery();


  if (isLoading) return <PageLoading/> ;
  if (isError) return <div>something went wrong</div>;
 console.log(data);
 const Name = data?.data.firstName  + " " + data?.data.lastName  || "Specialist";
console.log(Name);


  return (
    <div className='min-h-[calc(100vh-150px)]'>
    <div className="p-4  border  rounded-2xl max-w-7xl mx-auto border-gray-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#030213] to-[#155DFC] text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold mb-1">Welcome back, {Name}!</h1>
        <p className="text-blue-100">Track today&apos;s bookings, consultations, and performance at a glance.</p>
      </div>

      <div>
        {/* Statistics Cards */}
        <StatisticsCards/>
      </div>

      {/* Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule List */}
        <div className="lg:col-span-2">
          <TodaysSchedule/>
        </div>

        {/* Right Side: View All and Timer + Calendar */}
        <div className="space-y-6">
         

        <NextBookingTimer/>

        

          {/* Calendar */}
          <div className="bg-white-  rounded-lg">
            <DashboardCalendarSection/>
            {/* <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">&lt;</span>
              <h4 className="text-sm font-semibold">August 2025</h4>
              <span className="text-sm text-gray-500">&gt;</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((day) => (
                <div
                  key={day}
                  className={`p-1 text-sm rounded ${
                    day === 23 ? 'bg-blue-600 text-white' : day === 24 ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;