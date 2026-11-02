"use client";

import { useParams } from "next/navigation";
import ServicesDetailsPage from "../(components)/ServicesDetailsPage";

export default function ServicesDetails() {
  // Get the service ID from the URL params
  const params = useParams();
  const serviceId = params.id as string; // Assuming your route is like /services/[id]

  // If you're using App Router, you can also use:
  // const { id } = useParams();

  return (
    <div className="bg-background">
      <ServicesDetailsPage serviceId={serviceId} />
    </div>
  );
}
