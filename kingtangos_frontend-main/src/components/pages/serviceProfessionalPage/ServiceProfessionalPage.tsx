// app/service/[id]/service-add-booking/service-professional/page.tsx
"use client"

import { useParams } from 'next/navigation';
import { useGetSingleServiceByIdQuery } from '@/redux/api/servicesApi';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

export default function ServiceProfessionalPage() {
  const params = useParams();
  const itemId = params.id as string;

  const { data: serviceResponse, isLoading, error } = useGetSingleServiceByIdQuery(itemId);

  const service = serviceResponse?.data;

  // const specialists = service?.specialists || [];
  const availableProviders = service?.availableProviders || [];

  const stylists = [
    // {
    //   id: "any",
    //   name: "Any professional",
    //   role: "for maximum availability",
    //   image: any
    // },
    ...availableProviders.map((provider) => ({
      id: provider?.id,
      // serviceMode: service?.serviceMode,
      // serviceProviderType: service?.providerType,
      specialistId: `${provider?.specialistId}`,
      name: `${provider?.name}`,
      role: `${provider?.type}`,
      image: provider?.profilePic?.trim() || null,
      email: `${provider?.email}`,
      owner: `${provider?.isOwner}`,
      specialistData: provider
    }))
  ];

  if (isLoading) {
    return (
      <div className='container mx-auto pb-16 mt-5'>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border rounded-xl p-5">
                <div className="h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
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

  return (
    <div className='container mx-auto py-16'>
      <h3 className='xl:text-4xl lg:text-3xl md:text-2xl text-2xl font-semibold text-primary'>Select professional</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-7">
        {stylists.map((stylist) => (

          <Link
            key={stylist.id}
            href={`/service/${itemId}/service-professional/${stylist.id}`}
          >
            <div className="border hover:border-[#0066FF]/85 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer">
              {stylist.image ? (
                <Image
                  src={stylist.image}
                  height={71}
                  width={71}
                  alt={stylist.name}
                  className="rounded-full object-cover h-20 w-20"
                />
              ) : (
                <FaUserCircle className="text-gray-400" size={64} />
              )}
              <h3 className="text-primary text-lg font-semibold mt-2">{stylist.name}</h3>
              <p className="text-text">{stylist.role}</p>
            </div>
          </Link>

        ))}
      </div>
    </div>
  );
}