import ServiceDetailsPage from "@/components/user-dashboard-pages/serviceDetailsPage/ServiceDetailsPage";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function ServiceDetails({ params }: PageProps) {
  const { serviceId } = await params;
  return (
    <div className="p-6">
      <ServiceDetailsPage serviceId={serviceId} />
    </div>
  );
}