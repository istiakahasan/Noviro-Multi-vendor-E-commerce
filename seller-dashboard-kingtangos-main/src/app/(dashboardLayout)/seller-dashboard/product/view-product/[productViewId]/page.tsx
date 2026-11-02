"use client";

import ProductDetailsPage from '@/components/dashboardLayout/ProductDetailsPage';
import { useParams } from 'next/navigation';

const ViewProductPage = () => {
  const params = useParams();
  const productViewId = params.productViewId as string;
  console.log("adsId:", productViewId);

  return (
    <div>
      <ProductDetailsPage productViewId={productViewId} />
    </div>
  );
};

export default ViewProductPage;