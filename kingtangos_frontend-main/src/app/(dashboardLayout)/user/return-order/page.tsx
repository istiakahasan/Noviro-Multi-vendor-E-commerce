
import React from 'react'
import ReturnOrderTable from '@/components/userDashboard/ReturnOrderTable'

export default function ReturnOrder() {
  return (
    <div className='p-6'>
      <h1 className='font-medium text-primary text-2xl'>Return Order</h1>
        <ReturnOrderTable />
    </div>
  )
}