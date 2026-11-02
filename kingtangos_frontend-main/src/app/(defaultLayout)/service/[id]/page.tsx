"use client"

import ServicesDetailsPage from '@/components/pages/servicesDetails/ServicesDetailsPage'
import React from 'react'
import { useParams } from 'next/navigation'

export default function ServicesDetails() {

  const params = useParams();
  const serviceId = params.id as string;

  // If you're using App Router, you can also use:
  // const { id } = useParams();

  return (
    <div className='bg-background'>
        <ServicesDetailsPage serviceId={serviceId} />
    </div>
  )
}