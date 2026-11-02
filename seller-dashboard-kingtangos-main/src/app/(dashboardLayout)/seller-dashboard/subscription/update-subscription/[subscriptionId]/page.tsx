import { UpdateSubscriptionPlanForm } from "@/components/dashboardLayout/UpdateSubscriptionPlanForm";


const UpdateSubscriptionPage = ({ params }: { params: { subscriptionId: string } }) => {
    console.log("subscriptionId:", params.subscriptionId);
    return (
        <div>
            <UpdateSubscriptionPlanForm subscriptionId={params.subscriptionId} />
        </div>
    );
};

export default UpdateSubscriptionPage;