/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useMemo, useState } from 'react'
import SalonImg from '@/assets/img/salon.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { MdOutlineAccessTime, MdOutlineBusinessCenter, MdOutlineTimer } from 'react-icons/md'
import { IoLocationSharp } from 'react-icons/io5'
import MapView from '@/components/shared/MapView'
import BookingModal from '@/components/shared/BookingModal'
import { useGetServiceByCategoryQuery, useGetServiceReviewsQuery, useGetSingleServiceByIdQuery } from '@/redux/api/servicesApi'
import ServiceReview from '@/components/shared/review/ServiceReview'
import { AiFillStar } from 'react-icons/ai'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


interface ServicesDetailsPageProps {
  serviceId: string;
}

export default function ServicesDetailsPage({ serviceId }: ServicesDetailsPageProps) {
  const [filters,] = useState<any>({
    categoryId: undefined,
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const { data: serviceResponse, isLoading, error } = useGetSingleServiceByIdQuery(serviceId);
  const service = serviceResponse?.data;

  const { data } = useGetServiceByCategoryQuery(filters);
  const groupedServices = data?.data ?? {};

  const relatedServices = useMemo(() => {
    if (!service) return [];

    const flatServices = Object.values(groupedServices).flat();

    return flatServices.filter(
      (item: any) =>
        item.categoryId === service.categoryId &&
        item.id !== service.id
    );
  }, [groupedServices, service]);


  const { data: reviews } = useGetServiceReviewsQuery(serviceId)

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '';
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return time;
    }
  };

  const rating = Math.floor(service?.averageRating || 0);

  // Format operating hours
  // const getOperatingHours = () => {
  //   if (!service) return '';
  //   return `${formatTime(service.startTime)} - ${formatTime(service.endTime)}`;
  // };

  if (isLoading) {
    return (
      <div className="py-16 container">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="grid grid-cols-12 gap-6 py-7">
            <div className="md:col-span-8 col-span-12 h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-4 col-span-12 space-y-5">
              <div className="h-44 bg-gray-200 rounded"></div>
              <div className="h-44 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="py-16 container">
        <div className="text-center">
          <h1 className="text-2xl text-center font-bold text-red-600">Service Not Found</h1>
          <p className="text-gray-600 mt-2">Unable to load service details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='pb-16 pt-5 md:container'>
      <div className="flex items-center gap-3 md:px-0 px-2">
        <Image src={service.store.logo} alt={service.store.name} height={80} width={80}
          className='rounded-full lg:h-20 lg:w-20 md:h-14 md:w-14 h-10 w-10' />
        <h1 className='font-bold text-primary xl:text-5xl lg:text-4xl md:text-3xl text-2xl'>
          {service.store.name}
        </h1>
      </div>


      <div className="grid grid-cols- gap-6 py-7 items-center">
        <div className=''>
          <Image
            src={service.profilePic || SalonImg}
            height={400}
            width={1420}
            alt={service.store.name}
            className="w-full h-[600] object-cover rounded-lg"
          />
        </div>
        {/* <div className='md:col-span-4 col-span-12 space-y-5'>
          <Image
            src={service.profilePic || service.store.logo || SalonImg}
            height={304}
            width={460}
            alt={service.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Image
            src={service.store.logo || service.profilePic || SalonImg}
            height={304}
            width={460}
            alt={`${service.store.name} logo`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div> */}
      </div>

      <div className="grid grid-cols-6 gap-6 py-7 md:px-0 px-2">
        {/* <div className="lg:col-span-8 md:col-span-7 col-span-12">
          <BookServices />
        </div> */}

        <div className="lg:col-span-4 md:col-span-5 col-span-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Header Section */}
            <div className="mb-4">
              <h3 className="lg:text-2xl md:text-xl text-lg font-bold text-gray-900 tracking-tight">{service?.name}</h3>
              <p className="text-gray-600 mt-2 md:text-base text-sm leading-relaxed">{service?.description}</p>
            </div>

            {/* Rating Section */}
            <div className="flex items-center gap-3 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {rating > 0 ? (
                    Array.from({ length: rating }, (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}

                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {service?.averageRating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-blue-600 text-sm font-medium">
                ({service?.totalReviews ?? 0} reviews)
              </span>
            </div>

            {/* Details Grid */}
            <div className="py-4 space-y-3">
              {/* Status & Time */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <MdOutlineAccessTime className="text-xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-gray-900 font-medium">
                    <span className="text-green-600">Open</span> • Until {formatTime(service?.endTime)}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MdOutlineTimer className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-gray-900 font-medium">{service.duration}</p>
                </div>
              </div>

              {/* Service Mode */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MdOutlineBusinessCenter className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Mode</p>
                  <p className="text-gray-900 font-medium">{service?.serviceMode}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <IoLocationSharp className="text-xl text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium text-sm">{service?.store?.location}</p>
                </div>
              </div>
            </div>

            {/* Footer - Price & CTA */}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Starting from</p>
                <p className="lg:text-3xl md:text-2xl text-xl font-bold text-primary">€{service?.price}</p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 py-5 text-base font-semibold shadow-sm hover:shadow-sm transition-all duration-300"
                onClick={handleOpenModal}
              >
                Book Now
              </Button>
            </div>
          </div>

          <BookingModal
            open={isModalOpen}
            onClose={handleCloseModal}
            service={service}
          />
        </div>
      </div>

      <ServiceReview
        serviceId={serviceId}
        reviews={reviews} />

      <div className="py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MapView lat={50.8695} lng={11.0990} />
        </div>

        <div className='md:px-2 px-2'>
          <h3 className='lg:text-2xl md:text-xl text-lg font-semibold text-primary'>About Us</h3>
          <p className='text-text md:text-base text-sm'>{service?.store?.description}</p>

          <div className="flex gap-3 text-text py-3">
            <IoLocationSharp className='text-2xl flex-shrink-0' />
            <p className='text-sm w-full'>{service?.store?.location}</p>
          </div>

          {service?.tags && service.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-primary mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {service?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


      {relatedServices.length > 0 && (
        <div className='py-9 md:px-0 px-2'>
          <h3 className='lg:text-2xl md:text-xl text-lg font-semibold text-primary'>
            Our Other Services
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5">
            {relatedServices.slice(0, 4).map((serviceItem: any, idx: any) => (
              <article
                key={serviceItem.id}
                onClick={() => router.push(`/service/${serviceItem.id}`)}
                className="cursor-pointer group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md p-5"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={serviceItem?.profilePic || "/placeholder.svg"}
                    alt={serviceItem?.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover rounded-lg"
                    loading={idx < 4 ? "eager" : "lazy"}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="pointer-events-auto mb-3 w-full px-3">
                      <Link href={`/service/${serviceItem.id}`} key={serviceItem.id}>
                        <button
                          className="w-full rounded-md bg-neutral-900/90 py-2 text-center text-sm font-medium text-white shadow-md hover:bg-neutral-900 transition-colors"
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 pb-4 pt-3">
                  <span className="text-sm font-semibold text-gray-800">
                    {serviceItem.name}
                  </span>

                  <span className="inline-flex items-center gap-1 text-base text-gray-600">
                    <AiFillStar className="text-xl text-yellow-600" />
                    {serviceItem.averageRating.toFixed(1)} ({serviceItem.totalReviews})
                  </span>
                  <p className='py-3'>{serviceItem.location}</p>

                  <div className="text-lg font-semibold mt-4">
                    € {serviceItem.price}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}