import AllBookingTable from '@/components/userDashboard/AllBookingTable'
import React from 'react'

export default function AllBooking() {
  return (
    <div className='p-6'>
      <h1 className='font-medium text-primary text-2xl'>My Schedule</h1>
      <AllBookingTable />
    </div>
  )
}
