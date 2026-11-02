// app/service/[id]/service-add-booking/page.tsx
"use client"

import { useParams } from 'next/navigation';
import { useGetSingleServiceByIdQuery } from '@/redux/api/servicesApi';
import Link from 'next/link';

export default function ServiceAddBookingPage() {
  const params = useParams();
  const serviceId = params.id as string;

  const { data: serviceResponse, isLoading, error } = useGetSingleServiceByIdQuery(serviceId);
  const service = serviceResponse?.data;

  if (isLoading) {
    return (
      <div className='container mx-auto py-16'>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border rounded-xl mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto py-16'>
        <div className="text-red-500">Error loading service details</div>
      </div>
    );
  }

  const relatedServices = service ? [
    {
      id: service.id,
      specialistId: service.specialists.map(specialist => specialist.id),
      title: service.name,
      duration: service.duration || "Not specified",
      description: service.description || "No description available",
      price: service.price
    },

  ] : [];

  return (
    <div className='container mx-auto py-16'>
      <h3 className='md:text-4xl text-3xl font-semibold text-primary'>Services</h3>
      <h4 className="md:text-2xl text-xl font-semibold text-primary my-6">Feature</h4>

      <div>
        {relatedServices.map((serviceItem) => (
          <Link 
            key={serviceItem.id} 
            href={`/service/${serviceItem.id}/${serviceItem.specialistId}`}
          >
            <div className="p-4 border rounded-xl hover:border-[#0066FF] mb-4 cursor-pointer">
              <h3 className="text-lg font-medium text-primary">{serviceItem.title}</h3>
              <p className="text-text">{serviceItem.duration}</p>
              <p className="text-text">{serviceItem.description}</p>
              <p className="text-lg font-medium">${serviceItem.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}