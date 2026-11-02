"use client";


import ConsultationViewDetails from '@/components/dashboardLayout/Orders&Bookings/ConsultationViewDetails';
import { useParams } from 'next/navigation';

const ConsultationViewPage = () => {
  const params = useParams();
  const consultationViewId = params.consultationViewId as string;
  console.log("consultationViewId:", consultationViewId);

  return (
    <div>
      <ConsultationViewDetails consultationViewId={consultationViewId} />
    </div>
  );
};

export default ConsultationViewPage;