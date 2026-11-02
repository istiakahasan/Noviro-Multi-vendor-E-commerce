
import CompleteOrderTable from '@/components/userDashboard/CompleteOrderTable'
import React from 'react'

export default function CompleteOrder() {
  return (
        <div className='p-6'>
            <h1 className='font-medium text-primary text-2xl'>Return Order</h1>
           <CompleteOrderTable />
        </div>
  )
}
