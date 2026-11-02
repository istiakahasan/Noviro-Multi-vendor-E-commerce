"use client";

import ServiceViewDetails from '@/components/dashboardLayout/Orders&Bookings/ServiceViewDetails';
import { useParams } from 'next/navigation';

const ServiceViewPage = () => {
  const params = useParams();
  const serviceViewId = params.serviceViewId as string;
  console.log("serviceViewId:", serviceViewId);

  return (
    <div>
      <ServiceViewDetails serviceViewId={serviceViewId} />
    </div>
  );
};

export default ServiceViewPage;