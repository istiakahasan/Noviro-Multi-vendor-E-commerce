"use client";

import SpecialistDetailsPage from '@/components/dashboardLayout/SpecialistDetailsPage';
import { useParams } from 'next/navigation';

const ViewSpecialistPage = () => {
  const params = useParams();
  const specialistViewId = params.specialistViewId as string;
  console.log("specialist View Id:", specialistViewId);

  return (
    <div>
      <SpecialistDetailsPage specialistViewId={specialistViewId} />
    </div>
  );
};

export default ViewSpecialistPage;