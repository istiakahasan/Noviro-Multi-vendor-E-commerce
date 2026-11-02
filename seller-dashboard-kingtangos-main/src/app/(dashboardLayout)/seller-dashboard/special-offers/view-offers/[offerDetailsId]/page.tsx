"use client";

import OfferDetailsPage from '@/components/dashboardLayout/OfferDetailsPage';
import { useParams } from 'next/navigation';

const ViewOfferDetails = () => {
  const params = useParams();
  const offerViewId = params.offerDetailsId as string;
  console.log("offerDetailsId:", offerViewId);

  return (
    <div>
      <OfferDetailsPage offerViewId={offerViewId} />
    </div>
  );
};

export default ViewOfferDetails;