'use client';

import React, { useState } from 'react';
import WeeklyAvailability from './components/WeeklyAvailability';
import UpcomingAppointments from './components/UpcomingAppointments';
import { GoGear } from 'react-icons/go';
import { FaPlus } from 'react-icons/fa6';
import CalendarGrid from './components/CalendarGrid';
import Link from 'next/link';
import AvailabilityModal from './components/AvailabilityModal';

const SchedulePage = () => {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="md:p-6 min-h-[calc(100vh-150px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-semibold">Calendar & Schedule</h1>
            <p className="text-sm text-gray-500">Manage your availability and appointments</p>
          </div>
          <div className="flex gap-3 flex-col md:flex-row">
            {/* View Weekly Off Days (Read-only Modal) */}
            <button
              onClick={openModal}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition"
            >
              <GoGear size={18} />
              View Off Days
            </button>

            {/* Block Specific Time (Your Existing Feature) */}
            <Link
              href="/seller-dashboard/schedule/block-time"
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
            >
              <FaPlus size={16} />
              Block Time
            </Link>
          </div>
        </div>

        {/* Main Calendar */}
        <CalendarGrid />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeeklyAvailability />
          <UpcomingAppointments />
        </div>
      </div>

      {/* Read-only Modal: Shows real weekly off days */}
      <AvailabilityModal
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default SchedulePage;