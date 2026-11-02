
import ShippedOrderTable from '@/components/userDashboard/ShippedOrderTable'
import React from 'react'

export default function ShippedOrder() {
  return (
    <div className='p-6'>
      <h1 className='font-medium text-primary text-2xl'>Return Order</h1>
      <ShippedOrderTable />
    </div>
  )
}
