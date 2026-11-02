import ServiceTable from '@/components/userDashboard/ServiceTable'
import React from 'react'

export default function Service() {
  return (
    <div className='p-6'>
        <h1 className='font-medium text-primary text-2xl'>My Service</h1>
        <ServiceTable />
    </div>
  )
}
