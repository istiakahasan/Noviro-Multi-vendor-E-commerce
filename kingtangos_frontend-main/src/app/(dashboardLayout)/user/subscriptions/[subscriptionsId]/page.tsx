import SubscriptionsDetailsPage from "@/components/user-dashboard-pages/subscriptionsDetailsPage/SubscriptionsDetailsPage";

interface PageProps {
  params: Promise<{ subscriptionsId: string }>;
}

export default async function SubscriptionsDetails({ params }: PageProps) {
  const { subscriptionsId } = await params;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <SubscriptionsDetailsPage subscriptionsId={subscriptionsId} />
    </div>
  );
}