import PendingOrderTable from '@/components/userDashboard/PendingOrderTable'
import React from 'react'

export default function PendingOrder() {
  return (
    <div className='p-6'>
        <h1 className='font-medium text-primary text-2xl'>Pending Order</h1>
        <PendingOrderTable />
    </div>
  )
}
