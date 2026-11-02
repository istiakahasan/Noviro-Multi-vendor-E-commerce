"use client";

import ConsultationDetailsPage from '@/components/dashboardLayout/ConsultationDetailsPage';
import { useParams } from 'next/navigation';

const ViewConsultationPage = () => {
  const params = useParams();
  const consultationViewId = params.consultationViewId as string;
  console.log("consultation View Id:", consultationViewId);

  return (
    <div>
      <ConsultationDetailsPage consultationViewId={consultationViewId} />
    </div>
  );
};

export default ViewConsultationPage;