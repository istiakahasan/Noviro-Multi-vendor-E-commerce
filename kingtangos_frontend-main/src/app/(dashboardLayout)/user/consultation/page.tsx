// import SubscriptionDetailsPage from '@/components/pages/Subscription/SubscriptionDetailsPage'
import ConsultationTable from '@/components/userDashboard/ConsultationTable'
import React from 'react'

export default function SubscriptionsDetails() {
  return (
    <div className='p-6'>
      <h1 className='font-medium text-primary text-2xl'>My Consultation</h1>
        <ConsultationTable />
    </div>
  )
}
